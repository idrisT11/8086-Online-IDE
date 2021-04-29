//NOTE A FAIRE
//GERER DB ET DW

const FLOW_INSTRUCTION = ['JMP', 'CALL', 'JE', 'JNE', 'JZ', 'JL', 'JNGE', 'JLE', 'JNG', 'JB', 'JNAE', 'JBE', 'JNA', 'JP', 'JPE', 'JP', 'JS', 'JNZ', 'JGE', 'JNLE', 'JNL', 'JG', 'JNB', 'JAE', 'JNBE', 'JA', 'JNP', 'JPO', 'JNO', 'JNS', 'LOOP', 'LOOPZ', 'LOOPE', 'LOOPNZ', 'LOOPNE']
const LONG_FLOW = ['JMP', 'CALL']

class Linkage{
    
    constructor(varArray, labelArray, origine){


        this.origine = origine;
        
        this.varArray = varArray;
        this.labelArray = labelArray;
        /*

            {       //VAR
                line : null,
                size: null, 
                varName: null, 
                addr: 0,
            }

            {       //LABEL
                line: null, 
                labelName : null,
                addr: 0,
            }

        */

        this.finalView;
        /*
            //this array would be of the same size as lexicalView


            executableLine: boolean, //this shall be set to false for NULL instrcution

            originalLine: str,
            resolvedLine: str,
            opcodes: int[],

            instructionSize: int,
            instructionAddr: int

        */

    }

    addressResolving(lexicalView){
        this.initiliseFinalView(lexicalView);

        
        let i = 0;
        while (this.executeParcours(lexicalView) & i < 1000)
            i++;

        return this.finalArray;
    }


    initiliseFinalView(lexicalView){
        this.finalArray = new Array(lexicalView.length);

        /*
            executableLine: boolean, //this shall be set to false for NULL instrcution

            lexicalLine: lexical[i],
            originalLine: str,
            resolvedLine: str,
            opcodes: int[],

            instructionSize: int,
            instructionAddr: int

        */


        //First Parcours to initialise    
        for (let i = 0; i < lexicalView.length; i++) 
        {

            const line = lexicalView[i];

            let lineWithLabels = Linkage.reformInstruction(line, true, true); 

            this.finalArray[i] = {
                executableLine: false, //this shall be set to false for NULL instrcution

                lexicalLine: null,
                originalLine: '',
                resolvedLine: '',
                opcodes: [],

                instructionSize: 0,
                instructionAddr: 0,
            }

            if (line.expressionType == 'NULL') 
            {    
                this.finalArray[i].executableLine = false;
                this.finalArray[i].originalLine = lineWithLabels;
                this.finalArray[i].instructionSize = 0;
            }   
            

            else if (line.expressionType == 'INST') 
            {
                this.finalArray[i].executableLine = true;
                this.finalArray[i].originalLine = lineWithLabels;

            }

            else if (line.expressionType == 'VAR') 
            {
                let byteArray = Linkage.generateVariable(line);

                this.finalArray[i].executableLine = true;
                this.finalArray[i].originalLine = lineWithLabels;
                this.finalArray[i].resolvedLine = lineWithLabels;

                this.finalArray[i].opcodes = byteArray;
                this.finalArray[i].instructionSize = byteArray.length;

            }
            else
                console.log("INTERNAL ERROR: LINKAGE INITIALISATION");
            
        }

    }


    affectAddrLBL(labelName, address){
        
        //Affect a specified label with an address, return true if a changement is made
        
        if (labelName == null) 

            return false;

        for (let i = 0; i < this.labelArray.length; i++) 

            if ( this.labelArray[i].labelName == labelName.toUpperCase() ) 
            {
                let b = this.labelArray[i].addr != address;
                this.labelArray[i].addr = address;

                return b;
            }
        
        
        return false;
    }

    affectAddrVAR(varName, address){

        //Affect a specified variable with an address, return true if a changement is made


        //if it's a nameless variable

        if (varName == null) 

            return false;
        

        for (let i = 0; i < this.varArray.length; i++) 

            if ( this.varArray[i].varName == varName ) 
            {
                let b = ( this.varArray[i].addr != address );
                this.varArray[i].addr = address;
                return b;
            }

        console.error("affectAddrVAR : ?? : ", varName, this.varArray);
        return false;
    }

    executeParcours(lexicalView){
        
        let virtualIP = this.origine;
        
        let shouldReloop = false; // If we change any of the VAR/LBL, we set in to true

        for (let i = 0; i < lexicalView.length; i++) 
        {

            const line = lexicalView[i];
            

            //AFFECTION VARIABLES AND LABELS
            //============================================================================

            //LABELS
            //--------------------
            //If the line contains a label, we recompute its address

            if (line.label != null) 
                
                for (let j = 0; j < line.label.length; j++) 

                    if (this.affectAddrLBL(line.label[j], virtualIP)) 
                    
                        shouldReloop = true;
            

            //VARIABLES
            //--------------------
            //If it's a variable declaration, we already have its size

            if (line.expressionType == 'VAR') 
            {

                this.finalArray[i].instructionAddr = virtualIP;

                
                
                //C'est pour eviter de l'appeler plusieurs fois
                if (this.affectAddrVAR(line.variableName, virtualIP)) 
                    
                    shouldReloop = true;

                virtualIP += this.finalArray[i].instructionSize;
                
            }

            //Else if it's an instruction, we shall compute its length

            else if ( line.expressionType == 'INST' )
            {
                let resolvedIntruction;


                if (FLOW_INSTRUCTION.indexOf(line.instName) != -1) //Special for the jumps/call
                {//3dez
                    resolvedIntruction = this.resolveJmpInstruction(line, virtualIP).strLine.trim();
                    this.finalArray[i].lexicalLine = this.resolveJmpInstruction(line, virtualIP).lexicalLine;
                }
                else 
                {
                    resolvedIntruction = this.resolveInstruction(line).strLine.trim();
                    this.finalArray[i].lexicalLine = this.resolveInstruction(line).lexicalLine
                }


                this.finalArray[i].opcodes = toBcode(resolvedIntruction);
                this.finalArray[i].instructionSize = this.finalArray[i].opcodes.length;
                this.finalArray[i].instructionAddr = virtualIP;

                this.finalArray[i].resolvedLine = resolvedIntruction;

                virtualIP += this.finalArray[i].instructionSize;
            }
            
        }

        return shouldReloop;
    }



    resolveInstruction(line, addLabels=false){
        
        let newLine = {...line}; // We copy the original line
        
        newLine.operands = [...line.operands];//Passage par valeur
        for (let i = 0; i < newLine.operands.length; i++)//IZAN IZAN IZAN
            newLine.operands[i] = {...line.operands[i]};
        

        for (let i = 0; i < newLine.operands.length; i++) 
        {

            let op = newLine.operands[i];

            if ( op.type == 'VAR16' || op.type == 'VAR8' ) 
            {
                
                for (let j = 0; j < this.varArray.length; j++) 

                    if (this.varArray[j].varName == op.name) 
                    {
                        
                        //We form our number
                        let avdu = (op.type == 'VAR16') ? ' word [' : ' byte [ ';
                        newLine.operands[i].name = avdu + (this.varArray[j].addr& 0xFFFF).toString() + ' ]';  
                        newLine.operands[i].type = (op.type == 'VAR8') ? 'MB' : 'MW';
                        
                        break;
                    }
                    
                
            }
            else if ( op.type == 'OFF' ) 
            {
                let varOffseted = op.name.trim().split(' ')[1]; // "offset moh" ==> "moh"

                for (let j = 0; j < this.varArray.length; j++) 

                    if (this.varArray[j].varName == varOffseted) 
                    {
                        //We form our number
                        newLine.operands[i].name =  (this.varArray[j].addr& 0xFFFF).toString();  
                        newLine.operands[i].type = 'INT';
                        
                        break;
                    }

            }

            else if ( op.type == 'LBL' ) 
            {
                
                for (let j = 0; j < this.labelArray.length; j++) 

                    if (this.labelArray[j].labelName.toUpperCase() == op.name.toUpperCase()) 
                    {
                        //We form our number
                        newLine.operands[i].name =  (this.labelArray[j].addr&0xFFFF).toString();  
                        newLine.operands[i].type = 'INT';
                        
                        break;
                    }
            }
            
            
        }

        return {
            lexicalLine: newLine,
            strLine: Linkage.reformInstruction(newLine, addLabels),
        }
    }

    resolveJmpInstruction(line, virtualIP, addLabels=false){

        let newLine = {...line}; // We copy the original line
        
        newLine.operands = [...line.operands];//Passage par valeur
        for (let i = 0; i < newLine.operands.length; i++)
            newLine.operands[i] = {...line.operands[i]};


        let op = newLine.operands[0];   //JMP only has one operand
        if ( op.type == 'LBL' ) 
        {
                
                for (let j = 0; j < this.labelArray.length; j++) 

                    if (this.labelArray[j].labelName.toUpperCase() == op.name.toUpperCase()) 
                    {
                        //We form our number
                        let modulo = ((this.labelArray[j].addr - virtualIP > 128)||(this.labelArray[j].addr - virtualIP < 0)) ? 1 : 0,
                            jumpValue = (this.labelArray[j].addr - virtualIP - 2 - modulo) & 0xFFFF;

                        console.log(virtualIP - this.labelArray[j].addr);
                        
                        newLine.operands[0].name =  jumpValue.toString();  
                        newLine.operands[0].type = 'INT';
                        
                        break;
                    }
        }
        
        else if ( op.type == 'OFF' ) 
        {
                let varOffseted = op.name.trim().split(' ')[1]; // "offset moh" ==> "moh"

                for (let j = 0; j < this.varArray.length; j++) 

                    if (this.varArray[j].varName == varOffseted) 
                    {
                        //We form our number
                        let modulo = ((this.labelArray[j].addr - virtualIP > 128)||(this.labelArray[j].addr - virtualIP < 0)) ? 1 : 0,
                            jumpValue = (this.varArray[j].addr - virtualIP - 2 - modulo) & 0xFFFF;

                        
                        //We form our number
                        newLine.operands[0].name =  jumpValue.toString();  
                        newLine.operands[0].type = 'INT';
                        
                        break;
                    }

            
            
            
        }

        
        return {
            lexicalLine: newLine,
            strLine: Linkage.reformInstruction(newLine, addLabels),
        }

    
    }

    static generateVariable(line)
    {

        let byteArray = [],
            varType = line.variableClass;

        for (let i = 0; i < line.operands.length; i++)
        {
            
            const op = line.operands[i];

            if ( op.type == 'INT' ) 
            {

                let numValue = parseInt(op.name);
                
                //If it's a one byte number
                if (varType == 'DB') 
                    byteArray.push(numValue);

                //If it's a two bytes number
                else
                {
                    byteArray.push(numValue & 0xFF);        //Least significant byte
                    byteArray.push(((numValue & 0xFF00) >> 8) & 0xFF);//Most significant Byte
                }

            }

            else if ( op.type == 'STR' ) 
            {
                
                let strValue = op.name.trim().slice(1);
                strValue = strValue.slice(0, strValue.length-1);//Here we remove the Guillemets from the string


                for (let j = 0; j < strValue.length; j++) 

                    byteArray.push(strValue.charCodeAt(j) & 0xFF);//We add the 0xFF, just to be sur :/
                    
                
            }

            else
            {
                console.log("generateVariable ::: DACHHUUU ???");
            }
            
        }


        return byteArray;
    }

    static reformInstruction(line, addLabels=true, chbaha=false){

        let strInst = '';

        //We Add the labels if requested

        if (addLabels && line.label != null) 
        {
            if (chbaha && line.instName == 'PROC') 
                strInst += 'Procedure ';       
            

            for (let i = 0; i < line.label.length; i++) 

                strInst += line.label[i].toUpperCase() + ': ';

        }

        //And then we add the instruction's name

        if (line.expressionType == 'VAR') 

            strInst += line.variableName + ' ' + line.variableClass.toLowerCase() + ' ';

        else if (line.expressionType == 'INST') 
            
            strInst += line.instName.toLowerCase() + ' ';
           
        else

            return strInst;//Nothing more to do for a NULL expression
                
        //Finaly we append the operands
        
        for (let i = 0; i < line.operands.length - 1; i++) 

            strInst += line.operands[i].name.trim() + ', ';
        
        if (line.operands.length != 0) 
            strInst += line.operands[line.operands.length - 1].name.trim();
        
        
        return strInst;
    }

}
