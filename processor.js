const MEMORY_SIZE = 1048576;

import "OPCODES.js"

class Processor{
    constructor(){
        this.RAM = new Memory(MEMORY_SIZE);
        this.register = new Registers();
    }

    decode(){
        var current_ip = this.register.readReg(IP_REG),
            current_code_seg = this.register.readReg(CS_REG),
            instruction = this.RAM.readByte( current_code_seg<<4 + current_ip );

        let gut = this.decodeMov(instruction);
    }

    decodeMov(instruction){
        var current_ip = this.register.readReg(IP_REG),
            current_code_seg = this.register.readReg(CS_REG),
            current_data_segement = this.register.readReg(DS_REG);

        //======================================================================================
        // -------Register/Memory to/from Register----------------------------------------------
        //======================================================================================
        if (instruction & 0b11111100 == MOV_RM_RM ) 
        {
            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip));

            if (operandes.addr == null) 
            {   // R to R
                let R1 = operandes.opRegister[0],
                    R2 = operandes.opRegister[1];

                if ( instruction % 2 == 1 ) 
                {
                    if ((instruction >> 1) % 2) // On extrait le dif
                    {
                        let tmp = this.register.readWordReg(R1);
                        this.register.writeWordReg(R2, tmp);
                    }
                    else
                    {
                        let tmp = this.register.readWordReg(R2);
                        this.register.writeWordReg(R1, tmp);
                    }
                }
                else
                {
                    if ((instruction >> 1) % 2) // On extrait le dif
                    {
                        let tmp = this.register.readByteReg(R1);
                        this.register.writeByteReg(R2, tmp);
                    }
                    else
                    {
                        let tmp = this.register.readByteReg(R2);
                        this.register.writeByteReg(R1, tmp);
                    }
                } 
            }
            else
            {   // MEM TO/FROM R
                let R = operandes.opRegister[0],
                    addr = operandes.addr;

                if ( instruction % 2 == 1 ) //16bits
                {
                    if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                    {
                        let tmp = this.RAM.readWord(addr);
                        this.register.writeWordReg(R, tmp);
                    }
                    else
                    {
                        let tmp = this.register.readWordReg(R); // d=0 => from reg
                        this.RAM.writeWord(addr, tmp);
                    }
                }
                else    //8bits
                {
                    if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                    {
                        let tmp = this.RAM.readByte(addr);
                        this.register.writeByteReg(R, tmp);
                    }
                    else
                    {
                        let tmp = this.register.readByteReg(R); // d=0 => from reg
                        this.RAM.writeByte(addr, tmp);
                    }
                } 
            }

            this.register.incIP(operandes.dispSize + 2);//2 étant la taille de base de l'instruction
        }
        //======================================================================================
        // -------Immediate to Register/Memory--------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111110 == MOV_IMMEDIATE_TO_RM) 
        {
            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip)),//On extrait le w
                immediateAddr = current_code_seg<<4 + current_ip + 2 + operandes.dispSize ;

            var R = operandes.opRegister[0],
                addr = operandes.addr;

            if (instruction % 2 == 1)  // High Byte selected
            {
                let immediatVal = this.RAM.readWord(immediateAddr);

                if (addr == null) 
                    this.register.writeWordReg( R, immediatVal); 
                else
                    this.RAM.writeWord(immediatVal);
            }
            else
            {
                let immediatVal = this.RAM.readByte(immediateAddr);

                if (addr == null) 
                    this.register.writeByteReg( R, immediatVal); 
                else
                    this.RAM.writeByte(immediatVal);
            }

            this.register.incIP(operandes.dispSize + (instruction % 2) + 3);
        }
        //======================================================================================
        // -------Immediate to Register---------------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11110000 == MOV_IMMEDIATE_TO_R) 
        {
            var R = instruction & 0x07;
                immediatVal = current_code_seg<<4 + current_ip + 1;  //On pourrait faire ++this.Register[IP] pour chaque appelle

            if ((instruction>>3) % 2 == 1)  // High Byte selected
            {
                let immediatVal = this.RAM.readWord(immediateAddr);

                this.register.writeWordReg( R, immediatVal); 
            }
            else
            {
                let immediatVal = this.RAM.readByte(immediateAddr);

                this.register.writeByteReg( R, immediatVal); 
            }

            this.register.incIP(((instruction>>3) % 2) + 2);
        }
        //======================================================================================
        // -------Memory to/from Accumulator---------------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111100 == MOV_ACCUMULATOR_MEMORY) 
        {
            var addr = current_data_segement<<4 +this.RAM.readWord(current_code_seg << 4 + current_ip);

            if((instruction >> 1) % 2 == 0) // d=0 => from reg
            {
                if (instruction%2 == 1) //w=1
                {
                    let tmp = this.register.readRegWord(AX_REG);
                    this.RAM.writeWord(addr);
                }
                else
                {
                    let tmp = this.register.readRegByte(AX_REG);
                    this.RAM.writeByte(addr);
                }
            }
            else
            {
                if (instruction%2 == 1) //w=1
                {
                    let tmp = this.RAM.readWord(addr);
                    this.register.writeRegWord(AX_REG);
                }
                else
                {
                    let tmp = this.RAM.readByte(addr);
                    this.register.writeRegByte(AX_REG)
                }
            }

            this.Register[IP] += 3;
        }   
        //======================================================================================
        // -------Segment Register to Register/Memory-------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111101 == MOV_RM_SEGEMENT) 
        {
            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip));

            if (operandes.addr == null) 
            {   // R to R
                let R1 = operandes.opRegister[0],
                    R2 = operandes.opRegister[1];

                if ((instruction >> 1) % 2) // On extrait le d || d = 1 to reg
                {
                    let tmp = this.register.readWordReg(R2);
                    this.register.writeSegReg(R1, tmp);
                }
                else
                {
                    let tmp = this.register.readWordReg(R1);
                    this.register.writeSegReg(R2, tmp);    
                }
            }
            else
            {   // MEM TO/FROM R
                let R = operandes.opRegister[0],
                    addr = operandes.addr;

                if ((instruction >> 1) % 2) // On extrait le d
                    this.Register[R] =  this.RAM[addr];
                else
                    this.RAM[addr] =  this.Register[R];  

                if ((instruction >> 1) % 2) // On extrait le d || d = 1 to reg
                {
                    let tmp = this.RAM.readWord(addr);
                    this.register.writeSegReg(R, tmp);
                }
                else
                {
                    let tmp = this.register.readSegReg(R);
                    this.RAM.writeWord(addr, tmp);    
                }
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
        
        var current_ip = this.register.readReg(IP_REG),
            current_code_seg = this.register.readReg(CS_REG),
            current_data_segement = this.register.readReg(DS_REG);

        switch (mode) {
            case NO_DISP:      //No displacement

                if (rm == 0b110) {
                    addr = this.RAM.readWord(current_code_seg<<4 + current_ip+1);//WARING!!
                    addr += current_data_segement<<4;   //JE pense qu'on doit rajouter 2 par 1
                    dispSize = 2;
                }   
                else
                    addr = current_data_segement<<4 + this.getAddrIndir(rm);

                break;

            case IWEN_DISP:    // The displacement can be contained in one byte
                addr = this.getAddrIndir(rm) + this.RAM.readByte(current_code_seg<<4 + current_ip+1);
                addr += current_data_segement<<4;
                dispSize = 1;
                break;
        
            case SIN_DISP:    // The displacement is contained in two bytes
                addr = this.getAddrIndir(rm) + this.RAM.readWord(current_code_seg<<4 + current_ip+1);
                addr += current_data_segement<<4;
                dispSize = 2;
                break;
            
            case REG_MODE:
                opRegister[1] = rm;

        }

        return {
            addr: addr,
            dispSize: dispSize,
            opRegister: opRegister,//array
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


