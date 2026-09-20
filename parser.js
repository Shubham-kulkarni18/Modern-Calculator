const TOKEN_TYPES = {

    NUMBER: "NUMBER",

    OPERATOR: "OPERATOR",

    LEFT_BRACKET: "LEFT_BRACKET",

    RIGHT_BRACKET: "RIGHT_BRACKET"

};

class Token{

    constructor(type,value){

        this.type = type;

        this.value = value;

    }

}

//=========  Helper Functins  ========

function isDigit(char){

    return char >= '0' && char <= '9';

}

function isOperator(char){

    return ['+','-','*','/','%'].includes(char);

}

function precedence(operator){
    switch(operator){

        case('+'):
        case('-'):
            return 1;
        case('*'):
        case('/'):
            return 2;
        default:
            return 0;
    }
}
// A - is unary if it is:

// at the start of the expression, or
// immediately after (, or
// immediately after another operator (+, -, *, /).

function isUnaryMinus(expression, index){

    if(expression[index] !== '-'){
        return false;
    }

    if(index === 0){
        return true;
    }

    const prev = expression[index - 1];

    return (
        prev === '(' ||
        prev === '+' ||
        prev === '-' ||
        prev === '*' ||
        prev === '/'
    );

}

function findNextNumber(expression, index) {

    const start = index;

    while (
        index < expression.length &&
        (isDigit(expression[index]) || expression[index] === '.')
    ) {
        index++;
    }

    return {
        number: expression.slice(start, index),
        start: start,
        end: index - 1
    };

}

function findMatchingBracket(expression, index){

    let count = 1;

    index++;

    while(index < expression.length){

        if(expression[index] === '('){
            count++;
        }

        else if(expression[index] === ')'){
            count--;
        }

        if(count === 0){
            return index;
        }

        index++;
    }

    throw new Error("Mismatched parentheses");

}

function findPreviousOperator(expression,index){
    index--;
    let brackets = 0;
    while(index >=0 ){

        if(expression[index] === ')'){
            brackets++;
        }

        else if(expression[index] === '('){
            brackets--;
        }

        if(brackets === 0 && ['-','+','*','/'].includes(expression[index])){

            return {
                operator: expression[index],
                index : index
            };
        }
        index--;
    }
    return null;
}

function findPreviousNumber(expression, index){

    index--;

    const end = index;

    while(
        index >= 0 &&
        (isDigit(expression[index]) || expression[index] === '.')
    ){
        index--;
    }

    const start = index + 1;

    return{
        number: expression.slice(start, end + 1),
        start,
        end
    };

}

function findMatchingOpeningBracket(expression,index){

    let count = 1;

    index--;

    while(index >= 0){

        if(expression[index] === ')'){
            count++;
        }

        else if(expression[index] === '('){
            count--;
        }

        if(count === 0){
            return index;
        }

        index--;

    }

    throw new Error("Mismatched parentheses");

}

function findLeftOperand(expression, operatorIndex){

    let index = operatorIndex - 1;
    let brackets = 0;

    while(index >= 0){

        if(expression[index] === ')'){
            brackets++;
        }

        else if(expression[index] === '('){
            brackets--;
        }

        if(
            brackets === 0 &&
            (expression[index] === '+' || expression[index] === '-')
        ){
            break;
        }

        index--;
    }

    return{
        operand: expression.slice(index + 1, operatorIndex),
        start: index + 1
    };

}


// ======= PARSER FUNCTIONS ==========

function evaluateExpression(expression){

    expression = preprocess(expression);

    const tokens = tokenizer(expression);

    const postfix = infixToPostfix(tokens);

    return evaluatePostfix(postfix);

}

function preprocess(expression){

    let result = "";

    for(let i = 0; i < expression.length; i++){

        if(expression[i] === '('){

            const prev = expression[i-1];

            if(i>0 && (isDigit(prev) || prev === ')')){

                result += '*';

            }

            result += '(';

            continue;

        }


        else if(isDigit(expression[i]) || expression[i] === '.'){

            if(i > 0 && expression[i-1] === ')'){
                result += '*';
            }

            const info = findNextNumber(expression, i);

            // check if this number is followed by %
            if(info.end + 1 < expression.length &&
            expression[info.end + 1] === '%'){

                const previousOperator =
                    findPreviousOperator(expression, info.start);

                if(previousOperator === null ||
                previousOperator.operator === '*' ||
                previousOperator.operator === '/'){

                    result += `(${info.number}/100)`;
                    i = info.end + 1;
                    continue;
                }

                else if(previousOperator.operator === '+'){

                    const base = findLeftOperand(expression, previousOperator.index);

                    result = result.slice(0, base.start);

                    result += `${base.operand}+(${base.operand}*${info.number}/100)`;

                    i = info.end + 1;
                    continue;

                }

                else{

                    const base = findLeftOperand(expression, previousOperator.index);

                    result = result.slice(0, base.start);

                    result += `${base.operand}-(${base.operand}*${info.number}/100)`;

                    i = info.end + 1;
                    continue;

                }
            }
            else{

                result += info.number;

            }

            i = info.end;

            continue;

        }


        else if(expression[i] === ')'){
            result += ')';
            if(i + 1 < expression.length && expression[i + 1] === '%'){
                result += '/100';
                i++;
            }
        }

        else if(isUnaryMinus(expression,i)){
            const next = expression[i + 1];
            if(isDigit(next) || next === '.'){

                const info = findNextNumber(expression, i + 1);

                result += `(0-${info.number})`;

                i = info.end ;

                continue;
            }

            if(next === '('){

                const end = findMatchingBracket(expression, i + 1);

                const subExpression = expression.slice(i + 1, end + 1);

                result += `(0-${subExpression})`;

                i = end;

                continue;

            }
        }
        else{
            result += expression[i];
        }
    }

    return result;

}

function tokenizer(expression){
    const tokens = [];
    let i=0;
    const n = expression.length;
    while(i<n){
        if(expression[i] === ' '){
            i++;
            continue;
        }
        else if(isDigit(expression[i])){
            let hasDecimal = false;
            let currentNumber = "";
            while(i<n && (isDigit(expression[i]) || expression[i]==='.')){

                if(expression[i] === '.'){
                    if(hasDecimal){
                        throw new Error("Multiple decimal points");
                    }
                    hasDecimal = true;
                }

                currentNumber += expression[i];
                i++;
            }
            if(currentNumber !== ""){
                tokens.push(
                    new Token(
                        TOKEN_TYPES.NUMBER,
                        currentNumber
                    )
                );
            }
        }
        else if(isOperator(expression[i])){
            tokens.push(
                    new Token(
                        TOKEN_TYPES.OPERATOR,
                        expression[i]
                    )
            );
            i++;
        }

        else if(expression[i]==='('){
            tokens.push(
                new Token(
                    TOKEN_TYPES.LEFT_BRACKET,
                    "("
                )
            );
            i++;
        }

        else if(expression[i] === ')'){
            tokens.push(
            new Token(
                    TOKEN_TYPES.RIGHT_BRACKET,
                    ")"
                )
            );
            i++;
        }
        else{

            throw new Error(`Unexpected character '${expression[i]}'`);

        }
    }

    return tokens;
}

//Shunting Yard Algorithm

// converting the infix experssion to postfix 
//Because there is zero ambiguity in Postfix expression.

function infixToPostfix(tokens){
    const output = [];
    const operatorStack = [];

    for(const token of tokens){
        if(token.type === TOKEN_TYPES.NUMBER){
            output.push(token);
        }

        else if(token.type === TOKEN_TYPES.OPERATOR){

            while( 
                operatorStack.length > 0 && 
                operatorStack.at(-1).type !== TOKEN_TYPES.LEFT_BRACKET &&
                precedence(token.value) <= precedence(operatorStack.at(-1).value)
            ){

                output.push(operatorStack.pop());

            }

            operatorStack.push(token);
        }

        else if(token.type === TOKEN_TYPES.LEFT_BRACKET ){
            operatorStack.push(token);
        }

        else if(token.type === TOKEN_TYPES.RIGHT_BRACKET){
  
            while(operatorStack.length>0 && operatorStack.at(-1).type !== TOKEN_TYPES.LEFT_BRACKET){
                
                output.push(operatorStack.pop());

            }

            if(operatorStack.length === 0){
                throw new Error("Mismatched parentheses");
            }

            operatorStack.pop();
        }
    }
    while(operatorStack.length > 0){

        if(operatorStack.at(-1).type === TOKEN_TYPES.LEFT_BRACKET){
            throw new Error("Mismatched parentheses");
        }
        output.push(operatorStack.pop());
    }
    return output;
}

function evaluatePostfix(postfix){

    const stack = [];

    for(const token of postfix){
        if(token.type === TOKEN_TYPES.NUMBER){

            stack.push(token);

        }

        else if(token.type === TOKEN_TYPES.OPERATOR){

            if(stack.length < 2){
                throw new Error("Invalid expression");
            }
            const right = stack.pop();
            const left = stack.pop();
            let result;
            switch(token.value){
                case '+':
                    result = Number(left.value)+Number(right.value);
                    break;
                case '-':
                    result = Number(left.value)-Number(right.value);
                    break;
                case '*':
                    result = Number(left.value)*Number(right.value);
                    break;
                case '/':
                    if(Number(right.value) === 0){
                        throw new Error("Division by zero");
                    }
                    result = Number(left.value)/Number(right.value);
                    break;

            }
            stack.push(
                new Token(
                    TOKEN_TYPES.NUMBER,result.toString()
                )
            );
        }
    }

    if(stack.length !== 1){
        throw new Error("Invalid expression");
    }

    return Number(stack.pop().value);
}