// precentage operator % not implemented yet

//Variables
let expression ="";
let openBrackets =0;
let justCalculated = false;

//Dom elements
const calculator = document.querySelector(".calculator");
const display = document.getElementById("display");

//Opereators
const binaryOperators = ["+","-","*","/"];
const brackets = ["(",")"];
const invalidBeforeOpeningBracket = [")",".","-"];

//HELPER FUNCTIONS -->

function isDigit(val){
    return val>="0" && val <="9";
}

function isExpressionEmpty(){
    return expression.length ===0;
}

function isBinaryOperator(val){
    return binaryOperators.includes(val);
}

function isBracket(val){
    return brackets.includes(val);
}
function updateDisplay() {
    display.value = expression;
}

function resetCalculator() {
    expression = "";
    openBrackets = 0;
    justCalculated = false;
    updateDisplay();
}

function getLastCharacter() {
    return expression.slice(-1);
}

function getCurrentNumber(){
    const parts = expression.split(/[+\-*/()]/);
    return parts[parts.length - 1];
}

function showError() {
    expression = "";
    openBrackets = 0;
    justCalculated = false;
    display.value = "ERROR";
}



// HANDLER FUNCTIONS -->

function handleOpeningBrackets(){
    if(justCalculated){
        resetCalculator();
        openBrackets++;
        expression += "(";
        updateDisplay();
        return;
    }

    if(!isExpressionEmpty()){
        let lastchar = getLastCharacter();
        
        if( invalidBeforeOpeningBracket.includes(lastchar) || isDigit(lastchar) )
            return;
    }
    openBrackets++;
    expression += "(";
    updateDisplay();
}

function handleClosingBrackets(){
    if(justCalculated) return;

    const lastchar = getLastCharacter();

    if( openBrackets ===0 || isBinaryOperator(lastchar) || lastchar === "(" || lastchar === ".") return;

    openBrackets--;
    expression += ")";
    updateDisplay();
}

function handleMinus(){
    justCalculated = false;

    if(!isExpressionEmpty()){
        const lastchar = getLastCharacter();

        if(lastchar === "-") return;

        if(lastchar === "+"){
            expression = expression.slice(0,-1);
        }
    }
    expression += "-";
    updateDisplay();
}


function handleNumber(val){
    
    const lastchar = getLastCharacter();
    
    if(lastchar===")") return;
    
    const current = getCurrentNumber();
    if(current === "0")
        expression = expression.slice(0,-1);
    
    if(justCalculated)
        expression = val;
    else
        expression += val;

    updateDisplay();
    justCalculated = false;
}

function handleDecimal(){
    const lastchar = getLastCharacter();
    
    const current = getCurrentNumber();
    if(current.includes(".") || lastchar ===")"){
        return;
    }
    
    if(justCalculated) expression ="0.";
    
    else if(isExpressionEmpty() || isBinaryOperator(lastchar) || lastchar === "(") 
        expression += "0.";
    
    else
        expression += ".";
    updateDisplay();
    justCalculated = false;
}

function handleBinaryOperator(val){
    justCalculated = false;
    let lastchar = getLastCharacter();

    if(isExpressionEmpty()) return;
    if(expression.length === 1 && lastchar === "-" ) return;
    if(lastchar === "(" || lastchar === ".") return;

    while( isBinaryOperator(lastchar) ){
        expression = expression.slice(0,-1);
        lastchar = getLastCharacter();
    }

    expression += val;
    updateDisplay();
}

function handleOperators(val){
    const lastchar = getLastCharacter();

    if(isExpressionEmpty() && val !== "-" && val !== "(") return;
    
    if(expression.length ===1 && lastchar==="-") return;

    switch(val){

        case "(":
            handleOpeningBrackets();
            return;

        case ")":
            handleClosingBrackets();
            return;

        case "-":
            handleMinus();
            return;

        default:
            handleBinaryOperator(val);
            return;
            
    }
}

function handleEqual(){
    if(isExpressionEmpty()) return;
    if(openBrackets!==0){
        showError();
        return;
    }
    try{
        expression = String(eval(expression));
        updateDisplay();
        justCalculated = true;
        openBrackets = 0;
    }
    catch{
        showError();
    }
}
function handleDelete(){
    if(!isExpressionEmpty()){
        const lastchar = getLastCharacter();

        if(lastchar === ")") openBrackets++;
        else if(lastchar === "(") openBrackets--;

        expression = expression.slice(0,-1);
        justCalculated = false;
    }
    updateDisplay();
}

calculator.addEventListener("click",(event)=>{

    if(event.target.tagName!=="BUTTON")
        return;

    const value=event.target.innerText;

    if(value==="AC"){
        resetCalculator();
        return;
    }

    if(value==="DEL"){
        handleDelete();
        return;
    }

    if(value==="="){
        handleEqual();
        return;
    }

    if(value==="."){
        handleDecimal();
        return;
    }

    if(isDigit(value)){
        handleNumber(value);
        return;
    }

    if(isBinaryOperator(value) || isBracket(value)){
        handleOperators(value);
        return;
    }

});