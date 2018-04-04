/**
* Helper class to perform bitwise operations on numbers.
* @author Collin Driscoll
*/
export class BitOperations {
    
    /**
    * Sets or unsets a specific bit in the given bitString.
    * @param {number} bitString - The bitString upon which to operate.
    * @param {number} index - The (zero-indexed) index of the bit to set.
    * @param {boolean} value - The value to set the bit to. Must be true or false.
    * @throws **RangeError** if `value` is not `true` or `false`
    * @throws **RangeError** if `index` is less than zero
    * @returns {number} The modified `bitString`.
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
    * Unsets all bits of equal or greater significance than the start index.
    * @param {number} bitString - The bitString upon which to operate.
    * @param {number} start - The first bit to unset.
    * @param {boolean} value - The value to change the bits to.
    * @throws **RangeError** If start is less than or equal to zero.
    * @returns The modified `bitString`
    */
    static unsetSignificantBits(bitString : number, start : number) : number {
        if (start < 0) {
            throw new RangeError("Start must be greater than or equal to zero.");
        }
        let mask : number = 1 << start;
        return bitString % mask;
    }
    
    /**
    * Gets the value of the bit at a specific index.
    * @param {number} bitString - The bitString upon which to operate.
    * @param {number} index - The index of the bit to read.
    * @returns `true` if the bit at `index` is set, `false` otherwise
    */ 
    static getBit(bitString : number, index : number) : boolean {
        return (bitString & (1 << index)) != 0;
    }
    
    /**
    * Shifts the given bitString left by the specified magnitude.
    * @param {number} bitString - The bit string upon which to operate.
    * @param {number} magnitude - The number of bits by which to shift.
    * @returns The modified `bitString`
    */
    static shiftLeft(bitString : number, magnitude : number = 1) : number {
        return bitString << magnitude;
    }
}
