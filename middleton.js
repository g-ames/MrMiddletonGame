// ＭＲ　ＭＩＤＤＬＥＴＯＮ　－－　ｔｈｅ　ｇａｍｅ！！！

window.speechSynthesis.getVoices() // for some reason this allows the voices to load later...?

const IS_FIREFOX = navigator.userAgent.toLowerCase().includes('firefox');
var MT_VOICE = 23;
// const MT_VOICE = 15;

var middletonianDescriptions = [
    "So the first problem we'll be looking at is '[PROBLEM]'. [SOLUTION]",
    "The following is our problem: '[PROBLEM]'. Remember guys, try to cook. [SOLUTION]",
    "'[PROBLEM]'. [SOLUTION]"
];

function genN(num) {
    var number = Math.round(Math.random() * num);
    if (number == 1) { return ''; }
    return `${Math.floor(Math.random() * 4) == 2 ? "-" : "+"}${number.toString()}`;
}

function generatePolynomial() {
    var problems = [
        `${genN(10)}`,
        `${genN(10)}x^3 + ${genN(10)}x^2 + ${genN(10)}`,
        `${genN(10)}x^4 + ${genN(10)}x^3 + ${genN(10)}`
    ];

    return problems[Math.floor(Math.random() * problems.length)];
}

function generateProblem() {
    var problem = {};

    problem.solution = "";
    problem.text = "...";

    var problemType = Math.floor(Math.random() * 2);

    if (problemType == 0) {
        problem.mode += "polynomial-";

        var polynomialType = Math.floor(Math.random() * 1);
        if (polynomialType == 0) {
            problem.mode += "summation";
            problem.text = `Find the sum of: (${generatePolynomial()}) + (${generatePolynomial()})`;
        } else if (polynomialType == 1) {
            problem.mode += "multiplication";
            problem.text = `Multiply the two polynomials: (${generatePolynomial()})(${generatePolynomial()})`;
        }
    } else if (problemType == 1) {
        problem.mode += "radicals";
    }

    problem.text = problem.text.replaceAll("  ", " ").replaceAll("( ", "(").replaceAll(" )", ")").replaceAll("+ +", "+").replaceAll("(+", "(").replaceAll("+)", ")");

    return problem;
}

function middletonize(problem) {
    var desc = middletonianDescriptions[Math.floor(Math.random() * middletonianDescriptions.length)];
    var solution = "";

    if (problem.mode.includes("polynomial")) {
        if (!problem.text.includes("^")) {
            solution += `This problem is very simple because there are no exponents, so we won't have to deal with any of that. `;
        } else {
            solution += `And so we can start by making sure that all of the like terms are in order. This means that the exponent x squared would come before x which would also come before any constants. `;
        }

        if (problem.mode.includes("summation")) {
            if (!problem.text.includes("^")) {
                solution += "Mr Middleton is now angry due to the problem's simplicity. "
            }

            solution += `All we have to do is add what we have together, and so to do that we take the like terms are added together: 4x^2 would get added to x^2, for example. `;
        }
    } else {
        solution += "MR MIDDLETON DOES NOT UNDERSTAND THIS PROBLEM. DESTRUCTION IMMINENT."
    }

    solution += `${" ".repeat(50)}${groomer.generate()}`

    return `${desc.replaceAll("[PROBLEM]", problem.text).replaceAll("[SOLUTION]", solution)}`;
}

function middletonSays(txt) {
    var sentences = txt.split(".");
    var sentenceIndex = 0;

    console.log(sentences);

    function nextSentence() {
        console.log("NCTX");

        if(typeof sentences[sentenceIndex] == "undefined") {
            return;
        }
        
        sentenceIndex++;

        let currentSentence = sentences[sentenceIndex];
        if (!IS_FIREFOX) {
            window.speechSynthesis.cancel();
            if (currentSentence == "") { nextSentence(); }
            MT_VOICE = Math.floor(Math.random() * 25);
            console.log(currentSentence)
            var utterance = new SpeechSynthesisUtterance(currentSentence);
    
            // utterThis.pitch = 1;
            // utterThis.rate = rate.value;
    
            utterance.voice = window.speechSynthesis.getVoices()[MT_VOICE];
            utterance.pitch = 1;
            utterance.rate = 1;
    
            utterance.onend = function () {
                console.log("MR MIDDLETON HAS FINISHED SPEAKING.")
                nextSentence();
            }
    
            utterance.onboundary = function () {
                console.log("BOUNDARY!");
            }
    
            utterance.onerror = function (e) {
                console.log(e)
                console.log("MIDDLETON TTS ERROR!");
                if(e.error == "interrupted") {
                    return;
                }
                nextSentence();
            }
    
            utterance.onstart = function () {
                console.log("MIDDLETON SPEECH STARTED.");
            }
    
            window.speechSynthesis.speak(utterance);
        }
    }

    nextSentence();
}

function middletonianWorkthrough() {
    var problem = generateProblem();

    // Make mr middleton talk!!!
    // Does not support firefox unfortunately....

    var middletonized = middletonize(problem);
    // middletonSays(middletonized);

    return {
        solution: middletonized,
        raw: problem
    };
}