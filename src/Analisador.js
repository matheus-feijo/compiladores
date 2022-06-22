import { eachLine } from "line-reader";

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const operators = ['+', '-', '*', '/', '^', '(', ')', '[', ']'];
const acceptedStages = [5, 20, 14, 17];

export class Analisador {
    static lexico(url) {
        eachLine(url, (line, last) => {
            const tokens = [];
            var num = 0;
            var stage = 0;
            var divisor = 1;
            var expoente;

            for (let i = 0; i < line.length; i++) {
                if (line[i] === " " || line[i] === "\t" || line[i] === "\n") {
                    continue;
                }

                if (stage === 0) {
                    if (line[i] === 'e') {
                        expoente = 'e';
                        stage = 1;
                    } else if (numbers.includes(line[i])) {
                        num = parseInt(line[i]);
                        stage = 3;
                    } else if (operators.includes(line[i])) {

                        stage = 6;
                        tokens.push(line[i]);
                    } else {
                        stage === 100;
                    }

                } else if (stage === 1) {
                    if (line[i] === 'x') {
                        expoente = expoente + 'x';
                        stage = 2;
                    } else {
                        stage = 100;
                    }

                } else if (stage === 2) {
                    if (line[i] === 'p') {
                        expoente = expoente + 'p';
                        tokens.push(expoente);
                        expoente = '';
                        stage = 0;
                    } else {
                        stage = 100;
                    }

                    //stage = numbers
                } else if (stage === 3) {
                    if (numbers.includes(line[i])) {
                        num = num * 10 + parseInt(line[i]);
                        stage = 3;
                    } else if (line[i] === '.') {
                        stage = 4
                    } else if (operators.includes(line[i])) {
                        stage = 6;
                        tokens.push(num);
                        num = 0;
                        tokens.push(line[i]);

                    } else if (line[i] === 'e') {
                        stage = 1;
                        expoente = 'e';
                        tokens.push(num);
                        num = 0;
                    }

                    //stage = ' . '
                } else if (stage === 4) {
                    if (numbers.includes(line[i])) {
                        stage = 5;
                        divisor = divisor * 10;
                        num = parseInt(num) + parseFloat(line[i] / divisor);
                    } else {
                        stage = 100;
                    }

                } else if (stage === 5) {
                    if (numbers.includes(line[i])) {
                        stage = 5;
                        divisor = divisor * 10;
                        num = parseInt(num) + parseFloat(line[i] / divisor);
                    } else if (operators.includes(line[i])) {
                        stage = 6;
                        tokens.push(num);
                        num = 0;
                        divisor = 1;
                        tokens.push(line[i]);
                    } else if (line[i] === 'e') {
                        tokens.push(num);
                        num = 0;
                        divisor = 1;
                        stage = 1;
                        expoente = 'e';
                    }

                    //stage operators = () [] - + * / ^
                } else if (stage === 6) {
                    if (numbers.includes(line[i])) {
                        stage = 3;
                        num = parseInt(line[i]);

                        i === line.length - 1 && tokens.push(line[i]);

                    } else if (line[i] === 'e') {
                        stage = 1;
                        expoente = 'e';
                    } else if (operators.includes(line[i])) {
                        stage = 6;
                        tokens.push(line[i]);

                    }

                }
            }
            if (stage === 100) {
                throw new Error('Sintaxe nao permitida')
            } else {
                //console.log(tokens);
                this.sintatico(tokens);
            }
        });

    }

    static sintatico(tokens) {

        var gramar = ['E'];
        var casamento = [];

        while (gramar.length !== 0) {

            if (gramar[0] === 'E') {
                gramar.shift();
                gramar.unshift('E1');
                gramar.unshift('T');

            } else if (gramar[0] === 'T') {
                gramar.shift();
                gramar.unshift('T1');
                gramar.unshift('P');

            } else if (gramar[0] === 'P') {

                gramar.shift();

                if (tokens[0] === 'exp' && tokens[1] === '[') {
                    gramar.unshift(tokens[1]);
                    gramar.unshift(tokens[0]);

                    tokens.shift(); //remove exp 
                    tokens.shift(); //remove ' [ '

                    gramar.unshift('P1');
                } else {
                    gramar.unshift('P1');
                    gramar.unshift('F');
                }

            } else if (gramar[0] === 'F') {
                gramar.shift();
                if (typeof tokens[0] === "number") {
                    casamento.push(tokens[0]);
                    tokens.shift() //remove numero da primeira posicao da fila

                } else if (tokens[0] === '(') {
                    gramar.unshift(')');
                    gramar.unshift('E');
                    casamento.push(tokens[0]);
                    tokens.shift();
                }

            } else if (gramar[0] === 'E1') {
                gramar.shift();

                if (tokens[0] === '+' || tokens[0] === '-') {

                    gramar.unshift('E1');
                    gramar.unshift('T');
                    casamento.push(tokens[0]);
                    tokens.shift() //remove operador '+' ou '-'

                }

            } else if (gramar[0] === 'T1') {
                gramar.shift();

                if (tokens[0] === '*' || tokens[0] === '/') {
                    gramar.unshift('T1');
                    gramar.unshift('P');
                    casamento.push(tokens[0]);
                    tokens.shift() //remove operador '*' ou '/'

                }

            } else if (gramar[0] === 'P1') {
                gramar.shift();
                if (tokens[0] === '^') {
                    gramar.unshift('P1');
                    gramar.unshift('F');
                    casamento.push(tokens[0]);
                    tokens.shift() //remove '^'

                }
            }

            console.log(gramar)
        }
        console.log(casamento);
    }
}
