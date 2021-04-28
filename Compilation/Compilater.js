//verifie ligne avec juste un commentaire

class Compiler{
    static manageErrors(){

    }

    static compile(brute_code){

        //----------------------------------------------------------------
        let lexicalOutput = (new LexicalAnalysis()).analyse(brute_code);

        let lexicalView = lexicalOutput.lexicalView;

        if (lexicalOutput.status == false) 
        {

            let errorLine = lexicalView[i].length-1,
                message = lexicalView[errorLine].message;

            return this.manageErrors(errorLine, message);
        }

        //----------------------------------------------------------------

        let prepResult = new PreProcessor(lexicalView).executePostLexical();

        let newLexical = prepResult.lexicalView;

        if (prepResult.status == false) 
        {

            let errorLine = prepResult.errorLine,
                message = prepResult.message;

            return this.manageErrors(errorLine, message);
        }

        //----------------------------------------------------------------
        

        let syntResult = new SyntaxAnalysis().analyse(newLexical);
        
        if (syntResult.good == false) 
        {

            let errorLine = syntResult.index,
                message = syntResult.message;

            return Compiler.manageErrors(errorLine, message);
        }

        //----------------------------------------------------------------
        let varArray = prepResult.varArray,
            labelArray = prepResult.labelArray,
            origin = prepResult.origin;
        
        let finalView = new Linkage(varArray, labelArray, origin).addressResolving(newLexical);

        let postLinkageState = PreProcessor.executePostLinkVerif(finalView);

        if (postLinkageState.good == false) 
        {

            let errorLine = postLinkageState.index,
                message = postLinkageState.message;

            return this.manageErrors(errorLine, message);
        }


        return {
            status: true,
            message: '',
            errorLine: null,
            finalView: finalView
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

        */
    }

    static manageErrors(errorLine, message){
        return {
            status: false,
            message: '',
            errorLine: errorLine,
            finalView: message
        }
    }
}
