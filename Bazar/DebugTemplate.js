		const MEMORY_SIZE = 1048576;

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

		        
		        let gut = this.decodeINC(instruction);

		        console.log(gut);
		        console.log(this.register.R);
		        console.log(this.RAM);

		    }
      
      extractOperand(addrModeByte, segmentEnabled=true){
      		        /*
		            |m|m|r|r|r|/|/|/|
		            m: mode byte
		            r: register byte
		            /: r/m byte
		        */console.log(addrModeByte, 'lll');

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
