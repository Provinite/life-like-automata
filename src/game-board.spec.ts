import { GameBoard } from './game-board';
import { expect } from 'chai';
import 'mocha';

describe("GameBoard", () => {
    describe("FromSize", () => {
        it('should throw a RangeError when attempting to construct with a size less than 1 in any dimension.', () => {
            expect(() => { GameBoard.fromSize(0, 0); }).to.throw(RangeError);
            expect(() => { GameBoard.fromSize(-1, 1); }).to.throw(RangeError);
            expect(() => { GameBoard.fromSize(2, -1); }).to.throw(RangeError);
        });
        it('should not error when attempting to construct with a size greater than 0 in every dimension.', () => {
            expect(() => { GameBoard.fromSize(1, 1); }).to.not.throw();
            expect(() => { GameBoard.fromSize(1, 2); }).to.not.throw();
            expect(() => { GameBoard.fromSize(2, 1); }).to.not.throw();
            expect(() => { GameBoard.fromSize(2, 2); }).to.not.throw();
        });

        it('should initialize to the given rectangular size.', () => {
            let numRows: number = 5;
            let numColumns: number = 10;
            let board: GameBoard = GameBoard.fromSize(numRows, numColumns);
            expect(board.getRowCount()).to.equal(numRows);
            for (let i: number = 0; i < numRows; i++) {
                expect(board.getRowLength(i)).to.equal(numColumns);
            }
        });

        it('should initialize to all false by default.', () => {
            let numRows: number = 5;
            let numColumns: number = 10;
            let board: GameBoard = GameBoard.fromSize(numRows, numColumns);
            for (let i: number = 0; i < board.getRowCount(); i++) {
                for (let j: number = 0; j < board.getRowLength(i); j++) {
                    expect(board.get(i, j), `board(${i},${j})`).to.equal(false);
                }
            }
        });

        it('should initialize to the specified defaultValue if given.', () => {
            let numRows: number = 5;
            let numColumns: number = 10;
            let board: GameBoard = GameBoard.fromSize(numRows, numColumns, true);
            for (let i: number = 0; i < board.getRowCount(); i++) {
                for (let j: number = 0; j < board.getRowLength(i); j++) {
                    expect(board.get(i, j), `board(${i},${j})`).to.equal(true);
                }
            }
        });
    })

    describe("FromBooleanArray", () => {
        let sampleBoolArray: boolean[][] = [
            [1, 0, 0, 0],
            [0, 1, 1, 1],
            [1, 1, 1, 1, 1]
        ].map((r) => r.map((c) => c ? true : false));

        it('should initialize with the same size as the provided array.', () => {
            let board: GameBoard = GameBoard.fromBooleanArray(sampleBoolArray);
            expect(board.getRowCount()).to.equal(sampleBoolArray.length);
            for (let i: number = 0; i < sampleBoolArray.length; i++) {
                expect(board.getRowLength(i)).to.equal(sampleBoolArray[i].length);
            }
        });

        it('should initialize with the same content as the provided array.', () => {
            let board: GameBoard = GameBoard.fromBooleanArray(sampleBoolArray);
            for (let i: number = 0; i < sampleBoolArray.length; i++) {
                for (let j: number = 0; j < sampleBoolArray[i].length; j++) {
                    expect(board.get(i, j)).to.equal(sampleBoolArray[i][j]);
                }
            }
        });

        it('should throw a RangeError if any cell is undefined or null', () => {
            let badData: boolean[][] = [
                [true, false, true, true],
                [false, false, false, true],
                [undefined, false, false, true]
            ];

            expect(() => GameBoard.fromBooleanArray(badData)).to.throw(RangeError);

            badData[2][0] = null;
            expect(() => GameBoard.fromBooleanArray(badData)).to.throw(RangeError);

        });

        it('should throw a RangeError if any row is null, undefined, or empty', () => {
            let badData: boolean[][] = [
                [true, false, true, true],
                null
            ];
            expect(() => GameBoard.fromBooleanArray(badData)).to.throw(RangeError);

            badData[1] = undefined;
            expect(() => GameBoard.fromBooleanArray(badData)).to.throw(RangeError);

            badData[1] = [];
            expect(() => GameBoard.fromBooleanArray(badData)).to.throw(RangeError);
        });

        it('should throw a RangeError if the array has zero rows', () => {
            let badData: boolean[][] = [];
            expect(() => GameBoard.fromBooleanArray(badData)).to.throw(RangeError);
        })

        it('should throw a TypeError if the array is undefined or null', () => {
            expect(() => GameBoard.fromBooleanArray(undefined)).to.throw(TypeError);
            expect(() => GameBoard.fromBooleanArray(null)).to.throw(TypeError);
        });
    });

    it('should represent writes on sequential reads.', () => {
        let board: GameBoard = GameBoard.fromSize(3, 3, false);
        expect(board.get(0, 0), "board(0,0)").to.equal(false);
        board.set(0, 0, true);
        expect(board.get(0, 0), "board(0,0)").to.equal(true);
    });

    describe(".get()", () => {
        it('should return the specified default value when we attempt to read out of range indices.', () => {
            let board: GameBoard = GameBoard.fromSize(3, 3, false);
            expect(board.get(-1, 1, true)).to.equal(true);
            expect(board.get(-1, 1, false)).to.equal(false);
            expect(board.get(3, 0, true)).to.equal(true);
            expect(board.get(4, 4, true)).to.equal(true);
        });

        it('should throw a RangeError when attempting to read an out of range index with no default value specified.', () => {
            let board: GameBoard = GameBoard.fromSize(3, 3, false);
            expect(() => board.get(-1, 1)).to.throw(RangeError);
            expect(() => board.get(1, -1)).to.throw(RangeError);
            expect(() => board.get(3, 0)).to.throw(RangeError);
            expect(() => board.get(4, 4)).to.throw(RangeError);
        });
    });
});
