function hex(string) {

    let str = string.trim();

    if (/^[a-f0-9]+$/i.test(str)) {

        if ((parseInt(str, 16) >> 20) === 0)          
            return { message: "", value: parseInt(str, 16) }
        
        else           
            return  { message: "OUT OF BOUND", value: -1 }
        
    }
    else if (/^[a-f0-9]+\s*\:\s*[a-f0-9]+$/i.test(str)) {
       

        let offset = str.match(/(?<=:\s*)[a-f0-9]+/i)[0];
        let segment = str.match(/[a-f0-9]+(?=\s*\:)/i)[0];

        if ((parseInt(offset, 16) >> 16) === 0 && (parseInt(segment, 16) >> 16) === 0) {

            if (((parseInt(segment, 16) * 16 + parseInt(offset, 16)) >> 20) === 0)
                return { message: "", value: (parseInt(segment, 16) * 16 + parseInt(offset, 16))}
                    
            else
                return { message: "OUT OF BOUND", value: -1 }           
        }
        else
               return { message: "OUT OF BOUND", value: -1 }          
    }
    else
        return { message: "INVALID FORMAT", value: -1 }
}

