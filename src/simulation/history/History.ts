import Undo from './Undo';
import Redo from './Redo';

class History {
    private undos: Undo[] = [];
    private redos: Redo[] = [];

    appendUndo(undo: Undo): void {
        this.redos.splice(0);
        this.undos.push(undo);
    }

    undo(): void {
        const redo = this.undos.pop()?.undo();
        if (redo) {
            this.redos.push(redo);
        }
    }

    redo(): void {
        const undo = this.redos.pop()?.redo();
        if (undo) {
            this.undos.push(undo);
        }
    }
}

export default History;
