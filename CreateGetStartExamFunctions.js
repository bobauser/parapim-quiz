function StartExam() {
    countdownvalue = document.getElementById("use-countdown-checkbox").checked
    countDownTimer = parseInt(document.getElementById("countdown-number-field").value)
    console.log(countdownvalue)
    console.log(countDownTimer)
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
    loadQuestion();
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
    let newList = generateList(count)
    console.log(newList)
    questionIndexList = []
    let totalElements = newList.length; //user inputs this, but we double check with a forloop
    var childindex = 0
    var question = 1
    var list = document.querySelector("#question-select-container")
    list.innerHTML = ""

    newList.forEach((question, index) => { //datatype index til spørsmål, datakey index til spørsmål liste
        var element = `<li class="question-box-element" datakey="${index}" datatype="${question}">${index + 1}</li>`;
        list.innerHTML += element;
        questionIndexList[index] = question;
        question++;
    });
    console.log(questionIndexList)
    console.log(totalElements)
    DisplayQuestion()
    updateNavigationButtons();
}