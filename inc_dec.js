
function decodeINC() {

	var currentIp = register.readReg(IP_REG),
		 currentCodeSegment = register.readReg(CS_REG)
		 instruction = memory.readByte((currentCodeSegment << 4 )+ currentIp);
		 if ((instruction & 0b01000) == INC_REG) {
			// register
			console.log((instruction & 0b01000000) == INC_REG)
			let dataRgister = register.readReg(WORD_REGISTERS_TABLE[(instruction % 8)]);
		
			register.writeReg(WORD_REGISTERS_TABLE[(instruction % 8)], dataRgister +1);
			register.incIP(1);
			 return 0;
		
		}	
		/* else */if((instruction & 0b11111110) == INC_REG_MEM){
			if( operandes.opRegister[0] == 0){
			
			var operandes = processeur.extractOperand(memory.readByte(value + 1));
			//console.log(memory.readByte(value + 1))
			//if(operandes.opRegister[0] == 0){
			
			 if (operandes.addr){
			
				if (instruction % 2) memory.writeWord(operandes.addr, memory.readWord(operandes.addr)+1);
				else  memory.writeByte(operandes.addr, memory.readByte(operandes.addr)+1);
			}
		
			register.incIP(2 + operandes.dispSize);
			 return 0;
		
		
			}
		}
		
		
		return -1;
		
		}
		 
	
	
	
	

//****************************** */
// inc IT WORKS                 /*
//                               /*
//****************************** */



// dec ca marche


function decodeDEC(){

	var currentIp = register.readReg(IP_REG),
		 currentCodeSegment = register.readReg(CS_REG)
		 instruction = memory.readByte((currentCodeSegment << 4) + currentIp);

		 if ((instruction & 0b11111000)  == DEC_REG) {
			
			// register
	
		
			register.writeReg( WORD_REGISTERS_TABLE[instruction % 8] , register.readReg(WORD_REGISTERS_TABLE[(instruction % 8)])-1);
			register.incIP(1);
			 return 0;
		
			
		}
		
		// else
		
		 else if((instruction & 0b11111110) == DEC_REG_MEM){
		
			var operandes = processeur.extractOperand(memory.readByte(value +1));
			
			if(operandes.opRegister[0] == 1){
				
			 if (operandes.addr){
				
				if (instruction % 2) 
					memory.writeWord(operandes.addr, memory.readWord(operandes.addr) - 1);
		
				else  
					memory.writeByte(operandes.addr, memory.readByte(operandes.addr) - 1);
			}
		
			register.incIP(operandes.dispSize + 2);
			 return 0;
		}
		 }
		
		
		return -1;
		
		
		
		 
	}
	
