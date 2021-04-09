
class Compiler {


    static compile(code) {

        // takes the whole code written by the user
        
        // the whole code is store in an array of strings 
        var instArray = code.split('\n');

        // state && tab
        var lexicalView = lexicalAnalysis.extractLexicalView(code);

        // valid instruction
        if (lexicalView.good == true) {

            var postLexicalView = PreProcessor.executePostLexical(lexicalView.table);
            
        }

    }
}