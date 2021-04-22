
     var scrollTop=0;
     var scrollLeft=0;
     var segmentStart=0;
     var segmentPrevStart=0;
     var persentageSeg=0.005;
     var upPressed=false;
     var p=new Processor();
     function animate()
     {
        
        
             ctx.clearRect(0,0,p.width,p.height);
             let j=0;
             
             for(var i=0;i<p.cnsl.cursorRam &&j<p.cnsl.cursorRam  ;i+=2)
             {
               
                 let byte1=p.cnsl.ram.readByte((p.cnsl.videoMemorySegement<<4)+i);
                 let byte2=p.cnsl.ram.readByte((p.cnsl.videoMemorySegement<<4)+i+1);
                
                 p.cnsl._writeChar(j,String.fromCharCode(byte1),byte2%16,(byte2>>4)&0xff);
                

                 j++;
             }
             
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
     
     animate();
     
     
     //fixing the header
     var th=document.getElementById("table_header");
     var table_ram=document.getElementsByClassName("scroll_it")[0];;
  

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
     function search(inputVal) {
        // Declare variables
        var  table, tr, td, i, txtValue;
       
        inputVal=inputVal.toString(16);
        
       
        table = document.getElementById("table_ram").getElementsByTagName('tbody')[0];
        tr = table.getElementsByTagName("tr");
      
       
        for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName("td")[0].innerHTML.toString(16);
          td=td.replace("@","");
        
          if (parseInt(td,16)-parseInt(inputVal,16)<0) {
          
              
         tr[i].style.display="none";
          }
          else  tr[i].style.display="";
        }
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
                let regex=/^([a-fA-F0-9]{4}):([a-fA-F0-9]{4}$)/;//segment:offset regex
                let regexPYs=/([a-fA-F0-9])/;
                if(regex.test(val)===true)
                {
                       let  index=val.search(/:/);
                       let  segment=val.substring(0,index);
                      
                       let offset=val.substring(index+1,val.length);
                       let physicalAddresse=(parseInt(segment,16)<<4)+parseInt(offset,16);
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
                       //search(physicalAddresse);
                      


                      
                       

                }
                else if(regexPYs.test(val)===true)
                {
                   
                   let physicalAddresse=parseInt(val,16);
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
                else alert("Please enter a hexadecimal value");
               
            }
       }
       )
    








     //
     function getlength(number) {
      return number.toString().length;
  }
     //
    
      var displayigBase=16;
      let altern=0;
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
      function upadateTable(r,c,content)
     {
      x=document.getElementById("table_ram").rows[r].cells;
      x[c].innerHTML=content;
     }
      //
    

      
  
     for(let i=0;i<(0xffff)*persentageSeg;i++)
     {
       addRow(i+segmentStart,p.RAM.getBufferAt(i+segmentStart));
      
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
     updateRam();
    setInterval(updateRam,500);
    //register.js
    function getlength(number) {
    return number.toString().length;
}
    
     //ax
     function updateReg(rl,rh,rId)
     {
      let al=document.getElementById(rl);
      let ah=document.getElementById(rh);
      let ax=p.register.readReg(rId);//0101  
      al.value=(ax&0x00ff).toString(16);
      ah.value=(ax>>8 &0xff).toString(16);
     
      
      if(getlength(al.value.toString(16))===1) al.value="0"+(ax&0x00ff).toString(16);
      if(getlength(ah.value.toString(16))===1) ah.value="0"+((ax>>8)&0x00ff).toString(16);
      }
     
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
     updateRegs();     
      setInterval(updateRegs,100);

  //getting textArea value
  var  textArea=document.getElementById("myTextArea");
  var code_compile_btn=document.getElementById("code_compile_btn");
  var text;
  var  arrayOfLines;
  code_compile_btn.addEventListener("click",
  function(e)
  {
    text= textArea.value;
    console.log("the text:",hide_comment(text));  
   
     arrayOfLines = text.match(/[^\r\n]+/g);
     var k=0;
   for(let i=0;i<arrayOfLines.length;i++)
   {
     let opCodeLine=arrayOfLines[i];
     if(opCodeLine.length>5)
     {
       opCodeLine=toBcode(arrayOfLines[i]);
        
      
     for(let j=0;j<opCodeLine.length;j++)
     {
       p.RAM.writeByte(k,opCodeLine[j]);
       k++;
     }

     }
     
     p.decode();
   }
  
  }
  )
  
//reload button
  let reload_btn=document.getElementById('reload_btn');
  reload_btn.addEventListener("click",
  function()
  {
    p.initReg();
    p.initRam();
    p.cnsl.initCanvas();
    ctx.fillRect(0,0,p.width,p.height);
    
  
  }
  )
  
  
    //!!!test area:(the instance p of processor is already declared)--------------------------------------------------------------------------
    //shr [bx],cl      ;     210,
   
    //p.register.writeReg(AX_REG,0x2587);
   //  p.register.writeReg(BX_REG,310);
   //  p.register.writeReg(CX_REG,8);
    // p.RAM.writeWord(10,0xfff5)
   // p.RAM.writeWord(7,p.register.readReg(AX_REG));
    // 
   
   
    
    
     
     
   
   // p.RAM.writeWord(10,p.register.readReg(AX_REG));
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
