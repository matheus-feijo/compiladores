
import fs from "fs";
import { eachLine } from "line-reader";

const numbers = ["1","2","3","4","5","6","7","8","9"];
const operators = ['+','/','-','*','^','(',')'];

const stateNumber = ['+','-'];

const aceito = [1,8,10,12]


export class Lexico{
  
    static getDados(url){

        var stage = 0;

        eachLine(url,(line,last)=>{

            const tokens = [];
            var num = 0;

            for(let i=0;i<line.length;i++){
                
                if(line[i] === ' '){
                    continue;
                }

                if(numbers.includes(line[i])){
                    stage = 1
                    num = num* 10 + parseInt(line[i]);


                }else if(line[i] === '+' || line[i] === '-'){
                    stage = 2

                }else if(line[i] === '('){
                    stage = 3
                }

               

                


        
                if(numbers.includes(line[i])){
                    
                    stage= 1
                    var flag = -1;
                    var position = i;
                    var numSelect = parseInt(line[i]);
                    
                    //Percorre a linha ate não encontrar mais numeros
                    while(flag !== 0){
                        //verifica se o proximo item é um numero tambem e adiciona na variavel
                        if(numbers.includes(line[position + 1])){
                            numSelect = numSelect * 10 + parseInt(line[position + 1]);
                            position++;
                        }else{
                            flag = 0;
                        }
                    }
                    i= position;
    
                    if(line[i+1] === "."){

                        
                    }
                    tokens.push(numSelect);
                }
    
                if(operators.includes(line[i])){
                    tokens.push(line[i]);
                    //console.log(line[i]);
                }
            }
            console.log(tokens);
            console.log("----");
        })

        if(aceito.includes(stage)){
            return "LINGUAGEM ACEITA"
        }else{
            return "LINGUAGEM NAO ACEITA"
        }
    }
}



