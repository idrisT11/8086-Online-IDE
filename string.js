"use strict";
    var wordRegisters = ['AX', 'BX', 'CX', 'DX', 'CS', 'DS', 'ES', 'SS', 'DI', 'SI', 'SP', 'BP', 'IP']; 
    var byteRegisters = ['AH', 'AL', 'BH', 'BL', 'CH', 'CL', 'DL', 'DH'];
    var segmentRegisters = ['CS', 'DS', 'ES', 'SS'];
 //get operands and its types exp: ["ax",'[1254+bx]',''Rx","M"] or ["al",0x12FF,''RL","I"]]
function getOps(str){
  let operands=[];
    let str2=str.replace(/\w+(?=\s)/,"").replace(/\s/g,"");
    operands=(/,/.test(str2))?str2.split(','):str2.split();
    if (operands[0]!=""){
      let i=0;
      let opsnumber=operands.length;
      console.log("this a test "+operands[0].toUpperCase);
      for(i; i<opsnumber;i++){
        if (/\[.*\]/.test(operands[i])) {operands.push('M')}
        else if (segmentRegisters.includes(operands[i].toUpperCase())){operands.push('RS')}
        else if (wordRegisters.includes(operands[i].toUpperCase())) { operands.push('RX')}
        else if (byteRegisters.includes(operands[i].toUpperCase())){operands.push('Rl')}
        else (operands.push('I'))
        }
      }
      return operands
    }
function toBcode(str) // original functio to be class later 
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

}}
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
          return parseInt(str,10)
      }     
  }

function getD(operands) {

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

// ------------------------------- function define the zone (r/m) in op codes

function regMem(ops){
    if (getMod(ops)==3){
        return regToId(ops[1]);}
    else{
    let i;
    (/\[/.test(ops[0]))?i=0:/\[/.test(ops[1])?i=1:i=-1;
     if (/(bx|si)+.*(bx|si)/i.test(ops[i])){return 0 }
     else if (/(bx|di)+.*(bx|di)/i.test(ops[i])){return 1 }
     else if (/(bp|si)+.*(bp|si)/i.test(ops[i])){return 2 }
     else if (/(bp|di)+.*(bp|di)/i.test(ops[i])){return 3 }
     else if (/si/i.test(ops[i])){return 4 }
     else if (/di/i.test(ops[i])){return 5 }
     else if (/bp/i.test(ops[i])){return 6 }
     else if (/bx/i.test(ops[i])){return 7 }
    }
    }
//---------------------------------------------get mod of instruction ------------------------------------------------------    

function getMod(arr){
  if( arr[0]!=""){
      if(arr.length===2){     //if there's one operand
      if(/R/.test(arr[1]))//if it's a register
          {
              return 0b11;
          }
      else if(arr[1]==="M")
          {
          
              var array=arr[0].slice(1,arr[0].length-1).split("+");//turn string to table of elements ex[ax,1234,bx]
              
                   for(var i=0;/[A-D][XHL]|[ECSD][S]|[BSD][PSI]]/.test(array[i]) && i<array.length;i++){}//decouvrer lindice de la partie numeric
                   console.log("this is the first case i"+i);
                   if(i<arr.length){
                   if(convert(array[i])===0){
                      return 0;
                  }
                  else if(convert(array[i])>255){
                      return 0b10;
                  }
                  else{
                      return 1;
                  }
                  } else {
                   return 0;
               }
          }              
      }
      else{
          if(/R/.test(arr[2]) && /R/.test(arr[3]) )
          {
              return 0b11;
          }
          else  {
              var z=0;
              (arr[2]==="M")?z=0:z=1;
              var array=arr[z].slice(1,arr[0].length-1).split("+");//turn string to table of elements ex[ax,1234,bx]
              for(var i=0;/[A-D][XHL]|[ECSD][S]|[BSD][PSI]]/i.test(array[i]) && i<array.length;i++){}//decouvrer lindice de la partie numeric
              console.log("this is the second case  i "+i);
              console.log(array[0]);
              if(i<arr.length){
                        if(convert(array[i])===0){
                          return 0;
                              }
                        else if(convert(array[i])>255){
                                  return 0b10;
                              }
                        else{
                                  return 1;
                              }
               }
                else {
                    return 0;
                }  

          }
      }
  }
  return -1;
  }
// -----------function return register id by passing it name as a parameter----------------------

function regToId(regname){
    switch(regname.toLowerCase()){
        case 'al':
        case 'ax':
        case 'es':
            return 0;
            break;
        case 'cl':
        case 'cx':
        case 'cs':
            return 1;
            break;
        case 'dl':
        case 'dx':
        case 'ss':
        
            return 2;
            break;
        case 'bl':
        case 'bx':
        case 'ds':
            return 3;
            break;
        case 'sp':
        case 'ah':
            return 4;
            break;
        case 'bp':
        case 'ch':
            return 5;
            break;
        case 'si':
        case 'dh':
            return 6;
            break;
           case 'di':
        case 'bh':
            return 7;
            break;
    }
}
