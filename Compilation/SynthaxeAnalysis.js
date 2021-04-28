"use strict";
/*
const wordRegisters = ['AX', 'BX', 'CX', 'DX'];

const byteRegisters = ['AH', 'AL', 'BH', 'BL', 'CH', 'CL', 'DL', 'DH'];

const segmentRegisters = ['CS', 'DS', 'ES', 'SS'];

const Registers = ['DI', 'SI', 'SP', 'BP', 'IP'];
*/
const arithmetic = ["ADD", "ADC", "SUB", "SSB", "CMP", "AND", "TEST", "OR", "XOR"];

const oneops = ["INC", "DEC", "MUL", "DIV", "IDIV", "IMUL", "NEG", "NOT"];

const noops = ["MOVSB", "CMPSB", "SCASB", "LODSB", "STOSB", "MOVSW", "CMPSW", "SAHF", "SCASW", "LODSW", "STOSW", "CBW", "CLC", "CLD", "CLI", "CMC", "STC", "STD", "STI", "CWD", "HLT", "LAHF", "PUSHF", "POPF"];

const labels = ["JE", "JC", "JNC", "JZ", "JL", "JNGE", "JLE", "JNG", "JB", "JNAE", "JBE", "JNA", "JP", "JPE", "JO", "JS", "JNE", "JNZ", "JNL", "JGE", "JNLE", "JG", "JNB", "JAE", "JNBE", "JA", "JNP", "JPO", "JNO", "JNS", "LOOP", "LOOPZ", "LOOPE", "LOOPNZ", "LOOPNE", "JCXZ"];

const shift = ["SHL", "SAL", "SHR", "SAR", "ROL", "ROR", "RCL", "RCR"];

class SyntaxAnalysis {
       analyse(arr) {
        let temp, index;

        for (index = 0; index < arr.length; index++) 
        {
            const element = arr[index];
            if (element.expressionType != 'NULL') 
            {
                temp = this.excute(element);
                if (!temp.good)
                {
                    index++;
                    break;
                }
            }

        }
        index--;
        return { message: temp.message, good: temp.good, index: arr[index].index };
    }

    excute(Obj) {

        switch (Obj.instName) {

            case "MOV":

                //mov can acsept more than 2 paremeter but they have no  effect 

                if (Obj.operands.length > 1) {


                    let type1 = Obj.operands[0].type;

                    let type2 = Obj.operands[1].type;

                    let comp = type1 + " " + type2;

                    let exist = false;

                    /* 

                    this for will loop throw an array contain possible compinision for mov

                    */

                    for (let index = 0; index < opsCompinision.length; index++) {

                        const element = opsCompinision[index];



                        if (element.includes(comp)) {

                            exist = true;

                            break;

                        }

                    }

                    //detect wich operands is the memory for deplacement size cheak

                    let z = (/M/.test(type1)) ? 0 : (/M/.test(type2)) ? 1 : -1;

                    if (z != -1 && !this.range(getNum(Obj.operands[z].name)))

                        return { message: "DEPLACEMENT OVERFLLOW", good: false };



                    if (!exist) {



                        if (type2 == 'INT') {



                            if (!this.range(Obj.operands[1].name))

                                return { message: "NUMBER OVERFLLOW", good: false };

                            //after the test above we are sure that the int can fit in 2 byte at most



                            //to know if the int fit in one or two byte we use gets

                            let s = getS(Obj.operands[1].name, 0);



                            if (/RL|MB/.test(type1)) {

                                //s==1 means one byte    

                                if (s == 1)

                                    return { message: null, good: true }

                                // here we have int in 2 byte but operand size is just one  

                                else

                                    return { message: "Unmatched Operands Size", good: false }

                            }

                            if (/MU|RX|MW/.test(type1))



                                return { message: null, good: true }

                            /*

                            in this else the left operand dosen't accept INT ex:(RS,INT,LBL) 

                            as a left operand     */

                            else

                                return { message: "Wrong Operands", good: false }



                        }

                        if (type2 == "LBL") {

                            //label size is 16 byte

                            if (/RX|MW|MU/.test(type1))

                                return { message: null, good: true }

                            /* in this else the left operand dosen't accept label as a left operand or 

                            it's size is not enough */

                            else

                                return { message: "Wrong Operands ", good: false }

                        }

                        /* there are several possibilities here 

                        (RX,RL),(RL,RX),(M,M),(INT,M),(INT,R),(LBL,M),(LBL,R)

                        (VAR,M),(VAR,R) 

                        */

                        return { message: "Illegal operands or Unmatched Operands Size ", good: false }

                    }

                    // if all the tests above have been passed then the expression is true            

                    return { message: null, good: true }

                }

                // mov can't accepts less than one operand

                else

                    return { message: "Illegal Number Of Paremeters", good: false };

            case "POP":

                // pop accepts just one operand

                if (Obj.operands.length == 1) {

                    // as above in move deplacementcheck is required

                    if ((/M/.test(Obj.operands[0].type)) && !this.range(getNum(Obj.operands[0].name)))

                        return { message: "DEPLACEMENT OVERFLLOW", good: false };



                    switch (Obj.operands[0].type) {

                        case "RX": case "RS": case "MW": case "MU": case "VAR16":

                            return { message: null, good: true }

                        default:

                            //this means that the operand is false

                            return { message: "Illegal Paremeters", good: false }



                    }

                }

                else return { message: "Illegal Number of Paremeters", good: false }

            case "PUSH":

                //the same as pop 

                if (Obj.operands.length == 1) {

               
                    if ((/M/.test(Obj.operands[0].type)) && !this.range(getNum(Obj.operands[0].name)))

                        return { message: "DEPLACEMENT OVERFLLOW", good: false };


                    switch (Obj.operands[0].type) {



                        case "RX": case "RS": case "MW": case "MU": case "VAR16": case "LBL": case "OFF":



                            return { message: null, good: true }

                        //push acceptس int so we have to verfiy its range

                        case "INT":

                            if (this.range(Obj.operands[0].name))

                                return { message: null, good: true }

                            else

                                return { message: "NUMBER OVERFLLOW", good: false };

                        //this means that the operand is false

                        default:

                            return { message: "Illegal Paremeters", good: false }



                    }

                }

                else

                    return {
                        message: "Illegal Number of Paremeters", good: false

                    }



            case "XCHG":

                if (Obj.operands.length > 1) {

                    let type1 = Obj.operands[0].type;

                    let type2 = Obj.operands[1].type;

                    let comp = type1 + " " + type2;

                    let exist = false;

                    //the same as mov but without segment cases and int cases

                    for (let index = 0; index < 3; index++) {

                        const element = opsCompinision[index];

                        if (element.includes(comp)) {

                            exist = true;

                            break;

                        }

                    }

                    //detect which operands is the memory for deplacement sizecheck

                    let z = (/M/.test(type1)) ? 0 : (/M/.test(type1)) ? 1 : -1;

                    if (z != -1 && !this.range(getNum(Obj.operands[z].name)))

                        return { message: "DEPLACEMENT OVERFLLOW", good: false };

                    if (!exist)

                        return { message: "unmatched operands", good: false }

                    return { message: null, good: true }



                }

                else

                    return { message: "Illegal Number Of Paremeters", good: false };
            case "JMP": case "CALL":



                if (Obj.operands.length < 2) {



                    if (Obj.operands.length === 0 && Obj.instName == "JMP") return { message:null, good: true };//no operands

                    else if (Obj.operands.length === 1) {//one operand
                        if (Obj.operands[0].type === "INT")
                        {
                          
                            if (this.range(Obj.operands[0].name) )
                                return { message:null, good: true };
                            else return { message: "OUT OF BOUND OPERAND", good: false };
  
                        }

                        else if (Obj.operands[0].type === "LBL" || Obj.operands[0].type === "OFF" ) {//if it's a label or offset

                            return { message:null, good: true }



                        }

                        else if ((Obj.operands[0].type === "DIS")) {//if it's a memory adress 

                            let num1 = Obj.operands[0].name.match(/\w+(?=\s*\:)/);

                            let num2 = Obj.operands[0].name.match(/(?<=\:\s*)\w+/);


                            if (this.range(num1.trim()) && this.range(num2.trim())) {

                                return { message:null, good: true };

                            }

                            else return { message: "OUT OF BOUND OPERAND", good: false };

                        }

                        else return { message: "INVALID OPERAND", good: false };

                    }

                    else return { message: "WRONG TYPE OF PARAMETER", good: false };

                }

                else {

                    return { message: "Illegal Number Of Paremeters", good: false };

                }


            case "LEA":

                if (Obj.operands.length > 1) {

                    let type1 = Obj.operands[0].type;

                    let type2 = Obj.operands[1].type;

                    let comp = type1 + " " + type2;

                    let exist = comp=="RX MU"||comp=="RX MB"||comp=="RX MW"||comp=="RX VAR8"||comp=="RX VAR16";

                    // deplacement sizecheck

                    if (/M/.test(Obj.operands[1].type) && !this.range(getNum(Obj.operands[1].name)))

                        return { message: "DEPLACEMENT OVERFLLOW", good: false };

                    if (!exist)

                        return { message: "unmatched operands", good: false }

                    return { message: null, good: true }



                }

                else

                    return { message: "Illegal Number Of Paremeters", good: false };
    


            default:

                // this case is similar to mov but without segment cases

                if (arithmetic.includes(Obj.instName)) {

                    if (Obj.operands.length > 1) {

                        let type1 = Obj.operands[0].type;

                        let type2 = Obj.operands[1].type;

                        let comp = type1 + " " + type2;

                        let exist = false;

                        for (let index = 0; index < 4; index++) {

                            const element = opsCompinision[index];

                            if (element.includes(comp)) {

                                exist = true;

                                break;

                            }

                        }

                        //detect which operand is the memory for deplacement sizecheck

                        let z = (/M/.test(type1)) ? 0 : (/M/.test(type1)) ? 1 : -1;

                        if (z != -1 && !this.range(getNum(Obj.operands[z].name)))

                            return { message: "DEPLACEMENT OVERFLLOW", good: false };





                        if (!exist) {

                            if (type2 == "INT") {

                                if (!this.range(Obj.operands[1].name))

                                    return { message: "NUMBER OVERFLLOW", good: false };

                                let s = getS(Obj.operands[1].name, 0);

                                if (/RL|MB/.test(type1)) {

                                    if (s == 1)

                                        return { message: null, good: true }

                                    else

                                        return { message: "Unmatched Operands Size", good: false }

                                }

                                if (/MU|RX|MW/.test(type1))

                                    return { message: null, good: true }

                                else return { message: "Wrong Operands", good: false }

                            }

                            if (type2 == "LBL") {



                                if (/RX|MW|MU/.test(type1))

                                    return { message: null, good: true }

                                else return { message: "Wrong Operands", good: false }

                            }

                            return { message: "Wrong Operands", good: false }

                        }

                        return { message: null, good: true }



                    }

                    else

                        return { message: "Illegal Number Of Paremeters", good: false };



                }

                if (shift.includes(Obj.instName)) {

                    //like mov shift accepts more than 2 operands but without any effect 

                    if (Obj.operands.length > 1) {

                        let type1 = Obj.operands[0].type;

                        let type2 = Obj.operands[1].type;

                        //the left operand should be (MU|RX|MB|MW|RL|VAR8|VAR16)

                        if (/MU|RX|MB|MW|RL|VAR8|VAR16/.test(type1)) {

                            //deplacementcheck

                           
                            if ((/M/.test(Obj.operands[0].type)) && !this.range(getNum(Obj.operands[0].name)))

                                return { message: "DEPLACEMENT OVERFLLOW", good: false };


                            //the right operand could be int in one byte  

                            if (type2 == "INT" && this.range(Obj.operands[1].name) && getS(Obj.operands[1].name))

                                return { message: null, good: true }

                            // or the register CL     

                            if (type2 == "RL" && Obj.operands[1].name == "CL")

                                return { message: null, good: true }

                        } // if not return false

                        return { message: "Illegal Paremeters", good: false }

                    }



                    else return { message: "Illegal Number of Paremeters", good: false }

                }

                if (noops.includes(Obj.instName)) {

                    // accept no operands if not return error

                    if (Obj.operands.length === 0)

                        return { message: null, good: true }



                    else

                        return { message: "Illegal Number Of Paremeters", good: false };

                }

                if (oneops.includes(Obj.instName)) {

                    // accept just one operand or it returns false

                    if (Obj.operands.length == 1) {

                        // deplacementcheck

                        
                        if ((/M/.test(Obj.operands[0].type)) && !this.range(getNum(Obj.operands[0].name)))

                            return { message: "DEPLACEMENT OVERFLLOW", good: false };


                        // that operand can be a memory or register(16 or 8)

                        if (/M|RL|RX/.test(Obj.operands[0]))

                            return { message: null, good: true }

                        // if not return false

                        else

                            return { message: "Illegal Paremeters", good: false };

                    }

                }

                if (labels.includes(Obj.instName)) {

                    // this may change later test in emu jz x1,x2 it returns to the first line 

                    if (Obj.operands.length === 1) {

                        // accept only label as a operand

                        if (Obj.operands[0].type = "LBL") return { message: null, good: true }

                        else return { message: "WRONG PARAMETER", good: false }



                    } else if (Obj.operands.length === 0) return { message: "REQUIRED LABEL", good: false }

                    else return { message: "WRONG NUMBER OF PARAMETERS", good: false };

                }





        }

    }

    range(str) {//check the range of string number
        return (/\-/.test(str)) ? (convertP(str.replace(/\-/, "")) <= 32768) : (convertP(str) <= 65535);
    }

}
const opsCompinision = [

    ["RL RL", "RX RX"] 

    ,["MU RX", "MU RL", "MB RL", "MW RX", "VAR8 RL", "VAR16 RX"] 

    ,["RX MU", "RL MU", "RL MB", "RX MW", "RL VAR8", "RX VAR16"] 

    ,["RX OFF","MU OFF","MW OFF"] 

    , ["RS MU", "RS MW"] 

    ,["MU RS", "MW RS"] 

    ,["RX RS"] 

    , ["RS RX"] 
]



function getS(str, i = 0) {

    let fun;
    fun = (i === 0) ? getNum : function (x) { return x };
    if (/\-/.test(str)) {
        return (convert(fun(str)) > 255) ? 0 : 1;
    }
    else {
        return (convert(fun(str)) > 127) ? 0 : 1;
    }
}

function convertP(str) {

    if (/0x|0[A-F][A-Za-z0-9]*h|\[A-Za-z0-9]*h/i.test(str)) {

        var str2 = str.replace(/0x|h/gi, ""); str2 = str2.toUpperCase();

        return parseInt(str2, 16);

    }

    else if (/[0-1]b/i.test(str)) {

        var str2 = str.replace(/b/gi, "");

        return parseInt(str2, 2);

    }

    else if (/0o/i.test(str)) {

        var str2 = str.replace(/0o/gi, ""); str2 = str2.toUpperCase();

        return parseInt(str2, 8);

    }

    else {

        return parseInt(str, 10);

    }

}

function convert(str) {

    if (/\-/.test(str)) {

        var str3 = str.replace(/\-/, "");

        var binary = convertP(str3);

        if (binary <= 128) {

            return ((~binary) & 0xff) + 1;

        }

        else {

            return ((~binary) & 0xffff) + 1;

        }

    } else return convertP(str);

}
function getNum(str) {//turn a string number BETWEEN BRACKETS to number
    var x = str.match(/(?<=(\+|\-|\[))(0x\w+|0[A-F]\w*h|\d\w*h|\d+|[01]+b)(?=(\+|\]))/i);

    if (x != null) {
        if (/\-/.test(str)) x[0] = "-" + x[0];
        return convert(x[0]);
    }
    else { return 0 }
}







let sy = new SyntaxAnalysis;

console.log(sy.excute({

    good: true,

    expressionType: 'INST',

    instructionType: 'InsSIM',

    label: null,

    message: null,

    instName: 'JMP',

    variableName: null,

    variableClass: null,

    operands: [{ name: '1352', type: 'INT' }]

}

));

