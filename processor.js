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
            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip+1));

            if (operandes.addr == null) 
            {   // R to R
                let R1 = operandes.opRegister[0],
                    R2 = operandes.opRegister[1];

                if ( instruction % 2 == 1 ) 
                {
                    if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                        this.register.writeWordReg(R2, this.register.readWordReg(R1) );
                    
                    else
                        this.register.writeWordReg(R1, this.register.readWordReg(R2));
                    
                }
                else
                {
                    if ((instruction >> 1) % 2) // On extrait le dif
                        this.register.writeByteReg(R2, this.register.readByteReg(R1));
                    
                    else
                        this.register.writeByteReg(R1, this.register.readByteReg(R2));
                    
                } 
            }
            else
            {   // MEM TO/FROM R
                let R = operandes.opRegister[0],
                    addr = operandes.addr;

                if ( instruction % 2 == 1 ) //16bits
                {
                    if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                        this.register.writeWordReg(R, this.RAM.readWord(addr));
                    
                    else
                        this.RAM.writeWord(addr, this.register.readWordReg(R));// d=0 => from reg
                    
                }
                else    //8bits
                {
                    if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                        this.register.writeByteReg(R, this.RAM.readByte(addr) );
                    
                    else // d=0 => from reg
                        this.RAM.writeByte(addr, this.register.readByteReg(R));
                    
                } 
            }

            this.register.incIP(operandes.dispSize + 2);//2 étant la taille de base de l'instruction
        }
        //======================================================================================
        // -------Immediate to Register/Memory--------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111110 == MOV_IMMEDIATE_TO_RM) 
        {
            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip+1)),//On extrait le w
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
            var addr = current_data_segement<<4 +this.RAM.readWord(current_code_seg << 4 + current_ip+1);

            if((instruction >> 1) % 2 == 0) // d=0 => from reg
            {
                if (instruction%2 == 1) //w=1
                    this.RAM.writeWord(addr, this.register.readRegWord(AX_REG) );
                
                else
                    this.RAM.writeByte(addr, this.register.readRegByte(AX_REG));
                
            }
            else
            {
                if (instruction%2 == 1) //w=1
                    this.register.writeRegWord(AX_REG, this.RAM.readWord(addr));
                
                else
                    this.register.writeRegByte(AX_REG, this.RAM.readByte(addr));
                
            }

            this.register.incIP(3);
        }   
        //======================================================================================
        // -------Segment Register to Register/Memory-------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111101 == MOV_RM_SEGEMENT) 
        {
            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip+1));

            if (operandes.addr == null) 
            {   // R to R
                let R1 = operandes.opRegister[0],
                    R2 = operandes.opRegister[1];

                if ((instruction >> 1) % 2) // On extrait le d || d = 1 to reg
                    this.register.writeSegReg(R1, this.register.readWordReg(R2) );
                
                else
                    this.register.writeSegReg(R2, this.register.readWordReg(R1) );    
                
            }
            else
            {   // MEM TO/FROM R
                let R = operandes.opRegister[0],
                    addr = operandes.addr;


                if ((instruction >> 1) % 2) // On extrait le d || d = 1 to reg
                    this.register.writeSegReg(R, this.RAM.readWord(addr) );
                
                else
                    this.RAM.writeWord(addr, this.register.readSegReg(R));    
                
            }

            this.register.incIP(operandes.dispSize + 2);
        }
        else
            return -1;

        return 0;
    }


    decodeAdd(instruction){
        var current_ip = this.register.readReg(IP_REG),
            current_code_seg = this.register.readReg(CS_REG),
            current_data_segement = this.register.readReg(DS_REG);


        //======================================================================================
        // -------Register/Memory with Register----------------------------------------------
        //======================================================================================
        if ( instruction & 0b00000000 == ADD_REG_MEM || instruction & 0b00010000 == ADC_REG_MEM ) {

            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip));

            var carry = (instruction & 0x10 == ADC_REG_MEM) ? this.registerExtract('C') : 0;

            if (operandes.addr == null) 
            {   // R to R
                let R1 = operandes.opRegister[0],
                    R2 = operandes.opRegister[1];

                if ( instruction % 2 == 1 ) 
                {
                    if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                    {
                        let tmp = this.register.readWordReg(R2);
                        tmp += this.register.readWordReg(R2);
                        this.register.writeWordReg(R1, tmp + carry);
                    }
                    else
                    {
                        let tmp = this.register.readWordReg(R1);
                        tmp += this.register.readWordReg(R1);
                        this.register.writeWordReg(R2, tmp + carry);
                    }
                }
                else
                {
                    if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                    {
                        let tmp = this.register.readByteReg(R2);
                        tmp += this.register.readByteReg(R2);
                        this.register.writeByteReg(R1, tmp + carry);
                    }
                    else
                    {
                        let tmp = this.register.readByteReg(R1);
                        tmp += this.register.readByteReg(R1);
                        this.register.writeByteReg(R2, tmp + carry);
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
                        tmp += this.register.readWordReg(R);
                        this.register.writeWordReg(R, tmp + carry);
                    }
                    else
                    {
                        let tmp = this.register.readWordReg(R); // d=0 => from reg
                        tmp += this.RAM.readWord(addr);
                        this.RAM.writeWord(addr, tmp + carry);
                    }
                }
                else    //8bits
                {
                    if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                    {
                        let tmp = this.RAM.readByte(addr);
                        tmp += this.register.readByteReg(R);
                        this.register.writeByteReg(R, tmp + carry);
                    }
                    else
                    {
                        let tmp = this.register.readByteReg(R); // d=0 => from reg
                        tmp += this.RAM.readByte(addr);
                        this.RAM.writeByte(addr, tmp + carry);
                    }
                } 
            }

        }
        //======================================================================================
        // -------Register/Memory with Immediat----------------------------------------------
        //======================================================================================
        else if ( instruction & 0b10000000 == ADD_IMM) {//De même pour ADC

            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip+1)),
                immediateAddr = current_code_seg<<4 + current_ip + 2 + operandes.dispSize ;

            var carry = operandes.opRegister[0] == 0b010 ? this.registerExtract('C') : 0;

            if (operandes.addr == null) 
            {   // immediat to R
                let R = operandes.opRegister[0];

                if ( instruction % 2 == 1 ) 
                {
                    let tmp = this.register.readWordReg(R);
                    tmp += this.RAM.readWord(immediateAddr);
                    this.register.writeWordReg(R, tmp + carry);
                }
                else
                {
                    let tmp = this.register.readByteReg(R);
                    tmp += this.RAM.readByte(immediateAddr);
                    this.register.writeByteReg(R, tmp + carry);
                } 
            }
            else
            {   // immediat to Mem
                let addr = operandes.addr;

                if ( instruction % 2 == 1 ) //16bits
                {
                    let tmp = this.RAM.readWord(addr);
                    tmp += this.RAM.readWord(immediateAddr);
                    this.RAM.writeWord(R, tmp + carry); 
                }
                else    //8bits
                {
                    let tmp = this.RAM.readByte(addr);
                    tmp += this.RAM.readByte(immediateAddr);
                    this.RAM.writeByte(R, tmp + carry);
                } 
            }

        }
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


