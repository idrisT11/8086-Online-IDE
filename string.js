"use strict";
var wordRegisters = ['AX', 'BX', 'CX', 'DX', 'CS', 'DS', 'ES', 'SS', 'DI', 'SI', 'SP', 'BP', 'IP']; 
var byteRegisters = ['AH', 'AL', 'BH', 'BL', 'CH', 'CL', 'DL', 'DH'];
var segmentRegisters = ['CS', 'DS', 'ES', 'SS'];
var justNumbers=false;
var bpmod=false;
function segSepcification(operands,arr){
  var x=0;
  if  (operands.length===4){
   x=/M/.test(operands[2])?0:(/M/.test(operands[3])?1:-1);
  }else  {x=/M/.test(operands[1])?0:-1;}
  if (x!=-1 && /S\s*:/.test(operands[x])){
    let y= operands[x][0]+operands[x][1];
     arr.unshift(38+((regToId(y))<<3));   
     return arr;
  }
  else return arr;
}
//get operands and its types exp: ["ax",'[1254+bx]',''Rx","M"] or ["al",0x12FF,''RL","I"]]
function byteConcat(str,arr) {   
  let disp=splitNum(getNum(str)); 
  arr.concat(findBP(getOps(str),arr));
  if (disp!=0){
    return arr.concat(disp);
  }else return arr;
}
function getOps(str){  
let operands=[];
let str2=str.replace(/\w+(?=\s)/,"");str2=str2.replace(/\s/g,"");
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
function findBP(operands,arr)
{
   if(operands.length===4)
   {
       let z=/M/.test(operands[2])?0:(/M/.test(operands[3])?1:-1);
       if(z!==-1)
       {
           if(/\[BP\]/i.test(operands[z]))
           {
               arr.push(0);
           }
       }
   }
   else if(/\[BP\]/i.test(operands[0]))
   {
       arr.push(0);
   }
   return arr;
}

function encodeMov(opcode, D, W) {
return (opcode<<2 )+ (D << 1) + W;
}
function getNum(str)//turn a string number BETWEEN BRACKETS to number
{
var x=str.match(/(?<=(\s|\+|\[))(0x\w+|0bh|\w+h|\d+|0b\d+)(?=(\s|\+|\]))/gi);
if (x==undefined) {
    x=str.match(/(?<=(\s|\-|\[))(0x\w+|0bh|\w+h|\d+|0b\d+)(?=(\s|\-|\]))/gi)
    if (x!==null){x="-"+x}
}
if (x==undefined) {return 0}
return convert(x);
}
function segSepcification(operands,arr){
  var x=0;
  if  (operands.length===4){
   x=/M/.test(operands[2])?0:(/M/.test(operands[3]))?1:-1;
  }else  {x=/M/.test(operands[1])?0:-1;}
  if (x!=-1 && /S:/.test(operands[x])){
    let y= operands[x][0]+operands[x][1];
     arr.unshift(38+(regToId(y)<<3)) ;
     return arr;    
  }
  else return arr;
}

function splitNum(num){
var disp=[];
  if(num>255)
 {
     disp.push(num & (0b0000000011111111));
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
let instruction = str.match(regex);
var operands = getOps(str);

var w = getW(operands),
v=getV(operands),
opcode=0,
d=getD(operands),
mode = getMod(operands),
result = 0,
regmem=regMem(operands);
if(/\[BP\]/i.test(str))
{
  mode=1;
}
if(justNumbers) mode=0;
arr= segSepcification(operands,arr);
//match instruction
switch(instruction[0].toUpperCase())
{
  case "MOV":
        //segemnt register to memory/register
        if(/M|R/.test(operands[2])  && /RS/.test(operands[3]))
        {
            arr.push(0b10001100);
           arr.push((mode<<6)+(regToId(operands[1])<<3)+regmem);
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
        
      // Register/Memory to/from Register
      else if (/R|M/.test(operands[2])  && /R|M/.test(operands[3])) {
          opcode = 0b100010;
          // register to memory
          if (/M/.test(operands[2]) && /R/.test(operands[3])) {
              arr.push(encodeMov(opcode, 0, w));
              result = (mode << 6) + (regToId(operands[1]) << 3) +  regmem;
              arr.push(result);     
          }
          // immidiate+register to register 
          else if (/R/.test(operands[2])) {
              arr.push(encodeMov(opcode, 1, w ));
              console.log(opcode)
              result = (mode << 6) + ((regToId(operands[0])) << 3) +  regmem;
              arr.push(result);              
          }
          arr=byteConcat(str,arr);
           // Immediate to Register/Memory
      } else if(/M|R/.test(operands[2])  && /I/.test(operands[3])) 
      {
          arr.push(encodeMov((0b110001) , 1, w));
          arr.push((mode<<6)+regmem);
          arr=byteConcat(str,arr);             
          if(w===1){     
              let byte=splitNum(convert(operands[1]));
              arr.push(byte[0]);
              if (byte.length===1) {
              /\-/.test(operands[1])?byte.push(255):byte.push(0);
              }
                arr.push(byte[1]);
             }
             else {
                 arr.push(convert(operands[1]));
             }
      }
      break;
    
case "PUSH":
    if(/RS/.test(operands[1]))
    {
        arr.push((((regToId(operands[0]))<<3)+0b110));
    }
    else if(/R|M/.test(operands[1]))
    {
        arr.push(0b11111111);
        arr.push(((getMod(operands))<<6)+(0b110000)+regmem);
        if(/M/.test(operands[1]))arr=byteConcat(str,arr);  
    }
break;
case "POP" :
    if(/RS/.test(operands[1]))
    {
        arr.push((((regToId(operands[0]))<<3)+0b111));
    }
    else if(/R|M/.test(operands[1]))
    {
        arr.push(0b10001111);
        console.log((mode<<6))
        arr.push((mode<<6)+(regmem));
        if(/M/.test(operands[1]))arr=byteConcat(str,arr);  
    }
break;
case "XCHG" :
    arr.push((0b10000110)+w);
    arr.push((mode<<6)+(regToId(operands[0]))<<2+regmem);
    arr=byteConcat(str,arr);       
break;
case "LEA" :
  if (/RX/.test(operands[2]) && /M/.test(operands[3])) {

      arr.push(0b10001101); 
      arr.push((mode << 6) + (regToId(operands[0]) << 3) + regmem);
      
      arr = byteConcat(str, arr);
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
  if (/R|M/.test(operands[2]) &&  /M|R/.test(operands[3])) {
          arr.push( ( d << 1) + w); 
        
          arr.push((mode << 6)+(regToId((/R/.test(operands[2]))?operands[0]:operands[1])<<3)+regmem);
              arr=byteConcat(str,arr);
  }
  //Immediate to Register/Memory 
  else if (/M|R/.test(operands[2]) && /I/.test(operands[3])) {

      opcode = 0b100000;
      let s=(convert((/I/.test(operands[2]))?operands[0]:operands[1]))<128?1:0;
      console.log('s test  '+s);
      arr.push((opcode<<2)+(s<<1)+w);
      arr.push((mode<<6)+regmem);
      arr=byteConcat(str,arr);
      if(w===1){         
          let byte=splitNum(convert(operands[1]));
          arr.push(byte[0]);
          if (byte.length===1 && (/W\.|WORD/.test(operands[0]))) {
            /\-/.test(operands[1])?byte.push(255):byte.push(0);
            }
          if (byte.length===2) {
              arr.push(byte[1]);
          }            
         }
         else {
             arr.push(convert(operands[1]));
         }
  }
break;
case "ADC":
  if (/R|M/.test(operands[2]) &&  /M|R/.test(operands[3])) {
      arr.push((0b10000) +(d<<1)+w); 
      arr.push((mode << 6) +(regToId((/R/.test(operands[2]))?operands[0]:operands[1])<<3)+ regmem);
          arr=byteConcat(str,arr);
}
//Immediate to Register/Memory 
else if (/I|M/.test(operands[2]) && /I|M/.test(operands[3])) {
  opcode = 0b100000;
  let s=(/\-/.test((/I/.test(operands[2]))?operands[0]:operands[1]))?1:0;
  arr.push((opcode<<2)+(s<<1)+w);
  arr.push((mode<<6)+(0b10000)+regmem);
  arr=byteConcat(str,arr);
  if(w===1)
  {
      let byte=splitNum(convert(operands[1]));

      arr.push(byte[0]);
      if (byte.length===2) {
          arr.push(byte[1]);
      }            
     else {
         arr.push(convert(operands[1]));
     }
  }
}
break;
case "AAA" :
arr.push(0b00110111);
break;             
case "INC": 
arr.push((0b11111110)+w);
arr.push((mode<<6)+regmem);
break;
case "SUB": 
  //Reg./Memory with Register to Either
  if (/R|M/.test(operands[2]) &&  /M|R/.test(operands[3])) {
        arr.push( ( 0b01010<< 2) + (d<<1)+w); 
        arr.push((mode << 6) +regToId((/R/.test(operands[2]))?operands[0]:operands[1])<<3+ regmem);
            arr=byteConcat(str,arr);
}
//Immediate to Register/Memory 
else if (/I|M/.test(operands[2]) && /I|M/.test(operands[3])) {
    opcode = 0b100000;
    let s=(/\-/.test((/I/.test(operands[2]))?operands[0]:operands[1]))?1:0;
    arr.push((opcode<<2)+(s<<1)+w);
    arr.push((mode<<6)+regmem);
    arr=byteConcat(str,arr);
    
    if(w===1)
    {
      let byte=splitNum(convert(operands[1]));
      arr.push(byte[0]);
      if (byte.length===2) {
          arr.push(byte[1]);
      }            
     else {
         arr.push(convert(operands[1]));
     }
    }
}
break;
case "SSB": 
//r/m to r/m
if (/R|M/.test(operands[2]) &&  /M|R/.test(operands[3])) {
  arr.push( ( 0b000110<< 2) + (d<<1)+w); 
  arr.push((mode << 6) +regToId((/R/.test(operands[2]))?operands[0]:operands[1])<<3+ regmem);
      arr=byteConcat(str,arr);
}
//Immediate to Register/Memory 
else if (/I|M/.test(operands[2]) && /I|M/.test(operands[3])) {
opcode = 0b100000;
let s=(/\-/.test((/I/.test(operands[2]))?operands[0]:operands[1]))?1:0;
arr.push((opcode<<2)+(s<<1)+w);
arr.push((mode<<6)+regmem);
arr=byteConcat(str,arr);
if(w===1)
{
  let byte=splitNum(convert(operands[1]));
  arr.push(byte[0]);
  if (byte.length===2) {
      arr.push(byte[1]);
  }            
 else {
     arr.push(convert(operands[1]));
 }
}
}
break;
case "DEC": 
arr.push((0b11111110)+w);
arr.push((mode<<6)+(0b1000)+regmem);
break;
case "CMP":
      //Reg./Memory with Register to Either
  if (/R|M/.test(operands[2]) &&  /M|R/.test(operands[3])) {
      arr.push( ( 0b01110<< 2) + (d<<1)+w); 
      arr.push((mode << 6) +regToId((/R/.test(operands[2]))?operands[0]:operands[1])<<2+ regmem);
          arr=byteConcat(str,arr);
}
//Immediate to Register/Memory 
else if (/I|M/.test(operands[2]) && /I|M/.test(operands[3])) {
  opcode = 0b100000;
  let s=(/\-/.test((/I/.test(operands[2]))?operands[0]:operands[1]))?1:0;
  arr.push((opcode<<2)+(s<<1)+w);
  arr.push((mode<<6)+regmem);
  arr=byteConcat(str,arr);
  if(w===1)
  {
      let byte=splitNum(convert(operands[1]));
      arr.push(byte[0]);
      if (byte.length===2) {
          arr.push(byte[1]);
      }            
     else {
         arr.push(convert(operands[1]));
     }
  }
}
break;
case "MUL": 
arr.push(0b11110110+w);
arr.push((mode)<<6+(0b100000)+regmem);
if(/M/.operands[1])
{
    arr=byteConcat(str,arr);
}
break;
case "IMUL": 
arr.push(0b11110110+w);
arr.push((mode)<<6+(0b101000)+regmem);
if(/M/.operands[1])
{
    arr=byteConcat(str,arr);
}
break;
case "DIV":
  arr.push(0b11110110+w);
  arr.push((mode)<<6+(0b110000)+regmem);
  if(/M/.operands[1])
  {
      arr=byteConcat(str,arr);
  }   
 break;
 case "IDIV":
      arr.push((0b11110110)+w);
      arr.push((mode)<<6+(0b111000)+regmem);
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
arr.push((mode)<<6+(0b010000)+regmem);
if(/M/.operands[1])
{
    arr=byteConcat(str,arr);
}  
break;
case "SHL" :case "SAL" :
  arr.push((0b11010000)+(v<<1)+w);
  arr.push((mode)<<6+(0b100000)+regmem);
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
  arr.push((0b11010000)+(v<<1)+w);
  arr.push( (mode<<6) +(0b101000) +regmem);
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
  arr.push((0b11010000)+(v<<1)+w);
  arr.push((mode)<<6+(0b111000)+regmem);
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
  arr.push((0b11010000)+(v<<1)+w);
  arr.push((mode)<<6+(0b000000)+regmem);
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
  arr.push((0b11010000)+(v<<1)+w);
  arr.push((mode)<<6+(0b001000)+regmem);
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
  arr.push((0b11010000)+(v<<1)+w);
  arr.push((mode)<<6+(0b010000)+regmem);
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
  arr.push((0b11010000)+(v<<1)+w);
  arr.push((mode)<<6+(0b011000)+regmem);
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
        arr.push( ( 0b01000<< 2) + (d<<1)+w); 
        arr.push((mode << 6) +regToId((/R/.test(operands[2]))?operands[0]:operands[1])<<2+ regmem);
            arr=byteConcat(str,arr);
}
//Immediate to Register/Memory 
else if (/I|M/.test(operands[2]) && /I|M/.test(operands[3])) {
    opcode = 0b10000000;
    arr.push(opcode+w);
    arr.push((mode<<6)+(0b100000)+regmem);
    arr=byteConcat(str,arr);
    if(w===1)
    {
      let byte=splitNum(convert(operands[1]));
      arr.push(byte[0]);
      if (byte.length===2) {
          arr.push(byte[1]);
      }            
     else {
         arr.push(convert(operands[1]));
     }
    }
}
    break;
case "XOR" :
     //Reg./Memory with Register to Either
     if (/R|M/.test(operands[2]) &&  /M|R/.test(operands[3])) {
      arr.push( ( 0b0110000) + (d<<1)+w); 
      arr.push((mode << 6) +regToId((/R/.test(operands[2]))?operands[0]:operands[1])<<2+ regmem);
          arr=byteConcat(str,arr);
}
//Immediate to Register/Memory 
else if (/I|M/.test(operands[2]) && /I|M/.test(operands[3])) {
  opcode = 0b10000000;
  arr.push(opcode+w);
  arr.push((mode<<6)+(0b110000)+regmem);
  arr=byteConcat(str,arr);
  if(w===1)
  {
      let byte=splitNum(convert(operands[1]));
      arr.push(byte[0]);
      if (byte.length===2) {
          arr.push(byte[1]);
      }            
     else {
         arr.push(convert(operands[1]));
     }
  }
}
  
    break;
case "OR" :
     //Reg./Memory with Register to Either
     if (/R|M/.test(operands[2]) &&  /M|R/.test(operands[3])) {
      arr.push( ( 0b010<< 2) + (d<<1)+w); 
      arr.push((mode << 6) +regToId((/R/.test(operands[2]))?operands[0]:operands[1])<<2+ regmem);
          arr=byteConcat(str,arr);
}
//Immediate to Register/Memory 
else if (/I|M/.test(operands[2]) && /I|M/.test(operands[3])) {
  opcode = 0b10000000;
  arr.push(opcode+w);
  arr.push((mode<<6)+(0b001000)+regmem);
  arr=byteConcat(str,arr);
  if(w===1)
  {
      let byte=splitNum(convert(operands[1]));
      arr.push(byte[0]);
      if (byte.length===2) {
          arr.push(byte[1]);
      }            
     else {
         arr.push(convert(operands[1]));
     }
  }
}
    break;
case "TEST": 
       //Reg./Memory with Register to Either
       if (/R|M/.test(operands[2]) &&  /M|R/.test(operands[3])) {
          arr.push((0b10000100)+w); 
          arr.push((mode << 6) +regToId((/R/.test(operands[2]))?operands[0]:operands[1])<<2+ regmem);
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
          let byte=splitNum(convert(operands[1]));
          arr.push(byte[0]);
          if (byte.length===2) {
              arr.push(byte[1]);
          }            
         else {
             arr.push(convert(operands[1]));
         }
      }
  }
break;
case "CALL" :
  if(operands.length===4)
  {
      arr.push(0b11111111);
      arr.push((mode<<6)+(0b011000)+regmem);
      if(/\[/.test(operands[0]))
      {
       arr=byteConcat(str,arr);
      }
  }
  else{
      if(/I/.operands[1])
      {
          arr.push(0b11101000);
          if(splitNum(convert(operands[0])).length===1)
          {
              arr.push(convert(aperands[0]));
          }
          else{
              arr.push([...splitNum(convert(operands[0]))]);
          }
      }
      else if(/R|M/.operands[1])
      {
          arr.push(0b11111111);
          arr.push((Mode<<6)+(0b010000)+regmem);
          if(/M/.operands[1])
          {
            arr=byteConcat(str,arr);
          }
      }
      else if(!/(?<!([A-D][XLH]|[CDES]S|[SB]P|[SD]I))\s*:\s*(?!([A-D][XLH]|[CDES]S|[SB]P|[SD]I))/i.test(operands[0]))
      {
          arr.push(0b10011010);
          if(convert(/(?=:\s*)\w+(?=\s)/i.match(operands[0]))>255)
          {
              arr.push(...splitNum(convert(/(?=:\s*)\w+(?=\s)/i.match(operands[0]))));
          }
          else{
              arr.push(convert(/(?=:\s*)\w+(?=\s)/i.match(operands[0])));
              arr.push(0);
          }
          if(convert(/\w+(?=\s*:)/i.match(operands[0]))>255)
          {
              arr.push(...splitNum(convert(/(?=:\s*)\w+(?=\s)/i.match(operands[0]))));
          }
          else{
              arr.push(convert(/\w+(?=\s*:)/i.match(operands[0])));
              arr.push(0);
          }
      }
  }
    break;
case "JMP" :
    if(operands.length===4)
    {
        arr.push(0b11111111);
        arr.push((mode<<6)+(0b101000)+regmem);
        if(/\[/.test(operands[0]))
        {
         arr=byteConcat(str,arr);
        }

    }
    else{
        if(/I/.operands[1])
        {
            if(splitNum(convert(operands[0])).length===1)
            {
                arr.push(0b11101011);
                arr.push(convert(aperands[0]));
            }
            else{
                arr.push(0b11101001);
                arr.push([...splitNum(convert(operands[0]))]);
            }
        }
        else if(/R|M/.operands[1])
        {
            arr.push(0b11111111);
            arr.push((Mode<<6)+(0b100000)+regmem);
            if(/M/.operands[1])
            {
              arr=byteConcat(str,arr);
            }
        }
        else if(!/(?<!([A-D][XLH]|[CDES]S|[SB]P|[SD]I))\s*:\s*(?!([A-D][XLH]|[CDES]S|[SB]P|[SD]I))/i.test(operands[0]))
        {
            arr.push(0b11101010);
            if(convert(/(?=:\s*)\w+(?=\s)/i.match(operands[0]))>255)
            {
                arr.push(...splitNum(convert(/(?=:\s*)\w+(?=\s)/i.match(operands[0]))));
            }
            else{
                arr.push(convert(/(?=:\s*)\w+(?=\s)/i.match(operands[0])));
                arr.push(0);
            }
            if(convert(/\w+(?=\s*:)/i.match(operands[0]))>255)
            {
                arr.push(...splitNum(convert(/(?=:\s*)\w+(?=\s)/i.match(operands[0]))));
            }
            else{
                arr.push(convert(/\w+(?=\s*:)/i.match(operands[0])));
                arr.push(0);
            }

        }
    }
   
    break;
case "RET" :break;
case "REP" :case "REPE":
    arr.push(0b11110011);
    switch(operands[0].toUpperCase())
    {
      case "MOVSB": arr.push(0b10100100);break; 
      case "MOVSW":arr.push(0b10100101);break;
      case "CMPSB" :arr.push(0b10100110);break;
      case "CMPSW" :arr.push(0b10100111);break;  
      case "SCASB" :arr.push(0b10101110);break;
      case "SCASW" :arr.push(0b10101111);break;
      case "LODSB" :arr.push(0b10101100);break;
      case "LODSW" :arr.push(0b10101101);break;
      case "STOSB" :arr.push(0b10101010);break;
      case "STOSW" :arr.push(0b10101011);break;
    }
    break; 
    case "REPNE" :
    arr.push(0b11110010);
    switch(operands[0].toUpperCase())
    {
          case "MOVSB": arr.push(0b10100100);break; 
          case "MOVSW":arr.push(0b10100101);break;
          case "CMPSB" :arr.push(0b10100110);break;
          case "CMPSW" :arr.push(0b10100111);break;  
          case "SCASB" :arr.push(0b10101110);break;
          case "SCASW" :arr.push(0b10101111);break;
          case "LODSB" :arr.push(0b10101100);break;
          case "LODSW" :arr.push(0b10101101);break;
          case "STOSB" :arr.push(0b10101010);break;
          case "STOSW" :arr.push(0b10101011);break;
    }
    break; 
case "MOVSB": arr.push(0b10100100);break; 
case "MOVSW":arr.push(0b10100101);break;
case "CMPSB" :arr.push(0b10100110);break;
case "CMPSW" :arr.push(0b10100111);break;  
case "SCASB" :arr.push(0b10101110);break;
case "SCASW" :arr.push(0b10101111);break;
case "LODSB" :arr.push(0b10101100);break;
case "LODSW" :arr.push(0b10101101);break;
case "STOSB" :arr.push(0b10101010);break;
case "STOSW" :arr.push(0b10101011);break;
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
return arr;
}
//get value of d
function getD(operands) {  
  // from reg to memory 
  if (/M/.test(operands[2]) && /R/.test(operands[3])) 
      return 0;    
  // memory to reg 
  else if ( /R/.test(operands[2]) )        
      return 1; 
}
//get value of w
function getW(operands) {
  let x;
if (operands.length===4){
if (/R[XS]/.test(operands[2])) {  return 1;}
if (/RL/.test(operands[2]) ){return 0;}
if (/R[XS]/.test(operands[3])) {  return 1;}
if (/RL/.test(operands[3]) ){return 0;}
(/M/.test(operands[2]))?x=0:x=1;
if (/WORD|W./.test(operands[x])) return 1;
else if (/BYTE|B\./.test(operands[x])){return 0;}
else {
  return (convert(operands[x?0:1]))>255? 1:0;

}
}
else{
if (/R[XS]/.test(operands[1])) { return 1;}
if (/RL/.test(operands[1]) ){ return 0;}
if (/WORD|W./.test(operands[1])) return 1;
else if (/BYTE|B./.test(operands[1])){return 0;}
else {
  return convert(operands[0])>255? 1:0;
}
}
}

// ------------------------------- function define the zone (r/m) in op codes

function regMem(ops){
  justNumbers=false;
  if (getMod(ops)==3){     if  (ops.length===2) {
    return regToId(ops[0]);
}
else {
    return  /R/.test(ops[2])?regToId(ops[0]): regToId(ops[1])   ;  
}  
}
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
          if(/R|I/.test(arr[2]) && /R|I/.test(arr[3]) )
          {
              return 0b11;}
          else  {
              var z=(arr[2]==="M")?0:1;
               if(!/\d/.test(arr[z])){ return 0;}
            else{
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
    return (convertP(str2)>127)?65536-convertP(str2):256-convertP(str2);
}else{return convertP(str);}
}

// -----------function return register id by passing it name as a parameter----------------------

function regToId(regname){
switch(regname.toLowerCase()){
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
return arr;
}
console.log(toBcode("mov [si+12],15"));
console.log(toBcode("mov w.[si+12],15"));
console.log(toBcode("add [si+12],15"));
console.log("xx" +toBcode("add w.[si+12],15"));
//console.log(toBcode("sub ax,bx"));
console.log(toBcode("pop [bx+16]"));


//console.log(getNum("mov [bp-455],es"));
