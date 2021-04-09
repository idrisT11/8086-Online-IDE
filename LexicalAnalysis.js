"use strict";
 function getOps(str) {
    let operands = [];
    let str2 = str.replace(/\w+(?=\s)/, "");
    str2 = str2.replace(/\s/g, "");
    operands = (/,/.test(str2)) ? str2.split(',') : str2.split();
    if (operands[0] != "") {
        let i = 0;
        let opsnumber = operands.length;         
             if (Registers.includes(operands[i].toUpperCase())) { operands.push('R') }
            else if (/\[.*\]/.test(operands[i])) { operands.push('M') }
            else (operands.push('I'))
        
    }
    return operands.map(x => (x.toUpperCase()));
}
 var Registers = ['AX', 'BX', 'CX', 'DX', 'CS', 'DS', 'ES', 'SS', 'DI', 'SI', 'SP', 'BP', 'IP','AH', 'AL', 'BH', 'BL', 'CH', 'CL', 'DL', 'DH','CS', 'DS', 'ES', 'SS'];
    var instructions=["MOV","PUSH", "POP", "XCHG","LEA","LAHF","SAHF","PUSHF","POPF" ,"ADD","ADC","DEC" ,"INC","AAA","SUB","SSB" ,"NEG" ,"CMP" ,"MUL","IMUL","DIV","IDIV","CBW","CWD","NOT","SHL","SAL","SHR", "SAR","ROL","ROR", "RCL","RCR","AND","TEST","OR","XOR","REP","MOVSB", "CMPSB", "SCASB","LODSB","STOSB","MOVSW", "CMPSW", "SCASW","LODSW","STOSW","CALL","JMP","RET" ,"JE","JZ" ,"JL","JNGE" ,"JLE","JNG" ,"JB","JNAE" ,"JBE","JNA" ,"JP","JPE" ,"JO","JS","JNE","JNZ","JNL","JGE" ,"JNLE","JG" ,"JNB","JAE" ,"JNBE","JA" ,"JNP","JPO" ,"JNO","JNS","LOOP","LOOPZ","LOOPE" ,"LOOPNZ","LOOPNE","JCXZ","INT"]
    var preProIns = ["ORG", "DEFINE", "EQU", "PROC", "LOCAL", "ENDM", "ENDP",];

class LexicalAnalysis{

    Registers = ['AX', 'BX', 'CX', 'DX', 'CS', 'DS', 'ES', 'SS', 'DI', 'SI', 'SP', 'BP', 'IP','AH', 'AL', 'BH', 'BL', 'CH', 'CL', 'DL', 'DH','CS', 'DS', 'ES', 'SS'];
    instructions=["MOV","PUSH", "POP", "XCHG","LEA","LAHF","SAHF","PUSHF","POPF" ,"ADD","ADC","DEC" ,"INC","AAA","SUB","SSB" ,"NEG" ,"CMP" ,"MUL","IMUL","DIV","IDIV","CBW","CWD","NOT","SHL","SAL","SHR", "SAR","ROL","ROR", "RCL","RCR","AND","TEST","OR","XOR","REP","MOVSB", "CMPSB", "SCASB","LODSB","STOSB","MOVSW", "CMPSW", "SCASW","LODSW","STOSW","CALL","JMP","RET" ,"JE","JZ" ,"JL","JNGE" ,"JLE","JNG" ,"JB","JNAE" ,"JBE","JNA" ,"JP","JPE" ,"JO","JS","JNE","JNZ","JNL","JGE" ,"JNLE","JG" ,"JNB","JAE" ,"JNBE","JA" ,"JNP","JPO" ,"JNO","JNS","LOOP","LOOPZ","LOOPE" ,"LOOPNZ","LOOPNE","JCXZ","INT"]
    preProIns = ["ORG", "DEFINE", "EQU", "PROC", "LOCAL", "ENDM", "ENDP",];

    lexical=
    {  good:true,
        expressionType:null,
        label:null,
        message:null,
        variableName:null,
        variableClass:null,
            operands: null,
        instructionType: null
     };
    
    extractFirstAwel(str) {
        let t = str.match(/(?<=\s*)(\w+\s*\:|\w+(?=\s+\w))/);
        return (t===null)?t[0].replace(/\s/g,""):"";
    }
    testInstruction(str)
    {
        let testString = extractFirstAwel(str);
        if ((!this.preProIns.includes(testString.toUpperCase())) && (!this.instructions.includes(testString.toUpperCase())))
        {
            return false;
        }
        else {
          if (this.preProIns.includes(testString.toUpperCase()))
          this.lexical.instructionType = "prePropIns";      
        else 
            this.lexical.instructionType = "InsSIM";
            return true;
        }
    }
    //no spaces behind or after the backets
     verifyMemory(str) {
    //es:[bx+5] |word []|w.|b.|byte 

         var str2 = str.match(/.*(?=\[)/);
         var arr = [];
         var str3 = "";

         switch (str2[0].toUpperCase())
         {
             case "ES:": case "WORD": case "BYTE": case "W.": case "B.":case ""://test whats behind and after the brackets
                 
                 if ((/\]$/.test(str))) {  //check whats after the  brackets
                     
                     str3 = str.replace(/.*\[/i, "");//replace whats behind and after the brackets     
                     str3 = str3.replace(/\]/i, "");//replace whats behind and after the brackets 

                     str3 = str3.trim();

                     arr = /\+|\-/.test(str3) ? str3.split(/\+|\-/) : str3.split();

                     if (arr.includes("")) {
                         return false;
                     }
                     else {
                         var correct = true;
                         for (let i = 0; i < arr.length; i++) {
                             arr[i] = arr[i].trim();
                             if (!(Registers.includes(arr[i].toUpperCase()) || isNumber(arr[i]) || legal(arr[i]))) {//register or variable without spaces or number
                                 correct = false;
                                 break;
                             }
                         }
                         return correct;
                     }
                 }
                 else {return false; }
                 break;         
             default:
                 return false;
         }
    }
    isNumber(str)
    {      
        return /^0x|^0[A-F][A-Za-z0-9]*h$|^\d+[A-Za-z0-9]*h$|^[0-1]+(b$)|^\d+$/i.test(str);
    }
    legal(str){
        str = str.toUpperCase().trim();
        if ((/\W/.test(str))||(/^\d|^\-\-/.test(str))||(/\w\s\w/.test(str)) || instructions.includes(str)|| Registers.includes(str) ) 
            return false;
        return true;
    }
    testInstructionsOperand(str) {
        var operands = [];
        var str2 = str.replace(/\w+(?=\s)/, "");//delete first word
        var arr = [];
        operands = (/,/.test(str2)) ? str2.split(',') : str2.split();
        if (operands[0] !== "") {
            if (operands.length === 1) {
                operands[0] = operands[0].trim();
                if (Registers.includes(operands[0].toUpperCase())) {//register
                    this.lexical.operands.push(operands[0]);
                    return true;
                }
                else if (/\[/.test(operands[0])) {//memory
                    operands[0] = operands[0].replace(/\s(?=\[)/,g);
                    operands[0] = operands[0].replace(/(?<=\])\s)/, g);
                    if (this.verifyMemory(operands[0])) {
                        this.lexical.operands.push(operands[0]);
                        return true;
                    }
                    else if (legal(operands[0]))//variable with no spaces
                    {
                        this.lexical.operands.push(operands[0]);
                        return true;
                    }
                    else if (/offset/i.test(operands[0])) {
                        operands[0] = operands[0].replace("offset", "");
                        operands[0] = operands[0].trim();
                        if (legal(operands[0])) {
                            this.lexical.operands.push(operands[0]);
                            return true;
                        }
                        else return false;
                    }
                    else return false;
                }
            }
        }
        else return true;
    }
    execute(){}/*
    testinstruction if the first operand is instruction
    test instruction operand
    test if operand 2memoire
                    1register
                    if it's variable without space
                    offset space variable name 
                    returns this.lexical.good
                    returns this.lexical.instructiontype
                    this.lexical.operand table of operands
                    affect preprocessor :org,define,equ,proc
    */
}

function legal(str) {
    str = str.toUpperCase().trim();
        if ((/\W/.test(str))||(/^\d|^\-\-/.test(str))||(/\w\s\w/.test(str)) || instructions.includes(str)|| Registers.includes(str) ) 
            return false;
        return true;
}
function isNumber(str)
{
        return /^0x|^0[A-F][A-Za-z0-9]*h$|^\d+[A-Za-z0-9]*h$|^[0-1]+(b$)|^\d+$/i.test(str[0]==="-"?str.replace("-",""):str);
}
function testInstruction(str)
    {
    let testString = extractFirstAwel(str);
        if ((!preProIns.includes(testString.toUpperCase())) && (!instructions.includes(testString.toUpperCase())))
        {
            return false;
        }
        else {
            if (preProIns.indexOf(testString.toUpperCase()) !== -1)
            return true;
        }
    }
     function  extractFirstAwel(str) {
         let t = str.match(/(?<=\s*)(\w+\s*\:|\w+(?=\s+\w))/);
        return t[0].replace(/\s/g,"");
}
    function  verifyMemory(str) {
    //es:[bx+5] |word []|w.|b.|byte 

         var str2 = str.match(/.*(?=\[)/);
         var arr = [];
         var str3 = "";

         switch (str2[0].toUpperCase())
         {
             case "ES:": case "WORD": case "BYTE": case "W.": case "B.":case ""://test whats behind and after the brackets
                 
                 if ((/\]$/.test(str))) {  //check whats after the  brackets
                     
                     str3 = str.replace(/.*\[/i, "");//replace whats behind and after the brackets     
                     str3 = str3.replace(/\]/i, "");//replace whats behind and after the brackets 
                     str3 = str3.trim();
                     
                     if (/\[\-/.test(str3) && isNumber(str3.match(/\-\w+(?=+)/))) {
                         str3 = str3.replace("\-", "");
                         console.log("i did it ");
                     }
                     arr = /\+|\-/.test(str3) ? str3.split(/\+|\-/) : str3.split();

                     if (arr.includes("")) {
                         return false;
                     }
                     else {
                         var correct = true;
                         for (let i = 0; i < arr.length; i++) {
                             arr[i] = arr[i].trim();
                             if (!(Registers.includes(arr[i].toUpperCase()) || isNumber(arr[i]) || legal(arr[i]))) {//register or variable without spaces or number
                                 correct = false;
                                 break;
                             }
                         }
                         return correct;
                     }
                 }
                 else {return false; }
                 break;         
             default:
                 return false;
         }
}
    function testInstructionsOperand(str) {
        var operands = [];
        var str2 = str.replace(/\w+(?=\s)/, "");//delete first word
        var arr = [];
        operands = (/,/.test(str2)) ? str2.split(',') : str2.split();
        if (operands[0] !== "") {
            console.log("hhhhhhh");
            if (operands.length === 1) {
                console.log("kkkkkkk");
                operands[0] = operands[0].trim();
                if (Registers.includes(operands[0].toUpperCase())) {//register
                    return true;
                }
                else  if (/\[/.test(operands[0])) {//memory
                        operands[0] = operands[0].replace(/\s*(?=\[)/, "");
                        operands[0] = operands[0].replace(/(?<=\])\s*/, "");
                        console.log("from memory " + operands[0]);
                    if (verifyMemory(operands[0])) {
                        console.log("nooooo");
                        return true;
                    }
                    else {console.log("shiiiit");return false;}
                    }
                    else if (isNumber(operands[0])) {
                        console.log("kkkkk455")
                        return true;
                    }
                    else if (legal(operands[0]))//variable with no spaces
                    {
                        console.log("legal");
                        return true;
                    }
                    else if (/offset/i.test(operands[0])) {
                        operands[0] = operands[0].replace("offset", "");
                        operands[0] = operands[0].trim();
                        console.log("offset");
                        if (legal(operands[0])) {
                            return true;
                        }
                        else return false;
                    }
                    else return false;             
               }
            }
        
        else return true;
    }
console.log(testInstructionsOperand("org es:[-100h]"));
