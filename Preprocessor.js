class PreProcessor {
   
    constructor() {

        this.variables = [];
        this.labels = [];
        this.good = true; 
        this.message = ""; 
        this.errorLine = null;

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
                        
                        // checking if the code inside the procedure is correct 
                        j = procBegin; 
                        while ( !valid && objectsArray[j].instName != "ENDP" ) {

                            // checking if there is at least one valid instruction
                            if (objectsArray[j].expressionType != null)

                                valid = true; 

                            // checking if there is not another declaration of a procedure inside a procedure
                            if (objectsArray[j].expressionType == "INST" && objectsArray[j].instName == "PROC") {

                                this.good = false; 
                                this.errorLine = j; 
                                this.message = "ERROR: INVALID PROCEDURE BODY"; 

                                return -1;
                            }

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

