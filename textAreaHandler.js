

  let registers = /\bAX([^a-z0-9])|\bBX[^a-z0-9]|\bCX[^a-z0-9]|\bDX[^a-z0-9]|\bCS[^a-z0-9]|\bDS[^a-z0-9]|\bES[^a-z0-9]|\bSS[^a-z0-9]|\bDI[^a-z0-9]|\bSI[^a-z0-9]|\bSP[^a-z0-9]|\bBP[^a-z0-9]|\bIP[^a-z0-9]/ig
 
let directives = /\bORG[^a-z0-9]|\bDEFINE[^a-z0-9]|\bEQU[^a-z0-9]|\bPROC[^a-z0-9]|\bLOCAL[^a-z0-9]|\bENDM[^a-z0-9]|\bENDP[^a-z0-9]|\bOFFSET[^a-z0-9]/gi

var instructions = /\bMOV[^a-z0-9]|\bPUSH[^a-z0-9]|\bPOP[^a-z0-9]|\bXCHG[^a-z0-9]|\bLEA[^a-z0-9]|\bLAHF[^a-z0-9]|\bSAHF[^a-z0-9]|\bPUSHF[^a-z0-9]|\bPOPF[^a-z0-9]|\bADD[^a-z0-9]|\bADC[^a-z0-9]|\bDEC[^a-z0-9]|\bINC[^a-z0-9]|\bAAA[^a-z0-9]|\bSUB[^a-z0-9]|\bSSB[^a-z0-9]|\bNEG[^a-z0-9]|\bCMP[^a-z0-9]|\bMUL[^a-z0-9]|\bIMUL[^a-z0-9]|\bDIV[^a-z0-9]|\bIDIV[^a-z0-9]|\bCBW[^a-z0-9]|\bCWD[^a-z0-9]|\bNOT[^a-z0-9]|\bSHL[^a-z0-9]|\bSAL[^a-z0-9]|\bSHR[^a-z0-9]|\bSAR[^a-z0-9]|\bROL[^a-z0-9]|\bROR[^a-z0-9]|\bRCL[^a-z0-9]|\bRCR[^a-z0-9]|\bAND[^a-z0-9]|\bTEST[^a-z0-9]|\bOR[^a-z0-9]|\bXOR[^a-z0-9]|\bREP[^a-z0-9]|\bMOVSB[^a-z0-9]|\bCMPSB[^a-z0-9]|\bSCASB[^a-z0-9]|\bLODSB[^a-z0-9]|\bSTOSB[^a-z0-9]|\bMOVSW[^a-z0-9]|\bCMPSW[^a-z0-9]|\bSCASW[^a-z0-9]|\bLODSW[^a-z0-9]|\bSTOSW[^a-z0-9]|\bCALL[^a-z0-9]|\bJMP[^a-z0-9]|\bRET[^a-z0-9]|\bJE[^a-z0-9]|\bJZ[^a-z0-9]|\bJL[^a-z0-9]|\bJNGE[^a-z0-9]|\bJLE[^a-z0-9]|\bJNG[^a-z0-9]|\bJB[^a-z0-9]|\bJNAE[^a-z0-9]|\bJBE[^a-z0-9]|\bJNA[^a-z0-9]|\bJP[^a-z0-9]|\bJPE[^a-z0-9]|\bJO[^a-z0-9]|\bJS[^a-z0-9]|\bJNE[^a-z0-9]|\bJNZ[^a-z0-9]|\bJNL[^a-z0-9]|\bJGE[^a-z0-9]|\bJNLE[^a-z0-9]|\bJG[^a-z0-9]|\bJNB[^a-z0-9]|\bJAE[^a-z0-9]|\bJNBE[^a-z0-9]|\bJA[^a-z0-9]|\bJNP[^a-z0-9]|\bJPO[^a-z0-9]|\bJNO[^a-z0-9]|\bJNS[^a-z0-9]|\bLOOP[^a-z0-9]|\bLOOPZ[^a-z0-9]|\bLOOPE[^a-z0-9]|\bLOOPNZ[^a-z0-9]|\bLOOPNE[^a-z0-9]|\bJCXZ[^a-z0-9]|\bINT[^a-z0-9]/ig





let textArea1 = document.getElementById("myTextArea");
let customArea = document.querySelector(".custom-area");
let backdrop = document.querySelector(".backdrop");
let count = document.getElementById("count");


// Event listeners.

textArea1.addEventListener("input", function(e)
{

  customArea.innerHTML =applyColors(textArea1.value)
  

    })

var s1 = document.getElementById('myTextArea');
var s2 = document.getElementById('count');

function select_scroll_1(e) { s2.scrollTop = s1.scrollTop; }
function select_scroll_2(e) { s1.scrollTop = s2.scrollTop; }

s1.addEventListener('scroll', select_scroll_1, false);
s2.addEventListener('scroll', select_scroll_2, false);

textArea1.addEventListener("scroll", function()
{
    backdrop.scrollTop = textArea1.scrollTop;
});


function applyColors(text)

{



text = text.replace(registers, function(m)
    {  
      //console.log(all_regex)
      let c = "orange"
   
        return `<span class="re">${m}</span>`;
    }).replace(directives, function(m){

       let c = "cyan"
   
        return `<span class="dir">${m}</span>`;

    }).replace(instructions, function(m){
      let c = "violet"
   
        return `<span class="ins">${m}</span>`;

    }).replace(/\b0x[0-9a-f]+[^a-z0-9]|\b[a-f0-9][^a-z0-9]+h|\b0b[0-1][^a-z0-9]+|\b\d+[^a-z0-9]/gi, function(m){
      
         return `<span class="digit">${m}</span>`
    }).replace(/(\;(.*)\n?)/gi, function(m){
      let c = "yellow"
       if(m.match(/\;{1,}<span class="ins">/giy)) m = m.replaceAll(/<span class="ins">/gi,`<span class="comments">`)
       if(m.match(/\;{1,}<span class="re">/giy)) m = m.replaceAll(/<span class="re">/gi,`<span class="comments">`)
       if(m.match(/\;{1,}<span class="dir">/giy)) m = m.replaceAll(/<span class="dir">/gi,`<span class="comments">`)
       
       if(m.match(/\s*<span class="ins">/gi)) {
        
        m = m.replaceAll(/<span class="ins">/gi,`<span class="comments">`)}
        if(m.match(/\s*<span class="re">/gi)) m = m.replaceAll(/<span class="re">/gi,`<span class="comments">`)
          if(m.match(/\s*<span class="dir">/gi)) m = m.replaceAll(/<span class="dir">/gi,`<span class="comments">`)

          if(m.match(/\;.*<span class="digit">/giy)) m = m.replace(/<span class="digit">/gi,`<span class="comments">` );

  
      
        return `<span class="comments">${m}</span>`;
        }).replace(/\'(.*)'/gi, function(m){


          if(m.match(/\'{1,}<span class="ins">/giy)) m = m.replaceAll(/<span class="ins">/gi,`<span class="strings">`)
       if(m.match(/\'{1,}<span class="re">/giy)) m = m.replaceAll(/<span class="re">/gi,`<span class="strings">`) 
        
       if(m.match(/\'{1,}<span class="dir">/giy)) m = m.replaceAll(/<span class="dir">/gi,`<span class="strings">`)

       if(m.match(/\s*<span class="ins">/gi)) m = m.replaceAll(/<span class="ins">/gi,`<span class="strings">`)
        if(m.match(/\s*<span class="re">/gi)) m = m.replaceAll(/<span class="re">/gi,`<span class="strings">`)
          if(m.match(/\s*<span class="dir">/gi)) m = m.replaceAll(/<span class="dir">/gi,`<span class="strings">` );

         if(m.match(/\s*<span class="digit">/gi)) m = m.replaceAll(/<span class="digit">/gi,`<span class="strings">` );


          return `<span class="strings">${m}</span>`;
        }).replace(/(?<=\s+)".*"/gi, function(m){ 
      
         return `<span class="strings">${m}</span>`
})

        if(t>0)
        {
          text = applyhighliting(text, t-1);
        }
        
       



return text;

}

var index=0;



function applyhighliting(text, index){
  let a  = text.split("\n")

  //here you can apply highliting 
  if(a.length > index){
  let c = a[index]
  if(c.slice(0,7) =='</span>') c = c.slice(7, c.length) 



  c = `<span class="highliting">${c}</span>`

  
    a[index] = "</span>"+c
    text= a.join("\n");


}

  return text
  }

function getText(text){
  text  = text.replace(/<span .+>/, '').replace(/<\/span>/, '');
  return text;
}
