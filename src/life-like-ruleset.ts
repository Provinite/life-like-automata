import { GameBoard } from './game-board'
import { RuleSet } from './rule-set'
import { Neighborhood, NeighborhoodUtils, NeighborhoodPositions } from './neighborhood'

const enum CellAction {
    BIRTH = 0,
    DEATH = 1,
    NONE = 2
}

export class LifeLikeRuleset implements RuleSet<Neighborhood, boolean>  {
    private static readonly ERROR_INVALID_RULE_STRING = "Invalid ruleset. Rulesets must start with B or S, and may only contain B, S, and digits.";
    private static readonly NUM_NEIGHBORHOODS : number = 512; //2**9
    private _lookupTable: boolean[];
    
    //see https://en.wikipedia.org/wiki/Life-like_cellular_automaton
    public static readonly NAMED_GAMES = {
        LIFE: "B3S23",
        REPLICATOR: "B1357S1357",
    };
    
    constructor(rules: string = LifeLikeRuleset.NAMED_GAMES.LIFE) {
        rules = rules.toUpperCase();
        //Array that maps number of live neighbors + current value to an action
        let neighborCountRules: CellAction[][] = [];
        for (let i: number = 0; i < 10; i++) {
            neighborCountRules[i] = [CellAction.DEATH, CellAction.DEATH];
        }

        let curAction: string = null;
        for (let i: number = 0; i < rules.length; i++) {
            let curChar : String = rules[i];
            //update the action that we're applying from here on out
            if (curChar.match(/[B,S]/)) {
                curAction = rules[i];
                //apply the last indicated action to any digits
            } else if (curChar.match(/\d/)) {
                if (curAction == null) {
                    throw new RangeError(LifeLikeRuleset.ERROR_INVALID_RULE_STRING)
                }
                let digit : number = +curChar;
                if (curAction == "B") {
                    neighborCountRules[digit][0] = CellAction.BIRTH;
                } else if (curAction == "S") {
                    neighborCountRules[digit][1] = CellAction.NONE;
                }
            } else {
                throw new RangeError(LifeLikeRuleset.ERROR_INVALID_RULE_STRING);
            }
        }
        this._generateLookupTable(neighborCountRules);
    }
    
    evaluate(neighborhood : Neighborhood) : boolean {
        return this._lookupTable[neighborhood];
    }
    
    private _generateLookupTable(neighborCountRules : CellAction[][]) {
        //convert our intermediate rules into a lookup table
        this._lookupTable = [];
        for (let neighborhood : number = 0; neighborhood < LifeLikeRuleset.NUM_NEIGHBORHOODS; neighborhood++) {
            let neighborCount = 0;
            let centerValue : boolean = NeighborhoodUtils.getCell(neighborhood, NeighborhoodPositions.MIDDLE);

            for (let position : number = 0; position < 9; position++) {
                //ignore the center cell, since it can't be its own neighbor
                if (position == NeighborhoodPositions.MIDDLE) {
                    continue;
                }
                if (NeighborhoodUtils.getCell(neighborhood, position)) {
                    neighborCount++;
                };
            }
            let action : CellAction = (centerValue ? neighborCountRules[neighborCount][1] : neighborCountRules[neighborCount][0]);
            if (action == CellAction.BIRTH) {
                this._lookupTable[neighborhood] = true;
            } else if (action == CellAction.DEATH) {
                this._lookupTable[neighborhood] = false;
            } else if (action == CellAction.NONE) {
                this._lookupTable[neighborhood] = NeighborhoodUtils.getCell(neighborhood, NeighborhoodPositions.MIDDLE);
            } else {
                throw new Error("Unknown cell action during lookup table generation.");
            }
        }
    }
}
