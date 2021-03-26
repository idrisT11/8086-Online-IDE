const REGISTER = {
    AX: 0,
    BX: 1,
    CX: 2,
    DX: 3,
    CS: 4,
    DS: 5,
    ES: 6,
    SS: 7,
    SP: 8,
    BP: 9,
    DI: 10,
    SI: 11,
    FLAG: 12,
    IP: 13
}
const MEMORY_SIZE = 1048576;

import "OPCODES.js"

class{
    constructor(){
        this.RAM = new Array(MEMORY_SIZE);
        this.Register = new Array(14);
    }

    decode(){
        var instruction = this.RAM[this.IP];

        let gut = this.decodeMov(instruction);
    }

    decodeMov(instruction){
        //======================================================================================
        // -------Register/Memory to/from Register----------------------------------------------
        //======================================================================================
        if (instruction & 0b11111100 == MOV_RM_RM ) 
        {
            var operandes = this.extractOperand(this.RAM[this.Register[IP]+1]);

            if (operandes.addr == null) 
            {   // R to R
                let R1 = operandes.opRegister[0],
                    R2 = operandes.opRegister[1];

                if ((instrcution >> 1) % 2) // On extrait le d
                    this.Register[R1] =  this.Register[R2];
                else
                    this.Register[R2] =  this.Register[R1];      
            }
            else
            {   // MEM TO/FROM R
                let R = operandes.opRegister[0],
                    addr = operandes.addr;

                if ((instrcution >> 1) % 2) // On extrait le d
                    this.Register[R] =  this.RAM[addr];
                else
                    this.RAM[addr] =  this.Register[R];  
            }


            this.Register[IP] += operandes.dispSize + 2;//2 étant la taille de base de l'instruction
        }
        //======================================================================================
        // -------Immediate to Register/Memory--------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111110 == MOV_IMMEDIATE_TO_RM) 
        {
            var operandes = this.extractOperand(this.RAM[this.Register[IP]+1], instruction%2),//On extrait le w
                immediatVal = this.RAM[this.Register[IP] + operandes.dispSize + 2];

            if (instruction % 2 == 1)  // High Byte selected
                immediatVal += ( this.RAM[this.Register[IP] + operandes.dispSize + 3] << 8 )

            if (operandes.addr == null) 
                this.Register[R] =  immediatVal; //WARNING ULTRA FAUX, R PEUT ETRE QUOI QUE SE SOIT
            else
                this.RAM[addr] = immediatVal;
            
            this.Register[IP] += operandes.dispSize + (instruction % 2) + 3;//2 étant la taille de base de l'instruction
        }
        //======================================================================================
        // -------Immediate to Register---------------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11110000 == MOV_IMMEDIATE_TO_R) 
        {
            var R = instruction & 0x07;
                immediatVal = this.RAM[this.Register[IP] + 1];  //On pourrait faire ++this.Register[IP] pour chaque appelle

            if (instruction % 2 == 1)  // High Byte selected
                immediatVal += ( this.RAM[this.Register[IP] + 2] << 8 );

            this.Register[R] =  immediatVal; //WARNING ULTRA FAUX, R PEUT ETRE QUOI QUE SE SOIT

            this.Register[IP] += (instruction % 2) + 2;
        }
        //======================================================================================
        // -------Memory to Accumulator---------------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111100 == MOV_ACCUMULATOR_MEMORY) 
        {
            var addr = this.RAM[this.Register[IP] + 1] + (this.RAM[this.Register[IP] + 2] << 8);

            if((instruction >> 1) % 2 == 0) //On lit ou on écrit
                this.Register[AX] = this.RAM[addr];
            else
                this.RAM[addr] = this.Register[AX];

            this.Register[IP] += 3;
        }   
        //======================================================================================
        // -------Segment Register to Register/Memory-------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111101 == MOV_RM_SEGEMENT) 
        {
            var operandes = this.extractOperand(this.RAM[this.Register[IP]+1], 1, true);//"1" car on boss sur un word

            if (operandes.addr == null) 
            {   // R to R
                let R1 = operandes.opRegister[0],
                    R2 = operandes.opRegister[1];

                if ((instrcution >> 1) % 2) // On extrait le d
                    this.Register[R1] =  this.Register[R2];
                else
                    this.Register[R2] =  this.Register[R1];      
            }
            else
            {   // MEM TO/FROM R
                let R = operandes.opRegister[0],
                    addr = operandes.addr;

                if ((instrcution >> 1) % 2) // On extrait le d
                    this.Register[R] =  this.RAM[addr];
                else
                    this.RAM[addr] =  this.Register[R];  
            }
        }
        else
            return -1;

        return 0;
    }

    extractOperand(addrModeByte){
        /*
            |m|m|r|r|r|/|/|/|
            m: mode byte
            r: register byte
            /: r/m byte
        */
        var mode = (addrModeByte & 0xC0) >> 6,
            reg  = (addrModeByte & 0x38) >> 3,
            rm   = (addrModeByte & 0x07);

        var addr = null,        //addr de l'un des operandes
            dispSize = 0,      //Si l'adressage prend un disp, cela tiendra compte de sa taille
            opRegister = [reg, null];
        

        switch (mode) {
            case NO_DISP:      //No displacement

                if (rm == 0b110) {
                    addr = this.RAM[this.Register[IP]+1] + (this.RAM[this.Register[IP]+2]<<8);
                    dispSize = 2;
                }   
                else
                    addr = this.getAddrIndir(rm);

                break;

            case IWEN_DISP:    // The displacement can be contained in one byte
                addr = this.getAddrIndir(rm) + this.RAM[this.Register[IP]+1];
                dispSize = 1;
                break;
        
            case SIN_DISP:    // The displacement can be contained in one byte
                addr = this.getAddrIndir(rm) + this.RAM[this.Register[IP]+1] + this.RAM[this.Register[IP]+2];
                dispSize = 2;
                break;
            
            case REG_MODE:
                opRegister[1] = rm;

        }

        return {
            addr: addr,
            dispSize: dispSize,
            opRegister: opRegister,
        };

    }

    getAddrIndir(rm){   //mazel la segmentation a gérer
        switch (rm) {
            case 0x00:
                return this.Register[BX] + this.Register[SI];
            case 0x01:
                return this.Register[BX] + this.Register[DI];
            case 0x02:
                return this.Register[BP] + this.Register[SI];
            case 0x03:
                return this.Register[BP] + this.Register[DI];

            case 0x04:
                return this.Register[SI];
            case 0x05:
                return this.Register[DI];
            case 0x06:
                return this.Register[BP];
            case 0x07:
                return this.Register[BX];

            default:
                return -1;
        }
    }
}


