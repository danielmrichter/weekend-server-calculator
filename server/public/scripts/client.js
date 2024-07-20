console.log('client.js is sourced!');
// Only used in base mode.
// let numOne = document.getElementById(`numOne`)
// let numTwo = document.getElementById(`numTwo`)
let currentCalc = document.getElementById(`currentCalc`)
let currentOperator
// /\+-\/\*/i


// This is where the old code is for base mode. Pull it out of the function to get it back.
function hideStuff() {

    // function plusButton(event) {
    //     event.preventDefault()
    //     currentOperator = `+`
    // }
    // function minusButton(event) {
    //     event.preventDefault()
    //     currentOperator = `-`
    // }
    // function multiplyButton(event) {
    //     event.preventDefault()
    //     currentOperator = `*`
    // }
    // function divideButton(event) {
    //     event.preventDefault()
    //     currentOperator = `/`
    // }
    // function equalsButton(event) {
    //     event.preventDefault()
    //     //run a safety check here? Check stretch goal first
    //     // gather the data 
    //     let objectToPost = { numOne: Number(numOne.value), numTwo: Number(numTwo.value), operator: currentOperator }
    //     // make post request
    //     axios({
    //         method: `POST`,
    //         url: `/calculations`,
    //         data: objectToPost
    //     }).then((response) => {
    //         //make get request (seperate function?)
    //         getCalculationsHistory()
    //         //render the DOM
    //     })
    // }
    // function clearButton(event) {
    //     event.preventDefault()
    //     numOne.value = ``
    //     numTwo.value = ``
    //     currentOperator = ``
    // }
}
// Numbers
function sevenButton(event){
    event.preventDefault()
    currentCalc.removeAttribute('readonly');
    currentCalc.value += `7`
    currentCalc.setAttribute('readonly', true);

}
function eightButton(event){
    event.preventDefault()
    currentCalc.removeAttribute('readonly');
    currentCalc.value += `8`
    currentCalc.setAttribute('readonly', true);
}
function nineButton(event){
    event.preventDefault()
    currentCalc.removeAttribute('readonly');
    currentCalc.value += `9`
    currentCalc.setAttribute('readonly', true);
}

function fourButton(event){
    event.preventDefault()
    currentCalc += `4`
}
function fiveButton(event){
    event.preventDefault()
    currentCalc += `8`
}
function sixButton(event){
    event.preventDefault()
    currentCalc += `6`
}


// Operators
function minusButton(event){
    event.preventDefault()
    currentCalc.replace(/\+-\/\*/i, `-`)
    currentCalc += `-`
}

function plusButton(event){
    event.preventDefault()
    currentCalc.removeAttribute('readonly');
    if(currentCalc.value.includes(/\+-\/\*/i))
        {currentCalc.value.replace(/\+-\/\*/i, `+`)}
    else(currentCalc.value += ` + `)
    currentCalc.setAttribute('readonly', true);
}
function equalsButton(event) {
    event.preventDefault()
    console.log(currentCalc.value)
    // //run a safety check here? Check stretch goal first
    // // gather the data 
    // let objectToPost = {toCalculate: currentCalc}
    // // make post request
    // axios({
    //     method: `POST`,
    //     url: `/calculations`,
    //     data: objectToPost
    // }).then((response) => {
    //     //make get request (seperate function?)
    //     getCalculationsHistory()
        //render the DOM
    // })
}
function clearButton(event) {
    event.preventDefault()
    numOne.value = ``
    numTwo.value = ``
    currentOperator = ``
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
        //loop for the rest, skipping the last one
        for (let i = 0; i < calculations.length; i++) {
            resultHistory.innerHTML += `
            <li>${calculations[i].numOne} ${calculations[i].operator} ${calculations[i].numTwo} = ${calculations[i].result}</li>`
        }
    })
}
getCalculationsHistory()