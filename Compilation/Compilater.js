//verifie ligne avec juste un commentaire

class Compiler{


    static compile(brute_code){

        //----------------------------------------------------------------
        let lexicalOutput = (new LexicalAnalysis()).analyse(brute_code);

        let lexicalView = lexicalOutput.lexicalView;

        if (lexicalOutput.status == false) 
        {
            console.log('lexical');
            let errorLine = lexicalView.length-1,
                message = lexicalView[errorLine].message;

            return this.manageErrors(errorLine, message);
        }

        //----------------------------------------------------------------

        let prepResult = new PreProcessor(lexicalView).executePostLexical();

        let newLexical = prepResult.lexicalView;

        if (prepResult.status == false) 
        {
            console.log('postLexial');
            let errorLine = prepResult.errorLine,
                message = prepResult.message;

            return this.manageErrors(errorLine, message);
        }

        //----------------------------------------------------------------
        
        
        let syntResult = new SyntaxAnalysis().analyse(newLexical);
        
        if (syntResult.good == false) 
        {
            console.log('syntax');
            let errorLine = syntResult.index,
                message = syntResult.message;

            return Compiler.manageErrors(errorLine, message);
        }
        console.log('fin syntax');
        //----------------------------------------------------------------
        let varArray = prepResult.varArray,
            labelArray = prepResult.labelArray,
            origin = prepResult.origin;
        
        var finalView = new Linkage(varArray, labelArray, origin).addressResolving(newLexical);

        let postLinkageState = PreProcessor.executePostLinkVerif(finalView);

        if (postLinkageState.good == false) 
        {
            console.log('link');
            let errorLine = postLinkageState.errorLine,
                message = postLinkageState.message;

            return this.manageErrors(errorLine, message);
        }


        return {
            status: true,
            origin: newLexical.origineValue,
            message: '',
            errorLine: null,
            finalView: finalView,
            varArray: varArray,
            labelArray: labelArray
        }

        /*
            finalView => Array of object in the form of =>
            
            {
                executableLine: boolean, //this shall be set to false for NULL instrcution

                originalLine: str,
                resolvedLine: str,
                opcodes: int[],

                instructionSize: int,
                instructionAddr: int
            }
            
            varArry => Array of variablesObject
            
            variablesObject = {

                line : null,
                size: null, 
                varName: null, 
                addr: 0,
            }

        */
    }

    static manageErrors(errorLine, message){
        return {
            status: false,
            origin: null,
            message: message,
            errorLine: errorLine,
            finalView: null,
            varArray: null,
            labelArray: null
        }
    }
}
