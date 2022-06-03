const add = (a,b) => a+b;
const subtract = (a,b) => a-b;
const multiply = (a,b) => a*b;
const divide = (a,b) => a/b;
const stringToOperation = {
  ['+']:add,
  ['-']:subtract,
  ['*']:multiply,
  ['/']:divide
};
const operate = (opString,a,b) => stringToOperation[opString](a,b);
const inputArea = document.querySelector('.inputArea');
const calculatorDisplay = document.querySelector('.calculatorDisplay');

let currentOperation;
let firstOperand;
let secondOperand;
let firstNumberEntered = false;

function clearResults(){
  firstNumberEntered = false;
  firstOperand = currentOperation = secondOperand = undefined;
  calculatorDisplay.textContent = '';
}

document.querySelector('#clear').addEventListener('click',clearResults);

function createButton(className,id,textContent){
  let button = document.createElement('button');
  button.className = className;
  button.id = id;
  button.textContent = textContent;
  button.addEventListener('click', e => updateState(e.target));
  return button;
}
function createNumberButton(number){
  return createButton('number',number,number);
}

function createOperationButton(operation){
  return createButton('operation',operation,operation);
}

function createEqualsButton(){
  return createButton('evaluation','=','=')
}

function setupInputArea(){

  function createUpperRow(num1,num2,num3,op){
    const row = document.createElement('div');
    row.append(createNumberButton(num1), createNumberButton(num2),
               createNumberButton(num3), createOperationButton(op));
    return row;
  }

  let bottomRow = document.createElement('div');
  bottomRow.append(createNumberButton(0),createEqualsButton(),
                   createOperationButton('+'));
  inputArea.append(createUpperRow(7,8,9,'/'),createUpperRow(4,5,6,'*'),
                   createUpperRow(1,2,3,'-'),bottomRow);
}

function clearDisplay(){
  calculatorDisplay.textContent = '';
}

function appendNumberToDisplay(numString){
  if(calculatorDisplay.textContent === '0'){
    if(numString !== '0'){
      calculatorDisplay.textContent = numString;
    }
  }
  else{
    calculatorDisplay.textContent += numString;
  }
}

function updateState(buttonClicked){
  let buttonClass = buttonClicked.className;
  let buttonId = buttonClicked.id;

  if(firstOperand === undefined && currentOperation === undefined &&
    secondOperand === undefined){
    if(buttonClass === 'number'){
      calculatorDisplay.textContent = buttonId;
      firstOperand = +buttonId;
    }
    else if(buttonClass === 'operation'){
      clearDisplay();
      currentOperation = buttonId;
    }
    else if(buttonClass === 'evaluation'){
      clearDisplay();
    }
  }

  else if(firstOperand !== undefined &&
    currentOperation === undefined && secondOperand === undefined){
    if(buttonClass === 'number'){
      if(firstNumberEntered){
        calculatorDisplay.textContent = buttonId;
        firstOperand = +buttonId;
        firstNumberEntered = false;
      }
      else{
        appendNumberToDisplay(buttonId);
        firstOperand = +calculatorDisplay.textContent;
      }
    }
    else if(buttonClass === 'operation'){
      currentOperation = buttonId;
      firstNumberEntered = true;
    }
    else if(buttonClass === 'evaluation'){
      firstNumberEntered = true;
    }
  }

  else if(firstOperand !== undefined &&
    currentOperation !== undefined && secondOperand === undefined){
    if(buttonClass === 'number'){
      clearDisplay();
      appendNumberToDisplay(buttonId);
      secondOperand = +buttonId;
    }
    else if(buttonClass === 'operation'){
      currentOperation = buttonId;
    }
    else if(buttonClass === 'evaluation'){
      // acts as a way to cancel the operation
      currentOperation = undefined;
    }
  }

  else if(firstOperand !== undefined &&
    currentOperation !== undefined && secondOperand !== undefined){
    if(buttonClass === 'number'){
      appendNumberToDisplay(buttonId);
      secondOperand = +calculatorDisplay.textContent;
    }
    else if(buttonClass === 'operation' ||
      buttonClass === 'evaluation'){
      if(currentOperation === '/' && secondOperand === 0){
        clearResults();
        calculatorDisplay.textContent =
          'No division by 0 allowed, you maniac.';
      }
      else{
        firstOperand =
          operate(currentOperation,firstOperand,secondOperand);
        calculatorDisplay.textContent = firstOperand;
        secondOperand = undefined;
        currentOperation = (buttonClass === 'operation') ?
          buttonId : undefined;
      }
    }
  }

  else if(firstOperand === undefined &&
    currentOperation !== undefined && secondOperand === undefined){
    if(buttonClass === 'number'){
      calculatorDisplay.textContent = buttonId;
      secondOperand = +buttonId;
    }
    else if(buttonClass === 'operation'){
      currentOperation = buttonId;
    }
    else if(buttonClass === 'evaluation'){
      currentOperation.textContent = 'The operation needs a number';
      clearResults();
    }
  }

  // unary operations
  else if(firstOperand === undefined &&
    currentOperation !== undefined && secondOperand !== undefined){
    if(buttonClass === 'number'){
      appendNumberToDisplay(buttonId);
      secondOperand = +calculatorDisplay.textContent;
    }
    else if(buttonClass === 'operation' ||
      buttonClass === 'evaluation'){
      if(['/','*'].includes(currentOperation)){
        calculatorDisplay.textContent = 'Division and ' +
          'multiplication need to take a number before being clicked';
        clearResults();
      }
      else{
        firstOperand =
          operate(currentOperation,0,secondOperand);
        calculatorDisplay.textContent = firstOperand;
        secondOperand = undefined;
        if(buttonClass === 'operation'){
          currentOperation = buttonId;
        }
        else if(buttonClass === 'evaluation'){
          currentOperation = undefined;
        }
      }
    }
  }

}

setupInputArea();
