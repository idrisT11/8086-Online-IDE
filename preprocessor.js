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

        // Check if varName exists in this.variables and in this.labels
        
        // check in this.variables
        for (var i = 0; i < this.variables; i++) {

            if (this.variables[i].name == varName)

                // it exists
                return true;
        }

        for (var i = 0; i < this.labels; i++) {

            if (this.labels[i].name == varName)
                
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

            if (objectsArray[i].expressionType == "VAR" && objectsArray[i].variableName != null && !this._checkVariable(objectsArray[i].variableName)) {

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

                            /*console.log("OBJECT NUM:", i); 
                            console.log("THIS.VARIABLES: ", this.variables[k].varName);
                            console.log("OBJECTS VAR NAME: ", objectsArray[i].operands[j].name);
                            console.log("======================");*/

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
                            this.errorLine = i; 
                            this.message = "Variable/Label doesn't exist"; 

                            return -1;
                        }

                        }
                    
                }
            }

        }
        
        return 0;
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
    label: "label1",  
    operands:[{
        name: "X", 
        type: 'VAR',
    },
    {name: "X",
    type: 'VAR',},
    {name: "Y", 
    type: "VAR"},],

},
{
    expressionType:"VAR", 
    variableName: "A", 
    variableClass: "DW", 
    label: "label2",
    operands:[{
        name: "label1", 
        type: "VAR",
    }],
},
{
    expressionType:"VAR", 
    variableName: "Y", 
    variableClass: "DB", 
    label: "label3",
    operands:[{
        name: "Y", 
        type: "VAR",
    },
    {name: "A",
    type: "VAR",},],
},];

var testObj = new PreProcessor(); 
testObj.getVariables(objectsArray);
console.log(testObj.variables);
console.log(testObj.manageVariables(objectsArray));

//console.log(testObj.message);
//console.log(testObj.labels);
//console.log(testObj.variables);
/*var sub = document.getElementById("sub"); 
    text = document.getElementById("code");
    code = "";
    instArray = [];

sub.onclick = function() {

    code = text.value; 
    console.log(PreProcessor.executeDefine(code, op));
}
*/
