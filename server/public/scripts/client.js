console.log('client.js is sourced!');
let numOne = document.getElementById(`numOne`)
let numTwo = document.getElementById(`numTwo`)
let currentOperator = document.getElementById(`current-operator`)

function plusButton(event){
    event.preventDefault()
    currentOperator.innerText = `+`
}
function minusButton(event){
    event.preventDefault()
    currentOperator.innerText = `-`
}
function multiplyButton(event){
    event.preventDefault()
    currentOperator.innerText = `*`
}
function divideButton(event){
    event.preventDefault()
    currentOperator.innerText = `/`
}
function equalsButton(event){
    event.preventDefault()
    //run a safety check here? Check stretch goal first
    // gather the data 
    let objectToPost = {calculation: numOne.value + currentOperator.innerText + numTwo.value}
    // make post request
    axios({
        method: `POST`,
        url: `/calculate`,
        data: objectToPost
    }).then((response) => {
        console.log(response)
    //make get request (seperate function?)
    getCalculationsHistory()
        //render the DOM
    })
}
function clearButton(event){
    event.preventDefault()
    numOne.value = ``
    numTwo.value = ``
    currentOperator.innerText = ``
}
function getCalculationsHistory(){
    //make get req
    axios({
        method: `GET`,
        url: `/calculate`,
    }).then((response) => {
        //render the DOM
        let calculations = response.data
        console.log(`calculations is:`, calculations)
        let resultHistory = document.getElementById(`resultHistory`)
        resultHistory.innerHTML = ``
        //set the most recent result
        if(calculations.length > 0){
        document.getElementById(`recentResult`).innerText = calculations[calculations.length-1].answer
        }
        //loop for the rest, skipping the last one
        for(let i=0; i<calculations.length-1;i++){
            resultHistory.innerHTML += `
            <li>${calculations[i].calculation}</li>`
        }
    })
}
getCalculationsHistory()