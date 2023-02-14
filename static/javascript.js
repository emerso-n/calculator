//type input into calc display
//keep current formula in a string or something to be

const calcDisplay = document.querySelector("#calc-display div");
const terminal = document.querySelector("#terminal");
let terminalArray = []
const newTerminalLine = () => {
    if (terminalArray.length > 0) {
        currTerminal().classList.remove("currTerminal")
    }
    p = createDiv("p", terminal);
    p.innerHTML = ">&nbsp;";
    p.className = "currTerminal";
    terminalArray.push(p)
    return p
}
newTerminalLine()
let currTerminal = () => { return terminalArray[terminalArray.length - 1] }

const typeBtns = document.querySelectorAll("button");
typeBtns.forEach(button => button.addEventListener('click', buttonClick))

let maxDecimalPlaces = 10

const operators = ['+', '−', '×', '÷'];
let operationSpans = [span = createDiv("span", calcDisplay)]
let currSpan = () => { return operationSpans[operationSpans.length - 1] } //this is how you get dynamic variables
//this was an important lesson learned

/*
terminal
should it type the function with code operators. is that more fun? maybe?
as you press buttons the terminal also types
when you press equals then it makes a new p with =value
then when you start typing again it makes another new line, carrying over the last result number if you didn't clear it
if you clear the console it will make a new line
*/
let parenthesisCount = 0
let lastSpanIsLParen = false
function buttonClick(e) {
    e.target.blur()
    let currSpanIsOperator = operators.includes(currSpan().textContent);
    //check if the last span is a paren or if the current one is empty
    if (operationSpans.length > 1) {
        lastSpanIsLParen = operationSpans[operationSpans.length - 2].textContent.includes("(") && !currSpan().textContent
    }
    let operatorBtn = e.target.className
    if (currTerminal().textContent.includes("=") && e.target.id != "clear-btn") {
        let prevNum = currTerminal().innerText.slice(4);
        newTerminalLine()
        currTerminal().innerText += prevNum
    }
    switch (e.target.id) {
        case "clear-btn":
            clearDisplay();
            newTerminalLine()
            break;
        case "clearentry-btn":
            currSpan().textContent = currSpan().textContent.slice(0, -1); //remove the last character
            if (!currSpan().textContent && operationSpans.length > 1) {//if this makes the span empty and this isn't the first span, delete the span
                currSpan().remove();
                operationSpans.pop();
            }
            if (currTerminal().textContent.length > 2) { //prevents deleting of the >&nbsp;
                currTerminal().textContent = currTerminal().textContent.slice(0, -1);
            }
            break;
        case "leftparenthesis-btn":
            //we gotta make this a new span right
            //or nah i forget lowkeylmao
            //i think not really unless its relevant to the code cuz i turn the whole thing into a string later anyway
            //if you make this a new span then you can check its length for the right parenthesis
            //how will that interact with negative btn
            //ok what if i make the parenthesies their own spans
            operationSpans.push(createDiv("span", calcDisplay)); //make the parenthesis their own spans
            typeInput("(");
            operationSpans.push(createDiv("span", calcDisplay));
            parenthesisCount++;
            break;
        case "rightparenthesis-btn":
            //if parenthesis count > 0
            //no empty parenthesis
            //it can be just a number but it cant end on an operator
            if (parenthesisCount > 0 && !currSpanIsOperator && !lastSpanIsLParen) {
                operationSpans.push(createDiv("span", calcDisplay));
                typeInput(")");
                operationSpans.push(createDiv("span", calcDisplay));
                parenthesisCount--
            }
            break;
        case "negative-btn":
            if (currSpanIsOperator) { //make a new span and add a negative symbol to it
                operationSpans.push(createDiv("span", calcDisplay));
                currSpan().textContent = "-";
                currTerminal().textContent += "-";
            } else if (currSpan().textContent.includes("-")) { //remove the current negative symbol
                currSpan().textContent = currSpan().textContent.slice(1);
                currTerminal().textContent = currTerminal().textContent.replace(/-(?!.*-)/, "");
            } else { //add a negative symbol to the front of the span
                currSpan().textContent = "-" + currSpan().textContent;
                currTerminal().textContent = currTerminal().textContent.replace(/([\+\-\*\/\s])(?!.*[\+\-\*\/\s])/, "$1-");
            }
            break;
        case "decimal-btn":
            if (!currSpan().textContent.includes(".")) { //if the current span doesn't already have a decimal, add a decimal
                typeInput(".");
            }
            break;
        case "equal-btn":
            if (!currSpanIsOperator && operationSpans.length > 1) { //can't calculate expression if the last value is an operator, if theres only one number/span, and if there are open parenthesis
                //i could also just add in the rest of the parenthesis. that would probably feel better
                currSpan().textContent += ")".repeat(parenthesisCount)
                currTerminal().textContent += ")".repeat(parenthesisCount)
                parenthesisCount = 0
                let expression = operationSpans.reduce((total, span) => total + span.textContent, ""); //make all the spans into one string that gets passed into calculate
                clearDisplay();
                result = calculate(expression)
                currSpan().textContent = result;
                newTerminalLine().innerHTML += "&nbsp;=" + result
            }
            break;
        default: //if operatorbtn or number
            if (operatorBtn) { //if an operator button was just pressed
                if (!operationSpans[0].textContent || lastSpanIsLParen) break //if operatorbtn but the first span is empty aka nothing has been input yet, return
                if (currSpanIsOperator) { //if operatorbtn but the current span is already an operator, then just replace the operator
                    currSpan().textContent = e.target.textContent;
                    currTerminal().textContent = currTerminal().textContent.slice(0, -1)
                    currTerminal().textContent += e.target.textContent
                    break;
                }
                if (!currSpanIsOperator) operationSpans.push(createDiv('span', calcDisplay, 'operator-span')); //if operatorBtn and the current span is not an operator, then make a new span for the operator
            }
            if (!operatorBtn && currSpanIsOperator) operationSpans.push(createDiv('span', calcDisplay)); //if not operatorBtn but the current span is an operator, make a new span for the new value

            typeInput(e.target.textContent);
    }
}

function typeInput(val) {
    currSpan().textContent += val;
    if (operators.includes(val)) {
        switch (val) {
            case operators[0]:
                //val = "+";
                break;
            case operators[1]:
                val = "-"
                break;
            case operators[2]:
                val = "*";
                break;
            case operators[3]:
                val = "/";
                break;
            default:
                console.error("something very wrong with typeInput switch statement")
        }
    }
    if (currTerminal().innerText.includes("=")) {
        let prevNum = currTerminal().innerText.slice(4);
        newTerminalLine()
        currTerminal().innerText += prevNum
    }
    currTerminal().innerText += val;

    if (currSpan().textContent == "01134" || currSpan().textContent == "80085") {
        p = createDiv("p", terminal);
        p.innerHTML = ">&nbsp;";
        currSpan().textContent == "01134" ? txt = "hi :)" : txt = "(￢‿￢ )"
        setTimeout(() => typeWriter(p, txt), 200)
    }
}

function typeWriter(element, txt, i = 0) {
    if (i < txt.length) {
        element.innerHTML += txt.charAt(i);
        i++;
        setTimeout(() => typeWriter(element, txt, i), 60); //speed in miliseconds
    }
}

function clearDisplay() {
    operationSpans.forEach(span => span.remove());
    operationSpans = [span = createDiv("span", calcDisplay)];
}
function createDiv(tag, parent, className = "") {
    let div = document.createElement(tag)
    if (className) div.className = className
    parent.appendChild(div);
    return div;
}

// console.log("5-6(5+68(7-5))".replace(/(\d+)\(/g, "$1*(")) 
//gotta do something about ((((9)))) btw. i think. idk

function calculate(expression) {
    expression = expression.replace(/(\d+)\(/g, "$1×(") //add * between numbers and parenthesis
    expression = expression.replace(/(\)+)\(/g, "$1×(") //add * between numbers and parenthesis
    console.log(expression)
    let result = parseAddition(expression)
    result = result.toString().replace(/0*$/, "");
    return result
}
function parseAddition(expression) {
    let numbersStrings = expression.split('+'); // ["num", "num", "num"]
    let numbers = numbersStrings.map(str => parseSubtraction(str)); //[num, num, num]
    let result = numbers.reduce((total, num) => total + num, 0);
    return result;
}
function parseSubtraction(expression) {
    let numbersStrings = expression.split('−'); // ["num", "num", "num"]
    let numbers = numbersStrings.map(str => parseMultiplication(str)); //[num, num, num]
    let result = numbers.slice(1).reduce((total, num) => total - num, numbers[0]); //you have to start subtraction with the first number or else it does 0 - 6 - 3 = -9 which is not what we want from 6 - 3
    //also you do slice(1) to start num on the second number, so the initial value is the first value and you start num on the second value 
    //or else it would be 6-6-3 = -3 which again, not what we want
    return result;
}
function parseMultiplication(expression) {
    //if its a single number it just doesn't get changed by any of this
    let numbersStrings = expression.split('×'); // ["num", "num", "num"]
    let numbers = numbersStrings.map(str => parseDivision(str)); //[num, num, num]
    let result = numbers.reduce((total, num) => total * num, 1); //you gotta start at 1 or you will be multiplying by 0 which will make it always 0
    return result;
}
function parseDivision(expression) {
    //if its a single number it just doesn't get changed by any of this
    let numbersStrings = expression.split('÷'); // ["num", "num", "num"]
    let numbers = numbersStrings.map(str => parseParenthesis(str)); //[num, num, num]
    let result = numbers.slice(1).reduce((total, num) => total / num, numbers[0]); //same deal as with subtraction
    return result;
}
function parseParenthesis(expression){
    console.log(expression)
    let numbersStrings = expression.split('('); // we gotta split by ( and )
    numbersStrings = expression.split(')'); // we gotta split by ( and )
    console.log(numbersStrings)
    // let numbers = numbersStrings.map(str => +str); //[num, num, num]
    // let result = numbers.slice(1).reduce((total, num) => total / num, numbers[0]); //same deal as with subtraction
    // return result;
}

let pressedBtn
document.addEventListener("keydown", (e) => {
    pressedBtn = document.querySelector(`[data-key="${e.key}"]`);
    pressedBtn.click();
    pressedBtn.focus();
})
document.addEventListener("keyup", (e) => {
    if (e.key == pressedBtn.dataset.key) pressedBtn.blur()
})

let dragItem = document.querySelector("#calc-body");
let container = document.querySelector("#calculator_con");
container.addEventListener("touchstart", dragStart, false);
container.addEventListener("touchend", dragEnd, false);
container.addEventListener("touchmove", drag, false);

container.addEventListener("mousedown", dragStart, false);
container.addEventListener("mouseup", dragEnd, false);
container.addEventListener("mousemove", drag, false);

var active = false;
var currentX;
var currentY;
var initialX;
var initialY;
var xOffset = 0;
var yOffset = 0;

function dragStart(e) {
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }

    if (e.target === dragItem) {
        container.style.pointerEvents = "all"
        active = true;
    }
}
function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    container.style.pointerEvents = "none"
    active = false;
}
function drag(e) {
    if (active) {

        e.preventDefault();

        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, dragItem);
    }
}
function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}