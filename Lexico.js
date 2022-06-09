
import fs from "fs";
import { eachLine } from "line-reader";




eachLine('./texto.txt',(line,last)=>{
    
    var textLine = line;

    for(let i=0;i<textLine.length;i++){
        if(textLine[i] === ' '){
            continue;
        }else{
            console.log(textLine[i]);
        }
        
    }

    console.log(" - - -")
})





