// precentage operator % not implemented yet

let expression ="";
const calculator = document.querySelector(".calculator");
const display = document.getElementById("display");
let openBrackets =0;

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

    return parts[parts.length-1];

}

function showError() {
    expression = "";
    openBrackets = 0;
    justCalculated = false;
    display.value = "ERROR";
}

const operators = ["+","-","*","/","(",")"];

let justCalculated = false;

calculator.addEventListener("click",(event)=>{
    if(event.target.tagName !== "BUTTON") return;

    const button = event.target;
    const val = button.innerText;

    if(val === "AC"){
        resetCalculator();
        return;
    }

    if(val === "DEL"){
        if(expression.length !==0){
            const lastchar = getLastCharacter();

            if(lastchar === ")") openBrackets++;
            else if(lastchar === "(") openBrackets--;

            expression = expression.slice(0,-1);
            justCalculated = false;
        }
        updateDisplay();
        return;
    }

    if(val === "."){
        // still need some more work to be done .
        const lastchar = getLastCharacter();

        if(lastchar===")") return;

        const current = getCurrentNumber();
        if(current.includes(".")){
            return;
        }

        if(justCalculated) expression ="0.";


        else if(expression.length===0 || operators.includes(lastchar))expression += "0.";
        else expression += ".";
        updateDisplay();
        justCalculated = false;
        return;
    }

    if(val>='0' && val<='9'){
        const lastchar = getLastCharacter();

        if(lastchar===")") return;

        const current = getCurrentNumber();
        if(current === "0")
            expression = expression.slice(0,-1);
        
        if(justCalculated) expression = val;
        else expression += val;
        updateDisplay();
        justCalculated = false;
        return;
    }
// Operators part
    if(operators.includes(val)){
        const lastchar = getLastCharacter();

        if(val === "("){
            if(justCalculated){
                return;
            }
            if(lastchar === ")") return;
            if(lastchar >="0" && lastchar <= "9") return;
            if(lastchar === '.') return;
        }
        if(val === "(") openBrackets++;
        
        else if(val === ")"){
            
            if(openBrackets === 0)
                return;
            if(operators.includes(lastchar) || lastchar === ".") return;
            openBrackets--;
        }
        justCalculated = false;

        // Still need some more work to be done.
        if(expression.length===0 && val !== "-" && val !== "(") return;


        if(val === "-"){

            if(lastchar === "-") return;

            if(lastchar === "+" ){
                expression = expression.slice(0,-1);
            }
            expression += val;
            updateDisplay();
            return;
        }
        if(lastchar !== "(" && operators.includes(lastchar)){
            expression = expression.slice(0,-1)
            expression += val;
            updateDisplay();
            return;
        }
        expression += val;
        updateDisplay();
        return;
        
    }
    if(val === "="){
        if(expression.length===0) return;
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
        return;
    }

})