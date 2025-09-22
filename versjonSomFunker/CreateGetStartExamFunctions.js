function StartExam() {
    countdownvalue = document.getElementById("use-countdown-checkbox").checked
    countDownTimer = parseInt(document.getElementById("countdown-number-field").value)
    oppgaveCount = parseInt(document.getElementById("amount-tasks-checkbox").value)
    infiniteOppgaver = document.getElementById("infinite-oppgaver-checkbox").checked
    canGivePointsDuringExam = document.getElementById("give-points-checkbox").checked

    if (countdownvalue && countDownTimer > 0) {
        startCountDown(countDownTimer)
        document.getElementById("exam-timer").innerHTML = "Tid igjen: " + countDownTimer;
    } else {
        document.getElementById("exam-timer").style.display = "none"
    }
    if (infiniteOppgaver) {
        document.getElementById("question-select-container").classList.remove("hide")
        document.getElementById("neste-spørsmål").addEventListener("click", GetRandomQuestion)
        document.getElementById("forrige-spørsmål").classList.add("hide")
    } else {
        document.getElementById("question-select-container").classList.add("hide")
        document.getElementById("neste-spørsmål").addEventListener("click", NesteSpørsmål)
        document.getElementById("forrige-spørsmål").classList.remove("hide")
        CreateExam(oppgaveCount)
        FindQuestionElements()

    }
    if (canGivePointsDuringExam) {
        document.getElementById("points-field").classList.remove("hide")
    } else {
        document.getElementById("points-field").classList.add("hide")
    }
    currentQuestion = 0
    visVindu()
    UpdateQuestion();
    updateNavigationButtons()
}

async function getExam() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", jsonFileURL, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            jsonData = JSON.parse(xhr.responseText);
            //callback(jsonData2); // Pass the data to the callback
            console.log(jsonData)
        }
    }
    xhr.send();
}
function CreateExam(count) {
    Reset()
    if (jsonData === undefined) {
        getExam()
    }
    console.log(jsonData)
    console.log(jsonData["HTML"].question)
    var temalength = Object.keys(jsonData).length;
    let listofindexes = [];
    Object.keys(jsonData).forEach((tema) => {
        listofindexes.push(jsonData[tema].length);
    });
    let newList = generateList(count, listofindexes);
    console.log(newList)
    questionIndexList = [] //list of questions using indexesse ehehehehe
    let totalElements = 0; //user inputs this, but we double check with a forloop
    var childindex = 0
    var question = 1
    var list = document.querySelector("#question-select-container")
    list.innerHTML = ""

    Object.entries(newList).forEach(([childIndex, childArray]) => {
        var childChildIndex = 0;
        totalElements += childArray.length; // Adding the length of each array to the total
        childArray.forEach((chi) => {
            var element = `<li class="question-box-element" datatype="y:[${childIndex}] x:[${childChildIndex}]" datakey="${question-1}">${question}</li>`;
            list.innerHTML += element;
            questionIndexList[question - 1] = {
                y: childIndex,
                x: chi
            };
            childChildIndex++;
            question++;
        });
    });
    console.log(questionIndexList)
    console.log(totalElements)
    DisplayQuestion()
    updateNavigationButtons();
}
function generateList(count, listofindexes) {
    let newCount = count;
    let failedAttempts = 0;
    let listo = {};

    for (let i = 0; i < newCount; i++) {
        const randomTemaIndex = Math.floor(Math.random() * listofindexes.length);
        const randomObjectIndex = Math.floor(Math.random() * listofindexes[randomTemaIndex]);

        if (!listo[randomTemaIndex]) {
            listo[randomTemaIndex] = [];
        }

        if (!listo[randomTemaIndex].includes(randomObjectIndex)) {
            listo[randomTemaIndex].push(randomObjectIndex);
        } else {
            if (failedAttempts < 200) {
                newCount++;
            } else {
                console.error("TOO MANY FAILED ATTEMPTS!");
                return {};
            }
            failedAttempts++;
        }
    }
    return listo;
}