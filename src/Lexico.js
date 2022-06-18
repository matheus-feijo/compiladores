import { eachLine } from "line-reader";

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const operators = ['+', '-', '*', '/', '^'];
const acceptedStages = [5, 20, 14, 17];

export class Lexico {
    static getTokens(url) {
        eachLine(url, (line, last) => {
            const tokens = [];
            var num = 0;
            var stage = 0;
            var divisor = 1;

            for (let i = 0; i < line.length; i++) {
                if (line[i] === " " || line[i] === "\t" || line[i] === "\n") {
                    continue;
                }

                /**stages dentro do parenteses */
                if (stage === 0) {
                    if (line[i] === "(") {
                        stage = 1;
                        tokens.push(line[i]);

                    } else if (numbers.includes(line[i])) {
                        stage = 14;

                        num = parseInt(line[i]);

                    } else if (line[i] === 'e') {
                        stage = 17;
                        tokens.push('exp');
                        i = i + 2;

                    } else {
                        stage = 100;
                    }

                    // stage = (
                } else if (stage === 1) {
                    if (numbers.includes(line[i])) {
                        stage = 2;

                        num = parseInt(line[i]);

                    } else if (line[i] === "-") {
                        stage = 12;
                        tokens.push(line[i]);

                    } else if (line[i] === "e") {
                        stage = 6;
                        i = i + 2;
                        tokens.push('exp');

                    } else {
                        stage = 100;
                    }

                    //stage = n
                } else if (stage === 2) {
                    if (numbers.includes(line[i])) {

                        stage = 2;
                        num = num * 10 + parseInt(line[i]);

                    } else if (operators.includes(line[i])) {
                        stage = 3;

                        tokens.push(num);
                        num = 0;

                        tokens.push(line[i]);

                    } else if (line[i] === ".") {
                        stage = 10;

                    } else {
                        stage = 100;
                    }

                    //stage = *,-,+, /
                } else if (stage === 3) {
                    if (numbers.includes(line[i])) {
                        stage = 4;
                        num = parseInt(line[i]);

                    } else if (line[i] === "e") {
                        stage = 6;
                        i = i + 2;
                        tokens.push('exp');

                    } else {
                        stage = 100;
                    }

                    //stage = n
                } else if (stage === 4) {
                    if (numbers.includes(line[i])) {
                        stage = 4;

                        num = num * 10 + parseInt(line[i]);

                    } else if (line[i] === ".") {
                        stage = 11;

                    } else if (operators.includes(line[i])) {
                        stage = 3;

                        tokens.push(num);
                        num = 0;

                        tokens.push(line[i]);

                    } else if (line[i] === ')') {
                        stage = 5;
                        tokens.push(num);
                        num = 0;

                        tokens.push(line[i]);

                    } else {
                        stage = 100;
                    }

                    //stage = )
                } else if (stage === 5) {
                    if (operators.includes(line[i])) {
                        stage = 21;
                        tokens.push(line[i]);

                    }

                    //stage = exp
                } else if (stage === 6) {
                    if (line[i] === '[') {
                        stage = 7;
                        tokens.push(line[i]);

                    } else {
                        stage = 100;
                    }

                    //stage = [
                } else if (stage === 7) {
                    if (numbers.includes(line[i])) {
                        stage = 8;
                    } else {
                        stage = 100;
                    }

                    //stage = n
                } else if (stage === 8) {
                    if (numbers.includes(line[i])) {
                        stage = 8;
                    } else if (line[i] === ']') {
                        stage = 9;
                        tokens.push(line[i]);

                    } else {
                        stage = 100;
                    }

                    //stage = ]
                } else if (stage === 9) {
                    if (operators.includes(line[i])) {
                        stage = 3;
                    } else if (line[i] === ')') {
                        stage = 5;

                    } else {
                        stage = 100;
                    }

                    //stage = .
                } else if (stage === 10) {
                    if (numbers.includes(line[i])) {
                        stage = 12;
                        divisor = divisor * 10;
                        num = parseInt(num) + parseFloat(line[i] / divisor);

                    } else {
                        stage = 100;
                    }

                    //stage = .
                } else if (stage === 11) {
                    if (numbers.includes(line[i])) {
                        stage = 13;

                        divisor = divisor * 10;
                        num = parseInt(num) + parseFloat(line[i] / divisor);

                    } else {
                        stage = 100;
                    }

                    //stage = n
                } else if (stage === 12) {
                    if (numbers.includes(line[i])) {
                        stage = 12;
                        divisor = divisor * 10;
                        num = parseInt(num) + parseFloat(line[i] / divisor);

                    } else if (operators.includes(line[i])) {
                        stage = 3;

                        tokens.push(num);
                        num = 0;
                        divisor = 1;

                        tokens.push(line[i]);

                    } else {
                        stage = 100;
                    }

                    //stage = n
                } else if (stage === 13) {
                    if (numbers.includes(line[i])) {
                        stage = 13;
                        divisor = divisor * 10;
                        num = parseInt(num) + parseFloat(line[i] / divisor);

                    } else if (operators.includes(line[i])) {
                        stage = 3;

                        tokens.push(num);
                        num = 0;
                        divisor = 1;

                        tokens.push(line[i]);


                    } else if (line[i] === ')') {
                        stage = 5;

                        tokens.push(num);
                        num = 0;
                        divisor = 1;

                        tokens.push(line[i]);

                    } else {
                        stage = 100;
                    }

                    /**stages fora do parenteses */

                    //stage = n 
                } else if (stage === 14) {
                    if (numbers.includes(line[i])) {
                        stage = 14;

                        num = num * 10 + parseInt(line[i]);

                    } else if (line[i] === '.') {
                        stage = 15;

                    } else if (operators.includes(line[i])) {
                        stage = 21;
                        tokens.push(num);
                        num = 0;

                        tokens.push(line[i]);

                    }

                    //stage = .
                } else if (stage === 15) {
                    if (numbers.includes(line[i])) {
                        stage = 16;

                        divisor = divisor * 10;
                        num = parseInt(num) + parseFloat(line[i] / divisor);

                    } else {
                        stage = 100;
                    }

                    //stage = n
                } else if (stage === 16) {
                    if (numbers.includes(line[i])) {
                        stage = 16;
                        divisor = divisor * 10;
                        num = parseInt(num) + parseFloat(line[i] / divisor);

                    } else if (operators.includes(line[i])) {
                        stage = 21;
                        tokens.push(num);
                        num = 0;
                        divisor = 1;
                        tokens.push(line[i]);

                    } else {
                        stage = 100;
                    }

                    //stage = exp
                } else if (stage === 17) {
                    if (line[i] === '[') {
                        stage = 18;
                        tokens.push(line[i]);
                    }

                    //stage = [
                } else if (stage === 18) {
                    if (numbers.includes(line[i])) {
                        stage = 19;
                        num = parseInt(line[i]);

                    } else {
                        stage = 100;
                    }

                    //stage = n
                } else if (stage === 19) {
                    if (numbers.includes(line[i])) {
                        stage = 19;
                        num = num * 10 + parseInt(line[i]);

                    } else if (line[i] === ']') {
                        stage = 20;
                        tokens.push(num);
                        num = 0;

                        tokens.push(line[i]);

                    } else {
                        stage = 100;
                    }

                    //stage = ]  
                } else if (stage === 20) {
                    if (operators.includes(line[i])) {
                        stage = 21;
                        tokens.push(line[i]);

                    }

                    //stage = *, + , - , / , ^  
                } else if (stage === 21) {
                    if (numbers.includes(line[i])) {
                        stage = 14;
                        num = parseInt(line[i]);

                        if (line[i + 1] === undefined) {
                            tokens.push(num);
                            num = 0;
                        }


                    } else if (line[i] === 'e') {
                        stage = 17;
                        i = i + 2;
                        tokens.push('exp');

                    } else if (line[i] === '(') {
                        stage = 1;
                        tokens.push(line[i]);

                    } else {
                        stage = 100;
                    }
                }
            }

            if (acceptedStages.includes(stage)) {
                console.log(tokens.length);
            }

            //console.log(tokens);
            //console.log(line)
            //console.log(stage);
        });
    }
}
