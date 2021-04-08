//MOH
   const wordRegisters = ['AX', 'BX', 'CX', 'DX', 'CS', 'DS', 'ES', 'SS', 'DI', 'SI', 'SP', 'BP', 'IP'];
   const byteRegisters = ['AH', 'AL', 'BH', 'BL', 'CH', 'CL', 'DL', 'DH'];
   const segmentRegisters = ['CS', 'DS', 'ES', 'SS'];
   const instructions=["ENDM","EQU","DEFINE","ORG","ENDP","MOV","PUSH", "POP", "XCHG","LEA","LAHF","SAHF","PUSHF","POPF" ,"ADD","ADC","DEC" ,"INC","AAA","SUB","SSB" ,"NEG" ,"CMP" ,"MUL","IMUL","DIV","IDIV","CBW","CWD","NOT","SHL","SAL","SHR", "SAR","ROL","ROR", "RCL","RCR","AND","TEST","OR","XOR","REP","MOVSB", "CMPSB", "SCASB","LODSB","STOSB","MOVSW", "CMPSW", "SCASW","LODSW","STOSW","CALL"]
    
"use strict";

class LexicalAnalysis{
    lexical={};
     //return the firstKlma word from  a string 
    extractfirstAwel(str){
         return str.trim().match(/(?<=\s*)[\w|^\:]:/);
    }

    execute(){
        firstKlma = extractfirstAwel(str);
        if ( firstKlma[ firstKlma.length() - 1]==':'){
            if (legalName(firstKlma)){
                this.lexical.label=firstKlma;//delete the ":"  
                str = str.replace(firstKlma,"").trim();
                firstKlma = extractfirstAwel(str);
            }
            else {

                this.lexical.good=false;
                this.lexical.message="ERROR : Illegel expression ";
                console.log("errue : label false ");
            }

        }
         if (second){}; // four cases

    }

    //check if the name is legal
    legalName(str){
        str = str.toUpperCase().trim();
        if ((/\W/.test(str))||(/^\d/.test(str)) || instructions.includes(str) || wordRegisters.includes(str) || byteRegisters.includes(str)) 
            return false;
        return true;
    }
    testVariable(str){
      
    } 
}

let lx = new LexicalAnalysis();
console.log(lx.legalName("EU"));
