/**
* Represents a two-dimensional orthogonal grid of square cells that have 
* two states. Indices are in (row, column) order and begin in the top-left corner
* at (0,0). Use the `fromBooleanArray` or `fromSize` factory methods to get an instance.
* ```
* ________________________
* | 0,0 | 0,1 | 0,2 | 0,3|
* | 1,0 | 1,1 | 1,2 | 1,3|
* | 2,0 | 2,1 | 2,2 | 2,3|
* | 3,0 | 3,1 | 3,2 | 3,3|
* ------------------------
* ```
*/
export class GameBoard {
    /**
    * Represents the state of the board.
    */
    private _board: boolean[][];
    
    /**
    * Factory method to create a GameBoard from a representative boolean array.
    * @param {boolean[][]} initialBoard - The initial board state. 
    * `true` represents live cells, `false` dead ones.
    * @returns A GameBoard with the same state as `initialBoard`
    */
    static fromBooleanArray(initialBoard: boolean[][]): GameBoard {
        if (initialBoard == undefined) {
            throw new TypeError("The game board must be defined.");
        }
        if (initialBoard.length < 1) {
            throw new RangeError("The game board must have at least one row.");
        }
        let board: GameBoard = new GameBoard();
        board._board = [];
        for (let row: number = 0; row < initialBoard.length; row++) {
            board._board.push([]);
            if (initialBoard[row] == undefined || initialBoard[row].length < 1) {
                throw new RangeError("All rows must have at least one cell."); 
            }
            for (let col: number = 0; col < initialBoard[row].length; col++) {
                let value: boolean = initialBoard[row][col];
                if (value == undefined) {
                    throw new RangeError(`All cells must be true or false. Invalid cell value at (${row}, ${col}): ${value}.`)
                }
                board._board[row].push(initialBoard[row][col]);
            }
        }
        return board;
    }
    
    /**
    * Creates a `boolean[][]` from a GameBoard. `true` represents live cells, `false` dead ones
    * @returns A boolean[][] with the same state as this GameBoard
    */
    toBooleanArray() : boolean[][] {
        let result : boolean[][] = [];
        for (let row : number = 0; row < this._board.length; row++) {
            let newRow : boolean[] = [];
            this._board[row].forEach((cell) => {newRow.push(cell)})
            result.push(newRow);
        }
        return result;
    }
    
    /**
    * Factory method to create an GameBoard of the given size using a single initial value
    * @param {number} rows - The number of rows to create.
    * @param {number} columns - The number of cells in each row.
    * @param {bolean} initialValue - Initial value for all cells in the new GameBoard.
    * @returns A GameBoard of the specified size with each cell set to `initialValue`
    */ 
    static fromSize(rows: number, columns: number, initialValue: boolean = false): GameBoard {
        if (rows < 1 || columns < 1) {
            throw new RangeError("A game board must have at least 1 row and 1 column.");
        }
        let board: GameBoard = new GameBoard();
        board._board = [];
        for (let row: number = 0; row < rows; row++) {
            let newRow: boolean[] = [];
            
            for (let col: number = 0; col < columns; col++) {
                newRow.push(initialValue);
            }
            board._board.push(newRow);
        }
        return board;
    }
    
    /**
    * Not for public use.
    */
    private constructor() {
    }

    /**
    * Set the state of the cell at [row][column]
    * @param {number} row - The row of the cell to be written to.
    * @param {number} column - The column of the cell to be written to.
    * @param {boolean} value - The value to write to the cell.
    * @throws **RangeError** if the given position is out of range.
    */
    set(row: number, column: number, value: boolean) {
        this._checkRange("Row", row);
        this._checkRange("Column", column, this._board[row].length);

        this._board[row][column] = value;
    }

    /**
    * Read the state of the cell at [row][column]
    * @param {number} row - The row of the cell to read.
    * @param {number} column - The column of the cell to read.
    * @param {boolean} defaultValue - The default value to return if the given
    * position is out of range. If not set, a RangeError will be thrown instead.
    * @returns The value at [row][column], or defaultValue when out 
    * of range.
    * @throws **RangeError** if the given position is out of range and no
    * defaultValue is specified.
    */
    get(row: number, column: number, defaultValue?: boolean) {

        try {
            this._checkRange("Row", row);
            this._checkRange("Column", column, this._board[row].length);
            return this._board[row][column];
        } catch (e) {
            if (defaultValue === undefined) {
                throw e;
            } else {
                return defaultValue;
            }
        }
    }

    /**
    * Get the number of rows on this board.
    * @returns The number of rows on the board. Valid row indices are in
    * [0, result).
    */
    getRowCount(): number {
        return this._board.length;
    }

    /**
    * Get the length (number of columns) in a given row.
    * @returns The number of columns in the given row. Valid column
    * indices are in [0, result)
    */
    getRowLength(row: number): number {
        this._checkRange("Row", row);
        return this._board[row].length;
    }

    /**
    * Helper method to validate a number against a range.
    * @param {string} indexType - A human readable description of the type of
    * index that is being checked.
    * @param {number} value - The value to check.
    * @param {number} max - The maximum value (exclusive) of the range.
    * @param {number} min - The minimum value (inclusive) of the range.
    * @throws **RangeError** if `value` is not in the range [min, max). 
    */
    private _checkRange(indexType: string, value: number, max: number = this.getRowCount(), min: number = 0): void {
        if (value >= min && value < max) {
            return;
        }
        throw new RangeError(
            `${indexType} Index out of bounds. Expected a value satisfying ` +
            `${min} <= x < ${max}. Got ${value}`
        );
    }
}
