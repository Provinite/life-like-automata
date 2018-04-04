import { BitOperations } from './bit-operations';
import { expect } from 'chai';
import 'mocha';

describe("BitOperations", () => {
    describe("setBit", () => {
        it('should set only the correct bits.', () => {
            expect(BitOperations.setBit(0, 0, true)).to.equal(1);
            expect(BitOperations.setBit(0, 1, true)).to.equal(2);
            expect(BitOperations.setBit(0, 2, true)).to.equal(4);
            
            expect(BitOperations.setBit(4, 0, true)).to.equal(5);
            expect(BitOperations.setBit(5, 1, true)).to.equal(7);
            expect(BitOperations.setBit(4, 3, true)).to.equal(12);
        });
        
        it('should unset only the correct bits.', () => {
            expect(BitOperations.setBit(0, 0, false)).to.equal(0);
            expect(BitOperations.setBit(0, 1, false)).to.equal(0);
            expect(BitOperations.setBit(0, 2, false)).to.equal(0);
            
            expect(BitOperations.setBit(4, 0, false)).to.equal(4);
            expect(BitOperations.setBit(4, 2, false)).to.equal(0);
            expect(BitOperations.setBit(5, 0, false)).to.equal(4);
            expect(BitOperations.setBit(4, 3, false)).to.equal(4);
        });
    });
    
    it('should double the bitString when shifting left', () => {
        let bitString: number = 1;
        let lastVal = 1;
        for (let i : number = 0; i < 10; i++) {
            bitString = BitOperations.shiftLeft(bitString);
            expect(bitString).to.equal(2*lastVal);
            lastVal = bitString;
        }
    });
    
    it('should double the bitString for each magnitude when shifting left', () => {
        let bitString : number = 1;
        let lastVal = 1;
        for (let i : number = 0; i < 5; i++) {
            bitString = BitOperations.shiftLeft(bitString, 3);
            expect(bitString).to.equal(8*lastVal);
            lastVal = bitString;
        }
    });
    
    it('should unset all bits equally or more significant than the start index', () => {
        let bitString : number = 2 + 8 + 64 + 128 + 256 + 1024;
        expect(BitOperations.unsetSignificantBits(bitString, 6)).to.equal(10);
        
        bitString = 1 + 2 + 4 + 8 + 128 + 256 + 512;
        expect(BitOperations.unsetSignificantBits(bitString, 6)).to.equal(15);
        
        bitString = 1 + 2 + 4 + 8 + 16 + 32 + 64 + 128;
        expect(BitOperations.unsetSignificantBits(bitString, 0)).to.equal(0);
    })
});
