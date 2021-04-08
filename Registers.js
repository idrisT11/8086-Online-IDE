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
            this.R[IP_REG] &= 0xFFFF;
    }
        
    incSP(){
            this.R[SP_REG] -= 2;
            this.R[SP_REG] &= 0xFFFF;
    }
        
    decSP(){
            this.R[SP_REG] += 2;
            this.R[SP_REG] &= 0xFFFF;
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
        //
        //multiplication 
    mulReg(registerId,type)
    {
        if(type==SEGMENT_REGISTER )
        {
            console.log("Error:multiplication by a segment register is not allowed");
        }
        else if(type==BYTE_REGISTER)
        {   
            let val = this.readByteReg(registerId);
            let al = this.readByteReg(0);//al
            al*=val;
            if(al>>8==0)
            {
                this.writeByteReg(0,al);
            }
            else 
            {
                this.writeReg(AX_REG,al);
             
            }
        }
        else 
        {
            let val = this.readWordReg(registerId);
            let ax = this.readReg(AX_REG);//ax
            ax*=val;
            if(ax>>16==0)
            {
                this.writeReg(AX_REG,ax);
            }
            else 
            {
               
               
                let dx=(((ax&0xffff0000)>>16)&0xffff);
               // console.log(ax.toString(16),'   ',dx.toString(16))
                this.writeReg(AX_REG,ax&0x0000ffff);
                this.writeReg(DX_REG,dx);
            }


        }

    }
    //division
   //division
    divReg(registerId,type)
    {
        if(type==SEGMENT_REGISTER )
        {
            console.log("Error:division by a segment register is not allowed");
        }
        else if(type==BYTE_REGISTER)
        {   
            let val = this.readByteReg(registerId);
            let al = this.readByteReg(0);//al
            this.writeReg(AX_REG,(Math.floor(val%al)<<8)+Math.floor(val/al));//ah  
             
        }
        else 
        {
           
            let val = this.readWordReg(registerId);
            let ax = this.readReg(AX_REG);//ax'
            this.writeReg(AX_REG,Math.floor(val/ax));
            this.writeReg(DX_REG,val%ax);
          


        }

    }
    extractFlag(flagName)
    {
        let val=this.R[FLAG_REG];//123456789

        switch(flagName)
        {
            case 'O':  
                val=val>>11;
                break;

            case 'D': 
                val=val>>10%2;
                break;

            case 'I':  
                val=val>>9%2;
                break;

            case 'T':  
                val=val>>8%2;
                break;
            case 'S':
                val=val>>7%2;
                break;
            case 'Z':
                val=val>>6%2;
                break;
            
            case 'A':
                val=val>>4%2;
                break;
            
            case 'P':
                val=val>>2%2;
                break;
            
            case 'C': //less significant bit
                val=val%2;
                break;
          
        }
       return val;
    }
    //
    setFlag(flagName,bit)
    {
        let val=this.R[FLAG_REG];//123456789
        switch(flagName)
        {
            case 'O':  //most segnificant bit
               if(bit) val|=0b100000000;
               else val &=0b011111111;
                break;

            case 'D':
                if(bit) val|=0b010000000;
               else val &=0b101111111;
                break;

            case 'I':
                if(bit) val|=0b001000000;
                else val &=0b110111111;
                break;

            case 'T':
                if(bit) val|=0b000100000;
                else val &=0b111011111;
                break;

            case 'S':
                if(bit) val|=0b000010000;
                else val &=0b111101111;
                break;

            case 'Z':
                if(bit) val|=0b000001000;
                else val &=0b111110111;
                break;

            case 'A':
                if(bit) val|=0b000000100;
                else val &=0b111111011;
                break;
            
            case 'P':
                if(bit) val|=0b000000010;
                  else val &=0b111111101;
                  break;

            

            case 'C': //less significant bit
            if(bit) val|=0b000000001;
            else val &=0b111111110;
                break;

          
        }
       this.writeReg(FLAG_REG,val);
       
    }
        //
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
