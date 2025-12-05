let jsonFileURL = "multiplechoice.json"
let jsonData = [];
let userAnswers = [];
let currentQuestionIndex = 0;
let correctAnswers = [];
let multipleChoiceQues = false
let potentialPoints = 0
let points = 0
let questionPointsToAdd = 0
let oppgavenummer = 0

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
    // console.log("Ok, lets try to get the quiz")
    try {
    //   const response = await fetch('multiplechoice.json');
        const response = await fetch(jsonFileURL);
        // console.log("Here is the response")
        // console.log(response)
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        jsonData = await response.json();
        generateRandomOrder(); // Generer en tilfeldig rekkefølge etter å ha lastet data
        loadQuestion(); // Når data er lastet, vis første spørsmål
        let emergencybutton = document.getElementById('test-questions-emergency')
        if (emergencybutton)
            emergencybutton.remove()
    } catch (error) {
        console.error('Could not load the JSON data: ', error);
        let respBar = document.querySelector(".response-bar")
        let buttonToCreateTests = document.createElement("button")
        buttonToCreateTests.id = "test-questions-emergency"
        buttonToCreateTests.innerText = "JSON couldn't load, try test questions?"

        respBar.appendChild(buttonToCreateTests)

        document.getElementById('test-questions-emergency').addEventListener('click', loadTestData);
        document.getElementById('restart-quiz-button').addEventListener('click', RestartQuiz);
        
    }
}

function loadTestData () {
    jsonFileURL = "test"
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
    let emergencybutton = document.getElementById('test-questions-emergency')
    if (emergencybutton)
        emergencybutton.remove()
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
        // console.log("IS mc obj? ")
        // console.log(typeof(answers) === "object")
        if (typeof(answers) === "object") {
            multipleChoiceQues = true
            displayMcTag(true)
            correctAnswers = []
            for (let a in jsonData[questionOrder[currentQuestionIndex]].answer) {
                correctAnswers.push(jsonData[questionOrder[currentQuestionIndex]].answer[a])
            }
            potentialPoints += correctAnswers.length
            
        }
        else {
            displayMcTag(false)
            multipleChoiceQues = false
            potentialPoints += 1
            correctAnswers = [jsonData[questionOrder[currentQuestionIndex]].answer];
        }
        // console.log("Answers: " + answers)
        // console.log("Answers2: " + correctAnswers)


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
    console.log("Poeng totalt oppnnådd")
    console.log(points)
    userAnswers = [];
    points += questionPointsToAdd
    document.getElementById("points").innerText = poengTekst()
    questionPointsToAdd = 0
    oppgavenummer += 1

    if (currentQuestionIndex < questionOrder.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        finishQuiz()
        // alert('Dette var det siste spørsmålet i quizen!');
    }
}

function finishQuiz() {
    let quizCard = document.getElementById("quiz-card")
    let restartMenu = document.getElementById("restart-card")
    let pointsFinish = document.getElementById("finished-quiz-points")

    quizCard.classList.add("hidden")
    restartMenu.classList.remove("hidden")

    pointsFinish.innerText = "Poeng: " + points + " / " + potentialPoints + " mulige poeng"
}

function RestartQuiz() {
    
    let quizCard = document.getElementById("quiz-card")
    let restartMenu = document.getElementById("restart-card")

    if (jsonFileURL === "test") {
        loadTestData()
    } else {
        getExam()
    }

    quizCard.classList.remove("hidden")
    restartMenu.classList.add("hidden")

    currentQuestionIndex = 0;
    correctAnswers = [];
    multipleChoiceQues = false
    points = 0
    questionPointsToAdd = 0
    potentialPoints = 0
    document.getElementById("points").innerText = poengTekst()
    generateRandomOrder(); // Generer en tilfeldig rekkefølge etter å ha lastet data
    loadQuestion(); // Når data er lastet, vis første spørsmål
}

// Funksjon for å håndtere valg av et alternativ
function SelectOption(option, li, mc = false) {

    const optionsEl = document.getElementById('options');
    let alreadyThere = userAnswers.includes(option) ? true : false
    
    if (!mc) // not multiple choice, single answer
    {
        Array.from(optionsEl.children).forEach(child => {
            child.classList.remove('selected', 'correct', 'incorrect');
        });
        userAnswers = [];
    }

    console.log("MULTIPLE CHOICE" + mc)
    if (!alreadyThere) {
        userAnswers.push(option);
        li.classList.add('selected');
    } else if (mc) {
        userAnswers = userAnswers.filter(a => a !== option);
        li.classList.remove('selected', 'incorrect');
    } else {
        userAnswers = [];
        li.classList.remove('selected', 'incorrect');
    }
    // li.classList.remove('selected', 'correct', 'incorrect');
    
}

// Funksjon for å sjekke svaret når brukeren sender det inn
function checkAnswer() {
    const feedbackEl = document.getElementById('feedback');
    const correctAnswerEl = document.getElementById('correct-answer');
    const optionsEl = document.getElementById('options');
    const currentQuestion = jsonData[questionOrder[currentQuestionIndex]]; // Hent nåværende spørsmål

    // console.log("Here is the answerlist")
    // console.log(correctAnswers)

    Array.from(optionsEl.children).forEach(li => { //MARKER RIKTIG I GRØNT
        li.style.border = '';
        if (correctAnswers.includes(li.textContent)) {
            // li.style.backgroundColor = '#83FF77'; // Grønn bakgrunn for riktig svar
            li.classList.add("correct")
        }
    });

    questionPointsToAdd = 0
    let isCorrect = false
    let amountCorrect = 0
    let amountWrong = 0

    // console.log("Har bruker svart?")
    // console.log(userAnswers.length > 0 ? "ja" : "nei")
    // console.log("Multiplechoice?")
    // console.log(multipleChoiceQues ? "ja" : "nei")

    if (userAnswers.length > 0) {
        if (multipleChoiceQues) {

            for (let ans of userAnswers) {
                if (correctAnswers.includes(ans)) {
                    amountCorrect++;
                    questionPointsToAdd++;
                } else {
                    amountWrong++;
                    questionPointsToAdd--;
                }
            }

            if (questionPointsToAdd < 0)
                questionPointsToAdd = 0;

            isCorrect = (amountCorrect === correctAnswers.length && amountWrong === 0);
            // console.log("Har bruker svart riktig på alle spørsmål?")
            // console.log(amountCorrect == correctAnswers.length ? "ja" : "nei")
            

        } else if (userAnswers[0] === correctAnswers[0]) {
            isCorrect = true
            questionPointsToAdd = 1
        } else {
            isCorrect = false
            questionPointsToAdd = 0
        }
    } // skip the whole thing if no answer given

    if (questionPointsToAdd < 0)
        questionPointsToAdd = 0

    // console.log("Har bruker svart riktig på alle spørsmål?")
    // console.log(isCorrect ? "ja" : "nei")
    // console.log("Hvis ja, da bør bruker få mer enn 0 poeng:")
    // console.log(questionPointsToAdd)

    if (isCorrect && amountWrong < 1) {
        feedbackEl.textContent = 'Riktig!';
        feedbackEl.style.color = '#00ff00';
    } else if (amountWrong > 0 && amountCorrect > 0) {
        feedbackEl.textContent = 'Miks!';
        feedbackEl.style.color = '#ffd000ff';
    } else if (amountCorrect > 0 && amountWrong === 0 && !isCorrect) {
        feedbackEl.textContent = 'Æsj! Du bommet!';
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
                // li.style.backgroundColor = '#FF7783'; // Rød bakgrunn for feil svar
                li.classList.add("incorrect")

            }
        }
        });
    }

    console.log("Poeng som ble oppnnådd")
    console.log(questionPointsToAdd)
    

    correctAnswerEl.textContent = 'Riktig svar: ' + currentQuestion.answer + ".\nPoeng oppnådd: " + questionPointsToAdd + " / " + correctAnswers.length + " mulige";
}

function poengTekst() {
    return "Poeng: " + points + " / " + potentialPoints
}



document.addEventListener("DOMContentLoaded", function() {
    getExam();
    document.getElementById('next').addEventListener('click', loadNextQuestion);
    document.getElementById('submit').addEventListener('click', checkAnswer);
});