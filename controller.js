var game = {};
game.screenCenter = {};
game.gui = new GuiNode(); // create the root GuiNode
game.gui.Size = new Dim(1, 0, 1, 0); // fullscreen
game.gui.Color = "white";

var canvas = document.createElement("canvas");
canvas.style = `
position: absolute;
top: 0px;
left: 0px;`;
document.body.appendChild(canvas);

function scaleCanvas() {
    canvas.width = window.innerWidth - 1;
    canvas.height = window.innerHeight - 1;
    game.screenCenter = {
        X: canvas.width / 2,
        Y: canvas.height / 2
    }
}

scaleCanvas();

window.onresize = scaleCanvas;

var ctx = canvas.getContext("2d");

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    game.gui.render();

    requestAnimationFrame(update);
}

requestAnimationFrame(update);