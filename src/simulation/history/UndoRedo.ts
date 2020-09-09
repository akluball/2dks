import Undo from './Undo';
import Redo from './Redo';

interface UndoRedo extends Undo, Redo {
}

interface Action {
    (): void;
}

export class UndoRedoBuilder {
    private history: UndoRedo & { undoActions: Action[], redoActions: Action[] } = {
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

    undoAction(action: Action): UndoRedoBuilder {
        this.history.undoActions.push(action);
        return this;
    }

    redoAction(action: Action): UndoRedoBuilder {
        this.history.redoActions.push(action);
        return this;
    }

    build(): UndoRedo {
        return this.history;
    }
}
