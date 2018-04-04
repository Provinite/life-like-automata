/**
* Helper class to perform bitwise operations on numbers.
*/
export class BitOperations {
    
    /**
    * Sets or unsets a specific bit in the given bitString.
    * @param {number} bitString - The bitString upon which to operate.
    * @param {number} index - The (zero-indexed) index of the bit to set.
    * @param {boolean} value - The value to set the bit to. Must be true or false.
    * @return {number} The modified bitString.
    */
    static setBit(bitString : number, index : number, value : boolean) : number {
        if (value !== true && value !== false) {
            throw new RangeError("Value must be true or false.")
        }
        if (index < 0) {
            throw new RangeError("Index must greater than or equal to zero.");
        }
        let mask : number = 1 << index;
        if (value) {
            return bitString | mask;
        } else {
            return bitString & ~mask;
        }
    }
    
    /**
    * Sets all bits of equal or greater significance than the start index to
    * a given value.
    * @param {number} start - The first bit to unset.
    * @param {boolean} value - The value to change the bits to.
    */
    static unsetSignificantBits(bitString : number, start : number) {
        if (start < 0) {
            throw new RangeError("Start must be greater than or equal to zero.");
        }
        let mask : number = 1 << start;
        return bitString % mask;
    }
    
    static getBit(bitString : number, index : number) : boolean {
        return (bitString & (1 << index)) != 0;
    }
    
    /**
    * Shifts the given bitString left by the specified magnitude.
    * @param {number} bitString - The bit string upon which to operate.
    * @param {number} magnitude - The number of bits by which to shift.
    */
    static shiftLeft(bitString : number, magnitude : number = 1) {
        return bitString << magnitude;
    }
}
