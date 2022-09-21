const MEMORY_SIZE = 1024*1024;

class Processor{
    constructor(){
        this.RAM = new Memory(MEMORY_SIZE);
        this.register = new Registers();
        this.cnsl=new ConsoleW(this);
        this.pause=false;
        this.int21_01=false;
        this.readNum=1;
     
       
        this.activeSegment = 0b11; // Par defaut on travail sur le DATA SEGMENT (ds_id = 0b11)
    }
    initRam()
    {
       
      this.RAM.initRam();
     
    }
    initReg()
    {
        this.register.initReg();
    }
    decode(){
        var current_ip = this.register.readReg(IP_REG),
            current_code_seg = this.register.readReg(CS_REG),
            instruction = this.RAM.readByte( (current_code_seg<<4) + current_ip );


        if(!this.pause && this.decodeSegOverride(instruction)===0)
        {
            console.log(" decodeSegOverride has been executed!");
            current_ip++;
            instruction = this.RAM.readByte( (current_code_seg<<4) + current_ip);
           
        }
           

        if( !this.pause && this.decodeMov(instruction)===0)
        {
            console.log("decode mov has been executed!");
        }
        else if(!this.pause && this.decodeAdd(instruction)===0)
        {
            console.log("decode add has been executed!");
        }
        else if(!this.pause && this.decodeMul(instruction)===0)
        {
            console.log("decode mul has been executed!");
        }
        else if(!this.pause && this.decodeDiv(instruction)===0)
        {
            console.log("decode div has been executed!");
        }
        else if(!this.pause && this.decodeSub(instruction)===0)
        {
            console.log("decode sub has been executed!");
        }
        else if(!this.pause && this.decodeCmp(instruction)===0)
        {
            console.log("decode cmp has been executed!");
        }
        else if(!this.pause && this.decodeNeg(instruction)===0)
        {
            console.log("decode neg has been executed!");
        }
        else if(!this.pause && this.decodeShl(instruction)===0)
        {
            console.log("decode shl has been executed!");
        }
        else if(!this.pause && this.decodeShr(instruction)===0)
        {
            console.log("decode shr has been executed!");
        }
        else if(!this.pause && this.decodeRcr(instruction)===0)
        {
            console.log("decode rcr has been executed!");
        }
        else if(!this.pause && this.decodeRcl(instruction)===0)
        {
            console.log("decode rcl has been executed!");
        }
        else if(!this.pause && this.decodeRol(instruction)===0)
        {
            console.log("decode rol has been executed!");
        }
        else if(!this.pause && this.decodeRor(instruction)===0)
        {
            console.log("decode ror has been executed!");
        }
        else if(!this.pause && this.decodeSar(instruction)===0)
        {
            console.log("decode sar has been executed!");
        }
        else if(!this.pause && this.decodeAnd(instruction)===0)
        {
            console.log("decode and has been executed!");
        }
        else if(!this.pause && this.decodeOr(instruction)===0)
        {
            console.log("decode or has been executed!");
        }
        else if(!this.pause && this.decodeXor(instruction)===0)
        {
            console.log("decode xor has been executed!");
        }
        else if(!this.pause && this.decodeNot(instruction)===0)
        {
            console.log("decode not has been executed!");
        }
        else if(!this.pause && this.decodeTest(instruction)===0)
        {
            console.log("decode test has been executed!");
        }
        else if(!this.pause && this.decodeXCHG(instruction)===0)
        {
            console.log("decode xchg has been executed!");
        }
        else if(!this.pause && this.decodeImmARIT(instruction)===0)
        {
            console.log("decode ImmARIT has been executed!");
        }
        else if(!this.pause && this.decodePUSH(instruction)===0)
        {
            console.log(" decodePUSH has been executed!");
        }
        else if(!this.pause && this.decodePop(instruction)===0)
        {
            console.log(" decodePop has been executed!");
        }
        else if(!this.pause && this.decodePUSHF(instruction)===0)
        {
            console.log(" decode PUSHF has been executed!");
        }
        else if(!this.pause && this.decodePopF(instruction)===0)
        {
            console.log(" decode PopF has been executed!");
        }
        else if(!this.pause && this.decodeInterrupt(instruction)===0)
        {
            console.log("decode Interrupt has been executed!");
        }
        else if(!this.pause && this.decodeLea(instruction)===0)
        {
            console.log("decode Lea has been executed!");
        }
        else if(!this.pause && this.decodeConJump(instruction)===0)
        {
            console.log("decodeConJump has been executed!");
        }
        else if(!this.pause && this.decodeJmpCall(instruction)===0)
        {
            console.log("decodeJmpCall has been executed!");
        }
        else if (!this.pause && this.decodeRep(instruction) ===0) {
            console.log("decodeRep has been executed!");
        }
        else if (!this.pause && this.decodeMOVS(instruction) ===0) {
           console.log("decodeMOVS has been executed!");
        }
        else if(!this.pause && this.decodeLODS(instruction)===0)
        {
            console.log("decodeLODS has been executed!");
        }
        else if(!this.pause && this.decodeSTOS(instruction)===0)
        {
            console.log("decodeSTOS has been executed!");
        }
        else if(!this.pause && this.decodeCMPS(instruction)===0)
        {
            console.log("decodeCMPS has been executed!");
        }
        else if(!this.pause && this.decodeSCAS(instruction)===0)
        {
            console.log("decodeSCAS has been executed!");
        }
        else if(!this.pause && this.decodeINC(instruction)===0)
        {
            console.log("decodeINC has been executed!");
        }
        else if(!this.pause && this.decodeDEC(instruction)===0)
        {
            console.log("decodeDEC has been executed!");
        }
        else if(!this.pause && this.decodeCLC(instruction)===0)
        {
            console.log("decode CLC has been executed!");
        }
        else if(!this.pause && this.decodeCMC(instruction)===0)
        {
            console.log("decode cmc has been executed!");
        }
        else if(!this.pause && this.decodeSTC(instruction)===0)
        {
            console.log("decode stc has been executed!");
        }
        else if(!this.pause && this.decodeCLD(instruction)===0)
        {
            console.log("decode cld has been executed!");
        }
        else if(!this.pause && this.decodeSTD(instruction)===0)
        {
            console.log("decode std has been executed!");
        }
        else if(!this.pause && this.decodeRet(instruction)===0)
        {
            console.log("decodeRet has been executed!");
        }
        else if(!this.pause && this.decodeLoop(instruction)===0)
        {
            console.log("decodeLoop has been executed!");
        }
        else{
            console.log("can't find anything to execute");
        }

        this.activeSegment=3;
    }

    decodePop(instruction){
        var currentIp = this.register.readReg(IP_REG),
            currentCodeSegment = this.register.readReg(CS_REG);
        var  value = (currentCodeSegment << 4) + currentIp;
   
        var currentStackSegment = this.register.readReg(SS_REG),
            currentStackPointer = this.register.readReg(SP_REG);
         
        var adressStack = (currentStackSegment << 4) + currentStackPointer;
   
            if((instruction & 0b11111111) == POP_REG_MEM)
            {  
                var operandes = this.extractOperand(this.RAM.readWord((currentCodeSegment << 4) + currentIp + 1));
                // R / M
                   
                if (operandes.opRegister[0] == 0)
                {
                    if(operandes.addr==null)
                    {
                       
                        var R=operandes.opRegister[1];
                        this.register.writeWordReg(R, this.RAM.readWord(adressStack));
                        this.RAM.writeWord(adressStack,0);
                        this.register.writeReg(SP_REG, currentStackPointer + 2)
                        this.register.incIP(2 + operandes.dispSize);
                    }
                     
                    else
                    {

                        this.RAM.writeWord(operandes.addr,this.RAM.readWord(adressStack));
                        this.RAM.writeWord(adressStack, 0);
                        this.register.writeReg(SP_REG, currentStackPointer + 2)
                        this.register.incIP(2 + operandes.dispSize);
                     
                    }
                    return 0;
                }
                     
             }
             else if (((instruction %8)==0b111)&&(((instruction >>5)==0)))
             {
   
                let reg = (instruction >> 3 ) % 4 ;
                   
                this.register.writeSegReg(reg,this.RAM.readWord(adressStack));
                this.RAM.writeWord(adressStack, 0);
                this.register.writeReg(SP_REG, currentStackPointer + 2)
                this.register.incIP(1);
                return 0;
            }
           
       return -1;
   
    }

    decodePUSH(instruction){

        // get the current SS:SP position
   
   
        var currentIp = this.register.readReg(IP_REG),
            currentCodeSegment = this.register.readReg(CS_REG);

        let currentStackSegment = this.register.readReg(SS_REG),
            currentStackPointer = this.register.readReg(SP_REG);

        var adressStack = (currentStackSegment << 4) + currentStackPointer;
   
        if((instruction & 0b11111111) == PUSH_REG_MEM) {  
   
            var operandes = this.extractOperand(this.RAM.readWord((currentCodeSegment << 4) + currentIp + 1));
               // R / M
           
            if (operandes.opRegister[0] == 0b110)
            {
                if(operandes.addr==null)
                {
                   
                    var R=operandes.opRegister[1];
                   
                    this.register.writeReg(SP_REG, currentStackPointer - 2)
                    adressStack = (currentStackSegment << 4) + currentStackPointer-2;
                    this.RAM.writeWord(adressStack, this.register.readWordReg(R));
                   
                 
                    this.register.incIP(2 + operandes.dispSize);
                }
               
                else
                {
                    this.register.writeReg(SP_REG, currentStackPointer - 2)
                    adressStack = (currentStackSegment << 4) + currentStackPointer-2;
                    this.RAM.writeWord(adressStack, this.RAM.readWord(operandes.addr));
                   
                   
                    this.register.incIP(2 + operandes.dispSize);
               
                }
                return 0;
            }
           
           
        }
        else if (((instruction%8)==0b110)&&(((instruction >>5)==0)))
        {        
            let reg = (instruction >> 3 ) % 4 ;
           
            this.register.writeReg(SP_REG, currentStackPointer - 2)
            adressStack = (currentStackSegment << 4) + currentStackPointer-2;
            this.RAM.writeWord(adressStack, p.register.readSegReg(reg));

            this.register.incIP(1);
            return 0;
        }
        else if ( instruction == 106 ) {
            let value = this.RAM.readByte((currentCodeSegment << 4) + currentIp + 1);

            this.register.writeReg(SP_REG, currentStackPointer - 2)
            adressStack = (currentStackSegment << 4) + currentStackPointer-2;
            this.RAM.writeWord(adressStack, value);

            this.register.incIP(2);

            return 0;
        }
        else if ( instruction == 104 ) {
            let value = this.RAM.readWord((currentCodeSegment << 4) + currentIp + 1);

            this.register.writeReg(SP_REG, currentStackPointer - 2)
            adressStack = (currentStackSegment << 4) + currentStackPointer-2;
            this.RAM.writeWord(adressStack, value);

            this.register.incIP(3);

            return 0;
        }
   
       return -1;
    }

    decodePUSHF(instruction){

        if (instruction == 0b10011100)
        {
            this.register.incSP();

            let currentStackSegment = this.register.readReg(SS_REG),
                currentStackPointer = this.register.readReg(SP_REG);

            var adressStack = (currentStackSegment << 4) + currentStackPointer;

            var flagContent = this.register.readReg(FLAG_REG);

            this.RAM.writeByte(adressStack, flagContent);

            this.register.incIP(1);

            return 0;
        }


        return -1;

    }

    decodePopF(instruction){

        if (instruction == 0b10011101)
        {
           

            let currentStackSegment = this.register.readReg(SS_REG),
                currentStackPointer = this.register.readReg(SP_REG);

            var adressStack = (currentStackSegment << 4) + currentStackPointer;

            var flagContent = this.RAM.readWord(adressStack);

            this.register.writeReg(FLAG_REG, flagContent);

            this.register.incIP(1);

            this.register.decSP();

            return 0;
        }


        return -1;

    }
   


    decodeXCHG(instruction){

        if ((instruction&0xFE) == 0b10000110)
        {
           
            let current_ip = this.register.readReg(IP_REG),
            current_code_seg = this.register.readReg(CS_REG);

            let operandes = this.extractOperand(this.RAM.readByte((current_code_seg<<4) + current_ip + 1));

            if (operandes.addr == null)
            {
                if (instruction % 2 == 0)
                {
                    let R1 = operandes.opRegister[0],
                        R2 = operandes.opRegister[1];
                    let tmp = this.register.readByteReg( R1 );

                    this.register.writeByteReg(R1, this.register.readByteReg(R2));
                    this.register.writeByteReg(R2, tmp);
                }
                else
                {
                    let R1 = operandes.opRegister[0],
                        R2 = operandes.opRegister[1];
                    let tmp = this.register.readWordReg( R1 );

                    this.register.writeWordReg(R1, this.register.readWordReg(R2));
                    this.register.writeWordReg(R2, tmp);
                }
            }

            else
            {
                if (instruction % 2 == 0)
                {
                    let R = operandes.opRegister[0],
                        addr = operandes.addr;
                    let tmp = this.RAM.readByte( addr );

                    this.RAM.writeByte(addr, this.register.readByteReg(R));
                    this.register.writeByteReg(R, tmp);
                }
                else
                {
                    let R = operandes.opRegister[0],
                        addr = operandes.addr;
                    let tmp = this.RAM.readWord( addr );

                    this.RAM.writeWord(addr, this.register.readWordReg(R));
                    this.register.writeWordReg(R, tmp);
                }
            }
           

            this.register.incIP(2 + operandes.dispSize);
           
            return 0;
        }


        return -1;
    }

    decodeInterrupt(instruction){
         
        if(instruction===INT)
        {
            var current_ip = this.register.readReg(IP_REG),
            current_code_seg = this.register.readReg(CS_REG);
            var secondByte = this.RAM.readByte( (current_code_seg<<4) + current_ip+1 );
            if(secondByte==0x21)
            {
                if(((this.register.readReg(AX_REG)&0xff00)>>8)==0x01)
                {
                    console.log("int21_01 has been executed");
                    this.cnsl.readChar();
                    this.int21_01=true;
                }
                else if(((this.register.readReg(AX_REG)&0xff00)>>8)==0x02)
                {
                    console.log("int21_02 has been executed");
                    let ch=String.fromCharCode((this.register.readReg(DX_REG)&0x00ff));
                    this.cnsl.writeChar(ch);
                }
                else if(((this.register.readReg(AX_REG)&0xff00)>>8)==0x09)
                {
                    let addr=this.register.readReg(DX_REG);
                    let val=this.RAM.readByte(addr);
                    let char="$";
                while(val!=36)
                {
                    this.cnsl.writeChar(String.fromCharCode(val));
                    addr++;
                    val=this.RAM.readByte(addr);
                }
                }
                else if(((this.register.readReg(AX_REG)&0xff00)>>8)==0xa)
                {
                    console.log("int21_0a has been executed");
                    this.cnsl.readChar();
                    this.int21_0a=true;
                    waitEnter();          
                }
               
            } //end int 21h
       
            this.register.incIP(2);
            return 0;
           
        }
        else return -1;
    }

    decodeLea(instruction){
        if (instruction == 0b10001101) {
            var current_ip = this.register.readReg(IP_REG),
                current_code_seg = this.register.readReg(CS_REG),
                current_data_segement = this.register.readReg(DS_REG);


            var operandes = this.extractOperand(this.RAM.readByte((current_code_seg<<4) + current_ip+1));

            var R = operandes.opRegister[0];

            this.register.writeWordReg(R, operandes.addr);

            this.register.incIP(2 + operandes.dispSize);

            return 0;
        }

        return -1;
    }

    decodeMov(instruction){
     
                var current_ip = this.register.readReg(IP_REG),
                    current_code_seg = this.register.readReg(CS_REG),
                    current_data_segement = this.register.readReg(DS_REG);

                //================================================================================
                // -------Register/Memory to/from Register----------------------------------------
                //================================================================================
                if ((instruction & 0b11111100) == MOV_RM_RM )
                {
                   
                    var operandes = this.extractOperand(this.RAM.readByte((current_code_seg<<4) + current_ip+1));
                   

                    if (operandes.addr == null)
                    {   // R to R
                        let R1 = operandes.opRegister[0],
                            R2 = operandes.opRegister[1];
                           
                        if ( instruction % 2 == 1 )
                        {
                            if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                            {
                                let valB = this.register.readWordReg(R2),
                                    valA = this.register.readWordReg(R1);

                                this.register.writeWordReg(R1, this.register.readWordReg(R2) );
                                this.generateFlag(valB, valA, valB, 1);
                            }
                           
                            else
                            {
                                let valB = this.register.readWordReg(R1),
                                    valA = this.register.readWordReg(R2);

                                this.register.writeWordReg(R2, this.register.readWordReg(R1) );
                                this.generateFlag(valB, valA, valB, 1);
                            }
                           
                        }
                        else
                        {
                            if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                            {
                                let valB = this.register.readByteReg(R2),
                                    valA = this.register.readByteReg(R1);

                                this.register.writeByteReg(R1, this.register.readByteReg(R2) );
                                this.generateFlag(valB, valA, valB, 0);
                            }
                           
                            else
                            {
                                let valB = this.register.readByteReg(R1),
                                    valA = this.register.readByteReg(R2);

                                this.register.writeByteReg(R2, this.register.readByteReg(R1) );
                                this.generateFlag(valB, valA, valB, 0);
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
                                let valB = this.RAM.readWord(addr),
                                    valA = this.register.readWordReg(R);
                                   
                                this.register.writeWordReg(R, this.RAM.readWord(addr));
                                this.generateFlag(valB, valA, valB, 1);
                            }
                           
                            else
                            {
                                let valA = this.RAM.readWord(addr),
                                    valB = this.register.readWordReg(R);

                                this.RAM.writeWord(addr, this.register.readWordReg(R));// d=0 => from reg
                                this.generateFlag(valB, valA, valB, 1);
                            }
                           
                        }
                        else    //8bits
                        {
                           
                            if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                            {
                                let valB = this.RAM.readByte(addr),
                                    valA = this.register.readByteReg(R);

                                this.register.writeByteReg(R, this.RAM.readByte(addr));
                                this.generateFlag(valB, valA, valB, 0);
                            }
                           
                            else
                            {
                                let valA = this.RAM.readByte(addr),
                                    valB = this.register.readByteReg(R);

                                this.RAM.writeByte(addr, this.register.readByteReg(R));// d=0 => from reg
                                this.generateFlag(valB, valA, valB, 0);
                            }

                        }
                    }

                    this.register.incIP(operandes.dispSize + 2);//2 étant la taille de base de l'instruction
                }
                //=================================================================================
                // -------Immediate to Register/Memory--------------------------------------------
                //=================================================================================
                else if ((instruction & 0b11111110) == MOV_IMMEDIATE_TO_RM)
                {
                   
                    var operandes = this.extractOperand(this.RAM.readByte((current_code_seg<<4) + current_ip+1)),//On extrait le w
                        immediateAddr = (current_code_seg<<4) + current_ip + 2 + operandes.dispSize ;

                    var R = operandes.opRegister[1],
                        addr = operandes.addr;

                    if (instruction % 2 == 1)  // High Byte selected
                    {
                     
                        let immediatVal = this.RAM.readWord(immediateAddr);

                        if (addr == null)
                        {
                            let val = this.register.readWordReg( R );

                            this.register.writeWordReg( R, immediatVal);

                            this.generateFlag(immediatVal, val, immediatVal, 1);
                        }

                        else
                        {
                            let val = this.RAM.readWord( addr );
                            this.RAM.writeWord(addr, immediatVal);
                            this.generateFlag(immediatVal, val, immediatVal, 1);
                        }
                    }
                    else
                    {
                     
                        let immediatVal = this.RAM.readByte(immediateAddr);

                        if (addr == null)
                        {
                            let val = this.register.readByteReg( R );

                            this.register.writeByteReg( R, immediatVal);

                            this.generateFlag(immediatVal, val, immediatVal, 0);
                        }

                        else
                        {
                            let val = this.RAM.readByte( addr );
                            this.RAM.writeByte(addr, immediatVal);
                            this.generateFlag(immediatVal, val, immediatVal, 0);
                        }
                    }

                    this.register.incIP(operandes.dispSize + (instruction % 2) + 3);
                }
                //=================================================================================
                // -------Immediate to Register----------------------------------------------------
                //=================================================================================
                else if ((instruction & 0b11110000) == MOV_IMMEDIATE_TO_R)
                {
                   
                    var R = instruction & 0x07,
                        immediateAddr = (current_code_seg<<4) + current_ip + 1;  

                    if ((instruction>>3) % 2 == 1)  // High Byte selected
                    {
                        let immediatVal = this.RAM.readWord(immediateAddr);

                        this.register.writeWordReg( R, immediatVal);

                        this.generateFlag(immediatVal, 0, 0, 1, 0xFFFF & ~OVERFLOW_FLAG);
                    }
                    else
                    {
                        let immediatVal = this.RAM.readByte(immediateAddr);

                        this.register.writeByteReg( R, immediatVal);

                        this.generateFlag(immediatVal, 0, 0, 0, 0xFFFF & ~OVERFLOW_FLAG);
                    }

                    this.register.incIP(((instruction>>3) % 2) + 2);
                }
                //=================================================================================
                // -------Memory to/from Accumulator-----------------------------------------------
                //=================================================================================
                else if ((instruction & 0b11111100) == MOV_ACCUMULATOR_MEMORY)
                {
                    var addr = current_data_segement<<4 +this.RAM.readWord((current_code_seg << 4) + current_ip+1);

                    if((instruction >> 1) % 2 == 0) // d=0 => from reg
                    {
                        if (instruction%2 == 1) {//w=1
                            const val = this.register.readRegWord(AX_REG);

                            this.RAM.writeWord(addr, val );
                            this.generateFlag(val, 0, 0, 1, 0xFFFF & ~OVERFLOW_FLAG);
                        }
                       
                        else {
                            const val = this.register.readRegByte(AX_REG);

                            this.RAM.writeByte(addr, this.register.readRegByte(AX_REG));
                            this.generateFlag(val, 0, 0, 0, 0xFFFF & ~OVERFLOW_FLAG);
                        }
                       
                    }
                    else
                    {
                        if (instruction%2 == 1) {//w=1
                            const val = this.RAM.readWord(addr);

                            this.register.writeRegWord(AX_REG, this.RAM.readWord(addr));
                            this.generateFlag(val, 0, 0, 1, 0xFFFF & ~OVERFLOW_FLAG);
                        }
                   
                        else {
                            const val = this.RAM.readByte(addr);

                            this.register.writeRegByte(AX_REG, this.RAM.readByte(addr));
                            this.generateFlag(val, 0, 0, 0, 0xFFFF & ~OVERFLOW_FLAG);
                        }
                       
                    }

                    this.register.incIP(3);
                }  
                //=================================================================================
                // -------Segment Register to Register/Memory--------------------------------------
                //=================================================================================
                else if ((instruction & 0b11111101) == MOV_RM_SEGEMENT)
                {
                    var operandes = this.extractOperand(this.RAM.readByte((current_code_seg<<4) + current_ip+1));
                   
                    if (operandes.addr == null)
                    {   // R to R
                       
                        let R1 = operandes.opRegister[0],
                            R2 = operandes.opRegister[1];

                        let valB = this.register.readWordReg(R2),
                            valA = this.register.readSegReg(R1);

                        if ((instruction >> 1) % 2) // On extrait le d || d = 1 to reg
                        {
                            this.register.writeSegReg(R1, this.register.readWordReg(R2) );

                            this.generateFlag(valB, valA, valB, 1);
                        }
                       
                        else
                        {
                            this.register.writeWordReg(R2, this.register.readSegReg(R1) );  

                            this.generateFlag(valA, valA, valB, 1);
                        }
                       
                    }
                    else
                    {   // MEM TO/FROM R
                        let R = operandes.opRegister[0],
                            addr = operandes.addr;

                        let valB = this.RAM.readWord(addr),
                            valA = this.register.readSegReg(R);

                        if ((instruction >> 1) % 2) // On extrait le d || d = 1 to reg
                        {
                            this.register.writeSegReg(R, this.RAM.readWord(addr) );

                            this.generateFlag(valB, valA, valB, 1);
                        }
                       
                        else
                        {
                            this.RAM.writeWord(addr, this.register.readSegReg(R));    
                           
                            this.generateFlag(valA, valA, valB, 1);
                        }
                       
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


                //=================================================================================
                // -------Register/Memory with Register------------------------------------------
                //=================================================================================
                if (    (instruction & 0b11111100) == ADD_REG_MEM
                    ||  (instruction & 0b11111100) == ADC_REG_MEM
                     ) {

                    var operandes = this.extractOperand(this.RAM.readByte((current_code_seg<<4) + current_ip + 1));

                    var carry = (instruction & 0x10 == 1) ? this.register.extractFlag('C') : 0;
                   

                    if (operandes.addr == null)
                    {   // R to R
                        let R1 = operandes.opRegister[0],
                            R2 = operandes.opRegister[1];

                        if ( instruction % 2 == 1 )
                        {
                            let value2 = this.register.readWordReg(R2);
                            let value1 = this.register.readWordReg(R1);
                            let value  = value1 + value2 + carry;

                            if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                                this.register.writeWordReg(R1, (value & 0xFFFF));
                           
                            else
                                this.register.writeWordReg(R2, (value & 0xFFFF));
                           
                            this.generateFlag((value), value1, value2, 1);
   
                        }
                        else    //W = 0
                        {
                            let value2 = this.register.readByteReg(R2);
                            let value1 = this.register.readByteReg(R1);
                            let value  = value1 + value2 + carry;

                            if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg    
                                this.register.writeByteReg(R1, value & 0xFF);
                           
                            else
                                this.register.writeByteReg(R2, value & 0xFF);

                            this.generateFlag((value), value1, value2, 0);

                        }
                    }
                    else
                    {   // MEM TO/FROM R
                        let R = operandes.opRegister[0],
                            addr = operandes.addr;

                        if ( instruction % 2 == 1 ) //16bits
                        {
                            let value2 = this.RAM.readWord(addr);
                            let value1 = this.register.readWordReg(R);
                            let value  = value1 + value2 + carry;

                            if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                                this.register.writeWordReg(R, value & 0xFFFF);
                           
                            else    // d=0 => from reg
                                this.RAM.writeWord(addr, value & 0xFFFF);

                            this.generateFlag((value), value1, value2, 1);
                           
                        }
                        else    //8bits
                        {
                            let value2 = this.RAM.readByte(addr);
                            let value1 = this.register.readByteReg(R);
                            let value  = value1 + value2 + carry;

                            if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                                this.register.writeByteReg(R, value & 0xFF);

                            else
                                this.RAM.writeByte(addr, value & 0xFF);
                           
                            this.generateFlag((value), value1, value2, 0);
   
                        }
                    }
                    this.register.incIP(operandes.dispSize + 2);
                }
                //================================================================================
                // -------Accumulator with Immediat------------------------------------------
                //=================================================================================
                else if ( (instruction & 0b11111110) == ADD_ACC_IMM ||
                        (instruction & 0b11111110) == ADC_ACC_IMM)
                {
                    var immediateAddr = (current_code_seg<<4) + current_ip + 1;
                    var carry = 0;

                    if ( (instruction & 0b11111110) == ADC_ACC_IMM )
                        carry = this.register.extractFlag('C');
               
                    if ( instruction % 2 == 1 )//W = 1
                    {
                        let value = this.register.readWordReg(AX_REG);
                        value += this.RAM.readWord(immediateAddr) + carry;
                        this.register.writeWordReg(AX_REG, value & 0xFFFF);
                    }
                    else
                    {
                        let value = this.register.readByteReg(AX_REG);//Ici on est sur AL
                        value += this.RAM.readByte(immediateAddr) + carry;
                        this.register.writeByteReg(AX_REG, value & 0xFF);
                    }
                   

                    this.register.incIP(2 + (instruction%2));
                }

                else
                    return -1;

                return 0;
    }
   
    decodeSub(instruction){
                var current_ip = this.register.readReg(IP_REG),
                    current_code_seg = this.register.readReg(CS_REG),
                    current_data_segement = this.register.readReg(DS_REG);


                //=================================================================================
                // -------Register/Memory with Register------------------------------------------
                //=================================================================================
                if (    (instruction & 0b11111100) == SUB_REG_MEM
                    ||  (instruction & 0b11111100) == SBB_REG_MEM
                     ) {

                    var operandes = this.extractOperand(this.RAM.readByte((current_code_seg<<4) + current_ip + 1));

                    var carry = (instruction & 0x10 == 1) ? this.register.extractFlag('C') : 0;
                   

                    if (operandes.addr == null)
                    {   // R to R
                        let R1 = operandes.opRegister[0],
                            R2 = operandes.opRegister[1];

                        if ( instruction % 2 == 1 )
                        {
                            let value1 = this.register.readWordReg(R1);
                            let value2 = this.register.readWordReg(R2);
                            let value  = value1 - (value2 + carry);
                           
                            if ((instruction >> 1) % 2) {// On extrait le dif ||d=1 =>to Reg
                                this.register.writeWordReg(R1, value & 0xFFFF);
                                this.generateFlag((value & 0xFFFF), value1, (-value2)&0xFFFF, 1);
                            }
                           
                            else {
                                this.register.writeWordReg(R2, (-value) & 0xFFFF);
                                this.generateFlag((-value) & 0xFFFF, value1, (-value2)&0xFFFF, 1);
                            }
                           
                        }
                        else    //W = 0
                        {
                            let value1 = this.register.readByteReg(R1);
                            let value2 = this.register.readByteReg(R2);
                            let value  = value1 - (value2 + carry);

                            if ((instruction >> 1) % 2) {// On extrait le dif ||d=1 =>to Reg    
                                this.register.writeByteReg(R1, value & 0xFF);
                                this.generateFlag(value & 0xFFFF, value1, (-value2)&0xFF, 0);
                            }
                           
                            else {
                                this.register.writeByteReg(R2, (-value) & 0xFF);
                                this.generateFlag((-value) & 0xFFFF, value1, (-value2)&0xFF, 0);
                            }
                           
                        }
                    }
                    else
                    {   // MEM TO/FROM R
                        let R = operandes.opRegister[0],
                            addr = operandes.addr;

                        if ( instruction % 2 == 1 ) //16bits
                        {
                            let value1 = this.register.readWordReg(R);
                            let value2 = this.RAM.readWord(addr);
                            let value  = value1 - (value2 + carry);

                            if ((instruction >> 1) % 2) {// On extrait le dif ||d=1 =>to Reg
                                this.register.writeWordReg(R, value & 0xFFFF);
                                this.generateFlag(value & 0xFFFF, value1, (-value2)&0xFFFF, 1);
                            }
                           
                            else {   // d=0 => from reg
                                this.RAM.writeWord(addr, (-value) & 0xFFFF);
                                this.generateFlag((-value) & 0xFFFF, value1, (-value2)&0xFFFF, 1);
                            }
                           
                        }
                        else    //8bits
                        {
                            let value1 = this.register.readByteReg(R);
                            let value2 = this.RAM.readByte(addr);
                            let value  = value1 - value2 - carry;

                            if ((instruction >> 1) % 2) { // On extrait le dif ||d=1 =>to Reg
                                this.register.writeByteReg(R, value & 0xFF);
                                this.generateFlag(value & 0xFFFF, value1, (-value2)&0xFF, 0);
                            }

                            else {
                                this.RAM.writeByte(addr, (-value) & 0xFF);
                                this.generateFlag((-value) & 0xFFFF, value1, (-value2)&0xFF, 0);
                            }
                           
                        }
                    }
                    this.register.incIP(operandes.dispSize + 2);
                }
                //================================================================================
                // -------Accumulator with Immediat------------------------------------------
                //=================================================================================
                else if ( (instruction & 0b11111110) == SUB_ACC_IMM ||
                        (instruction & 0b11111110) == SBB_ACC_IMM)
                {

                    var immediateAddr = (current_code_seg<<4) + current_ip + 1;
                    var carry = 0;

                    if ( (instruction & 0b11111110) == ADC_ACC_IMM )
                        carry = this.register.extractFlag('C');
                   
                    if ( instruction % 2 == 1 )//W = 1
                    {
                        let value = this.register.readWordReg(AX_REG);
                        value -= this.RAM.readWord(immediateAddr) + carry;
                        this.register.writeWordReg(AX_REG, value & 0xFFFF);
                    }
                    else
                    {
                        let value = this.register.readByteReg(AX_REG);//Ici on est sur AL
                        value -= this.RAM.readByte(immediateAddr) + carry;
                        this.register.writeByteReg(AX_REG, value & 0xFF);
                    }
                   

                    this.register.incIP(2 + (instruction%2));
                }

                else
                    return -1;

                return 0;
    }

   
    decodeImmARIT(instruction){//instruction arithmetic a parametre immediat
                var current_ip = this.register.readReg(IP_REG),
                    current_code_seg = this.register.readReg(CS_REG),
                    current_data_segement = this.register.readReg(DS_REG);

                if ( (instruction & 0b11111100) == ARITHMETIC_IMM )
                {
                    //CA FAIT MAL AUX YEUX !!!!
                    var operandes = this.extractOperand(this.RAM.readByte((current_code_seg<<4) + current_ip + 1)),
                        immediateAddr = (current_code_seg<<4) + current_ip + 2 +operandes.dispSize,
                        operandeSize = (instruction % 4 == 0b01||instruction % 4 == 0b11) ? 2 : 1;

                    var instructionMode = operandes.opRegister[0];
                   
                    //####################################################################
                    //IMMEDIAT TO REGISTER
                    //####################################################################
                    if (operandes.addr == null)
                    {  
                        let R = operandes.opRegister[1];

                        //----------------------------------------------
                        //-------Word instruction-----------------------
                        //----------------------------------------------
                        if ( (instruction % 2) == 1 ) //W = 1
                        {
                            let op1 = this.register.readWordReg(R), opImm = 0, value = 0;

                            //EXTRACTING THE IMMEDIAT OPERAND DEPENDING ON 'S'
                            //-----------------------------------------------------
                            if ( (instruction>>1) % 2 == 0 ) //operande sur 2 octets
                                opImm = this.RAM.readWord(immediateAddr);
                           
                            else//Operande sur 1 octect à étendre dur 2 octets
                                opImm = this._convertByteToWord(this.RAM.readByte(immediateAddr));
                            //-----------------------------------------------------
                       
                            value = this._executeArthLogic(instructionMode, op1, opImm);

                            let w = (instruction % 2 );

                            if ( instructionMode != CMP_MODE ) 
                                this.register.writeWordReg(R, value & 0xFFFF);
                            //flags manipulation

                            if ( instructionMode != CMP_MODE && instructionMode != SUB_MODE) 
                                this.generateFlag(value,op1,opImm,w,CARRY_FLAG | SIGN_FLAG |PARITY_FLAG|ZERO_FLAG|AUXILARY_FLAG|OVERFLOW_FLAG);
                            else 
                                this.generateFlag(value,op1,(-opImm)&0xFFFF,w,CARRY_FLAG | SIGN_FLAG |PARITY_FLAG|ZERO_FLAG|AUXILARY_FLAG|OVERFLOW_FLAG);

                        }

                        //----------------------------------------------
                        //-------Byte instruction-----------------------
                        //----------------------------------------------
                        else    //W = 0
                        {
                            let op1     = this.register.readByteReg(R),
                                opImm   = this.RAM.readByte(immediateAddr),
                                value   = this._executeArthLogic(instructionMode, op1, opImm);
                                
                                
                            if ( instructionMode != CMP_MODE )
                                this.register.writeByteReg(R, value & 0xFF);
                            
                            let w=(instruction % 2 );

                            if ( instructionMode != CMP_MODE && instructionMode != SUB_MODE) 
                                this.generateFlag(value,op1,opImm,w,CARRY_FLAG | SIGN_FLAG |PARITY_FLAG|ZERO_FLAG|AUXILARY_FLAG|OVERFLOW_FLAG);
                            else 
                                this.generateFlag(value,op1,(-opImm)&0xFF,w,CARRY_FLAG | SIGN_FLAG |PARITY_FLAG|ZERO_FLAG|AUXILARY_FLAG|OVERFLOW_FLAG);
                        }

                        
                    }
                    //####################################################################
                    //IMMEDIAT TO MEMORY
                    //####################################################################
                    else
                    {   // immediat to Mem
                        let addr = operandes.addr;

                        //----------------------------------------------
                        //-------Word instruction-----------------------
                        //----------------------------------------------
                        if ( instruction % 2 == 1 )
                        {
                            let op1 = this.RAM.readWord(addr), opImm = 0, value = 0;

                            //EXTRACTING THE IMMEDIAT OPERAND DEPENDING ON 'S'
                            //-----------------------------------------------------
                            if ( (instruction>>1) % 2 == 0 ) //operande sur 2 octets
                                opImm = this.RAM.readWord(immediateAddr);
                           
                            else//Operande sur 1 octect à étendre dur 2 octets
                                opImm = this._convertByteToWord(this.RAM.readByte(immediateAddr));
                            //-----------------------------------------------------

                            value = this._executeArthLogic(instructionMode, op1, opImm);

                            if ( instructionMode != CMP_MODE )
                                this.RAM.writeWord(addr, value & 0xFFFF);
                            
                            let w=(instruction % 2 );
                           
                            if ( instructionMode != CMP_MODE && instructionMode != SUB_MODE) 
                                this.generateFlag(value,op1,opImm,w,CARRY_FLAG | SIGN_FLAG |PARITY_FLAG|ZERO_FLAG|AUXILARY_FLAG|OVERFLOW_FLAG);
                            else 
                                this.generateFlag(value,op1,(-opImm)&0xFFFF,w,CARRY_FLAG | SIGN_FLAG |PARITY_FLAG|ZERO_FLAG|AUXILARY_FLAG|OVERFLOW_FLAG);

                        }

                        //----------------------------------------------
                        //-------Byte instruction-----------------------
                        //----------------------------------------------
                        else
                        {
                            let op1     = this.RAM.readByte(addr),
                                opImm   = this.RAM.readByte(immediateAddr),
                                value   = this._executeArthLogic(instructionMode, op1, opImm);

                            if ( instructionMode != CMP_MODE )
                                this.RAM.writeByte(addr, value & 0xFF);
                            
                            let w=(instruction % 2 );

                            if ( instructionMode != CMP_MODE && instructionMode != SUB_MODE) 
                                this.generateFlag(value,op1,opImm,w,CARRY_FLAG | SIGN_FLAG |PARITY_FLAG|ZERO_FLAG|AUXILARY_FLAG|OVERFLOW_FLAG);
                            else 
                                this.generateFlag(value,op1,(-opImm)&0xFF,w,CARRY_FLAG | SIGN_FLAG |PARITY_FLAG|ZERO_FLAG|AUXILARY_FLAG|OVERFLOW_FLAG);
                        }
                    }

                    this.register.incIP(2 + operandes.dispSize + operandeSize);
                   
                }
                else
                    return -1;

                return 0;
    }
   
   
    decodeByteToWord(instruction){
        if ( instruction == CBW ) {
                let value = this.register.readReg(AX_REG);
                this.register.writeReg(AX_REG, this._convertByteToWord(value & 0xFF));
        }
        else
            return -1;

        return 0;
    }

    decodeWordToDouble(instruction){
                if ( instruction == CWD ) {
                    let value = this.register.readReg(AX_REG) ;
                    dxValue = (value >> 15) == 1 ? 0xFFFF : 0;
                    this.register.writeReg(DX_REG, dxValue);
                }
                else
                    return -1;

                return 0;
    }
   
   
    decodeMul(instruction)
    {
        //HEU IMUL
        var current_ip = this.register.readReg(IP_REG),
            current_code_segement = this.register.readReg(CS_REG);

        var operandes = this.extractOperand(this.RAM.readByte((current_code_segement<<4) + current_ip+1));
       
        if(((instruction&0xFE)==MUL) &&(operandes.opRegister[0]==0b100 || operandes.opRegister[0]==0b101))
        {  
           
               
            if(operandes.addr==null)
            {
               
                var R2 = operandes.opRegister[1];

                if(instruction%2==1)//16 bit
                {
                    this.register.mulReg(R2,WORD_NS_REGISTER);
                }
                   
                else
                {
                    this.register.mulReg(R2,BYTE_REGISTER)
                }  
            }
            else
            {
           
           
                if(instruction%2==1)//16 bit
                {
                   
                   
                    let val = this.RAM.readWord(operandes.addr);
                    let ax = this.register.readReg(AX_REG);//ax
                    ax*=val;
                   
                   
                if(ax>>16==0)
                {
                   
                    this.register.writeReg(AX_REG,ax);
                   
                }
                else
                {
                   
                    let dx=(((ax&0xffff0000)>>16)&0xffff);
                   
                    this.register.writeReg(AX_REG,ax&0x0000ffff);
                    this.register.writeReg(DX_REG,dx);
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
               
                        this.register.writeReg(AX_REG,al);//ah  
                   
                    }
               
                }
            }
           
            this.register.incIP(operandes.dispSize + 2);
            return 0;
        }  
        else return -1;
       
               
    }
    //
    decodeDiv(instruction)
    {
        var current_ip = this.register.readReg(IP_REG),
        current_code_segement = this.register.readReg(CS_REG);
        var operandes = this.extractOperand(this.RAM.readByte((current_code_segement<<4) + current_ip+1));

       
        if(((instruction&0xFE)==DIV) &&((operandes.opRegister[0]==0b110) || (operandes.opRegister[0]==0b111)))
        {
               console.log("ll");
                if(operandes.addr==null)
                {
                   let  R2 = operandes.opRegister[1];
                 
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
                        let ax = this.register.readReg(AX_REG);//ax
                        this.register.writeReg(AX_REG,Math.floor(val/ax));
                        this.register.writeReg(DX_REG,val%ax);
                       
                       
                   
                   
                       
                    }
                    else
                    {
                       
                        let val = this.RAM.readByte(operandes.addr);
                        let al = this.register.readByteReg(0);//al
                        this.register.writeReg(AX_REG,(Math.floor(val%al)<<8)+Math.floor(val/al));
                     

                    }
                }
             this.register.incIP(operandes.dispSize + 2);
           return 0;
        }
        else
            return -1;  
    }

    decodeNeg(instruction)
    {
        var current_ip = this.register.readReg(IP_REG),
        current_code_segement = this.register.readReg(CS_REG);
        let operandes=this.extractOperand(this.RAM.readByte((current_code_segement<<4)+current_ip+1));

        if((instruction>>1)==NOT &&(operandes.opRegister[0]==0b011))
        {
       
         if(operandes.addr==null) // not reg
         {
             let R=operandes.opRegister[1];

             if((instruction%2)==1)//w
             {
                 let val=this.register.readWordReg(R);
                 val=~val;
                 val += 1
                 this.register.writeWordReg(R,val&0xffff);
                 

             }else
             {
                 let val=this.register.readByteReg(R);
                 val=~val;
                 val += 1
                 this.register.writeByteReg(R,val&0xff);

             }
         }
         else  //NOT [addr]
         {
             if((instruction%2)==1)//w
             {
                 let val=this.RAM.readWord(operandes.addr);
                 val=~val;
                 this.RAM.writeWord(operandes.addr,val&0xffff);

             }else //8 bits
             {
               
                 let val=this.RAM.readByte(operandes.addr);
                 val=~(val);
               
                 this.RAM.writeWord(operandes.addr,val&0xffff);


             }

         }
         this.register.incIP(operandes.dispSize + (instruction % 2) +1);
         return 0;
        }
        else return -1;  
    }

    decodeCmp(instruction)
    {
        var current_ip = this.register.readReg(IP_REG),
            current_code_segement = this.register.readReg(CS_REG);
       

        if ((instruction & 0xFC) == 0x38) {
            var operandes = this.extractOperand(this.RAM.readByte((current_code_segement<<4) + current_ip+1));

            if (operandes.addr == null)
            {

               
                let R1 = operandes.opRegister[0],
                    R2 = operandes.opRegister[1];
                   
                if ( instruction % 2 == 1 )
                {
                    let valB = this.register.readWordReg(R2),
                        valA = this.register.readWordReg(R1);

                    if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                    {
                        this.generateFlag(valA-valB, valA, (-valB) & 0xFFFF, 1); 
                    }
                   
                    else
                    {
                        this.generateFlag(valB-valA, valB, (-valA) & 0xFFFF, 1);
                    }
                   
                }
                else
                {
                    let valB = this.register.readByteReg(R2),
                            valA = this.register.readByteReg(R1);

                    if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                    {

                        this.generateFlag(valA-valB, valA, (-valB) & 0xFF, 0);
                    }
                   
                    else
                    {
                        this.generateFlag(valB-valA, valB, (-valA) & 0xFF, 0);
                    }
                }

            }

            else
            {
                let R = operandes.opRegister[0],
                    addr = operandes.addr;
               
                if ( instruction % 2 == 1 ) //16bits
                {
                    if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                    {
                        let valB = this.RAM.readWord(addr),
                            valA = this.register.readWordReg(R);
                           

                        this.generateFlag(valA-valB, valA, (-valB) & 0xFFFF, 1);
                    }
                   
                    else
                    {// d=0 => from reg
                        let valA = this.RAM.readWord(addr),
                            valB = this.register.readWordReg(R);
                       
                        this.generateFlag(valB-valA, valB, (-valA) & 0xFFFF, 1);
                    }
                   
                }
                else    //8bits
                {
                   
                    if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                    {
                        let valB = this.RAM.readByte(addr),
                            valA = this.register.readByteReg(R);

                        this.generateFlag(valA-valB, valA, (-valB) & 0xFF, 0);
                    }
                   
                    else
                    {
                        let valA = this.RAM.readByte(addr),
                            valB = this.register.readByteReg(R);// d=0 => from reg

                        this.generateFlag(valB-valA, valB, (-valA) & 0xFF, 0);
                    }
                }


            }

            this.register.incIP(2 + operandes.dispSize)

            return 0;
        }
       

        return -1;
    }

      //and
    decodeAnd(instruction)
    {
        var current_ip = this.register.readReg(IP_REG),
        current_code_segement = this.register.readReg(CS_REG);
        var operandes = this.extractOperand(this.RAM.readByte((current_code_segement<<4) + current_ip+1));
       
        if ((instruction >>2) == AND_RM_RM )
        {
               
               
                if (operandes.addr == null)
                {   // R to R-----------------------------------------------------
                   
                    let R1 = operandes.opRegister[0],
                        R2 = operandes.opRegister[1];
                     
                 
                    if ( instruction % 2 == 1 )
                    {
                        let value1 = this.register.readWordReg(R1),
                            value2 = this.register.readWordReg(R2),
                            value = value1 & value2;

                        if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                            this.register.writeWordReg(R1, value );
                       
                        else
                            this.register.writeWordReg(R2, value );
                       
                        this.generateFlag(value, value1, value2, 1);
                    }
                    else
                    {
                        let value1 = this.register.readByteReg(R1),
                            value2 = this.register.readByteReg(R2),
                            value = value1 & value2;

                        if ((instruction >> 1) % 2) // On extrait le dif
                            this.register.writeByteReg(R1, value );
                       
                        else
                            this.register.writeByteReg(R2, value );
                       
                        this.generateFlag(value, value1, value2, 0);
                    }
                   
               
                }
                else
                {   // MEM TO/FROM R----------------------------------------------
                    let R = operandes.opRegister[0],
                        addr = operandes.addr;

                    if (( instruction % 2 )== 1 ) //16bits //the w bit
                    {
                        let value1 = this.RAM.readWord(addr),
                            value2 = this.register.readWordReg(R),
                            value = value1 & value2;

                        if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg

                            this.register.writeWordReg(R, value );
                        
                        else
                            // d=0 => from reg
                            this.RAM.writeWord(addr, value);
                        

                        this.generateFlag(value, value1, value2, 1);

                    }
                    else    //8bits
                    {
                        let value1 = this.RAM.readByte(addr),
                            value2 = this.register.readByteReg(R),
                            value = value1 & value2;

                        if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                        
                            this.register.writeByteReg(R, value);
                        
                        else
                        
                            this.RAM.writeByte(addr, value);
                        
                        this.generateFlag(value, value1, value2, 0);

                    }
                }

            this.register.incIP(operandes.dispSize + 2);//2 étant la taille de base de l'instruction
            //(pour passer a la prochaine instruction)
            return 0;
        }
         //======================================================================================
        // -------Immediate to Acc--------------------------------------------------
        //======================================================================================
        else if ((instruction >>1) == AND_IMMEDIATE_TO_ACC)
        {
            var operandes = this.extractOperand(this.RAM.readByte((current_code_seg<<4) + current_ip+1)),//On extrait le w
                immediateAddr = (current_code_seg<<4) + current_ip + 2 + operandes.dispSize ;
            if ((instruction % 2) == 1)  // the w bit //16bits
            {
                let immediatVal = this.RAM.readWord(immediateAddr);
                this.register.writeReg( AX_REG, this.register.readReg(AX_REG)&immediatVal);
               
            }
            else//8 bits
            {
                let immediatVal = this.RAM.readByte(immediateAddr);

               
                    this.register.writeReg( AX_REG, (this.register.readReg(AX_REG)&0x00ff)&immediatVal);
               
            }

            this.register.incIP(operandes.dispSize + (instruction % 2) + 3);
        }    
        else return -1;    
    }

    //decodeNot
    decodeNot(instruction)
    {
        var current_ip = this.register.readReg(IP_REG),
        current_code_segement = this.register.readReg(CS_REG);
        let operandes=this.extractOperand(this.RAM.readByte((current_code_segement<<4)+current_ip+1));

        if((instruction>>1)==NOT &&(operandes.opRegister[0]==0b010))
        {
       
         if(operandes.addr==null) // not reg
         {
             let R=operandes.opRegister[1];

             if((instruction%2)==1)//w
             {
                 let val = this.register.readWordReg(R);
                 val=~val;
                 this.register.writeWordReg(R,val&0xffff);

                 this.generateFlag(val&0xffff, val, val, 1,  0xFFFF & ~OVERFLOW_FLAG);

             }else
             {
                 let val=this.register.readByteReg(R);
                 val=~val;
                 this.register.writeByteReg(R,val&0xff);

                 this.generateFlag(val&0xff, val, val, 0, 0xFFFF & ~OVERFLOW_FLAG);
             }
         }
         else  //NOT [addr]
         {
             if((instruction%2)==1)//w
             {
                 let val=this.RAM.readWord(operandes.addr);
                 val=~val;
                 this.RAM.writeWord(operandes.addr,val&0xffff);

                 this.generateFlag(val&0xffff, val, val, 1,  0xFFFF & ~OVERFLOW_FLAG);

             }else //8 bits
             {
               
                 let val=this.RAM.readByte(operandes.addr);
                 val=~(val);
               
                 this.RAM.writeWord(operandes.addr,val&0xff);

                 this.generateFlag(val&0xff, val, val, 0, 0xFFFF & ~OVERFLOW_FLAG);
             }

         }

         this.register.incIP(operandes.dispSize /*+ (instruction % 2)*/ + 2);
         return 0;
        }
        else return -1;  
    }
//
     
    //Test
    decodeTest(instruction)
    {
        //We could (or we should) have merged it with "cmp"'s code

        var current_ip = this.register.readReg(IP_REG),
            current_code_segement = this.register.readReg(CS_REG);
        var operandes = this.extractOperand(this.RAM.readByte((current_code_segement<<4) + current_ip+1));

        if ((instruction & 0xFE) == 0b10000100 )
        {
               
            if (operandes.addr == null)
            {    
                let R1 = operandes.opRegister[0],
                    R2 = operandes.opRegister[1];
                   
                if ( instruction % 2 == 1 )
                {
                   
                    let valB = this.register.readWordReg(R2),
                        valA = this.register.readWordReg(R1);

                    this.generateFlag(valA&valB, valA, valB, 1);
                }
                else
                {
                   
                    let valB = this.register.readByteReg(R2),
                        valA = this.register.readByteReg(R1);

                    this.generateFlag(valA&valB, valA, valB, 0);
                   
                }

            }

            else
            {
                let R = operandes.opRegister[0],
                    addr = operandes.addr;
               
                if ( instruction % 2 == 1 ) //16bits
                {
                    let valB = this.RAM.readWord(addr),
                        valA = this.register.readWordReg(R);
                       
                    this.generateFlag(valA&valB, valA, valB, 1);
                }
                else    //8bits
                {
                   
                    let valB = this.RAM.readByte(addr),
                        valA = this.register.readByteReg(R);

                    this.generateFlag(valA&valB, valA, valB, 0);
                   
                }


            }

            this.register.incIP(operandes.dispSize + 2);//2 étant la taille de base de l'instruction
            //(pour passer a la prochaine instruction)

            return 0;
        }
       
        return -1;
       
    }
     //or
    decodeOr(instruction)
    {
       
        var current_ip = this.register.readReg(IP_REG),
        current_code_segement = this.register.readReg(CS_REG);
        var operandes = this.extractOperand(this.RAM.readByte((current_code_segement<<4) + current_ip+1));

        if ((instruction >>2) == OR_RM_RM )
        {
 
            if (operandes.addr == null)
            {   // R to R-----------------------------------------------------
              let R1 = operandes.opRegister[0],
                  R2 = operandes.opRegister[1];
            
                if ( instruction % 2 == 1 )
                {
                    let value1 = this.register.readWordReg(R1),
                        value2 = this.register.readWordReg(R2),
                        value = value1 | value2;

                    if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                        this.register.writeWordReg(R1, value );
                    
                    else
                        this.register.writeWordReg(R2, value );
                    
                    this.generateFlag(value, value1, value2, 1);
                }
                else
                {
                    let value1 = this.register.readByteReg(R1),
                        value2 = this.register.readByteReg(R2),
                        value = value1 | value2;

                    if ((instruction >> 1) % 2) // On extrait le dif
                        this.register.writeByteReg(R1, value);
                    
                    else
                        this.register.writeByteReg(R2, value);


                    this.generateFlag(value, value1, value2, 0); 
                }
            
            }

            else
            {   // MEM TO/FROM R----------------------------------------------
                let R = operandes.opRegister[0],
                    addr = operandes.addr;

                let value1 = this.RAM.readWord(addr),
                    value2 = this.register.readWordReg(R),
                    value = value1 | value2;

                if ( (instruction % 2) == 1 ) //16bits //the w bit
                {

                    if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                    
                        this.register.writeWordReg(R, value);
                    
                    else // d=0 => from reg

                        this.RAM.writeWord(addr, value);
                    
                    this.generateFlag(value, value1, value2, 1); 
                    
                }
                else    //8bits
                {

                    if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg

                        this.register.writeByteReg(R, value);
                    
                    else // d=0 => from reg

                        this.RAM.writeByte(addr, value);
                    
                    this.generateFlag(value, value1, value2, 0); 
                
                }
            }
 
              this.register.incIP(operandes.dispSize + 2);//2 étant la taille de base de l'instruction
              //(pour passer a la prochaine instruction)
              return 0;
        }
        else return -1;  
    }
 
   //xor
    decodeXor(instruction)
    {
     
        var current_ip = this.register.readReg(IP_REG),
        current_code_segement = this.register.readReg(CS_REG);
        var operandes = this.extractOperand(this.RAM.readByte((current_code_segement<<4) + current_ip+1));

        if ((instruction >>2) == XOR_RM_RM )
        {
            
            if (operandes.addr == null)
            {   // R to R-----------------------------------------------------
                let R1 = operandes.opRegister[0],
                    R2 = operandes.opRegister[1];
            
                if ( instruction % 2 == 1 )
                {
                    let value1 = this.register.readWordReg(R1),
                        value2 = this.register.readWordReg(R2),
                        value = value1 ^ value2;

                    if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                        this.register.writeWordReg(R1, value );
                    
                    else
                        this.register.writeWordReg(R2, value );
                    
                    this.generateFlag(value, value1, value2, 1);
                }
                else
                {
                    let value1 = this.register.readByteReg(R1),
                        value2 = this.register.readByteReg(R2),
                        value = value1 ^ value2;

                    if ((instruction >> 1) % 2) // On extrait le dif
                        this.register.writeByteReg(R1, value);
                    
                    else
                        this.register.writeByteReg(R2, value);


                    this.generateFlag(value, value1, value2, 0); 
                }
            }
            else
            {   // MEM TO/FROM R----------------------------------------------
                let R = operandes.opRegister[0],
                    addr = operandes.addr;
                
                let value1 = this.RAM.readWord(addr),
                    value2 = this.register.readWordReg(R),
                    value = value1 ^ value2;

                if ( (instruction % 2) == 1 ) //16bits //the w bit
                {

                    if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg
                    
                        this.register.writeWordReg(R, value);
                    
                    else // d=0 => from reg

                        this.RAM.writeWord(addr, value);
                    
                    this.generateFlag(value, value1, value2, 1); 
                    
                }
                else    //8bits
                {

                    if ((instruction >> 1) % 2) // On extrait le dif ||d=1 =>to Reg

                        this.register.writeByteReg(R, value);
                    
                    else // d=0 => from reg

                        this.RAM.writeByte(addr, value);
                    
                    this.generateFlag(value, value1, value2, 0); 
                
                }
            }

            this.register.incIP(operandes.dispSize + 2);//2 étant la taille de base de l'instruction
            //(pour passer a la prochaine instruction)
            return 0;
        }else return -1;  
    }
 
    decodeRol(instruction)
   {
       let current_ip=this.register.readReg(IP_REG);
       let current_code_segement=this.register.readReg(CS_REG);
       var operandes = this.extractOperand(this.RAM.readByte((current_code_segement<<4) + current_ip+1));
       if(((instruction >>2)==ROL) && (operandes.opRegister[0]==0b000))
       {
     
           if(operandes.addr==null)
           {
               let R=operandes.opRegister[1];
               let v=(instruction>>1)%2;
               if((instruction%2)==1)//the w bit ==1
               {
                   let val=this.register.readWordReg(R);
                   if(v)//the number of iteration is stored in  cx register
                   {
                       
                       let cx=this.register.readReg(CX_REG)&0x00fff;
                      for(let i=0;i<cx;i++)
                      {
                         
                          let msb=(val&0b1000000000000000)>>15;

                           val=val<<1;
                           if(msb)val=val|0b0000000000000001;
                           else val= val & 0b1111111111111110;
                           val&=0xffff;
                           
                      }
                      this.register.writeWordReg(R,val);
                      this.register.writeReg(CX_REG,cx&0xff00);


                   }
                   else //the op code of the instruction is repeated many times in memory
                   {
                       let msb=(val&0b1000000000000000)>>15;
                       val=val<<1;
                       if(msb)val=val|0b0000000000000001;
                       else val= val & 0b1111111111111110;
                       val&=0xffff;
                       this.register.writeWordReg(R,val);

                   }

               }else  //the w bit ==0
               {
                   if(v)//the number of iteration is stored in  cx register
                   {
                       let val=this.register.readByteReg(R);
                       let cx=this.register.readReg(CX_REG)&0x00ff;
                      for(let i=0;i<cx;i++)
                      {
                       
                       let msb=(val&0b10000000)>>7;
                       val=val<<1;
                       if(msb)val=val|0b00000001;
                       else val= val & 0b11111110;
                       val&=0xff;
                       
                      }
                      this.register.writeByteReg(R,val);
                      this.register.writeReg(CX_REG,cx&0xff00);


                   }
                   else //the op code of the instruction is repeated many times in memory
                   {
                       let val=this.register.readByteReg(R);
                       let msb=(val&0b10000000)>>7;
                       val=val<<1;
                       if(msb)val=val|0b00000001;
                       else val= val & 0b11111110;
                       val&=0xff;
                       this.register.writeByteReg(R,val);

                   }

               }


           }else //the operandes.addr is not null
           {
               let v=(instruction>>1)%2;
               if(instruction%2==1)//16 bits
               {
                   let val = this.RAM.readWord(operandes.addr);
                   if(v)
                   {
                       
                       let cx=this.register.readReg(CX_REG)&0x00ff;
                   
                       for(let i=0;i<cx;i++)
                       {
                           let msb=(val&0b1000000000000000)>>15;
                            val=val<<1;
                            if(msb)val=val|0b0000000000000001;
                            else val= val & 0b1111111111111110;
                            val&=0xffff;
                           
                       }
                   
                       this.RAM.writeWord(operandes.addr,val);
                       this.register.writeReg(CX_REG,cx&0xff00);
                   }
                   else
                   {
                       let msb=(val&0b1000000000000000)>>15;
                       val=val<<1;
                       if(msb)val=val|0b0000000000000001;
                       else val= val & 0b1111111111111110;
                       val&=0xffff;
                       this.RAM.writeWord(operandes.addr,val);

                   }

               }
               else //8bits
               {
                   let val = this.RAM.readByte(operandes.addr);
                   if(v)
                   {
                       let cx=this.register.readReg(CX_REG)&0x00ff;
                       for(let i=0;i<cx;i++)
                       {
                           let msb=(val&0b10000000)>>7;
                            val=val<<1;
                            if(msb)val=val|0b00000001;
                           else val= val & 0b11111110;
                           val&=0xff;
                       }
                       this.register.writeByteReg(operandes.addr,val);
                       this.register.writeReg(CX_REG,cx&0xff00);
                   }
                   else
                   {
                       let msb=(val&0b10000000)>>7;
                       val=val<<1;
                       if(msb)val=val|0b00000001;
                       else val= val & 0b11111110;
                       val&=0xff;
                       this.RAM.writeByte(operandes.addr,val);

                   }

       
           }
           
       }
       //
       this.register.incIP(2);
       return 0;
   }
   else return -1;
    }
    //
    decodeRor(instruction)
    {
        let current_ip=this.register.readReg(IP_REG);
        let current_code_segement=this.register.readReg(CS_REG);
        let operandes=this.extractOperand(this.RAM.readByte((current_code_segement<<4)+current_ip+1));

        if(((instruction >> 2)==ROR) && (operandes.opRegister[0]==0b001))
        {
           
            if(operandes.addr==null)
            {
                let R=operandes.opRegister[1];
                let v=(instruction>>1)%2;
                if(instruction%2==1)//the w bit ==1
                {
                    let val=this.register.readWordReg(R);
                    if(v)//the number of iteration is stored in  cx register
                    {
                       
                        let cx=this.register.readReg(CX_REG)&0x00ff;
                       for(let i=0;i<cx;i++)
                       {
                           
                            let lsb=val&0b0000000000000001;
                            val=val>>1;
                            if(lsb)val=val|0b1000000000000000;
                            else val= val & 0b0111111111111111;
                            val&=0xffff;
                           
                       }
                       this.register.writeWordReg(R,val);
                       this.register.writeReg(CX_REG,cx&0xff00);


                    }
                    else //the op code of the instruction is repeated many times in memory
                    {
                        let lsb=val&0b0000000000000001;
                        val=val>>1;
                        if(lsb)val=val|0b1000000000000000;
                            else val= val & 0b0111111111111111;
                            val&=0xffff;
                        this.register.writeWordReg(R,val);

                    }

                }
                else  //the w bit ==0
                {
                    if(v)//the number of iteration is stored in  cx register
                    {
                        let val=this.register.readByteReg(R);
                        let cx=this.register.readReg(CX_REG)&0x00ff;
                       for(let i=0;i<cx;i++)
                       {
                        let lsb=val&0b00000001;
                        val=val>>1;
                        if(lsb)val=val|0b10000000;
                        else val= val & 0b01111111;
                        val&=0xff;
                       
                       }
                       this.register.writeByteReg(R,val);
                       this.register.writeReg(CX_REG,cx&0xff00);


                    }
                    else //the op code of the instruction is repeated many times in memory
                    {
                        let val=this.register.readByteReg(R);
                        let lsb=val&0b00000001;
                        val=val>>1;
                        if(lsb)val=val|0b10000000;
                        else val= val & 0b01111111;
                        val&=0xff;
                        this.register.writeByteReg(R,val);

                    }

                }

                this.register.incIP(2);
            }
            else //the operandes.addr is not null
            {
                let v=(instruction>>1)%2;

                if(instruction%2==1)//16 bits
                {
                    let val = this.RAM.readWord(operandes.addr);
                    if(v)
                    {
                        let cx=this.register.readReg(CX_REG);
                        for(let i=0;i<cx;i++)
                        {
                            let lsb=val&0b0000000000000001;
                             val=val>>1;
                             if(lsb)val=val|0b1000000000000000;
                            else val= val & 0b0111111111111111;
                            val&=0xffff;
                        }
                        this.RAM.writeWord(operandes.addr,val);
                        this.register.writeReg(CX_REG,0);
                    }
                    else
                    {
                        let lsb=val&0b0000000000000001;
                        val=val>>1;
                        if(lsb)val=val|0b1000000000000000;
                            else val= val & 0b0111111111111111;
                            val&=0xffff;
                        this.RAM.writeWord(operandes.addr,val);

                    }

                }
                else //8bits
                {
                    let val = this.RAM.readByte(operandes.addr);
                    if(v)
                    {
                        let cx=this.register.readReg(CX_REG)&0x00ff;
                        for(let i=0;i<cx;i++)
                        {
                            let lsb=val&0b00000001;
                             val=val>>1;
                             if(lsb)val=val|0b10000000;
                             else val= val & 0b01111111;
                             val&=0xff;
                        }
                        this.RAM.writeByte(operandes.addr,val);
                        this.register.writeReg(CX_REG,cx&0xff00);
                    }
                    else
                    {
                        let lsb=val&0b00000001;
                        val=val>>1;
                        if(lsb)val=val|0b10000000;
                        else val= val & 0b01111111;
                        val&=0xff;
                        this.RAM.writeByte(operandes.addr,val);

                    }

       
                }
               
                this.register.incIP(2 + operandes.dispSize);
            }
       
        return 0;
        }
    else
        return -1;
    }
    //////////////////////////////////////////////////////////////////////////////////////
    //rcl
   //rcl
    decodeRcl(instruction)
    {
       let current_ip=this.register.readReg(IP_REG);
       let current_code_segement=this.register.readReg(CS_REG);
       let operandes=this.extractOperand(this.RAM.readByte((current_code_segement<<4)+current_ip+1));
       if(((instruction>>2)==RCL) && (operandes.opRegister[0]==0b010))
       {
           
           if(operandes.addr==null)
           {
               let R=operandes.opRegister[1];
               let v=(instruction>>1)%2;
               if(instruction%2==1)//the w bit ==1
               {
                   let val=this.register.readWordReg(R);
                   if(v)//the number of iteration is stored in  cx register
                   {
                       
                       let cx=this.register.readReg(CX_REG)&0x00ff;
                      for(let i=0;i<cx;i++)
                      {
                         
                          let msb=(val&0b1000000000000000)>>15;
                          let pc =this.register.extractFlag('C');//the previous carry
                          this.register.setFlag('C',msb);
                           val=val<<1;
                           if(pc)val=val|0b0000000000000001;
                           else val= val & 0b1111111111111110;
                           val&=0xffff;
                           
                           
                      }
                      this.register.writeWordReg(R,val);
                      this.register.writeReg(CX_REG,cx&0xff00);


                   }
                   else //the op code of the instruction is repeated many times in memory
                   {
                       let msb=val&0b1000000000000000>>15;
                       let pc =this.register.extractFlag('C');//the previous carry
                       this.register.setFlag('C',msb);
                       val=val<<1;
                       if(pc)val=val|0b0000000000000001;
                       else val= val & 0b1111111111111110;
                       val&=0xffff;
                       this.register.writeWordReg(R,val);

                   }

               }else  //the w bit ==0
               {
                   if(v)//the number of iteration is stored in  cx register
                   {
                       let val=this.register.readByteReg(R);
                       let cx=this.register.readReg(CX_REG)&0x00ff;
                      for(let i=0;i<cx;i++)
                      {
                       
                       let msb=(val&0b10000000)>>7;
                       let pc=this.extractFlag('C');//the previous carry
                       this.register.setFlag('C',msb);
                       val=val<<1;
                       if(pc)val=val|0b00000001;
                       else val= val & 0b11111110;
                       val&=0xff;
                       
                      }
                      this.register.writeByteReg(R,val);
                      this.register.writeReg(CX_REG,cx&0xff00);


                   }
                   else //the op code of the instruction is repeated many times in memory
                   {
                       let val=this.register.readByteReg(R);
                       let msb=(val&0b10000000)>>7;
                       let pc=this.extractFlag('C');
                       this.register.setFlag('C',msb);
                       val=val<<1;
                       if(pc)val=val|0b00000001;
                       else val= val & 0b11111110;
                       val&=0xff;
                       this.register.writeByteReg(R,val);

                   }

               }


           }else //the operandes.addr is not null
           {
               let v=(instruction>>1)%2;
               if(instruction%2==1)//16 bits
               {
                   let val = this.RAM.readWord(operandes.addr);
                   if(v)
                   {
                       let cx=this.register.readReg(CX_REG)&0x00ff;
                       for(let i=0;i<cx;i++)
                       {
                           let msb=(val&0b1000000000000000)>>15;
                           let pc =this.register.extractFlag('C');//the previous carry
                           this.register.setFlag('C',msb);
                            val=val<<1;
                            if(pc)val=val|0b0000000000000001;
                            else val= val & 0b1111111111111110;
                            val&=0xffff;
                       }
                       this.RAM.writeWord(operandes.addr,val);
                       this.register.writeReg(CX_REG,cx&0xff00);
                   }
                   else
                   {
                       let msb=(val&0b1000000000000000)>>15;
                           let pc =register.extractFlag('C');//the previous carry
                           this.register.setFlag('C',msb);
                            val=val<<1;
                            if(pc)val=val|0b0000000000000001;
                            else val= val & 0b1111111111111110;
                            val&=0xffff;
                       this.RAM.writeWord(operandes.addr,val);

                   }

               }
               else //8bits
               {
                   let val = this.RAM.readByte(operandes.addr);
                   if(v)
                   {
                       let cx=this.register.readReg(CX_REG)&0x00ff;
                       for(let i=0;i<cx;i++)
                       {
                           let msb=(val&0b10000000)>>7;
                           let pc=this.extractFlag('C');//the previous carry
                           this.register.setFlag('C',msb);
                           val=val<<1;
                           if(pc)val=val|0b00000001;
                           else val= val & 0b11111110;
                           val&=0xff;
                       }
                       this.RAM.writeByte(operandes.addr,val);
                       this.register.writeReg(CX_REG,CX&0xff00);
                   }
                   else
                   {
                       let msb=(val&0b10000000)>>7;
                       let pc=this.extractFlag('C');//the previous carry
                       this.register.setFlag('C',msb);
                       val=val<<1;
                       if(pc)val=val|0b00000001;
                       else val= val & 0b11111110;
                       val&=0xff;
                       this.RAM.writeByte(operandes.addr,val);

                   }

       
           }
           
       }
       this.register.incIP(2);
       return 0;
       //
   } else return -1;
    }
    //rcr
    //rcr
    decodeRcr(instruction)
    {
        let current_ip=this.register.readReg(IP_REG);
        let current_code_segement=this.register.readReg(CS_REG);
        let operandes=this.extractOperand(this.RAM.readByte((current_code_segement<<4)+current_ip+1));
        if(((instruction >>2)==RCR)  && (operandes.opRegister[0]==0b011))
        {
           
            if(operandes.addr==null)
            {
                let R=operandes.opRegister[1];
                let v=(instruction>>1)%2;
                if(instruction%2==1)//the w bit ==1
                {
                    let val=this.register.readWordReg(R);
                    if(v)//the number of iteration is stored in  cx register
                    {
                       
                        let cx=this.register.readReg(CX_REG)&0x00ff;
                       for(let i=0;i<cx;i++)
                       {
                         
                           let lsb=val&0b0000000000000001;
                           let pc =this.register.extractFlag('C');//the previous carry
                           this.register.setFlag('C',lsb);
                            val=val>>1;
                            if(pc)val=val|0b1000000000000000;
                            else val= val & 0b0111111111111111;
                            val&=0xffff;
                           
                           
                       }
                       this.register.writeWordReg(R,val);
                       this.register.writeReg(CX_REG,cx&0xff00);


                    }
                    else //the op code of the instruction is repeated many times in memory
                    {
                        let lsb=val&0b0000000000000001;
                        let pc =register.extractFlag('C');//the previous carry
                        this.register.setFlag('C',lsb);
                         val=val>>1;
                         if(pc)val=val|0b1000000000000000;
                         else val= val & 0b0111111111111111;
                         val&=0xffff;
                        this.register.writeWordReg(R,val);

                    }

                }else  //the w bit ==0
                {
                    if(v)//the number of iteration is stored in  cx register
                    {
                        let val=this.register.readByteReg(R);
                        let cx=this.register.readReg(CX_REG)&0x00ff;
                       for(let i=0;i<cx;i++)
                       {
                       
                        let lsb=val&0b00000001;
                        let pc=this.register.extractFlag('C');//the previous carry
                        this.register.setFlag('C',lsb);
                        val=val>>1;
                        if(pc)val=val|0b10000000;
                        else val= val & 0b01111111;
                        val&=0xff;
                       
                       }
                       this.register.writeByteReg(R,val);
                       this.register.writeReg(CX_REG,cx&0xff00);


                    }
                    else //the op code of the instruction is repeated many times in memory
                    {
                        let lsb=val&0b00000001;
                        let pc=this.register.extractFlag('C');//the previous carry
                        this.register.setFlag('C',lsb);
                        val=val>>1;
                        if(pc)val=val|0b10000000;
                        else val= val & 0b01111111;
                        val&=0xff;
                        this.register.writeByteReg(R,val);

                    }

                }


            }else //the operandes.addr is not null
            {
                let v=(instruction>>1)%2;
                if(instruction%2==1)//16 bits
                {
                    let val = this.RAM.readWord(operandes.addr);
                    if(v)
                    {
                        let cx=this.register.readReg(CX_REG)&0x00ff;
                        for(let i=0;i<cx;i++)
                        {
                            let lsb=val&0b0000000000000001;
                            let pc =this.register.extractFlag('C');//the previous carry
                            this.register.setFlag('C',lsb);
                             val=val>>1;
                             if(pc)val=val|0b1000000000000000;
                             else val= val & 0b0111111111111111;
                             val&=0xffff;
                        }
                        this.RAM.writeWord(operandes.addr,val);
                        this.register.writeReg(CX_REG,cx&0xff00);
                    }
                    else
                    {
                        let lsb=val&0b0000000000000001;
                        let pc =register.extractFlag('C');//the previous carry
                        this.register.setFlag('C',lsb);
                         val=val>>1;
                         if(pc)val=val|0b1000000000000000;
                         else val= val & 0b0111111111111111;
                         val&=0xffff;
                        this.RAM.writeWord(operandes.addr,val);

                    }

                }
                else //8bits
                {
                    let val = this.RAM.readByte(operandes.addr);
                    if(v)
                    {
                        let cx=this.register.readReg(CX_REG)&0x00ff;
                        for(let i=0;i<cx;i++)
                        {
                            let lsb=val&0b00000001;
                            let pc=this.register.extractFlag('C');//the previous carry
                            this.register.setFlag('C',lsb);
                            val=val>>1;
                            if(pc)val=val|0b10000000;
                            else val= val & 0b01111111;
                            val&=0xff;
                        }
                        this.RAM.writeByte(operandes.addr,val);
                        this.register.writeReg(CX_REG,cx&0xff00);
                    }
                    else
                    {
                        let lsb=val&0b00000001;
                        let pc=this.register.extractFlag('C');//the previous carry
                        this.register.setFlag('C',lsb);
                        val=val>>1;
                        if(pc)val=val|0b10000000;
                        else val= val & 0b01111111;
                        val&=0xff;
                        this.RAM.writeByte(operandes.addr,val);

                    }

       
            }
           
        }
        //
        this.register.incIP(2);
        return 0;
    }else return -1;
    }
     //shr
    decodeShr(instruction)
    {
             let current_ip=this.register.readReg(IP_REG);
             let current_code_segement=this.register.readReg(CS_REG);
             let operandes=this.extractOperand(this.RAM.readByte((current_code_segement<<4)+current_ip+1));
             if(((instruction>>2)==SHR) && (operandes.opRegister[0]==0b101))
             {
               
               
                 if(operandes.addr==null)
                 {
                     let R=operandes.opRegister[1];
                     let v=(instruction>>1)%2;
                     if(instruction%2==1)//the w bit ==1
                     {
                       
                         let val=this.register.readWordReg(R);
                       
                         if(v)//the number of iteration is stored in  cx register
                         {
                           
                             let cx=this.register.readReg(CX_REG)&0x00ff;
                           
                            for(let i=0;i<cx;i++)
                            {
                             let lsb=val&0b0000000000000001;
                             this.register.setFlag('C',lsb);
                             val=val>>1;
                           
                            }
                           
                            this.register.writeWordReg(R,val);
                            this.register.writeReg(CX_REG,cx&0xff00);
     
     
                         }
                         else //the op code of the instruction is repeated many times in memory
                         {
                             
                             let lsb=val&0b0000000000000001;
                             this.register.setFlag('C',lsb);
                             val=val>>1;
                             this.register.writeWordReg(R,val);
     
                         }
     
                     }else  //the w bit ==0
                     {
                         if(v)//the number of iteration is stored in  cx register
                         {
                             let val=this.register.readByteReg(R);
                             let cx=this.register.readReg(CX_REG)&0x00ff;
                            for(let i=0;i<cx;i++)
                            {
                                let lsb=val&0b00000001;
                                this.register.setFlag('C',lsb);
                                 val=val>>1;
                            }
                            this.register.writeByteReg(R,val);
                            this.register.writeReg(CX_REG,cx&0xff00);
     
     
                         }
                         else //the op code of the instruction is repeated many times in memory
                         {
                             let val=this.register.readByteReg(R);
                             let lsb=val&0b00000001;
                             this.register.setFlag('C',lsb);
                             val=val>>1;
                             this.register.writeByteReg(R,val);
     
                         }
     
                     }
     
     
                 }else //the operandes.addr is not null
                 {
                     let v=(instruction>>1)%2;
                     if(instruction%2==1)//16 bits
                     {
                   
                         let val = this.RAM.readWord(operandes.addr);
                         if(v)
                         {
                             let cx=this.register.readReg(CX_REG)&0x00ff;
                             for(let i=0;i<cx;i++)
                             {
                                  let lsb=val&0b0000000000000001;
                                  this.register.setFlag('C',lsb);
                                  val=val>>1;
                             }
                             this.RAM.writeWord(operandes.addr,val);
                             this.register.writeReg(CX_REG,cx&0xff00);
                         }
                         else
                         {
                           
                           
                             let lsb=val&0b0000000000000001;
                             this.register.setFlag('C',lsb);
                             val=val>>1;
                           
                             this.RAM.writeWord(operandes.addr,val);
     
                         }
     
                     }
                     else //8bits
                     {
                       
                         let val = this.RAM.readByte(operandes.addr);
                     
                         if(v)
                         {
                             
                             let cx=this.register.readReg(CX_REG)&0x00ff;
                             for(let i=0;i<cx;i++)
                             {
                                 let lsb=val&0b00000001;
                                 this.register.setFlag('C',lsb);
                                  val=val>>1;
                             }
                             this.RAM.writeByte(operandes.addr,val);
                             this.register.writeReg(CX_REG,cx&0xff00);
                         }
                         else
                         {
                           
                           
                             let lsb=val&0b00000001;
                             this.register.setFlag('C',lsb);
                             val=val>>1;
                             this.RAM.writeByte(operandes.addr,val);
                           
                           
     
                         }
     
             
                 }
                 
             }
             //
             this.register.incIP(2);
              return 0;
             }
             else return -1;
    }
         //

    //
    decodeShl(instruction)
    {
        let current_ip=this.register.readReg(IP_REG);
             let current_code_segement=this.register.readReg(CS_REG);
             let operandes=this.extractOperand(this.RAM.readByte((current_code_segement<<4)+current_ip+1));
             console.log();
        if(((instruction&0xFC)==SHL_SAL) && (operandes.opRegister[0]==0b100))
        {
           
            if(operandes.addr==null)
            {
                let R=operandes.opRegister[1];
                let v=(instruction>>1)%2;
                if(instruction%2==1)//the w bit ==1
                {
                    let val=this.register.readWordReg(R);
                    if(v)//the number of iteration is stored in  cl register
                    {
                       
                        let cx=this.register.readReg(CX_REG)&0x00ff;
                       for(let i=0;i<cx;i++)
                       {
                           let msb=val&0b1000000000000000>>15;
                           this.register.setFlag('C',msb);
                            val=val<<1;
                       }
                       this.register.writeWordReg(R,val);
                       this.register.writeReg(CX_REG,cx&0xff00);


                    }
                    else //the op code of the instruction is repeated many times in memory
                    {
                        let msb=val&0b1000000000000000>>15;
                        this.register.setFlag('C',msb);
                        val=val<<1;
                        this.register.writeWordReg(R,val);

                    }

                }else  //the w bit ==0
                {
                    if(v)//the number of iteration is stored in  cx register
                    {
                        let val=this.register.readByteReg(R);
                        let cx=this.register.readReg(CX_REG)&0x00ff;
                       for(let i=0;i<cx;i++)
                       {
                        let msb=val&0b10000000>>7;
                        this.register.setFlag('C',msb);
                            val=val<<1;
                       }
                       this.register.writeByteReg(R,val);
                       this.register.writeReg(CX_REG,cx&0xff00);


                    }
                    else //the op code of the instruction is repeated many times in memory
                    {
                        let val=this.register.readByteReg(R);
                        let msb=val&0b10000000>>7;
                        this.register.setFlag('C',msb);
                        val=val<<1;
                        this.register.writeByteReg(R,val);

                    }

                }


            }else //the operandes.addr is not null
            {
                let v=(instruction>>1)%2;
                if(instruction%2==1)//16 bits
                {
                    let val = this.RAM.readWord(operandes.addr);
                    if(v)
                    {
                   
                        let cx=this.register.readReg(CX_REG)&0x00ff;
                        for(let i=0;i<cx;i++)
                        {
                            let msb=val&0b1000000000000000>>15;
                            this.register.setFlag('C',msb);
                             val=val<<1;
                        }
                        this.RAM.writeWord(operandes.addr,val);
                        this.register.writeReg(CX_REG,cx&0xff00);
                    }
                    else
                    {
                       
                        let msb=val&0b1000000000000000>>15;
                        this.register.setFlag('C',msb);
                        val=val<<1;
                        this.RAM.writeWord(operandes.addr,val);

                    }

                }
                else //8bits
                {
                   
                    let val = this.RAM.readByte(operandes.addr);
                    if(v)
                    {
                   
                        let cx=this.register.readReg(CX_REG)&0x00ff;
                       
                        for(let i=0;i<cx;i++)
                        {
                            let msb=val&0b10000000>>7;
                            this.register.setFlag('C',msb);
                             val=val<<1;
                           
                        }
                       
                        this.RAM.writeByte(operandes.addr,val&0xff);
                        this.register.writeReg(CX_REG,cx&0xff00);
                    }
                    else
                    {
                        let msb=val&0b10000000>>7;
                        this.register.setFlag('C',msb);
                        val=val<<1;
                        this.RAM.writeByte(operandes.addr,val);

                    }

       
            }
           
        }
        this.register.incIP(2);
        return 0;
        //
    //
        }
        else return -1;
    }
    //

    decodeSar(instruction)
    {
        let current_ip=this.register.readReg(IP_REG);
        let current_code_segement=this.register.readReg(CS_REG);
        let operandes=this.extractOperand(this.RAM.readByte((current_code_segement<<4)+current_ip+1));
        if((instruction >>2==SAR) && (operandes.opRegister[0]==0b111))
        {
           
            if(operandes.addr==null)
            {
                let R=operandes.opRegister[1];
                let v=(instruction>>1)%2;
                if(instruction%2==1)//the w bit ==1
                {
                   
                    let val=this.register.readWordReg(R);
                    if(v)//the number of iteration is stored in  cx register
                    {
                       
                        let cx=this.register.readReg(CX_REG)&0x00ff;
                       
                       for(let i=0;i<cx;i++)
                       {
                        let lsb=val&0b0000000000000001;
                        this.register.setFlag('C',lsb);
                        let msb=(val&1000000000000000)>>15;
                        val=val>>1;
                       
                        if(msb)val=val|1000000000000000;
                        val&=0xffff;
                       
                       }    
                     
                      // console.log(this.register.readReg(AX_REG))
                       this.register.writeWordReg(R,val);
                       this.register.writeReg(CX_REG,cx&0xff00);


                    }
                    else //the op code of the instruction is repeated many times in memory
                    {
                       
                        let lsb=val&0b0000000000000001;
                        this.register.setFlag('C',lsb);
                        let msb=(val&1000000000000000)>>15;
                        val=val>>1;
                        if(msb)val=val|1000000000000000;
                        val&=0xffff;
                        this.register.writeWordReg(R,val);

                    }

                }else  //the w bit ==0
                {
                    if(v)//the number of iteration is stored in  cx register
                    {
                        let val=this.register.readByteReg(R);
                        let cx=this.register.readReg(CX_REG)&0x00ff;
                       for(let i=0;i<cx;i++)
                       {
                           let lsb=val&0b00000001;
                           this.register.setFlag('C',lsb);
                           let msb=(val&10000000)>>7;
                            val=val>>1;
                            if(msb)val=val|10000000;
                            val&=0xff;
                       }
                       this.register.writeByteReg(R,val);
                       this.register.writeReg(CX_REG,cx&0xff00);


                    }
                    else //the op code of the instruction is repeated many times in memory
                    {
                        let val=this.register.readByteReg(R);
                        let lsb=val&0b00000001;
                        this.register.setFlag('C',lsb);
                        let msb=(val&10000000)>>7;
                        val=val>>1;
                        if(msb)val=val|10000000;
                        val&=0xff;
                        this.register.writeByteReg(R,val);

                    }

                }


            }else //the operandes.addr is not null
            {
                let v=(instruction>>1)%2;
                if(instruction%2==1)//16 bits
                {
                    let val = this.RAM.readWord(operandes.addr);
                    if(v)
                    {
                        let cx=this.register.readReg(CX_REG)&0x00ff;
                       
                        for(let i=0;i<cx;i++)
                        {
                           
                             let lsb=val&0b0000000000000001;
                             this.register.setFlag('C',lsb);
                             let msb=(val&1000000000000000)>>15;
                             val=val>>1;
                             if(msb)val=val|1000000000000000;
                             val&=0xffff;
                           
                             
                             
                        }
                       
                        this.RAM.writeWord(operandes.addr,val);
                        this.register.writeReg(CX_REG,cx&0xff00);
                    }
                    else
                    {
                        let lsb=val&0b0000000000000001;
                        this.register.setFlag('C',lsb);
                        let msb=(val&1000000000000000)>>15;
                        val=val>>1;
                        if(msb)val=val|1000000000000000;
                        val&=0xffff;
                        this.RAM.writeWord(operandes.addr,val);

                    }

                }
                else //8bits
                {
                    let val = this.RAM.readByte(operandes.addr);
                    if(v)
                    {
                       
                        let cx=this.register.readReg(CX_REG)&0x00ff;
                        for(let i=0;i<cx;i++)
                        {
                            let lsb=val&0b00000001;
                            this.register.setFlag('C',lsb);
                            let msb=(val&10000000)>>7;
                            val=val>>1;
                            if(msb)val=val|10000000;
                            val&=0xff;
                        }
                        this.RAM.writeByte(operandes.addr,val);
                        this.register.writeReg(CX_REG,cx&0xff00);
                    }
                    else
                    {
                        let lsb=val&0b00000001;
                        this.register.setFlag('C',lsb);
                        let msb=(val&10000000)>>7;
                            val=val>>1;
                            if(msb)val=val|10000000;
                            val&=0xff;
                        this.RAM.writeByte(operandes.addr,val);

                    }

       
            }
           
        }
        //
     return 0;
        }
        else return -1;
    }

    //================================================================================
    //YANIS_MAN
    //================================================================================
    decodeRep(instruction) {
        if ( (instruction & 0b11111110) == REP_INS ) {
            
            let current_ip=this.register.readReg(IP_REG);
            let current_code_segement=this.register.readReg(CS_REG);
            let next_instruction = this.RAM.readByte(current_ip + (current_code_segement << 4) + 1)

            if (this.register.readReg(CX_REG) == 0)
            {
                this.register.incIP(2);
                return 0;
            }

            let cmpDecoded = false;

            if (this.decodeMOVS(next_instruction, true) == 0) {
                console.log('rep movs');
            }
            else if (this.decodeLODS(next_instruction, true) == 0) {
                console.log('rep lods');
            }
            else if (this.decodeSTOS(next_instruction, true) == 0) {
                console.log('rep stos');
            }
            else if (this.decodeCMPS(next_instruction, true) == 0) {
                console.log('rep cmps');
                cmpDecoded = true;
            }
            else if (this.decodeSCAS(next_instruction, true) == 0) {
                console.log('rep scas');
                cmpDecoded = true;
            }
            else {
                console.error('REP error');
            }

            this.register.writeReg(CX_REG, this.register.readReg(CX_REG) - 1);
            
            if( (((instruction % 2) == 1 && this.register.extractFlag('Z') == 0) && cmpDecoded)
             || ((instruction % 2) == 0 && this.register.extractFlag('Z') == 1)) // For REPNE 
            {
                this.register.incIP(2);
                return 0;
            }

            return 0;
        }
        return 1;
    }

    decodeMOVS(instruction, given = false){

        if((instruction & 0b11111110) == MOVS_INS)
        {
            let offset1 = this.register.readReg(DI_REG),
                offset2 = this.register.readReg(SI_REG),
                segment1 = this.register.readReg(ES_REG),
                segment2 = this.register.readReg(DS_REG);
       
            let effictiveAdress1 = (segment1 << 4) + offset1,
                effictiveAdress2 = (segment2 << 4) + offset2;//destination
   
            //WORD MODE
            if (instruction % 2)
            {
       
                this.RAM.writeWord(effictiveAdress1, this.RAM.readWord(effictiveAdress2));
       
                if(!this.register.extractFlag('D'))
                {
                    this.register.writeReg(DI_REG, offset1 + 2);
                    this.register.writeReg(SI_REG, offset2 + 2);
                }
                else
                {
                    this.register.writeReg(DI_REG, offset1 - 2);
                    this.register.writeReg(SI_REG, offset2 - 2);
                }
       
            }

            //BYTE MODE
            else
            {
               
                this.RAM.writeByte(effictiveAdress1, this.RAM.readByte(effictiveAdress2));
       
                if(!this.register.extractFlag('D'))
                {
                    this.register.writeReg(DI_REG, offset1 + 1);
                    this.register.writeReg(SI_REG, offset2 + 1);
                }
                else
                {
                    this.register.writeReg(DI_REG, offset1 - 1);
                    this.register.writeReg(SI_REG, offset2 - 1);
                }
       
            }

            if (!given)
                this.register.incIP(1);

            return 0;

        }
       
        return -1;
       
    }

    decodeLODS(instruction, given = false){

   
        if((instruction & 0b11111110) == LODS_INS)
        {
           
            let offset1 = this.register.readReg(SI_REG),
                segment1 = this.register.readReg(DS_REG);

            if(instruction % 2 )
            {
                var data = this.RAM.readWord(segment1 << 4 + offset1);
   
                this.register.writeReg(AX_REG,data);
   
                if(!this.register.extractFlag('D'))
                    this.register.writeReg(SI_REG, offset1 + 2);
                else
                    this.register.writeReg(SI_REG, offset1 - 2);   
   
            }
            else  
            {
                let data = this.RAM.readByte((segment1 << 4) + offset1);
   
                this.register.writeByteReg(AX_REG,data); // ça pue, AX à la place de AL, mais ça marche
   
                if(!this.register.extractFlag('D'))
                    this.register.writeReg(SI_REG, offset1 + 1);

                else
                    this.register.writeReg(SI_REG, offset1 - 1);
               
            }  
   
            if (!given)
                this.register.incIP(1)
               
            return 0;
        }
        return -1;
    }

    decodeSTOS(instruction, given = false){
       
   
        if((instruction & 0b11111110) == STOS_INS)
        {
            let offset1 = this.register.readReg(DI_REG),
                segment1 = this.register.readReg(ES_REG);

            if(instruction % 2)
            {
                this.RAM.writeWord((segment1 << 4) + offset1,this.register.readReg(AX_REG));
   
                if(!this.register.extractFlag('D'))
                    this.register.writeReg(DI_REG, offset1 + 2);

                else
                    this.register.writeReg(DI_REG, offset1 - 2);
               
            }
   
            else
            {
                this.RAM.writeByte((segment1 << 4) + offset1, this.register.readByteReg(AX_REG));
   
                if(!this.register.extractFlag('D'))
                    this.register.writeReg(DI_REG, offset1 + 1);
                else
                    this.register.writeReg(DI_REG, offset1 - 1);
               
            }

            if(!given)
                this.register.incIP(1);
               
            return 0;
        }
        return -1;
    }

    decodeCMPS(instruction, given = false){

        if((instruction & 0b11111110) == CMPS_INS)
        {
            let offset1 = this.register.readReg(DI_REG),
                offset2 = this.register.readReg(SI_REG),
                segment1 = this.register.readReg(ES_REG),
                segment2 = this.register.readReg(DS_REG);
       
            let effictiveAdress1 = (segment1 << 4) + offset1,
                effictiveAdress2 = (segment2 << 4) + offset2;//destination

            if(instruction % 2 )
            {
                let valB = this.RAM.readWord(effictiveAdress1),
                    valA = this.RAM.readWord(effictiveAdress2);

                this.generateFlag(valA-valB, valA, valB, 1); //Verifier l'ordre !!!!
   
                if(!this.register.extractFlag('D'))
                {
                    this.register.writeReg(DI_REG, offset1 + 2);
                    this.register.writeReg(SI_REG, offset2 + 2);
                }
                else
                {
                    this.register.writeReg(DI_REG, offset1 - 2);
                    this.register.writeReg(SI_REG, offset2 - 2);
                }
               
            }
            else  
            {
                let valB = this.RAM.readByte(effictiveAdress1),
                    valA = this.RAM.readByte(effictiveAdress2);
                console.log(valA, valB, '896');
                this.generateFlag(valA-valB, valA, valB, 0); //Verifier l'ordre !!!!
   
                if(!this.register.extractFlag('D'))
                {
                    this.register.writeReg(DI_REG, offset1 + 1);
                    this.register.writeReg(SI_REG, offset2 + 1);
                }
                else
                {
                    this.register.writeReg(DI_REG, offset1 - 1);
                    this.register.writeReg(SI_REG, offset2 - 1);
                }
               
            }  
   
            if (!given)
                this.register.incIP(1)
               
            return 0;
        }
        return -1;
    }

    decodeSCAS(instruction, given = false){

        if((instruction & 0b11111110) == SCAS_INS)
        {
            let offset1 = this.register.readReg(DI_REG),
                segment1 = this.register.readReg(ES_REG);
       
            let effictiveAdress1 = (segment1 << 4) + offset1;//destination

            if(instruction % 2 )
            {
                let valB = this.RAM.readWord(effictiveAdress1),
                    valA = this.register.readReg(AX_REG);

                this.generateFlag(valA-valB, valA, valB, 1);
   
                if(!this.register.extractFlag('D'))
                    this.register.writeReg(DI_REG, offset1 + 2);
                else
                    this.register.writeReg(DI_REG, offset1 - 2);
               
            }
            else  
            {
                let valB = this.RAM.readByte(effictiveAdress1),
                    valA = this.register.readByteReg(AX_REG);

                this.generateFlag(valA-valB, valA, valB, 0); //Verifier l'ordre !!!!, normalement c'est bon
   
                if(!this.register.extractFlag('D'))
                    this.register.writeReg(DI_REG, offset1 + 1);

                else
                    this.register.writeReg(DI_REG, offset1 - 1);
               
            }  
   
            if (!given)
                this.register.incIP(1)
               
            return 0;
        }
        return -1;
    }

    decodeINC(instruction) {

        var currentIp = this.register.readReg(IP_REG),
            currentCodeSegment = this.register.readReg(CS_REG);

        var value = (currentCodeSegment << 4) + currentIp;

        if((instruction & 0b11111110) == INC_REG_MEM)
        {
            var operandes = this.extractOperand(this.RAM.readByte(value + 1));

            if( operandes.opRegister[0] == 0){
           
                if (operandes.addr != null)
                {
               
                    if (instruction % 2) {
                        this.RAM.writeWord(operandes.addr, this.RAM.readWord(operandes.addr)+1);
                        this.generateFlag(this.RAM.readWord(operandes.addr)+1, 0x0001, this.RAM.readWord(operandes.addr), 1);

                    }

                    else  {
                        this.RAM.writeByte(operandes.addr, this.RAM.readByte(operandes.addr)+1);
                        this.generateFlag(this.RAM.readByte(operandes.addr)+1, 0x0001, this.RAM.readByte(operandes.addr), 0);
                    }
                }

                else
                {
                    let reg = operandes.opRegister[1];

                    if (instruction % 2) {
                        this.register.writeWordReg(reg, this.register.readWordReg(reg)+1);
                        this.generateFlag(this.register.readWordReg(reg)+1, 0x0001, this.register.readWordReg(reg), 1);

                    }

                    else  {
                        this.register.writeByteReg(reg, this.register.readByteReg(reg)+1);
                        this.generateFlag(this.register.readByteReg(reg)+1, 0x0001, this.register.readByteReg(reg), 0);

                    }
               
                }
           
                this.register.incIP(2 + operandes.dispSize);


                return 0;
            }
        }
       
       
        return -1;  
    }

    decodeDEC(instruction) {
        var currentIp = this.register.readReg(IP_REG),
            currentCodeSegment = this.register.readReg(CS_REG);

        var value = (currentCodeSegment << 4) + currentIp;

        if((instruction & 0b11111110) == DEC_REG_MEM)
        {
            var operandes = this.extractOperand(this.RAM.readByte(value + 1));

            if( operandes.opRegister[0] == 1){
           
                if (operandes.addr != null)
                {
               
                    if (instruction % 2) {
                        this.RAM.writeWord(operandes.addr, this.RAM.readWord(operandes.addr)-1);
                        this.generateFlag(this.RAM.readWord(operandes.addr)-1, 0x0001, this.RAM.readWord(operandes.addr), 1);

                    }

                    else {
                        this.RAM.writeByte(operandes.addr, this.RAM.readByte(operandes.addr)-1);
                        this.generateFlag(this.RAM.readByte(operandes.addr)-1, 0x0001, this.RAM.readByte(operandes.addr), 0);

                    }

                }

                else
                {
                    let reg = operandes.opRegister[1];

                    if (instruction % 2) {
                        const valA = this.register.readWordReg(reg);

                        this.register.writeWordReg(reg, valA-1);
                        this.generateFlag(valA-1, 0x0001, valA, 1);

                    }

                    else  {
                        const valA = this.register.readByteReg(reg);

                        this.register.writeByteReg(reg, valA-1);
                        this.generateFlag(valA-1, 0x0001, valA, 0);

                    }
               
                }
           
                this.register.incIP(2 + operandes.dispSize);


                return 0;
            }
        }
       
       
        return -1;  
    }

    decodeCLC (instruction) {
   
        if((instruction & 0xFF) == 0b11111000){
     
            this.register.setFlag('C', 0);
           
            this.register.incIP(1);
   
            return 0;
         }
   
        return -1;
    }

    decodeCMC (instruction) {
   
        if((instruction & 0xFF) == 0b11110101){
     
            this.register.setFlag('C', !this.register.extractFlag('C'));
           
            this.register.incIP(1);
   
            return 0;
        }
   
        return -1;
    }

    decodeSTC (instruction) {

        if((instruction & 0xFF) == 0b11111001){
     
            this.register.setFlag('C', 1);
           
            this.register.incIP(1);
   
            return 0;
        }
   
        return -1;
    }
   
    decodeCLD (instruction) {
   
        if((instruction & 0xFF) == 0b11111100){
     
            this.register.setFlag('D', 0);
           
            this.register.incIP(1);
   
            return 0;
         }
   
        return -1;
    }
    decodeSTD (instruction) {
   
        if((instruction & 0xFF) == 0b11111101){
     
            this.register.setFlag('D', 1);
           
            this.register.incIP(1);
   
            return 0;
         }
   
        return -1;
    }

    decodeJmpCall(instruction){
        var current_ip = this.register.readReg(IP_REG),
            current_code_seg = this.register.readReg(CS_REG),
            current_data_segement = this.register.readReg(DS_REG);

        //======================================================================================
        // -------UNCONDITIONAL JUMP IN SEGMENT DIRECT----------------------------------------------
        //======================================================================================
        if ( (instruction & 0xFF) == JMP_SEG )
        {
            let disp = this.RAM.readWord((current_code_seg<<4) + current_ip + 1);

            this.register.incIP(3 + disp);

            return 0;
        }

        //======================================================================================
        // -------SHORT UNCONDITIONAL JUMP IN SEGMENT DIRECT----------------------------------------------
        //======================================================================================
        else if ( (instruction & 0xFF) == JMP_SEG_SHORT )
        {
            let disp = this.RAM.readByte((current_code_seg<<4) + current_ip + 1);

            disp = this._convertByteToWord(disp);

            this.register.incIP(2 + disp);

            return 0;
        }

        //======================================================================================
        // -------UNCONDITIONAL JUMP/CALL IN/INTER SEGEMENT INDIRECT----------------------------------------------
        //======================================================================================
        else if ( (instruction & 0xFF) == JMP_IND_SEG )
        {

            let operandes = this.extractOperand(this.RAM.readByte((current_code_seg<<4) + current_ip + 1));

            //INDIRECT JUMP In SEGMENT
            if ( operandes.opRegister[0] == 0b100 ) {

                if ( operandes.addr == null )
                {
                    let disp = this.register.readReg( operandes.opRegister[1] );
                    this.register.incIP( 2 + disp + operandes.dispSize );
                }
                else
                {
                    //WARNING ADDR ILA ZYISS L'OFFSET
                    let disp = this.RAM.readWord( operandes.addr );
                    this.register.incIP( 2 + disp + operandes.dispSize );
                }
                return 0;
            }

            //INDIRECT JUMP INTER SEGMENT
            else if ( operandes.opRegister[0] == 0b101 ) {
                console.log('salem khay');
                return 0;
            }

            //INDIRECT CALL IN SEGMENT
            else if ( operandes.opRegister[0] == 0b010 ) {

                if ( operandes.addr == null )
                {
                    let disp = this.register.readReg( operandes.opRegister[1] );
                    let old_IP = this.register.readReg( IP_REG );
                    this.register.incIP(2 + disp);

                    this.register.incSP();
                    this.RAM.writeWord( (this.register.readReg( SS_REG )<<4)
                                      + this.register.readReg( SP_REG ),
                                        old_IP + 2 );
                }
                else
                {
                    //WARNING ADDR ILA ZYISS L'OFFSET

                    let disp = this.RAM.readWord( operandes.addr );
                    let old_IP = this.register.readReg( IP_REG );
                    this.register.incIP(2 + disp + operandes.dispSize);

                    this.register.incSP();
                    this.RAM.writeWord( (this.register.readReg( SS_REG )<<4)
                                      + this.register.readReg( SP_REG ),
                                        old_IP + 2 + operandes.dispSize);
                }
                return 0;
            }

            //INDIRECT CALL INTER SEGMENT
            else if ( operandes.opRegister[0] == 0b011 ) {
                console.log('salem khay');
                return 0;
            }

           
        }
        //======================================================================================
        // -------UNCONDITIONAL JUMP INTERSEGEMENT DIRECT----------------------------------------------
        //======================================================================================
        else if ( (instruction & 0xFF) == JMP_DIR_INTSEG )
        {
            let dispOFF = this.RAM.readWord((current_code_seg<<4) + current_ip + 1),
                dispSEG = this.RAM.readWord((current_code_seg<<4) + current_ip + 3);

            this.register.incIP(IP_REG, 5 + dispOFF);
            this.register.writeReg(CS_REG, this.register.readReg(CS_REG) + dispSEG);

            return 0;
        }
        //======================================================================================
        // -------CALL IN SEGEMENT DIRECT----------------------------------------------
        //======================================================================================
        else if ( (instruction & 0xFF) == CALL_DIR_SEG )
        {
            let disp = this.RAM.readWord((current_code_seg<<4) + current_ip + 1);
            let old_IP = this.register.readReg( IP_REG );

            this.register.incSP();
            this.RAM.writeWord( (this.register.readReg( SS_REG )<<4)
                              + this.register.readReg( SP_REG ),
                                old_IP + 3 );
            this.register.incIP(3 + disp);
           

            return 0;
        }
        //======================================================================================
        // -------CALL INTERSEGEMENT DIRECT----------------------------------------------
        //======================================================================================
        else if ( (instruction & 0xFF) == CALL_DIR_INTSEG )
        {
            let dispOFF = this.RAM.readWord((current_code_seg<<4) + current_ip + 1),
                dispSEG = this.RAM.readWord((current_code_seg<<4) + current_ip + 3);
            let old_IP = this.register.readReg( IP_REG ),
                old_CS = this.register.readReg( CS_REG );

            this.register.incSP();
            this.RAM.writeWord( (this.register.readReg( SS_REG )<<4)
                              + this.register.readReg( SP_REG ),
                                old_CS );

            this.register.incSP();
            this.RAM.writeWord( (this.register.readReg( SS_REG )<<4)
                              + this.register.readReg( SP_REG ),
                                old_IP + 5 );
           
            this.register.writeReg(CS_REG, this.readReg(CS_REG) + dispSEG );
            this.register.incIP(5 + dispOFF);

            return 0;
        }
       

        return -1;
    }


 
    decodeRet(instruction)
    {
       
        if ( (instruction & 0xFF) == RET_SEG )
        {
            let new_IP = this.RAM.readWord( (this.register.readReg( SS_REG )<<4)
                                        + this.register.readReg( SP_REG ));
            this.register.decSP();

            this.register.writeReg(IP_REG, new_IP);
        }

        else if ( (instruction & 0xFF) == RET_INTERSEG )
        {
            let new_IP = this.RAM.readWord( (this.register.readReg( SS_REG )<<4)
                                        + this.register.readReg( SP_REG ));
            this.register.decSP();

            let new_CS = this.RAM.readWord( (this.register.readReg( SS_REG )<<4)
                                        + this.register.readReg( SP_REG ));
           
            this.register.decSP();

            this.register.writeReg(IP_REG, new_IP);
            this.register.writeReg(CS_REG, new_CS);
        }
    }

    decodeLoop(instruction)
    {            

         var current_ip = this.register.readReg(IP_REG),
            current_code_seg = this.register.readReg(CS_REG);
       

            if ( (instruction & 0xFF) == LOOP )
            {
               
                let cx_val = this.register.readReg(CX_REG);
                this.register.writeReg(CX_REG, cx_val - 1);
                cx_val--;
                if (cx_val != 0) {
                   

                    let disp = this.RAM.readByte((current_code_seg<<4) + current_ip+1);
                   
                    disp = this._convertByteToWord(disp);

                    this.register.incIP(2 + disp);
                }
                else
                    this.register.incIP(2);
               

                return 0;
            }

            else if ( (instruction & 0xFF) == LOOPE )
            {
               
                let cx_val = this.register.readReg(CX_REG);
                this.register.writeReg(CX_REG, cx_val - 1);
                cx_val--;
                if (cx_val != 0 || this.register.extractFlag('Z')==1)
                {

                    let disp = this.RAM.readByte((current_code_seg<<4) + current_ip+1);
               
                    this.register.incIP(2 + disp);
                }
                else
                    this.register.incIP(2);
               

                return 0;
            }

            else if ( (instruction & 0xFF) == LOOPNE )
            {
               
                let cx_val = this.register.readReg(CX_REG);
                this.register.writeReg(CX_REG, cx_val - 1);
                cx_val--;
                if (cx_val != 0 || this.register.extractFlag('Z')==0)
                {

                    let disp = this.RAM.readByte((current_code_seg<<4) + current_ip+1);
               
                    this.register.incIP(2 + disp);
                }
                else
                    this.register.incIP(2);
               

                return 0;
            }


            else
                return -1;
    }

    decodeConJump(instruction)
    {
            var current_ip = this.register.readReg(IP_REG),
                current_code_seg = this.register.readReg(CS_REG);
       

            if ( (instruction & 0xF0) == CON_JMP )
            {
                let executeJump = false;//If True, the jump instruction shall be executed

                switch(instruction&0x0F)
                {
                    case JE:
                        executeJump = this.register.extractFlag('Z')==1;
                        break;

                    case JL:
                        executeJump = this.register.extractFlag('S') != this.register.extractFlag('O');
                        break;

                    case JLE:
                        executeJump = (this.register.extractFlag('Z')==1) || (this.register.extractFlag('S') != this.register.extractFlag('O'));
                        break;

                    case JB:
                        executeJump = (this.register.extractFlag('C')==1);
                        break;

                    case JBE:
                        executeJump = (this.register.extractFlag('Z')==1 )|| (this.register.extractFlag('C')==1);
                        break;

                    case JP:
                        executeJump = this.register.extractFlag('P')==1;
                        break;

                    case JO:
                        executeJump = this.register.extractFlag('O')==1;
                        break;

                    case JS:
                        executeJump = this.register.extractFlag('S')==1;
                        break;

                    case JNE:
                        executeJump = this.register.extractFlag('Z') == 0;
                        break;

                    case JNL:
                        executeJump = this.register.extractFlag('S') == this.register.extractFlag('O');
                        break;

                    case JNLE:
                        executeJump = (this.register.extractFlag('Z') == 0) && (this.register.extractFlag('S') == this.register.extractFlag('O'));
                        break;

                    case JNB:
                        executeJump = this.register.extractFlag('C') == 0;
                        break;

                    case JNBE:
                        executeJump = (this.register.extractFlag('Z') == 0) && (this.register.extractFlag('C') == 0);
                        break;

                    case JNP:
                        executeJump = this.register.extractFlag('P') == 0;
                        break;
                    case JNO:
                        executeJump = this.register.extractFlag('O') == 0;
                        break;
                    case JNS:
                        executeJump = this.register.extractFlag('S') == 0;
                        break;

                }

                if (executeJump)
                {
                    let disp = this.RAM.readByte((current_code_seg<<4) + current_ip+1);
                    disp = this._convertByteToWord(disp);
                    this.register.incIP(2 + disp);
                }
                else
                    this.register.incIP(2);

                return 0;
            }
            else
                return -1;
           
    }

    decodeSegOverride(instruction){
        if ( (instruction & 0b11100111) == SEG_OVER_PREF ) {
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
                        addr = this.getAddrIndir(rm) + this._convertByteToWord(this.RAM.readByte((current_code_seg<<4) + current_ip+2));
                        dispSize = 1;
                        break;
               
                    case SIN_DISP:    // The displacement is contained in two bytes
                        addr = this.getAddrIndir(rm) + this.RAM.readWord((current_code_seg<<4) + current_ip+2);
                       
                        dispSize = 2;
                        break;
                   
                    case REG_MODE:
                        opRegister[1] = rm;

                }

                if (addr!= null)
                    addr &= 0x0000FFFF;

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

    getAddrIndir(rm){  
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
                   
    _executeArthLogic(instructionMode, op1, op2){
     
                switch(instructionMode)
                {
                    case ADD_MODE:
                        return (op1 + op2);
                    case ADC_MODE:
                        return (op1 + op2) + this.register.extractFlag('C');
                    case SUB_MODE:
                        return (op1 - op2);
                    case SBB_MODE:
                        return (op1 - op2) - this.register.extractFlag('C');

                    case AND_MODE:
                        return (op1 & op2);
                    case OR_MODE:
                        return (op1 | op2);
                    case XOR_MODE:
                        return (op1 ^ op2);
                    case CMP_MODE:
                        return (op1 - op2);
                }
    }
                   
    _convertByteToWord(val){
        return  (val >> 7) == 1 ?
                 (val | 0xFF00): val;
    }

    generateFlag(value, op1, op2, w=1, Flag=0b11111111111111){

        if ( (Flag & CARRY_FLAG) != 0 )
        {
            let mask = ( w == 1) ? 0xFFFF0000 : 0xFFFFFF00;

            if ( (value & mask) == 0)
                this.register.setFlag('C', 0);
            else
                this.register.setFlag('C', 1);

        }
       
        if ( (Flag & ZERO_FLAG) != 0 )
        {
            let mask = ( w == 1) ? 0x0000FFFF : 0x000000FF;

            if ( (value & mask) == 0 )
                this.register.setFlag('Z', 1);
            else
                this.register.setFlag('Z', 0);
        }
       
        if ( (Flag & PARITY_FLAG) != 0 )
        {
            this.register.setFlag('P', value % 2 ) ;
        }
       
        if ( (Flag & SIGN_FLAG) != 0 )
        {
            let mask = ( w == 1 ) ? 0x8000 : 0x80;

            if ( (value & mask) != 0 )
                this.register.setFlag('S', 1);
            else
                this.register.setFlag('S', 0);
        }
       
        if ( (Flag & AUXILARY_FLAG) != 0 )
        {
            this.register.setFlag('A', 0); // On le fera plus tard nchallah
        }
       
        if ( (Flag & OVERFLOW_FLAG) != 0 )
        {
            let newVal = ( w == 1 ) ? value >> 15 : value >> 7;//cetait 8
            newVal &= 0x0001;

            if      ( (w == 1) && (newVal != (op1 >> 15)) && (op1 >> 15) == (op2 >> 15) ) //?? et ici 16 ->
                this.register.setFlag('O', 1);

            else if ( (w == 0) && (newVal != (op1 >> 7)) && ((op1 >> 7) == (op2 >> 7)) )
                this.register.setFlag('O', 1);

            else
                this.register.setFlag('O', 0);

        }

    }

}



