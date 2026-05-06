// Get display elements
const previousDisplay = document.getElementById('previous-display');
const currentDisplay = document.getElementById('current-display');

// Get buttons
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.getElementById('equals');
const deleteButton = document.getElementById('delete');
const allClearButton = document.getElementById('all-clear');

class Calculator {
  constructor(previousDisplay, currentDisplay) {
    this.previousDisplay = previousDisplay;
    this.currentDisplay = currentDisplay;
    this.clear();
  }

  clear() {
    this.currentDisplayValue = '';
    this.previousDisplayValue = '';
    this.operator = undefined;
  }

  delete() {
    this.currentDisplayValue = this.currentDisplayValue.toString().slice(0, -1);
  }

  typeNumber(number) {
    // Prevent typing more than 12 digits to keep the UI clean
    if (this.currentDisplayValue.toString().length >= 12) return;
    if (number === '.' && this.currentDisplayValue.includes('.')) return;
    
    this.currentDisplayValue = this.currentDisplayValue.toString() + number.toString();
  }

  chooseOperation(operator) {
    if (this.currentDisplayValue === '') return;
    if (this.previousDisplayValue !== '') {
      this.compute();
    }

    this.operator = operator;
    this.previousDisplayValue = this.currentDisplayValue;
    this.currentDisplayValue = '';
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousDisplayValue);
    const current = parseFloat(this.currentDisplayValue);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operator) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        // Handle division by zero if you want to be extra thorough
        computation = current === 0 ? "Error" : prev / current;
        break;
      default:
        return;
    }

    this.currentDisplayValue = computation;
    this.operator = undefined;
    this.previousDisplayValue = '';
  }

  // Helper function to format numbers or convert to scientific notation
  getDisplayNumber(number) {
    const stringNumber = number.toString();
    if (stringNumber === "Error") return "Error";

    // If result is too long, use scientific notation
    if (stringNumber.length > 12) {
      return parseFloat(stringNumber).toExponential(5);
    }

    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;

    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentDisplay.innerText = this.getDisplayNumber(this.currentDisplayValue);

    if (this.operator != null) {
      this.previousDisplay.innerText =
        `${this.getDisplayNumber(this.previousDisplayValue)} ${this.operator}`;
    } else {
      this.previousDisplay.innerText = '';
    }
  }
}

// Initialize calculator
const calculator = new Calculator(previousDisplay, currentDisplay);

// Event Listeners
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.typeNumber(button.dataset.number);
    calculator.updateDisplay();
  });
});

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.dataset.operation);
    calculator.updateDisplay();
  });
});

equalsButton.addEventListener('click', () => {
  calculator.compute();
  calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
  calculator.delete();
  calculator.updateDisplay();
});
