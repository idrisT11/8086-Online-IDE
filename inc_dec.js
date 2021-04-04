
		    decodeINC(instruction) {
				var currentIp = this.register.readReg(IP_REG),
					currentCodeSegment = this.register.readReg(CS_REG);

					if ((instruction & 0b11111000) == INC_REG) 
					{
						// register
						let dataRgister = this.register.readWordReg(instruction % 8);
					
						this.register.writeWordReg(instruction % 8, dataRgister +1);
						this.register.incIP(1);
					
					}	

					else if((instruction & 0b11111110) == INC_REG_MEM){
						var operandes = this.extractOperand(this.RAM.readByte((currentCodeSegment<<4) + currentIp + 1)),
							addr = operandes.addr;

						
						if( operandes.opRegister[0] == 0){
							
							if (addr){
							
								if (instruction % 2) 
									this.RAM.writeWord(addr, this.RAM.readWord(addr)+1);

								else  
									this.RAM.writeByte(addr, this.RAM.readByte(addr)+1);
							}
							else
							{
								let R = operandes.opRegister[1];
								if (instruction % 2) 
									this.register.writeWordReg(R, this.register.readWordReg(R)+1);

								else  
									this.register.writeByteReg(R, this.register.readByteReg(R)+1);
							}
						
							this.register.incIP(2 + operandes.dispSize);
					
						}
						else
							return -1;
					}
					else
						return -1
					
					
					return 0;	
			}

			decodeDEC(instruction) {
				var currentIp = this.register.readReg(IP_REG),
					currentCodeSegment = this.register.readReg(CS_REG);

					if ((instruction & 0b11111000) == DEC_REG) 
					{
						// register
						let dataRgister = this.register.readWordReg(instruction % 8);
					
						this.register.writeWordReg(instruction % 8, dataRgister +1);
						this.register.incIP(1);
					
					}	

					else if((instruction & 0b11111110) == DEC_REG_MEM){
						var operandes = this.extractOperand(this.RAM.readByte((currentCodeSegment<<4) + currentIp + 1)),
							addr = operandes.addr;

						
						if( operandes.opRegister[0] == 0){
							
							if (addr){
							
								if (instruction % 2) 
									this.RAM.writeWord(addr, this.RAM.readWord(addr)-1);

								else  
									this.RAM.writeByte(addr, this.RAM.readByte(addr)-1);
							}
							else
							{
								let R = operandes.opRegister[1];
								if (instruction % 2) 
									this.register.writeWordReg(R, this.register.readWordReg(R)-1);

								else  
									this.register.writeByteReg(R, this.register.readByteReg(R)-1);
							}
						
							this.register.incIP(2 + operandes.dispSize);
					
						}
						else
							return -1;
					}
					else
						return -1
					
					
					return 0;	
			}



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
	
