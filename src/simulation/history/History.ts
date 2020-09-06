import Undo from './Undo';
import Redo from './Redo';

interface History extends Undo, Redo {
}

interface Action {
    (): void;
}

export class HistoryBuilder {
    private history: History & { undoActions: Action[], redoActions: Action[] } = {
        undoActions: [],
        redoActions: [],
        undo(): Redo {
            this.undoActions.forEach(action => {
                action();
            });
            return this;
        },
        redo(): Undo {
            this.redoActions.forEach(action => {
                action();
            });
            return this;
        }
    };

    undoAction(action: Action): HistoryBuilder {
        this.history.undoActions.push(action);
        return this;
    }

    redoAction(action: Action): HistoryBuilder {
        this.history.redoActions.push(action);
        return this;
    }

    build(): History {
        return this.history;
    }
}
