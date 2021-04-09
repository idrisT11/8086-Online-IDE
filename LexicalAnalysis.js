"use strict";
var Registers = ['AX', 'BX', 'CX', 'DX', 'CS', 'DS', 'ES', 'SS', 'DI', 'SI', 'SP', 'BP', 'IP', 'AH', 'AL', 'BH', 'BL', 'CH', 'CL', 'DL', 'DH', 'CS', 'DS', 'ES', 'SS'];
var instructions = ["MOV", "PUSH", "POP", "XCHG", "LEA", "LAHF", "SAHF", "PUSHF", "POPF", "ADD", "ADC", "DEC", "INC", "AAA", "SUB", "SSB", "NEG", "CMP", "MUL", "IMUL", "DIV", "IDIV", "CBW", "CWD", "NOT", "SHL", "SAL", "SHR", "SAR", "ROL", "ROR", "RCL", "RCR", "AND", "TEST", "OR", "XOR", "REP", "MOVSB", "CMPSB", "SCASB", "LODSB", "STOSB", "MOVSW", "CMPSW", "SCASW", "LODSW", "STOSW", "CALL", "JMP", "RET", "JE", "JZ", "JL", "JNGE", "JLE", "JNG", "JB", "JNAE", "JBE", "JNA", "JP", "JPE", "JO", "JS", "JNE", "JNZ", "JNL", "JGE", "JNLE", "JG", "JNB", "JAE", "JNBE", "JA", "JNP", "JPO", "JNO", "JNS", "LOOP", "LOOPZ", "LOOPE", "LOOPNZ", "LOOPNE", "JCXZ", "INT"]
var preProIns = ["ORG", "DEFINE", "EQU", "PROC", "LOCAL", "ENDM", "ENDP","OFFSET"];
var BracketRegister = ['BX', 'BP', 'SI', 'DI'];

var lexical = {
            good: true,
            expressionType: null,
            label: null,
            message: [],
            variableName: null,
            variableClass: null,
            operands: [],
            instructionType: null
};

   function  extractFirstAwel(str) {
       let t = str.trim().match(/(\w+\s*\:|\w+)/);
        return ((t === null) ? "":t[0].replace(/\s/g, ""));
    }
    function testInst(str) {
        let testString = extractFirstAwel(str);
        if ((!preProIns.includes(testString.toUpperCase())) && (!instructions.includes(testString.toUpperCase()))) {
            lexical.message.push("INVALID INSTRUCTION NAME ");
            return false;
        }
        else {
            if (preProIns.includes(testString.toUpperCase()))
                lexical.instructionType = "prePropIns";
            else
                lexical.instructionType = "InsSIM";
            return true;
        }
}
function offsetv(str) {
    let v=str.trim().match((/(?<=\s)\w+/));
    return (/OFFSET\s+\w/i.test(str.trim()) && legal(v[0]));
}
    //no spaces behind or after the backets

    function isNumber(str) {
        return /^0x|^0[A-F][A-Za-z0-9]*h$|^\d+[A-Za-z0-9]*h$|^[0-1]+(b$)|^\d+$/i.test(str[0] === "-" ? str.replace("-", "") : str);
    }
    function legal(str) {
        str=str.toUpperCase().trim();
        if ((/\W/.test(str)) || (/^\d|^\-\-/.test(str)) || (/\w\s\w/.test(str)) || instructions.includes(str) || Registers.includes(str)  || (str === "")) {
            return false;
        }
        return true;
    }
function type(str) {
    let v = str.trim();
    if (isNumber(v)) return "INT";
    else if (Registers.includes(v.toUpperCase())) return "REG";
    else if (/\[/.test(v)) return "MEM";
    else if (offsetv(v)) return "OFF";
    else if (legal(v)) return "VAR";
    else return "WRONG";
    }
    function verify(operand)
    {
    operand = operand.trim();
        if (Registers.includes(operand.toUpperCase())) {//register
            return true;
        }
        else if (/\[/.test(operand)) {//memory
            operand = operand.replace(/\s*(?=\[)/, "");
            operand = operand.replace(/(?<=\])\s*/, "");
            if (verifyMemory(operand)) {
                   
                return true;
            }
            else {
                lexical.message.push("INVALID MEMORY ADRESSING");
                return false;
            }
        }
        else if (isNumber(operand) || legal(operand)) {
            return true;
        }
        else if (/offset\s/i.test(operand)) {
            operand = operand.replace("offset ", "");
            operand = operand.trim();
               
            if (legal(operand)) {
                return true;
            }
            else { lexical.message.push("INVALID OFFSET OR VARIABLE NAME"); return false; }
        }
        else { lexical.message.push("INVALID OPERAND"); return false; }
}
    function testInstOps(str) {
        var operands = [];
        var str2 = str.replace(/\w+(?=\s)/, "");//delete first word
        var arr = [];
        var correct = true;
        var Op = {
            word:"",
            type: ""         
        }
        operands = (/,/.test(str2)) ? str2.split(',') : str2.split();
        if (operands[0] !== "") {
            for (let i = 0; i < operands.length; i++)
            {
                if (verify(operands[i])) {
                   /* Op.type = type(operands[i]);
                    Op.word = operands[i].replace(/\s/g, "");
                    lexical.operands.push(Op);*/
                    lexical.operands.push(operands[i[operands[i].replace(/\s/g, ""),type(operands[i])]);
                }
                else
                    return false;
            }
            return true;
        }
        else return true;
}
    
    function execute() { }/*
    testinstruction if the first operand is instruction
    test instruction operand
    test if operand 2memoire
                    1register
                    if it's variable without space
                    offset space variable name 
                    returns lexical.good
                    returns lexical.instructiontype
                    lexical.operand table of operands
                    affect preprocessor :org,define,equ,proc
    */
       function verifyMemory(str) {
    //es:[bx+5] |word []|w.|b.|byte 

           var str2 = str.match(/.*(?=\[)/);
           str2 = str2[0].trim();
            var arr = [];
            var str3 = "";
           str2 = str2.replace(/(?<=\w)\s*(?=\[)/);
           
    switch (str2.toUpperCase()) {
        case "ES:": case "WORD": case "BYTE": case "W.": case "B.": case ""://test whats behind and after the brackets
           
            if ((/\]$/.test(str))) {  //check whats after the  brackets
               

                str3 = str.replace(/.*\[/i, "");//replace whats behind and after the brackets     
                str3 = str3.replace(/\]/i, "");//replace whats behind and after the brackets 

                str3 = str3.trim();
                for (let i = 0; i < str3.length; i++) {
                    if (str3[i] === "-" && i!=0) { str3 = str3.substring(0, i) + "+" + str3.substring(i, str3.length); i++ }
                }
                
                arr = /\+/.test(str3) ? str3.split(/\+/) : str3.split();
                
                if (arr.includes("")) {
                    return false;
                }
                else {
                    var correct = true;
                    var array = [];

                    for (let i = 0; i < arr.length; i++) {
                        arr[i] = arr[i].trim();
                        if (BracketRegister.includes(arr[i].toUpperCase()))
                        {
                            array.push(arr[i].toUpperCase());
                        }
                       
                        if (!(BracketRegister.includes(arr[i].toUpperCase()) || isNumber(arr[i]) )) {//register or variable without spaces or number
                            correct = false;
                            break;
                        }
                    }
                    if (correct)//check if the registers have the correct combination inside brackets
                    {
                        if (array.includes("SI") && array.includes("DI")) correct = false;
                        else if (array.includes("BP") && array.includes("BX")) correct = false;
                    }
                    
                    return correct;
                }
            }
            else return false;
            break;
        default:
            return false;
    }
}
function validExpression(str) {
    lexical.good = (testInst(str) && testInstOps(str));
    return lexical.good;   
}
let inst = "mov lx, [BX-100 ],  10  ";
console.log(validExpression(inst));
//console.log(verify("offset x"));
console.log(lexical.instructionType);
console.log(lexical.operands);
console.log(lexical.message);

//di+di
//byte es:
//offsetvar name
//offset space needs to be left
//-space 100 acceptable
