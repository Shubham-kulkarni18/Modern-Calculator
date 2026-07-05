let expression = "";

const calculator = document.querySelector(".calculator");
const display = document.getElementById("display");


const operators = ["+", "-", "*", "/"];

//This technique is called Event Delegation.
calculator.addEventListener("click", function (event) {
    const button = event.target;
    if (button.tagName !== "BUTTON")
    return;

    const value = button.innerText;

    if (value === "AC") {
        expression = "";
        display.value = "";
        return;
    }
    if (value === "DEL") {

        expression = expression.slice(0, -1);

        display.value = expression;

        return;
    }

    if (value === "=") {

        try {

            expression = eval(expression).toString();

            display.value = expression;

        } catch {

            expression = "";

            display.value = "Error";
        }
        return;
    }

    if(operators.includes(value)){
        if(expression.length == 0 && value == '-') continue;
        
        const lastchar = expression.slice(-1);
        if(operators.includes(lastchar)){
            if(value=='-'){
                expression += value;
                display.value = expression;
                return ;
            }
            else{
                expression = expression.slice(0,-1);
                expression += value;
                display.value = expression;
                return;
            }
        }
        
    }
    expression += value;
    display.value = expression;

});