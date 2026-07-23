

const historyList = document.getElementById("history-list");
const clearHistoryButton = document.getElementById("clear-history");

let history = [];

function saveCalculation(expression, result){

    history.unshift({
        expression,
        result
    });

    if(history.length>50)
        history.pop();

    saveHistory();

    renderHistory();

}

function renderHistory(){
    // Remove everything currently displayed
    historyList.innerHTML = "";

    // If there are no calculations
    if(history.length === 0){

        historyList.innerHTML =  '<p class="empty-history">No calculations yet</p>';

        return;
    }

    //Display every calculation
    history.forEach((item,index)=>{
        const historyItem = document.createElement("div");

        historyItem.classList.add("history-item");

        historyItem.dataset.index = index;

        historyItem.innerHTML = `
            <span class = "history-expression">
                ${item.expression}
            </span>

            <span class = "history-result">
                = ${item.result}
            </span>
        `;

        historyList.appendChild(historyItem);
    });
}

function saveHistory() {

    localStorage.setItem(

        "calculatorHistory",

        JSON.stringify(history)

    );

}

function loadHistory(){

    const savedHistory = localStorage.getItem("calculatorHistory");

    if(savedHistory){

        history = JSON.parse(savedHistory);

    }

    renderHistory();

}
function handleClearHistory(){

    history = [];

    saveHistory();

    renderHistory();

}

function handleHistoryClick(event){
    const historyItem = event.target.closest(".history-item");

    if(!historyItem)
        return;

    const index = Number(historyItem.dataset.index);  

    const selectedCalculation = history[index];

    if(!selectedCalculation)
        return;

    loadExpression(selectedCalculation.expression);
}

clearHistoryButton.addEventListener("click", handleClearHistory);

historyList.addEventListener("click", handleHistoryClick);

loadHistory();