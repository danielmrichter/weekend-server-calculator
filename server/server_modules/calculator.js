const e = require("express")

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
    // push the object to the array
  }
function filterObjectForCalculator(objToEval){
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
  let result = calculate(exprToEval)
  //bundle it up and ship it
  let objToReturn = objToEval
  objToReturn.result = result
  return objToReturn
  }

  module.exports = filterObjectForCalculator