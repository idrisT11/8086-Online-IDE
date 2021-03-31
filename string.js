
  "use strict";
  var wordRegisters = ['AX', 'BX', 'CX', 'DX', 'CS', 'DS', 'ES', 'SS', 'DI', 'SI', 'SP', 'BP', 'IP']; 
  var byteRegisters = ['AH', 'AL', 'BH', 'BL', 'CH', 'CL', 'DL', 'DH'];
  var segmentRegisters = ['CS', 'DS', 'ES', 'SS'];
  var justNumbers=false;
//get operands and its types exp: ["ax",'[1254+bx]',''Rx","M"] or ["al",0x12FF,''RL","I"]]
function byteConcat(str,arr) {

    
    let disp=splitNum(getNum(str)); 
    if (disp!=0){
      return arr.concat(disp);
    }else return arr;
}
function getOps(str){
  
let operands=[];
  let str2=str.replace(/\w+(?=\s)/,"").replace(/\s/g,"");
  operands=(/,/.test(str2))?str2.split(','):str2.split();
  if (operands[0]!=""){
    let i=0;
    let opsnumber=operands.length;
    for(i; i<opsnumber;i++){
      if (/\[.*\]/.test(operands[i])) {operands.push('M')}
      else if (segmentRegisters.includes(operands[i].toUpperCase())){operands.push('RS')}
      else if (wordRegisters.includes(operands[i].toUpperCase())) { operands.push('RX')}
      else if (byteRegisters.includes(operands[i].toUpperCase())){operands.push('RL')}
      else (operands.push('I'))
      }
    }
    return operands.map(x=>(x.toUpperCase()));
  }

function encodeMov(opcode, D, W) {
  return (opcode<<2 )+ (D << 1) + W;
}
function getNum(str)//turn a string number BETWEEN BRACKETS to number
{
  var x=str.match(/(?<=(\s|\+|\[))(0x\w+|0bh|\w+h|\d+|0b\d+)(?=(\s|\+|\]))/gi);
  if (x==undefined) {return 0}
  return convert(x[0]);
}

function splitNum(num){
  var disp=[];
    if(num>255)
   {
       disp.push(num & 0b0000000011111111);
       num>>=8;
     disp.push(num );
   }
   else{
       disp.push(num);
   }
   return disp;
}
function getV(operands)
{
    if(/cl/i.test(operands[1]))
    {
        return 1;
    }else return 0;
}

function toBcode(str) // original function to be class later 
{
var arr=[];

let regex=/(?<=\s*)\S+/;
var operands = getOps(str);
let instruction = str.match(regex);
var w = getW(operands),
v=getV(operands),
opcode=0,
d=getD(operands),
mode = getMod(operands),
result = 0,
regmem=regMem(operands);
if(justNumbers) mode=0;
console.log("wwwwwwwww "+ w);
//match instruction
switch(instruction[0].toUpperCase())
{
case "MOV":

  // Register/Memory to/from Register
  if (/R|M/.test(operands[2])  && /R|M/.test(operands[3])) {

      opcode = 0b100010;
      // register to memory
      if (/M/.test(operands[2]) && /R/.test(operands[3])) {
          arr.push(encodeMov(opcode, 0, w));
          result = (mode << 6) + (regToId(operands[1]) << 3) +  regmem;
          arr.push(result);
       

      }
      // memory to register+register to register 
      else if (/R/.test(operands[2])) {

          arr.push(encodeMov(opcode, 1, w ));
          console.log(opcode)
          result = (mode << 6) + ((regToId(operands[0])) << 3) +  regmem;
          arr.push(result);
         
      }
      console.log("before" +arr);
      arr=byteConcat(str,arr);
      console.log("sfter" +arr);
       // Immediate to Register/Memory
  } else if(/M|R/.test(operands[2])  && /I/.test(operands[3])) 
  {
      arr.push(encodeMov(0b110001 , 1, w));
      arr.push((mode<<6)+regmem);
      arr=byteConcat(str,arr);  
      if(w===1){
          let byte=splitNum(operands[1]);
          arr.push(byte[0]);
          arr.push(byte[1]);
         }
         else {
             arr.push(operands[1]);
         }
  }
  //segemnt register to memory/register
  else if(/M|R/.test(operands[2])  && /RS/.test(operands[3]))
  {
      arr.push(0b10001100);
      arr.push((mode<<6)+(regToId(operands[0])<<3)+regmem);
      arr=byteConcat(str,arr);  
  }
  // memory/register to segment register
  else if(/RS/.test(operands[2])  && /R|M/.test(operands[3]))
  {
      arr.push(0b10001110);
      arr.push((mode<<6)+(regToId(operands[0])<<3)+regmem);
      arr=byteConcat(str,arr);  
  }
//concatenation of the bytes in an array deplacement           
  
  break;

  case "PUSH":
      if(/RS/.test(operands[1]))
      {
          arr.push((((regToId(operands[0]))<<3)+0b110));
      }
      else if(/R|M/.test(operands[1]))
      {
          arr.push(0b11111111);
          arr.push(((getMod(operands))<<6)+0b110000+regmem);
          console.log("hello" +regmem);
          arr=byteConcat(str,arr);  
      }
  break;
case "POP" :
 break;
  case "XCHG" :
      arr.push(0b10000110+getW(operands));
      arr.push((mode<<6)+(regToId(operands[0]))<<2+regmem);
      arr=byteConcat(str,arr);       
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
      
    //Reg./Memory with Register to Either
    if (/R|M/.test(operands[2]) &&  /M|R/.test(operands[3])) {
          console.log("this is  d  "+( d << 1) +"  d   "+ w);
            console.log(( 1 << 1) + 1);
            arr.push( ( 1 << 1) + 1); 
            arr.push((mode << 6) +regToId((/R/.test(operands[2]))?operands[0]:operands[1])+ regmem);
                arr=byteConcat(str,arr);
            

    }
    //Immediate to Register/Memory 
    else if (/I|M/.test(operands[2]) && /I|M/.test(operands[3])) {

        opcode = 0b100000;
        let s=(convert((/I/.test(operands[2]))?operands[0]:operands[1])<0)?1:0;
        arr.push((opcode<<2)+(s<<1)+w);
        arr.push((mode<<6)+regmem);
        arr=byteConcat(str,arr);
        arr.push(convert((/I/.test(operands[2]))?operands[0]:operands[1]) & 0x0ff);
        if(w===1)
        {
            arr.push(convert((/I/.test(operands[2]))?operands[0]:operands[1])>>8);
        }
    }
  break;
  case "ADC":
  break;
  case "AAA" :
  arr.push(0b00110111);
  break;             
  case "INC": 
  arr.push(0b11111110+w);
  arr.push((mode<<6)+regmem);
  break;
  case "SUB": 
    //Reg./Memory with Register to Either
    if (/R|M/.test(operands[2]) &&  /M|R/.test(operands[3])) {
          arr.push( ( 0b01010<< 2) + (getD(operands)<<1)+w); 
          arr.push((mode << 6) +regToId((/R/.test(operands[2]))?operands[0]:operands[1])+ regmem);
              arr=byteConcat(str,arr);
  }
  //Immediate to Register/Memory 
  else if (/I|M/.test(operands[2]) && /I|M/.test(operands[3])) {
      opcode = 0b100000;
      let s=(convert((/I/.test(operands[2]))?operands[0]:operands[1])<0)?1:0;
      arr.push((opcode<<2)+(s<<1)+w);
      arr.push((mode<<6)+regmem);
      arr=byteConcat(str,arr);
      arr.push(convert((/I/.test(operands[2]))?operands[0]:operands[1]) & 0x0ff);
      if(w===1)
      {
          arr.push(convert((/I/.test(operands[2]))?operands[0]:operands[1])>>8);
      }
  }
  break;
  case "SSB": 
  //r/m to r/m
  if (/R|M/.test(operands[2]) &&  /M|R/.test(operands[3])) {
    arr.push( ( 0b000110<< 2) + (getD(operands)<<1)+w); 
    arr.push((mode << 6) +regToId((/R/.test(operands[2]))?operands[0]:operands[1])+ regmem);
        arr=byteConcat(str,arr);
}
//Immediate to Register/Memory 
else if (/I|M/.test(operands[2]) && /I|M/.test(operands[3])) {
opcode = 0b100000;
let s=(convert((/I/.test(operands[2]))?operands[0]:operands[1])<0)?1:0;
arr.push((opcode<<2)+(s<<1)+w);
arr.push((mode<<6)+regmem);
arr=byteConcat(str,arr);
arr.push(convert((/I/.test(operands[2]))?operands[0]:operands[1]) & 0x0ff);
if(w===1)
{
    arr.push(convert((/I/.test(operands[2]))?operands[0]:operands[1])>>8);
}
}
  break;
  case "DEC": 
  arr.push(0b11111110+w);
  arr.push((mode<<6)+(0b1000)+regmem);
  break;
  case "CMP":
        //Reg./Memory with Register to Either
    if (/R|M/.test(operands[2]) &&  /M|R/.test(operands[3])) {
        arr.push( ( 0b01110<< 2) + (getD(operands)<<1)+w); 
        arr.push((mode << 6) +regToId((/R/.test(operands[2]))?operands[0]:operands[1])+ regmem);
            arr=byteConcat(str,arr);
}
//Immediate to Register/Memory 
else if (/I|M/.test(operands[2]) && /I|M/.test(operands[3])) {
    opcode = 0b100000;
    let s=(convert((/I/.test(operands[2]))?operands[0]:operands[1])<0)?1:0;
    arr.push((opcode<<2)+(s<<1)+w);
    arr.push((mode<<6)+regmem);
    arr=byteConcat(str,arr);
    arr.push(convert((/I/.test(operands[2]))?operands[0]:operands[1]) & 0x0ff);
    if(w===1)
    {
        arr.push(convert((/I/.test(operands[2]))?operands[0]:operands[1])>>8);
    }
}
  break;
  case "MUL": 
  arr.push(0b11110110+w);
  arr.push((mode)<<6+0b100000+regmem);
  if(/M/.operands[1])
  {
      arr=byteConcat(str,arr);
  }
  break;
  case "IMUL": 
  arr.push(0b11110110+w);
  arr.push((mode)<<6+0b101000+regmem);
  if(/M/.operands[1])
  {
      arr=byteConcat(str,arr);
  }
  break;
  case "DIV":
    arr.push(0b11110110+w);
    arr.push((mode)<<6+0b110000+regmem);
    if(/M/.operands[1])
    {
        arr=byteConcat(str,arr);
    }   
   break;
   case "IDIV":
        arr.push(0b11110110+w);
        arr.push((mode)<<6+0b111000+regmem);
        if(/M/.operands[1])
        {
            arr=byteConcat(str,arr);
        }  
          break;
  case "CBW": 
  arr.push(0b10011000);
  break;
  case"CWD":
  arr.push(0b10011001);
  break;
  case "NOT" : 
  arr.push(0b11110110+w);
  arr.push((mode)<<6+0b010000+regmem);
  if(/M/.operands[1])
  {
      arr=byteConcat(str,arr);
  }  
  break;
  case "SHL" :case "SAL" :
    arr.push(0b11010000+v+w);
    arr.push((mode)<<6+0b100000+regmem);
    if(/M/.test(operands[2]))
    {
        arr=byteConcat(str,arr);
    }
    if(v===0)
    {
        arr.push(convert(operands[0]));
    }   
      break;
  case "SHR" :
    arr.push(0b11010000+v+w);
    arr.push((mode)<<6+0b101000+regmem);
    if(/M/.test(operands[2]))
    {
        arr=byteConcat(str,arr);
    }
    if(v===0)
    {
        arr.push(convert(operands[0]));
    }   
      break;
  case "SAR" :
    arr.push(0b11010000+v+w);
    arr.push((mode)<<6+0b111000+regmem);
    if(/M/.test(operands[2]))
    {
        arr=byteConcat(str,arr);
    }
    if(v===0)
    {
        arr.push(convert(operands[0]));
    }   
      break;
  case "ROL" :
    arr.push(0b11010000+v+w);
    arr.push((mode)<<6+0b000000+regmem);
    if(/M/.test(operands[2]))
    {
        arr=byteConcat(str,arr);
    }
    if(v===0)
    {
        arr.push(convert(operands[0]));
    }   
      break;
  case "ROR" :
    arr.push(0b11010000+v+w);
    arr.push((mode)<<6+0b001000+regmem);
    if(/M/.test(operands[2]))
    {
        arr=byteConcat(str,arr);
    }
    if(v===0)
    {
        arr.push(convert(operands[0]));
    }   
      break;
  case "RCL" :
    arr.push(0b11010000+v+w);
    arr.push((mode)<<6+0b010000+regmem);
    if(/M/.test(operands[2]))
    {
        arr=byteConcat(str,arr);
    }
    if(v===0)
    {
        arr.push(convert(operands[0]));
    }   
      break; 
  case "RCR" :
    arr.push(0b11010000+v+w);
    arr.push((mode)<<6+0b011000+regmem);
    if(/M/.test(operands[2]))
    {
        arr=byteConcat(str,arr);
    }
    if(v===0)
    {
        arr.push(convert(operands[0]));
    }   
      break;
  case "AND" :
          //Reg./Memory with Register to Either
      if (/R|M/.test(operands[2]) &&  /M|R/.test(operands[3])) {
          arr.push( ( 0b01000<< 2) + (getD(operands)<<1)+w); 
          arr.push((mode << 6) +regToId((/R/.test(operands[2]))?operands[0]:operands[1])+ regmem);
              arr=byteConcat(str,arr);
  }
  //Immediate to Register/Memory 
  else if (/I|M/.test(operands[2]) && /I|M/.test(operands[3])) {
      opcode = 0b10000000;
      arr.push(opcode+w);
      arr.push((mode<<6)+0b100000+regmem);
      arr=byteConcat(str,arr);
      arr.push(convert((/I/.test(operands[2]))?operands[0]:operands[1]) & 0x0ff);
      if(w===1)
      {
          arr.push(convert((/I/.test(operands[2]))?operands[0]:operands[1])>>8);
      }
  }
      break;
  case "XOR" :
       //Reg./Memory with Register to Either
       if (/R|M/.test(operands[2]) &&  /M|R/.test(operands[3])) {
        arr.push( ( 0b0110000) + (getD(operands)<<1)+w); 
        arr.push((mode << 6) +regToId((/R/.test(operands[2]))?operands[0]:operands[1])+ regmem);
            arr=byteConcat(str,arr);
}
//Immediate to Register/Memory 
else if (/I|M/.test(operands[2]) && /I|M/.test(operands[3])) {
    opcode = 0b10000000;
    arr.push(opcode+w);
    arr.push((mode<<6)+0b110000+regmem);
    arr=byteConcat(str,arr);
    arr.push(convert((/I/.test(operands[2]))?operands[0]:operands[1]) & 0x0ff);
    if(w===1)
    {
        arr.push(convert((/I/.test(operands[2]))?operands[0]:operands[1])>>8);
    }
}
    
      break;
  case "OR" :
       //Reg./Memory with Register to Either
       if (/R|M/.test(operands[2]) &&  /M|R/.test(operands[3])) {
        arr.push( ( 0b010<< 2) + (getD(operands)<<1)+w); 
        arr.push((mode << 6) +regToId((/R/.test(operands[2]))?operands[0]:operands[1])+ regmem);
            arr=byteConcat(str,arr);
}
//Immediate to Register/Memory 
else if (/I|M/.test(operands[2]) && /I|M/.test(operands[3])) {
    opcode = 0b10000000;
    arr.push(opcode+w);
    arr.push((mode<<6)+0b001000+regmem);
    arr=byteConcat(str,arr);
    arr.push(convert((/I/.test(operands[2]))?operands[0]:operands[1]) & 0x0ff);
    if(w===1)
    {
        arr.push(convert((/I/.test(operands[2]))?operands[0]:operands[1])>>8);
    }
}
      break;
  case "TEST": 
         //Reg./Memory with Register to Either
         if (/R|M/.test(operands[2]) &&  /M|R/.test(operands[3])) {
            arr.push( 0b10000100+w); 
            arr.push((mode << 6) +regToId((/R/.test(operands[2]))?operands[0]:operands[1])+ regmem);
                arr=byteConcat(str,arr);
    }
    //Immediate to Register/Memory 
    else if (/I|M/.test(operands[2]) && /I|M/.test(operands[3])) {
        opcode = 0b10000000;
        arr.push(opcode+w);
        arr.push((mode<<6)+regmem);
        arr=byteConcat(str,arr);
        arr.push(convert((/I/.test(operands[2]))?operands[0]:operands[1]) & 0x0ff);
        if(w===1)
        {
            arr.push(convert((/I/.test(operands[2]))?operands[0]:operands[1])>>8);
        }
    }
  break;
  case "CALL" :break;
  case "JUMP" :break;
  case "RET" :break;
  case "REP" :
    
    let z = 0; 
    opcode = 0b11110010; 
    arr.push(opcode + z); 

    break; 

  case "MOVS": 

    opcode = 0b10100100; 
    arr.push(opcode + w);

    break; 

  case "CMPS" :
    
    opcode = 0b10100110; 
    arr.push(opcode + w);

    break; 

  case "SCAS" :
    
    opcode = 0b10101110; 
    arr.push(opcode + w);
    break;

  case "LODS" :
    
    opcode = 0b10101100; 
    arr.push(opcode + w);

    break;

  case "STOS" :
    opcode = 0b10101010;
    arr.push(opcode + w);
    break;

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

  console.log(arr);
}
//get value of d
function getD(operands) {

    // from reg to memory 
    if (/M/.test(operands[0]) && /R/.test(operands[1]))
  
        return 0; 
    
    // memory to reg 
    else if (/M/.test(operands[1]) && /R/.test(operands[1]) ) 
        
        return 1; 
  }
//get value of w
function getW(operands) {

  // register to memory
  if (getD(operands) == 0) {
      
      // word instruction
      if (wordRegisters.includes(operands[1]))

          return 1; 

      // byte instruction
      else if (byteRegisters.includes(operands[1])) 

          return 0;  
  }

  // memory to register 
  if (getD(operands) == 1) {

      if (wordRegisters.includes(operands[0])) 

          return 1;

      else if (byteRegisters.includes(operands[0]))

          return 0; 


  }

  // register to register
  if (getD(operands) == -1) {

      if (wordRegisters.includes(operands[0]) && wordRegisters.includes(operands[1]))

          return 1;

      else if (byteRegisters.includes(operands[0]) && byteRegisters.includes(operands[1]))

          return 0;

  }

 let  imOperand = convert(operands[1]);

  // immediate to memory
  if (operands[0].includes("[") && getD(operands) == -1) {

      // word instruction
      if (imOperand > 255 || operands[0].includes("W"))  
          return 1; 
      
      // byte instruction
      return 0;
  }

  // immediate to register
  if (imOperand > 255) 

      return 1;

  else if (imOperand <= 255)
      
      return 0;
}

// ------------------------------- function define the zone (r/m) in op codes

function regMem(ops){
    justNumbers=false;
  if (getMod(ops)==3){
      return (ops.length==4)?regToId(ops[1]):regToId(ops[0])}
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
   else{justNumbers=true;return 0b110;}
  }
  }
//---------------------------------------------get mod of instruction ------------------------------------------------------    

function getMod(arr){
  if( arr[0]!=""){
              var num=0;
              if(arr.length===2){     //if there's one operand
              if(/R/.test(arr[1]))//if it's a register
                  {
                      return 0b11;
                  }
              else if(arr[1]==="M")
                  {
                    if(!/\d/.test(arr[0]))
                    {
                      return 0;
                    }else{
                   num=getNum(arr[0])
                          if(num===0){return 0;}
                          else if(num>255){return 0b10;}
                          else{return 1;}}
              }}
              else{
                  if(/R/.test(arr[2]) && /R/.test(arr[3]) )
                  {return 0b11;}
                  else  {
                      var z=(arr[2]==="M")?0:1;
                       if(!/\d/.test(arr[z]))
                    {
                      return 0;
                    }else{
                      num=getNum(arr[z])
                              if( num===0){ return 0; }
                              else if(num>255){ return 0b10; }
                              else{ return 1; }}
                                     
                  }
              }
  }
  }
  //convert a string number to number
  function convertP(str)
  {
  if(/^0x|0[A-D]h|\w+h$/i.test(str))
  {
      var str2=str.replace(/^0x|h$/i,"").toUpperCase();
      return parseInt(str2,16);
  }
  else if(/^0b/i.test(str))
  {
    var str2=str.replace(/^0b/i,""); 
      return parseInt(str2,2);
  }
  else if(/^0o/i.test(str))
  {
    var str2=str.replace(/^0o/i,"").toUpperCase();
      return parseInt(str2,8);
  }
  else{
      return parseInt(str,10);
  }}
  function convert(str)
  {
      if(/\-/.test(str)){
      var str2=str.replace(/\-/,""); 
      return (convertP(str2)>128)?65535-convertP(str2):convertP(str2);
  }else{return convertP(str);}}

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
var ops=getOps("push ax");
