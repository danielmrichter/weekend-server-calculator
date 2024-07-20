let currentCalc = document.getElementById(`currentCalc`)
// Numbers
function numButton(event, num){
    event.preventDefault()
    currentCalc.removeAttribute('readonly');
    currentCalc.value += `${num}`
    currentCalc.setAttribute('readonly', true);
}
// Operators
function operButton(event, oper){
    event.preventDefault()
    currentCalc.removeAttribute('readonly');
    currentCalc.value += ` ${oper} `
    currentCalc.setAttribute('readonly', true);
}
// Equals
function equalsButton(event) {
    event.preventDefault()
    console.log(currentCalc.value)
    // //run a safety check here? Check stretch goal first
    // // gather the data 
    let objectToPost = {toCalculate: currentCalc.value}
    // make post request
    axios({
        method: `POST`,
        url: `/calculations`,
        data: objectToPost
    }).then((response) => {
     //make get request, which also renders DOM
        getCalculationsHistory()
     // clear the input field, and rock n' roll
    currentCalc.removeAttribute('readonly');
    currentCalc.value = ``
    currentCalc.setAttribute('readonly', true);
    })
}
function clearButton(event) {
    event.preventDefault()
    currentCalc.value = ``
}
function getCalculationsHistory() {
    //make get req
    axios({
        method: `GET`,
        url: `/calculations`,
    }).then((response) => {
        //render the DOM
        let calculations = response.data
        let resultHistory = document.getElementById(`resultHistory`)
        resultHistory.innerHTML = ``
        //set the most recent result
        if (calculations[calculations.length - 1]) {
            document.getElementById(`recentResult`).innerText = calculations[calculations.length - 1].result
        }
        console.log(calculations[calculations.length - 1])
        for (let i = 0; i < calculations.length; i++) {
            resultHistory.innerHTML += `
            <li>${calculations[i].toCalculate} = ${calculations[i].result}</li>`
        }
    })
}
getCalculationsHistory()