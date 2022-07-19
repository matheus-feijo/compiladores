import { eachLine } from "line-reader";

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const operators = ['+', '-', '*', '/', '^', '(', ')', '[', ']'];

export class Analisador {
    static lexico(url) {
        eachLine(url, (line, last) => {
            const tokens = [];
            var num = 0;
            var stage = 0;
            var divisor = 1;
            var expoente;
            var flag = 0;
            var str = '';

            for (let j = 0; j < line.length; j++) {
                if (line[j] === " " || line[j] === "\t" || line[j] === "\n") {
                    continue;
                } else {
                    str = str + line[j];
                }
            }

            line = str;

            for (let i = 0; i < line.length && flag === 0; i++) {
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
                        flag = 1;
                    }

                } else if (stage === 1) {
                    if (line[i] === 'x') {
                        expoente = expoente + 'x';
                        stage = 2;
                    } else {
                        flag = 1;
                    }

                } else if (stage === 2) {
                    if (line[i] === 'p') {
                        expoente = expoente + 'p';
                        tokens.push(expoente);
                        expoente = '';
                        stage = 0;
                    } else {
                        flag = 1;
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
                    } else {
                        flag = 1;
                    }

                    //stage = ' . '
                } else if (stage === 4) {
                    if (numbers.includes(line[i])) {
                        stage = 5;
                        divisor = divisor * 10;
                        num = parseInt(num) + parseFloat(line[i] / divisor);
                    } else {
                        flag = 1;
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

                        i === line.length - 1 && tokens.push(parseInt(line[i]));

                    } else if (line[i] === 'e') {
                        stage = 1;
                        expoente = 'e';
                    } else if (operators.includes(line[i])) {
                        stage = 6;
                        tokens.push(line[i]);
                    } else {
                        flag = 1;
                    }
                }
            }
            if (flag === 1) {
                throw new Error(`'${line}' possui sintaxe incorreta para a linguagem`)
            } else {
                //console.log(tokens);
                this.sintatic(tokens, line);
            }
        });

    }

    static sintatic(tokens, line) {

        var copyTokens = tokens;
        var gramar = ['E'];
        var casamento = [];
        var caminho = [];
        var flag = 0;

        while (gramar.length !== 0 && flag === 0) {

            if (gramar[0] === 'E') {
                if (tokens[0] === '(') {
                    caminho.push('E');
                    gramar.shift();
                    gramar.unshift('E1');
                    gramar.unshift('T');

                } else if (tokens[0] === 'exp') {
                    caminho.push('E');
                    gramar.shift();
                    gramar.unshift('E1');
                    gramar.unshift('T');

                } else if (typeof tokens[0] === 'number') {
                    caminho.push('E');
                    gramar.shift();
                    gramar.unshift('E1');
                    gramar.unshift('T');

                } else {
                    flag = 1;
                }

            } else if (gramar[0] === 'E1') {
                if (tokens[0] === ')') {
                    caminho.push('E1');

                    gramar.shift();

                } else if (tokens[0] === '+') {
                    caminho.push('E1');

                    gramar.shift();
                    gramar.unshift('E1');
                    gramar.unshift('T');
                    gramar.unshift(tokens[0]);

                } else if (tokens[0] === '-') {
                    caminho.push('E1');

                    gramar.shift();
                    gramar.unshift('E1');
                    gramar.unshift('T');
                    gramar.unshift(tokens[0]);

                    //fim de cadeia
                } else if (tokens.length === 0) {
                    caminho.push('E1');

                    gramar.shift();
                } else {
                    flag = 1;
                }

            } else if (gramar[0] === 'T') {
                if (typeof tokens[0] === 'number') {
                    caminho.push('T');

                    gramar.shift();
                    gramar.unshift('T1');
                    gramar.unshift('P');

                } else if (tokens[0] === '(') {
                    caminho.push('T');

                    gramar.shift();
                    gramar.unshift('T1');
                    gramar.unshift('P');

                } else if (tokens[0] === 'exp') {
                    caminho.push('T');

                    gramar.shift();
                    gramar.unshift('T1');
                    gramar.unshift('P');

                } else {
                    flag = 1;
                }

            } else if (gramar[0] === 'T1') {
                if (tokens[0] === ')') {
                    caminho.push('T1');

                    gramar.shift();

                } else if (tokens[0] === '*') {
                    caminho.push('T1');

                    gramar.shift();
                    gramar.unshift('T1');
                    gramar.unshift('P');
                    gramar.unshift(tokens[0]);

                } else if (tokens[0] === '/') {
                    caminho.push('T1');

                    gramar.shift();
                    gramar.unshift('T1');
                    gramar.unshift('P');
                    gramar.unshift(tokens[0]);

                } else if (tokens[0] === '+') {
                    caminho.push('T1');

                    gramar.shift();

                } else if (tokens[0] === '-') {
                    caminho.push('T1');

                    gramar.shift();

                    //fim de cadeia
                } else if (tokens.length === 0) {
                    caminho.push('T1');

                    gramar.shift();
                } else {
                    flag = 1;
                }

            } else if (gramar[0] === 'P') {
                if (typeof tokens[0] === 'number') {
                    caminho.push('P');

                    gramar.shift();
                    gramar.unshift('P1');
                    gramar.unshift('F');

                } else if (tokens[0] === '(') {
                    caminho.push('P');

                    gramar.shift();
                    gramar.unshift('P1');
                    gramar.unshift('F');

                } else if (tokens[0] === 'exp' && tokens[1] === '[') {
                    caminho.push('P');

                    gramar.shift(); //remove o exp
                    gramar.shift(); //remove o '['
                    gramar.unshift('P1');
                    gramar.unshift(']');
                    gramar.unshift('F');
                    gramar.unshift('[');
                    gramar.unshift('exp');
                } else {
                    flag = 1;
                }

            } else if (gramar[0] === 'P1') {
                if (tokens[0] === ')') {
                    caminho.push('P1');

                    gramar.shift();

                } else if (tokens[0] === ']') {
                    caminho.push('P1');

                    gramar.shift();

                } else if (tokens[0] === '*') {
                    caminho.push('P1');

                    gramar.shift();

                } else if (tokens[0] === '/') {
                    caminho.push('P1');

                    gramar.shift();

                } else if (tokens[0] === '+') {
                    caminho.push('P1');

                    gramar.shift();

                } else if (tokens[0] === '-') {
                    caminho.push('P1');

                    gramar.shift();

                } else if (tokens[0] === '^') {
                    caminho.push('P1');

                    gramar.shift();
                    gramar.unshift('P1');
                    gramar.unshift('F');
                    gramar.unshift('^');

                    //fim de cadeia
                } else if (tokens.length === 0) {
                    gramar.shift();

                } else {
                    flag = 1;
                }

            } else if (gramar[0] === 'F') {

                if (typeof tokens[0] === 'number') {
                    caminho.push('F');
                    gramar.shift();
                    gramar.unshift(tokens[0]);

                } else if (tokens[0] === '(') {
                    caminho.push('F');
                    gramar.shift();
                    gramar.unshift(')');
                    gramar.unshift('E');
                    gramar.unshift('(');
                } else {
                    flag = 1;
                }

                //IF DOS NAO TERMINAIS PARA FAZER O CASAMENTO
            } else if (typeof gramar[0] === 'number') {
                caminho.push(tokens[0]);
                casamento.push(tokens[0]);
                gramar.shift();
                tokens.shift();

            } else if (gramar[0] === '(') {
                caminho.push(tokens[0]);
                casamento.push(tokens[0]);
                gramar.shift();
                tokens.shift();

            } else if (gramar[0] === ')') {
                caminho.push(tokens[0]);
                casamento.push(tokens[0]);
                gramar.shift();
                tokens.shift();

            } else if (gramar[0] === 'exp') {
                caminho.push(tokens[0]);
                casamento.push(tokens[0]);
                gramar.shift();
                tokens.shift();

            } else if (gramar[0] === '[') {
                caminho.push(tokens[0]);
                casamento.push(tokens[0]);
                gramar.shift();
                tokens.shift();

            } else if (gramar[0] === ']') {
                caminho.push(tokens[0]);
                casamento.push(tokens[0]);
                gramar.shift();
                tokens.shift();

            } else if (gramar[0] === '*') {
                caminho.push(tokens[0]);
                casamento.push(tokens[0]);
                gramar.shift();
                tokens.shift();

            } else if (gramar[0] === '/') {
                caminho.push(tokens[0]);
                casamento.push(tokens[0]);
                gramar.shift();
                tokens.shift();

            } else if (gramar[0] === '+') {
                caminho.push(tokens[0]);
                casamento.push(tokens[0]);
                gramar.shift();
                tokens.shift();

            } else if (gramar[0] === '-') {
                caminho.push(tokens[0]);
                casamento.push(tokens[0]);
                gramar.shift();
                tokens.shift();

            } else if (gramar[0] === '^') {
                caminho.push(tokens[0]);
                casamento.push(tokens[0]);
                gramar.shift();
                tokens.shift();
            } else {
                flag = 1;
            }
        }

        if (flag === 1) {
            throw new Error(`ERRO SINTATICO`);
        } else {
            this.semantico(casamento, line);
        }

    }

    static semantico(casamento, line) {

        var res = 0;
        var hasParenteses = false;
        var startParenteses = 0;

        var num = [];

        const resultadoConta = (num) => {
            for (let j = 0; j < num.length; j++) {
                //console.log(num[j]);
                if (num.includes('exp')) {
                    for (let k = 0; k < num.length; k++) {
                        if (num[k] === 'exp') {
                            //tokens = ['exp','[','numero' ,']']
                            res = Math.exp(num[k + 2]);
                            num.splice(k, 5);
                            num.splice(k, 0, res);
                            j = 0;
                        }
                    }
                }

                if (num.includes('^')) {

                    for (let k = 0; k < num.length; k++) {
                        if (num[k] === '^') {
                            res = num[k - 1] ** num[k + 1]
                            num.splice(k - 1, 3);
                            num.splice(k - 1, 0, res);
                            j = 0;
                            //console.log("^^^", num);
                        }
                    }

                } else if (!num.includes('^') && num.includes('/')) {
                    for (let k = 0; k < num.length; k++) {
                        if (num[k] === '/') {
                            res = num[k - 1] / num[k + 1]
                            num.splice(k - 1, 3);
                            num.splice(k - 1, 0, res);
                            j = 0;
                            //console.log("/ / /", num);
                        }
                    }

                } else if (!num.includes('^') && !num.includes('/') && num.includes('*')) {
                    for (let k = 0; k < num.length; k++) {
                        if (num[k] === '*') {
                            res = num[k - 1] * num[k + 1]
                            num.splice(k - 1, 3);
                            num.splice(k - 1, 0, res);
                            j = 0;
                            //console.log("***", num);
                        }
                    }


                } else if (!num.includes('^') && !num.includes('/') && !num.includes('*') && num.includes('-')) {
                    for (let k = 0; k < num.length; k++) {
                        if (num[k] === '-') {
                            res = num[k - 1] - num[k + 1]
                            num.splice(k - 1, 3);
                            num.splice(k - 1, 0, res);
                            j = 0;
                            //console.log("- - -", num);
                        }
                    }

                } else if (!num.includes('^') && !num.includes('/') && !num.includes('*') && !num.includes('-') && num.includes('+')) {

                    for (let k = 0; k < num.length; k++) {
                        if (num[k] === '+') {
                            res = num[k - 1] + num[k + 1]
                            num.splice(k - 1, 3);
                            num.splice(k - 1, 0, res);
                            j = 0;
                            //console.log("+++", num);
                        }
                    }
                }
            }
        }

        for (let i = 0; casamento.length > i; i++) {
            if (casamento[i] === ')') {
                hasParenteses = false;

                resultadoConta(num);
                casamento.splice(startParenteses, i - startParenteses + 1);
                casamento.splice(startParenteses, 0, num[0]);
                num.pop();
                i = 0;
            }
            if (hasParenteses) {
                num.push(casamento[i]);
            }
            if (casamento[i] === '(') {
                hasParenteses = true;
                startParenteses = i;
            }
        }
        resultadoConta(casamento);
        console.log(" - - - - - - - - - -");
        console.log(`${line} === ${casamento[0]}`);
        //console.log(casamento);
    }
}
