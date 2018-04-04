import { GameBoard } from './game-board'
import { RuleSet } from './rule-set'
import { NeighborhoodUtils } from './neighborhood'
import { Neighborhood, NeighborhoodPositions} from './neighborhood'
export class LifeLikeIterator {
    private ruleset : RuleSet<Neighborhood, boolean>;
    constructor(ruleset : RuleSet<Neighborhood, boolean> ) {
        if (ruleset == undefined) {
            throw new TypeError("A ruleset is required to construct a LifeLikeIterator.");
        }
        this.ruleset = ruleset;
    }
    
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

    runCell(board: GameBoard, x: number, y: number): boolean {
        return false;
    }
}
