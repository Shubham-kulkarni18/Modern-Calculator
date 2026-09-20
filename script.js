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

function loadExpression(value){

    setExpression(value);

    justCalculated = false;

}

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
    const subDisplay = document.getElementById("sub-display");
    if (subDisplay) subDisplay.textContent = "";
    updateDisplay();
}

function getCursorPosition(){
    return display.selectionStart;
}

function setCursorPosition(position){

    display.focus();

    display.setSelectionRange(position, position);

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
function getNumberAtCursor(){

    const cursor = display.selectionStart;

    let left = cursor;
    let right = cursor;

    while(
        left > 0 &&
        (isDigit(expression[left-1]) || expression[left-1] === '.')
    ){
        left--;
    }

    while(
        right < expression.length &&
        (isDigit(expression[right]) || expression[right] === '.')
    ){
        right++;
    }

    return expression.slice(left,right);

}

function showError() {
    expression = "";
    openBrackets = 0;
    justCalculated = false;
    cursorPosition = 0;

    display.value = "ERROR";
    display.focus();
}

function insertAtCursor(text){

    const start = display.selectionStart;
    const end = display.selectionEnd;

    expression =
        expression.slice(0, start) +
        text +
        expression.slice(end);

    updateDisplay();

    const newCursor = start + text.length;

    setCursorPosition(newCursor);

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

    if (prev === "." )
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

    const current = getNumberAtCursor();

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

    const start = display.selectionStart;
    const end = display.selectionEnd;

    if(start !== end){

        expression =
            expression.slice(0,start) +
            expression.slice(end);

        updateDisplay();

        setCursorPosition(start);

        return;
    }

    if(start === expression.length){
        return;
    }

    expression =
        expression.slice(0,start) +
        expression.slice(start+1);

    updateDisplay();

    setCursorPosition(start);

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

        const originalExpression = expression;

        const result = evaluateExpression(expression).toString();

        const subDisplay = document.getElementById("sub-display");
        if (subDisplay) {
            subDisplay.textContent = originalExpression + " =";
        }

        saveCalculation(originalExpression, result);

        setExpression(result);

        justCalculated = true;

        openBrackets = 0;
    }
    catch{
        showError();
    }
}
function removeCharAtCursor(){

    const start = display.selectionStart;
    const end = display.selectionEnd;

    if(start !== end){

        expression =
            expression.slice(0,start) +
            expression.slice(end);

        updateDisplay();

        setCursorPosition(start);

        return;
    }

    if(start === 0){
        updateDisplay();
        return;
    }

    expression =
        expression.slice(0,start-1) +
        expression.slice(start);

    updateDisplay();

    setCursorPosition(start-1);

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

// ===== Event Listeners =====

display.addEventListener("keydown", (e) => {
    e.preventDefault();
});

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

display.addEventListener("paste",(e)=>{

    e.preventDefault();

    const pasted =
        (e.clipboardData || window.clipboardData)
        .getData("text");

    if(!/^[0-9+\-*/().%\s]+$/.test(pasted)){
        return;
    }

    insertAtCursor(pasted);

});