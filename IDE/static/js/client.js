

    const button=document.querySelector('#discon');

    const butt=document.querySelector('#connect');
    const par=document.querySelector('#fuck');
    
      let ws;
     var id;
     var wrong=false;
     var names;
       
       //get the last state of button connect/disconnect
       par.innerHTML=localStorage.getItem("discon")|| "click to connect";

       if (par.innerHTML=="click to disconnect") {
        connect();
        console.log(butt.checked);
        butt.checked=true;

      }
       // assign the function discon to the event onclick
       butt.onclick= discon;
        function discon(){
       if (par.innerHTML=="click to disconnect" ){

        deleteme(localStorage.getItem("name"));
        wrong = true;
        par.innerHTML="click to connect";
        localStorage.setItem("discon","click to connect")
        return;
      }
       if (par.innerHTML=="click to connect" )
      { 
         par.innerHTML="click to disconnect";
         wrong=false;
         connect();
         localStorage.setItem("discon","click to disconnect")
         return;
      }

    };
      function deleteme(x){
      ws.send(JSON.stringify({"method":"yamito kota say","clientId":id,"name":x}));
  
      ws.close();
    }
    const isJsonParsable = string => {
          try {
          JSON. parse(string);
          } catch (e) {
          return false;
          }
          return true;
          }

    function connect() {
    //get the name of the steudent
    names=localStorage.getItem("name");
   
    function showMessage(message) {
      alert(message)
    }
    //if the steudent is not registed nothing will happen
    if (names){
      // connect to the server
      ws = new WebSocket('ws://localhost:8080');
      ws.onopen = () => {
        console.log('Connection opened!')
        //send code after 5 seconds
        setTimeout(sendCode,5000)
      };
      
      ws.onmessage = ({ data }) =>{
        //cheak if it is correct json form
        if (isJsonParsable(data)) {
          obj=JSON.parse(data)
          // the client is already registed from another place
          if(obj.method === "already in"){
            alert("u are already logged in form another place");
            wrong=true;
            return;
          }// the name of the student is wrong or does not exist 
          else if  (obj.method === "wrongName"){
            alert("u name is wrong or not in the list  \n please regite again ");
            wrong=true;
            return;
          }// the number of the student is more then 50
          else if  (obj.method === "the room is full"){
          wrong=true;
          showMessage(obj.method);
          return;
          }// change the id of the client to his old id(which was in cookies)
          else if  (obj.method === "idUpdate"){

            id=obj.clientId;
            return;
          }// keep your id the same
          else if  (obj.method === "stay"){

            id=obj.fakeId;
            localStorage.setItem("id",id);
            //alert("hi");
             
          }// the admin demand to sendcode
          else if  (obj.method === "requestAll"){
              //discon(true)
              sendCode();             
          }// the button live is disconnected 
          else if  (obj.method === "the live is off"){
            par.innerHTML="click to disconnect";
            alert("the live is off")
            butt.checked=false;
            discon();
            //discon();           
          }// getting started and reciving the id
          else if  (obj.method === "hello"){
            id=obj.clientId;
            
            preid=localStorage.getItem("id");
            alert("hi  ",preid);
            ws.send(JSON.stringify({"method":"the live","clientId":preid,"name":names,"fakeId":id}))
            
          }
        }
        else
           showMessage(data);
      }
     ws.onclose = function() {
         ws=null;
      }

      codeMirror.on('change', sendCode);

      function sendCode() {
            
          if (!ws || wrong ) {
            //showMessage("somthing goes wrong");
            return ;
          }
          ws.send(JSON.stringify({
            "method":"code",
            "code":codeMirror.getValue(),
            "name":names,
            "clientId":id
            }
            ));
        }
    
    let  payLoad 
    setTimeout(()=>{setInterval(function(){
      let x = new Date
        
         payLoad={
          "method":"a life",
          "clientId":id,
          "name":names,
          "last": x.getTime()
       }
      if (ws) ws.send(JSON.stringify(payLoad));
       console.log("h    ",id);
        },5000)},5000);
    }
  }
