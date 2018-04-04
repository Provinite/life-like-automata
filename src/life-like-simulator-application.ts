import { GameBoard } from './game-board'
import { LifeLikeIterator } from './life-like-iterator'
import { LifeLikeRuleset } from './life-like-ruleset'
import { ConsoleHelper } from './console-helper'

export class LifeLikeSimulatorApplication {
    private ui : ConsoleHelper;
    constructor(private stdin = process.stdin, private stdout = process.stdout) {
        this.ui = new ConsoleHelper(this.stdin, this.stdout);
    }
    
    private static randomBoard (rows : number = 10, columns : number = 10) : GameBoard {
        let boardRow : boolean[];
        let board : boolean[][] = [];
        for (let row : number = 0; row < rows; row++) {
            boardRow = [];
            for (let column : number = 0; column < columns; column++) {
                boardRow.push(Math.random() >= 0.5);
            }
            board.push(boardRow);
        }
        return GameBoard.fromBooleanArray(board);
    }
    
    private async getBoard(retry : boolean = true) : Promise<GameBoard> {
        let booleanArray : boolean[][];
        let isValid : boolean = true;
        let resultRows : string[];
        do {
            let result : string;
            result = await this.ui.prompt({
                message: "Enter your start state. Enter a semicolon (;) to finish. Enter \";\" to use a randomized board [random] \n", 
                defaultValue: "random",
                terminateOn: ";",
                format: false,
                validator: (response : string) => {
                    if (response.trim().length == 0) {
                        return false;
                    }
                    return true;
                }
            });
            
            booleanArray = [];
            result = result.replace(/[ \t]/g, "");
            if (result == "random") {
                return LifeLikeSimulatorApplication.randomBoard();
            }
            resultRows = result.split("\n");
        
            for (let row : number = 0; row < resultRows.length; row++) {
                if (resultRows[row].length == 0)
                    continue;
                let booleanArrayRow : boolean[] = [];
                for (let column : number = 0; column < resultRows[row].length; column++) {
                    let cell = resultRows[row][column];
                    if (cell == "0") {
                        booleanArrayRow.push(false);
                    } else if (cell == "1") {
                        booleanArrayRow.push(true);
                    } else {
                        this.stdout.write(`Invalid board. Unexpected character (${cell}) at row ${row+1}, column ${column+1}\n`);
                        isValid = false;
                        break;
                    }
                }
                booleanArray.push(booleanArrayRow);
            }
        } while (!isValid && retry)
        return GameBoard.fromBooleanArray(booleanArray);
    }
    
    private drawBoard (board : GameBoard) : void {
        let data : boolean[][] = board.toBooleanArray();
        for (let row : number = 0; row < data.length; row++) {
            this.ui.eraseToEOL();
            for (let col : number = 0; col < data[row].length; col++) {
                this.stdout.write(String(data[row][col] ? 1 : 0) + " ");
            }
            this.stdout.write("\n");
        }
    }
    
    private async animateBoard(iterator : LifeLikeIterator, board : GameBoard, generations : number = 1, delayMs : number = 500) : Promise<GameBoard> {
        return new Promise<GameBoard>(resolve => {
            this.stdout.write("Generation: 0\n")
            this.drawBoard(board);
            let offset : number[] = [board.getRowCount() + 1, board.getRowLength(board.getRowCount() - 1)];
            this.ui.moveUp(offset[0]);
            this.ui.moveLeft(offset[1]);
            let generation : number = 0;
            let interval = setInterval(() => {
                if (generation++ == generations) {
                    clearInterval(interval);
                    resolve(board);
                    return;
                }
                board = iterator.runBoard(board);
                this.ui.eraseToEOL();
                this.stdout.write(`Generation: ${generation}\n`);
                this.drawBoard(board);
                if (generation != generations) {
                    this.ui.moveUp(offset[0]);
                    this.ui.moveLeft(offset[1]);
                }
            }, delayMs);
        });
    }
    
    async start() {
        let response : number
        this.stdout.write(
    ` ---------------------------------
    | Life Like Cellular Automata Sim |
     ---------------------------------\n\n`);
        do {
            let ruleset : LifeLikeRuleset;
            let iterator : LifeLikeIterator;
            let mainMenuOptions = [
                `Conway's Game of Life [${LifeLikeRuleset.NAMED_GAMES.LIFE}]`,
                `Replicator [${LifeLikeRuleset.NAMED_GAMES.REPLICATOR}]`,
                "Custom Game",
                "Demos",
                "Exit"
            ];
            
            response = await this.ui.menu("Main Menu", mainMenuOptions)
            if (response == 0 || response == 1 || response == 2) {
                let rulesetString : string = response == 0 ? LifeLikeRuleset.NAMED_GAMES.LIFE : LifeLikeRuleset.NAMED_GAMES.REPLICATOR
                if (response == 0) {
                    rulesetString = LifeLikeRuleset.NAMED_GAMES.LIFE;
                    ruleset = new LifeLikeRuleset(rulesetString);
                } else if (response == 1) {
                    rulesetString = LifeLikeRuleset.NAMED_GAMES.REPLICATOR;
                    ruleset = new LifeLikeRuleset(rulesetString);
                } else if (response == 2) {
                    while (ruleset == undefined) {
                        rulesetString = await this.ui.prompt("Enter your ruleset", "B3S23");
                        try {
                            ruleset = new LifeLikeRuleset(rulesetString);
                        } catch (e) {
                            this.stdout.write(`${e.message}\n`);
                        }
                    }
                }
                iterator = new LifeLikeIterator(ruleset);
                
                let board : GameBoard = await this.getBoard();
                let isNumericAndGreaterThanZero = (data : any) => !Number.isNaN(+data) && +data > 0
                let generations : number = +await this.ui.prompt({
                    message: "Number of generations to simulate",
                    defaultValue: 10,
                    validator: isNumericAndGreaterThanZero
                });
                
                let delay : number = +await this.ui.prompt({
                    message: "Time between generations (milliseconds)",
                    defaultValue: 250,
                    validator: isNumericAndGreaterThanZero
                });
                this.stdout.write(`\n[${rulesetString}] for ${generations} generations @ ${delay}ms\n\n`);
                board = await this.animateBoard(iterator, board, generations, delay);
                this.stdout.write("\n");
            } else if (response == 3) {
                this.demos();
            }
        } while (response != 4)
    }
    
    demos() : void {
        
    }
}
