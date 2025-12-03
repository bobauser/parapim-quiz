let jsonFileURL = "multiplechoice.json"
let jsonData = [];
let userAnswers = [];
let currentQuestionIndex = 0;
let correctAnswers = [];
let multipleChoiceQues = false
let points = 0
let questionPointsToAdd = 0

function setJsonUrl(newUrl) {
    jsonFileURL = newUrl
}

function scrollToSection(id) {
    // const element = document.getElementById(id);
    const element = document.getElementById("question");
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.warn(`Element med ID "${id}" ble ikke funnet.`);
    }
}

// Funksjon for å initialisere quiz med data fra JSON-fil
async function getExam(specificUrl) {
    console.log("Ok, lets try to get the quiz")
    try {
    //   const response = await fetch('multiplechoice.json');
        const response = await fetch(jsonFileURL);
        console.log("Here is the response")
        console.log(response)
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        jsonData = await response.json();
        generateRandomOrder(); // Generer en tilfeldig rekkefølge etter å ha lastet data
        loadQuestion(); // Når data er lastet, vis første spørsmål
    } catch (error) {
        console.error('Could not load the JSON data: ', error);
        let respBar = document.querySelector(".response-bar")
        let buttonToCreateTests = document.createElement("button")
        buttonToCreateTests.id = "test-questions-emergency"
        buttonToCreateTests.innerText = "JSON couldn't load, try test questions?"

        respBar.appendChild(buttonToCreateTests)

        document.getElementById('test-questions-emergency').addEventListener('click', loadTestData);
    }
}

function loadTestData () {
    console.log("Generate the new test questions")
    jsonData = [
            {
                "question": "Test, 1 answer. Answer is Q",
                "options": [
                "This is option A",
                "This is option 12B",
                "This is option Q",
                "This is Option 4K"
                ],
                "answer": "This is option Q"
            },
            {
                "question": "Test, 1 answer. Answer is A",
                "options": [
                "This is option A",
                "This is option 12B",
                "This is option Q",
                "This is Option 4K"
                ],
                "answer": "This is option A"
            },
            {
                "question": "Test, 1 answer. Answer is 12B",
                "options": [
                "This is option A",
                "This is option 12B",
                "This is option Q",
                "This is Option 4K"
                ],
                "answer": "This is option 12B"
            },
            {
                "question": "Test, Multiple Choice, Answer is Q and 4K",
                "options": [
                "This is option A",
                "This is option 12B",
                "This is option Q",
                "This is Option 4K"
                ],
                "answer": ["This is option Q", "This is Option 4K"]
            },
        ]

    generateRandomOrder(); // Generer en tilfeldig rekkefølge etter å ha lastet data
    loadQuestion(); // Når data er lastet, vis første spørsmål
    document.getElementById('test-questions-emergency').remove()
}

function shuffleArray(array) {
for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
}
}

let questionOrder = []; // Array for å holde på tilfeldig rekkefølge av indekser

// Generer en tilfeldig rekkefølge når JSON-dataene er lastet
function generateRandomOrder() {
    questionOrder = [...jsonData.keys()]; // Opprett en array med indekser
    shuffleArray(questionOrder); // Bland rekkefølgen tilfeldig
}

// Funksjon for å vise spørsmål og alternativer
function loadQuestion() {
    if (questionOrder.length > 0 && currentQuestionIndex < questionOrder.length) {
        const questionIndex = questionOrder[currentQuestionIndex];
        const currentQuestion = jsonData[questionIndex];
        const questionEl = document.getElementById('question');
        const optionsEl = document.getElementById('options');
        const feedbackEl = document.getElementById('feedback');
        const correctAnswerEl = document.getElementById('correct-answer');
        questionEl.textContent = currentQuestion.question;
        optionsEl.innerHTML = ''; // Fjern tidligere alternativer
        feedbackEl.textContent = ''; // Fjern tidligere tilbakemelding
        correctAnswerEl.textContent = '';
        let answers = jsonData[questionOrder[currentQuestionIndex]].answer
        console.log("IS mc obj? ")
        console.log(typeof(answers) === "object")
        if (typeof(answers) === "object") {
            multipleChoiceQues = true
            displayMcTag(true)
            correctAnswers = []
            for (let a in jsonData[questionOrder[currentQuestionIndex]].answer) {
                correctAnswers.push(jsonData[questionOrder[currentQuestionIndex]].answer[a])
            }
            
        }
        else {
            displayMcTag(false)
            multipleChoiceQues = false
            correctAnswers = [jsonData[questionOrder[currentQuestionIndex]].answer];
        }
        console.log("Answers: " + answers)
        console.log("Answers2: " + correctAnswers)


        currentQuestion.options.forEach(option => {
        const li = document.createElement('li');
        li.textContent = option;
        li.addEventListener('click', () => SelectOption(option, li, multipleChoiceQues));
        optionsEl.appendChild(li);
        });
    }
}

function displayMcTag(status) {
        let McTag = document.getElementById("isMc")
    if (status) {
        McTag.style.display = "block"
    } else {
        McTag.style.display = "none"
    }
}

function loadNextQuestion() {
    if (currentQuestionIndex < questionOrder.length - 1) {
        currentQuestionIndex++;
        userAnswers = [];
        points += questionPointsToAdd
        document.getElementById("points").innerText = "Poeng: " + points
        loadQuestion();
    } else {
        alert('Dette var det siste spørsmålet i quizen!');
    }
}

function finishQuiz() {
    let quizCard = document.getElementById("quiz-card")
    let restartMenu = document.getElementById("restart-quiz-button")

    quizCard.classList.add("hidden")
    restartMenu.classList.remove("hidden")
}

function RestartQuiz() {
    currentQuestionIndex = 0;
    correctAnswers = [];
    multipleChoiceQues = false
    points = 0
    questionPointsToAdd = 0
}

// Funksjon for å håndtere valg av et alternativ
function SelectOption(option, li, mc = false) {

    const optionsEl = document.getElementById('options');
    let alreadyThere = userAnswers.includes(option) ? true : false
    
    if (!mc) // not multiple choice, single answer
    {
        Array.from(optionsEl.children).forEach(child => {
            child.classList.remove('selected', 'correct', 'incorrect');
            child.style.backgroundColor = ''; // Fjern bakgrunnsfarge
            child.style.border = ''; // Fjern border
        });
    }

    console.log("MULTIPLE CHOICE" + mc)
    if (!alreadyThere) {
        if (!mc) {
            userAnswers = []
        }
        userAnswers.push(option); // Lagre det valgte svaret
    }
    else {
        
        if (!mc) {
            userAnswers = []
        } else
            userAnswers.pop(option)
    }


    if (!alreadyThere) {
        li.classList.add('selected');
        li.style.border = '2px solid #4F38FF';
    } else {
        li.classList.remove('selected', 'correct', 'incorrect');
        li.style.backgroundColor = ''; // Fjern bakgrunnsfarge
        li.style.border = '';
    }
    console.log(userAnswers)
}

// Funksjon for å sjekke svaret når brukeren sender det inn
function checkAnswer() {
    const feedbackEl = document.getElementById('feedback');
    const correctAnswerEl = document.getElementById('correct-answer');
    const optionsEl = document.getElementById('options');
    const currentQuestion = jsonData[questionOrder[currentQuestionIndex]]; // Hent nåværende spørsmål

    console.log("Here is the answerlist")
    console.log(correctAnswers)

    Array.from(optionsEl.children).forEach(li => { //MARKER RIKTIG I GRØNT
        li.style.border = '';
        if (correctAnswers.includes(li.textContent)) {
            li.style.backgroundColor = '#83FF77'; // Grønn bakgrunn for riktig svar
        }
    });

    questionPointsToAdd = 0
    let isCorrect = false
    let amountCorrect = 0
    let amountWrong = 0

    console.log("Har bruker svart?")
    console.log(userAnswers.length > 0 ? "ja" : "nei")
    console.log("Multiplechoice?")
    console.log(multipleChoiceQues ? "ja" : "nei")

    if (userAnswers.length > 0) {
        if (multipleChoiceQues) {
            for (let answer in userAnswers) {
                console.log("userAnswer X = " + correctAnswers[answer])
                console.log("userAnswer X = " + answer)
                console.log("Har bruker svart riktig?")
                if (userAnswers.includes(correctAnswers[answer])) {
                    console.log("ja")
                    amountCorrect++
                    questionPointsToAdd += 1
                } else {
                    console.log("nei")
                    amountWrong++
                    if (questionPointsToAdd > 0)
                        questionPointsToAdd -= 1
                }
            }

            if (amountCorrect == correctAnswers.length) {
                isCorrect = true
            }
            console.log("Har bruker svart riktig på alle spørsmål?")
            console.log(amountCorrect == correctAnswers.length ? "ja" : "nei")
            

        } else if (userAnswers[0] === correctAnswers[0]) {
            isCorrect = true
            questionPointsToAdd = 1
        } else {
            isCorrect = false
        }
    } // skip the whole thing if no answer given

    console.log("Har bruker svart riktig på alle spørsmål?")
    console.log(isCorrect ? "ja" : "nei")
    console.log("Hvis ja, da bør bruker få mer enn 0 poeng:")
    console.log(questionPointsToAdd)

    if (isCorrect) {
        feedbackEl.textContent = 'Riktig!';
        feedbackEl.style.color = '#00ff00';
    } else if (amountWrong > 0 && amountCorrect > 0) {
        feedbackEl.textContent = 'Miks!';
        feedbackEl.style.color = '#ffd000ff';
    } else {
        feedbackEl.textContent = 'Feil';
        feedbackEl.style.color = '#ff0000';
        // Finn og marker det feil valgte svaret
        
    }

    if (userAnswers.length > 0 && (!isCorrect || amountWrong > 0)) {
        Array.from(optionsEl.children).forEach(li => {
        if (userAnswers.includes(li.textContent)) {
            if (correctAnswers.includes(li.textContent)) //its the correct answer 
            {
            }
            else {
                li.style.backgroundColor = '#FF7783'; // Rød bakgrunn for feil svar
            }
        }
        });
    }

    console.log(questionPointsToAdd)
    

    correctAnswerEl.textContent = 'Riktig svar: ' + currentQuestion.answer + ".\nPoints gotten: " + questionPointsToAdd + " / " + correctAnswers.length + " possible";
}



document.addEventListener("DOMContentLoaded", function() {
    getExam();
    document.getElementById('next').addEventListener('click', loadNextQuestion);
    document.getElementById('submit').addEventListener('click', checkAnswer);
});