import { GameBoard } from './game-board'
import { BitOperations } from './bit-operations'

export type Neighborhood = number;

export const enum NeighborhoodPositions {
    BOTTOM_RIGHT = 0,
    MIDDLE_RIGHT = 1,
    TOP_RIGHT = 2,
    BOTTOM_MIDDLE = 3,
    MIDDLE = 4,
    TOP_MIDDLE = 5,
    BOTTOM_LEFT = 6,
    MIDDLE_LEFT = 7,
    TOP_LEFT = 8
}

export class NeighborhoodUtils {
    /** 
    * Generates a bitstring for the 3x3 neighborhood around (x, y). The index
    * of each cell's data in the bitstring is shown in the diagram below. 
    * 8 5 2
    * 7 4 1
    * 6 3 0
    * @param {GameBoard} board - The game state to read.
    * @param {number} x - The x position of the central cell of the neighborhood.
    * @param {number} y - The y position of the central cell of the neighborhood.
    * @return {number} A bit-string representing the given neighborhood.
    */
    static getNeighborhoodBitString(board: GameBoard, x: number, y: number): number {
        let result: number = 0;
        let idx = 0;
        //iterate over the neighborhood from bottom-right to top-left
        for (let deltaY: number = 1; deltaY >= -1; --deltaY) {
            for (let deltaX: number = -1; deltaX <= 1; ++deltaX) {
                let cellStatus = board.get(x + deltaX, y + deltaY, false);
                result = BitOperations.setBit(result, idx++, cellStatus);
            }
        }
        return result;
    }

    static slideNeighborhoodRight(bitString: number) {
        //trim the most significant 3 bits
        bitString = BitOperations.unsetSignificantBits(bitString, 6);

        //shift new data into the same space
        bitString = BitOperations.shiftLeft(bitString, 3);

        return bitString;
    }

    static setCell(neighborhood: Neighborhood, position: NeighborhoodPositions, value: boolean): Neighborhood {
        return BitOperations.setBit(neighborhood, position, value);
    }

    static getCell(neighborhood: Neighborhood, position: NeighborhoodPositions): boolean {
        return BitOperations.getBit(neighborhood, position);
    }

    static fromBooleanArray(arr: boolean[][]): Neighborhood {
        if (arr.length != 3 || arr[0].length != 3 || arr[1].length != 3 || arr[2].length != 3) {
            throw new RangeError("Neighborhoods can only be constructed from 3x3 square boolean arrays.");
        }
        let result: number = 0;
        let idx: number = 0;
        let x: number = 1;
        let y: number = 1;
        //iterate over the neighborhood from bottom-right to top-left
        for (let deltaY: number = 1; deltaY >= -1; --deltaY) {
            for (let deltaX: number = -1; deltaX <= 1; ++deltaX) {
                let cellStatus = arr[x + deltaX][y + deltaY];
                result = BitOperations.setBit(result, idx++, cellStatus);
            }
        }
        return result;
    }
}
