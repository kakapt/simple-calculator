const wrapper = document.querySelector(".calculator-wrapper");
const input = document.querySelector("#input");
const output = document.querySelector("#output");

let state = {
  inputData: [],
  lastOperator: "",

  operandContainDot: false,
  resetInput() {
    this.inputData = [];
    this.lastOperator = "";
    this.updateInput();
    this.resetOutput();
    this.operandContainDot = false;
  },
  resetOutput() {
    output.textContent = "";
    output.innerHTML = "&nbsp";
  },
  pop() {
    const popData = this.inputData.pop();

    if (popData == ".") {
      this.operandContainDot = false;
    }

    if ("+-*/".includes(popData)) {
      this.lastOperator = "";
      for (let i = this.inputData.length - 1; i >= 0; i--) {
        if ("+-*/".includes(this.inputData[i])) {
          if (
            this.inputData.slice(i + 1, this.inputData.length).includes(".")
          ) {
            this.operandContainDot = true;
          } else {
            this.operandContainDot = false;
          }
          break;
        }

        //reach i == 0
        if (this.inputData.includes(".")) {
          this.operandContainDot = true;
        } else {
          this.operandContainDot = false;
        }
      }
    }

    if (this.inputData.length == 0) {
      this.resetInput();
      return;
    }

    const lastOp = this.inputData[this.inputData.length - 1];
    if ("+-*/".includes(lastOp)) {
      this.lastOperator = lastOp;
    }

    this.updateInput();
  },
  updateInput() {
    if (!this.inputData.length) {
      input.textContent = "";
      input.innerHTML = "&nbsp";
    } else {
      input.innerHTML = "";
      input.textContent = this.inputData.join("");
    }
    this.resetOutput();

    if (input.scrollWidth > input.clientWidth) {
      input.scrollTo(input.scrollWidth, 0);
    }
  },
  updateOperator(operator) {
    if (this.inputData.at(-1) == ".") {
      return;
    }
    if (this.inputData.length == 0) {
      this.inputData.unshift("0", operator);
      this.updateInput();
      this.lastOperator = operator;
      return;
    }

    if (this.lastOperator) {
      this.inputData[this.inputData.length - 1] = operator;
    } else {
      this.inputData.push(operator);
    }

    this.lastOperator = operator;

    this.updateInput();
    this.operandContainDot = false;
  },

  updateNumber(number) {
    if (this.lastOperator) {
      this.lastOperator = "";
    }

    if (this.operandContainDot) {
      this.inputData.push(number);
      this.updateInput();
      return;
    }
    let index;
    for (let i = this.inputData.length; i >= 1; i--) {
      if ("+-*/".includes(this.inputData[i - 1])) {
        index = i;
        break;
      } else {
        index = i - 1;
      }
    }

    if (this.inputData[index] == "0") {
      this.inputData[index] = number;
    } else {
      this.inputData.push(number);
    }
    this.updateInput();
  },

  updateDot() {
    if (this.operandContainDot) return;
    if (this.inputData.length == 0) {
      this.inputData = ["0", "."];
      this.updateInput();
      this.operandContainDot = true;
      return;
    }

    const lastChar = this.inputData[this.inputData.length - 1];
    if ("+-*/".includes(lastChar)) {
      this.inputData.push("0", ".");
    } else {
      this.inputData.push(".");
    }

    this.updateInput();
    this.operandContainDot = true;
  },

  updateOutput() {
    if (this.inputData.length == 0) {
      return;
    }
    if (this.lastOperator) {
      this.displayOutput("unexpected operator: " + this.lastOperator);
      return;
    }

    //this is trash, implement a parser when have time
    let result = eval(this.inputData.join(""));
    this.displayOutput(result);
  },

  displayOutput(value) {
    output.innerHTML = "";
    output.textContent = value;
  },
};

wrapper.addEventListener("click", function (e) {
  const target = e.target;

  if (target.tagName == "BUTTON") {
    if (target.id == "ce-btn") {
      state.resetInput();
    }

    if (target.id == "del-btn") {
      state.pop();
    }

    if (target.className == "operator") {
      state.updateOperator(target.textContent);
    }

    if (target.className == "number") {
      state.updateNumber(target.textContent);
    }

    if (target.id == "dot-btn") {
      state.updateDot();
    }

    if (target.id == "equal-btn") {
      state.updateOutput();
    }
  }
});
