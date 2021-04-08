
/********************************************** */
//                    clear                     //
//             carry done                       //
//********************************************* */


function decodeCLC () {

	var currentIp = this.register.readReg(IP_REG),
	currentCodeSegment = this.register.readReg(CS_REG),
	instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);


	if(instruction & 0b11111111 == CLS_INS){
 
		this.register.setFlag('C', 0);
		
		this.register.incIP(1);

		return 0;
	 }

	return -1;
}



/********************************************** */
//              STD IT'S DONE
//
//********************************************* */





function decodeSTD () {

	var currentIp = this.register.readReg(IP_REG),
	currentCodeSegment = this.register.readReg(CS_REG),
	instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);


	if(instruction & 0b11111111 == STD_INS){
 
		this.register.setFlag('D', 1);
		
		this.register.incIP(1);

		return 0;
	 }

	return -1;
}



/********************************************** */
//              CLD IT'S DONE
//
//********************************************* */



function decodeCLD () {

	var currentIp = this.register.readReg(IP_REG),
	currentCodeSegment = this.register.readReg(CS_REG),
	instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);


	if(instruction & 0b11111111 == CLD_INS){
 
		this.register.setFlag('D', 0);
		
		this.register.incIP(1);

		return 0;
	 }

	return -1;
}




/********************************************** */
//              CMC IT'S DONE
//
//********************************************* */



function decodeCMC () {

	var currentIp = this.register.readReg(IP_REG),
	currentCodeSegment = this.register.readReg(CS_REG),
	instruction = this.RAM.reaByte(currentCodeSegment << 4 + currentIp);

	if((instruction & 0b111111111) == CMC_INS){
 

		if(this.register.exctractFlag('C'))

			 this.register.setFlag('C', 1);

		 else if (!(this.register.exctractFlag('C')))

			 this.register.setFlag('C', 0 );

		
		this.register.incIP(1);


		 return 0;
	 }

	 return -1;

}



//************************************************** */
//                STC                        //
//                it's done                          //
//************************************************** */


//IT'S DONE





function decodeSTC()  {

var currentIp = this.register.readReg(IP_REG),
currentCodeSegment = this.register.readReg(CS_REG),
instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);

if(instruction & 0b11111111 == STC_INS){


	this.register.setFlag('C', 1);

	this.register.incIP(1);

	 return 0;
 }

 return -1;
}




/*************************************************** */
//     MOVS                                    //
//    IT'S DONE                                //
/**************************************************  */





decodeMOVS(given = false){
	var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte((currentCodeSegment << 4) + currentIp),
		value = (currentCodeSegment << 4) + currentIp ;

		if(given == true)
		value += 1
	
		instruction = this.RAM.readByte(value);


		if((instruction & 0b11111110) == MOVS_INS){
	
		
			if (instruction % 2){
				
			let offset1 = this.register.readReg(DI_REG),
				offset2 = this.register.readReg(SI_REG),
				segment1 = this.register.readReg(ES_REG),
				segment2 = this.register.readReg(DS_REG);
	
			let effictiveAdress1 = (segment1 << 4) + offset1,
				effictiveAdress2 = (segment2 << 4) + offset2;
	
	
			this.RAM.writeWord(effictiveAdress2, this.RAM.readWord(effictiveAdress1));
	
			if(this.register.extractFlag('D')){
				this.register.writeReg(DI_REG, offset1 + 2);
				this.register.writeReg(SI_REG, offset2 + 2);
			}else{
				this.register.writeReg(DI_REG, offset1 - 2);
				this.register.writeReg(SI_REG, offset2 - 2);
			}
	
		}

		if (!(instruction % 2)){
				
			let offset1 = this.register.readReg(DI_REG),
				offset2 = this.register.readReg(SI_REG),
				segment1 = this.register.readReg(ES_REG),
				segment2 = this.register.readReg(DS_REG);
	
			let effictiveAdress1 = (segment1 << 4) + offset1,
				effictiveAdress2 = (segment2 << 4) + offset2;
	
	
			this.RAM.writeByte(effictiveAdress2, this.RAM.readByte(effictiveAdress1));
	
			if(this.register.extractFlag('D')){
				this.register.writeReg(DI_REG, offset1 + 1);
				this.register.writeReg(SI_REG, offset2 + 1);
			}else{
				this.register.writeReg(DI_REG, offset1 - 1);
				this.register.writeReg(SI_REG, offset2 - 1);
			}
	
		}




		}
	}
	
	
		
	
	
		
	
		}
		this.register.incIP(1);
		return 0;
	
	
	}
	return -1;
	
}




function decodeCMPS(given = false){
	var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte((currentCodeSegment << 4) + currentIp),
		value = (currentCodeSegment << 4) + currentIp ;

		if(given == true)
		value += 1
	
		instruction = this.RAM.readByte(value);


		if((instruction & 0b11111110) == CMPS_INS){
	
		
			if (instruction % 2){
				
			let offset1 = this.register.readReg(DI_REG),
				offset2 = this.register.readReg(SI_REG),
				segment1 = this.register.readReg(ES_REG),
				segment2 = this.register.readReg(DS_REG);
	
			let effictiveAdress1 = (segment1 << 4) + offset1,
				effictiveAdress2 = (segment2 << 4) + offset2;
	
	
			let data = this.RAM.readWord(effictiveAdress2)-  this.RAM.readWord(effictiveAdress1);
	
			if(this.register.extractFlag('D')){
				this.register.writeReg(DI_REG, offset1 + 2);
				this.register.writeReg(SI_REG, offset2 + 2);
			}else{
				this.register.writeReg(DI_REG, offset1 - 2);
				this.register.writeReg(SI_REG, offset2 - 2);
			}
	
		}

		else if (!(instruction % 2)){
				
			let offset1 = this.register.readReg(DI_REG),
				offset2 = this.register.readReg(SI_REG),
				segment1 = this.register.readReg(ES_REG),
				segment2 = this.register.readReg(DS_REG);
	
			let effictiveAdress1 = (segment1 << 4) + offset1,
				effictiveAdress2 = (segment2 << 4) + offset2;
	
	
			let data = this.RAM.readByte(effictiveAdress2) -  this.RAM.readByte(effictiveAdress1);
	
			if(this.register.extractFlag('D')){
				this.register.writeReg(DI_REG, offset1 + 1);
				this.register.writeReg(SI_REG, offset2 + 1);
			}else{
				this.register.writeReg(DI_REG, offset1 - 1);
				this.register.writeReg(SI_REG, offset2 - 1);
			}
	
		}




		}
	
	
		this.register.incIP(1);
		return 0;
	
	
	}
	return -1;
	
}





/********************************************** */
//               LODS                          //
//               it's done                     //
/********************************************* */


// lods

function decodeLODS(given = false){
	var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp),
		value = (currentCodeSegment << 4) + currentIp;

		if(given == true)
		value += 1

		instruction = this.RAM.readByte(value);

	if((instruction & 0b11111110) == LODS_INS){
	
		if(instruction % 2 ){
		
		let offset1 = this.register.readReg(SI_REG),
			segment1 = this.register.readReg(DS_REG);

			var data = this.RAM.readWord(segment1 << 4 + offset1);

			this.register.writeReg(AX_REG,data);

			if(this.register.extractFlag('D')){
				this.register.writeReg(SI_REG, offset1 + 2);
			}else{
				this.register.writeReg(SI_REG, offset1 - 2);
			}
		

		}
		else if(!(instruction % 2)) {
			let offset1 = this.register.readReg(SI_REG),
			segment1 = this.register.readReg(DS_REG);

			

			let data = this.RAM.readByte((segment1 << 4) + offset1);


			this.register.writeByteReg(AX_REG,data);

			if(this.register.extractFlag('D')){
				this.register.writeReg(SI_REG, offset1 + 1);
			}else{
				this.register.writeReg(SI_REG, offset1 - 1);
			}
		

		}	


		this.register.incIP(1)
			
			return 0;
	}
	return -1;
}



/*********************************** */
/*   SCAS  is working                */
//                                     
/*********************************** */




function decodeSCAS(given = false){
	var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp),
		value = (currentCodeSegment << 4) + currentIp;


	
		if(given == true)
		value += 1

		instruction = this.RAM.readByte(value);

	
	if((instruction & 0b11111110) == SCAS_INS){
		
		if(!(instruction % 2) ){

			console.log("hitler")
			let offset1 =this.register.readReg(DI_REG),
			segment1 = this.register.readReg(ES_REG);

			var data = this.RAM.readByte((segment1 << 4) + offset1);
			data -= this.register.readByteReg(AX_REG);

			console.log(data)

			if(this.register.extractFlag('D')){
				this.register.writeReg(DI_REG, offset1 + 1);
			}else{
				this.register.writeReg(DI_REG, offset1 - 1);
			}
			console.log(instruction)
		}
		if(instruction % 2){
			console.log("hellow")

				let offset1 = this.register.readReg(DI_REG),
				segment1 = this.register.readReg(ES_REG);
	
				var data = this.RAM.readWord(segment1 << 4 + offset1);
	
				data -= this.register.readReg(AX_REG);
				console.log(data)
	
				if(this.register.extractFlag('D')){
					
					this.register.writeReg(DI_REG, offset1 + 2);
				}else{
					console.log(this.register.extractFlag('D'))
					this.register.writeReg(DI_REG, offset1 - 2);
				}

			}
		
				 this.register.incIP(1)
				 
				return data > 0 ? 1 : 0;
			
	}
	return -1;
}



//****************************** */
// STOS IT WORKS                 /*
//                               /*
//****************************** */






decodeSTOS(given){
	var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte((currentCodeSegment << 4) + currentIp),
		value = (currentCodeSegment << 4) + currentIp;

		if(given == true)
		value += 1

		instruction = this.RAM.readByte(value);

	if((instruction & 0b11111110) == STOS_INS){
		
		if(instruction % 2){
			let offset1 = this.register.readReg(DI_REG),
			segment1 = this.register.readReg(ES_REG);

			

			this.RAM.writeWord((segment1 << 4) + offset1,this.register.readReg(AX_REG));

			if(this.register.extractFlag('D')){
				this.register.writeReg(DI_REG, offset1 + 2);
			}else{
				this.register.writeReg(DI_REG, offset1 - 2);
			}
		}

		else if(!(instruction % 2)){

			let offset1 = this.register.readReg(DI_REG),
			segment1 = this.register.readReg(ES_REG);

			
		
			this.RAM.writeByte((segment1 << 4) + offset1, this.register.readByteReg(AX_REG));
			console.log(this.RAM.readByte((segment1 <<4) + offset1))

			if(this.register.extractFlag('D')){
				this.register.writeReg(DI_REG, offset1 + 1);
			}else{
				this.register.writeReg(DI_REG, offset1 - 1);
			}

		}
			this.register.incIP(1);
		return 0;
	}
	return -1;
}


/* label




\t loop label

\t instruction , paramater  : color

auto tabulation 


|
|
|

*/

//****************************** */
// INC IT WORKS                 /*
//                               /*
//****************************** */


function decodeINC() {

	var currentIp = this.register.readReg(IP_REG),
		 currentCodeSegment = this.register.readReg(CS_REG)
		 instruction = this.RAM.readByte((currentCodeSegment << 4 )+ currentIp);
		 if ((instruction & 0b11111000) == INC_REG) {
			// this.register
			console.log((instruction & 0b01000000) == INC_REG)
			let dataRgister = this.register.readReg(WORD_REGISTERS_TABLE[(instruction % 8)]);
		
			this.register.writeReg(WORD_REGISTERS_TABLE[(instruction % 8)], dataRgister +1);
			this.register.incIP(1);
			 return 0;
		
		}	
		/* else */if((instruction & 0b11111110) == INC_REG_MEM){
			if( operandes.opRegister[0] == 0){
			
			var operandes = processeur.extractOperand(this.RAM.readByte(value + 1));
			//console.log(this.RAM.readByte(value + 1))
			//if(operandes.opRegister[0] == 0){
			
			 if (operandes.addr){
			
				if (instruction % 2) this.RAM.writeWord(operandes.addr, this.RAM.readWord(operandes.addr)+1);
				else  this.RAM.writeByte(operandes.addr, this.RAM.readByte(operandes.addr)+1);
			}
		
			this.register.incIP(2 + operandes.dispSize);
			 return 0;
		
		
			}
		}
		
		
		return -1;
		
		}
		 
	
	
	
	

//****************************** */
// DEC IT WORKS                 /*
//                               /*
//****************************** */



// dec ca marche


function decodeDEC(){

	var currentIp = this.register.readReg(IP_REG),
		 currentCodeSegment = this.register.readReg(CS_REG)
		 instruction = this.RAM.readByte((currentCodeSegment << 4) + currentIp);

		 if ((instruction & 0b11111000)  == DEC_REG) {
			
			// this.register
	
		
			this.register.writeReg( WORD_REGISTERS_TABLE[instruction % 8] , this.register.readReg(WORD_REGISTERS_TABLE[(instruction % 8)])-1);
			this.register.incIP(1);
			 return 0;
		
			
		}
		
		// else
		
		 else if((instruction & 0b11111110) == DEC_REG_MEM){
		
			var operandes = processeur.extractOperand(this.RAM.readByte(value +1));
			
			if(operandes.opRegister[0] == 1){
				
			 if (operandes.addr){
				
				if (instruction % 2) 
					this.RAM.writeWord(operandes.addr, this.RAM.readWord(operandes.addr) - 1);
		
				else  
					this.RAM.writeByte(operandes.addr, this.RAM.readByte(operandes.addr) - 1);
			}
		
			this.register.incIP(operandes.dispSize + 2);
			 return 0;
		}
		 }
		
		
		return -1;
		
		
		
		 
	}
	
	
	
	
	
	
	

//****************************** */
// LEA IT WORKS                 /*
//                               /*
//****************************** */



function decodeLEA(){

	var currentIp = this.register.readReg(IP_REG),
		 currentCodeSegment = this.register.readReg(CS_REG)
		 instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);
		 value = (currentCodeSegment << 4)+ currentIp;
	
		 if ((instruction & 0b11111111) == LEA_INS){
			
			let operandes = processeur.extractOperand(this.RAM.readByte(value + 1))
			
			if((instruction >> 6) != 0){
			if ((operandes.addr == null)){
				
				this.register.writeReg(this.register.readWordReg(operandes.opRegister[0]), this.register.readWordReg(operandes.opRegister[1]));
	
			}
			else if(operandes.addr){
				console.log("hello")
				this.register.writeReg(WORD_REGISTERS_TABLE[operandes.opRegister[0]], this.RAM.readWord(operandes.addr));
			}
		}
			this.register.incIP(2 + operandes.dispSize);
			 return 0;
	
		}
	
	return -1 ;
	
	}
		 
 



//****************************** */
// POP  IT WORKS                 /*
//                               /*
//****************************** */



function decodePop(){
	var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG);
		instruction = this.RAM.readByte((currentCodeSegment << 4) + currentIp),
		value = (currentCodeSegment << 4) + currentIp;

	let currentStackSegment = this.register.readReg(SS_REG),
		currentStackPointer = this.register.readReg(SP_REG),
		adressStack = 0, contentStack = 0 ,pop = true;
		adressStack = (currentStackSegment << 4) + currentStackPointer;
	console.log(adressStack)
	
	  
		// if the stack is already empty

		if(adressStack == 0xFFFFE) {  // FFFFE
			
			console.log("the stack is empty ERROR !!!!");
			let pop = false;
		}
	 
	   if(pop){

		 contentStack = this.RAM.readWord(adressStack);

		 console.log(adressStack)

		if(instruction & 0b11111111 == POP_REG_MEM) {  

		   var operandes = processeur.extractOperand(this.RAM.readWord(value + 1));
		   // R / M
	
		   console.log(operandes.opRegister[0])
			if(operandes.opRegister[0] == 0){
				
			   if(operandes.addr){
				   
				 this.RAM.writeWord(operandes.addr, contentStack);
		
				 this.register.writeReg(SP_REG, currentStackPointer+2)
				 this.register.incIP(2 + operandes.dispSize);
		}
	}
	}
		else if ((instruction & 0b11111000) == POP_REG){
			// REGISTER

			let reg = instruction  % 8 ;
		
			
			this.register.writeReg(WORD_REGISTERS_TABLE[reg], contentStack)
			this.register.writeReg(SP_REG, currentStackPointer+2)
			this.register.incIP(1);
	   }

		else if ((instruction & 0b11111000) == POP_SEG_REG){

		   

			let reg = (instruction >> 3 ) % 4 ;

		   //essayer avec emu avec le registre sp
		   
				this.register.writeReg(SEGMENT_REGISTERS_TABLE[reg], contentStack);

				this.register.writeReg(SP_REG, currentStackPointer+2)
				this.register.incIP(1);
		}

		
		return 0;

   }

   return -1;

}

//****************************** */
// NEG IT WORKS                  /*
//                               /*
//****************************** */



function decodeNEG() {

	var currentIp = this.register.readReg(IP_REG),
	currentCodeSegment = this.register.readReg(CS_REG),
	instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp),
	value = (currentCodeSegment << 4) + currentIp;
	
	
	if ((instruction & 0b11111110) == NEG_INS){
	
	var operandes = processeur.extractOperand(this.RAM.readByte(value +1));
	if(operandes.opRegister[0] == 3){
	
		if (operandes.addr == null){
			if (this.register.readReg(WORD_REGISTERS_TABLE[operandes.opRegister[0]]) == 0) decodeCLC();
			else decodeCMC();
			 this.register.writeReg(WORD_REGISTERS_TABLE[operandes.opRegister[1]], 1+ ~(this.register.readReg(WORD_REGISTERS_TABLE[operandes.opRegister[1]])));
	
		}
	
		if (operandes.addr) {
	
	
			if (this.RAM.readWord(operandes.addr)) decodeCLC();
			else decodeCMC();
	
			if(instruction % 2) 
				this.RAM.writeWord(operandes.addr, (1+ (~this.RAM.readWord(operandes.addr)))& 0xFFFF);
			
			else if(!(instruction % 2))
				this.RAM.writeByte(operandes.addr, (1+ (~this.RAM.readByte(operandes.addr))) & 0xFF)
	}
	
	this.register.incIP(2 + operandes.dispSize);
	return 0;
	
	}
	
	}	
	
	else return -1;
	
	}
	
	
//****************************** */
// POP IT WORKS                  /*
//                               /*
//****************************** */



function decodePOP(){


	

	var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp),
		value = (currentCodeSegment << 4) + currentIp;
	
	
	
	let currentStackSegment = this.register.readReg(SS_REG),
		currentStackPointer = this.register.readReg(SP_REG),
		adressStack = 0, contentStack = 0;
		adressStack = (currentStackSegment << 4) + currentStackPointer;
	
		if(adressStack == 0xFFFE) {  // FFFE
			
			console.log("Warning : the stack is empty  !!!!");
			adressStack = 0;
		}
		 
	
	
	
	   if((instruction & 0b11111111) == POPF_INS){
		   console.log(adressStack)
			   let content_stack =this.RAM.readWord(adressStack);
			   this.register.writeReg(FLAG_REG, content_stack);
	
			   console.log(this.register.readReg(SP_REG))
				   this.register.writeReg(SP_REG, currentStackPointer + 2)
				   console.log(this.register.readReg(SP_REG))
				this.register.incIP(1);
				return 0;
	
	
	   }
	
	   return -1; 
	
	
	   
	}
	


	
//****************************** */
// popf IT WORKS                  /*
//                               /*
//****************************** */



function decodePOPF(){

	var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte(currentCodeSegment << 4 + currentIp);
	
	
	
	let currentStackSegment = this.register.readReg(SS_REG),
		currentStackPointer = this.register.readReg(SP_REG),
		adressStack = 0, contentStack = 0;
		adressStack = (currentStackSegment << 4) + currentStackPointer;
	
		if(adressStack == 0xFFFE) {  // FFFE
			
			console.log("Warning : the stack is empty  !!!!");
			adressStack = 0;
		}
		 
	
	
	
	   if((instruction & 0b10011101) == PUSH_INS){

			   let content_stack =this.RAM.readWord(adressStack);
			   this.register.writeReg(content_stack, FLAG_REG);
	
				   this.register.writeReg(SP_REG, currentStackPointer + 2)
				   console.log(this.register.readReg(SP_REG))

				this.register.incIP(1);
				return 0;
	
	
	   }
	
	   return -1; 
	
	
	   
	}
	
/********************************************** */
//              PUSH IT'S DONE
//
//********************************************* */




function decodePUSH(){

	// get the current SS:SP position


	var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG);
		instruction = this.RAM.readByte((currentCodeSegment << 4) + currentIp),
		value = (currentCodeSegment << 4) + currentIp

	let currentStackSegment = this.register.readReg(SS_REG),
		currentStackPointer = this.register.readReg(SP_REG),
		adressStack = 0, contentStack = 0;
		adressStack = (currentStackSegment << 4) + currentStackPointer;
	  
		
	  

		if(instruction & 0b11111111 == PUSH_REG_MEM) {  

		   var operandes = processeur.extractOperand(this.RAM.readWord(value + 1));
		   // R / M

			if(operandes.opRegister[0] == 0){
				
			   if(operandes.addr){
				   
				 this.RAM.writeWord(adressStack, operandes.addr);
		
				 this.register.writeReg(SP_REG, currentStackPointer - 2)
				 this.register.incIP(2 + operandes.dispSize);
		}
	}
	
		else if ((instruction & 0b01010000) == PUSH_REG){
			// REGISTER

			let reg = instruction  % 8 ;
		
			console.log(adressStack)
			this.register.writeReg(adressStack, WORD_REGISTERS_TABLE[reg])
			this.register.writeReg(SP_REG, currentStackPointer - 2)
			this.register.incIP(1);
	   }

		else if ((instruction & 0b00000110) == PUSH_SEG_REG){

		   

			let reg = (instruction >> 3 ) % 4 ;

		   //essayer avec emu avec le registre sp
		   
				this.register.writeReg(adressStack, SEGMENT_REGISTERS_TABLE[reg]);

				this.register.writeReg(SP_REG, currentStackPointer - 2)
				this.register.incIP(1);
		}

		
		return 0;

   }

   return -1;

}




	
//****************************** */
// XCHG IT WORKS                  /*
//                               /*
//****************************** */

function decodeXCHG(){
	
	var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG);
		instruction = this.RAM.readByte((currentCodeSegment << 4) + currentIp),
		value = (currentCodeSegment << 4) + currentIp



	if((instruction & 0b11111110) == XCHG_REG_ACC){
		//R / ACC
	
		let R1 = this.register.readReg(AX_REG),
			R2 = this.register.readReg(WORD_REGISTERS_TABLE[(instruction % 8)]), tmp = R1;
	
			R1 = R2;
			R2 = tmp;
		
	
			this.register.writeReg(AX_REG, R1);
			this.register.writeReg(WORD_REGISTERS_TABLE[instruction % 8], R2);
	
			this.register.incIP(1);
			return 0;
	}
		
	
	
	else if( (instruction & 0b11111000) == XCHG_REG_MEM){
	
			var operandes = processeur.extractOperand(this.RAM.readWord(value +1));
	
			if (operandes.addr == null){
				
				let R1 = operandes.opRegister[0];
				let R2 = operandes.opRegister[1];
	
				if (instruction << 7){ // Word;
	
				let data1 = this.register.readReg(WORD_REGISTERS_TABLE[R1]),
					data2 = this.register.readReg(WORD_REGISTERS_TABLE[R2]), tmp = data1;
	
					data1 = data2;
	
					data2 = tmp;
	
					this.register.writeReg(WORD_REGISTERS_TABLE[R1], data1);
					this.register.writeReg(WORD_REGISTERS_TABLE[R2], data2);
	
		   } //Byte
			else{
				
				let data1 = this.register.readByte(R1),
					data2 = this.register.readByte(R2), data_tmp = data1;
	
					data1 = data2;
	
					data2 = tmp;
	
					this.register.writeByte(R1, data1);
					this.register.writeByte(R2, data2);
	
			}
		}
	
	   else if (operandes.addr) {
	
		   if (instruction << 7){
			
				let data1 = this.register.readReg(WORD_REGISTERS_TABLE[operandes.opRegister[0]]),
					data2 = this.RAM.readWord(operandes.addr), tmp = data1
					data1 = data2;
	
					data2 = tmp;
	
					this.register.writeReg(WORD_REGISTERS_TABLE[operandes.opRegister[0]], data1);
					this.RAM.writeWord(operandes.addr, data2);
	
	
	
	
			} //Byte
			else{
					console.log("hello")
				let data1 = this.register.readByte(WORD_REGISTERS_TABLE[operandes.opRegister[0]]),
					data2 = this.register.readByte(operandes.addr), data_tmp = data1;
	
					data1 = data2;
	
					data2 = tmp;
	
					this.register.writeByte(R1, data1);
					this.RAM.writeByte(operandes.addr, data2);
	
			}
	
	   }
	
			this.register.incIP(2);
			return 0;
	
	}
	return -1;
	
	}
	
	

	
//****************************** */
// REP IT WORKS                  /*
//                               /*
//****************************** */
	
function decodeREP(){

	var currentIp = this.register.readReg(IP_REG),
		currentCodeSegment = this.register.readReg(CS_REG),
		instruction = this.RAM.readByte((currentCodeSegment << 4) + currentIp),
		counter = this.register.readReg(CX_REG);

		let value = (currentCodeSegment << 4) + currentIp
		

		
		
		
	if ((instruction & 0b11111110) == REP_INS){
		
		if (instruction % 2  == 0 || counter == 0) return 0;
		else{
			this.decodeInstruction(this.RAM.readByte(value + 1))
			this.register.writeReg(IP_REG, this.register.readReg(IP_REG) -1)
			counter -=1;
			console.log(this.register.readReg(AX_REG))
			this.register.writeReg(CX_REG,counter);
			if(counter == 0 ) instruction -= 1;
			else if(counter != 0) this.decodeREP();
		}
		this.register.incIP(1);
		return 0;
	}
	return -1;
	}



 function  decodeInstruction(instruction){
	switch(instruction){
		case (0b10100100 || 0b10100101):
			
			this.decodeMOVS(true);
			break;
		case -0b10100110 || 0b10100101):
			this.decodeCMPS(true);
			break;
		case (0b10101110 || 0b10101111):
			this.decodeSCAS(true);
			break;
		case  (0b10101101 || 0b10101100) :
			this.decodeLODS(true);
			break;
		case  (0b10101010 ||0b10101011):
			this.decodeSTOS(true);
			break;
	}

	return 0;
}






