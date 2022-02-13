const mainScreen = document.querySelector([".main-screen"]);
const wordsBox = document.querySelector([".words-box"]);
const firstLine = document.querySelector([".first-line"]);
const secondLine = document.querySelector([".second-line"]);
const input = document.querySelector([".words-input"]);
const timer = document.querySelector(".timer");
const resetBtn = document.querySelector(".reset");
const resultSpeed = document.querySelector([".result-speed"]);
const resultCharacters = document.querySelector([".result-characters"]);
const resultCorrect = document.querySelector([".result-correct"]);
const resultWrong = document.querySelector([".result-wrong"]);
const resultAccuracy = document.querySelector([".result-accuracy"]);
const resultKeyStrokes = document.querySelector([".result-keyStrokes"]);
const resultsScreen = document.querySelector([".results-screen"]);
const resultResetBtn = document.querySelector([".result-reset"]);
const wrongWordsContainer = document.querySelector([".wrong-words"]);

let wordsInLine = 10;
const time = 15 * 1000;
let totalWordsNumber = 0;

let actualWordId = 0;
let correctWords = 0;
let wrongWords = 0;
let totalWordsCharacters = 0;
let correctWordsCharacters = 0;

let wordsWithMistakes = [];

let timeout;
let timeInterval;
let actualTime = time / 1000;

let keyStrokes = 0;

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const setNumberOfWordsInLine = () => {
    const screenWidth = window.innerWidth;
    wordsInLine = Math.floor(screenWidth / 175);
};

const generateCommonWordsLine = () => {
    let newLine = document.createElement("div");
    for (let i = 0; i < wordsInLine; i++) {
        let newSpan = document.createElement("span");
        newSpan.textContent =
            commonPolishWords[
                getRandomIntInclusive(0, commonPolishWords.length - 1)
            ];
        newSpan.setAttribute("data-word-id", totalWordsNumber);
        totalWordsNumber++;
        newLine.append(newSpan);
    }
    return newLine;
};

const pushNextLine = () => {
    firstLine.querySelector("div").remove();
    firstLine.append(secondLine.querySelector("div"));
    secondLine.append(generateCommonWordsLine());
};

const clearInput = () => {
    return (input.value = "");
};

const getWordFromInput = () => {
    let word = input.value;
    if (word[0] === " ") word = word.slice(1);
    clearInput();
    return word;
};

const goToTheNextWord = () => {
    const actualWord = wordsBox.querySelector(
        `[data-word-id="${actualWordId}"]`
    );
    if (actualWordId % wordsInLine == wordsInLine - 1) {
        pushNextLine();
    }

    actualWord.classList.remove("highlight");

    if (actualWord.textContent == getWordFromInput()) {
        actualWord.classList.add("correct");
        correctWords++;
        correctWordsCharacters += actualWord.textContent.length;
    } else {
        actualWord.classList.add("wrong");
        wordsWithMistakes.push(actualWord.textContent);
        wrongWords++;
    }

    totalWordsCharacters += actualWord.textContent.length;
    wordsBox
        .querySelector(`[data-word-id="${actualWordId + 1}"]`)
        .classList.add("highlight");
    actualWordId++;
};

const showWordsWithMistakes = () => {
    const ul = document.createElement("ul");
    wordsWithMistakes.forEach((word) => {
        const newLi = document.createElement("li");
        newLi.textContent = word;
        ul.appendChild(newLi);
    });
    wrongWordsContainer.append(ul);
};

const setResults = () => {
    resultsScreen.classList.remove("hide");
    resultSpeed.textContent = `${correctWords / (time / 60000)} WPM (${
        correctWordsCharacters / (time / 60000)
    } CPM)`;
    resultCharacters.textContent = `${correctWordsCharacters}/${totalWordsCharacters}`;
    resultCorrect.textContent = correctWords;
    resultWrong.textContent = wrongWords;
    resultAccuracy.textContent =
        ((correctWordsCharacters / totalWordsCharacters) * 100).toFixed(2) +
        "%";
    resultKeyStrokes.textContent = keyStrokes;
    showWordsWithMistakes();
};

const showResults = () => {
    alert("TIME'S UP!");
    setTimeout(() => {
        setResults();
        resultsScreen.scrollIntoView({
            behavior: "smooth",
        });
    }, 20);
    setTimeout(() => resultResetBtn.focus(), 500);
    AddListenerThatStartsTheTimer();
};

const startTimer = () => {
    timeInterval = setInterval(() => {
        if (actualTime == 0) clearInterval(timeInterval);
        actualTime--;
        timer.textContent = actualTime;
    }, 1000);
};

const spacebarKeyCheck = () => {
    if (event.keyCode === 32) {
        goToTheNextWord();
    }
};

const AddListenerThatStartsTheTimer = () => {
    input.addEventListener(
        "keydown",
        () => {
            if (actualWordId === 0 && input.value == "") {
                startTimer();
                timeout = setTimeout(showResults, time);
            }
        },
        {
            once: true,
        }
    );
};

const reset = () => {
    actualWordId = 0;
    totalWordsNumber = 0;
    actualTime = time / 1000;
    correctWords = 0;
    wrongWords = 0;
    totalWordsCharacters = 0;
    correctWordsCharacters = 0;
    keyStrokes = 0;
    if (wordsWithMistakes.length)
        setTimeout(() => wrongWordsContainer.querySelector("ul").remove(), 500);
    wordsWithMistakes = [];
    timer.textContent = actualTime;
    clearInterval(timeInterval);
    clearTimeout(timeout);
    clearInput();
    firstLine.querySelector("div").remove();
    secondLine.querySelector("div").remove();
    firstLine.append(generateCommonWordsLine());
    secondLine.append(generateCommonWordsLine());
    firstLine.querySelector("span").classList.add("highlight");
    // console.log(firstLine.querySelector('span').getBoundingClientRect().width);
    mainScreen.scrollIntoView({
        behavior: "smooth",
    });
    setTimeout(() => {
        resultsScreen.classList.add("hide");
        input.focus();
        input.focus();
    }, 500);
};

setNumberOfWordsInLine();
firstLine.append(generateCommonWordsLine());
secondLine.append(generateCommonWordsLine());
timer.textContent = time / 1000;
firstLine.querySelector("span").classList.add("highlight");
input.addEventListener("keydown", spacebarKeyCheck);
input.addEventListener("keydown", () => keyStrokes++);
AddListenerThatStartsTheTimer();
resetBtn.addEventListener("click", reset);
resultResetBtn.addEventListener("click", reset);
window.addEventListener("resize", setNumberOfWordsInLine);
