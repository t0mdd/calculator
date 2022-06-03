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
const correctionOptions = document.querySelector('.correctionOptions');
const inputArea = document.querySelector('.inputArea');
const calculatorDisplay = document.querySelector('.calculatorDisplay');
const validKeyboardInputs =
  ['c','Backspace',...generateValidKeyboardInputs()];

let currentOperation;
let firstOperand;
let secondOperand;
let firstNumberFinalized = false;

function generateValidKeyboardInputs(){
  let result = [];
  for(let i=0; i<=9; i++){
    result.push('' + i);
  }
  for(key in stringToOperation){
    result.push(key);
  }
  return result;
}

function clearResults(){
  firstNumberFinalized = false;
  firstOperand = currentOperation = secondOperand = undefined;
  calculatorDisplay.textContent = '';
}

function createButton(className,id,textContent,colour){
  let button = document.createElement('button');
  button.className = className;
  button.id = id;
  button.textContent = textContent;
  button.addEventListener('click', e => updateState(className,id));
  button.style.flex = 1;
  button.style.backgroundColor = colour;
  return button;
}

function createNumberButton(number){
  return createButton('number',number,number,'hsl(120,50%,80%)');
}

function createOperationButton(operation){
  return createButton('operation',operation,operation,
    'hsl(60,50%,80%)');
}

function createEqualsButton(){
  return createButton('evaluation','=','=','hsl(300,50%,80%)')
}

function setupInputArea(){

  const clearButton = createButton('clear','clear','Clear',
    'hsl(250,50%,80%)');
  clearButton.addEventListener('click',clearResults);
  clearButton.style.flex = 1;

  const backspaceButton = createButton('backspace','backspace',
    'Backspace', 'hsl(210,50%,80%)');
  correctionOptions.append(clearButton,backspaceButton);
  backspaceButton
    .addEventListener('click',e => updateState('backspace',null));
  backspaceButton.style.flex = 1;

  function createUpperRow(num1,num2,num3,op){
    const row = document.createElement('div');
    row.className = 'inputRow'
    row.append(createNumberButton(num1), createNumberButton(num2),
               createNumberButton(num3), createOperationButton(op));
    return row;
  }

  let bottomRow = document.createElement('div');
  bottomRow.className = 'inputRow';
  let zeroButton = createNumberButton(0);
  zeroButton.style.flex = 2;
  bottomRow.append(zeroButton,createEqualsButton(),
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

function backspaceDisplay(){
  calculatorDisplay.textContent =
    calculatorDisplay.textContent.slice(0,-1);
  return calculatorDisplay.textContent.slice(-1) === '.' ?
    calculatorDisplay.textContent.slice(0,-1) :
    calculatorDisplay.textContent;
}

function updateState(actionType,actionValue){
  if(firstOperand === undefined && currentOperation === undefined &&
    secondOperand === undefined){
    if(actionType === 'number'){
      calculatorDisplay.textContent = actionValue;
      firstOperand = +actionValue;
    }
    else if(actionType === 'operation'){
      clearDisplay();
      currentOperation = actionValue;
    }
    else if(actionType === 'evaluation'){
      clearDisplay();
    }
  }

  else if(firstOperand !== undefined &&
    currentOperation === undefined && secondOperand === undefined){
    if(actionType === 'number'){
      if(firstNumberFinalized){
        // reset the calculation in this case
        calculatorDisplay.textContent = actionValue;
        firstOperand = +actionValue;
        firstNumberFinalized = false;
      }
      else{
        // otherwise continue entering the first number
        appendNumberToDisplay(actionValue);
        firstOperand = +calculatorDisplay.textContent;
      }
    }
    else if(actionType === 'operation'){
      currentOperation = actionValue;
      firstNumberFinalized = true;
    }
    else if(actionType === 'evaluation'){
      firstNumberFinalized = true;
    }
    else if(actionType === 'backspace'){
      let newDisplay = backspaceDisplay();
      if(newDisplay){
        firstOperand = +calculatorDisplay.textContent;
      }
      else{
        clearResults();
      }
    }
  }

  else if(firstOperand !== undefined &&
    currentOperation !== undefined && secondOperand === undefined){
    if(actionType === 'number'){
      clearDisplay();
      appendNumberToDisplay(actionValue);
      secondOperand = +actionValue;
    }
    else if(actionType === 'operation'){
      currentOperation = actionValue;
    }
    else if(actionType === 'evaluation'){
      // acts as a way to cancel the operation
      currentOperation = undefined;
    }
    else if(actionType === 'backspace'){
      let newDisplay = backspaceDisplay();
      if(newDisplay){
        firstOperand = +calculatorDisplay.textContent;
      }
      else{
        clearResults();
      }
    }
  }

  else if(firstOperand !== undefined &&
    currentOperation !== undefined && secondOperand !== undefined){
    if(actionType === 'number'){
      appendNumberToDisplay(actionValue);
      secondOperand = +calculatorDisplay.textContent;
    }
    else if(actionType === 'operation' ||
      actionType === 'evaluation'){
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
        currentOperation = (actionType === 'operation') ?
          actionValue : undefined;
      }
    }
    else if(actionType === 'backspace'){
      let newDisplay = backspaceDisplay();
      if(newDisplay){
        secondOperand = +calculatorDisplay.textContent;
      }
      else{
        clearResults();
      }
    }
  }

  else if(firstOperand === undefined &&
    currentOperation !== undefined && secondOperand === undefined){
    if(actionType === 'number'){
      calculatorDisplay.textContent = actionValue;
      secondOperand = +actionValue;
    }
    else if(actionType === 'operation'){
      currentOperation = actionValue;
    }
    else if(actionType === 'evaluation'){
      currentOperation.textContent = 'The operation needs a number';
      clearResults();
    }
  }

  // unary operations
  else if(firstOperand === undefined &&
    currentOperation !== undefined && secondOperand !== undefined){
    if(actionType === 'number'){
      appendNumberToDisplay(actionValue);
      secondOperand = +calculatorDisplay.textContent;
    }
    else if(actionType === 'operation' ||
      actionType === 'evaluation'){
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
        if(actionType === 'operation'){
          currentOperation = actionValue;
        }
        else if(actionType === 'evaluation'){
          currentOperation = undefined;
        }
      }
    }
    else if(actionType === 'backspace'){
      let newDisplay = backspaceDisplay();
      if(newDisplay){
        secondOperand = +calculatorDisplay.textContent;
      }
      else{
        clearResults();
      }
    }
  }

}

window.addEventListener('keydown', e => {
  let keyPressed = e.key;
  if(keyPressed.toLowerCase === 'c'){
    clearResults();
  }
  else if(keyPressed === 'Backspace'){
    updateState('backspace',null);
  }
  else if(validKeyboardInputs.includes(keyPressed)){
    let correspondingButton = document.getElementById(keyPressed);
    updateState(correspondingButton.className,correspondingButton.id);
  }
});
setupInputArea();
