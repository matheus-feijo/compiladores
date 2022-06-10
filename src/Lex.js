import { eachLine } from "line-reader";


const numbers = ["1","2","3","4","5","6","7","8","9"];
const operators = ['+','-','*','/','^'];

const aceito = [2,16];


eachLine('./texto.txt',(line,last)=>{

    const tokens = [];
    var num = 0;
    var stage = 0;

    //console.log(line);

    for(let i=0;i<line.length;i++){
        
        const character = line[i];
        //console.log(character);

        if(line[i] === ' ' || line[i] === '\t' || line[i] === '\n'){
            continue
        }

        if(stage === 0){

            if(numbers.includes(character)){
                stage = 2;

            }else if(character === '-'){
                stage = 1;

            }else if(character === 'e' ){
                stage = 3;
                i = i+2;

            }else if(character === '('){
                stage = 4;

            }

        }else if(stage ===1){

            if(character === '('){
                stage = 4;

            }else if(character === 'e'){
                stage = 3;
                i = i+ 2;

            }else if(numbers.includes(character)){
                stage = 2;

            }

        }else if(stage ===2){
            if(numbers.includes(character)){
                stage = 2;

            }else if(character === '.'){
                stage = 12;

            }else if(operators.includes(character)){
                stage = 8;

            }else if(character === '='){
                stage = 15;

            }

        }else if(stage ===3){
            if(character === '['){
                stage = 5;
            }

        }else if(stage ===4){
            if(character === '-'){
                stage = 10;
            }else if(character === 'e'){
                stage = 3;
                i = i+2;

            }else if(numbers.includes(character)){
                stage = 9;
            }

        }else if(stage ===5){
            if(numbers.includes(character)){
                stage = 6;
            }

        }else if(stage ===6){

            if(numbers.includes(character)){
                stage = 6;
            }else if(character === ']'){
                stage = 7;
            }

        }else if(stage===7){
            if(operators.includes(character)){
                stage = 8;

            }else if(character == ')'){
                stage = 11;

            }else if(character === '='){
                stage = 15;
            }

        }else if(stage ===8){
            if(character === '('){
                stage= 4;

            }else if(numbers.includes(character)){
                stage = 14;
            }else if(character === 'e'){
                stage = 3;
                i= i+2;
            }

        }else if(stage ===9){
            if(character === '.'){
                stage = 13;

            }else if(operators.includes(character)){
                stage =8;

            }else if(numbers.includes(character)){
                stage =9;

            }else if(character === ')'){
                stage = 11;
            }

        }else if(stage ===10){
            if(numbers.includes(character)){
                stage = 9;
            }

        }else if(stage ===11){
            if(character === ')'){
                stage = 11;

            }else if(operators.includes(character)){
                stage = 8;
            }

        }else if(stage ===12){
            if(numbers.includes(character)){
                stage = 2;
            }
        
        }else if(stage ===13){
            if(numbers.includes(character)){
                stage = 9;
            }
        }else if(stage ===14){
            if(numbers.includes(character)){
                stage = 14;
            }else if(operators.includes(character)){
                stage = 8;
            }else if(character === ')'){
                stage = 11;
            }

        }

        //console.log(i);
    }
    console.log(line);
    //console.log("- - - - ")
    console.log(stage);
})