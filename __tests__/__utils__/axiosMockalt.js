const briefPause = require('./briefPause.js')


// Mock the axios function:
let axios = jest.fn(async (axiosArgument) => {

  const requestMethod = axiosArgument.method.toUpperCase()
  
  // Handles axios({method, url, data}) usage:
  if (requestMethod === 'POST') {
    const { toCalculate } = axiosArgument.data
    return mockedPost(axiosArgument.url, axiosArgument.data)
  } else if (requestMethod === 'GET') {
    return mockedGet(axiosArgument.url)
  }
})


async function mockedPost(url, reqBody) {
  const requestTimestamp = Date.now()
  // 1. Obtain req.body data numOne, numTwo, operator
  const { toCalculate } = reqBody

  // 2. Create calculation object
  const calculation = {
    toCalculate
  }
  
  // 3. Do the math and assign result to calculation.result
  const result = obtainResult(calculation)
  calculation.result = result

  // 4. Push the solved calculation into the test array of calculations:
  axios.testData.push(calculation)

  await briefPause(150)

  const postResult = {
    reqBody: reqBody,
    status: 201,
    requestMethod: 'POST',
    requestTimestamp,
    responseTimestamp: Date.now()
  }
  
  axios.calls.push(postResult)
  return Promise.resolve(postResult)
}

async function mockedGet(url) {
  const requestTimestamp = Date.now()

  
  await briefPause(10)
  
  const getResult = {
    status: 200,
    data: axios.testData,
    requestMethod: 'GET',
    requestTimestamp,
    responseTimestamp: Date.now()
  }

  axios.calls.push(getResult)
  return Promise.resolve(getResult)
}

// function obtainResult(calculation) {
//   switch (calculation.operator) {
//     case '+':
//       return calculation.numOne + calculation.numTwo;
//     case '-':
//       return calculation.numOne - calculation.numTwo;
//     case '*':
//       return calculation.numOne * calculation.numTwo;
//     case '/':
//       return calculation.numOne / calculation.numTwo;
//     default:
//       break
//   }
// }
function calculate(exprToEval) {
    // seperate the toCalculate key into an array to work with a bit more easily
    let seperatedExpr = exprToEval.split(` `)
    // do PEMDAS check here
    // an array to stick around for the next part:
    let afterMDArray = []
    // while loop, since we want to be able to empty the array and track current value.
    // just doing divison and multiply (the md of pemdas, pretending pe don't exist)
    afterMDArray.push(seperatedExpr.shift())
    while(seperatedExpr.length > 0){
      // check if it's multiply, then multiple the LAST index in the afterMDArray
      //  (aka the prev. number in expression)
      // by the NEXT index in the seperated expression array.
      if(seperatedExpr[0] === `*`){
        // grab the value before we modify the arrays.
        let numVar = Number(afterMDArray[afterMDArray.length-1]) * Number(seperatedExpr[1])
        // remove the first two indexes of the seperatedExpr array, now that we used them
        seperatedExpr.shift()
        seperatedExpr.shift()
        // pop off the last item, now that it's been used.
        afterMDArray.pop()
        afterMDArray.push(numVar)
      } else if(seperatedExpr[0] === `/`){
        // same logic as above, but with division
        let numVar = Number(afterMDArray[afterMDArray.length-1]) / Number(seperatedExpr[1])
        seperatedExpr.shift()
        seperatedExpr.shift()
        afterMDArray.pop()
        afterMDArray.push(numVar)
      } else{
        afterMDArray.push(seperatedExpr.shift())
        afterMDArray.push(seperatedExpr.shift())
      }
    }
    // now for the AS part of the PEMDAS!
    let result = Number(afterMDArray.shift())
    while(afterMDArray.length > 0){
      if(afterMDArray[0]===`+`){
        result += Number(afterMDArray[1])
        afterMDArray.shift()
        afterMDArray.shift()
      }else{
        result -= Number(afterMDArray[1])
        afterMDArray.shift()
        afterMDArray.shift()
      }
    }
      // add the result to the object
    return result
  }
function obtainResult(objToEval){
  // grab the expression we need to evaluate
  let exprToEval = objToEval.toCalculate
  // filter it for parantheses
  while(exprToEval.includes(`(`)){
    // find the left one
    let leftPara = exprToEval.search(/\(/i)
    // find the right one
    let rightPara = exprToEval.search(/\)/i)
    // make a substring from them, excluding the paras themselves
    let paratToEval = exprToEval.substring(leftPara+1, rightPara)
    //  run it through the calculate function
    let evaledPara = calculate(paratToEval)
    // find where it needs to go in the original expression
    let splitExpr = exprToEval.split(``)
    splitExpr.splice(leftPara, (rightPara-leftPara+1), evaledPara)
    exprToEval = splitExpr.join(``)
  }
    // run the original expression through the calculate function
  return calculate(exprToEval)
}
// Handles axios.get('/calculations'):
axios.get = (url) => mockedGet(url)

// Handles axios.post('/calculations', {numOne, numTwo, operator}):
axios.post = (url, data) => mockedPost(url, data)

axios.calls = []

axios.testData = []

module.exports = axios
