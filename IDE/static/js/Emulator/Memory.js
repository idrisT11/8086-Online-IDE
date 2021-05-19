class Memory{
    constructor(size){

        this.size = size;//Size est donné en octect
        this._buffer = new Array(this.size);

        for (let i = 0; i < size; i++) 
            this._buffer[i] = 0;
            
    }
    initRam()
    {
        for (let i = 0; i < this._buffer.length; i++) 
        this._buffer[i] = 0;
    }
    getBufferAt(i)
    {
        return this._buffer[i];
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
        {
            ramStatesManager[t].push({addr:address,
                prevVal:this._buffer[address],
                newVal:value
               });
            this._buffer[address] = value;
        }
            
    }
    _writeByte(address, value){
       
        address = this.testAddress(address);

        if (value >> 8 != 0) 
            console.log("Error: Trying to write more than a byte.");
        else
        {
           
            this._buffer[address] = value;
        }
            
    }

    writeWord(address, value){

        address = this.testAddress(address);

        if (value >> 16 != 0) 
        {
           
            console.log("Error: Trying to write more than a word.");
        }
          
          

        else
        {
            ramStatesManager[t].push({addr:address,
                prevVal:this._buffer[address],
                newVal:(value % 256)
               });
               ramStatesManager[t].push({addr:address+1,
                prevVal:this._buffer[address+1],
                newVal:(value >> 8)
               });
            this._buffer[address + 1] = value >> 8; //Le byte de poid fort
            this._buffer[address] = value % 256;    //Le byte de poid faible
        }
            
    }
    _writeWord(address, value){

        address = this.testAddress(address);

        if (value >> 16 != 0) 
        {
           
            console.log("Error: Trying to write more than a word.");
        }
          
          

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
