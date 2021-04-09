class PreProcessor {

   
    static executePostLexical(lexicalView) {


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
// var testObj = new PreProcessor(); 
var op = {
    operands : ["A", "10"],
}


var sub = document.getElementById("sub"); 
    text = document.getElementById("code");
    code = "";
    instArray = [];

sub.onclick = function() {

    code = text.value; 
    console.log(PreProcessor.executeDefine(code, op));
}

