    var modal_error = new bootstrap.Modal(document.getElementById('modal_error'), {
      keyboard: false
    })
    var modal_end_exec = new bootstrap.Modal(document.getElementById('modal_end_exec'), {
      keyboard: false
    })
//
var stepsLimit = 1000;
var singleStepRunTime = 100;
var intervalRun;
var codeMirrorMarks = [];
var  userText="";
var compiledCode = "";
var highlightingInfoTable = [];
var consoleStateManager =  [];


var firstTrue=0;
//local storage management
var userTextArray;
var lastCodeIndex;
if(localStorage.getItem("userTextArray"))
{
  userTextArray =JSON.parse(localStorage.getItem("userTextArray")) ;
  lastCodeIndex = userTextArray.length-1;
  codeMirror.setValue(userTextArray[lastCodeIndex]);

}
else 
{
  userTextArray = [];
}
window.addEventListener("keydown",(e)=>{
  console.log(e)
  if(e.key=="MediaPlayPause")
  {
    lastCodeIndex+=(lastCodeIndex+1)%userTextArray.length;
    codeMirror.setValue(userTextArray[lastCodeIndex]);
    
   
  }
  if(e.key=="MediaTrackPrevious")
  {

    lastCodeIndex=(lastCodeIndex-1)%userTextArray.length;
    if(lastCodeIndex<0) lastCodeIndex = 0;
    codeMirror.setValue(userTextArray[lastCodeIndex]);
  }

})


//

var table_ram=document.getElementsByClassName("scroll_it")[0];
     var scrollTop=0;
     var scrollLeft=0;
     var segmentStart=0;
     var segmentPrevStart=0;
     var persentageSeg=0.005;
     var upPressed=false;
     var numInstructions=0;
     var editorWidth = codeMirror.getWrapperElement().offsetWidth;
     codeMirror.setSize(innerWidth-58)
     var p=new Processor();
     var displayigBase=16;
     let altern=0;
     var t=0;
     var RegStatesManager=[];
     var ramStatesManager=[];
     p.register.writeReg(SS_REG,0x700);
     p.register.writeReg(SP_REG,0xfffe);
     p.RAM._writeWord((p.register.readReg(SS_REG)<<4)+p.register.readReg(SP_REG),0Xfffe);
   //  p.register.writeReg(CS_REG,0x100);
     var compileRes;
     
    var ram_container=document.getElementById("ram_container");
    var canvas_console=document.getElementById("canvas_console");
    var spinner_loader=document.getElementById("spinner_loader");
     ram_container.style.display="none";
     canvas_console.style.display="none";
     spinner_loader.style.display="none";
     
     ramStatesManager[t]=[];
  
     consoleStateManager[t]={cursorRam:p.cnsl.cursorRam,cursor:p.cnsl.cursor};
    //
  setInterval(updateStack,1000);

    //
    
    updateRegState();
     
     animate();
     
     //add row stack
     let k=0;
     for(let i=p.register.readReg(SS_REG);i>=p.register.readReg(SS_REG)-64;i--)
     {
       addRowStack(k,p.RAM.getBufferAt(i));
       k++;
      
     }

     
     //fixing the header
     var th=document.getElementById("table_header");
    
     var scrolling= false;
     table_ram.addEventListener("scroll",
     function()
     {
       scrolling=true;
         th.style="transform:translateY("+ this.scrollTop +"px)";
         //
         scrollTop=this.scrollTop;
         scrollLeft=this.scrollLeft;
     
        
         
         
       

       
     }
     )
     setInterval(
      function()
      {
        if(scrolling)
        {
        
          if(scrollTop>=((0xffff)*persentageSeg)*41-((0xffff)*persentageSeg))
          {
     
                 segmentStart=Math.floor((0xffff)*persentageSeg+segmentStart-3);
              
                 table_ram.scrollTop=1;
               
          
          }
          else if(scrollTop==0  &&segmentStart!=0)
          {
          
           
           segmentStart-=Math.floor((0xffff)*persentageSeg-3);
           table_ram.scrollTop=(0x13f)*41;
           
          
          }
         
        }
       
      },
      1000
     );
        
     //search
       function searchRam(physicalAddresse)
       {
       
        let num=physicalAddresse;
        let i=0;
        while(num>=0x144)
        {
             num-=0x144;
           
             i++;
        }
        goToSubSeg(i);
        if(num<=0x13f)
        table_ram.scrollTop=num*41;
        else table_ram.scrollTop=0x13f*41;
       }
      let input = document.getElementById("input_search");
     function goToSubSeg(num)
     {
      segmentStart=Math.floor((persentageSeg*0xffff-3))*num;
     }
       input.addEventListener('keydown',
       function(e)
       {

            if(e.code=="Enter")
            {
                
                let val=input.value;
                let inputRes=hex(val);
                if(inputRes.value!=-1)
                {
                  
                       let physicalAddresse=inputRes.value;
                       let num=physicalAddresse;
                       let i=0;
                       while(num>=0x144)
                       {
                            num-=0x144;
                          
                            i++;
                       }
                       goToSubSeg(i);
                       if(num<=0x13f)
                       table_ram.scrollTop=num*41;
                       else table_ram.scrollTop=0x13f*41;
                   
                      


                      
                       

                }
                
                else alert(inputRes.message);
               
            }
       }
       )
    








     //
    
     //
    
     
      window.addEventListener('keydown',
      function(e)
      {
      
        if(e.code=='KeyX')
        {
          
           if(altern==0)displayigBase=16;
           else if(altern==1) displayigBase=10;
           else displayigBase=2;
           altern++;
           if(altern==3) altern=0;
        }
        if(e.code=='ArrowUp')
        {
          upPressed=true;
        
           
        }
        
      }
      )
     
     
      //
    

      
  
     for(let i=0;i<(0xffff)*persentageSeg;i++)
     {
       addRow(i+segmentStart,p.RAM.getBufferAt(i+segmentStart));
      
     }

    
    
     updateRam();
    setInterval(updateRam,500);
    //register.js
   
    
     updateRegs();     
      setInterval(updateRegs,100);
      setInterval(highlightingRam,300);
 //highlighting ram
  function highlightingRam()
  {
    if(compiled)
    {
      if(compileRes.status)
      {
        for(let i=0;i<compileRes.finalView.length;i++)
        {
        
          if(compileRes.finalView[i].executableLine)
          {
               let addr=compileRes.finalView[i].instructionAddr;
               let size=compileRes.finalView[i].instructionSize;
               let row;
              
               if(p.register.readReg(IP_REG)==addr)
               {
               
                 for(let j=0;j<size;j++)
                 {
                  row=getTrRam(addr+1+j);
                  row.className+=" table-active";
                 
                 }
               }
               else
              {
                for(let j=0;j<size;j++)
                 {
                  row=getTrRam(addr+1+j);
                  row.className="tr_ram";
               
                 }
              }
              
          }
        }

      }
     
    }
  }
  

  //getting textArea value
  var compiled=false;
  
  
  var code_compile_btn=document.getElementById("code_compile_btn");
  var text;
  var  arrayOfLines;
  code_compile_btn.addEventListener("click",
  function(e)
  {
   
    if(code_compile_btn.innerHTML.trim()=="edit mode")
    {
      clearInterval(intervalRun);
      codeMirror.setValue(userText);
      ram_container.style.display="none";
      canvas_console.style.display="none";
      codeMirror.options.readOnly = false;
      code_compile_btn.innerHTML="compile";
      p.initReg();
      p.initRam();
      t=0;
       RegStatesManager=[];
       ramStatesManager=[];
       ramStatesManager[t]=[];
       updateRegState();
       p.cnsl.initCanvas();
       ctx.fillRect(0,0,p.width,p.height);
       p.register.writeReg(SS_REG,0x700);
     p.register.writeReg(SP_REG,0xfffe);
     p.RAM._writeWord((p.register.readReg(SS_REG)<<4)+p.register.readReg(SP_REG),0Xfffe);
   //  p.register.writeReg(CS_REG,0x100);
   codeMirror.setSize(innerWidth-58)
     
    }
    else
    if(code_compile_btn.innerHTML.trim()=="compile")
    {
     
      document.getElementById("run_btn").disabled = false;
    

      
      userText=codeMirror.getValue();
      userTextArray.push(userText);
      localStorage.setItem("userTextArray",JSON.stringify(userTextArray));
      
     
       compileRes=Compiler.compile(userText);
       
       
      console.log(compileRes)
      
      
       if(compileRes.status)
       {
        //compileCode
     
        p.initReg();
        p.initRam();
        t=0;
         RegStatesManager=[];
         ramStatesManager=[];
         ramStatesManager[t]=[];
         updateRegState();
         p.cnsl.initCanvas();
         p.register.writeReg(SS_REG,0x700);
         p.register.writeReg(SP_REG,0xfffe);
         p.RAM._writeWord((p.register.readReg(SS_REG)<<4)+p.register.readReg(SP_REG),0Xfffe);
         ctx.fillRect(0,0,p.width,p.height);
         //
        
      
         
          //
    
      
         p.register.writeReg(IP_REG,compileRes.origin);
         setTimeout(()=>{
          searchRam(compileRes.origin)
          console.log("...............",compileRes.origin)
         },500)
        
 

        var txtAreaBox=document.getElementById("code");
        txtAreaBox.style.display="none";
        spinner_loader.style.display="";
        setTimeout(()=>{
          spinner_loader.style.display="none";
          ram_container.style.display="";
          canvas_console.style.display="";
          txtAreaBox.style.display="";
          codeMirror.options.readOnly = true;
          code_compile_btn.innerHTML="edit mode";
          codeMirror.setSize(editorWidth);
         
          
    
        },300)
         //
       
        
         
      
       
        for(let i=0;i<compileRes.finalView.length;i++)
        {
        
          if(compileRes.finalView[i].executableLine)
          {
           for(let j=0;j<compileRes.finalView[i].opcodes.length;j++)
              {
                p.RAM.writeByte(compileRes.finalView[i].instructionAddr+j,compileRes.finalView[i].opcodes[j]);
              
              }
          }
        }
        deleteVars();
        displayVars(compileRes);
        compiled=true;        // setting the copiled code onto the text area

        compiledCode="";
        
        for(let i=0;i<compileRes.finalView.length;i++)
        {
        
         
            compiledCode+=compileRes.finalView[i].originalLine+"\n";
       
         
        }
       codeMirror.setValue(compiledCode);

        //
        var cpt=0;
        for(let i=0;i<compileRes.finalView.length;i++)
        {
        
          if(compileRes.finalView[i].executableLine)
          {
            if(cpt==0){
              firstTrue=i;
            }
      
            highlightingInfoTable.push({index:i,addr:compileRes.finalView[i].instructionAddr,originalLine:compileRes.finalView[i].originalLine});
            compiledCode+=compileRes.finalView[i].resolvedLine+"\n";
            cpt++;
          }
         
        }
        //
       
        //
        codeMirrorMarks.forEach((mark)=>{
          mark.clear();
        })
        let line =0;
        highlightingInfoTable.forEach((element)=>{
          if(element.addr ==p.register.readReg(IP_REG))
          {
          
           line = element.index;
          
          }
        })
        
        
        let tmp = codeMirror.markText({line:(line), ch:0},{line:(line), ch:50},{className:"mark_error"})
        codeMirrorMarks.push(tmp);
        
        updateStates();
        
       }
       else {
       let tmp = codeMirror.markText({line:(compileRes.errorLine), ch:0},{line:(compileRes.errorLine), ch:50},{className:"mark",clearOnEnter:true})
        codeMirrorMarks.push(tmp);
        setTimeout(()=>{
         codeMirrorMarks.forEach((mark)=>{
           mark.clear();
         })
        },10000)
         var modal_error_text = document.getElementById("modal_error_text");
         modal_error_text.innerHTML=compileRes.message+" at line: "+(compileRes.errorLine+1);
         modal_error.show();
        
      };
  
      

     
   

    }

   
   
  }
  )
//
  

//
//run button
var step=1;
var modal_end_exec_text = document.getElementById("modal_end_exec_text");
function runHandler()
{
   
      intervalRun = setInterval(()=>{
      if(step>stepsLimit)
      {
        modal_end_exec_text.innerHTML="Execution ended : an infinite loop has been detected:  ,"+step+" times";
        modal_end_exec.show();
        document.getElementById("run_btn").disabled = true;
       clearInterval(intervalRun);
       return;
      }
       
      if(((p.register.readReg(IP_REG)==0xfffe) && (p.register.readReg(SP_REG)==0)))
      {
        
        modal_end_exec_text.innerHTML="the execution ended succesfully";
        modal_end_exec.show();
        document.getElementById("run_btn").disabled = true;
       clearInterval(intervalRun);
       return;
      }
      singleStepHandler();
      step++;
     
     },singleStepRunTime)
    
        
       
    
   

}
//reload button
  let reload_btn=document.getElementById('reload_btn');
  reload_btn.addEventListener("click",
  function()
  {
    clearInterval(intervalRun);
    step=0;
   
    document.getElementById("run_btn").disabled = false;
    p.initReg();
    p.initRam();
    t=0;
     RegStatesManager=[];
     ramStatesManager=[];
     ramStatesManager[t]=[];
     updateRegState();
     p.cnsl.initCanvas();
     p.register.writeReg(SS_REG,0x700);
     p.register.writeReg(SP_REG,0xfffe);
     p.RAM._writeWord((p.register.readReg(SS_REG)<<4)+p.register.readReg(SP_REG),0Xfffe);
     ctx.fillRect(0,0,p.width,p.height);
     //
    
  
     
      //

  
     p.register.writeReg(IP_REG,compileRes.origin);
     searchRam(compileRes.origin)
    
     for(let i=0;i<compileRes.finalView.length;i++)
     {
     
       if(compileRes.finalView[i].executableLine)
       {
        for(let j=0;j<compileRes.finalView[i].opcodes.length;j++)
           {
             p.RAM.writeByte(compileRes.finalView[i].instructionAddr+j,compileRes.finalView[i].opcodes[j]);
           
           }
       }
     }
     deleteVars();
     displayVars(compileRes);
     compiled=true;
   
     codeMirrorMarks.forEach((mark)=>{
      mark.clear();
    })
    let line =0;
    highlightingInfoTable.forEach((element)=>{
      if(element.addr ==p.register.readReg(IP_REG))
      {
      
       line = element.index;
      
      }
    })
    
    
    let tmp = codeMirror.markText({line:(line), ch:0},{line:(line), ch:50},{className:"mark_error"})
    codeMirrorMarks.push(tmp);
    
  
  }
  )
  
  
   
    
    

var myModal = document.getElementById('s')
let flag_O=document.getElementById('flag_O');
let flag_D=document.getElementById('flag_D');
let flag_I=document.getElementById('flag_I');
let flag_T=document.getElementById('flag_T');
let flag_S=document.getElementById('flag_S');
let flag_Z=document.getElementById('flag_Z');
let flag_A=document.getElementById('flag_A');
let flag_P=document.getElementById('flag_P');
let flag_C=document.getElementById('flag_C');
var text = document.createTextNode("some text");
setInterval(()=>{
  flag_O.firstChild.data=p.register.extractFlag('O');
  flag_D.firstChild.data=p.register.extractFlag('D');
  flag_I.firstChild.data=p.register.extractFlag('I');
  flag_T.firstChild.data=p.register.extractFlag('T');
  flag_S.firstChild.data=p.register.extractFlag('S');
  flag_Z.firstChild.data=p.register.extractFlag('Z');
  flag_A.firstChild.data=p.register.extractFlag('A');
  flag_P.firstChild.data=p.register.extractFlag('P');
  flag_C.firstChild.data=p.register.extractFlag('C');
},100)
//animation fuction
var consoleTxt="";

function animate()
{  
        
        
        ctx.clearRect(0,0,p.cnsl.width,p.cnsl.height);
        let j=0;
        consoleTxt="";
        for(var i=0;((i<p.cnsl.cursorRam) &&(j<p.cnsl.cursor))  ;i+=2)
        {
          if((j>=p.cnsl.cursor) ||(i>=p.cnsl.cursorRam)) break;
         
            let byte1=p.cnsl.ram.readByte((p.cnsl.videoMemorySegement<<4)+i);
            let byte2=p.cnsl.ram.readByte((p.cnsl.videoMemorySegement<<4)+i+1);
           
            p.cnsl._writeChar(j,String.fromCharCode(byte1),byte2%16,(byte2>>4)&0xff);
            consoleTxt+=String.fromCharCode(byte1)+" ";
           
           

            j++;
          
        }
        ctx.clearRect(0,0,p.width,p.height);
        
        if(p.cnsl.readMode)p.cnsl.updateCursor();
        
        if(p.cnsl.readMode) p.cnsl._waitForKey();
       
        if(keyStored &&  p.int21_01==true)
        {
 
          p.cnsl.setKeyToReg(AX_REG,XL);
         
         p.int21_01=false;
         keyStored=false;

        }
        if(p.int21_0a &&keyStored &&p.readNum<=p.RAM.readByte(p.register.readReg(DX_REG)) )
        {
        
         
         
         
           if(p.readNum==p.RAM.readByte(p.register.readReg(DX_REG))-1 )
           {
            let dxAdr=p.register.readReg(DX_REG);
            p.RAM.writeByte(dxAdr+p.readNum+1,p.cnsl.key.charCodeAt(0)&0x00ff);
            p.RAM.writeByte(dxAdr+2+p.readNum,0xd);//13 is enter ascci code (cret)
            p.RAM.writeByte(dxAdr+2+p.readNum+1,0);
            p.RAM.writeByte(dxAdr+1,p.readNum);
                            
          
              
           }
           else 
           {
            let dxAdr=p.register.readReg(DX_REG);
            p.RAM.writeByte(dxAdr+p.readNum+1,p.cnsl.key.charCodeAt(0)&0x00ff);
            keyStored=false;
           
            
              p.cnsl.readChar();
              p.readNum++;
         
              
            
            
           }
         
         
         
        
        }
        
       requestAnimationFrame(animate)
    
}
//

let rows=document.getElementById("table_stack").rows;
for(let i=3;i<rows.length-1;i+=4)
{
   
    rows[i].classList="table-active";
    
    rows[i+1].classList="table-active";
    
 
}
//utility functions
//updateRam
function updateRam()
{

}
//getRegStateAt
function getRegStateAt(t1)
{
  if(t1<=t &&t1>=0)
  {
    return RegStatesManager[t1];
  }
  else console.log("ERROR:please entre a valide state index");
  
}
//updateRegState
function updateRegState()
    {
      RegStatesManager[t]={ax:p.register.readReg(AX_REG),
      bx:p.register.readReg(BX_REG),
      cx:p.register.readReg(CX_REG),
      dx:p.register.readReg(DX_REG),
      cs:p.register.readReg(CS_REG),
      ip:p.register.readReg(IP_REG),
      ss:p.register.readReg(CS_REG),
      sp:p.register.readReg(SP_REG),
      bp:p.register.readReg(BP_REG),
      si:p.register.readReg(SI_REG),
      di:p.register.readReg(DI_REG),
      ds:p.register.readReg(DS_REG),
      es:p.register.readReg(ES_REG),
      flags:p.register.readReg(FLAG_REG)
};
    }
//goToSubSeg
function goToSubSeg(num)
{
 segmentStart=Math.floor((persentageSeg*0xffff-3))*num;
}
//addRowRam
function addRow(addresse,value)
{
  let table = document.getElementById("table_ram").getElementsByTagName('tbody')[0];
let row = table.insertRow(-1);
row.className="tr_ram"
let cell1 = row.insertCell(0);
let cell2 = row.insertCell(1);
let cell3 = row.insertCell(2);
cell1.className="td_ram";


// Add some text to the new cells:


if(getlength(addresse.toString(16))===1) cell1.innerHTML="@000"+addresse.toString(16);
else if(getlength(addresse.toString(16))===2) cell1.innerHTML="@00"+addresse.toString(16);
else if(getlength(addresse.toString(16))===3) cell1.innerHTML="@0"+addresse.toString(16);
else cell1.innerHTML="@"+addresse.toString(16);
let ch;
if(displayigBase==2) ch="0b";
else if(displayigBase==16) ch="0x";
else if(displayigBase==10)ch="0d";
cell2.innerHTML =ch+value.toString(displayigBase);
let ascii=String.fromCharCode(value);
 if(value===0) ascii="NULL";
cell3.innerHTML=ascii;
}
//addRowVars
function addRowVars(name,addresse,value)
{
  let table = document.getElementById("table_variables").getElementsByTagName('tbody')[0];
let row = table.insertRow(-1);


let cell0 = row.insertCell(0);
let cell1 = row.insertCell(1);
let cell2 = row.insertCell(2);
let cell3 = row.insertCell(3);
cell1.className="td_vars";
cell0.innerHtml=name;

// Add some text to the new cells:


if(getlength(addresse.toString(16))===1) cell1.innerHTML="@000"+addresse.toString(16);
else if(getlength(addresse.toString(16))===2) cell1.innerHTML="@00"+addresse.toString(16);
else if(getlength(addresse.toString(16))===3) cell1.innerHTML="@0"+addresse.toString(16);
else cell1.innerHTML="@"+addresse.toString(16);
let ch;
if(displayigBase==2) ch="0b";
else if(displayigBase==16) ch="0x";
else if(displayigBase==10)ch="0d";
cell2.innerHTML =ch+value.toString(displayigBase);
let ascii=String.fromCharCode(value);
 if(value===0) ascii="NULL";
cell3.innerHTML=ascii;
}
//addRowStack
function addRowStack(addresse,value)
{
  let table = document.getElementById("table_stack").getElementsByTagName('tbody')[0];
let row = table.insertRow(-1);



let cell1 = row.insertCell(0);
let cell2 = row.insertCell(1);
let cell3 = row.insertCell(2);
cell1.className="td_stack";


// Add some text to the new cells:


if(getlength(addresse.toString(16))===1) cell1.innerHTML="@000"+addresse.toString(16);
else if(getlength(addresse.toString(16))===2) cell1.innerHTML="@00"+addresse.toString(16);
else if(getlength(addresse.toString(16))===3) cell1.innerHTML="@0"+addresse.toString(16);
else cell1.innerHTML="@"+addresse.toString(16);
let ch;
if(displayigBase==2) ch="0b";
else if(displayigBase==16) ch="0x";
else if(displayigBase==10)ch="0d";
cell2.innerHTML =ch+value.toString(displayigBase);
let ascii=String.fromCharCode(value);
 if(value===0) ascii="NULL";
cell3.innerHTML=ascii;
}
//updateTable
function upadateTable(r,c,content)
{
 x=document.getElementById("table_ram").rows[r].cells;
 x[c].innerHTML=content;
}
function getTrRam(r)
{
 r=document.getElementById("table_ram").rows[r];
 return r;
}
//updateTableStack
function upadateTableStack(r,c,content)
{
 let row=document.getElementById("table_stack").rows[r];
 x=document.getElementById("table_stack").rows[r].cells;
 x[c].innerHTML=content;
}

function updateRam()
{
 for(let i=0;i<(0xffff)*persentageSeg;i++)
{
  let ascii=String.fromCharCode(p.RAM.getBufferAt(i+segmentStart));
 
  if(p.RAM.getBufferAt(i+segmentStart)===0) ascii="NULL";
  let ch;
  let address;
  if(displayigBase==2) ch="0b";
 else if(displayigBase==16) ch="0x";
 else if(displayigBase==10)ch="0d";
 if(getlength((i+segmentStart).toString(16))===1) address="@000"+(i+segmentStart).toString(16);
 else if(getlength((i+segmentStart).toString(16))===2) address="@00"+(i+segmentStart).toString(16);
 else if(getlength((i+segmentStart).toString(16))===3) address="@0"+(i+segmentStart).toString(16);
 else address="@"+(i+segmentStart).toString(16);
  upadateTable(i+1,0,address);
  upadateTable(i+1,1,ch+p.RAM.getBufferAt(i+segmentStart).toString(displayigBase));
  upadateTable(i+1,2,ascii);
}
}
//updateStack

function updateStack()
{
  let k=0;
 for(let i=(p.register.readReg(SS_REG)<<4)+0xffff;i>=(p.register.readReg(SS_REG)<<4)+0xffff-64;i--)
{
  let ascii=String.fromCharCode(p.RAM.getBufferAt(i));
  
  if(p.RAM.getBufferAt(i)===0) ascii="NULL";
  let ch;
  let address;
  if(displayigBase==2) ch="0b";
 else if(displayigBase==16) ch="0x";
 else if(displayigBase==10)ch="0d";
 address=p.register.readReg(SS_REG).toString(16)+":"+(i-(p.register.readReg(SS_REG)<<4)).toString(16);
  upadateTableStack(k+1,0,address);
  upadateTableStack(k+1,1,ch+p.RAM.getBufferAt(i).toString(displayigBase)
                      +((p.register.readReg(SP_REG)==(i-(p.register.readReg(SS_REG)<<4)))?" <===SP":""));

  upadateTableStack(k+1,2,ascii);
  k++;
}
}
function getlength(number) {
  return number.toString().length;
}
  
   var prevAx=0;
   var prevBx=0;
   var prevCx=0;
   var prevDx=0;
   var prevCS=0;
   var prevIP=0;
   var prevSS=0;
   var prevSP=0;
   var prevBP=0;
   var prevSI=0;
   var prevDI=0;
   var prevDS=0;
   var prevES=0;
   var prevBX=0;
   function updateReg(rl,rh,rId)
   {
    let al
    
    =document.getElementById(rl);
    let ah=document.getElementById(rh);
    //
     
    //
    let ax=p.register.readReg(rId);//0101  
    //
    switch(rId)
    {
      case AX_REG:
        if(ax!=prevAx && t>0)
        {
         
          highlightFor(rl,"red",2);
          highlightFor(rh,"red",2);
         
          
        }
       
        prevAx=ax;
      break;
      case BX_REG:
        if(ax!=prevBX && t>0)
        {
         
          highlightFor(rl,"red",2);
          highlightFor(rh,"red",2);
         
          
        }
       
        prevBX=ax;
      break;
      case CX_REG:
        if(ax!=prevCx && t>0)
        {
         
          highlightFor(rl,"red",2);
          highlightFor(rh,"red",2);
         
          
        }
       
        prevCx=ax;
      break;
      case DX_REG:
        if(ax!=prevDx && t>0)
        {
         
          highlightFor(rl,"red",2);
          highlightFor(rh,"red",2);
         
          
        }
       
        prevDx=ax;
      break;
      case CS_REG:
        if(ax!=prevCS && t>0)
        {
         
          highlightFor(rl,"red",2);
          highlightFor(rh,"red",2);
         
          
        }
       
        prevCS=ax;
      break;
      case IP_REG:
        if(ax!=prevIP && t>0)
        {
         
          highlightFor(rl,"red",1);
          highlightFor(rh,"red",1);
         
          
        }
       
        prevIP=ax;
      break;
      case SS_REG:
        if(ax!=prevSS && t>0)
        {
         
          highlightFor(rl,"red",2);
          highlightFor(rh,"red",2);
         
          
        }
       
        prevSS=ax;
      break;
      case SP_REG:
        if(ax!=prevSP && t>0)
        {
         
          highlightFor(rl,"red",2);
          highlightFor(rh,"red",2);
         
          
        }
       
        prevSP=ax;
      break;
      case BP_REG:
        if(ax!=prevBP && t>0)
        {
         
          highlightFor(rl,"red",2);
          highlightFor(rh,"red",2);
         
          
        }
       
        prevBP=ax;
      break;
      case SI_REG:
        if(ax!=prevSI && t>0)
        {
         
          highlightFor(rl,"red",2);
          highlightFor(rh,"red",2);
         
          
        }
       
        prevSI=ax;
      break;
      case DI_REG:
        if(ax!=prevDI && t>0)
        {
         
          highlightFor(rl,"red",2);
          highlightFor(rh,"red",2);
         
          
        }
       
        prevDI=ax;
      break;
      case DS_REG:
        if(ax!=prevDS && t>0)
        {
         
          highlightFor(rl,"red",2);
          highlightFor(rh,"red",2);
         
          
        }
       
        prevDS=ax;
      break;
      case ES_REG:
        if(ax!=prevES && t>0)
        {
         
          highlightFor(rl,"red",2);
          highlightFor(rh,"red",2);
         
          
        }
       
        prevES=ax;
      break;
    }
  

    //
    al.value=(ax&0x00ff).toString(16);
    ah.value=(ax>>8 &0xff).toString(16);
   
    
    if(getlength(al.value.toString(16))===1) al.value="0"+(ax&0x00ff).toString(16);
    if(getlength(ah.value.toString(16))===1) ah.value="0"+((ax>>8)&0x00ff).toString(16);
    }

//updateRegs
function updateRegs()
{
 updateReg('al','ah',AX_REG);
 updateReg('bl','bh',BX_REG);
 updateReg('cl','ch',CX_REG);
 updateReg('dl','dh',DX_REG);
 updateReg('cs_l','cs_h',CS_REG);
 updateReg('ip_l','ip_h',IP_REG);
 updateReg('ss_l','ss_h',SS_REG);
 updateReg('sp_l','sp_h',SP_REG);
 updateReg('bp_l','bp_h',BP_REG);
 updateReg('si_l','si_h',SI_REG);
 updateReg('di_l','di_h',DI_REG);
 updateReg('ds_l','ds_h',DS_REG);
 updateReg('es_l','es_h',ES_REG);
}
//getPos
function getPos(ele){
  var x=0;
  var y=0;
  while(true){
      x += ele.offsetLeft;
      y += ele.offsetTop;
      if(ele.offsetParent === null){
          break;
      }
      ele = ele.offsetParent;
  }
  return [x, y];
}
//console button
var tgole=1;

function hideConsole()
{
 
  tgole*=-1;
  let console_ref=document.getElementById("canvas_console");
  if(tgole==1)
  {
    console_ref.style.display="none";
   
}
  else {
    console_ref.style.display="";
 
  }
}
//hide comment
function instring(str, j) { //test if the current index is inside of a string

  let k1 = 0, k2 = 0;

  for (let i = 0; i < j; i++) {

      if (str[i] === "'" && str[i - 1] !== "\\") k1++;//count number of '
      if (str[i] === '"' && str[i - 1] !== "\\") k2++;//count number of "
  }
  
  return (k1 %2=== 1 || k2 % 2 === 1) 
}

function hide_comment(str) {//deletes comments from a string

  for ( var i = 0 ; i < str.length && (str[i] === ";" ? instring(str, i) : true ) ; i++ ){ }
 
  return str.substring(0, i);

}
function singleStepHandler()
{
  if(step>stepsLimit)
  {
    modal_end_exec_text.innerHTML="Execution ended : an infinite loop has been detected:  ,"+step+" times";
    modal_end_exec.show();
    document.getElementById("run_btn").disabled = true;
 
   return;
  }
 
  consoleStateManager[t]={cursorRam:p.cnsl.cursorRam,cursor:p.cnsl.cursor};
  step_back_btn.disabled=false;
 
  t++;
  ramStatesManager[t]=[];
  p.decode();
  
  
  updateRegState();
  //for the states table
  updateStates();

    searchRam(p.register.readReg(IP_REG));

  codeMirrorMarks.forEach((mark)=>{
    mark.clear();
  })
  let line =0;
  highlightingInfoTable.forEach((element)=>{
    if(element.addr ==p.register.readReg(IP_REG))
    {
    
     line = element.index;
    
    }
  })
  
  
  let tmp = codeMirror.markText({line:(line), ch:0},{line:(line), ch:50},{className:"mark_error"})
  codeMirrorMarks.push(tmp);
  if(((p.register.readReg(IP_REG)==0xfffe) && (p.register.readReg(SP_REG)==0)))
  {
    
    modal_end_exec_text.innerHTML="the execution ended succesfully";
    modal_end_exec.show();
    document.getElementById("run_btn").disabled = true;
  
   return;
  }
  
}
var step_back_btn = document.getElementById("step_back_btn");
function stepBackHandler()
{
  document.getElementById("run_btn").disabled = false;
  if(t<=0)
  {
     
     step_back_btn.disabled=true;
     t=0;
    return;
  }
  p.cnsl.cursorRam=consoleStateManager[t-1].cursorRam;
  p.cnsl.cursor=consoleStateManager[t-1].cursor;
  
  deleteAfterStepBack();
  //ram handling
 
  for(i=0;i<ramStatesManager[t].length;i++)//looping through all the addresses 
  //in the current state
  {
    
   
    p.RAM._writeByte(ramStatesManager[t][i].addr,ramStatesManager[t][i].prevVal);
  }
  ramStatesManager.splice(t,1);
  //reg handling
 
  RegStatesManager.splice(t,1);
  
  t--;
  applyRegsStateAt(t);
  RegStatesManager.splice(t,1);
  updateRegState();
 
  searchRam(p.register.readReg(IP_REG));
  codeMirrorMarks.forEach((mark)=>{
    mark.clear();
  })
  let line =0;
  highlightingInfoTable.forEach((element)=>{
    if(element.addr ==p.register.readReg(IP_REG))
    {
    
     line = element.index;
    
    }
  })
  
  
  let tmp = codeMirror.markText({line:(line), ch:0},{line:(line), ch:50},{className:"mark_error"})
  codeMirrorMarks.push(tmp);

  
}
function applyRegsStateAt(t1)
{
  if(t1<=t &&t1>=0)
  {
    p.register.writeReg(AX_REG,getRegStateAt(t1).ax);
    p.register.writeReg(BX_REG,getRegStateAt(t1).bx);
    p.register.writeReg(CX_REG,getRegStateAt(t1).cx);
    p.register.writeReg(DX_REG,getRegStateAt(t1).dx);
    p.register.writeReg(CS_REG,getRegStateAt(t1).cs);
    p.register.writeReg(IP_REG,getRegStateAt(t1).ip);
    p.register.writeReg(SP_REG,getRegStateAt(t1).sp);
    p.register.writeReg(BP_REG,getRegStateAt(t1).bp);
    p.register.writeReg(SI_REG,getRegStateAt(t1).si);
    p.register.writeReg(DI_REG,getRegStateAt(t1).di);
    p.register.writeReg(DS_REG,getRegStateAt(t1).ds);
    p.register.writeReg(ES_REG,getRegStateAt(t1).es);
    p.register.writeReg(FLAG_REG,getRegStateAt(t1).flags);
   
  }
  else console.log("ERROR:none valid state index");
}
//heighlight 
var originalColors=[];
 //
 /*
 updateReg('al','ah',AX_REG);
 updateReg('bl','bh',BX_REG);
 updateReg('cl','ch',CX_REG);
 updateReg('dl','dh',DX_REG);
 updateReg('cs_l','cs_h',CS_REG);
 updateReg('ip_l','ip_h',IP_REG);
 updateReg('ss_l','ss_h',SS_REG);
 updateReg('sp_l','sp_h',SP_REG);
 updateReg('bp_l','bp_h',BP_REG);
 updateReg('si_l','si_h',SI_REG);
 updateReg('di_l','di_h',DI_REG);
 updateReg('ds_l','ds_h',DS_REG);
 updateReg('es_l','es_h',ES_REG);
 */

 //
 function highlightInit(id)
 {
  var element = document.getElementById(id)
  var origcolor = element.style.backgroundColor,
      origfontcolor = element.style.color;
      originalColors.push({id:id,origcolor:origcolor,origfontcolor:origfontcolor});
 }
 highlightInit('al');
 highlightInit('bl');
 highlightInit('cl');
 highlightInit('dl');
 highlightInit('cs_l');
 highlightInit('ip_l');
 highlightInit('ss_l');
 highlightInit('sp_l');
 highlightInit('bp_l');
 highlightInit('si_l');
 highlightInit('di_l');
 highlightInit('ds_l');
 highlightInit('es_l');
 //
 highlightInit('ah');
 highlightInit('bh');
 highlightInit('ch');
 highlightInit('dh');
 highlightInit('cs_h');
 highlightInit('ip_h');
 highlightInit('ss_h');
 highlightInit('sp_h');
 highlightInit('bp_h');
 highlightInit('si_h');
 highlightInit('di_h');
 highlightInit('ds_h');
 highlightInit('es_h');
 //
  function highlightFor(id,color,seconds){
    var element = document.getElementById(id)
    var origcolor = element.style.backgroundColor,
        origfontcolor = element.style.color;

       

    element.style.backgroundColor = color;
    element.style.color = '#EEE';
   
  }

  function clearHighlighting()
  {
    originalColors.forEach((arrE)=>{
      var element = document.getElementById(arrE.id);
      element.style.backgroundColor = arrE.origcolor;
      element.style.color = arrE.origfontcolor;
     
    })
  
  

  }
  setInterval(clearHighlighting,2000);
 

//making the modal draggable

  var object = document.getElementById("modal_flags"),
  initX, initY, firstX, firstY;
  
  object.addEventListener('mousedown', function(e) {
  
      e.preventDefault();
      initX = this.offsetLeft;
      initY = this.offsetTop;
      firstX = e.pageX;
      firstY = e.pageY;
  
      this.addEventListener('mousemove', dragIt, false);
  
      window.addEventListener('mouseup', function() {
          object.removeEventListener('mousemove', dragIt, false);
      }, false);
  
  }, false);
  
  
  object.addEventListener('touchstart', function(e) {
  
      e.preventDefault();
      initX = this.offsetLeft;
      initY = this.offsetTop;
      var touch = e.touches;
      firstX = touch[0].pageX;
      firstY = touch[0].pageY;
  
      this.addEventListener('touchmove', swipeIt, false);
  
      window.addEventListener('touchend', function(e) {
          e.preventDefault();
          object.removeEventListener('touchmove', swipeIt, false);
      }, false);
  
  }, false);
  


function dragIt(e) {
    this.style.left = initX+e.pageX-firstX + 'px';
    this.style.top = initY+e.pageY-firstY + 'px';
}

function swipeIt(e) {
    var contact = e.touches;
    this.style.left = initX+contact[0].pageX-firstX + 'px';
    this.style.top = initY+contact[0].pageY-firstY + 'px';
}






function displayVars()
{
  //diplaying the states table

    let table=document.getElementById("table_variables").getElementsByTagName("tbody")[0];
  
    var arr=compileRes.varArray;
   
    for(let i=0;i<arr.length;i++)
    {
      
      let row = table.insertRow(-1);
      let cell0 = row.insertCell(0);
      let cell1 = row.insertCell(1);
      let cell2 = row.insertCell(2);
      let cell3 = row.insertCell(3);
      let name=compileRes.varArray[i].varName;
      let size=compileRes.varArray[i].size;
    
      cell0.innerHTML=name;
      cell1.innerHTML=arr[i].addr;
      let ascii;
      if(size=="BYTE")
      {
        cell2.innerHTML=p.RAM.readByte(arr[i].addr).toString(16);
         ascii=String.fromCharCode(p.RAM.readByte(arr[i].addr));
      }
      else if(size=="WORD")
      {
        cell2.innerHTML=p.RAM.readWord(arr[i].addr).toString(16);
        ascii=String.fromCharCode(p.RAM.readByte(arr[i].addr+1))+String.fromCharCode(p.RAM.readByte(arr[i].addr));
      }
     
     
      if( cell3.innerHTML===0) ascii="NULL";
      cell3.innerHTML=ascii;
      

    }
   
  }
  //
  function deleteVars()
{
  //diplaying the states table

    let table=document.getElementById("table_variables").getElementsByTagName("tbody")[0];
    let trs=table.getElementsByTagName("tr");
    for(let i=0;i<trs.length;i++)
    {
      table.deleteRow(-1);
    
    } 
 
   
  }
function updateStates()
{
  //diplaying the states table
let states_addresse_tr=document.getElementById("states_addresse_tr");
let states_prevVal_tr=document.getElementById("states_prevVal_tr");
let states_newVal_tr=document.getElementById("states_newVal_tr");
let states_index_tr=document.getElementById("states_index_tr");

 
    for(let j=0;j<ramStatesManager[t].length;j++)
    {
      let cell1=states_index_tr.insertCell(-1);
      cell1.className="td_ram";
      cell1.innerHTML=t;
      let cell2=states_addresse_tr.insertCell(-1);
     
      cell2.innerHTML="@"+ramStatesManager[t][j].addr.toString(16);
      let cell3=states_prevVal_tr.insertCell(-1);
      cell3.innerHTML="0x"+ramStatesManager[t][j].prevVal.toString(16);
      let cell4=states_newVal_tr.insertCell(-1);
      cell4.innerHTML="0x"+ramStatesManager[t][j].newVal.toString(16);
     
    }

    let arr_td=states_addresse_tr.getElementsByTagName('td');
    addingAddresseJumping(arr_td);
  }
  function addingAddresseJumping(arr_td)
  {
    for(var i=0;i<arr_td.length;i++)
    {
     
       
        let newVal=arr_td[i];
        arr_td[i].className="td_state";
        arr_td[i].style.cursor="pointer";
        arr_td[i].addEventListener("click",()=>{
        let physicalAddresse=newVal.innerText;
       
        physicalAddresse=physicalAddresse.substring(1,physicalAddresse.length);
      
        physicalAddresse=parseInt(physicalAddresse,16);
       
      
                     searchRam(physicalAddresse);

      })
    }
   
  }
  


  function deleteAfterStepBack()
  {
    //diplaying the states table
  let states_addresse_tr=document.getElementById("states_addresse_tr");
  let states_prevVal_tr=document.getElementById("states_prevVal_tr");
  let states_newVal_tr=document.getElementById("states_newVal_tr");
  let states_index_tr=document.getElementById("states_index_tr");
  
   
      for(let j=0;j<ramStatesManager[t].length;j++)
      {
        let cell1=states_index_tr.deleteCell(-1);
        let cell2=states_addresse_tr.deleteCell(-1);
        let cell3=states_prevVal_tr.deleteCell(-1);
        let cell4=states_newVal_tr.deleteCell(-1);
       
      }
    }
    function deleteAllStates()
    {
      let states_addresse_tr=document.getElementById("states_addresse_tr");
      let states_prevVal_tr=document.getElementById("states_prevVal_tr");
      let states_newVal_tr=document.getElementById("states_newVal_tr");
      let states_index_tr=document.getElementById("states_index_tr");
      
         for(let i=0;i<=t;i++)
         {
          for(let j=0;j<ramStatesManager[i].length;j++)
          {
            let cell1=states_index_tr.deleteCell(-1);
            let cell2=states_addresse_tr.deleteCell(-1);
            let cell3=states_prevVal_tr.deleteCell(-1);
            let cell4=states_newVal_tr.deleteCell(-1);
           
          }
         }
          
    }

    window.addEventListener("keydown",(e)=>
    {
   
   if(e.code=="ArrowRight")
   {
     singleStepHandler();
   }
   else if(e.code=="ArrowLeft")
   {
       stepBackHandler();
   }
   
    })
  

    //

window.addEventListener("resize",()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
})

window.addEventListener("keydown",(e)=>{
  console.log(e.key)
  if((e.key=" ")&&(intervalRun))
  {
    clearInterval(intervalRun);
  }
})

function hex(string) {

  let str = string.trim();

  if (/^[a-f0-9]+$/i.test(str)) {

      if ((parseInt(str, 16) >> 20) === 0)          
          return { message: "", value: parseInt(str, 16) }
      
      else           
          return  { message: "OUT OF BOUND", value: -1 }
      
  }
  else if (/^[a-f0-9]+\s*\:\s*[a-f0-9]+$/i.test(str)) {
     

      let offset = str.match(/(?<=:\s*)[a-f0-9]+/i)[0];
      let segment = str.match(/[a-f0-9]+(?=\s*\:)/i)[0];

      if ((parseInt(offset, 16) >> 16) === 0 && (parseInt(segment, 16) >> 16) === 0) {

          if (((parseInt(segment, 16) * 16 + parseInt(offset, 16)) >> 20) === 0)
              return { message: "", value: (parseInt(segment, 16) * 16 + parseInt(offset, 16))}
                  
          else
              return { message: "OUT OF BOUND", value: -1 }           
      }
      else
             return { message: "OUT OF BOUND", value: -1 }          
  }
  else
      return { message: "INVALID FORMAT", value: -1 }
}
