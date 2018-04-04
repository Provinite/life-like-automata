import { GameBoard } from './game-board'
import { RuleSet } from './rule-set'
import { Neighborhood, NeighborhoodUtils, NeighborhoodPositions } from './neighborhood'

const enum CellAction {
    BIRTH = 0,
    DEATH = 1,
    NONE = 2
}

/**
* RuleSet used to map a neighborhood to a new state for the central cell.
* Creates a complete (512) element lookup table at construction based on the provided
* ruleset string. This class is capable of generating a lookup table for any life-like cellular automaton.
*
* See also
* - https://en.wikipedia.org/wiki/Life-like_cellular_automaton
* - https://en.wikipedia.org/wiki/Moore_neighborhood
*/
export class LifeLikeRuleset implements RuleSet<Neighborhood, boolean>  {
    private static readonly ERROR_INVALID_RULE_STRING = "Invalid ruleset. Rulesets must start with B or S, and may only contain B, S, and digits.";
    
    /**
    * There are 2^9 (512) distinct Moore neighborhoods.
    */
    private static readonly NUM_NEIGHBORHOODS : number = 512; //2**9
    
    /**
    * Table used to retrieve the outcome of a given neighborhood.
    */
    private _lookupTable: boolean[];
    
    /**
    * Named ruleset strings
    */
    public static readonly NAMED_GAMES = {
        LIFE: "B3S23",
        REPLICATOR: "B1357S1357",
    };
    
    /**
    * Creates a RuleSet that provides O(1) lookups for any neighborhood using the given rules.
    * @param {string} rules - A string indicating the rules of the game.
    * The format of this string is `BnnSnn` where `n` are numbers of live neighbors.
    * Neighbor counts appearing after a `B` will cause dead cells to come to life (**B**irth).
    * Neighbor counts appearing after a `S` will cause live cells to remain living (**S**urvive).
    * For example, Conway's Game of Life would use the ruleset B3S23 (Born with 3 neighbors, Survive with 2 or 3).
    */
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
    
    /**
    * Performs an O(1) lookup on the given neighborhood.
    * @param {Neighborhood} neighborhood - The neighborhood whose center cell is to be evaluated.
    * @returns The new state of the central cell of `neighborhood`.
    */
    evaluate(neighborhood : Neighborhood) : boolean {
        return this._lookupTable[neighborhood];
    }
    
    /**
    * Creates a complete lookup table for the given intermediate rules array.
    * @param {CellAction[][]} neighborCountRules - A 2-d array of CellActions
    * `neighborCountRules[i][s]` represents the action to take when a cell has
    * current state `s` (0: dead, 1: alive) and `i` neighbors.
    */
    private _generateLookupTable(neighborCountRules : CellAction[][]) {
        this._lookupTable = [];
        for (let neighborhood : number = 0; neighborhood < LifeLikeRuleset.NUM_NEIGHBORHOODS; neighborhood++) {
            let neighborCount = 0;
            let centerValue : boolean = NeighborhoodUtils.getCell(neighborhood, NeighborhoodPositions.MIDDLE);
            
            //count the number of live neighbors in the neighborhood
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
