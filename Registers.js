const   ALL_REGISTER        = 0,
        BYTE_REGISTER       = 1,
        WORD_NS_REGISTER    = 2,
        SEGMENT_REGISTER    = 3;


class Registers{
    constructor() {
        this.R = new Array(14);

        for (let i = 0; i < 14; i++) 
            this.R[i] = 0;
    }

    readReg(registerId){
        
        return this.R[registerId];
    }

    readSegReg(registerSegId){
        var registerId = SEGMENT_REGISTERS_TABLE[registerSegId];

        return this.R[registerId];
    }

    readByteReg(registerByteId){
        var registerId = WORD_REGISTERS_TABLE[registerByteId%4],
            HighByte = (registerByteId >> 2);

        if (HighByte)  //AH, BH, CH, DH
            return (this.R[registerId] & 0xFF00) >> 8;
        else
            return (this.R[registerId] & 0x00FF);
        
    }

    readWordReg(registerWordId){
        var registerId = WORD_REGISTERS_TABLE[registerWordId];

        return this.R[registerId];
    }

    writeReg(registerId, value){
        this.R[registerId] = value;
    }

    writeSegReg(registerSegId, value){
        var registerId = SEGMENT_REGISTERS_TABLE[registerSegId];

        this.R[registerId] = value;
    }

    writeByteReg(registerByteId, value){
        var registerId = WORD_REGISTERS_TABLE[registerByteId%4],
            HighByte = (registerByteId >> 2);

        if (value >> 8 != 0) {
            console.log("Error: Trying to write a word value in a byte register.");
            value %= 256;
        }


        if (HighByte)  //AH, BH, CH, DH
        {
            this.R[registerId] &= 0x00FF;
            this.R[registerId] |= (value << 8) ;
        }   
        else
        {
            this.R[registerId] &= 0xFF00;
            this.R[registerId] |= value;
        }
            
        
    }

    writeWordReg(registerWordId, value){
        var registerId = WORD_REGISTERS_TABLE[registerWordId];

        this.R[registerId] = value;
    }
        
    incIP(base){
            this.R[IP_REG] += base;
    }

    movRegTyped(registerId_1, registerId_2, type1, type2)
    {
        if (type1 != type2 && type1 == BYTE_REGISTER) 
            console.log("Error: Word-Byte operation on register detected");

        else if (type1 == BYTE_REGISTER)
        {
            let val = this.readByteReg(registerId_2);
            this.writeByteReg(registerId_1, val);
        }

        else if(type1 == SEGMENT_REGISTER)
        {
            let val = this.readWordReg(registerId_2);
            this.writeSegReg(registerId_1);
        }

        else if(type2 == SEGMENT_REGISTER)
        {
            let val = this.writeSegReg(registerId_2);
            this.readWordReg(registerId_1);
        }

        else
        {
            let val = this.readWordReg(registerId_2);
            this.readWordReg(registerId_1);
        }
        
    }
}


const   AX_REG = 0,
        BX_REG = 1,
        CX_REG = 2,
        DX_REG = 3,
        CS_REG = 4,
        DS_REG = 5,
        ES_REG = 6,
        SS_REG = 7,
        SP_REG = 8,
        BP_REG = 9,
        DI_REG = 10,
        SI_REG = 11,
        FLAG_REG = 12,
        IP_REG = 13;


const   SEGMENT_REGISTERS_TABLE = [ES_REG, CS_REG, SS_REG, DS_REG],
        WORD_REGISTERS_TABLE = [AX_REG, CX_REG, DX_REG, BX_REG, SP_REG, BP_REG, SI_REG, DI_REG];
