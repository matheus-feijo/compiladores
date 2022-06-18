
#automatos
######exemplo de automatos seguido para a construção do analisador léxico, vale resaltar que algumas conexões foram mudadas

*#####automato com parenteses:
!["automato"](./assets/parenteses.png)
*#####automato com as outras expressoes fora do parenteses:
!["automato"](./assets/sem%20parenteses.png.png)

#Analisador sintatico
###First da linguagem

* First E = First T = First P = First F = {exp ,( ,id }

###Follow da linguagem
* FOLLOW E = { + , - };
* FOLLOW T = { * , / } U FOLLOW E = {* ,/ ,+ ,- }
* FOLLOW P = FOLLOW T U { ^ } = {* ,/ ,+ ,- ,^ } 
* FOLLOW F = FOLLOW P U { ] } = {* ,/ ,+ ,- ,^ ,] }