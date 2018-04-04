import { LifeLikeRuleset } from './life-like-ruleset'
import { NeighborhoodUtils, Neighborhood, NeighborhoodPositions } from './neighborhood'
import { GameBoard } from './game-board'
import { expect } from 'chai';
import 'mocha';

describe("LifeLikeRuleset", () => {
    describe("Construction", () => {
        it("should error when given the empty string as a ruleset", () => {
            expect(() => new LifeLikeRuleset("")).to.throw(RangeError);
        });
        
        let badData = [
            "bad rules",
            "B23/S23",
            "B2a",
            "23BS",
            null,
            undefined
        ];
        for (let data of badData) {
            it(`should error on ruleset: "${data}"`, () => {
                expect(() => new LifeLikeRuleset(data)).to.throw();
            });
        }
    });
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
                it(`Correctly kills test cell #${n++} (${neighborhood})`, ()=> {
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
    
        describe("3 Neighbors", () => {
            let neighborhoods : boolean[][][] = [ 
                [ //0
                    [true, true, false],
                    [false, true, false],
                    [false, false, true]
                ],
                [ //1
                    [false, true, false],
                    [true, true, true],
                    [false, false, false]
                ],
                [ //2
                    [true, false, false],
                    [true, true, false],
                    [true, false, false]
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
                it(`Correctly births test cell #${n}' (${deadNeighborhood}).`, () => {
                    expect(ruleset.evaluate(deadNeighborhood)).to.equal(true);
                });
                n++;
            };
        });
    });
});
