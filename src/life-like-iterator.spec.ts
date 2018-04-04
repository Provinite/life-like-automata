import { LifeLikeIterator } from './life-like-iterator';
import { LifeLikeRuleset } from './life-like-ruleset';
import { GameBoard } from './game-board';
import { expect } from 'chai';
import 'mocha';

describe("LifeLikeIterator", () => {
    it('should work', () => {
        
        let board : GameBoard = GameBoard.fromBooleanArray([
            [false, false, true],
            [false, false, true],
            [false, false, true]
        ])
        
        let rulesEngine : LifeLikeRuleset = new LifeLikeRuleset("B3S23");
        let engine : LifeLikeIterator = new LifeLikeIterator(rulesEngine);
        let newBoard : GameBoard = engine.runBoard(board);
                
        expect(newBoard.toBooleanArray()).to.be.eql([
            [false, false,false],
            [false, true, true],
            [false, false, false]
        ]);
        
    });
});
