
const express = require('express');
const { exists } = require('fs');
const http = require('http');
const WebSocket = require('ws');
const port = 8080;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server })
const clientsx={};
const admin=[];
let recive=true;

const std=[["moh"," 2"],["yas","2"],["dris","4"],["sdl","4"],["yanis","4"],["kamel","2"]]
var isJsonParsable = string => {
 
  try {
  JSON. parse(string);
  } catch (e) {
  return false;
  }
  return true;
  }
  setTimeout(()=>{setInterval( ()=>
    {  
    if(true || recive)
    {
    console.log((Object.keys(clientsx))); 
    for (id in clientsx) {  
      if (Object.hasOwnProperty.call(clientsx, id)) {
        const element = clientsx[id];
        if (!element.name) continue;
        let d= new Date;
        d=(d.getTime())-(element.last);  
        console.log(d+"  "+element.name+"  "+id+" ");
      if ((d > 25000)){
            console.log("disconnect");  
            for (let index = 0; index < admin.length; index++) {
              const element1 = admin[index];
              if (element1)
                  element1.connection.send(JSON.stringify({"name":element.name,"method":"@has disconected@"}))       
            }
            console.log(id);
            delete clientsx[id];
            console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww\n",clientsx);
        }
        
      }
    }
  }
},10000)},5000);
wss.on('connection', function connect(ws) {
  if(!recive){
    ws.send(JSON.stringify({
      "method":"the live is off"
    }))
  }
  

  
  const clientId = guid(); //guid is function generat random id
  
  clientsx[clientId] = {
      "connection": ws,
      "name":"",
      "last": new Date
  }
  // optimiziha later*******************************
  const payLoad = {
    "method": "hello",
    "clientId": clientId
  }
  // test it -----------------------------------
  if (Object.keys(clientsx).length > 45) payLoad.method="the room is full";
  //send back the client connect id
  ws.send(JSON.stringify(payLoad))
  
  ws.on('message', function incoming(data) {
    console.log(data+"******************");
   
    if ( isJsonParsable(data)){
      // the data is life cheak or an admin login
      let obj = JSON.parse(data);
      if (recive && obj.method=="the live"){
      console.log("**************************************");
      console.log(obj.clientId+"&&&&&&&&&"+obj.fakeId);
      let name=obj.name.split('\n').shift();
      let group=obj.name.split("\n").pop().trim();
      let tmp=false;
      let index 
      for (index = 0; index < std.length; index++) {
        const element = std[index];
        
        if (element[0]==name && element[1]==group){
          tmp=true;
          break;
        }
        console.log("**************************************",tmp);
        
      }
      if (!tmp){ws.send((JSON.stringify({"method":"wrongName","name":obj.name,"h":"rr","arr":std,"info":std[index][0]+std[index][1]})))}
     /* if (Object.hasOwnProperty.call(clientsx,obj.clientId ) )
      clientsx[obj.clientId].name=obj.name*/
      if (Object.hasOwnProperty.call(clientsx,obj.fakeId ) )
      clientsx[obj.fakeId].name=obj.name
        if (Object.hasOwnProperty.call(clientsx,obj.clientId ) && Object.hasOwnProperty.call(clientsx,obj.fakeId))
     { 
      //let x=obj.clientId
     // clientsx[x]={};
      console.log("firsssssssssssssssssssst\n\n\n"+"firssssssssssssssssssst\n\n\n")
      clientsx[obj.clientId].connection=clientsx[obj.fakeId].connection;
     // clientsx[obj.clientId].name=obj.name;
      clientsx[obj.clientId].last=new Date;
      delete  clientsx[obj.fakeId];
      ws.send(JSON.stringify({"method":"idUpdate","clientId":obj.clientId}))
         }
          
      else {
        let exist=false;
       for (const key in clientsx) {
         if (Object.hasOwnProperty.call(clientsx, key)) {
           const element = clientsx[key];
           console.log("exissssssssssst ",exist,"----       ----",obj.name,"----       ----",element.name);
          if (element.name===obj.name && key!=obj.clientId && key!=obj.fakeId){
            exist=true
            console.log("alreeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeedy\n\n\n\nalreeeeeeeeeedy ",exist);
            break;
          }  
          
           
         }
        }
       if(!(Object.hasOwnProperty.call(clientsx,obj.clientId )) && obj.clientId!=null)
       {
        ws.send(JSON.stringify({"method":"stay","fakeId":obj.fakeId}))
       
       }
       if (exist) {
         console.log("bbbbbbbbbbbbbbbbbbbbbb\n\n"+obj.clientId+"\n"+obj.fakeId+"\nbbbbbbbbbbbbbbbbbbb\n\n\n");
         if (Object.hasOwnProperty.call(clientsx,obj.clientId ) )
         delete clientsx[obj.clientId];
         if (Object.hasOwnProperty.call(clientsx,obj.fakeId ) )
         delete clientsx[obj.fakeId]
         
         delete clientsx[obj.clientId];
         ws.send(JSON.stringify({"method":"already in","clientId":obj.clientId,"fakeId":obj.fakeId}))
       }
      }
       
      }
    
      else if (recive && obj.method==="a life"){
        console.log("live cheacking");
        //console.log("");
        if (clientsx[obj.clientId]!=undefined){
        clientsx[obj.clientId].last =obj.last;
       // clientsx[obj.clientId].name =obj.name;
        }
      }
      else if (obj.method==="admin"){
        if (Object.hasOwnProperty.call(clientsx,obj.clientId ) ){
         admin.push(clientsx[obj.clientId]);
         delete clientsx[obj.clientId];
         console.log("///"+clientsx[obj.clientId]);
        }
        for (const key in clientsx) {
          if (Object.hasOwnProperty.call(clientsx, key)) {
            const element = clientsx[key];
            element.connection.send(JSON.stringify({
              "method":"requestAll",
            }))
            
          }
        }
      }

      else if (recive && obj.method=="code") {
       console.log(" the data is a code object");
       //console.log("xxxxxxxxxxxxxxxxx",obj.clientId);
       
        for (let index = 0; index < admin.length; index++) {
          const element1 = admin[index];
         // console.log("data sent ");
         if (element1)  element1.connection.send(data)       
        }
  
      }
       else if(recive && obj.method=="requestAll"){
         
         
      
        for (const key in clientsx) {
          if (Object.hasOwnProperty.call(clientsx, key)) {
            const element = clientsx[key];
            element.connection.send(JSON.stringify({
              "method":"requestAll",
            }))
            
          }
        }
      }
      else if(obj.method=="yamito kota say"){

          console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nhhhhhhhhhhhhhhhhhhhh\n\n\nsS")
        
        delete clientsx[obj.clientId];
        console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nhhhhhhhhhhhhhhhhhhhh\n\n\nsS")
        for (let index = 0; index < admin.length; index++) {
          const element1 = admin[index];
          if (element1)
              element1.connection.send(JSON.stringify({"name":obj.name,"method":"@has disconected@"}))       
        }
      
      }
      else if(obj.method=="stop"){
        recive=false;
        for (const key in clientsx) {
          if (Object.hasOwnProperty.call(clientsx, key)) {
            const element = clientsx[key];
            element.connection.send(JSON.stringify({
              "method":"the live is off"
            }))
            
          }
        }
       
      }
      else if(obj.method=="come"){
        recive=true;
      }

      
    }

  })
}

)

server.listen(port, function() {
  console.log(`Server is listening on ${port}!`)
})

function S4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}

// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
//400+1150+100+750+1270+520+810+3400+320+120+250+130+460+1350+50+100+270
//3400+320+120+250+130+460+1350+50+100+270











obj ={
  "method":"", // a string refer to what the object do
  // ex:"method":"the live is off" or "method":"i am admin"
  "name":"",// a string contain the name of the steudent + his group
  //ex:"name"
  "clientId":"",// the id of the client
  "fakeId":"",//a temperal id for the client
  "last":"" // number hold the last time the steudent has send
  // his verfivation
}


/**
 * 
 * 
 * 
 * 
 *  <link rel="stylesheet" href="{% static 'css/codemirror.css' %}">
    <link rel="stylesheet" href="{% static 'css/monokai.css' %}">
    <link rel="stylesheet" href="{% static 'css/bs5/css/bootstrap.css' %}">
    <link rel="stylesheet" href="{% static 'css/styles.css' %}">
    <style>
    #connect
  {
    float:left;
    position:relative;
    width:120px;
    height:40px;
    -webkit-appearance:none;
    background:linear-gradient(0deg,#333,#000);
    outline:none;
    border-radius:20px;
     box-shadow: 0 0 0 4px #353535,0 0 0 5px #3e3e3e, inset 0 0 10px
      rgba(0,0,0,1),0 5px 20px rgba(0,0,0,.5),inset 0 0 15px 
      rgba(0,0,0,.2) ;
   
  }
  #connect:after
  {
    
    position: absolute;
    content:'';
    top:0;
    left:0;
    width:80px;
    height:40px;
    background:linear-gradient(0deg,#000,#6b6b6b);
    border-radius:20px;
    box-shadow:0 0 0 1px #232323;
    transform:scale(.98,.96);
    transition:.5s;

  }
  #connect:checked:after
  {
    left:40px;

  }
  #connect:before
  {
    
    position: absolute;
    content:'';
    top:calc(-50% - 2px);
    left:70px;
    width:4px;
    height:4 px;
    background:#000;
    border-radius:2px;
    transition:.5s;

  }
    #connect:checked:before
  {
    left:105px;
    background:#63cdff;
    box-shadow:0 0 5px #13b3ff,0 0 15px #13b3ff

  }
      #connect:checked
  {
   background:linear-gradient(0deg,#6dd1ff,#20b7ff );
      box-shadow: 0 0 0 4px #353535,0 0 0 5px #3e3e3e, inset 0 0 10px
      rgba(0,0,0,1),0 5px 20px rgba(0,0,0,.5),inset 0 0 15px 
      rgba(0,0,0,.2) ;
   
  }


    </style>
   
 * 






 *  <!--scripts------------------------------------------------------------------------------------------------>
    <script src="{% static 'js/codemirror.js' %}"></script>
    <script src="{% static 'js/simple.js' %}"></script>
    <script src="{% static 'css/bs5/js/bootstrap.js' %}"></script>
    <script src="{% static 'js/ConsoleW.js' %}"></script>
    <script src="{% static 'js/Emulator/OPCODES.js' %}"></script>
    <script src="{% static 'js/Emulator/Memory.js' %}"></script>
    <script src="{% static 'js/Emulator/Registers.js' %}"></script>
    <script src="{% static 'js/Emulator/processor.js' %}"> </script>
    <script src="{% static 'js/Compiler/ASMEncoder.js' %}"> </script>
    <script src="{% static 'js/Compiler/LexicalAnalysis.js' %}"> </script>
    <script src="{% static 'js/Compiler/Linkage.js' %}"> </script>
    <script src="{% static 'js/Compiler/Preprocessor.js' %}"> </script>
    <script src="{% static 'js/Compiler/SynthaxeAnalysis.js' %}"> </script>
    <script src="{% static 'js/Compiler/Compilater.js' %}"> </script>
 */





