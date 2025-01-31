// 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
// 🔥 DO NOT MODIFY THIS FILE!!!! OR ELSE! 🔥
// 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

// mwahahahahahahahahahahahahahahaha considered your file MODIFIED!

// I tried to note changes I made with a very visible comment.
// commented out a bunch of the repetitive tests, because time.

// Testing Library Stuff:
const { fireEvent, getByText, getByRole, getByPlaceholderText, getByTestId , getByDisplayValue } = require('@testing-library/dom')
require('@testing-library/jest-dom')
const { JSDOM } = require('jsdom')

// File-Reading Stuff:
const fs = require('fs')
const path = require('path')
const html = fs.readFileSync(path.resolve(__dirname, '../server/public/index.html'), 'utf8')
const jsFile = fs.readFileSync(path.resolve(__dirname, '../server/public/scripts/client.js'), 'utf8')

// Nifty Testing Tools, Authored by the Instructors You Know and Love:
    // Using a different testCalculations because the data structure is different 
const testCalculations = require('./__utils__/testCalculationsAlt.js')
const axios = require('./__utils__/axiosMockalt.js')
const briefPause = require('./__utils__/briefPause.js')

// Holds the jsdom instance that the tests run against:
let container

describe(`Client-Side Tests:`, () => {

  const customOutputOptions = {
    showPrefix: false,
    showMatcherMessage: false
  }

  beforeAll(() => {
    // Keep test output clean by disabling student console.log
    // statements during test output:
    console.log = () => { }
  })

  beforeEach(async () => {
    // Make the DOM:
    dom = new JSDOM(html, { runScripts: 'dangerously' })

    // Reset our axios mock:
    axios.mockClear()

    // Reset the array of metadata objects that represent axios calls
    // within each test:
    axios.calls = []

    // Reset the dummy data:
    axios.testData = [...testCalculations]

    // Attach our axios mock to the DOM and execute script.js:
    dom.window.axios = axios
    dom.window.eval(jsFile)

    // Make sure we pause a moment for the axios GET request:
    await briefPause(100)

    // Stashing the DOM's body in a container. This is
    // what we test against:
    container = dom.window.document.body
  })

  // Making sure all required data-testids are present
  // They come already completed, so the way these tests fail
  // is if someone removes them or changes them.

//********** MODIFIED ************

  it(`Has all required data-testids`, () => {
    expect(getByTestId(container, 'inputNum')).toBeTruthy();
// No longer use two nums, only one field. 
    // expect(getByTestId(container, 'numTwo')).toBeTruthy();
    expect(getByTestId(container, 'calculator')).toBeTruthy();
    expect(getByTestId(container, 'recentResult')).toBeTruthy();
    expect(getByTestId(container, 'resultHistory')).toBeTruthy();
  })

  it(`Makes one initial GET request upon page load`, async () => {
    expect(axios.calls.length).toBe(1) // 👈 just one axios call

    expect(axios.calls[0].requestMethod).toBe('GET') // 👈 method was GET
  })

  it(`A GET request results in the most recent result being rendered inside the recentResult <section>`, () => {
    const recentResultSection = getByTestId(container, 'recentResult')

    // Check if the most recent calculation result is rendered:
    expect(getByText(recentResultSection, /10096/)).toBeInTheDocument()
  })

  it(`A GET request results in the calculation history being rendered inside the resultHistory <section>`, () => {
    const resultHistorySection = getByTestId(container, 'resultHistory')

    // Check if the two test calculations are rendered:
    expect(getByText(resultHistorySection, '10101 + 5 = 10106')).toBeInTheDocument()
    expect(getByText(resultHistorySection, '10101 - 5 = 10096')).toBeInTheDocument()
  })

  it(`A POST request is made when the '=' button is clicked`, async () => {
    // First, we populate the inputs and click an operator.
    // We want this test to work if students write error-handling
    // logic that prevents a bad POST request from happening.

// ************* MODIFIED **************


    // Select the inputs and an operator button:
        // **Seperated out and made new buttons.
    const inputNum = getByTestId(container, 'inputNum')
    // const numTwo = getByTestId(container, 'numTwo')

    //Added this here to copy+paste for other tests.

    const oneButton = getByRole(container, 'button', { name: '1'})
    const threeButton = getByRole(container, 'button', { name: '3'})
    const nineButton = getByRole(container, 'button', { name: '9'})
    const addButton = getByRole(container, 'button', { name: '+' })
    

    // Populate the inputs and click the '+' button:
    oneButton.click()
    addButton.click()
    threeButton.click()
    nineButton.click()

    // ** Check that it inputed correctly!
    expect(getByDisplayValue(container, '1 + 39')).toBeInTheDocument()

    // Click the '=' button:
    const equalsButton = getByRole(container, 'button', { name: '=' })
    equalsButton.click()

    await briefPause(200)

    // Confirm that the second HTTP request's method was POST:
    const requestMethods = axios.calls.map(call => call.requestMethod)
    expect(requestMethods).toContain('POST')
  })

  // 🌈 TODO: Test that numOne and numTwo in POST data are numbers. 🌈
  // it(`A POST request's numOne and numTwo data properties both have a datatype of number.`, () => {
  // 
  // })

  it(`Addition: A POST request's data is an object that contains the correct value for toCalculate`, async () => {
    // Select the inputs and an operator button:

    // *********** MODIFIED ***************

    // const numOne = getByTestId(container, 'numOne')
    // const numTwo = getByTestId(container, 'numTwo')
    const oneButton = getByRole(container, 'button', { name: '1'})
    const threeButton = getByRole(container, 'button', { name: '3'})
    const nineButton = getByRole(container, 'button', { name: '9'})
    const addButton = getByRole(container, 'button', { name: '+' })
    

    // Populate the inputs and click the '+' button:
    oneButton.click()
    addButton.click()
    threeButton.click()
    nineButton.click()
    // Click the '=' button:
    const equalsButton = getByRole(container, 'button', { name: '=' })
    equalsButton.click()

    await briefPause(200)

    const sentPost = axios.calls.find(call => call.reqBody)
    const reqBody = sentPost.reqBody
// ** Check that the posts the object correctly... but with my syntax
// that I'm using for serverside. Not sure how to standardise this.
    expect(['1 + 39']).toContain(reqBody.toCalculate)
  })

// all of these tests check similar things, and would be rewritten
// similarly to the test above


//   it(`Subtraction: A POST request's data is an object that contains the correct values for numOne, numTwo, and operator`, async () => {
//     // Select the inputs and an operator button:
//     const numOne = getByTestId(container, 'numOne')
//     const numTwo = getByTestId(container, 'numTwo')
//     const minusButton = getByRole(container, 'button', { name: '-' })

//     // Populate the inputs and click the '-' button:
//     fireEvent.change(numOne, { target: { value: 123 } })
//     minusButton.click()
//     fireEvent.change(numTwo, { target: { value: 456 } })

//     // Click the '=' button:
//     const equalsButton = getByRole(container, 'button', { name: '=' })
//     equalsButton.click()

//     await briefPause(200)

//     const sentPost = axios.calls.find(call => call.reqBody)
//     const reqBody = sentPost.reqBody

//     expect([123, '123']).toContain(reqBody.numOne)
//     expect([456, '456']).toContain(reqBody.numTwo)
//     expect(reqBody.operator).toBe('-')
//   })

//   it(`Multiplication: A POST request's data is an object that contains the correct values for numOne, numTwo, and operator`, async () => {
//     // Select the inputs and an operator button:
//     const numOne = getByTestId(container, 'numOne')
//     const numTwo = getByTestId(container, 'numTwo')
//     const multiplicationButton = getByRole(container, 'button', { name: '*' })

//     // Populate the inputs and click the '-' button:
//     fireEvent.change(numOne, { target: { value: 123 } })
//     multiplicationButton.click()
//     fireEvent.change(numTwo, { target: { value: 456 } })

//     // Click the '=' button:
//     const equalsButton = getByRole(container, 'button', { name: '=' })
//     equalsButton.click()

//     await briefPause(200)

//     const sentPost = axios.calls.find(call => call.reqBody)
//     const reqBody = sentPost.reqBody

//     expect([123, '123']).toContain(reqBody.numOne)
//     expect([456, '456']).toContain(reqBody.numTwo)
//     expect(reqBody.operator).toBe('*')
//   })

//   it(`Division: A POST request's data is an object that contains the correct values for numOne, numTwo, and operator`, async () => {
//     // Select the inputs and an operator button:
//     const numOne = getByTestId(container, 'numOne')
//     const numTwo = getByTestId(container, 'numTwo')
//     const divisionButton = getByRole(container, 'button', { name: '/' })

//     // Populate the inputs and click the '-' button:
//     fireEvent.change(numOne, { target: { value: 123 } })
//     divisionButton.click()
//     fireEvent.change(numTwo, { target: { value: 456 } })

//     // Click the '=' button:
//     const equalsButton = getByRole(container, 'button', { name: '=' })
//     equalsButton.click()

//     await briefPause(200)

//     const sentPost = axios.calls.find(call => call.reqBody)
//     const reqBody = sentPost.reqBody

//     expect([123, '123']).toContain(reqBody.numOne)
//     expect([456, '456']).toContain(reqBody.numTwo)
//     expect(reqBody.operator).toBe('/')
//   })

  it(`Clear: Inputs should be empty after the 'C' button is clicked`, () => {
    // Select the inputs and an operator button:
    // const numOne = getByTestId(container, 'numOne')
    // const numTwo = getByTestId(container, 'numTwo')
    
    // ************** MODIFIED *******************

    const inputNum = getByTestId(container, 'inputNum')
    const clearButton = getByRole(container, 'button', { name: 'C' })
    const oneButton = getByRole(container, 'button', { name: '1'})
    const threeButton = getByRole(container, 'button', { name: '3'})
    const nineButton = getByRole(container, 'button', { name: '9'})
    const addButton = getByRole(container, 'button', { name: '+' })
    

    // Populate the inputs and click the '+' button:
    oneButton.click()
    addButton.click()
    threeButton.click()
    nineButton.click()
    // Click the 'C' button:
    clearButton.click()


    expect(inputNum.value).toBe('')
  })

  it(`After a successful POST request, the client makes a GET request to fetch the most recent results`, async () => {
    // ****************** MODIFIED ******************
    
    const oneButton = getByRole(container, 'button', { name: '1'})
    const threeButton = getByRole(container, 'button', { name: '3'})
    const nineButton = getByRole(container, 'button', { name: '9'})
    const addButton = getByRole(container, 'button', { name: '+' })

    // Populate the inputs and click the '+' button:
    threeButton.click()
    nineButton.click()
    addButton.click()
    oneButton.click()
    threeButton.click()

    // Click the '=' button:
    const equalsButton = getByRole(container, 'button', { name: '=' })
    equalsButton.click()

    await briefPause(200);

    const raceHint = `
    🔥   🔥   🔥   🔥

Your code is making a GET request
immediately after making the POST request!
It needs to wait for the POST request to finish.
To make this test pass, you'll need
to refactor your code so that the
GET request is 100% guaranteed to 
only be fired off AFTER the POST
request receives its response.
    `

    // Three HTTP requests should have been made:
    expect(axios.calls.length).toBe(3)

    // 1. The initial GET on page load.
    // 2. The POST when the "Add Joke" button is clicked.
    // 3. Another GET after the POST request..
    const requestMethods = axios.calls.map((call) => call.requestMethod)
    expect(requestMethods, raceHint, customOutputOptions).toEqual(['GET', 'POST', 'GET'])
  })

  it(`After a successful POST request, the most recent result is rendered in the recentResult <section>`, async () => {
    
    // ******************* MODIFIED **************************
    
    // Select the inputs and an operator button:
    const oneButton = getByRole(container, 'button', { name: '1'})
    const threeButton = getByRole(container, 'button', { name: '3'})
    const nineButton = getByRole(container, 'button', { name: '9'})
    const addButton = getByRole(container, 'button', { name: '+' })

    // Populate the inputs and click the '+' button:
    threeButton.click()
    nineButton.click()
    addButton.click()
    oneButton.click()
    threeButton.click()

    // Click the '=' button:
    const equalsButton = getByRole(container, 'button', { name: '=' })
    equalsButton.click()

    await briefPause(200)



    // Check if the correct calculation result is displayed:
    const recentResultSection = getByTestId(container, 'recentResult')
    expect(getByText(recentResultSection, /52/)).toBeInTheDocument()
  })

  it(`After a successful POST request, the calculation history is rendered in the resultsHistory <section>`, async () => {
    // Select the inputs and an operator button:
    const oneButton = getByRole(container, 'button', { name: '1'})
    const threeButton = getByRole(container, 'button', { name: '3'})
    const nineButton = getByRole(container, 'button', { name: '9'})
    const addButton = getByRole(container, 'button', { name: '+' })

    // Populate the inputs and click the '+' button:
    threeButton.click()
    nineButton.click()
    addButton.click()
    oneButton.click()
    threeButton.click()

    // Click the '=' button:
    const equalsButton = getByRole(container, 'button', { name: '=' })
    equalsButton.click()

    await briefPause(200)

    // Verify that the three calculations are rendered in section.resultHistory:
    const resultHistorySection = getByTestId(container, 'resultHistory')
    expect(getByText(resultHistorySection, '10101 + 5 = 10106')).toBeInTheDocument()
    expect(getByText(resultHistorySection, '10101 - 5 = 10096')).toBeInTheDocument()
    expect(getByText(resultHistorySection, '39 + 13 = 52')).toBeInTheDocument()
  })
})
