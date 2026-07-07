// precentage operator % not implemented yet

let expression ="";
const calculator = document.querySelector(".calculator");
const display = document.getElementById("display");

const operators = ["+","-","*","/","(",")"];

let justCalculated = false;

calculator.addEventListener("click",(event)=>{
    if(event.target.tagName !== "BUTTON") return;

    const button = event.target;
    const val = button.innerText;

    if(val === "AC"){
        expression = "";
        display.value = expression;
        justCalculated = false;
        return;
    }

    if(val === "DEL"){
        if(expression.length !==0){
            expression = expression.slice(0,-1);
            justCalculated = false;
        }
        display.value = expression;
        return;
    }

    if(val === "."){
        // still need some more work to be done .
        if(justCalculated) expression ="0.";
        else if(expression.length===0)expression = "0.";
        else expression += ".";
        display.value = expression;
        justCalculated = false;
        return;
    }

    if(val>='0' && val<='9'){
        if(justCalculated) expression = val;
        else expression += val;
        display.value = expression;
        justCalculated = false;
        return;
    }

    if(operators.includes(val)){
        // Still need some more work to be done.
        if(expression.length===0 && val !== "-") return;
        expression += val;
        display.value = expression;
        justCalculated = false;
        return;
    }
    if(val === "="){
        if(expression.length===0) return;
        try{
            expression = String(eval(expression));
            display.value = expression;
            justCalculated = true;
        }
        catch{
            expression = "";
            display.value = "ERROR";
        }
        return;
    }

})