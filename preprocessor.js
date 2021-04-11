class PreProcessor {
   
    constructor() {

        this.variables = [];
        this.labels = [];
        this.good = true; 
        this.message = ""; 
        this.lineError = null;

    }

    static executePostLexical(lexicalView) {


    }

    getVariables(objectsArray) {

        // looping through each line and extract variable names and labels

        var variablesObject = {

            line : null,
            size: null, 
            varName: null, 

        }

        var labelsObject = {

            line: null, 
            labelName : null,
        }

        for (var i = 0; i < objectsArray.length; i++) {

            if (objectsArray[i].expressionType == "VAR" && objectsArray[i].variableName != null) {

                variablesObject.line = i; 
                variablesObject.varName = objectsArray[i].variableName.toUpperCase(); 

                if(/DB/.test(objectsArray[i].variableClass))

                    variablesObject.size = "BYTE";

                else if(/DW/.test(objectsArray[i].variableClass))

                    variablesObject.size = "WORD";

                //this.variables.push(variablesObject);
                
            }

                

            if (objectsArray[i].label != null) {

                labelsObject.line = i; 
                labelsObject.labelName = objectsArray[i].label.toUpperCase();

                this.labels.push(labelsObject);

            }

        }

        console.log(this.variables);
    }

    manageVariables(objectsArray) {

        var found = null;

        // looking for a specific variable in variables array
        for(var i = 0; i < objectsArray.length; i++) {

            for (var j = 0; j < objectsArray[i].operands.length; j++) {

                found = false;

                if (/VAR/.test(objectsArray[i].operands[j].type)) {


                    for (var k = 0; k < this.variables.length; k++) {

                        if (this.variables[k].varName == objectsArray[i].operands[j].name) {

                            found = true; 

                            if (/BYTE/.test(this.variables[k].size)) 
                                objectsArray[i].operands[j].name = "VAR 8";

                            else if (/WORD/.test(this.variables[k].size))
                                objectsArray[i].operands[j].name = "VAR 16";

                            break;
                        }


                    }

                    if (!found) {

                        this.good = false;
                        this.message = "Error: Variable doesn't exist"; 
                        this.lineError = i; 

                        return -1;
                    }

                    
                }
            }

        }

        // looking for a specific variable in labels array 

        for (var i = 0; i < objectsArray.length; i++) {

            for (var j = 0; j < objectsArray[i].operands.length; j++) {

                found = false; 

                if (/VAR/.test(objectsArray[i].operands[j].type)) {

                    for (var k = 0; k < this.variables; k++) {

                        if (this.variables[k].varName == objectsArray[i].operands[j].name) {

                            found = true; 

                            objectsArray[i].operands[j].name = "LBL";
                        }
                    }

                    if (!found) {

                        this.good = false;
                        this.message = "Error: variable doesn't exist"; 
                        this.lineError = i; 

                        return -1;

                    }
                }
            }
        }
    }


    static executeDefine(code, obj) {

        // code is the whole code written by the user
        // obj is an object

        // convert the code into an array of instructions
        var instArray = code.split('\n');
        
        for (var i = 0; i < instArray.length; i++) {

            if (instArray[i] != "" || instArray[i] != " ") {

                if (/DEFINE/.test(instArray[i])) {

                    // first value after the DEFINE keyword 
                    var firstValue = obj.operands[0]; 

                    // second value after the DEFINE with which we will replace it
                    var secondValue = obj.operands[1];  

                }

            }
        }

        // get the instructions which doesn't contain DEFINE 
        var opcodes = instArray.filter(inst => !/DEFINE/.test(inst));

        // replacing in source code 
        opcodes = opcodes.map((item) => {if (item.indexOf(firstValue) != -1) return item.replace(firstValue, secondValue); else return item});

        return opcodes.join('\n');
    }

}


// testing 

var op = {
    operands : ["A", "10"],
}
var objectsArray = [{
    expressionType: "VAR",
    variableName: "X", 
    variableClass: "DB", 
    label: "label 1",    

},
{
    expressionType:"VAR", 
    variableName: "Y", 
    variableClass: "DW", 
    label: "label 2",
},
{
    expressionType:"VAR", 
    variableName: "Z", 
    variableClass: "DB", 
    label: "label 3",
},];

var testObj = new PreProcessor(); 
testObj.getVariables(objectsArray);

// more testing is needed
/*var sub = document.getElementById("sub"); 
    text = document.getElementById("code");
    code = "";
    instArray = [];

sub.onclick = function() {

    code = text.value; 
    console.log(PreProcessor.executeDefine(code, op));
}
*/
