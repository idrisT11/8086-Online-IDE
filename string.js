function getOps(str){//get operands
    let str2=str.replace(/\w+(?=\s)/,"").replace(/\s/g,"");
    return (/,/.test(str2))?str2.split(','):str2.split();
  }
function convert(str)
{
    if(/^0x|h$/i.test(str))
    {
        str.replace(/^0x|h$/i,"").toUpperCase;
        var bin=0b0;
        for(let i=0;i<str.length;i++)
        {
            let x=str.charCodeAt(i);
            if(x>64)
           bin+=(x-55).toString(2);
           else {
           bin=(x-48).toString(2); 
           }
           bin=bin<<4
        }
        return bin;
    }
}
function toBcode(str)
{
var arr=[];
let regex=/(?<=\s*)\S+/;

let instruction=str.match(regex);//match instruction
switch(instruction.toUpperCase())
{
  case "MOV":
   break;
  case "PUSH":
   break;
  case "POP" :
   break;
    case "XCHG" :
    break;
    case "LEA" :
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
    break;
    case "ADC":
    break;
    case "AAA" :
    arr.push(0b00110111);
    break;             
    case "INC": 
    break;
    case "SUB": 
    break;
    case "SSB": 
    break;
    case "DEC": 
    break;
    case "CMP":
    break;
    case "MUL": 
    break;
    case "IMUL": 
    break;
    case "CBW": 
    arr.push(0b10011000);
    break;
    case"CWD":
    arr.push(0b10011001);
    break;
    case "NOT" :break; 
    case "SHL" :break;
    case "SHR" :break;
    case "SAR" :break;
    case "ROL" :break;
    case "ROR" :break;
    case "RCL" :break; 
    case "RCR" :break;
    case "AND" :break;
    case "XOR" :break;
    case "OR" :break;
    case "TEST": break;
    case "CALL" :break;
    case "JUMP" :break;
    case "RET" :break;
    case "REP" :break; 
    case "MOVS": break; 
    case "CMPS" :break; 
    case "SCAS" :break;
    case "LODS" :break;
    case "STOS" :break;
    case "JE": case"JZ": 
    arr.push(0b01110100);
    break;
    case "JL" :case "JNGE": 
    arr.push(0b01111100);
    break;
    case"JLE" :case "JNG" :
    arr.push(0b01111110);
    break; 
    case"JB" :case "JNAE" :
    arr.push(0b01110010);
    break; 
    case"JBE": case "JNA": 
    arr.push(0b01110110);
    break; 
    case "JP" :case "JPE":
    arr.push(0b01111010); 
    break;
    case "JO": 
    arr.push(0b01110000);
    break; 
    case "JS":
    arr.push(0b01111000);
    break; 
    case "JNE" :case "JNZ":
    arr.push(0b01110101); 
    break; 
    case "JNL" :case "JGE":
    arr.push(0b01111101); 
    break; 
    case "JNLE" :case "JG":
    arr.push(0b01111111);
    break; 
    case "JNB": case "JAE":
    arr.push(0b01110011);
    break; 
    case "JNBE":case "JA":
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
    case "LOOPZ":case "LOOPE":
    arr.push(0b11100001);
    break; 
    case "LOOPNZ":case "LOOPNE":
    arr.push(0b11100000);
    break; 
    case "JCXZ" :
    arr.push(0b11100011);
    break; 
    case "INT" :
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
function convert(str)
  {
      if(/^0x|h$/i.test(str))
      {
          var str2=str.replace(/^0x|h$/i,"").toUpperCase();
          return parseInt(str2,16);
      }
      else if(/^0b/i.test(str2))
      {
        var str2=str.replace(/^0b/i,"").toUpperCase();
          return parseInt(str2,2);
      }
      else if(/^0o/i.test(str2))
      {
        var str2=str.replace(/^0o/i,"").toUpperCase();
          return parseInt(str2,8);
      }
      else{
          return parseInt(str2,10)
      }     
  }

}

function getD(instruction) {

    var operands = getOps(instruction);

    // from reg to memory 
    if (operands[0].includes("["))

        return 0; 
    
    // memory to reg 
    else if (operands[0].includes("[") == false) 
        
        return 1; 

    
    // other modes like immediate to memory 
    return -1 ;


}

function getW(instruction) {

    var wordRegisters = ['AX', 'BX', 'CX', 'DX', 'CS', 'DS', 'ES', 'SS', 'DI', 'SI', 'SP', 'BP', 'IP']; 
        byteRegisters = ['AH', 'AL', 'BH', 'BL', 'CH', 'CL', 'DL', 'DH'];
        opcodes = getOps(instruction);

    // register to memory
    if (getD(instruction) == 0) {
        
        // word instruction
        if (wordRegisters.includes(opcodes[1])) 

            return 1; 

        // byte instruction
        else if (byteRegisters.includes(opcodes[1])) 

            return 0; 

        //just for debugging
        return -1; 
    }

    // memory to register 
    if (getD(instruction) == 1) {

        if (wordRegisters.includes(opcodes[0])) 

            return 1;

        else if (byteRegisters.includes(opcodes[0]))

            return 0; 

        return -1;

    }


}


