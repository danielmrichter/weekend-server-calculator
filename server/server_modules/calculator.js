function calculate(objToCalc) {
    // grab the expression to evaluate
    let exprToEval = objToCalc.toCalculate
    console.log(exprToEval)
    // seperate the toCalculate key into an array, with the numbers being an index and operators a separate index
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
    let returnObj = objToCalc
    returnObj.result = result
    console.log(returnObj)
    return returnObj
    // push the object to the array
  }

  module.exports = calculate