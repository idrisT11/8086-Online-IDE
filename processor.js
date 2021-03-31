const MEMORY_SIZE = 1048576;

import "OPCODES.js"

class Processor{
    constructor(){
        this.RAM = new Memory(MEMORY_SIZE);
        this.register = new Registers();

        this.activeSegment = 0b11; // Par defaut on travail sur le DATA SEGMENT (ds_id = 0b11)
    }

    decode(){
        var current_ip = this.register.readReg(IP_REG),
            current_code_seg = this.register.readReg(CS_REG),
            instruction = this.RAM.readByte( (current_code_seg<<4) + current_ip );

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

            var carry = operandes.opRegister[0] == 0b010 ? this.extractFlag('C') : 0;

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
      decodeMul(instruction)
    {
        var current_ip = this.register.readReg(IP_REG),
        current_code_segement = this.register.readReg(CS_REG);
       
        if(instruction &0b11111100==0b1111011 &&(this.RAM.readByte(current_code_segement<<4 + current_ip+1)<<2)>>3==0b100)
        {   
                var operandes = this.extractOperand(this.RAM.readByte(current_code_segement<<4 + current_ip+1));
                
                if(operandes.addr==null)
                {
                    var R2 = operandes.opRegister[1];
                    if(instruction%2==1)//16 bit
                        this.register.mulReg(R2,WORD_NS_REGISTER);
                    
                    else 
                        this.register.mulReg(R2,BYTE_REGISTER);
                    
                }
                else 
                {
                
                    if(instruction%2==1)//16 bit
                    {
                        
                        let val = this.RAM.readWord(operandes.addr);
                        let ax = this.register.readWordReg(AX_REG);//ax
                        ax*=val;
                    if(ax>>16==0)
                    {
                        this.register.writeWordReg(AX_REG,ax);
                    }
                    else 
                    {
                        this.register.writeWordReg(AX_REG,ax&0x0000ffff);
                        this.register.writeWordReg(DX_REG,ax&0xffff0000);
                    }

                    
                    
                        
                    }
                    else 
                    {

                        let val = this.RAM.readByte(operandes.addr);
                        let al = this.register.readByteReg(0);//al
                        al*=val;
                        if(al>>8==0)
                        {
                            this.register.writeByteReg(0,al);
                        }
                        else 
                        {
                    
                            this.register.writeWordReg(0,al>>8);//ah
                            this.register.writeByteReg(0,al%256);//al
                        }
                    
                    }
                }
           
        }

        this.register.incIP(operandes.dispSize + 2);
    }
    //
    decodeDiv(instruction)
    {
        var current_ip = this.register.readReg(IP_REG),
        current_code_segement = this.register.readReg(CS_REG);
        if(instruction &0b1111011==0b1111011 &&(this.RAM.readByte(current_code_segement<<4 + current_ip+1)<<2)>>3==b110)
        {
                    

                var operandes = this.extractOperand(this.RAM.readByte(current_code_segement<<4 + current_ip+1));
                if(operandes.addr==null)
                {
                    R2 = operandes.opRegister[1];
                    if(instruction%2==1)//16 bit
                    {
                        this.register.divReg(R2,WORD_NS_REGISTER);
                    }
                    else 
                    {
                        this.register.divReg(R2,BYTE_REGISTER);
                    }
                }
                else 
                {
                
                    if(instruction%2==1)//16 bit
                    {
                        
                        let val = this.RAM.readWord(operandes.addr);
                        let ax = this.register.readWordReg(AX_REG);//ax
                        this.register.writeWordReg(AX_REG,Math.floor(val/ax));
                        this.register.writeWordReg(DX_REG,val%ax);

                    
                    
                        
                    }
                    else 
                    {

                        let val = this.RAM.readByte(operandes.addr);
                        let al = this.register.readByteReg(0);//al
                        this.register.writeByteReg(0,Math.floor(val/al));//al
                        this.register.writeByteReg(0,math.floor(val%al));//ah

                    }
                }
           
        }

        this.register.incIP(operandes.dispSize + 2);
    }

      //and
   decodeAnd(instruction)
   {
      
            var current_ip = this.register.readReg(IP_REG),
            current_code_segement = this.register.readReg(CS_REG);
            var operandes = this.extractOperand(this.RAM.readByte(current_code_segement<<4 + current_ip+1));
        if (instruction & 0b11111100 == AND_RM_RM ) 
        {
                var current_ip = this.register.readReg(IP_REG),
                    current_code_segement = this.register.readReg(CS_REG);

                var operandes = this.extractOperand(this.RAM.readByte(current_code_segement<<4 + current_ip+1));

                if (operandes.addr == null) 
                {   // R to R-----------------------------------------------------
                    let R1 = operandes.opRegister[0],
                        R2 = operandes.opRegister[1];
                
                        if ( instruction % 2 == 1 ) 
                        {
                            if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                                this.register.writeWordReg(R2, this.register.readWordReg(R2)&this.register.readWordReg(R1) );
                            
                            else
                                this.register.writeWordReg(R1, this.register.readWordReg(R1)&this.register.readWordReg(R2));
                            
                        }
                        else
                        {
                            if ((instruction >> 1) % 2) // On extrait le dif
                                this.register.writeByteReg(R2, this.register.readByteReg(R2)&this.register.readByteReg(R1));
                            
                            else
                                this.register.writeByteReg(R1, this.register.readByteReg(R1)&this.register.readByteReg(R2));
                            
                        } 
                
                       
                    
                
                }
                else
                {   // MEM TO/FROM R----------------------------------------------
                    let R = operandes.opRegister[0],
                        addr = operandes.addr;

                    if ( instruction % 2 == 1 ) //16bits //the w bit
                    {
                        if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                        {
                            let tmp = this.RAM.readWord(addr);
                            this.register.writeWordReg(R, this.register.readWordReg(R)&tmp);
                        }
                        else
                        {
                            let tmp = this.register.readWordReg(R); // d=0 => from reg
                            this.RAM.writeWord(addr, this.RAM.readWord(addr)&tmp);
                        }
                    }
                    else    //8bits
                    {
                        if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                        {
                            let tmp = this.RAM.readByte(addr);
                            this.register.writeByteReg(R, this.register.readByteReg(R)&tmp);
                        }
                        else
                        {
                            let tmp = this.register.readByteReg(R); // d=0 => from reg
                            this.RAM.writeByte(addr, this.RAM.readByte(addr)&tmp);
                        }
                    } 
                }

            this.register.incIP(operandes.dispSize + 2);//2 étant la taille de base de l'instruction
            //(pour passer a la prochaine instruction)
        }
        //======================================================================================
        // -------Immediate to Register/Memory--------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111110 == AND_IMMEDIATE_TO_RM) 
        {
            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip+1)),//On extrait le w
                immediateAddr = current_code_seg<<4 + current_ip + 2 + operandes.dispSize ;

            var R = operandes.opRegister[0],
                addr = operandes.addr;

            if (instruction % 2 == 1)  // the w bit //16bits
            {
                let immediatVal = this.RAM.readWord(immediateAddr);

                if (addr == null)  //immediate to register case
                    this.register.writeWordReg( R, this.register.readWordReg(R)&immediatVal); 
                else //immediate to memory case
                    this.RAM.writeWord(addr,this.RAM.readWord(addr)&immediatVal);
            } 
            else//8 bits
            {
                let immediatVal = this.RAM.readByte(immediateAddr);

                if (addr == null) 
                    this.register.writeByteReg( R, this.register.readByteReg(R)&immediatVal); 
                else
                    this.RAM.writeByte(addr,this.RAM.readByte(addr)&immediatVal);
            }

            this.register.incIP(operandes.dispSize + (instruction % 2) + 3);
        }
        //
         //======================================================================================
        // -------Immediate to Acc--------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111110 == AND_IMMEDIATE_TO_Acc) 
        {
            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip+1)),//On extrait le w
                immediateAddr = current_code_seg<<4 + current_ip + 2 + operandes.dispSize ;

            

            if (instruction % 2 == 1)  // the w bit //16bits
            {
                let immediatVal = this.RAM.readWord(immediateAddr);
                this.register.writeWordReg( AX_REG, this.register.readWordReg(AX_REG)&immediatVal); 
                
            } 
            else//8 bits
            {
                let immediatVal = this.RAM.readByte(immediateAddr);

               
                    this.register.writeByteReg( AX_REG, this.register.writeByteReg(AX_REG)&immediatVal); 
               
            }

            this.register.incIP(operandes.dispSize + (instruction % 2) + 3);
        }
       
       
   }


//decodeNot
   decodeNot(instruction)
   {
    let current_ip=this.register.readWordReg(IP_REG);
    let current_code_segement=this.register(CS_REG);
    
       if(instruction&b11111110==NOT&&(this.RAM.readRegByte(current_code_segement<<16+current_ip+1)<<2)>>3)
       {
        let operandes=this.extractOperand(this.RAM.readRegByte(current_code_segement<<16+current_ip+1));
        if(operandes.addr==null) // not reg
        {
            let R=operandes.opRegister[1];

            if(instruction%2==1)//w
            {
                let val=this.register.readWordReg(R);
                val=0-val;
                this.register.writeWordReg(R,val);

            }else 
            {
                let val=this.register.readByteReg(R);
                val=0-val;
                this.register.writeBytewReg(R,val);

            }
        }
        else  //NOT [addr]
        {
            if(instruction%2==1)//w
            {
                let val=this.RAM.readWord(operandes.addr);
                val=0-val;
                this.register.writeWord(operandes.addr,val);

            }else 
            {
                let val=this.RAM.readByte(operandes.addr);
                val=0-val;
                this.RAM.writeByte(operandes.addr,val);

            }

        }
        this.register.incIP(operandes.dispSize + (instruction % 2) + 3);
       }
       
   }
   //

    //or
   decodeOr(instruction)
   {
      
            var current_ip = this.register.readReg(IP_REG),
            current_code_segement = this.register.readReg(CS_REG);
            var operandes = this.extractOperand(this.RAM.readByte(current_code_segement<<4 + current_ip+1));
        if (instruction & 0b11111100 == OR_RM_RM ) 
        {
                var current_ip = this.register.readReg(IP_REG),
                    current_code_segement = this.register.readReg(CS_REG);

                var operandes = this.extractOperand(this.RAM.readByte(current_code_segement<<4 + current_ip+1));

                if (operandes.addr == null) 
                {   // R to R-----------------------------------------------------
                    let R1 = operandes.opRegister[0],
                        R2 = operandes.opRegister[1];
                
                        if ( instruction % 2 == 1 ) 
                        {
                            if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                                this.register.writeWordReg(R2, this.register.readWordReg(R2)|this.register.readWordReg(R1) );
                            
                            else
                                this.register.writeWordReg(R1, this.register.readWordReg(R1)|this.register.readWordReg(R2));
                            
                        }
                        else
                        {
                            if ((instruction >> 1) % 2) // On extrait le dif
                                this.register.writeByteReg(R2, this.register.readByteReg(R2)|this.register.readByteReg(R1));
                            
                            else
                                this.register.writeByteReg(R1, this.register.readByteReg(R1)|this.register.readByteReg(R2));
                            
                        } 
                
                       
                    
                
                }
                else
                {   // MEM TO/FROM R----------------------------------------------
                    let R = operandes.opRegister[0],
                        addr = operandes.addr;

                    if ( instruction % 2 == 1 ) //16bits //the w bit
                    {
                        if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                        {
                            let tmp = this.RAM.readWord(addr);
                            this.register.writeWordReg(R, this.register.readWordReg(R)|tmp);
                        }
                        else
                        {
                            let tmp = this.register.readWordReg(R); // d=0 => from reg
                            this.RAM.writeWord(addr, this.RAM.readWord(addr)|tmp);
                        }
                    }
                    else    //8bits
                    {
                        if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                        {
                            let tmp = this.RAM.readByte(addr);
                            this.register.writeByteReg(R, this.register.readByteReg(R)|tmp);
                        }
                        else
                        {
                            let tmp = this.register.readByteReg(R); // d=0 => from reg
                            this.RAM.writeByte(addr, this.RAM.readByte(addr)|tmp);
                        }
                    } 
                }

            this.register.incIP(operandes.dispSize + 2);//2 étant la taille de base de l'instruction
            //(pour passer a la prochaine instruction)
        }
        //======================================================================================
        // -------Immediate to Register/Memory--------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111110 == OR_IMMEDIATE_TO_RM) 
        {
            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip+1)),//On extrait le w
                immediateAddr = current_code_seg<<4 + current_ip + 2 + operandes.dispSize ;

            var R = operandes.opRegister[0],
                addr = operandes.addr;

            if (instruction % 2 == 1)  // the w bit //16bits
            {
                let immediatVal = this.RAM.readWord(immediateAddr);

                if (addr == null)  //immediate to register case
                    this.register.writeWordReg( R, this.register.readWordReg(R)|immediatVal); 
                else //immediate to memory case
                    this.RAM.writeWord(addr,this.RAM.readWord(addr)|immediatVal);
            } 
            else//8 bits
            {
                let immediatVal = this.RAM.readByte(immediateAddr);

                if (addr == null) 
                    this.register.writeByteReg( R, this.register.readByteReg(R)|immediatVal); 
                else
                    this.RAM.writeByte(addr,this.RAM.readByte(addr)|immediatVal);
            }

            this.register.incIP(operandes.dispSize + (instruction % 2) + 3);
        }
        //
         //======================================================================================
        // -------Immediate to Acc--------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111110 == OR_IMMEDIATE_TO_Acc) 
        {
            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip+1)),//On extrait le w
              immediateAddr = current_code_seg<<4 + current_ip + 2 + operandes.dispSize ;

            

            if (instruction % 2 == 1)  // the w bit //16bits
            {
                let immediatVal = this.RAM.readWord(immediateAddr);
                this.register.writeWordReg( AX_REG, this.register.readWordReg(AX_REG)|immediatVal); 
                
            } 
            else//8 bits
            {
                let immediatVal = this.RAM.readByte(immediateAddr);

               
                    this.register.writeByteReg( AX_REG, this.register.writeByteReg(AX_REG)|immediatVal); 
               
            }

            this.register.incIP(operandes.dispSize + (instruction % 2) + 3);
        }
       
       

   }
     //xor
   decodeXor(instruction)
   {
      
            var current_ip = this.register.readReg(IP_REG),
            current_code_segement = this.register.readReg(CS_REG);
            var operandes = this.extractOperand(this.RAM.readByte(current_code_segement<<4 + current_ip+1));
        if (instruction & 0b11111100 == XOR_RM_RM ) 
        {
                var current_ip = this.register.readReg(IP_REG),
                    current_code_segement = this.register.readReg(CS_REG);

                var operandes = this.extractOperand(this.RAM.readByte(current_code_segement<<4 + current_ip+1));

                if (operandes.addr == null) 
                {   // R to R-----------------------------------------------------
                    let R1 = operandes.opRegister[0],
                        R2 = operandes.opRegister[1];
                
                        if ( instruction % 2 == 1 ) 
                        {
                            if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                                this.register.writeWordReg(R2, this.register.readWordReg(R2)^this.register.readWordReg(R1) );
                            
                            else
                                this.register.writeWordReg(R1, this.register.readWordReg(R1)^this.register.readWordReg(R2));
                            
                        }
                        else
                        {
                            if ((instruction >> 1) % 2) // On extrait le dif
                                this.register.writeByteReg(R2, this.register.readByteReg(R2)^this.register.readByteReg(R1));
                            
                            else
                                this.register.writeByteReg(R1, this.register.readByteReg(R1)^this.register.readByteReg(R2));
                            
                        } 
                
                       
                    
                
                }
                else
                {   // MEM TO/FROM R----------------------------------------------
                    let R = operandes.opRegister[0],
                        addr = operandes.addr;

                    if ( instruction % 2 == 1 ) //16bits //the w bit
                    {
                        if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                        {
                            let tmp = this.RAM.readWord(addr);
                            this.register.writeWordReg(R, this.register.readWordReg(R)^tmp);
                        }
                        else
                        {
                            let tmp = this.register.readWordReg(R); // d=0 => from reg
                            this.RAM.writeWord(addr, this.RAM.readWord(addr)^tmp);
                        }
                    }
                    else    //8bits
                    {
                        if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                        {
                            let tmp = this.RAM.readByte(addr);
                            this.register.writeByteReg(R, this.register.readByteReg(R)^tmp);
                        }
                        else
                        {
                            let tmp = this.register.readByteReg(R); // d=0 => from reg
                            this.RAM.writeByte(addr, this.RAM.readByte(addr)^tmp);
                        }
                    } 
                }

            this.register.incIP(operandes.dispSize + 2);//2 étant la taille de base de l'instruction
            //(pour passer a la prochaine instruction)
        }
        //======================================================================================
        // -------Immediate to Register/Memory--------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111110 == XOR_IMMEDIATE_TO_RM) 
        {
            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip+1)),//On extrait le w
                immediateAddr = current_code_seg<<4 + current_ip + 2 + operandes.dispSize ;

            var R = operandes.opRegister[0],
                addr = operandes.addr;

            if (instruction % 2 == 1)  // the w bit //16bits
            {
                let immediatVal = this.RAM.readWord(immediateAddr);

                if (addr == null)  //immediate to register case
                    this.register.writeWordReg( R, this.register.readWordReg(R)^immediatVal); 
                else //immediate to memory case
                    this.RAM.writeWord(addr,this.RAM.readWord(addr)^immediatVal);
            } 
            else//8 bits
            {
                let immediatVal = this.RAM.readByte(immediateAddr);

                if (addr == null) 
                    this.register.writeByteReg( R, this.register.readByteReg(R)^immediatVal); 
                else
                    this.RAM.writeByte(addr,this.RAM.readByte(addr)^immediatVal);
            }

            this.register.incIP(operandes.dispSize + (instruction % 2) + 3);
        }
        //
         //======================================================================================
        // -------Immediate to Acc--------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111110 == XOR_IMMEDIATE_TO_Acc) 
        {
            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip+1)),//On extrait le w
              immediateAddr = current_code_seg<<4 + current_ip + 2 + operandes.dispSize ;

            

            if (instruction % 2 == 1)  // the w bit //16bits
            {
                let immediatVal = this.RAM.readWord(immediateAddr);
                this.register.writeWordReg( AX_REG, this.register.readWordReg(AX_REG)^immediatVal); 
                
            } 
            else//8 bits
            {
                let immediatVal = this.RAM.readByte(immediateAddr);

               
                    this.register.writeByteReg( AX_REG, this.register.writeByteReg(AX_REG)^immediatVal); 
               
            }

            this.register.incIP(operandes.dispSize + (instruction % 2) + 3);
        }
       
       

   }
    //Test
   decodeTest(instruction)
   {
      
            var current_ip = this.register.readReg(IP_REG),
            current_code_segement = this.register.readReg(CS_REG);
            var operandes = this.extractOperand(this.RAM.readByte(current_code_segement<<4 + current_ip+1));
            let test=0;
        if (instruction & 0b11111100 == TEST_RM_RM ) 
        {
                var current_ip = this.register.readReg(IP_REG),
                    current_code_segement = this.register.readReg(CS_REG);

                var operandes = this.extractOperand(this.RAM.readByte(current_code_segement<<4 + current_ip+1));

                if (operandes.addr == null) 
                {   // R to R-----------------------------------------------------
                    let R1 = operandes.opRegister[0],
                        R2 = operandes.opRegister[1];
                
                        if ( instruction % 2 == 1 ) 
                        {
                            if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                                test=this.register.readWordReg(R2)&this.register.readWordReg(R1);
                            
                            else
                                test=this.register.readWordReg(R1)&this.register.readWordReg(R2);
                            
                        }
                        else
                        {
                            if ((instruction >> 1) % 2) // On extrait le dif
                                test=this.register.readByteReg(R2)&this.register.readByteReg(R1);
                            
                            else
                                test=this.register.readByteReg(R1)&this.register.readByteReg(R2);
                            
                        } 
                
                       
                    
                
                }
                else
                {   // MEM TO/FROM R----------------------------------------------
                    let R = operandes.opRegister[0],
                        addr = operandes.addr;

                    if ( instruction % 2 == 1 ) //16bits //the w bit
                    {
                        if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                        {
                            let tmp = this.RAM.readWord(addr);
                            test=this.register.readWordReg(R)&tmp;
                        }
                        else
                        {
                            let tmp = this.register.readWordReg(R); // d=0 => from reg
                            test=this.RAM.readWord(addr)&tmp;
                        }
                    }
                    else    //8bits
                    {
                        if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                        {
                            let tmp = this.RAM.readByte(addr);
                            test=this.register.readByteReg(R)&tmp;
                        }
                        else
                        {
                            let tmp = this.register.readByteReg(R); // d=0 => from reg
                            test=this.RAM.readByte(addr)&tmp;
                        }
                    } 
                }

            this.register.incIP(operandes.dispSize + 2);//2 étant la taille de base de l'instruction
            //(pour passer a la prochaine instruction)
        }
        //======================================================================================
        // -------Immediate to Register/Memory--------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111110 == TEST_IMMEDIATE_TO_RM) 
        {
            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip+1)),//On extrait le w
                immediateAddr = current_code_seg<<4 + current_ip + 2 + operandes.dispSize ;

            var R = operandes.opRegister[0],
                addr = operandes.addr;

            if (instruction % 2 == 1)  // the w bit //16bits
            {
                let immediatVal = this.RAM.readWord(immediateAddr);

                if (addr == null)  //immediate to register case
                    this.register.writeWordReg( R, this.register.readWordReg(R)&immediatVal); 
                else //immediate to memory case
                    test=this.RAM.readWord(addr)&immediatVal;
            } 
            else//8 bits
            {
                let immediatVal = this.RAM.readByte(immediateAddr);

                if (addr == null) 
                    test=this.register.readByteReg(R)&immediatVal;
                else
                    test=this.RAM.readByte(addr)&immediatVal;
            }

            this.register.incIP(operandes.dispSize + (instruction % 2) + 3);
        }
        //
         //======================================================================================
        // -------Immediate to Acc--------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111110 == TEST_IMMEDIATE_TO_Acc) 
        {
            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip+1)),//On extrait le w
                immediateAddr = current_code_seg<<4 + current_ip + 2 + operandes.dispSize ;

            

            if (instruction % 2 == 1)  // the w bit //16bits
            {
                let immediatVal = this.RAM.readWord(immediateAddr);
                test=this.register.readWordReg(AX_REG)&immediatVal;
                
            } 
            else//8 bits
            {
                let immediatVal = this.RAM.readByte(immediateAddr);

               
                    test=this.register.writeByteReg(AX_REG)&immediatVal;
               
            }

            this.register.incIP(operandes.dispSize + (instruction % 2) + 3);
        }
       
       //setting the flags according to the test variable values
       switch(test)
       {
           //...
       }
       
   }
     //or
   decodeOr(instruction)
   {
      
            var current_ip = this.register.readReg(IP_REG),
            current_code_segement = this.register.readReg(CS_REG);
            var operandes = this.extractOperand(this.RAM.readByte(current_code_segement<<4 + current_ip+1));
        if (instruction & 0b11111100 == OR_RM_RM ) 
        {
                var current_ip = this.register.readReg(IP_REG),
                    current_code_segement = this.register.readReg(CS_REG);

                var operandes = this.extractOperand(this.RAM.readByte(current_code_segement<<4 + current_ip+1));

                if (operandes.addr == null) 
                {   // R to R-----------------------------------------------------
                    let R1 = operandes.opRegister[0],
                        R2 = operandes.opRegister[1];
                
                        if ( instruction % 2 == 1 ) 
                        {
                            if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                                this.register.writeWordReg(R2, this.register.readWordReg(R2)|this.register.readWordReg(R1) );
                            
                            else
                                this.register.writeWordReg(R1, this.register.readWordReg(R1)|this.register.readWordReg(R2));
                            
                        }
                        else
                        {
                            if ((instruction >> 1) % 2) // On extrait le dif
                                this.register.writeByteReg(R2, this.register.readByteReg(R2)|this.register.readByteReg(R1));
                            
                            else
                                this.register.writeByteReg(R1, this.register.readByteReg(R1)|this.register.readByteReg(R2));
                            
                        } 
                
                       
                    
                
                }
                else
                {   // MEM TO/FROM R----------------------------------------------
                    let R = operandes.opRegister[0],
                        addr = operandes.addr;

                    if ( instruction % 2 == 1 ) //16bits //the w bit
                    {
                        if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                        {
                            let tmp = this.RAM.readWord(addr);
                            this.register.writeWordReg(R, this.register.readWordReg(R)|tmp);
                        }
                        else
                        {
                            let tmp = this.register.readWordReg(R); // d=0 => from reg
                            this.RAM.writeWord(addr, this.RAM.readWord(addr)|tmp);
                        }
                    }
                    else    //8bits
                    {
                        if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                        {
                            let tmp = this.RAM.readByte(addr);
                            this.register.writeByteReg(R, this.register.readByteReg(R)|tmp);
                        }
                        else
                        {
                            let tmp = this.register.readByteReg(R); // d=0 => from reg
                            this.RAM.writeByte(addr, this.RAM.readByte(addr)|tmp);
                        }
                    } 
                }

            this.register.incIP(operandes.dispSize + 2);//2 étant la taille de base de l'instruction
            //(pour passer a la prochaine instruction)
        }
        //======================================================================================
        // -------Immediate to Register/Memory--------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111110 == OR_IMMEDIATE_TO_RM) 
        {
            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip+1)),//On extrait le w
                immediateAddr = current_code_seg<<4 + current_ip + 2 + operandes.dispSize ;

            var R = operandes.opRegister[0],
                addr = operandes.addr;

            if (instruction % 2 == 1)  // the w bit //16bits
            {
                let immediatVal = this.RAM.readWord(immediateAddr);

                if (addr == null)  //immediate to register case
                    this.register.writeWordReg( R, this.register.readWordReg(R)|immediatVal); 
                else //immediate to memory case
                    this.RAM.writeWord(addr,this.RAM.readWord(addr)|immediatVal);
            } 
            else//8 bits
            {
                let immediatVal = this.RAM.readByte(immediateAddr);

                if (addr == null) 
                    this.register.writeByteReg( R, this.register.readByteReg(R)|immediatVal); 
                else
                    this.RAM.writeByte(addr,this.RAM.readByte(addr)|immediatVal);
            }

            this.register.incIP(operandes.dispSize + (instruction % 2) + 3);
        }
        //
         //======================================================================================
        // -------Immediate to Acc--------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111110 == OR_IMMEDIATE_TO_Acc) 
        {
            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip+1)),//On extrait le w
              immediateAddr = current_code_seg<<4 + current_ip + 2 + operandes.dispSize ;

            

            if (instruction % 2 == 1)  // the w bit //16bits
            {
                let immediatVal = this.RAM.readWord(immediateAddr);
                this.register.writeWordReg( AX_REG, this.register.readWordReg(AX_REG)|immediatVal); 
                
            } 
            else//8 bits
            {
                let immediatVal = this.RAM.readByte(immediateAddr);

               
                    this.register.writeByteReg( AX_REG, this.register.writeByteReg(AX_REG)|immediatVal); 
               
            }

            this.register.incIP(operandes.dispSize + (instruction % 2) + 3);
        }
       
       
   }
   //xor
   decodeXor(instruction)
   {
      
            var current_ip = this.register.readReg(IP_REG),
            current_code_segement = this.register.readReg(CS_REG);
            var operandes = this.extractOperand(this.RAM.readByte(current_code_segement<<4 + current_ip+1));
        if (instruction & 0b11111100 == XOR_RM_RM ) 
        {
                var current_ip = this.register.readReg(IP_REG),
                    current_code_segement = this.register.readReg(CS_REG);

                var operandes = this.extractOperand(this.RAM.readByte(current_code_segement<<4 + current_ip+1));

                if (operandes.addr == null) 
                {   // R to R-----------------------------------------------------
                    let R1 = operandes.opRegister[0],
                        R2 = operandes.opRegister[1];
                
                        if ( instruction % 2 == 1 ) 
                        {
                            if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                                this.register.writeWordReg(R2, this.register.readWordReg(R2)^this.register.readWordReg(R1) );
                            
                            else
                                this.register.writeWordReg(R1, this.register.readWordReg(R1)^this.register.readWordReg(R2));
                            
                        }
                        else
                        {
                            if ((instruction >> 1) % 2) // On extrait le dif
                                this.register.writeByteReg(R2, this.register.readByteReg(R2)^this.register.readByteReg(R1));
                            
                            else
                                this.register.writeByteReg(R1, this.register.readByteReg(R1)^this.register.readByteReg(R2));
                            
                        } 
                
                       
                    
                
                }
                else
                {   // MEM TO/FROM R----------------------------------------------
                    let R = operandes.opRegister[0],
                        addr = operandes.addr;

                    if ( instruction % 2 == 1 ) //16bits //the w bit
                    {
                        if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                        {
                            let tmp = this.RAM.readWord(addr);
                            this.register.writeWordReg(R, this.register.readWordReg(R)^tmp);
                        }
                        else
                        {
                            let tmp = this.register.readWordReg(R); // d=0 => from reg
                            this.RAM.writeWord(addr, this.RAM.readWord(addr)^tmp);
                        }
                    }
                    else    //8bits
                    {
                        if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                        {
                            let tmp = this.RAM.readByte(addr);
                            this.register.writeByteReg(R, this.register.readByteReg(R)^tmp);
                        }
                        else
                        {
                            let tmp = this.register.readByteReg(R); // d=0 => from reg
                            this.RAM.writeByte(addr, this.RAM.readByte(addr)^tmp);
                        }
                    } 
                }

            this.register.incIP(operandes.dispSize + 2);//2 étant la taille de base de l'instruction
            //(pour passer a la prochaine instruction)
        }
        //======================================================================================
        // -------Immediate to Register/Memory--------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111110 == XOR_IMMEDIATE_TO_RM) 
        {
            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip+1)),//On extrait le w
                immediateAddr = current_code_seg<<4 + current_ip + 2 + operandes.dispSize ;

            var R = operandes.opRegister[0],
                addr = operandes.addr;

            if (instruction % 2 == 1)  // the w bit //16bits
            {
                let immediatVal = this.RAM.readWord(immediateAddr);

                if (addr == null)  //immediate to register case
                    this.register.writeWordReg( R, this.register.readWordReg(R)^immediatVal); 
                else //immediate to memory case
                    this.RAM.writeWord(addr,this.RAM.readWord(addr)^immediatVal);
            } 
            else//8 bits
            {
                let immediatVal = this.RAM.readByte(immediateAddr);

                if (addr == null) 
                    this.register.writeByteReg( R, this.register.readByteReg(R)^immediatVal); 
                else
                    this.RAM.writeByte(addr,this.RAM.readByte(addr)^immediatVal);
            }

            this.register.incIP(operandes.dispSize + (instruction % 2) + 3);
        }
        //
         //======================================================================================
        // -------Immediate to Acc--------------------------------------------------
        //======================================================================================
        else if (instruction & 0b11111110 == XOR_IMMEDIATE_TO_Acc) 
        {
            var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + current_ip+1)),//On extrait le w
              immediateAddr = current_code_seg<<4 + current_ip + 2 + operandes.dispSize ;

            

            if (instruction % 2 == 1)  // the w bit //16bits
            {
                let immediatVal = this.RAM.readWord(immediateAddr);
                this.register.writeWordReg( AX_REG, this.register.readWordReg(AX_REG)^immediatVal); 
                
            } 
            else//8 bits
            {
                let immediatVal = this.RAM.readByte(immediateAddr);

               
                    this.register.writeByteReg( AX_REG, this.register.writeByteReg(AX_REG)^immediatVal); 
               
            }

            this.register.incIP(operandes.dispSize + (instruction % 2) + 3);
        }
       
       
   }

    decodeJmpCall(instruction){
        var current_ip = this.register.readReg(IP_REG),
            current_code_seg = this.register.readReg(CS_REG),
            current_data_segement = this.register.readReg(DS_REG);

        //======================================================================================
        // -------UNCONDITIONAL JUMP IN SEGMENT DIRECT----------------------------------------------
        //======================================================================================
        if ( instruction & 0xFF == JMP_SEG ) 
        {
            let disp = this.RAM.readWord(current_code_seg<<4 + current_ip + 1);

            this.register.writeReg(IP_REG, disp);
        }

        //======================================================================================
        // -------SHORT UNCONDITIONAL JUMP IN SEGMENT DIRECT----------------------------------------------
        //======================================================================================
        else if ( instruction & 0xFF == JMP_SEG_SHORT ) 
        {
            let disp = this.RAM.readByte(current_code_seg<<4 + current_ip + 1);

            disp |= (this.register.readReg(IP_REG) & 0xFF00);

            this.register.writeReg(IP_REG, disp);
        }

        //======================================================================================
        // -------UNCONDITIONAL JUMP/CALL IN/INTER SEGEMENT INDIRECT----------------------------------------------
        //======================================================================================
        else if ( instruction & 0xFF == JMP_IND_SEG ) 
        {
            let operandes = this.extractOperand(current_code_seg<<4 + current_ip + 1);
            //INDIRECT JUMP In SEGMENT
            if ( operandes.opRegister[0] == 0b100 ) {

                if ( operandes.addr == null ) 
                {
                    let disp = this.register.readReg( operandes.opRegister[1] );
                    this.register.writeReg(IP_REG, disp);
                }
                else
                {
                    //WARNING ADDR ILA ZYISS L'OFFSET
                    let disp = this.RAM.readWord( operandes.addr );
                    this.register.writeReg(IP_REG, disp);
                }
            }

            //INDIRECT JUMP INTER SEGMENT
            else if ( operandes.opRegister[0] == 0b101 ) {
                console.log('salem khay');
            }

            //INDIRECT CALL IN SEGMENT
            else if ( operandes.opRegister[0] == 0b010 ) {

                if ( operandes.addr == null ) 
                {
                    let disp = this.register.readReg( operandes.opRegister[1] );
                    let old_IP = this.register.readReg( IP_REG );
                    this.register.writeReg(IP_REG, disp);

                    this.register.incSP();
                    this.RAM.writeWord( this.register.readReg( SS_REG )<<4 
                                      + this.register.readReg( SP_REG ),
                                        old_IP );
                }
                else
                {
                    //WARNING ADDR ILA ZYISS L'OFFSET
                    this.register.writeReg(IP_REG, disp);
                }
            }

            //INDIRECT CALL INTER SEGMENT
            else if ( operandes.opRegister[0] == 0b011 ) {
                console.log('salem khay');
            }
        }
        //======================================================================================
        // -------UNCONDITIONAL JUMP INTERSEGEMENT DIRECT----------------------------------------------
        //======================================================================================
        else if ( instruction & 0xFF == JMP_DIR_INTSEG ) 
        {
            let dispOFF = this.RAM.readWord(current_code_seg<<4 + current_ip + 1),
                dispSEG = this.RAM.readWord(current_code_seg<<4 + current_ip + 3);

            this.register.writeReg(IP_REG, dispOFF);
            this.register.writeReg(CS_REG, dispSEG);
        }
        //======================================================================================
        // -------CALL IN SEGEMENT DIRECT----------------------------------------------
        //======================================================================================
        else if ( instruction & 0xFF == CALL_DIR_SEG ) 
        {
            let disp = this.RAM.readWord(current_code_seg<<4 + current_ip + 1);
            let old_IP = this.register.readReg( IP_REG );

            this.register.incSP();
            this.RAM.writeWord( this.register.readReg( SS_REG )<<4 
                              + this.register.readReg( SP_REG ),
                                old_IP );
            this.register.writeReg(IP_REG, disp);
        }
        //======================================================================================
        // -------CALL INTERSEGEMENT DIRECT----------------------------------------------
        //======================================================================================
        else if ( instruction & 0xFF == CALL_DIR_INTSEG ) 
        {
            let dispOFF = this.RAM.readWord(current_code_seg<<4 + current_ip + 1),
                dispSEG = this.RAM.readWord(current_code_seg<<4 + current_ip + 1);
            let old_IP = this.register.readReg( IP_REG ),
                old_CS = this.register.readReg( CS_REG );

            this.register.incSP();
            this.RAM.writeWord( this.register.readReg( SS_REG )<<4 
                              + this.register.readReg( SP_REG ),
                                old_CS );

            this.register.incSP();
            this.RAM.writeWord( this.register.readReg( SS_REG )<<4 
                              + this.register.readReg( SP_REG ),
                                old_IP );
            
            this.register.writeReg(CS_REG, dispSEG);
            this.register.writeReg(IP_REG, dispOFF);
        }
        else
            return -1;

        return 0;
    }

    decodeRet(instruction)
    {
        var current_ip = this.register.readReg(IP_REG),
            current_code_seg = this.register.readReg(CS_REG),
            current_data_segement = this.register.readReg(DS_REG);

        if ( instruction & 0xFF == RET_SEG ) 
        {
            let new_IP = this.RAM.readWord( this.register.readReg( SS_REG )<<4 
                                          + this.register.readReg( SP_REG ));
            this.register.decSP();

            this.register.writeReg(IP_REG, new_IP);
        }

        else if ( instruction & 0xFF == RET_INTERSEG ) 
        {
            let new_IP = this.RAM.readWord( this.register.readReg( SS_REG )<<4 
                                          + this.register.readReg( SP_REG ));
            this.register.decSP();

            let new_CS = this.RAM.readWord( this.register.readReg( SS_REG )<<4 
                                          + this.register.readReg( SP_REG ));
            
            this.register.decSP();

            this.register.writeReg(IP_REG, new_IP);
            this.register.writeReg(CS_REG, new_CS);
        }
    }

    decodeUncJump(instruction)
    {
        var current_ip = this.register.readReg(IP_REG),
            current_code_seg = this.register.readReg(CS_REG);


        if ( instruction & 0xF0 == UNC_JUMP ) 
        {
            let executeJump = false;//If True, the jump instruction shall be executed

            switch(instruction)
            {
                case JE:
                    executed = this.extractFlag('Z');
                    break;

                case JL:
                    executed = this.extractFlag('S') != this.extractFlag('O');
                    break;

                case JLE:
                    executed = this.extractFlag('Z') || (this.extractFlag('S') != this.extractFlag('O'));
                    break;

                case JB:
                    executed = this.extractFlag('C');
                    break;

                case JBE:
                    executed = this.extractFlag('Z') || this.extractFlag('C');
                    break;

                case JP:
                    executed = this.extractFlag('P');
                    break;

                case JO:
                    executed = this.extractFlag('O');
                    break;

                case JS:
                    executed = this.extractFlag('S');
                    break;

                case JNE:
                    executed = this.extractFlag('Z') == 0;
                    break;

                case JNL:
                    executed = this.extractFlag('S') == this.extractFlag('O');
                    break;

                case JNLE:
                    executed = (this.extractFlag('Z') == 0) && (this.extractFlag('S') == this.extractFlag('O'));
                    break;

                case JNB:
                    executed = this.extractFlag('C') == 0;
                    break;

                case JNBE:
                    executed = this.extractFlag('Z') == 0 && this.extractFlag('C') == 0;
                    break;

                case JNP:
                    executed = this.extractFlag('P') == 0;
                    break;
                case JNO:
                    executed = this.extractFlag('O') == 0;
                    break;
                case JNS:
                    executed = this.extractFlag('S') == 0;
                    break;
            }

            if (executeJump) 
            {
                let disp = this.RAM.readByte(current_code_seg<<4 + current_ip);
                disp |= (this.register.readReg(IP_REG) & 0xFF00);

                this.register.writeReg(IP_REG, disp);
            }

            return 0;
        }
        else
            return -1;
        
    }

    decodeSegOverride(instruction){
        if ( instruction & 0b00100110 == SEG_OVER_PREF ) {
            let segRegId = (instruction >> 3) % 4;

            this.activeSegment = segRegId;

            this.register.incIP(1);

            return 0;
        }
        else
            return -1;
    }

   extractOperand(addrModeByte, segmentEnabled=true){
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
		            act_seg = this.register.readSegReg(this.activeSegment);

		        switch (mode) {
		            case NO_DISP:      //No displacement

		                if (rm == 0b110) {
		                    addr = this.RAM.readWord((current_code_seg<<4) + current_ip+2);//WARING!!
		                        //JE pense qu'on doit rajouter 2 par 1
		                    dispSize = 2;
		                }   
		                else
		                    addr = this.getAddrIndir(rm);

		                break;

		            case IWEN_DISP:    // The displacement can be contained in one byte
		                addr = this.getAddrIndir(rm) + this.RAM.readByte((current_code_seg<<4) + current_ip+2);
		                dispSize = 1;
		                break;
		        
		            case SIN_DISP:    // The displacement is contained in two bytes
		                addr = this.getAddrIndir(rm) + this.RAM.readWord((current_code_seg<<4) + current_ip+2);
		                
		                dispSize = 2;
		                break;
		            
		            case REG_MODE:
		                opRegister[1] = rm;

		        }

		        if ( addr != null && segmentEnabled ) {
		        	let current_segment = act_seg;
		            addr += (current_segment<<4);
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
		                return this.register.readReg(BX_REG) + this.register.readReg(SI_REG);
		            case 0x01:
		                return this.register.readReg(BX_REG) + this.register.readReg(DI_REG);
		            case 0x02:
		                return this.register.readReg(BP_REG) + this.register.readReg(SI_REG);
		            case 0x03:
		                return this.register.readReg(BP_REG) + this.register.readReg(DI_REG);

		            case 0x04:
		                return this.register.readReg(SI_REG);
		            case 0x05:
		                return this.register.readReg(DI_REG);
		            case 0x06:
		                return this.register.readReg(BP_REG);
		            case 0x07:
		                return this.register.readReg(BX_REG);

		            default:
		                return -1;
		        }
	}
}


