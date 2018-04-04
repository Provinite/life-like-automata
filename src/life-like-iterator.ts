import { GameBoard } from './game-board'
import { RuleSet } from './rule-set'
import { NeighborhoodUtils } from './neighborhood'
import { Neighborhood, NeighborhoodPositions} from './neighborhood'
/**
* Responsible for simulating 2d cellular automata. Can be used with any ruleset which
* depends only upon a cell's Moore Neighborhood (https://en.wikipedia.org/wiki/Moore_neighborhood)
* to determine its state. 
*/
export class LifeLikeIterator {
    /**
    * This ruleset will be used to update each cell based on its neighborhood.
    */
    private ruleset : RuleSet<Neighborhood, boolean>;
    
    /**
    * Creates a LifeLikeIterator that will use the given RuleSet
    * @param {RuleSet<Neighborhood, boolean>} ruleset - A ruleset that will be used to map neighborhoods to cell's new states.
    * @throws **TypeError** if no RuleSet is provided. 
    */
    constructor(ruleset : RuleSet<Neighborhood, boolean> ) {
        if (ruleset == undefined) {
            throw new TypeError("A ruleset is required to construct a LifeLikeIterator.");
        }
        this.ruleset = ruleset;
    }
    
    /**
    * Simulates a GameBoard for a given number of iterations and then returns the resulting board.
    * Uses a sliding window to evaluate cells' neighborhoods in row order.
    * @param {GameBoard} board - The board to simulate.
    * @param {number} iterations - The number of generations to simulate.
    * @returns A GameBoard representing the state of the automaton after all iterations are completed.
    */
    runBoard(board: GameBoard, iterations : number = 1): GameBoard {
        for (let iteration : number = 0; iteration < iterations; iteration++) {        
            let newBoard : boolean[][] = [];
            for (let row : number = 0; row < board.getRowCount(); row++) {
                let newRow : boolean[] = [];
                let neighborhood : number;
                for (let col : number = 0; col < board.getRowLength(row); col++) {
                    if (col == 0) {
                        neighborhood = NeighborhoodUtils.getNeighborhoodBitString(board, row, col);
                    } else {
                        neighborhood = NeighborhoodUtils.slideNeighborhoodRight(neighborhood);
                        neighborhood = NeighborhoodUtils.setCell(neighborhood, NeighborhoodPositions.TOP_RIGHT, board.get(row - 1, col + 1, false));
                        neighborhood = NeighborhoodUtils.setCell(neighborhood, NeighborhoodPositions.MIDDLE_RIGHT, board.get(row, col + 1, false));
                        neighborhood = NeighborhoodUtils.setCell(neighborhood, NeighborhoodPositions.BOTTOM_RIGHT, board.get(row + 1, col + 1, false));
                    }
                    newRow.push(this.ruleset.evaluate(neighborhood));
                }
                newBoard.push(newRow);
            }
            return GameBoard.fromBooleanArray(newBoard);
        }
    }
    
    /**
    * @deprecated
    */
    runCell(board: GameBoard, x: number, y: number): boolean {
        return false;
    }
}
