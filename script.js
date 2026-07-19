// precentage operator % not implemented yet

//Variables
let expression ="";
let openBrackets =0;
let justCalculated = false;
let cursorPosition = 0;

//Dom elements
const calculator = document.querySelector(".calculator");
const display = document.getElementById("display");

//Opereators
const binaryOperators = ["+","-","*","/"];
const brackets = ["(",")"];
const invalidBeforeOpeningBracket = [")",".","-"];

const postfixOperators = ["%"];

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
    display.focus();
    display.setSelectionRange(cursorPosition, cursorPosition);
}

function resetCalculator() {
    expression = "";
    openBrackets = 0;
    justCalculated = false;
    cursorPosition = 0;
    updateDisplay();
}

function getCharacterBeforeCursor(){

    if(cursorPosition===0)
        return "";

    return expression[cursorPosition-1];
}

function syncCursor() {
    cursorPosition = display.selectionStart;
}

function getCurrentNumber(){

    const beforeCursor = expression.slice(0,cursorPosition);

    const parts = beforeCursor.split(/[+\-*/()]/);

    return parts[parts.length-1];
}

function showError() {
    expression = "";
    openBrackets = 0;
    justCalculated = false;
    cursorPosition = 0;

    display.value = "ERROR";
    display.focus();
}

function insertAtCursor(value){

    expression =
        expression.slice(0, cursorPosition) +
        value +
        expression.slice(cursorPosition);

    cursorPosition += value.length;

    updateDisplay();
}


function setExpression(value){
    expression = value;
    cursorPosition = expression.length;
    updateDisplay();
}

function getCharacterAfterCursor() {
    if(cursorPosition === expression.length)
        return "";

    return expression[cursorPosition];
}

// HANDLER FUNCTIONS -->

function handleOpeningBrackets() {

    if (justCalculated) {
        resetCalculator();
        openBrackets++;
        insertAtCursor("(");
        return;
    }

    const prev = getCharacterBeforeCursor();
    const next = getCharacterAfterCursor();

    if (
        (prev && (invalidBeforeOpeningBracket.includes(prev) || isDigit(prev) || prev === "%")) ||
        (next && (isDigit(next) || next === "."))
    ) {
        return;
    }

    openBrackets++;
    insertAtCursor("(");
}

function handleClosingBrackets() {

    if (justCalculated)
        return;

    const prev = getCharacterBeforeCursor();
    const next = getCharacterAfterCursor();

    if (openBrackets === 0)
        return;

    if (
        prev === "(" ||
        prev === "." ||
        isBinaryOperator(prev)
    )
        return;

    // Don't allow ')' immediately before a digit or '('
    if (
        isDigit(next) ||
        next === "("
    )
        return;

    openBrackets--;
    insertAtCursor(")");
}

function handleMinus() {

    const prev = getCharacterBeforeCursor();
    const next = getCharacterAfterCursor();

    if (justCalculated) {
        setExpression("-");
        justCalculated = false;
        return;
    }

    if (prev === "-")
        return;

    if (prev === "+") {
        removeCharAtCursor();
        insertAtCursor("-");
        justCalculated = false;
        return;
    }

    if (next === "+") {
        removeCharAfterCursor();
        insertAtCursor("-");
        justCalculated = false;
        return;
    }

    if (prev === "." || prev === ")")
        return;

    insertAtCursor("-");
    justCalculated = false;
}


function handleNumber(val) {

    const prev = getCharacterBeforeCursor();
    const next = getCharacterAfterCursor();

    if (prev === ")" || prev === "%")
        return;

  
    if (next === "(")
        return;

    const current = getCurrentNumber();

    if (current === "0")
        removeCharAtCursor();

    if (justCalculated) {
        setExpression(val);
    }
    else {
        insertAtCursor(val);
    }

    justCalculated = false;
}

function handleDecimal() {

    const prev = getCharacterBeforeCursor();
    const next = getCharacterAfterCursor();

    const current = getCurrentNumber();

    if (
        current.includes(".") ||
        prev === ")" ||
        prev === "%" ||
        next === "("
    ) {
        return;
    }

    if (justCalculated) {
        setExpression("0.");
    }
    else if (
        isExpressionEmpty() ||
        isBinaryOperator(prev) ||
        prev === "("
    ) {
        insertAtCursor("0.");
    }
    else {
        insertAtCursor(".");
    }

    justCalculated = false;
}

function handleBinaryOperator(val) {
    justCalculated = false;

    let prev = getCharacterBeforeCursor();
    const next = getCharacterAfterCursor();

    if (isExpressionEmpty()) return;

    if (expression.length === 1 && prev === "-")
        return;

    if (prev === "(" || prev === ".")
        return;

    // Replace operator before cursor
    while (isBinaryOperator(prev)) {
        removeCharAtCursor();
        prev = getCharacterBeforeCursor();
    }

    // Replace operator after cursor
    if (
        isBinaryOperator(next) &&
        !(next === "-" && isBinaryOperator(prev))
    ) {
        removeCharAfterCursor();
    }

    insertAtCursor(val);
}
function removeCharAfterCursor(){

    if(cursorPosition===expression.length)
        return;

    const deletedChar = expression[cursorPosition];

    if(deletedChar==="(")
        openBrackets--;

    else if(deletedChar===")")
        openBrackets++;

    expression =
        expression.slice(0,cursorPosition) +
        expression.slice(cursorPosition+1);

    updateDisplay();
}

function handlePercentage() {

    const prev = getCharacterBeforeCursor();
    const next = getCharacterAfterCursor();

    if (!isDigit(prev))
        return;

    // Prevent things like 50%2
    if (isDigit(next) || next === ".")
        return;

    insertAtCursor("%");
}

function handleOperators(val){

    if(isExpressionEmpty() && val !== "-" && val !== "(")
        return;

    if(expression === "-" && val !== "(")
        return;

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

        case "%":
            handlePercentage();
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
        const processedExpression = preprocessPercentage(expression);

        setExpression(String(eval(processedExpression)));

        justCalculated = true;
        openBrackets = 0;
    }
    catch{
        showError();
    }
}
function removeCharAtCursor() {

    if(cursorPosition===0) {
        updateDisplay();
        return;
    }

    const deletedChar = expression[cursorPosition - 1];

    if (deletedChar === "(")
        openBrackets--;

    if (deletedChar === ")")
        openBrackets++;

    expression =
        expression.slice(0,cursorPosition-1) +
        expression.slice(cursorPosition);

    cursorPosition--;

    updateDisplay();
}

function preprocessPercentage(expr) {
    return expr.replace(
        /(\d+(\.\d+)?)%/g,
        (_, num) => String(Number(num) / 100)
    );
}

function handleInput(value){
    if(value === "AC"){
        resetCalculator();
        return;
    }

    if(value==="DEL"){
        removeCharAtCursor();
        return;
    }

    if(value === "="){
        handleEqual();
        return;
    }
    if(value === "."){
        handleDecimal();
        return;
    }

    if(value === "FORWARD_DELETE"){
        removeCharAfterCursor();
        return;
    }

    if(isDigit(value)){
        handleNumber(value);
        return;
    }

    if(isBinaryOperator(value) || isBracket(value) || value ==="%"){
        handleOperators(value);
        return;
    }
}

const keyboardMap = {
    "Escape": "AC",
    "Backspace": "DEL",
    "Delete": "FORWARD_DELETE",
    "Enter": "=",
    "NumpadEnter": "="
};

function handleKeyboardInput(key){

    switch(key){

        case "ArrowLeft":
            if(cursorPosition > 0)
                cursorPosition--;
            updateDisplay();
            return;

        case "ArrowRight":
            if(cursorPosition < expression.length)
                cursorPosition++;
            updateDisplay();
            return;

        case "Home":
            cursorPosition = 0;
            updateDisplay();
            return;

        case "End":
            cursorPosition = expression.length;
            updateDisplay();
            return;
    }

    handleInput(keyboardMap[key] || key);
}

//EVENTS

calculator.addEventListener("click",(event)=>{

    if(event.target.tagName!=="BUTTON")
        return;

    handleInput(event.target.innerText);

});

document.addEventListener("keydown",(event)=>{
    const supportedKeys = [
        "Enter",
        "NumpadEnter",
        "Backspace",
        "Delete",
        "Escape",
        "(",
        ")",
        ".",
        "+",
        "-",
        "*",
        "/",
        "%",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End"
    ];

    if (
        isDigit(event.key) ||
        supportedKeys.includes(event.key)
    ) {
        event.preventDefault();
    }

    handleKeyboardInput(event.key);
})

display.addEventListener("click", syncCursor);

display.addEventListener("keyup", syncCursor);

display.addEventListener("select", syncCursor);

display.addEventListener("input", syncCursor);