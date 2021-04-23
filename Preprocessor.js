class PreProcessor {
   
    constructor() {

        this.variables = [];
        this.labels = [];
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

    static executePostLexical(lexicalView) {


    }

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

        }

        var labelsObject = {

            line: null, 
            labelName : null,
        }

        if (objectsArray[i].expressionType == "VAR" && objectsArray[i].variableName != null && !this._checkVariable(objectsArray[i].variableName) && !this._findInLabels(objectsArray[i].variableName)) {

            variablesObject.line = i; 
            variablesObject.varName = objectsArray[i].variableName.toUpperCase(); 

            if(/DB/.test(objectsArray[i].variableClass))

                variablesObject.size = "BYTE";

            else if(/DW/.test(objectsArray[i].variableClass))

                variablesObject.size = "WORD";

            this.variables.push(variablesObject);
           
        }

        if (objectsArray[i].label != null) {

            labelsObject.line = i; 
            labelsObject.labelName = objectsArray[i].label.toUpperCase();

            this.labels.push(labelsObject);

        }

    }


}

_findInLabels(varName) {

    // function which looks for a variable in labels array 

    for(var i = 0; i < this.labels.length; i++) {

        if (this.labels[i].labelName == varName.toUpperCase())

            return true;
    }

    return false;
}

manageVariables(objectsArray) {

    var found = null;

    // looking for a specific variable in variables array
    for(var i = 0; i < objectsArray.length; i++) {

        for (var j = 0; j < objectsArray[i].operands.length; j++) {

            if (/VAR/.test(objectsArray[i].operands[j].type)) {

                found = false;

                for (var k = 0; k < this.variables.length; k++) {

                    if (this.variables[k].varName.toUpperCase() == objectsArray[i].operands[j].name.toUpperCase()) {

                        found = true; 

                        if (/BYTE/.test(this.variables[k].size)) 
                            objectsArray[i].operands[j].type = "VAR8";

                        else if (/WORD/.test(this.variables[k].size))
                            objectsArray[i].operands[j].type = "VAR16";

                        break;
                        
                    }

                }

                if (!found) {
                        
                    let varName = objectsArray[i].operands[j].name; 
                    
                    if (this._findInLabels(varName))
                        objectsArray[i].operands[j].type = "LBL"; 

                    else {

                        this.good = false;
                        this.errorLine = i+1; 
                        this.message = "Variable/Label doesn't exist"; 

                        return -1;
                    }

                    }
            }

            else if (/OFF/.test(objectsArray[i].operands[j].type)) {

                let opsVars = objectsArray[i].operands[j].name.split(" "); 
                if (!this._checkVariable(opsVars[1])) {

                    this.good = false; 
                    this.errorLine = i + 1; 
                    this.message = "ERROR: VARIABLE DOESN'T EXIST";

                    return -1;
                }

        }

    }
    
    return 0;
}
}
manageProcedures(objectsArray) {

    // handle procedures calling 

    var procBegin = 0,  // the object index where the procedure begins
        procEnd = 0,   
        inProc = false,
        endpFound = false, // end of the procedure
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

                        return -1;

                    }

                    procEnd = j; 

                    // checking if there is not another declaration of a procedure inside a procedure
                    for (var j = procBegin; j < objectsArray.length; j++) {

                        if (objectsArray[j].expressionType == "INST" && objectsArray[j].instName == "PROC") {

                            this.good = false; 
                            this.errorLine = j; 
                            this.message = "ERROR: INVALID PROCEDURE BODY"; 

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

                        return -1;
                    }

                    
                }

                else {

                    this.good = false; 
                    this.errorLine = i + 1 ; 
                    this.message = "ERROR: WRONG PROCEDURE DECLARATION"; 

                    return -1;

                }
            }

            else {

                this.good = false; 
                this.errorLine = i + 1; 
                this.message = "ERROR: WRONG PROCEDURE DECLARATION"; 

                return -1;
            }


        }
    
    }

    return 0;
}

executeDefine(objectsArray) {

    for (var i = 0; i < objectsArray.length; i++){

        if (objectsArray[i].expressionType == "INST" && objectsArray[i].instName == "DEFINE") {

            // instruction requires only 2 operands
            if (objectsArray[i].operands.length != 2) {

                this.good = false; 
                this.errorLine = objectsArray[i].index; 
                this.message = "ERROR: INVALID OPERANDS LIST FOR DEFINE INSTRUCTION"; 

                return -1;
            }

            // checking operands type 
            if (objectsArray[i].operands[0].type != "VAR" || objectsArray[i].operands[1].type != "INT") {
                this.good = false; 
                //this.errorLine = objectsArray[i].index; 
                this.message = "ERROR : INVALID OPERANDS"; 

                return -1;
            }

            let operandName = objectsArray[i].operands[0].name,
                operandValue = objectsArray[i].operands[1].name;

            // replacing in source code 
            for (var j = 0; j < objectsArray.length; j++) {

                for (var k = 0; k < objectsArray[j].operands.length; k++) {

                    if (objectsArray[j].operands[k].name == operandName) {

                        objectsArray[j].operands[k].name = operandValue; 
                        objectsArray[j].operands[k].type = "INT";

                    }
                }                    
            }                

        }
    }
    
    return 0;
}
  
  
  //====================================================================================================
  
  //General function for macro managing
	manageMacro(lexicalView){
		
		if ( this.getMacro(lexicalView) && !this.sameNameMacro() && this.manageMacroCalls(lexicalView) ) 
			return 1;
		else 
			return 0;
		
	}

	//Getting macros
	getMacro(lexicalView){

		var inMacro = false,
			macroIndex = 0,
			macroLineDeclaration = 0,
			macroLengthDeclaration = 0,
			localInstParameter = [];

		for (var i = 0; i < lexicalView.length; i++) 
		{
			let line = lexicalView[i];

			//CAS D'UNE INSTRCUTION LOCAL EN DEHORS D'UNE MACRO
			if ( line.expressionType == 'INST' && line.instName = 'LOCAL' && !inMacro ) 
			{
				this.message = 'ERROR : ILLEGAL USE OF "LOCAL" DIRECTIVE';
				this.good = false;
				return 0;
			}

			//CAS D'UNE INSTRCUTION ENDM EN DEHORS D'UNE MACRO
			else if ( line.expressionType == 'INST' && line.instName = 'ENDM' && !inMacro) 
			{
				this.message = 'ERROR : ILLEGAL USE OF "ENDM" DIRECTIVE';
				this.good = false;
				return 0;
			}

			//CAS D'UNE DECLARATION MACRO DANS UNE AUTRE MACRO
			else if ( line.expressionType == 'macro definition' && inMacro)
			{
				this.message = 'ERROR : MACRO DECLARATION MISSING "ENDM" SYMBOL';
				this.good = false;
				return 0;
			}


			else if ( line.expressionType == 'macro definition' && !inMacro)
			{
				inMacro = true;
				macroIndex = line.index;
				this.macro.push({
					name: line.instName,
					op: line.operands,
					index: line.index,
					innerContent: [],
					localInstParameter: [],
				});

				macroLineDeclaration = i;
				macroLengthDeclaration = 1;
			}

			else if ( line.expressionType == 'INST' && line.instName = 'LOCAL' && inMacro ) 
			{
				if ( localInstParameter.length != 0 ) 
				{
					this.message = 'ERROR : ONLY ONE LOCAL DIRECTIVE IN A MACRO ALLOWED';
					this.good = false;
					return 0;
				}
				else
					localInstParameter = line.operands;

				macroLengthDeclaration++;
			}

			else if ( line.expressionType == 'INST' && line.instName = 'ENDM' && inMacro) 
			{
				inMacro = false;
				j++;
				macroLengthDeclaration++;

				lexicalView.splice(macroLineDeclaration, macroLengthDeclaration, ...[]);
				//On enleve les lignes de la declaration de macro
				i -= macroLengthDeclaration;
				macroLengthDeclaration = 0;
			}

			else
			{

				macroLengthDeclaration++;
				this.macro[j].innerContent.push(line);
			}

		}
		//CAS D'UNE MACRO QUI NE FINIT PAS AVEC LE SYMBOLE "ENDM"
		if ( inMacro ) 
		{
			this.message = 'ERROR : MACRO DECLARATION MISSING "ENDM" SYMBOL';
			this.good = false;
			return 0;
		}

		return 1;
	}

	//Verification de si deux macros portes le même nom
	sameNameMacro(){
		for (var i = 0; i < macros.length; i++) 
			for (var j = i+1; j < macros.length; j++) 
				if(macros[i].name == macros[j].name)
					return 1;
			
			
		return 0
	}

	//Rend l'indice de la macro dans le tableau this.macro
	getMacroId(neededMacroName){
		var i = 0,
			trouve = false;

		while (!trouve && i < this.macros)
		{
			trouve = macros[i].name == neededMacroName;
			i++;
		}
		
		//si on trouve on rend lindice, sinon on rend -1
		return (trouve) ? i : -1;
	}


	//Remplace le code de la macro
	manageMacroCalls(lexicalView){
		let nbParcours = 0;

		for (var i = 0; i < lexicalView.length; i++) {
			let line = lexicalView[i];

			if ( line.expressionType == "MACRO" ) 
			{
				//ON EXTRAIT LA MACRO PUIS ON VERIFIE SI ELLE EXISTE
				//------------------------------------------------------------
				//------------------------------------------------------------
				let macroId = this.getMacroId(line.instName);
				if ( macroId == -1) 
				{
					this.message = 'ERROR : UNDECLARED MACRO ';
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
							variableName: '__' + line.instName + j.toString(),

						});

						lexicalView[i].operands[j].type = "VAR8";
						lexicalView[i].operands[j].name = '__VAR' + line.instName + j.toString();
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
						instructionType: null,
						instName: 'DB',
						good: true,
						operands: [
							{name: stringParameter[j], type: 'STR'},
							{name: '0', type: 'INT'}
						],
						variableName: '__' + line.instName + j.toString(),
						variableType: 'DB',

						index: line.index
					});
					jmpPadding += stringParameter[j].length - 2 + 1
					// -2 : les guillemets
					// +1 : le zero final
				}

				//Si on un une declaration de string, on push un jump
				if ( jmpPadding != 0 )
				{
					//Si le padding est plus petit qu'un byte, alors on aura un short jump(2bytes)
					//Sinon, ça sera un long jump (3bytes)
					jumpPadding = ((jmpPadding+2) & 0xFF) == 0 ? jmpPadding + 2 : jmpPadding + 3;

					macroCode.unshift({
						label: null,
						expressionType: 'INST',
						instructionType: null,
						instName: 'JMP',
						good: true,
						operands: [
							{name: jumpPadding.toString() , type: 'INT'},
						],
						variableName: null,
						variableType: null,

						index: line.index
					});
				}

				//------------------------------------------------------------
				//------------------------------------------------------------

				this.replaceOccMacro(lexicalView[i].operands, macroId);

				for (var j = 0; j < this.macros[macro].innerContent.length; j++) 
				{

					let lineInMacro = this.macros[macro].innerContent[j];

					macroCode.push(lineInMacro);
				}
				

				//On remplace
				lexicalView.splice(i, 1, ...macroCode);
			}
			
		}


	}


	//Remplacing the macro declaration and local labels
	replaceOccMacro(operands, macroId)
	{
		let table = this.macros[macroId].innerContent,
			labelList = this.macro[macroId].localInstParameter,
			parameterList = this.macro[macroId].op;//list of <operand objects>

		//remplacing local labels
		for (var i = 0; i < labelList.length; i++) 
		{

			let labelToBeChanged = labelList[i];

			//For every line in the macro
			for (var j = 0; j < table.length; j++) 
			{

				//For a label as a label declaration
				for (var k = 0; k < table[j].label.length; k++) 
				
					if ( table[j].label[k] == labelToBeChanged ) 

						table[j].label[k] = '__LOCAL_LABEL' + labelToBeChanged;

				
				

				//For a label as an operand 
				for (var k = 0; k < table[j].operands.length; k++) 
				{

					let op = table[j].operands[k];

					if ( op.name == labelToBeChanged ) 

						op.name = '__LOCAL_LABEL' + labelToBeChanged;

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
					if ( op.name == parameterName.name ) 
					{

						op.name = parameterValue.name;
						op.type = parameterValue.type;
					}

						

				}
			}
		}
		
	}

}


// testing 

var op = {
    operands : ["A", "10"],
}
var objectsArray = [
    {
        expressionType: "VAR", 
        variableName: "X", 
        variableClass: "DW", 
        label: "label1", 
        instName :"CMP",
        operands : [{
            name: "offset X", 
            type: "OFF",
        }]
    },
    {
    expressionType: "INST",
    variableName: "X", 
    variableClass: "DB", 
    label: "label1",  
    instName: "PROC",
    operands:[{
        name: "label1", 
        type: "VAR",
    },
    ],

},
{
    expressionType: null, 
    variableName: "A", 
    variableClass: "DW", 
    label: null,
    instName: "MOV",
    operands:[{
        name: "label1", 
        type: "VAR",
    }],
},
{
    expressionType: "INST", 
    variableName: "A", 
    variableClass: "DW", 
    label: null,
    instName: "MOV",
    operands:[{
        name: "label1", 
        type: "VAR",
    }],
},
{
    expressionType:"INST", 
    variableName: "Y", 
    variableClass: "DB", 
    label: "label3",
    instName: "DEFINE",
    operands:[{
        name: "label1", 
        type: "VAR",
    },
    {name: "10",
    type: "INT",},],
},];

var testObj = new PreProcessor(); 
testObj.getVariables(objectsArray);
//console.log(testObj.variables);
//console.log(testObj.manageProcedures(objectsArray));
//console.log(testObj.manageProcedures(objectsArray));
console.log(testObj.executeDefine(objectsArray));
console.log(testObj.message);
console.log(objectsArray[2].operands);
/* expressionType = "INST"
instName = "PROC"
operands = 1 element and type = "VAR"
expressionType = INST && instName = "ENDP" 

*/

