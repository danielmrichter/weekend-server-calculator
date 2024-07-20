console.log('client.js is sourced!');
let numOne = document.getElementById(`numOne`)
let numTwo = document.getElementById(`numTwo`)
let currentOperator

function plusButton(event){
    event.preventDefault()
    currentOperator = `+`
}
function minusButton(event){
    event.preventDefault()
    currentOperator = `-`
}
function multiplyButton(event){
    event.preventDefault()
    currentOperator = `*`
}
function divideButton(event){
    event.preventDefault()
    currentOperator = `/`
}
function equalsButton(event){
    event.preventDefault()
    //run a safety check here? Check stretch goal first
    // gather the data 
    let objectToPost = {numOne: Number(numOne.value), numTwo: Number(numTwo.value), operator: currentOperator}
    // make post request
    console.log(objectToPost)
    axios({
        method: `POST`,
        url: `/calculations`,
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
        url: `/calculations`,
    }).then((response) => {
        //render the DOM
        let calculations = response.data
        console.log(`calculations is:`, calculations)
        let resultHistory = document.getElementById(`resultHistory`)
        resultHistory.innerHTML = ``
        //set the most recent result
        if(calculations[calculations.length -1]){
        document.getElementById(`recentResult`).innerHTML = calculations[calculations.length-1].result.toString()
        }
        console.log(calculations[calculations.length -1])
        //loop for the rest, skipping the last one
        for(let i=0; i<calculations.length;i++){
            resultHistory.innerHTML += `
            <li>${calculations[i].numOne} ${calculations[i].operator} ${calculations[i].numTwo} = ${calculations[i].result}</li>`
        }
    })
}
getCalculationsHistory()