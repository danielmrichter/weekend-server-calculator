let currentCalc = document.getElementById(`currentCalc`)
// Numbers
function numButton(event, num) {
    event.preventDefault()
    currentCalc.removeAttribute('readonly');
    currentCalc.value += `${num}`
    currentCalc.setAttribute('readonly', true);
}
// Operators
function operButton(event, oper) {
    event.preventDefault()
    currentCalc.removeAttribute('readonly');
    currentCalc.value += ` ${oper} `
    currentCalc.setAttribute('readonly', true);
}
// Equals
function equalsButton(event) {
    event.preventDefault()
    // //run a safety check here, make sure values are filled in.
    if (safetyCheck() === false) {
        return
    }
    // // gather the data 
    let objectToPost = { toCalculate: currentCalc.value }
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
//Other
function clearButton(event) {
    event.preventDefault()
    currentCalc.removeAttribute('readonly');
    currentCalc.value = ``
    currentCalc.setAttribute('readonly', true);
}
function paraButton(event, side) {
    event.preventDefault()
    currentCalc.removeAttribute('readonly');
    if (side === `left`) {
        currentCalc.value += `(`
    } else {
        currentCalc.value += `)`
    }
    currentCalc.setAttribute('readonly', true);
}
function backButton(event) {
    event.preventDefault()
    currentCalc.removeAttribute('readonly');
    newValue = currentCalc.value.slice(0, currentCalc.value.length - 1)
    currentCalc.value = newValue
    currentCalc.setAttribute('readonly', true);
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
            document.getElementById(`recentResult`).innerHTML = calculations[calculations.length - 1].result
        }
        for (let i = 0; i < calculations.length; i++) {
            resultHistory.innerHTML += `
            <li onClick="historyEntryClick(event, ${i})">${calculations[i].toCalculate} = ${calculations[i].result}</li>`
        }
    })
}
function historyEntryClick(e, index) {
    e.preventDefault()
    axios({
        method: `GET`,
        url: `/history`,
        params: { entry: index }
    }).then((response) => {
        currentCalc.removeAttribute('readonly');
        currentCalc.value = response.data.toCalculate
        currentCalc.setAttribute('readonly', true);
    })
}
function deleteHistory() {
    if (window.confirm(`Are you sure?`)) {
        axios({
            method: `DELETE`,
            url: `/calculations`
        }).then((response) => {
            if (response.status === 200) {
                document.getElementById(`resultHistory`).innerHTML = ``
                document.getElementById(`recentResult`).innerHTML = ``
            }
        })
    }
}
function safetyCheck() {
    //grab the value
    let exprToCheck = currentCalc.value
    // we need to know if there's operators in it, so set a variable to track that
    let containsOperators = false
    let safe = false
    // we'll need to check parenthesees later, so declare them now.
    let leftParaCount = 0
    let rightParaCount = 0
    // find the operators and use them as a reference point
    // loop through the current expression in the calculator
    for (let i = 0; i < exprToCheck.length; i++) {
        // check if it's NOT a number, if it is we ignore it for now.
        if (!Number(exprToCheck[i])) {
            // check if it's an operator
            if (exprToCheck[i] === (`+`) || exprToCheck[i] === (`-`) || exprToCheck[i] === (`*`) || exprToCheck[i] === (`/`)) {
                // now we know if it does, so we can set this to true
                containsOperators = true
                // now check if the operator contains numbers on either side.
                if (Number(exprToCheck[i - 2]) && Number(exprToCheck[i + 2])) {
                    safe = true
                    // if it doesn't, return false
                } else {
                    window.alert(`Error! Numbers must be on either side of the operator.`)
                    return false
                }
                // now back to the original IF statement, check if there's a valid
                // number of parenthesees (how spell that word)      
            } else if (exprToCheck[i] === `(`) {
                leftParaCount++
            } else if (exprToCheck[i] === `)`) {
                rightParaCount++
                // we don't do bigInt here, kay?
            } else if (exprToCheck[i] === `e`) {
                window.alert(`We don't do bigInt here, mkay?`)
                return false
            }
        }
    }
    // now, we do our checks. Need it to be safe, valid number of parenthesees,
    // and contains at least one operator.
    if (leftParaCount !== rightParaCount) {
        window.alert(`Invalid number of parentheses.`)
        return false
    } else if (!containsOperators) {
        window.alert(`Must contain at least one operator.`)
        return false
    } else if (!safe) {
        window.alert(`Error. Double check Input.`)
        return false
    }
    return true
    // ... all of this for a calculator. Yikes.
}
getCalculationsHistory()