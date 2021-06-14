
     const select = document.querySelector('#groups'); 
     const messages = document.querySelector('#livearea'); 
     var id;
     let ws;
     var liveon=true;   
  (function() {
    let button =document.querySelector("#onOff");
    button.innerHTML=localStorage.getItem("liveDiscon")|| "connect";
    select.oninput = function grp(){
      let stdhtml=messages.childNodes;
      if(select.value=="All")
      {
        for (let index = 0; index < stdhtml.length; index++) {
            const element = stdhtml[index];
            element.style.display="";
         }s
      }
      else  {
           for (let index = 0; index < stdhtml.length; index++) {
            const element = stdhtml[index];
            console.log("*** ",element.innerHTML," **");
            let z=element.innerHTML.split("\n")[1][0];
            console.log("///////",z,"//////");
            
            if (select.value!=z.trim())  element.style.display="none";
            if (select.value==z.trim())  element.style.display="";
          }
      }
      
    }
    button.onclick=function onoff (){
      if (button.innerHTML=="disconnect"){
        liveon=false;
       // messages.style.display="none";
       
        ws.send(JSON.stringify({"method":"stop"}));
        button.innerHTML="connect";
        alert("disconnect");
        localStorage.setItem("liveDiscon","disconnect")
        
        return;
      }
      else if (button.innerHTML=="connect")
      {
         requestAll(ws);
         liveon=true;
        // messages.style.display="";
         ws.send(JSON.stringify({"method":"come"}));
         button.innerHTML="disconnect";
         alert("connect");
         localStorage.setItem("liveDiscon","disconnect")
         
         return;
      }
    }
    function requestAll(ws){
      if(!ws)
     ws.send(JSON.stringify({
        "method":"requestAll",
      }))  
    }
   
    //setInterval(()=>{requestAll(ws)},100000) 
   
    
    onconection={std:[],last:[],ids:[],group:[],numingrp:[]};
    list =[];
    ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
      setTimeout(()=> {ws.send(JSON.stringify({
        "method":"admin",
        "clientId":id
      }
      ))},500);  

      console.log('Connection opened!');
    }
    ws.onmessage = ({ data }) => {
      showMessage(data)
      
      //requestAll(ws);
    }    
    ws.onclose = function() {
      ws = null;
    }
       setTimeout(
    ()=>{setInterval( ()=>{ 
      if (liveon) requestAll(ws)
      },30000)},1000);
      
     function showMessage(message) { 
      if (isJsonParsable(message)){ 
        console.log(message);
        let obj = JSON.parse(message);
        let name;
        if (obj.name) name=obj.name.split('\n').shift();
        
        if (obj.method=="@has disconected@"){
          let index=onconection.std.indexOf(name);
            if (index!=-1){
                messages.childNodes[index].remove();
                onconection.std.splice(index,1);
                onconection.last.splice(index,1);
                onconection.ids.splice(index,1);
                list.splice(index,1);
                let i = onconection.group.indexOf(obj.name.split('\n').pop());
               
                onconection.numingrp[i]-=1;
              
                if(onconection.numingrp[i]===0)
                {
                  let array=select.childNodes;
                  console.log(array);
                        for (let index = 0; index < array.length; index++) {
                       const element = array[index];
                      if (element.innerHTML==onconection.group[i]){
                        
                         select.removeChild(element);
                       }
        
                        }
                  
                //  select.childNodes[index+1].remove();
                 
                  select.value=="all"
                  
                  onconection.group.splice(index,1);
                }
            }
          return;
        }
        if (obj.method=="code" && liveon){
          
          let code=obj.code
           //alert('code') ;
          // the live show just for the student in the lists
            let d = new Date();
            let index = onconection.std.indexOf(name)
            //mis a jour le contenue de l'element
            //alert(onconection.ids+"///"+onconection.std); 
           // alert("rrrrr "+index)
            if (index !=-1 ){
                 // alert(obj.clientId+"''''''"+onconection.ids)
                //  if (obj.clientId==onconection.ids[index]){
                  console.log(messages.children[index]);
                 list[index].setValue(code);
                  onconection.last[index]=d ;
                 /* }      
                  else{

                    ws.send(JSON.stringify({"method":"already in","clientId":obj.clientId}))
                    alert("another one is trying to accsess your account")
                  }*/
            }
            else {
              //creat a new element list
              let x=document.createElement("div");
              
              list.push(CodeMirror(x, {
                value: code,
                mode: 'asm86',
                theme: 'monokai',
                smartIndent: false,
                lineNumbers: true,
                indentWithTabs: true,
      
                readOnly: true
              }));
          
              messages.appendChild(x);
             // x.innerHTML="<h3>"+obj.name+" "+"</h3>"+"<br>"+code+"<br>"+d;
              onconection.std.push(name);
              onconection.last.push(d);
              let grp=obj.name.split('\n').pop();
              let index=onconection.group.indexOf(grp)
              if (index==-1){
                  onconection.group.push(grp);
                  onconection.numingrp.push(1);
                  let w=document.createElement("option");
                  w.innerHTML= grp;
                  select.appendChild(w);
                 
                  
                  console.log("hhhhhhhhhhhhh//////// ",grp+"******");
              }
              else{
                  onconection.numingrp[index]++;  
              }
              
            }
         

        }
        if (obj.method=="hello" && liveon){
           id=obj.clientId;
        }

       }
     }
  }
  )();

  // function verify if a string is a correct json form or not
     const isJsonParsable = string => {
                try {
                JSON. parse(string);
                } catch (e) {
                return false;
                }
                return true;
                }
            
       