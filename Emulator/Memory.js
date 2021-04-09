class Memory{
    constructor(size){

        this.size = size;//Size est donné en octect
        this._buffer = new Array(this.size);

        for (let i = 0; i < size; i++) 
            this._buffer[i] = 0;
            
    }

    readByte(address){
        address = this.testAddress(address);

        return this._buffer[address];
    }

    readWord(address){
        address = this.testAddress(address);

        return  this._buffer[address] + (this._buffer[address+1] << 8);
    }

    writeByte(address, value){

        address = this.testAddress(address);

        if (value >> 8 != 0) 
            console.log("Error: Trying to write more than a byte.");
        else
            this._buffer[address] = value;
    }

    writeWord(address, value){

        address = this.testAddress(address);

        if (value >> 16 != 0) 
            console.log("Error: Trying to write more than a word.");
        else
        {
            this._buffer[address + 1] = value >> 8; //Le byte de poid fort
            this._buffer[address] = value % 256;    //Le byte de poid faible
        }
            
    }

    testAddress(address){
        if (address > this.size) {
            console.log("Warning: Trying to access an unmapped address of the memory ");
            address %= this.size;
        }

        return address;
    }

    dump(){
        var copy = new Array(this.size);

        for (let i = 0; i < this.size; i++) 
            copy[i] = this._buffer[i];
            
        return copy;
    }
}
