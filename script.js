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

function updateState(buttonClicked){
  return;
}

function createNumberButton(number){
  let button = document.createElement('button');
  button.class = 'number';
  button.textContent = number;
  button.id = number;
  button.addEventListener('click', e => updateState(e.target));
  return button;
}

function createOperationButton(operation){
  let button = document.createElement('button');
  button.class = 'operation';
  button.textContent = operation;
  button.id = operation;
  button.addEventListener('click', e => updateState(e.target));
  return button;
}

function createEqualsButton(){
  let button = document.createElement('button');
  button.class = 'evaluation';
  button.textContent = '=';
  button.id = '=';
  button.addEventListener('click', e => updateState(e.target));
  return button;
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


setupInputArea();
