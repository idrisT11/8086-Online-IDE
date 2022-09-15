class PreProcessor {
   
    constructor(lexicalView) {
        this.lexicalView = lexicalView;

        this.variables = [];
        this.labels = [];

        this.origineValue = 0;

        this.good = true; 
        this.message = ""; 
        this.errorLine = null;
       
        this.macros = [];
         /*	
            name: STR,
            op: line.operands,
            index: line.index,
            innerContent: [],
            localInstParameter:[],
         */

    }

    generatePrepoError(){

        
        //We look for the error line
        for (let i = 0; i < this.lexicalView.length; i++) {

            //we look for the line where the error occured
            if ( this.lexicalView[i].index == this.errorLine ) {
                
                this.lexicalView[i].good = false,
                this.lexicalView[i].message = this.message;

            }
            
        }

        return {
            status: false,
            lexicalView: this.lexicalView,
            varArray: this.variables,
            labelArray: this.labels,
            origin: this.origineValue,

            message: this.message,
            errorLine: this.errorLine
        }
    }

    executePostLexical() {
         
        if(this.executeDefine() == -1)
            return this.generatePrepoError();;
             
        this.textAjustement();

        if(this.manageMacro() == -1)
            return this.generatePrepoError();
        

        if (this.manageProcedures(this.lexicalView) == -1) 
            return this.generatePrepoError();


        this.getVariables(this.lexicalView);


        if(this.manageVariables(this.lexicalView) == -1)
            return this.generatePrepoError();
        
        if (this.verifyVarDeclaration(this.lexicalView) == -1 )
            return this.generatePrepoError();
        
        if (this.verifyOrigin(this.lexicalView) == -1) 
            return this.generatePrepoError();
	    
        this.addEmpyLine();

        return {
            status : true, // no errors
            lexicalView: this.lexicalView,
            varArray: this.variables,
            labelArray: this.labels,
            origin: this.origineValue,

            message: '',
            errorLine: null
        }
    }

    static executePostLinkVerif(finalView){

        //Verify if the code is style correct after the address resolving
        //Here we only need to verify if the conditionnal jump are still valid

        let good = true;   //We reset good at True

        let message = '', errorLine = null;

        for (let i = 0; i < finalView.length; i++) {
            const line = finalView[i].lexicalLine;

            if (line != null) 
            {
                //Test for the conditional jumps
                if (line.expressionType == 'INST' && FLOW_INSTRUCTION.indexOf(line.instName) != -1 && LONG_FLOW.indexOf(line.instName) == -1) 
                {
                    let jumpValue = parseInt(line.operands[0].name);

                    if ((jumpValue & 0xFF00) != 0) 
                    {
                        message = 'ERROR: JMP OPERATION OUT OF BOUNDS';
                        good = false;
                        errorLine = line.index;
                        
                        break;
                    }

                }    
            }
            
        }

        return {
            good: good,
            message: message,
            errorLine: errorLine,
        }        

    }

    //=========================================================
    textAjustement(){
        const rotShfOp = ["SHL", "SAL", "SHR", "SAR", "ROL", "ROR", "RCL", "RCR"];

        //INTEGER EXPRESSION EVALUATION
        //----------------------------------------------
        //Here we evaluate the numerical expression to end up with only one number in decimal
        //----------------------------------------------
        //for each line in the lexicalView
        for (let lineIndex = 0; lineIndex < this.lexicalView.length; lineIndex++) 
        {

            let line = this.lexicalView[lineIndex];
            
            //for each operand in the line
            for (let opId = 0; opId < line.operands.length; opId++) 
                //If the type of the operand corresponds to an integer or a dup pramater
                if (line.operands[opId].type == 'INT' || line.operands[opId].type == 'DUP'
                || line.operands[opId].type == 'DUPSIZE') 
                    {
                        let value = line.operands[opId].name;
                        //if we have a '?' parameter
                        if ( line.operands[opId].type == 'DUP' && value.trim() == '?') {
                            value = '0';
                        }
                        console.log(value, this.chartoascii(value), this.hexBinAcceptable(value), '===========zdq');
                        value = this.chartoascii(value);
                        value = this.hexBinAcceptable(value);
                        value = (value.trim() != '')? eval(value).toString(10): '0';
                        line.operands[opId].name = value;

                    } 
                //If the type of the operand correspond to an memory type
                else if (   line.operands[opId].type == 'MU' || line.operands[opId].type == 'MB'
                        ||  line.operands[opId].type == 'MW') 
                    {
                        let value = line.operands[opId].name;
                        let finalExpression = '';

                        //we extract the (word/byte parameters)
                        let tailleMem = value.match(/(word|byte|w\.|b\.)/ig);
			//then the segment override
                        let segOver = value.match(/(cs|ds|es|ss)/ig);
                        //then the registers between the brackets
                        let reg = value.match(/(bp|bx|di|si)/ig);
                        //and then the numerical value in the brackets
                        let numerical = value.replaceAll(/(word|byte|w\.|b\.|es|ds|ss|cs|bp|bx|di|si|\[|\]|\:)/ig, ' ');
                        

                        //we do some computation before evaluing the numerical value
                        numerical = numerical.replaceAll(/\+\s*\+/ig, '+');
                        numerical = numerical.replaceAll(/\+\s*\*/ig, '*');
                        numerical = numerical.replaceAll(/\+\s*\-/ig, '-');
                        numerical = numerical.replaceAll(/\*\s*\+/ig, '*');
                        numerical = numerical.replaceAll(/\-\s*\+/ig, '-');
                        numerical = numerical.replaceAll(/\s*\+\s*$/ig, '+0');
                        numerical = this.hexBinAcceptable(numerical);
                        

                        numerical = (numerical.trim() != '')? eval(numerical).toString(10): '0';
                        
                        //Finally we reconstruct to the string
                        if (tailleMem != null) 
                            finalExpression += tailleMem + ' ';
                        
                        if (segOver != null) 
                            finalExpression += segOver + ':';
                        finalExpression += '[';

                        if (reg != null) 
                        {

                            finalExpression += reg[0];
                            finalExpression += (reg.length == 2) ? '+' + reg[1] : '';

                            if (numerical != '0') 
                            {

                                if ( parseInt(numerical) < 0 ) 

                                    finalExpression += numerical;
                                
                                else

                                    finalExpression += '+' + numerical;
                                
                            }

                            finalExpression += ']';
                        }
                        else
                        {
                            if ( parseInt(numerical) < 0 ) 

                                finalExpression += numerical;
                            
                            else

                                finalExpression += numerical;

                            finalExpression += ']';
                        }
 
                        line.operands[opId].name = finalExpression;
                        
                        
                    }  
        }

        //SHIFT AND ROTATION OPERATIONS
        //----------------------------------------------
        //Here we multiply the shift and rotate operations
        //----------------------------------------------
        //for each line in the lexicalView
        for (let lineIndex = 0; lineIndex < this.lexicalView.length; lineIndex++) {

            const line = this.lexicalView[lineIndex];

            //If we have a shift/rotation instruction
            if (line.expressionType == 'INST' && rotShfOp.indexOf(line.instName) != -1 ) {
                
                if (line.operands.length != 2) {
                    
                    this.good = false; 
                    this.errorLine = this.lexicalView[lineIndex].index; 
                    this.message = "ERROR: INVALID OPERANDS LIST FOR SHIFT/ROTATE INSTRUCTION"; 

                    return -1;
                    
                }
                else if (line.operands[1].type != 'INT') {
                    
                    this.good = false; 
                    this.errorLine = this.lexicalView[lineIndex].index; 
                    this.message = "ERROR: INVALID OPERANDS FOR SHIFT/ROTATE INSTRUCTION"; 

                    return -1;
                }

                else if (parseInt(line.operands[1].name, 10) > 255 || parseInt(line.operands[1].name, 10) <= 0) {
                    
                    this.good = false; 
                    this.errorLine = this.lexicalView[lineIndex].index; 
                    this.message = "ERROR: OPERANDS OUT OF RANGE"; 

                    return -1;
                }

                let shiftTable = [],
                    nbShift = parseInt(line.operands[1].name, 10);
                
                //On crée de nouvelle instrcution shift
                for (let i = 0; i < nbShift; i++) {

                    let label = ( i == 0 )? line.label : null;//for the first, we push the original label
                    
                    shiftTable.push(
                        {
                            label: label,
                            expressionType: 'INST',
                            instructionType: 'InsSIM',
                            instName: line.instName,
                            good: true,
                            operands: [
                                {name: line.operands[0].name, type: line.operands[0].type},
                                {name: '1', type: 'INT'}
                            ],
                            variableName: null,
                            variableType: null,

                            index: line.index
                        }
                    );
                    
                }

                this.lexicalView.splice(lineIndex, 1, ...shiftTable);
            }
            
        }
    }


    chartoascii(str) {

        if (/"."|'.'/i.test(str))
            return str.replace(/(?<=("|')).(?="|')/, str.charCodeAt(1).toString(10));
            
        else return str;
    }

    hexBinAcceptable(str){
        let tabHex = str.match(/[0-9]+[a-f0-9]*(h|H)/ig),
            tabBin = str.match(/[0-1]+(b|B)/ig);
            
        if(tabHex != null)
        {
            for (let i = 0; i < tabHex.length; i++) {
                str = str.replace(/^[0-9]+[a-f0-9]*(h|H)$/, '0x' + tabHex[i].slice(0, tabHex[0].length-1));
                
            }
        }

        if(tabBin != null)
        {
            for (let i = 0; i < tabBin.length; i++) {
                str = str.replace(/^[0-1]+(b|B)$/, '0b' + tabBin[i].slice(0, tabBin[0].length-1));
                
            }
        }

        return str;   
    }
	
    addEmpyLine(){
        this.lexicalView.push({
            label: null,
            expressionType: 'NULL',
            instructionType: null,
            instName: null,
            good: true,
            operands: [],
            variableName: null,
            variableClass: null,

            index: null
        });
    }


    //=========================================================

    _checkVariable(varName) {

        // Check if varName exists in this.variables
        
        // check in this.variables
        for (var i = 0; i < this.variables.length; i++) {

            if (this.variables[i].varName == varName)

                // it exists
                return true;
        }

        return false;

    }

    getVariables(objectsArray) {

        // looping through each line and extract variable names and labels

        for (var i = 0; i < objectsArray.length; i++) {

            var variablesObject = {

                line : null,
                size: null, 
                varName: null, 
                addr: 0,
            }

            var labelsObject = {

                line: null, 
                labelName : null,
                addr: 0,
            }

            if (objectsArray[i].expressionType == "VAR" && objectsArray[i].variableName != null && !this._checkVariable(objectsArray[i].variableName) && !this._findInLabels(objectsArray[i].variableName)) {

                variablesObject.line = objectsArray[i].index; 
                variablesObject.varName = objectsArray[i].variableName.toUpperCase(); 

                if(/DB/.test(objectsArray[i].variableClass))

                    variablesObject.size = "BYTE";

                else if(/DW/.test(objectsArray[i].variableClass))

                    variablesObject.size = "WORD";

                else if(/DU/.test(objectsArray[i].variableClass))

                    variablesObject.size = "UNKNOWN";

                this.variables.push(variablesObject);
               
            }

            if (objectsArray[i].label != null) {

                for (let j = 0; j < objectsArray[i].label.length; j++) {

                    labelsObject.line = objectsArray[i].index; 
                    labelsObject.labelName = objectsArray[i].label[j].toUpperCase();

                    this.labels.push(labelsObject);
                }

            }

        }

        this.executeDup(objectsArray);
    }

    _findInLabels(varName) {

        // function which looks for a variable in labels array 

        for(var i = 0; i < this.labels.length; i++) {

            if (this.labels[i].labelName.toUpperCase().trim() == varName.toUpperCase().trim())

                return true;
        }

        return false;
    }

    manageVariables(objectsArray) {

        var found = null;

        // looking for a specific variable in variables array
        for(var i = 0; i < objectsArray.length; i++) {
            console.log(objectsArray[i]);
            for (var j = 0; j < objectsArray[i].operands.length; j++) {
                console.log(objectsArray[i].operands[j].type);

                if (/VAR/.test(objectsArray[i].operands[j].type)) {
                   
                    found = false;

                    for (var k = 0; k < this.variables.length; k++) {
                        console.log(this.variables[k].varName.toUpperCase() , objectsArray[i].operands[j].name.toUpperCase());
                        if (this.variables[k].varName.toUpperCase() == objectsArray[i].operands[j].name.toUpperCase()) {

                            found = true; 

                            if (/BYTE/.test(this.variables[k].size)) 
                                objectsArray[i].operands[j].type = "VAR8";

                            else if (/WORD/.test(this.variables[k].size))
                                objectsArray[i].operands[j].type = "VAR16";

                            else if (/UNKNOWN/.test(this.variables[k].size))
                                objectsArray[i].operands[j].type = "VARU";

                            break;
                            
                        }

                    }

                    if (!found) {
                            
                        let varName = objectsArray[i].operands[j].name; 
                        
                        if (this._findInLabels(varName))
                            objectsArray[i].operands[j].type = "LBL"; 

                        else {

                            this.good = false;
                            this.errorLine = objectsArray[i].index; 
                            this.message = "ERROR : VARIABLE/LABEL DOESN'T EXIST"; 

                            return -1;
                        }

                        }
                }

                else if (/OFF/.test(objectsArray[i].operands[j].type)) {
                    
                    let opsVars = objectsArray[i].operands[j].name.split(" "); 
                    if (!this._checkVariable(opsVars[1].trim().toUpperCase())) {

                        this.good = false; 
                        this.errorLine = objectsArray[i].index; 
                        this.message = "ERROR: VARIABLE DOESN'T EXIST";

                        return -1;
                    }
                }
            }

        }
        
        return 0;
    }


    verifyVarDeclaration(objectArray){

        //Verify if the variable declarations are correct


        //for every line

        for (let i = 0; i < objectArray.length; i++) {
            const line = objectArray[i];


            //only if the line is a variable declaration

            if ( line.expressionType == 'VAR' ) 
            {

                const varType = line.variableClass;

                //for every oeprands

                for (let j = 0; j < line.operands.length; j++) 
                {
                    const op = line.operands[j];
                    
                    //if the operand is an int

                    if (op.type == 'INT') 
                    {
                        let value = parseInt(op.name);
                        
                        if ((value > 255 || value <= -128) && varType == 'DB') 
                        {

                            this.good = false; 
                            this.errorLine = line.index; 
                            this.message = "ERROR: OPERANDS OUT OF RANGE ( GREATER THAN ONE BYTE )";

                            return -1; 
                        }

                        else if ((value > 65535 || value <= -32768) != 0 && varType == 'DW') 
                        {

                            this.good = false; 
                            this.errorLine = line.index; 
                            this.message = "ERROR: OPERANDS OUT OF RANGE ( GREATER THAN TWO BYTES )";

                            return -1; 
                        }
    
    
                    }
                } 
            }
            
            
        }

        return 0;
    }
    

    manageProcedures(objectsArray) {

        // handle procedures calling 
    
        var procBegin = 0,  // the object index where the procedure begins
            endpFound = false, // end of the procedure
            inProc = false,
            procEnd,
            procBegin,
            j = 0, 
            valid = false;
    
        for (var i = 0; i < objectsArray.length; i++) {
    
            if (objectsArray[i].expressionType == "INST" && objectsArray[i].instName == "PROC") {
    
                // PROC LABEL :: checking if the instruction has only one label 
                if (objectsArray[i].operands.length == 1) {
    
                    if (objectsArray[i].operands[0].type == "VAR") {
    
                        inProc = true; 
                        procBegin = i + 1;  // procedure begins : PROC LABEL instruction
                        j = procBegin; 
    
                        while ( !endpFound && j < objectsArray.length  ) {
    
                            if ( objectsArray[j].expressionType == "INST" && objectsArray[j].instName == "ENDP") 
    
                                endpFound = true; 
    
                            else 
    
                                j = j + 1;
    
                        }
    
                        if (!endpFound) {
    
                            this.good = false; 
                            this.message = "ERROR: UNABLE TO FIND THE ENDP SYMBOL";
                            this.errorLine = objectsArray[i].index; 

                            return -1;
    
                        }
    
                        procEnd = j; 
    
                        // checking if there is not another declaration of a procedure inside a procedure
                        for (var j = procBegin; j < objectsArray.length; j++) {
                            
                            if ( objectsArray[j].expressionType == "INST" && objectsArray[j].instName == "ENDP") 
    
                                break; 
    
                            if (objectsArray[j].expressionType == "INST" && objectsArray[j].instName == "PROC") {
    
                                this.good = false; 
                                this.errorLine = objectsArray[j].index; 
                                this.message = "ERROR: INVALID INSTRUCTION IN PROCEDURE BODY"; 
    
                                return -1;
                            }
                        }
    
                        
                        // checking if the code inside the procedure is correct 
                        j = procBegin; 
                        while ( !valid && objectsArray[j].instName != "ENDP" ) {
    
                            // checking if there is at least one valid instruction
                            if (objectsArray[j].expressionType != null)
    
                                valid = true; 
    
                            
    
                            else 
                                j = j + 1;
                        }
    
                        if (!valid) {
    
                            this.good = false; 
                            this.message = "ERROR: PROCEDURE EMPTY"; 
                            this.errorLine = objectsArray[i].index;
    
                            return -1;
                        }

                        // Replacing the Proc declaration with a label declaration
                        //Note: on ne supprime pas le champs "instName" car on en aura besoin
                        objectsArray[i].label = [objectsArray[i].operands[0].name];
                        objectsArray[i].expressionType = 'NULL';
                        
                        //Deleting the "endp" symbol
                        objectsArray[procEnd].expressionType = 'NULL';

                        
                    }
    
                    else {
    
                        this.good = false; 
                        this.errorLine = objectsArray[i].index; //i + 1 ; 
                        this.message = "ERROR: WRONG PROCEDURE DECLARATION"; 
    
                        return -1;
    
                    }
                }
    
                else {
    
                    this.good = false; 
                    this.errorLine = objectsArray[i].index; //i + 1 ; 
                    this.message = "ERROR: WRONG PROCEDURE DECLARATION"; 
    
                    return -1;
                }
    
    
            }
        
        }
    
        return 0;
    }
    
    executeDup(objectsArray) {
        //This methode is executed inside getVariable


        for (var i = 0; i < objectsArray.length; i++) {

            if (objectsArray[i].expressionType == "VAR") {

                //foreach parameter
                for (let j = 0; j < objectsArray[i].operands.length; j++) {
                    
                    //if we encounter a dup
                    if ( objectsArray[i].operands[j].type == 'DUPSIZE' ) {


                        let dupSize = parseInt(objectsArray[i].operands[j].name),
                            dupValues = [];

                        //if the dupSize is out of range

                        if (dupSize <= 0 || dupSize > 1024) {
                            
                            this.good = false; 
                            this.errorLine = objectsArray[i].index; 
                            this.message = "ERROR: DUP OPERANDS OUT OF RANGE"; 

                            return -1;
                        }

                        //We extract the dup paramter

                        let k = 1;  //We will need it later, for replace in the objectArray

                        while (
                                (k+j) < objectsArray[i].operands.length && 
                                objectsArray[i].operands[(k+j)].type == 'DUP'
                            ) {
                            dupValues.push(objectsArray[i].operands[(k+j)].name);
                            k++;
                        }  
                        
                        //And then form the table

                        let opTable = [];

                        for (let k = 0; k < dupSize; k++) {
                            
                            //El 3umq
                            for (let m = 0; m < dupValues.length; m++) {
                                
                                opTable.push({
                                    name: dupValues[m],
                                    type: 'INT'
                                });
                                
                            }
                            
                        }


                        objectsArray[i].operands.splice(j, k, ...opTable);

                    }
                    
                }
            }
        }

    }
    
    executeDefine() {

        for (var i = 0; i < this.lexicalView.length; i++){

            if (this.lexicalView[i].expressionType == "INST" && this.lexicalView[i].instName == "DEFINE") {

                // instruction requires only 2 operands
                if (this.lexicalView[i].operands.length != 2) {

                    this.good = false; 
                    this.errorLine = this.lexicalView[i].index; 
                    this.message = "ERROR: INVALID OPERANDS LIST FOR DEFINE INSTRUCTION"; 

                    return -1;
                }

                // checking operands type 
                if (this.lexicalView[i].operands[0].type != "VAR" || this.lexicalView[i].operands[1].type != "INT") {
                    this.good = false; 
                    this.errorLine = this.lexicalView[i].index; 
                    this.message = "ERROR : INVALID OPERANDS"; 

                    return -1;
                }

                let operandName = this.lexicalView[i].operands[0].name,
                    operandValue = this.lexicalView[i].operands[1].name;

                // replacing in source code 
                for (var j = 0; j < this.lexicalView.length; j++) {

                    // We replace only if we are working on an instruction
                    if ( this.lexicalView[i].expressionType == 'INST' ) {
                        
                        for (var k = 0; k < this.lexicalView[j].operands.length; k++) {

                            if (this.lexicalView[j].operands[k].name == operandName) {

                                this.lexicalView[j].operands[k].name = operandValue; 
                                this.lexicalView[j].operands[k].type = "INT";

                            }
                        }   
                        
                    }
                }   
                
                // Deleting the DEFINE INSTRCUTION
                this.lexicalView.splice(i, 1);
                i--;
            }
        }
        
        return 0;
    }
  
    verifyOrigin(objectArray) {
        let find = false,
            value = 0;

        for (let index = 0; index < objectArray.length; index++) 
        {

            let line = objectArray[index];

            if (!find ) 

                if (line.expressionType == 'INST' && line.instName == 'ORG') 
                {
                    if (line.operands.length != 1) 
                    {
                        this.message = 'ERROR : ILLEGAL NUMBER OF PARAMETER';
                        this.good = false;
                        this.errorLine = line.index;
                        return -1;
                    }

                    else if (line.operands[0].type != 'INT') 
                    {
                        this.message = 'ERROR : "ORG" PARAMETER SHOULD BE A INTEGER';
                        this.good = false;
                        this.errorLine = line.index;
                        return -1;
                    }

                    value = parseInt(line.operands[0].name);
                    console.log(5);
                    if((value & 0xFFFF0000) != 0)
                    {
                        this.message = 'ERROR : OPERAND OUT OF RANGE';
                        this.good = false;
                        this.errorLine = line.index;
                        return -1;
                    }
                    
                    find = true;
                }
            
            
            if (line.expressionType == 'INST' && line.instName == 'ORG')
                objectArray.splice(index, 1);
                
        }

        this.origineValue = value;

        return 0;
    }
  
  //====================================================================================================
  
  //General function for macro managing
	manageMacro(){
		
		if ( this.getMacro() && !this.sameNameMacro() && this.manageMacroCalls() ) 
			return 0;
		else 
			return -1;
		
	}

	//Getting macros
	getMacro(){

		var inMacro = false,
			macroIndex = 0,
			macroLineDeclaration = 0,
			macroLengthDeclaration = 0,
            j = 0,
			localInstParameter = [];

		for (var i = 0; i < this.lexicalView.length; i++) 
		{
			let line = this.lexicalView[i];

			//CAS D'UNE INSTRCUTION LOCAL EN DEHORS D'UNE MACRO
			if ( line.expressionType == 'INST' && line.instName == 'LOCAL' && !inMacro ) 
			{
				this.message = 'ERROR : ILLEGAL USE OF "LOCAL" DIRECTIVE';
				this.good = false;
                this.errorLine = line.index;
				return 0;
			}

			//CAS D'UNE INSTRCUTION ENDM EN DEHORS D'UNE MACRO
			else if ( line.expressionType == 'INST' && line.instName == 'ENDM' && !inMacro) 
			{
				this.message = 'ERROR : ILLEGAL USE OF "ENDM" DIRECTIVE';
				this.good = false;
                this.errorLine = line.index;
				return 0;
			}

			//CAS D'UNE DECLARATION MACRO DANS UNE AUTRE MACRO
			else if ( line.expressionType == 'macro definition' && inMacro)
			{
				this.message = 'ERROR : MACRO DECLARATION MISSING "ENDM" SYMBOL';
				this.good = false;
                this.errorLine = line.index;
				return 0;
			}


			else if ( line.expressionType == 'macro definition' && !inMacro)
			{
				inMacro = true;
				macroIndex = line.index;
				this.macros.push({
					name: line.instName,
					op: line.operands,
					index: line.index,
					innerContent: [],
					localInstParameter: [],
				});

				macroLineDeclaration = i;
				macroLengthDeclaration = 1;
			}

			else if ( line.expressionType == 'INST' && line.instName == 'LOCAL' && inMacro ) 
			{
				if ( localInstParameter.length != 0 ) 
				{
					this.message = 'ERROR : ONLY ONE LOCAL DIRECTIVE IN A MACRO ALLOWED';
					this.good = false;
                    this.errorLine = line.index;
					return 0;
				}
				
				localInstParameter = line.operands;

                

				macroLengthDeclaration++;
			}

			else if ( line.expressionType == 'INST' && line.instName == 'ENDM' && inMacro) 
			{
				inMacro = false;
                this.macros[j].localInstParameter = localInstParameter;
                localInstParameter = [];
				j++;
				macroLengthDeclaration++;
                

				this.lexicalView.splice(macroLineDeclaration, macroLengthDeclaration);
				//On enleve les lignes de la declaration de macro
				i -= macroLengthDeclaration;
				macroLengthDeclaration = 0;
			}

			else if (inMacro)
			{
                
				macroLengthDeclaration++;
				this.macros[j].innerContent.push(line);
			}

		}
		//CAS D'UNE MACRO QUI NE FINIT PAS AVEC LE SYMBOLE "ENDM"
		if ( inMacro ) 
		{
			this.message = 'ERROR : MACRO DECLARATION MISSING "ENDM" SYMBOL';
			this.good = false;
            this.errorLine = line.index;
			return 0;
		}

        return 1;
	}

	//Verification de si deux macros portes le même nom
	sameNameMacro(){
		for (var i = 0; i < this.macros.length; i++) 
			for (var j = i+1; j <this. macros.length; j++) 
				if(this.macros[i].name == this.macros[j].name)
					return 1;
			
			
		return 0
	}

	//Rend l'indice de la macro dans le tableau this.macro
	getMacroId(neededMacroName){
		var i = 0,
			trouve = false;

        while (!trouve && i < this.macros.length)
		{
			trouve = (this.macros[i].name == neededMacroName);
			i++;
		}
		
		//si on trouve on rend lindice, sinon on rend -1
		return (trouve) ? i - 1 : -1;
	}


	//Remplace le code de la macro
	manageMacroCalls(){
		let nbParcours = 0,
            finAnalyse = false;
        
        while( (nbParcours < 50) && !finAnalyse )
        {
            finAnalyse = true;
            console.log(nbParcours);
            for (var i = 0; i < this.lexicalView.length; i++) {
                let line = this.lexicalView[i];

                if ( line.expressionType == "MACRO" ) 
                {
                    finAnalyse = false;
                    //ON EXTRAIT LA MACRO PUIS ON VERIFIE SI ELLE EXISTE
                    //------------------------------------------------------------
                    //------------------------------------------------------------
                    let macroId = this.getMacroId(line.instName);
                    if ( macroId == -1) 
                    {
                        this.message = 'ERROR : UNDECLARED MACRO ';
                        this.errorLine = line.index;
                        this.good = false;

                        return 0;
                    }
                    let macroCode = [];
                    //EXTRACT STRING PARAMETER
                    //------------------------------------------------------------
                    //------------------------------------------------------------
                    let stringParameter = [];

                    for (var j = 0; j < line.operands.length; j++) {
                        if( line.operands[j].type == "STR" )
                        {
                            stringParameter.push({
                                value: line.operands[j].name,
                                variableName: '__VAR_' + line.instName + '__N°_' + j.toString(),

                            });

                            this.lexicalView[i].operands[j].type = "VARU";
                            this.lexicalView[i].operands[j].name = '__VAR_' + line.instName + '__N°_'  + j.toString();
                        }
                    }

                    //GENERATING STRING DECLARATION
                    //------------------------------------------------------------
                    //------------------------------------------------------------
                    let jmpPadding = 0;
                    for (var j = 0; j < stringParameter.length; j++) {
                        macroCode.push({
                            label: null,
                            expressionType: 'VAR',
                            instructionType: 'DB',
                            instName: 'DB',
                            good: true,
                            operands: [
                                {name: stringParameter[j].value, type: 'STR'},
                                {name: '0', type: 'INT'}
                            ],
                            variableName: stringParameter[j].variableName,
                            variableClass: 'DU',

                            index: line.index
                        });
                        jmpPadding += stringParameter[j].value.length - 2 + 1;
                        // -2 : les guillemets
                        // +1 : le zero final
                    }
                    
                    //Si on un une declaration de string, on push un jump
                    if ( jmpPadding != 0 )
		    {

                        macroCode.unshift({
                            label: null,
                            expressionType: 'INST',
                            instructionType: null,
                            instName: 'JMP',
                            good: true,
                            operands: [
                                {name: jmpPadding.toString() , type: 'INT'},
                            ],
                            variableName: null,
                            variableType: null,

                            index: line.index
                        });

                        //UN PEU DE DECO
                        macroCode.unshift({
                            label: ['___VARIABLE_MACRO'],
                            expressionType: 'NULL',
                            instructionType: null,
                            instName: null,
                            good: true,
                            operands: [],
                            variableName: null,
                            variableType: null,

                            index: line.index
                        });

                        
                    }
                    macroCode.push({
                        label: ['___MACRO_BEGINING'],
                        expressionType: 'NULL',
                        instructionType: null,
                        instName: null,
                        good: true,
                        operands: [],
                        variableName: null,
                        variableType: null,

                        index: line.index
                    });

                    //------------------------------------------------------------
                    //------------------------------------------------------------

                    if (this.lexicalView[i].operands.length != this.macros[macroId].op.length) 
                    {
                        this.message = 'ERROR : INVALID NUMBER OF PARAMETER ';
                        this.errorLine = line.index;
                        this.good = false;

                        return 0;
                    }
                    
                    let table = this.replaceOccMacro(this.lexicalView[i].operands, macroId);

                    for (var j = 0; j < table.length; j++) 
                    {

                        let lineInMacro = table[j];
                        lineInMacro.index = line.index;
                        macroCode.push(lineInMacro);
                        
                    }
                    
                    macroCode.push({
                        label: ['___MACRO_END'],
                        expressionType: 'NULL',
                        instructionType: null,
                        instName: null,
                        good: true,
                        operands: [],
                        variableName: null,
                        variableType: null,

                        index: line.index
                    });

                    //On remplace
                    this.lexicalView.splice(i, 1, ...macroCode);

                    //i += macroCode.length; //Pour passer la macro(eviter la recursiviter)
                }

            }  

            nbParcours++;
        }
        if ( nbParcours >= 50 ) {
            this.message = 'ERROR : MACRO RECURTION DETECTED ';
            this.errorLine = null;
            this.good = false;
        }

        return 1;
	}


	//Remplacing the macro declaration and local labels
	replaceOccMacro(operands, macroId)
	{
		let table = copyTable(this.macros[macroId].innerContent),
			labelList = this.macros[macroId].localInstParameter,
			parameterList = this.macros[macroId].op;//list of <operand objects>
        
        let macroName = this.macros[macroId].name;
        console.log(table);
		//remplacing local labels
		for (var i = 0; i < labelList.length; i++) 
		{

			let labelToBeChanged = labelList[i].name;
            
			//For every line in the macro
			for (var j = 0; j < table.length; j++) 
			{
                
				//For a label as a label declaration
				for (var k = 0; k < table[j].label.length; k++) 

                    if ( table[j].label[k] == labelToBeChanged ) 
                    
						table[j].label[k] = '__LOCAL_LABEL' + macroName + labelToBeChanged;

				
				

				//For a label as an operand 
				for (var k = 0; k < table[j].operands.length; k++) 
				{

					let op = table[j].operands[k];

					if ( op.name == labelToBeChanged ) 

						op.name = '__LOCAL_LABEL' + macroName + labelToBeChanged;

				}
			}
		}

		//remplacing paramters
		for (var i = 0; i < parameterList.length; i++) 
		{

			let parameterName = parameterList[i],
				parameterValue = operands[i];
            
			//For every line in the macro
			for (var j = 0; j < table.length; j++) 
			{

				//For every operands in the macro
				for (var k = 0; k < table[j].operands.length; k++) 
				{

					let op = table[j].operands[k];

                    //If the operand name correspond to the parameter name
					if ( op.name.toUpperCase().trim() == parameterName.name.trim() ) 
					{
                        
                        table[j].operands[k].name = parameterValue.name.trim();
						table[j].operands[k].type = parameterValue.type.trim();
					}

                    if (op.name.trim().split(" ")[1] != undefined && op.name.trim().split(" ")[1].toUpperCase() == parameterName.name.trim())
                    {
                        table[j].operands[k].name = "offset " + parameterValue.name.trim();
                    }

				}
			}
        }

		return table;
	}

}

function copyTable(old_table) {
    var table = [...old_table];
    for (let i = 0; i < table.length; i++) {

        table[i] = {...old_table[i]};
        table[i].operands = [...old_table[i].operands];

        for (let j = 0; j < old_table[i].operands.length; j++) 
            table[i].operands[j] = {...old_table[i].operands[j]};
        
    }

    return table;
}



