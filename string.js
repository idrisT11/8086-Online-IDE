"use strict";
const WORDREGISTERS = ['AX', 'BX', 'CX', 'DX', 'CS', 'DS', 'ES', 'SS', 'DI', 'SI', 'SP', 'BP', 'IP'];
const BYTEREGISTERS = ['AH', 'AL', 'BH', 'BL', 'CH', 'CL', 'DL', 'DH'];
const SEGMENTREGISTERS = ['CS', 'DS', 'ES', 'SS'];
var _justNumbers = false; 

class Encode {

    //if its a number between brackets its set to true and regmem gives r/m b110 and mod =0
 

    getOps(str) {

    let operands = [];
    let str2 = str.replace(/\w+(?=\s)/, "");

    str2 = str2.replace(/\s/g, "");
    operands = (/,/.test(str2)) ? str2.split(',') : str2.split();

    if (operands[0] != "") {

        let i = 0;
        let opsnumber = operands.length;

        for (i; i < opsnumber; i++) {

            if (/\[.*\]/.test(operands[i]))
                operands.push('M');

            else if (SEGMENTREGISTERS.includes(operands[i].toUpperCase()))  
                operands.push('RS'); 

            else if (WORDREGISTERS.includes(operands[i].toUpperCase()))  
                operands.push('RX');

            else if (BYTEREGISTERS.includes(operands[i].toUpperCase()))  
                operands.push('RL');

            else 
                (operands.push('I'));

            }   
        }

        return operands.map(x => (x.toUpperCase()));
    }

    //this function tell u if the number is stored in 16 bits or 8 bits
    //the second paremeter indice if we are working in memory operand or immediat

    _getS(str, i = 0) {

        let fun;

        fun = (i === 0) ? this._getNum : function (x) { return x };

        if (/\-/.test(str)) 
            return (this.convert(fun(str)) > 255) ? 0 : 1;

        
        else 
            return (this.convert(fun(str)) > 127) ? 0 : 1;
    
    }

    //get value of d
     _getD(operands) {

        // from reg to memory 
        if (/M/.test(operands[2]) && /R/.test(operands[3]))
            return 0;

        // memory to reg 
        else if (/R/.test(operands[2]))
            return 1;
    
    }

    _getV(operands) {

        return (/cl/i.test(operands[1])) ? 1 : 0;

    }

    _getNum(str) {

        //turn a string number BETWEEN BRACKETS to number
        var x = str.match(/(?<=(\+|\-|\[))(0x\w+|0[A-F]\w*h|\d\w*h|\d+|[01]+b)(?=(\+|\]))/i);

        if (x != null) {

            if (/\-/.test(str)) x[0] = "-" + x[0];
                return this.convert(x[0]);
        }

        else 
            return 0;
    }

    //get value of w
    _getW(operands) {

        let x;

        if (operands.length === 4) {

            if (/R[XS]/.test(operands[2])) 
                return 1; 

            else if (/RL/.test(operands[2]))  
                return 0;

            else if (/R[XS]/.test(operands[3])) 
                return 1;

            else if (/RL/.test(operands[3])) 
                return 0;

            (/M/.test(operands[2])) ? x = 0 : x = 1;

            if (/WORD|W\./.test(operands[x])) 
                return 1;

            else if (/BYTE|B\./.test(operands[x])) 
                return 0;

            else 
                return this._getS(operands[x == 0 ? 1 : 0], 1) ? 0 : 1;  // modifier sur adc and under this case
            
        }

        else {

            if (/R[XS]/.test(operands[1])) 
                return 1;

            if (/RL/.test(operands[1]))
                return 0;

            if (/WORD|W\./.test(operands[0])) 
                return 1;

            else if (/BYTE|B\./.test(operands[0])) 
                return 0;

            else 
                return (this._getS(operands[0], 1)) ? 0 : 1;
            
        }
    }

    _getMod(operands) {

        var num;

        if (operands.length === 2)//one operand
        {
            if (/R/.test(operands[1])) 
                return 3;

             else if (/M/.test(operands[1])) {
                return (this._getS(operands[0], 0) === 0) ? 2 : (this.convert(this._getNum(operands[0])) !== 0) ? 1 : 0;
            }

        }

        else {
            if (/R|I/.test(operands[2]) && /R|I/.test(operands[3]))
                return 3;

            else {
                let x = (/M/.test(operands[2])) ? 0 : 1;
                if (this._getNum(operands[x]) == 0) return 0;
                if (this._getS(operands[x]) === 0) return 2;
                else return 1;

            }

        }
    }

    _regMem(ops) {

        _justNumbers = false;

        if (this._getMod(ops) == 3) {

            if (ops.length === 2) 
                return this._regToId(ops[0]);
            
            else 
                return /R/.test(ops[3]) ? this._regToId(ops[1]) : this._regToId(ops[0]);
            
        }

        else {

            let i;
            (/\[/.test(ops[0])) ? i = 0 : /\[/.test(ops[1]) ? i = 1 : i = -1;

            if (/(bx|si)+.*(bx|si)/i.test(ops[i]))  
                return 0;

            else if (/(bx|di)+.*(bx|di)/i.test(ops[i])) 
                return 1;

            else if (/(bp|si)+.*(bp|si)/i.test(ops[i]))  
                return 2;

            else if (/(bp|di)+.*(bp|di)/i.test(ops[i])) 
                return 3;

            else if (/si/i.test(ops[i])) 
                return 4;

            else if (/di/i.test(ops[i])) 
                return 5;

            else if (/bp/i.test(ops[i]))    
                return 6;

            else if (/bx/i.test(ops[i]))  
                return 7;

            else { 

                _justNumbers = true; 
                return 0b110; 

            }
        }
    }

    __segSepcification(operands, arr) {

        var x = 0;
        if (operands.length === 4) 
            x = /M/.test(operands[2]) ? 0 : (/M/.test(operands[3]) ? 1 : -1);

        else 
            x = /M/.test(operands[1]) ? 0 : -1; 

        if (x != -1 && /S\s*:/.test(operands[x])) {

            let y = operands[x][0] + operands[x][1];
            arr.unshift(38 + ((this._regToId(y)) << 3));
            return arr;
        }

        else 
            return arr;
}

    //get operands and its types exp: ["ax",'[1254+bx]',''Rx","M"] or ["al",0x12FF,''RL","I"]]
    __byteConcat(str, arr) {

        var tmp = this.getOps(str);
        var z;
        if (tmp.length === 4) 
            z = /M/.test(tmp[2]) ? 0 : 1
        
        else 
            z = 0; 

        let disp = this._splitNum(this.convert(this._getNum(tmp[z])), this._getS(tmp[z]));
        arr.concat(this._findBP(this.getOps(str), arr));

        if (disp != 0) {

            arr = arr.concat(disp);
            if (_justNumbers && this._getS(tmp[z], 0) === 1) arr.push(0);
            return arr;
        } 

        else 
            return arr;
    }

    _findBP(operands, arr) {

        if (operands.length === 4) {

            let z = /M/.test(operands[2]) ? 0 : (/M/.test(operands[3]) ? 1 : -1);

            if (z !== -1) {

                if (/\[BP\]/i.test(operands[z])) 
                    arr.push(0);
                
            }
        }

        else if (/\[BP\]/i.test(operands[0])) 
            arr.push(0);
        
        return arr;
    }

    _segSepcification(operands, arr) {

        var x = 0;

        if (operands.length === 4) 

            x = /M/.test(operands[2]) ? 0 : (/M/.test(operands[3])) ? 1 : -1;

         else 
            x = /M/.test(operands[1]) ? 0 : -1; 

        if (x != -1 && /S:/.test(operands[x])) {
            let y = operands[x][0] + operands[x][1];
            arr.unshift(38 + (this._regToId(y) << 3));
            return arr;
        }
        else 
            return arr;
    }

    //this function will take  a number and return an array 
    //the second parameter specefy if number in 16bite or in 8byte
    _splitNum(num, s = 1) {

        var disp = [];
        if (num > 255) {
            disp.push(num & (0b0000000011111111));
            num >>= 8;
            disp.push(num);
        }

        else {

            disp.push(num);
            if (s === 0) {
                disp.push(0);
            }
        }

        return disp;
    }


    execute(str) { // original function to be class later 

        var arr = [];

        let regex = /(?<=\s*)\S+/;
        let instruction = str.match(regex);

        var operands = this.getOps(str);
        var s = this._getS(operands[1], 1);
        var w = this._getW(operands),
            v = this._getV(operands),
            opcode = 0,
            d = this._getD(operands),
            mode = this._getMod(operands),
            result = 0,
            regmem = this._regMem(operands);
        if (/\[BP\]/i.test(str)) 
            mode = 1;

        if (_justNumbers) 
            mode = 0;

        arr = this._segSepcification(operands, arr);
        //match instruction
        switch (instruction[0].toUpperCase()) {

            case "MOV":
                //segemnt register to memory/register
                if (/M|R/.test(operands[2]) && /RS/.test(operands[3])) {

                    arr.push(0b10001100);
                    arr.push((mode << 6) + (this._regToId(operands[1]) << 3) + (/R/.test(operands[2]) ? this._regToId(operands[0]) : regmem));
                        arr = this._byteConcat(str, arr);

                    }

                // memory/register to segment register
                else if (/RS/.test(operands[2]) && /R|M/.test(operands[3])) {

                    arr.push(0b10001110);
                    arr.push((mode << 6) + (this._regToId(operands[0]) << 3) + regmem);
                    arr = this._byteConcat(str, arr);
                }
         
                // Register/Memory to/from Register
                else if (/R|M/.test(operands[2]) && /R|M/.test(operands[3])) {

                    opcode = 0b100010;

                    // register to memory
                    if (/M/.test(operands[2]) && /R/.test(operands[3])) {

                        arr.push((opcode << 2) + w);
                        result = (mode << 6) + (this._regToId(operands[1]) << 3) + regmem;
                        arr.push(result);

                    }

                    // immidiate+register to register 
                    else if (/R/.test(operands[2])) {

                        arr.push((opcode << 2) + (0b10) + w);
                        result = (mode << 6) + ((this._regToId(operands[0])) << 3) + regmem;
                        arr.push(result);
                    }

                    arr = this.__byteConcat(str, arr);
                    // Immediate to Register/Memory
                } 

                else if (/M|R/.test(operands[2]) && /I/.test(operands[3])) {

                    arr.push((0b11000110) + w);
                    arr.push((mode << 6) + regmem);
                    arr = this._byteConcat(str, arr);

                    if (w === 1) {

                        let byte = this._splitNum(this.convert(operands[1]), this._getS(operands[1], 1));
                        arr.push(byte[0]);

                        if (byte.length === 2) 
                            arr.push(byte[1]);
                        
                    }

                    else 
                        arr.push(this.convert(operands[1]));
                    
                }
                break;

            case "PUSH":

                if (/RS/.test(operands[1])) 
                    arr.push((((this._regToId(operands[0])) << 3) + 0b110));
                
                else if (/R|M/.test(operands[1])) {

                    arr.push(0b11111111);
                    arr.push(((mode) << 6) + (0b110000) + regmem);
                    if (/M/.test(operands[1])) arr = this._byteConcat(str, arr);

                }
                break;

            case "POP":
                if (/RS/.test(operands[1])) 
                    arr.push((((this._regToId(operands[0])) << 3) + 0b111));
                
                else if (/R|M/.test(operands[1])) {
                    arr.push(0b10001111);
                    arr.push((mode << 6) + (regmem));
                    if (/M/.test(operands[1])) arr = this._byteConcat(str, arr);
                }

                break;

            case "XCHG":
                
                arr.push((0b10000110) + w);

                arr.push((mode << 6) + ((this._regToId(operands[(/R/.test(operands[2])) ? 0 : 1])) << 3) + regmem);
                arr = this._byteConcat(str, arr);
                break;

            case "LEA":

                if (/R/.test(operands[2]) && /M/.test(operands[3])) {

                    arr.push(0b10001101);
                    arr.push((mode << 6) + ((this._regToId(operands[0])) << 3) + regmem);
                    arr = this._byteConcat(str, arr);
                }
                break;

            case "LAHF":
                arr.push(0b10011111);
                break;

            case "SAHF":
                arr.push(0b10011110);
                break;
            case "PUSHF":
                arr.push(0b10011100);
                break;
            case "POPF":
                arr.push(0b10011100);
                break;

            case "ADD":

                //Reg./Memory with Register to Either
                if (/R|M/.test(operands[2]) && /M|R/.test(operands[3])) {
                    arr.push((d << 1) + w);

                    arr.push((mode << 6) + (this._regToId((/R/.test(operands[2])) ? operands[0] : operands[1]) << 3) + regmem);
                    arr = this._byteConcat(str, arr);
                }

                //Immediate to Register/Memory 

                else if (/M|R/.test(operands[2]) && /I/.test(operands[3])) {

                    opcode = (0b100000);
                    if (w == 0)  
                        s = 0; 

                    arr.push((opcode << 2) + (s << 1) + w);
                    arr.push((mode << 6) + regmem);
                    arr = this._byteConcat(str, arr);

                    if (w === 1) {

                        let byte = this._splitNum(this.convert(operands[1]), this._getS(operands[1], 1));
                        arr.push(byte[0]);

                        if (byte.length === 2) 
                            arr.push(byte[1]);
                        
                    }

                    else 
                        arr.push(this.convert(operands[1]));
                    
                }

                break;

            case "ADC":

                if (/R|M/.test(operands[2]) && /M|R/.test(operands[3])) {
                    arr.push((0b10000) + (d << 1) + w);

                    arr.push((mode << 6) + (this._regToId((/R/.test(operands[2])) ? operands[0] : operands[1]) << 3) + regmem);
                    arr = this._byteConcat(str, arr);
                }
                //Immediate to Register/Memory 
                else if (/M|R/.test(operands[2]) && /I/.test(operands[3])) {
                    opcode = (0b100000);
                    if (w == 0) { s = 0 };
                    arr.push((opcode << 2) + (s << 1) + w);
                    arr.push((mode << 6) + regmem);
                    arr = this._byteConcat(str, arr);

                    if (w === 1) {

                        let byte = this._splitNum(this.convert(operands[1]), this._getS(operands[1], 1));
                        arr.push(byte[0]);

                        if (byte.length === 2) 
                            arr.push(byte[1]);
                        
                    }

                    else 
                        arr.push(this.convert(operands[1]));
                    
                }

                break;

            case "AAA":
                arr.push(0b00110111);
                break;

            case "INC":
                arr.push((0b11111110) + w);
                arr.push((mode << 6) + regmem);
                break;

        case "SUB":

            if (/R|M/.test(operands[2]) && /M|R/.test(operands[3])) {

                arr.push((0b101000) + (d << 1) + w);

                arr.push((mode << 6) + (this._regToId((/R/.test(operands[2])) ? operands[0] : operands[1]) << 3) + regmem);
                arr = this._byteConcat(str, arr);
            }
            //Immediate to Register/Memory 
            else if (/M|R/.test(operands[2]) && /I/.test(operands[3])) {
                opcode = (0b100000);
                if (w == 0) { s = 0 };
                arr.push((opcode << 2) + (s << 1) + w);
                arr.push((mode << 6) + ((0b101) << 3) + regmem);
                arr = this._byteConcat(str, arr);
                if (w === 1) {
                    let byte = this._splitNum(this.convert(operands[1]), this._getS(operands[1], 1));
                    arr.push(byte[0]);
                    if (byte.length === 2) 
                        arr.push(byte[1]);
                    
                }

                else 
                    arr.push(this.convert(operands[1]));
                
            }

            break;

            case "SBB":
                //r/m to r/m
                if (/R|M/.test(operands[2]) && /M|R/.test(operands[3])) {
                    arr.push((0b11000) + (d << 1) + w);

                    arr.push((mode << 6) + (this._regToId((/R/.test(operands[2])) ? operands[0] : operands[1]) << 3) + regmem);
                    arr = this._byteConcat(str, arr);
                }

                //Immediate to Register/Memory 
                else if (/M|R/.test(operands[2]) && /I/.test(operands[3])) {
                    opcode = (0b100000);

                    if (w == 0)  
                        s = 0 ;

                    arr.push((opcode << 2) + (s << 1) + w);
                    arr.push((mode << 6) + ((0b011) << 3) + regmem);
                    arr = this._byteConcat(str, arr);

                    if (w === 1) {
                        let byte = this._splitNum(this.convert(operands[1]), this._getS(operands[1], 1));
                        arr.push(byte[0]);
                        if (byte.length === 2) 
                            arr.push(byte[1]);
                        
                    }
                    else 
                        arr.push(this.convert(operands[1]));
                    
                }

                break;

            case "DEC":
                arr.push((0b11111110) + w);
                arr.push((mode << 6) + (0b1000) + regmem);
                break;

            case "CMP":

                if (/R|M/.test(operands[2]) && /M|R/.test(operands[3])) {
                    arr.push((0b111000) + (d << 1) + w);

                    arr.push((mode << 6) + (this._regToId((/R/.test(operands[2])) ? operands[0] : operands[1]) << 3) + regmem);
                    arr = this._byteConcat(str, arr);
                }

                //Immediate to Register/Memory 
                else if (/M|R/.test(operands[2]) && /I/.test(operands[3])) {

                    opcode = (0b100000);
                    if (w == 0) { s = 0 };
                    arr.push((opcode << 2) + (s << 1) + w);
                    arr.push((mode << 6) + ((0b111) << 3) + regmem);
                    arr = this._byteConcat(str, arr);

                    if (w === 1) {

                        let byte = this._splitNum(this.convert(operands[1]), this._getS(operands[1], 1));
                        arr.push(byte[0]);

                        if (byte.length === 2) 
                            arr.push(byte[1]);
                        
                    }

                    else 
                        arr.push(this.convert(operands[1]));
                    
                }

                break;

            case "MUL":
                arr.push(0b11110110 + w);
                arr.push((mode << 6) + (0b100000) + regmem);

                if (/M/.test(operands[1])) 
                    arr = this._byteConcat(str, arr);
                
                break;

            case "IMUL":
                arr.push(0b11110110 + w);
                arr.push((mode << 6) + (0b101000) + regmem);
                if (/M/.test(operands[1])) 
                    arr = this._byteConcat(str, arr);
                
                break;

            case "DIV":
                arr.push(0b11110110 + w);
                arr.push((mode << 6) + (0b110000) + regmem);
                if (/M/.test(operands[1])) 
                    arr = this._byteConcat(str, arr);
                
                break;

            case "IDIV":
                arr.push((0b11110110) + w);
                arr.push((mode << 6) + (0b111000) + regmem);

                if (/M/.test(operands[1])) 
                    arr = this._byteConcat(str, arr);
                
                break;

            case "CBW":
                arr.push(0b10011000);
                break;

            case "CWD":
                arr.push(0b10011001);
                break;

            case "NOT":
                arr.push(0b11110110 + w);
                arr.push((mode << 6) + (0b010000) + regmem);

                if (/M/.test(operands[1])) 
                    arr = this._byteConcat(str, arr);
                
                break;

            case "SHL": case "SAL":
                arr.push((0b11010000) + (v << 1) + w);
                arr.push(((mode << 6)) + (0b100000) + regmem);

                if (/M/.test(operands[2])) 
                    arr = this._byteConcat(str, arr);
                
                break;

            case "SHR":

                arr.push((0b11010000) + (v << 1) + w);
                arr.push((mode << 6) + (0b101000) + regmem);
                if (/M/.test(operands[2])) 
                    arr = this._byteConcat(str, arr);
                

                break;

            case "SAR":

                arr.push((0b11010000) + (v << 1) + w);
                arr.push(((mode << 6)) + (0b111000) + regmem);
                if (/M/.test(operands[2])) 
                    arr = this._byteConcat(str, arr);
                

                break;

            case "ROL":

                arr.push((0b11010000) + (v << 1) + w);
                arr.push(((mode << 6)) + (0b000000) + regmem);
                if (/M/.test(operands[2])) 
                    arr = this._byteConcat(str, arr);
                
                break;

            case "ROR":

                arr.push((0b11010000) + (v << 1) + w);
                arr.push(((mode << 6)) + (0b001000) + regmem);

                if (/M/.test(operands[2])) 
                    arr = this._byteConcat(str, arr);
                
                break;

            case "RCL":

                arr.push((0b11010000) + (v << 1) + w);
                arr.push(((mode << 6)) + (0b010000) + regmem);

                if (/M/.test(operands[2])) 
                    arr = this._byteConcat(str, arr);
            
                break;

            case "RCR":
                arr.push((0b11010000) + (v << 1) + w);
                arr.push(((mode << 6)) + (0b011000) + regmem);

                if (/M/.test(operands[2])) 
                    arr = this._byteConcat(str, arr);
            
                break;

            case "AND":

                if (/R|M/.test(operands[2]) && /M|R/.test(operands[3])) {
                    arr.push((0b100000) + (d << 1) + w);

                    arr.push((mode << 6) + (this._regToId((/R/.test(operands[2])) ? operands[0] : operands[1]) << 3) + regmem);
                    arr = this._byteConcat(str, arr);
                }

                //Immediate to Register/Memory 
                else if (/M|R/.test(operands[2]) && /I/.test(operands[3])) {

                    opcode = (0b100000);
                    arr.push((opcode << 2) + w);
                    arr.push((mode << 6) + ((0b100) << 3) + regmem);
                    arr = this._byteConcat(str, arr);

                    if (w === 1) {
                        let byte = this._splitNum(this.convert(operands[1]), this._getS(operands[1], 1));
                        arr.push(byte[0]);
                        if (byte.length === 2) 
                            arr.push(byte[1]);
                        
                    }
                    else 
                        arr.push(this.convert(operands[1]));
                    
                }

                break;
            case "XOR":
                //Reg./Memory with Register to Either
                if (/R|M/.test(operands[2]) && /M|R/.test(operands[3])) {
                    arr.push((0b110000) + (d << 1) + w);

                    arr.push((mode << 6) + (this._regToId((/R/.test(operands[2])) ? operands[0] : operands[1]) << 3) + regmem);
                    arr = this._byteConcat(str, arr);
                }
                //Immediate to Register/Memory 
                else if (/M|R/.test(operands[2]) && /I/.test(operands[3])) {
                    opcode = (0b100000);
                    if (w == 0) { s = 0 };
                    arr.push((opcode << 2) + w);
                    arr.push((mode << 6) + ((0b110n) << 3) + regmem);
                    arr = this._byteConcat(str, arr);

                    if (w === 1) {
                        let byte = this._splitNum(this.convert(operands[1]), this._getS(operands[1], 1));
                        arr.push(byte[0]);
                        if (byte.length === 2) 
                            arr.push(byte[1]);
                        
                    }

                    else 
                        arr.push(this.convert(operands[1]));
                    
                }


                break;

            case "OR":
                //Reg./Memory with Register to Either
                if (/R|M/.test(operands[2]) && /M|R/.test(operands[3])) {

                    arr.push((0b1000) + (d << 1) + w);

                    arr.push((mode << 6) + (this._regToId((/R/.test(operands[2])) ? operands[0] : operands[1]) << 3) + regmem);
                    arr = this._byteConcat(str, arr);

                }

                //Immediate to Register/Memory 
                else if (/M|R/.test(operands[2]) && /I/.test(operands[3])) {

                    opcode = (0b100000);
                    if (w == 0) { s = 0 };
                    arr.push((opcode << 2) + w);
                    arr.push((mode << 6) + ((0b001) << 3) + regmem);
                    arr = this._byteConcat(str, arr);

                    if (w === 1) {
                        let byte = this._splitNum(this.convert(operands[1]), this._getS(operands[1], 1));
                        arr.push(byte[0]);

                        if (byte.length === 2) 
                            arr.push(byte[1]);
                        
                    }

                    else 
                        arr.push(this.convert(operands[1]));
                    
                }

                break;

            case "TEST":

                //Reg./Memory with Register to Either
                if (/R|M/.test(operands[2]) && /M|R/.test(operands[3])) {
                    arr.push((0b100) + w);

                    arr.push((mode << 6) + (this._regToId((/R/.test(operands[2])) ? operands[0] : operands[1]) << 3) + regmem);
                    arr = this._byteConcat(str, arr);
                }
                //Immediate to Register/Memory 
                else if (/M|R/.test(operands[2]) && /I/.test(operands[3])) {
                    opcode = (0b100000);
                    if (w == 0) { s = 0 };
                    arr.push((opcode << 2) + w);
                    arr.push((mode << 6) + regmem);
                    arr = this._byteConcat(str, arr);

                    if (w === 1) {
                        let byte = this._splitNum(this.convert(operands[1]), this._getS(operands[1], 1));
                        arr.push(byte[0]);
                        if (byte.length === 2) 
                            arr.push(byte[1]);
                        
                    }
                    else 
                        arr.push(this.convert(operands[1]));
                    
                }

                break;

            case "CALL":
                if (operands.length === 4) {
                    arr.push(0b11111111);
                    arr.push((mode << 6) + (0b011000) + regmem);
                    if (/M/.test(operands[1])) 
                        arr = this._byteConcat(str, arr);
                    
                }
                else {
                    if (!(/M|R/.test(operands[1])) && (/\:/.test(operands[0]))) {
                        arr.push(0b10011010);
                        var str = (operands[0]).match(/(?<=\:\s*)\w+/gi);
                        if (!this._getS(str, 1)) {
                            let byte = this._splitNum(this.convert(str), 0);

                            arr.push(byte[0]);
                            arr.push(byte[1]);
                        }
                        else {
                            arr.push(this.convert(str));
                            arr.push(0);
                        }
                        str = (operands[0]).match(/\w+(?=\s*:)/gi);
                        if (!this._getS(str, 1)) {
                            let byte = this._splitNum(this.convert(str));
                            arr.push(byte[0]);
                            arr.push(byte[1]);
                        }
                        else {
                            arr.push(this.convert(str));
                            arr.push(0);
                        }
                    }
                    else if (/I/.test(operands[1])) {
                        arr.push(0b11101000);
                        let byte = this._splitNum(this.convert(operands[0]), this._getS(operands[0], 1));

                        arr.push(byte[0]);
                        if (byte.length === 2) 
                            arr.push(byte[1]);

                         else 
                            arr.push(0);

                    }
                    else if (/R|M/.test(operands[1])) {
                        arr.push(0b11111111);
                        arr.push((mode << 6) + (0b010000) + regmem);
                        if (/M/.test(operands[1])) {
                            arr = this._byteConcat(str, arr);
                            if (this._getS(operands[1]), 0) 
                                arr.push(0);
                            
                        }
                    }

                }
                break;

            case "JMP":
                if (operands.length === 4) {
                    arr.push(0b11111111);
                    arr.push((mode << 6) + (0b101000) + regmem);
                    if (/M/.test(operands[1])) 
                        arr = this._byteConcat(str, arr);
                    
                }

                else {
                    if (!(/M|R/.test(operands[1])) && (/\:/.test(operands[0]))) {
                        arr.push(0b11101010);
                        var str = (operands[0]).match(/(?<=\:\s*)\w+/gi);
                        if (!this._getS(str, 1)) {
                            let byte = this._splitNum(this.convert(str), 0);

                            arr.push(byte[0]);
                            arr.push(byte[1]);
                        }
                        else {
                            arr.push(this.convert(str));
                            arr.push(0);
                        }
                        str = (operands[0]).match(/\w+(?=\s*:)/gi);

                        if (!this._getS(str, 1)) {
                            let byte = this._splitNum(this.convert(str));
                            arr.push(byte[0]);
                            arr.push(byte[1]);
                        }

                        else {
                            arr.push(this.convert(str));
                            arr.push(0);
                        }
                    }
                    else if (/I/.test(operands[1])) {

                        if (w === 1) {
                            arr.push(0b11101001);
                            let byte = this._splitNum(this.convert(operands[0]), this._getS(operands[0], 1));

                            arr.push(byte[0]);
                            if (byte.length === 2) 
                                arr.push(byte[1]);
                            
                        }
                        else {
                            arr.push(0b11101011);
                            arr.push(convert(operands[0]));
                        }
                    }
                    else if (/R|M/.test(operands[1])) {

                        arr.push(0b11111111);
                        arr.push((mode << 6) + (0b100000) + regmem);
                        if (/M/.test(operands[1])) {
                            arr = this._byteConcat(str, arr);
                            if (this._getS(operands[1]), 0) 
                                arr.push(0);
                            
                        }
                    }

                }
                break;

            case "RET": 
                arr.push(0b11000011); 
                break;

            case "REP": case "REPE":
                arr.push(0b11110011);
                switch (operands[0].toUpperCase()) {
                    case "MOVSB": arr.push(0b10100100); break;
                    case "MOVSW": arr.push(0b10100101); break;
                    case "CMPSB": arr.push(0b10100110); break;
                    case "CMPSW": arr.push(0b10100111); break;
                    case "SCASB": arr.push(0b10101110); break;
                    case "SCASW": arr.push(0b10101111); break;
                    case "LODSB": arr.push(0b10101100); break;
                    case "LODSW": arr.push(0b10101101); break;
                    case "STOSB": arr.push(0b10101010); break;
                    case "STOSW": arr.push(0b10101011); break;
                }
                break;

            case "REPNE":
                arr.push(0b11110010);
                switch (operands[0].toUpperCase()) {
                    case "MOVSB": arr.push(0b10100100); break;
                    case "MOVSW": arr.push(0b10100101); break;
                    case "CMPSB": arr.push(0b10100110); break;
                    case "CMPSW": arr.push(0b10100111); break;
                    case "SCASB": arr.push(0b10101110); break;
                    case "SCASW": arr.push(0b10101111); break;
                    case "LODSB": arr.push(0b10101100); break;
                    case "LODSW": arr.push(0b10101101); break;
                    case "STOSB": arr.push(0b10101010); break;
                    case "STOSW": arr.push(0b10101011); break;
                }
                break;

            case "MOVSB": arr.push(0b10100100); break;
            case "MOVSW": arr.push(0b10100101); break;
            case "CMPSB": arr.push(0b10100110); break;
            case "CMPSW": arr.push(0b10100111); break;
            case "SCASB": arr.push(0b10101110); break;
            case "SCASW": arr.push(0b10101111); break;
            case "LODSB": arr.push(0b10101100); break;
            case "LODSW": arr.push(0b10101101); break;
            case "STOSB": arr.push(0b10101010); break;
            case "STOSW": arr.push(0b10101011); break;

            case "JE": case "JZ":
                arr.push(0b01110100);
                break;
            case "JL": case "JNGE":
                arr.push(0b01111100);
                break;
            case "JLE": case "JNG":
                arr.push(0b01111110);
                break;
            case "JB": case "JNAE":
                arr.push(0b01110010);
                break;
            case "JBE": case "JNA":
                arr.push(0b01110110);
                break;
            case "JP": case "JPE":
                arr.push(0b01111010);
                break;
            case "JO":
                arr.push(0b01110000);
                break;
            case "JS":
                arr.push(0b01111000);
                break;
            case "JNE": case "JNZ":
                arr.push(0b01110101);
                break;
            case "JNL": case "JGE":
                arr.push(0b01111101);
                break;
            case "JNLE": case "JG":
                arr.push(0b01111111);
                break;
            case "JNB": case "JAE":
                arr.push(0b01110011);
                break;
            case "JNBE": case "JA":
                arr.push(0b01110111);
                break;
            case "JNP": case "JPO":
                arr.push(0b01111011);
                break;
            case "JNO":
                arr.push(0b01110001);
                break;
            case "JNS":
                arr.push(0b01111001);
                break;
            case "LOOP":
                arr.push(0b11100010);
                break;
            case "LOOPZ": case "LOOPE":
                arr.push(0b11100001);
                break;
            case "LOOPNZ": case "LOOPNE":
                arr.push(0b11100000);
                break;
            case "JCXZ":
                arr.push(0b11100011);
                break;
            case "INT":
                arr.push();
                break;
            case "CLC":
                arr.push(0b11111000);
                break;
            case "CMC":
                arr.push(0b11110101);
                break;
            case "STC":
                arr.push(0b11111001);
                break;
            case "CLD":
                arr.push(0b11111100);
                break;
            case "STD":
                arr.push(0b11111101);
                break;
            case "CLI":
                arr.push(0b11111010);
                break;
            case "STI":
                arr.push(0b11111011);
                break;
            case "HLT":
                arr.push(0b11110100);
                break;


        }

        return str + "      ;     " + arr;
    }



// ------------------------------- function define the zone (r/m) in op codes


//---------------------------------------------get mod of instruction ------------------------------------------------------    


    //convert a string number to number
    //convert a string number to number

    convertP(str) {

        if (/0x|0[A-F][A-Za-z0-9]*h|\d[A-Za-z0-9]*h/i.test(str)) {

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
        else 
            return parseInt(str, 10);
        
    }
    convert(str) {

        if (/\-/.test(str)) {
            var str3 = str.replace(/\-/, "");
            var binary = this.convertP(str3);

            if (binary <= 128) 
                return ((~binary) & 0xff) + 1;
            
            else 
                return ((~binary) & 0xffff) + 1;
            
        } 
            else return this.convertP(str);
    }

// -----------function return register id by passing it name as a parameter----------------------

    _regToId(regname) {
        switch (regname.toLowerCase()) {
            case 'al':
            case 'ax':
            case 'es':
                return 0;

            case 'cl':
            case 'cx':
            case 'cs':
                return 1;

            case 'dl':
            case 'dx':
            case 'ss':

                return 2;

            case 'bl':
            case 'bx':
            case 'ds':
                return 3;

            case 'sp':
            case 'ah':
                return 4;
            case 'bp':
            case 'ch':
                return 5;

            case 'si':
            case 'dh':
                return 6;

            case 'di':
            case 'bh':
                return 7;

        }
    }
}
//var inst = "not";
//let testing = execute;
//console.log(execute("push [bp]"));
//case mov
//console.log(testing(inst + " " + "DX"));
//console.log(testing(inst + " " + "Ds"));
//console.log(testing(inst + " " + "[bx]"));
//console.log(testing(inst + " " + "[100H+di]"));
//console.log(testing(inst + " " + "[bp]"));
//console.log(testing(inst + " " + "es:[bx-300]"));
//console.log(testing(inst + " " + "[5h]"));
//console.log(testing(inst + " " + "[0affh]" + ",dx"));
/*console.log(testing(inst+" "+"cl"+",bl"));
console.log(testing(inst+" "+"dx"+",bx"));
console.log(testing(inst+" "+"bx"+",01ffh"));
console.log(testing(inst+" "+"bh"+",5h"));
console.log(testing(inst+" "+"[bx]"+",1001b"));
console.log(testing(inst+" "+"[100H+di]"+",5b"));
console.log(testing(inst+" "+"[bp]"+",-23"));
console.log(testing(inst+" "+"es:[bx-300]"+"   ,0ffh"));
console.log(testing(inst+" "+"[5h]"+",0ffh"));
console.log(testing(inst+" "+"dx"+",100:-150"));
console.log(testing(inst+" "+"[bx]"+",bx"));
console.log(testing(inst+" "+"[100H+di]"+",bh"));
console.log(testing(inst+" "+"[bp]"+",dx"));
console.log(testing(inst+" "+"es:[bx-300]"+"   ,ds"));
console.log(testing(inst+" "+"[0affh]"+",cs"));
console.log(testing(inst+" "+"[5h+bx]"+",cs"));*/
//console.log(testing(inst + " " + "bx" + ",[100H+di]"));
//console.log(testing(inst + " " + "dx" + ",[bp]"));
//console.log(testing(inst + " " + "bx" + ",es:[bx-300]"));
//console.log(testing(inst + " " + "cx" + ",[100H+di]"));
//console.log(testing(inst + " " + "cx" + ",[100H+di+bx]"));
//console.log(testing(inst + " " + "dx" + ",[bp]"));
//console.log(testing(inst + " " + "cx" + ",es:[bx-300]"));
//console.log(testing(inst + " " + "dx" + ",[bx-300]"));

// creating a new object for testing 
var execution = new Encode(); 
console.log(execution.execute("MOV AX, BX"));