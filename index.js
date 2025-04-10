song = tension;

var timeLeft = 100;
var screens = {};

var problem = {};

async function main() {
    // song = action;
    
    assureSungIs(you_won);

    audio.playSound(500, 50, "sine");

    dialogBox.Text = `Hello. I am Mr. Middleton. I think ${groomer.generate()}`;
    middletonSays("Hello. I am Mr. Middleton.");
    problem = middletonianWorkthrough();
    console.log(problem.solution)
    dialogBox.Text = problem.solution;
}

function createScreen(cc, visible) {
    var screener = new GuiNode(game.gui);

    screener.Size = new Dim(0, 0, 0, 0);
    screener.Position = new Dim(0, 0, 0, 0);
    screener.Visible = visible

    screens[cc] = screener;
}

createScreen("title", true);
createScreen("main", false);

var playButton = new ButtonNode(screens.title, "Play", function () {
    screens.title.Visible = false;
    screens.main.Visible = true;

    main();
});

playButton.TextWrapped = "none";

playButton.BeforeRender(function () {
    if (playButton.touchingMouse()) {
        playButton.Color = "red";
    } else {
        playButton.Color = "gray";
    }
})

playButton.Size = new Dim(0.2, 0, 0.1, 0);
playButton.Position = new Dim(0.7 - 0.1, 0, 0.5 - 0.05, 0);

const howToPlayInstructions = `
This game includes various elements; the multiplcation and addition of polynomials, the simplification of radicals, and much other very interesting Mr. Middleton content in which you do lots of math.


                                      WARNING: THIS GAME MAY CONTAIN NONCHALANT DREADHEADS`;
var howToPlay = new TextNode(screens.title);

howToPlay.Text = howToPlayInstructions;
howToPlay.Size = new Dim(0.5, 0, 0.5, 0);
howToPlay.Position = new Dim(0.05, 0, 0.3, 0);

var titleText = new TextNode(screens.title, "mr middleton game");

titleText.TextWrapped = "none";
titleText.Text = "mr middleton game";
titleText.Size = new Dim(1, 0, 0.1, 0);
titleText.Position = new Dim(0, 0, 0, 0);

// main screen
var dialogBox = new TextNode(screens.main);

dialogBox.BeforeRender(function () {
    if (problem.solution.includes("DOES NOT")) {
        var sinb = Math.sin(+new Date() / 100) * 255;
        var isinb = 255 - sinb;
        dialogBox.Color = `rgb(${sinb}, 0, 0)`;
        dialogBox.TextColor = `rgb(${isinb}, ${isinb}, ${isinb})`;

        if(sinb > 240) {
            audio.playSound(sinb, 50, "sine");

            (async function() {
                if(timeLeft == 100) {
                    var numbers = [];
                    for(var i = 100; i > 0; i--) {
                        numbers.push(i);
                    }
                    middletonSays(`${numbers.join(" ")}`);
                }

                timeLeft -= 1;
                dialogBox.Text = `${timeLeft}`;
            })() 

            if(timeLeft <= 0) {
                audio.playSound(1000, 5000, "triangle");
                audio.playSound(2000, 5000, "triangle");
                audio.playSound(3000, 5000, "triangle");
                audio.playSound(700, 5000, "triangle");
                audio.playSound(1400, 5000, "triangle");
            }
        }
    } else {
        dialogBox.Color = "orange";
        dialogBox.TextColor = "black";
    }
})

dialogBox.Position = new Dim(0, 0, 0.7, 0);
dialogBox.Size = new Dim(1, -300, 0.3, 0);
dialogBox.Color = "orange"
dialogBox.Text = "Hello. I am Mr. Middleton."

var worksheet = new TextNode(screens.main);

worksheet.Size = new Dim(1, 0, 0.4, 0);
worksheet.Position = new Dim(0, 0, 0.1, 0);

worksheet.BeforeRender(function () {
    worksheet.Text = `PROBLEM: ${problem.raw.text}`;
});

var myImage = new Image(100, 100);
myImage.src = "mrmiddleton.jpg";
var dialogImage = new ImageNode(screens.main, myImage);
dialogImage.Size = new Dim(0, 300, 0.3, 0);
dialogImage.Position = new Dim(1, -300, 1 - 0.3, 0);

var nextProblem = new ButtonNode(screens.main, "Next Problem!", function() {
    audio.playSound(500, 50, "sine");
    audio.playSound(1000, 50, "sine");

    middletonSays("Next problem!");

    problem = middletonianWorkthrough();
    console.log(problem.solution)
    dialogBox.Text = problem.solution;
});

nextProblem.BeforeRender(function() {
    if(nextProblem.touchingMouse()) {
        nextProblem.Color = "lightblue"
    } else {
        nextProblem.Color = "blue"
    }
});

nextProblem.Position = new Dim(0, 0, 0, 0);
nextProblem.Size = new Dim(1, 0, 0.1, 0);

var speakButton = new ButtonNode(screens.main, "Middleton Says", function() {
    audio.playSound(500 + Math.random(0, 1000), 50, "sine");
    audio.playSound(1000 + Math.random(0, 1000), 50, "sine");

    middletonSays(problem.solution);
});

speakButton.BeforeRender(function() {
    if(speakButton.touchingMouse()) {
        speakButton.Color = "lightblue"
    } else {
        speakButton.Color = "blue"
    }
});

speakButton.Position = new Dim(0, 0, 0.5, 0);
speakButton.Size = new Dim(0.5, 0, 0.2, 0);

