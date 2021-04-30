var canvas=document.getElementById('canvas_console');
var ctx=this.canvas.getContext("2d");
var theKey;
var enterPressed=false;
var keyStored=false;
async function waitEnter() 
  {
    console.log('waiting Enterkeypress..');
    await waitingEnterKeypress();
    console.log('enterKey pressed');
  }
  async function waitkey() 
  {
    console.log('waiting keypress..................');
    await waitingKeypress();
    console.log('key pressed........................');
  }
  function waitingEnterKeypress() 
    {
    return new Promise((resolve) => {
      document.addEventListener('keydown', onKeyHandler);
      function onKeyHandler(e) {
        
         

        if (e.key =="Enter") {
            enterPressed=true;
          document.removeEventListener('keydown', onKeyHandler);
          resolve();
        }
      }
    });
  }
  //
  function waitingKeypress() 
    {
    return new Promise((resolve) => {
      document.addEventListener('keydown', onKeyHandler);
      function onKeyHandler(e) {
         

        if (e.key!="Enter" && e.key.length==1) {
            theKey = e.key;
            keyStored=true;
             console.log("you entered:",theKey);
          document.removeEventListener('keydown', onKeyHandler);
          resolve();
        }
      }
    });
  }
//
function delay(ms) 
  {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
 
  
  async function delayMs(ms) 
  {
     await delay(ms);
  }
class ConsoleW{

       
        constructor(p)
        {
            
            this.height=canvas.height;
            this.width=canvas.width;
            this.fontSize=10;
            this.font=this.fontSize+"px Arial";
            this.fg=15;
            this.bg=0;
            this.fontColor=COLOR_TABLE[this.fg];
            this.fontBackgroundColor=COLOR_TABLE[this.bg];
            this.cursor=0;
            this.cursorRam=0;
            this.videoMemorySegement=0xb800;
            this.charNum=Math.floor(this.width/this.fontSize);
            this.readMode=false;
            this.key;
            
          //  this.initCanvas();
        
           
            this.ram=p.RAM;
            this.p=p;
           
          
        }
        initCanvas()
        {
           
          ctx.clearRect(0,0,canvas.width,canvas.height);
          this.cursor=0;
          this.cursorRam=0;
          

        }
        _writeChar(offset,char,fg=this.fg,bg=this.bg)
        {
            ctx.beginPath();
            ctx.font = this.font;
            let w=Math.floor(this.width/10);
            let y=Math.floor(offset/(w));
            let x=offset%(w);
            ctx.fillStyle =COLOR_TABLE[bg];
            ctx.fillRect(x*10, y*10, this.fontSize, this.fontSize);
            ctx.fillStyle =COLOR_TABLE[fg];
            ctx.fillText(char,x*10, y*10+10);
            ctx.closePath();
        }
       
        writeChar(char,fg=this.fg,bg=this.bg)
        {
            if(fg>16 || bg>16)
            {
                console.log('ERROR:fg and bg must be between 0 and 16');
            }
            else
            {
                let asciiVal;
                if(char=="") asciiVal=0;
                else  asciiVal=char.charCodeAt(0);
                this.ram.writeByte((this.videoMemorySegement<<4)+this.cursorRam,asciiVal);
                this.ram.writeByte((this.videoMemorySegement<<4)+this.cursorRam+1,((bg<<4)&0xffff)+fg);
                this.cursorRam+=2;
                this.cursor++;
            }
           
            
        }
        updateCursor()
        {
            let w=Math.floor(this.width/10);
          
            let y=Math.floor(this.cursor/(w));
            let x=this.cursor%(w);
           
            
            
           
                setTimeout(()=>{
                    ctx.beginPath();
                    ctx.moveTo(x*10,y*10+2);
                    ctx.lineTo(x*10,y*10+10);
                    ctx.strokeStyle="white";
                    ctx.lineWidth=1;
                    ctx.stroke();
                    ctx.closePath();
                },500)
               
                
          
                 setTimeout(()=>{
                    ctx.fillStyle ="black";
                    ctx.clearRect(x*10, y*10, ctx.lineWidth, this.fontSize);
                  },1000)
           
               
            
          
        }
        readChar()
        {
           this.key=undefined;
           theKey=undefined;
           this.readMode=true;
           this.p.pause=true;
           waitkey();
          
           
        }
        _waitForKey()
        {
               if(keyStored)
               {
                this.key=theKey;
                console.log("key is stored");
                this.writeChar(this.key);
                this.readMode=false;
                this.p.pause=false;
              
               }
               
            
        }
        setKeyToReg(XX_REG,REG_type)
        {
            if(this.key!=undefined)
            {
              
                  if(REG_type===XX)
                  {
                    this.p.register.writeReg(XX_REG,(this.key.charCodeAt(0)));
                  }
                  else if(REG_type===XL)
                  {
                    this.p.register.writeReg(XX_REG,(this.key.charCodeAt(0))&0x00ff);
                  }
                  else if(REG_type==XH)
                  {
                    this.p.register.writeReg(XX_REG,(this.key.charCodeAt(0))&0xff00);
                  }

               
            }
            else console.log("ERROR CANVAS:the key is undefined!");
            
        }
        setKeyToMemByte(addr)
        {
            if(key!=undefined)
            {
                this.ram.writeByte(addr,parseInt(this.key));
            }
            
        }
        setKeyToMemWord(addr)
        {
            if(key!=undefined)
            {
                this.ram.writeWord(addr,parseInt(this.key));
            }
            
        }
        
        
        




}
const XL=0,XH=1,XX=2;
const   
BLACK="black",
BLUE="blue",
GREEN="green",
 CYAN="cyan",
 RED="red",
 MAGENTA="magenta",
 BROWN="brown",
 LIGHT_GRAY="lightgray",
 DARK_GRAY="darkgray",
 LIGHT_BLUE="lightblue",
 LIGHT_GREEN="lightgreen",
 LIGHT_CYAN="lightcyan",
 LIGHT_RED="#fffcccb",
 LIGHT_MAGENTA="#ff80ff",
 YELLOW="yellow",
 WHITE="white";
const
COLOR_TABLE = [BLACK, BLUE, GREEN, CYAN,RED,MAGENTA,BROWN,LIGHT_GRAY,DARK_GRAY,LIGHT_BLUE,LIGHT_GREEN,LIGHT_CYAN,LIGHT_RED,LIGHT_MAGENTA,YELLOW,WHITE];
