function decodePop(){
 	var currentIp = this.register.readReg(IP_REG),
 		currentCodeSegment = this.register.readReg(CS_REG)
 		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

 		let  decodePop = popInstruction(instruction,currentCodeSegment << 4 + currentIp);
 }

 function popInstruction(instruction, value){

 	// get the current SS:SP position

 	let currentStackSegment = this.register.readReg(SS_REG),
 		currentStackPointer = this.register.readReg(SP_REG),
 		adressStack = 0, contentStack = 0 ,pop = true;
 		adressStack = (currentStackSegment << 4) + currentStackPointer;

 		// if the stack is already empty

 		if(adressStack == 0xFFFE) {  // FFFE
 			
 			console.log("the stack is empty ERROR !!!!");
 			let pop = false;
 		}
  		
		if(pop){

  		contentStack = this.RAM.readWord(adressStack);

	 	if(instruction && 0b11111111 == POP_REG_MEM) {  

			var operandes = this.extractOperand(this.RAM.readByte(current_code_seg<<4 + currentIp+1));
			// R / M

	 			 this.RAM.writeWord(operandes.addr, contentStack);
	 			 this.register.writeWord(SP_REG, currentStackPointer+2)
 				 this.register.incIP(2);
	 	}

	 	else if (instruction && 0b01011000 == POP_REG){
	 		// REGISTER

	 		let reg = (instruction << 5 ) % 8 ;

	 		this.register.writeWord(reg);

	 		this.register.writeWord(SP_REG, currentStackPointer+2)
 			this.register.incIP(1);
		}

	 	else if (instruction && 0b00000000110 == POP_SEG_REG){


	 		let reg = (instruction << 5 ) % 8 ;

	 		this.register.writeSegReg(reg, contentStack);


	 		this.register.writeWord(SP_REG, currentStackPointer+2)
 			this.register.incIP(1);
	 	}

	 	
 		return 0;

	}

	return -1;

 }



 function decodeXCHG() {

 		var currentIp = this.register.readReg(IP_REG),
 		currentCodeSegment = this.register.readReg(CS_REG)
 		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

 		let  decodeXchg = xchgInstruction(instruction,currentCodeSegment << 4 + currentIp);

 }



 function xchgInstruction(instruction, value){

 		if(instruction && 0b10010000 == XCHG_REG_ACC){
 			//R / ACC

 			let R1 = this.register.readWord(AX_REG),
 				R2 = this.register.readWord((instruction % 8)), tmp = R1;

 				R1 = R2;
 				R2 = tmp;

 				this.register.writeWord(AX_REG, R1);
 				this.register.writeWord(instrucion % 8, R2);

 				this.register.incIP(1);
 				return 0;
 		}
 			


 		else if( instruction && 0b10000110 == XCHG_REG_MEM){

 				var operandes = this.extractOperand(this.RAM.readWord(current_code_seg<<4 + currentIp+1));

 				if (operandes.addr == null){

 					let R1 = instruction.operandes[0];
 					let R2 = instruction.operandes[1];

 					if (instruction << 7){ // Word;

 					let data1 = this.register.readWord(R1),
 						data2 = this.register.readWord(R2), tmp = data1;

 						data1 = data2;

 						data2 = tmp;

 						this.register.writeWord(R1, data1);
 						this.register.writeWord(R2, data1);

				} //Byte
 				else{

 					let data1 = this.register.readByte(R1),
 						data2 = this.register.readByte(R2), data_tmp = data1;

 						data1 = data2;

 						data2 = tmp;

 						this.register.writeByte(R1, data1);
 						this.register.writeByte(R2, data1);

 				}
 			}

			else if (operandes.addr) {

				if (instruction << 7){

 					let data1 = this.register.readWord(R1),
 						data2 = this.RAM.readWord(operandes.addr), tmp = data
 						data1 = data2;

 						data2 = tmp;

 						this.register.writeWord(R1, data1);
 						this.RAM.writeWord(operandes.addr, data1);




 				} //Byte
 				else{

 					let data1 = this.register.readByte(R1),
 						data2 = this.register.readByte(operandes.addr), data_tmp = data1;

 						data1 = data2;

 						data2 = tmp;

 						this.register.writeByte(R1, data1);
 						this.RAM.writeByte(operandes.addr, data1);

 				}

			}

 				this.register.incIP(2);
 				return 0;

		}
 		return -1;

 }





function decodeINC() {

	var currentIp = this.register.readReg(IP_REG),
 		currentCodeSegment = this.register.readReg(CS_REG)
 		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

 		let  decodeInc = xchgInstruction(instruction,currentCodeSegment << 4 + currentIp);
}


function incInstruction (instruction,value){

	if (instruction && 0b101000000 == INC_REG) {
		// register

		this.register.writeWord((instruction % 8), this.register.readWord(parseInt((instruction % 8).ToString(),10))+1);
		this.register.incIP(1);
 		return 0;

	}

	else if(instruction && 011111110 == INC_REG_MEM){

		var operandes = this.extractOperand(this.RAM.readByte(value));


		var operandes = extractOperand(value + 1);

		if(operandes.opRegister[0] == 0){
		if (operandes.addr == null){
			if (instruction % 2) this.register.writeWord(operandes.opRegister[0], this.register.readWord(operandes.opRegister[0])+1);
			else  this.register.writeByte(operandes.opRegister[0], this.register.readByte(operandes.opRegister[0])+1);
		}

		else if (operandes.addr){
			if (instruction % 2) this.RAM.writeWord(operandes.addr, this.RAM.writeWord(operandes.addr)+1);
			else  this.RAM.writeByte(operandes.addr, this.RAM.writeByte(operandes.addr)+1);
		}

		this.register.incIP(2);
 		return 0;


		}
	}

	return -1;

}


function decodeDEC(){

	var currentIp = this.register.readReg(IP_REG),
 		currentCodeSegment = this.register.readReg(CS_REG)
 		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

 		let  decodeDec = decInstruction(instruction,currentCodeSegment << 4 + currentIp);
}




function decInstruction(instruction,value) {

	if (instruction & 0b01001000  == DEC_REG) {
			
		// register

		this.register.writeWordReg( instruction % 8 , this.register.readWordReg((instruction % 8)-1));
		this.register.incIP(readWordReg(incIP+1));
 		return 0;

		
	}

	else if(instruction & 0b111111110 == DEC_REG_MEM){

		var operandes = this.extractOperand(this.RAM.readByte(value));
		var operandes = extractOperand(value + 1);

		if(operandes.opRegister[0] == 1){
		if (operandes.addr == null){
			if (instruction % 2) 
				this.register.writeWordReg(operandes.opRegister[0], this.register.readWordReg(operandes.opRegister[0])-1);
			else  
				this.register.writeByteReg(operandes.opRegister[0], this.register.readByteReg(operandes.opRegister[0])-1);
		}

		else if (operandes.addr){
			if (instruction % 2) 
				this.RAM.writeWord(operandes.addr, this.RAM.readWord(operandes.addr) - 1);

			else  
				this.RAM.writeByte(operandes.addr, this.RAM.readByte(operandes.addr) - 1);
		}

		this.register.incIP(2);
 		return 0;
	}
}

	return -1;

}


function decodeLEA(){

	var currentIp = this.register.readReg(IP_REG),
 		currentCodeSegment = this.register.readReg(CS_REG)
 		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

 		let  decodeLEA = leaInstruction(instruction,currentCodeSegment << 4 + currentIp);
}



function leaInstruction(instruction,value) {

			if (instruction & 0b10001101 == LEA_INS){
				let operandes = extractOperand(value + 1);

				if (instuction.addr == null){
					this.register.writeWord(operandes.opRegisterS[0], this.register.readWord(instruction.operandes[1]));

				}
				else if(operandes.addr){
					this.register.writeWord(operandes.operandes[0], this.RAM.readWord(operandes.addr));
				}

				this.register.incIP(2);
 				return 0;

			}

		return -1 ;

}



decodePOPF =() =>{

	var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

		let deocdePOPF = popfInstuction(instruction, currentStackSegment << 4 + currentIp);
}



function popfInstuction (){


 	let currentStackSegment = this.register.readReg(SS_REG),
 		currentStackPointer = this.register.readReg(SP_REG),
 		adressStack = 0, contentStack = 0;
 		adressStack = (currentStackSegment << 4) + currentStackPointer;

 		if(adressStack == 0xFFFE) {  // FFFE
 			
 			console.log("Warning : the stack is empty  !!!!");
 			adressStack = 0;
 		}
  		

 

		if(instruction & 0b10011101 == POPF_INS){
				let content_stack =this.RAM.readWord(adressStack);
				this.register.writeWord(FLAG_REG, content_stack);


				this.register.writeWord(SP_REG, currentStackPointer+2)
 				this.register.incIP(1);
 				return 0;


		}

		return -1; 


		
}


function decodePUCH () {

		var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

		let deocdePUSH = pushInstuction(instruction, currentStackSegment << 4 + currentIp);
}



function pushInstuction (){


 	let currentStackSegment = this.register.readReg(SS_REG),
 		currentStackPointer = this.register.readReg(SP_REG),
 		adressStack = 0;

 		adressStack = (currentStackSegment << 4) + currentStackPointer;

 		
 
 		if (instruction & 0b10011100 == POPF_INS){

 			if(adressStack == 0) {  // 0000
 			
 			console.log(" Warning : the stack is FULL!!!!");
 			adressStack = 0xFFFE;//FFFE
 			}	

 			adressStack -= 2;

 			this.RAM.writeWord(adressStack, this.register.readWord(FLAG_REG));//

 			this.register.writeWord(SP_REG, currentStackPointer-2)
 			this.register.incIP(1);

 			return 0;
 		}

 		return -1;


}

// exctractFlag('C')


function decodeCLC () {

		var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

		let deocdeCLC = clcInstuction(instruction, currentStackSegment << 4 + currentIp);
}



function clcInstuction  () {

		if(instruction & 0b11111000 == CLS_INS){
 	
 			setFlag('C', 0);
			
			this.register.incIP(1);


 			return 0;
 		}

 		return -1;
	}



function decodeCMC () {

		var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

		let deocdeCMC = cmcInstuction(instruction, currentStackSegment << 4 + currentIp);
}



function cmcInstuction (){

		if(instruction & 0b111110101 == CMC_INS){
 	

			if(exctractFlag('C'))

 				setFlag('C', 1);

 			else if (!exctractFlag('C'))

 				setFlag('C', 0 );

			
			this.register.incIP(1);


 			return 0;
 		}

 		return -1;
}


function decodeSTC()  {

		var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

		let deocdeSTC = stcInstuction(instruction, currentStackSegment << 4 + currentIp);
}



function stcInstuction(){

		if(instruction & 0b11111001 == STC_INS){
 	

			setFlag('C', 1);

			this.register.incIP(1);

 			return 0;
 		}

 		return -1;
}


function decodeNEG() {

		var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

		let deocdeNEG = negInstuction(instruction, currentStackSegment << 4 + currentIp);
}



function negInstuction(instruction, value){


	if ((instruction & 0b11110110)){

		var operandes = extractOperand(value +1)
		if(operandes.opRegister[0] == 0b011) {

			if (operandes.addr == null){
				if (this.register.readWord(operandes.opRegister[0]) == 0) decodeCLC();
				else decodeCMC();

		 		this.register.writeWord(operandes.opRegister[0],  1 +  ~this.register.readWord(operandes.opRegister[0]));

			}

			if (operandes.addr) {

				if (this.RAM.readWord(operandes.addr ) == 0) decodeCLC();
				else decodeCMC();

		 		this.RAM.writeWord(operandes.addr, 1 + ~this.RAM.readWord(operandes.addr));
			}

		this.register.incIP(2);
		return 0;

		}

	}	

	else return -1;

}




function decodeCMP (){

	var currentIp = this.register.readReg(IP_REG),
	currentCodeSegment = this.register.readReg(CS_REG),
	instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

	let deocdeCMP = cmpInstuction(instruction, currentStackSegment << 4 + currentIp);

}



function cmpInstruction(instruction , value){

		if (instruction & 0b00111000 == CMP_REG_MEM_AND_REG){

			var operandes = extractOperand(value+1);

			let R1 = operandes.opRegister[0];
			let R2 = operandes.opRegister[1];

		
			if(operandes.adr = null){
				//register with register
				
				if ((instruction >1) % 2){
					//d == 1

						if (instruction % 2){
							// size of WORD

							let data1 = this.register.readWord(R1);
							let data2 = this.register.readWord(R2);
					
							if (data1 == data2) setFlag('Z',1);
							else if (data1 < data2){
								 setFlag('C',1);
						 		 setFlag('S',1);
							}

						}

						else if (!instruction % 2){
						//size of Byte

							let data1 = this.register.readByte(R1);
							let data2 = this.register.readByte(R2);
					
							if (data1 == data2) setFlag('Z',1);
							else if (data1 < data2){
						 		setFlag('C',1);
						 		setFlag('S',1);
							}
						}
					}

				else if(!(instruction > 1) % 2){
						//d == 0
			
						if ((instruction >1) % 2){
				

						if (instruction % 2){
							// size of WORD

							let data1 = this.register.readWord(R2);
							let data2 = this.register.readWord(R1);
					
							if (data1 == data2) setFlag('Z',1);
							else if (data1 < data2){
						 		setFlag('C',1);
						 		setFlag('S',1);
							}

						}

						else if (!instruction % 2){
							//size of Byte

							let data1 = this.register.readByte(R2);
							let data2 = this.register.readByte(R1);
					
							if (data1 == data2) setFlag('Z',1);
							else if (data1 < data2){
						 		setFlag('C',1);
						 		setFlag('S',1);
							}
						}
				}


			}
		}


			else if(operandes.addr){

				if ((instruction >1) % 2){
					//d == 1

					if (instruction % 2){
					// size of WORD

					let data1 = this.register.readWord(R1);
					let data2 = this.RAM.readWord(operandes.addr);
			
					if (data1 == data2) setFlag('Z',1);
					else if (data1 < data2){

						setFlag('C',1);
				 		setFlag('S',1);
					}

				}

				else if (!instruction % 2){
				//size of Byte

					let data1 = this.register.readByte(R1);
					let data2 = this.RAM.readByte(operandes.addr)
			
					if (data1 == data2) setFlag('Z',1);
					else if (data1 < data2){

						 setFlag('C',1);
						 setFlag('S',1);
					}
				}
			}

				else if(!(instruction > 1) % 2){
				//d == 0
					
					if (instruction % 2){
						// size of WORD

						let data1 = this.RAM.readWord(operandes.addr);
						let data2 = this.register.readWord(R1);
			
						if (data1 == data2) setFlag('Z',1);
						else if (data1 < data2){
						 setFlag('C',1);
					 	 setFlag('S',1);
						}

					}
					else if (!instruction % 2){
						//size of Byte

						let data1 = this.RAM.readByte(operandes.addr);
						let data2 = this.register.readByte(R1);
			
						if (data1 == data2) setFlag('Z',1);
						else if (data1 < data2){
				 		 	setFlag('C',1);
							 setFlag('S',1);
						}
					}
				}


			}
		this.register.incIP(2);


		}


		if(instruction & 0b10000000 == CMP_IME_REG_MEM){

			var operandes = extractOperand(value+1),
			immediat_value = value +2 + 1;


		if(operandes.addr == null){
			//register
			let R1 = operandes.opRegister[0];
			if(instruction % 2 == 1){
				 let data = this.RAM.writeByte(immediat_value);
			 	 let content_register = this.register.readByte(R1)
				this.register.incIP(4);
				
			}

			else if (instruction % 2 == 0){ 
				let data = this.RAM.writeWord(immediat_value + 1);
				let content_register = this.register.readWord(R1)
				this.register.incIP(1);
				
			}

			if( content_register== data) setFlag('Z',1);
			else  if (content_register < data) {
					setFlag('C',1);
					setFlag('S',1);
			}

		}

			else if(operandes.addr){

		
			if(instruction % 2 == 1){
				 let data = this.RAM.writeByte(immediat_value);
			 	 let memoryContent= this.RAM.readWord(operandes.addr);
			}
			else if (instruction % 2 == 0){
				 let data = this.RAM.writeWord(immediat_value );
			 	 let memoryContent= this.RAM.readWord(operandes.addr);
			}

			if(memoryContent == data) setFlag('Z',1);
			else  if (memoryContent < data) {
				setFlag('C',1);
				setFlag('S',1);
			}


		}
	}

	else if(instruction & 0b00111100 == CMP_IMM_ACC){
			if(instruction % 2 == 0){
				let data = this.RAM.writeByte(value + 1);
				let accumalteur = this.register.readByte(AX_REG);

				if(accumalteur == data) setFlag('Z',1);
				else if (accumalteur < data) {
					setFlag('C',1);
					setFlag('S',1);
				

				}
				this.register.incIP(3);
			}

			else if(instruction % 2 == 1){

				let data = this.RAM.writeWord(value + 1);
				let accumalteur = this.register.readWord(AX_REG);

				if(accumalteur == data) setFlag('Z',1);
				else if (accumalteur < data) {
					setFlag('C',1);
					setFlag('S',1);
				}
				this.register.incIP(2);
			}	
			
		}

}

function decodeMOVC(){
		var currentIp = this.register.readReg(IP_REG),
			currentCodeSegment = this.register.readReg(CS_REG),
			instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

			let deocdeMOVC = movcInstuction(instruction, currentStackSegment << 4 + currentIp);

}


function movcInstuction(instruction, value){
		if(instruction & 0b10100100 == MOVC_INS){
			if (instruction % 2){
			let offset1 = this.register.readWord(DI_REG),
				offset2 = this.register.readWord(SI_REG),
				segment1 = this.register.readWord(ES_REG),
				segment2 = this.register.reasWord(DS_REG);

			let effictiveAdress1 = segment1 << 4 + offset1,
				effictiveAdress2 = segment2 << 4 + offset2;


			this.RAM.writeWord(effictiveAdress1, this.RAM.readWord(effictiveAdress2));

			if(exctractFlag('D')){
				this.register.writeWord(DI_REG, offset1 + 1);
				this.register.writeWord(SI_REG, offset2 + 1);
			}else{
				this.register.writeWord(DI_REG, offset1 - 1);
				this.register.writeWord(SI_REG, offset2 - 1);
			}

		}


		


		if (!instruction % 2){
			let offset1 = this.register.readWord(DI_REG),
				offset2 = this.register.readWord(SI_REG),
				segment1 = this.register.readWord(ES_REG),
				segment2 = this.register.reasWord(DS_REG);

			let effictiveAdress1 = segment1 << 4 + offset1,
				effictiveAdress2 = segment2 << 4 + offset2;


			this.RAM.writeByte(effictiveAdress2, this.RAM.readByte(effictiveAdress1));

				if(exctractFlag('D')){
					this.register.writeWord(DI_REG, offset1 + 2);
					this.register.writeWord(SI_REG, offset2 + 2);
				}else{
					this.register.writeWord(DI_REG, offset1 - 2);
					this.register.writeWord(SI_REG, offset2 - 2);
				}

		}
		this.register.incIP(1);
		return 0;


	}
	return -1;
	
}



function decodeCMPS(){
	var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

		let deocdeCMPS = cmpsInstuction(instruction, currentStackSegment << 4 + currentIp);

}

function cmpsInstuction(instruction, value){
	if(instruction & 0b10100110 == CMPS_INS){
		if(instruction % 2){
			let offset1 = this.register.readWord(DI_REG),
				offset2 = this.register.readWord(SI_REG),
				segment1 = this.register.readWord(ES_REG),
				segment2 = this.register.reasWord(DS_REG);

			let effictiveAdress1 = segment1 << 4 + offset1,
				effictiveAdress2 = segment2 << 4 + offset2;

				let diff = this.RAM.readWord(effictiveAdress2) - this.RAM.readWord(effictiveAdress1);
			
			if(exctractFlag('D')){
				this.register.writeWord(DI_REG, offset1 + 1);
				this.register.writeWord(SI_REG, offset2 + 1);
			}else{
				this.register.writeWord(DI_REG, offset1 - 1);
				this.register.writeWord(SI_REG, offset2 - 1);
			}


		}
		if (!instruction % 2){
			let offset1 = this.register.readWord(DI_REG),
				offset2 = this.register.readWord(SI_REG),
				segment1 = this.register.readWord(ES_REG),
				segment2 = this.register.reasWord(DS_REG);

			let effictiveAdress1 = segment1 << 4 + offset1,
				effictiveAdress2 = segment2 << 4 + offset2;


				let diff = this.RAM.readByte(effictiveAdress2) - this.RAM.readByte(effictiveAdress1);

				if(exctractFlag('D')){
					this.register.writeWord(DI_REG, offset1 + 2);
					this.register.writeWord(SI_REG, offset2 + 2);
				}else{
					this.register.writeWord(DI_REG, offset1 - 2);
					this.register.writeWord(SI_REG, offset2 - 2);
				}
				

		}
		 this.register.incIP(1)
		 return diff > 0 ? 1 : 0;
	
	}

	return -1;
}



function decodeSCAS(){
	var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

		let deocdeSCAS = scasInstuction(instruction, currentStackSegment << 4 + currentIp);

}

function scasInstuction(instruction, value){
	if(instruction & 0b10101110 == SCAS_INS){
		if(!instruction % 2 ){
			let offset1 = this.register.readWord(DI_REG),
			segment1 = this.register.readWord(ES_REG);

			let data = this.RAM.readByte(segment1 << 4 + offset1);

			data -= this.register.readByte(AX_REG);

			if(exctractFlag('D')){
				this.register.writeWord(DI_REG, offset1 + 1);
			}else{
				this.register.writeWord(DI_REG, offset1 - 1);
			}

		if(instruction % 2){

				let offset1 = this.register.readWord(DI_REG),
				segment1 = this.register.readWord(ES_REG);
	
				let data = this.RAM.readWord(segment1 << 4 + offset1);
	
				data -= this.register.readWord(AX_REG);
	
				if(exctractFlag('D')){
					this.register.writeWord(DI_REG, offset1 + 2);
				}else{
					this.register.writeWord(DI_REG, offset1 - 2);
				}

			}
		}
				 this.register.incIP(1)
				return data > 0 ? 1 : 0;
			
	}
	return -1;
}


function decodeLODS(){
	var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

		let deocdeLODS = lodsInstuction(instruction, currentStackSegment << 4 + currentIp);

}



function lodsInstuction(instruction, value){
	if(instruction & 0b10101100 == LODS_INS){
		if(instruction % 2 ){
		let offset1 = this.register.readWord(SI_REG),
			segment1 = this.register.readWord(DS_REG);

			let data = this.RAM.readWord(segment1 << 4 + offset1);

			this.register.writeWord(AX_REG,data);

			if(exctractFlag('D')){
				this.register.writeWord(SI_REG, offset1 + 2);
			}else{
				this.register.writeWord(SI_REG, offset1 - 2);
			}
		

		}
		else if(!instruction % 2) {
			let offset1 = this.register.readWord(SI_REG),
			segment1 = this.register.readWord(DS_REG);

			let data = this.RAM.readByte(segment1 << 4 + offset1);

			this.register.writeByte(AX_REG,data);

			if(exctractFlag('D')){
				this.register.writeWord(SI_REG, offset1 + 1);
			}else{
				this.register.writeWord(SI_REG, offset1 - 1);
			}
		

		}	
	}
				this.register.incIP(1)
				return diff > 0 ? 1 : 0;
				return 0;
}




function decodeSTOS(){
	var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

		let deocdeSTOS = stosInstuction(instruction, currentStackSegment << 4 + currentIp);

}


function stosInstuction(instruction, value){
	if(instruction & 0b10101010 == STOS_INS){
		if(instruciton % 2){
			let offset1 = this.register.readWord(SI_REG),
			segment1 = this.register.readWord(ES_REG);

			let data = this.RAM.readWord(segment1 << 4 + offset1);

			this.RAM.writeWord(data, this.register.readWord(AX_REG));

			if(exctractFlag('D')){
				this.register.writeWord(SI_REG, offset1 + 2);
			}else{
				this.register.writeWord(SI_REG, offset1 - 2);
			}
		}

		else if(!instruciton % 2){

			let offset1 = this.register.readWord(SI_REG),
			segment1 = this.register.readWord(ES_REG);

			let data = this.RAM.readByte(segment1 << 4 + offset1);

			this.RAM.writeByte(data, this.register.readByte(AX_REG));

			if(exctractFlag('D')){
				this.register.writeWord(SI_REG, offset1 + 1);
			}else{
				this.register.writeWord(SI_REG, offset1 - 1);
			}

		}
		this.reg.incIP(1);
		return 0;
	}
	return -1;
}


function decodeREP(){

	var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

		let deocdeREP = repInstuction(instruction, currentStackSegment << 4 + currentIp);


}


function repInstruction(instruction,value){
	if (instruction & 0b11110010 == REP_INS){
		let counter = this.register.readReg(CX_REG)
		if (instruction % 2  == 0) return 0;
		else{
			decode(this.RAM.readWord(value + 1))
			counter --;
			this.register.writeReg(CX_REG,counter--);
			if(counter == 0 ) instruction --;
			else repInstruction (instruction,value);


		}
		this.register.incIP(1);
		return 0;
	}
	return -1;
}

function decode(instruction){
	switch(instruction){
		case 0b10100100:
			decodeMOVC();
			break;
		case 0b10100110:
			decodeCMPS();
			break;
		case 0b10101110:
			decodeSCAS();
			break;
		case 0b10101100:
			decodeLODS();
			break;
		case 0b10101010:
			decodeSTOS();
			break;
	}

	return 0;
}










//POP
//XCHG
//DEC
//INC
//POPF
//PUSHF
//CMP
//scaw
//lea
//

