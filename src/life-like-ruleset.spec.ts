import { LifeLikeRuleset } from './life-like-ruleset'
import { LifeLikeIterator } from './life-like-iterator'
import { NeighborhoodUtils, Neighborhood, NeighborhoodPositions } from './neighborhood'
import { GameBoard } from './game-board'
import { expect } from 'chai';
import 'mocha';

describe("LifeLikeRuleset", () => {
    describe("Using Conway's Game of Life Rules", () => {
        let ruleset : LifeLikeRuleset;
        before(() => {
            ruleset = new LifeLikeRuleset(LifeLikeRuleset.NAMED_GAMES.LIFE);
        });
        it("should kill cells with 0 neighbors", () => {
            let neighborhood : Neighborhood = NeighborhoodUtils.fromBooleanArray([
                [false, false, false],
                [false, true, false],
                [false, false, false]
            ]);
            expect(ruleset.evaluate(neighborhood)).to.equal(false);
        });
        
        describe("1 Neighbor", () => {
            let neighborhoods : boolean[][][] = [    
                [ //0
                    [true, false, false],
                    [false, true, false],
                    [false, false, false]
                ],[ //1
                    [false, false, false],
                    [false, true, true],
                    [false, false, false]
                ],[ //2
                    [false, false, false],
                    [false, true, false],
                    [false, false, true]
                ]
            ];
                
            let n : number = 0;
            for (let neighborhoodArray of neighborhoods) {
                let neighborhood : Neighborhood = NeighborhoodUtils.fromBooleanArray(neighborhoodArray);
                it(`Correctly kills test cell #${n} (${neighborhood})`, ()=> {
                    expect(ruleset.evaluate(neighborhood)).to.equal(false);
                });    
            }
        });
        
        describe("2 Neighbors", () => {
            let neighborhoods : boolean[][][] = [ 
                [ //0
                    [true, false, false],
                    [false, true, false],
                    [false, false, true]
                ],
                [ //1
                    [false, false, false],
                    [true, true, true],
                    [false, false, false]
                ],
                [ //2
                    [false, true, true],
                    [false, true, false],
                    [false, false, false]
                ]
            ];
                        
            let n : number = 0;
            for (let neighborhoodArray of neighborhoods) {
                let neighborhood : Neighborhood = NeighborhoodUtils.fromBooleanArray(neighborhoodArray);
                
                let cellStatus : boolean = NeighborhoodUtils.getCell(neighborhood, NeighborhoodPositions.MIDDLE);
                it(`Correctly keeps test cell #${n} (${neighborhood}) alive.`, () => {
                    expect(ruleset.evaluate(neighborhood)).to.equal(true);
                });
                
                let deadNeighborhood = NeighborhoodUtils.setCell(neighborhood, NeighborhoodPositions.MIDDLE, false);
                it(`Correctly keeps test cell #${n}' (${deadNeighborhood}) dead.`, () => {
                    expect(ruleset.evaluate(deadNeighborhood)).to.equal(false);
                });
                n++;
            };
        });
    });
});
