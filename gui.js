function strChunk(string, chunkSize) {
    let cchunk = "";
    let chunks = [];
    string.split("").forEach(c => {
        cchunk += c;
        if(cchunk.length > chunkSize) {
            chunks.push(cchunk);
            cchunk = "";
        }
    });
    if(cchunk.length != 0) {
        chunks.push(cchunk);
    }
    return chunks;
}

class Vector2 {
    constructor(X, Y) {
        if (X != undefined && Y == undefined) {
            this.X, this.Y = X, X; // init both X and Y based on X
        } else {
            this.X = X == undefined ? 0 : X;
            this.Y = Y == undefined ? 0 : Y;
        }
    }
}

class Dim {
    constructor(Xpercent, Xpx, Ypercent, Ypx) {
        this.Percent = new Vector2(Xpercent, Ypercent);
        this.Pixels = new Vector2(Xpx, Ypx);
    }

    vectorize(offsetVector) {
        offsetVector = offsetVector == undefined ? new Vector2() : offsetVector;
        return new Vector2(
            (this.Percent.X * window.innerWidth) + this.Pixels.X + offsetVector.X,
            (this.Percent.Y * window.innerHeight) + this.Pixels.Y + offsetVector.Y
        );
    }
}

function AABB(rect1, rect2) {
    return (rect1.X < rect2.X + rect2.W &&
        rect1.X + rect1.W > rect2.X &&
        rect1.Y < rect2.Y + rect2.H &&
        rect1.Y + rect1.H > rect2.Y);
}

class GuiNode {
    constructor(parent) {
        this.Position = new Dim(0, 0, 0, 0);
        this.Parent = parent;
        this.Size = new Dim(0, 100, 0, 100);
        this.Children = [];
        this.Color = "gray";
        this.Visible = true;
        this.BeforeRenderCallbacks = [];
        this.AfterRenderCallbacks = [];

        if (parent != undefined) {
            parent.appendChild(this);
        }
    }

    BeforeRender(callback) {
        this.BeforeRenderCallbacks.push(callback);
    }

    AfterRender(callback) {
        this.AfterRenderCallbacks.push(callback);
    }

    render(offsetDimSize, offsetDimPosition) {
        if (!this.Visible) {
            return;
        }

        this.BeforeRenderCallbacks.forEach(callback => {
            callback(this);
        });

        let vectorizedPosition = this.Position.vectorize(offsetDimPosition == undefined ? undefined : offsetDimPosition.vectorize());
        let vectorizedSize = this.Size.vectorize(offsetDimSize == undefined ? undefined : offsetDimSize.vectorize());

        ctx.fillStyle = this.Color;
        ctx.fillRect(vectorizedPosition.X, vectorizedPosition.Y, vectorizedSize.X, vectorizedSize.Y);

        this.Children.forEach(child => {
            child.render();
        });

        this.AfterRenderCallbacks.forEach(callback => {
            callback(this);
        });
    }

    appendChild(item) {
        this.Children.push(item);
    }

    toRect() {
        let vectorizedPosition = this.Position.vectorize();
        let vectorizedSize = this.Size.vectorize();
        return {
            X: vectorizedPosition.X,
            Y: vectorizedPosition.Y,
            W: vectorizedSize.X,
            H: vectorizedSize.Y
        }
    }

    touchingMouse() {
        return (AABB(this.toRect(), {
            X: mousePosition.X,
            Y: mousePosition.Y,
            W: 1,
            H: 1
        }));
    }
}

class TextNode extends GuiNode {
    constructor(parent, Text) {
        super(parent);

        if (this.Text != undefined) {
            this.Text = Text;
        } else {
            this.Text = "TextNode";
        }

        this.TextWrapped = "fit";
        this.TextColor = "black";
        this.TextPosition = new Dim(0, 0, 0, 0);
        this.Font = "50px Arial";

        // this.TextSize = new Dim();

        function fitFont(self) {
            let mainVectorizedSize = self.Size.vectorize();
            
            let maxCharacters = mainVectorizedSize.X / (self.getFontSize() / 2);

            self.Font =  self.Font.replace(`${self.getFontSize()}px`, `20px`);
            let chunks = strChunk(self.Text, maxCharacters);
                
            while(chunks.length * (self.getFontSize() / 1.5) > mainVectorizedSize.Y) {
                self.Font = self.Font.replace(`${self.getFontSize()}px`, `${Math.floor(self.getFontSize()-1)}px`)
            }
        }

        this.BeforeRender(function(self) {
            if(self.TextWrapped == "fit") {
                fitFont(self)
            }
        })

        this.AfterRender(function(self) {
            self.Text = `${self.Text}`;
            // console.log("rendering text...")
            let mainVectorizedSize = self.Size.vectorize();
            
            let lineHeight = self.getFontSize() * 0.9;
            let maxCharacters = mainVectorizedSize.X / (self.getFontSize() / 2);

            // self.TextPosition = new Dim(
            //     0, 
            //     (mainVectorizedSize.X / 2) - ((self.getFontSize() * self.Text.length) / 4),
            //     0,
            //     (mainVectorizedSize.Y / 2) - (self.getFontSize() / 1.5)
            // );
            ctx.fillStyle = self.TextColor;
            ctx.font = self.Font;
            let vectorizedPosition = self.TextPosition.vectorize();
            let mainVectorizedPosition = self.Position.vectorize();
            // ctx.fillText(self.Text, vectorizedPosition.X + mainVectorizedPosition.X, vectorizedPosition.Y + mainVectorizedPosition.Y, self.TextSize.vectorize().X);
            
            if(self.TextWrapped == "fit") {
                // console.log(self.Text)
                fitFont(self);

                let chunks = strChunk(self.Text, maxCharacters);
                
                // while((chunks.length * (self.getFontSize() * 0.9)) > mainVectorizedSize.Y) {
                //     self.Font = self.Font.replace(`${self.getFontSize()}px`, `${self.getFontSize()-1}px`)
                // }

                for(var i = 0; i < chunks.length; i++) {
                    ctx.fillText(
                        chunks[i], 
                        vectorizedPosition.X + mainVectorizedPosition.X, 
                        vectorizedPosition.Y + mainVectorizedPosition.Y + self.getFontSize() + (lineHeight * i), 
                        mainVectorizedSize.X
                    );
                }
            } else {  
                ctx.fillText(
                    self.Text, 
                    vectorizedPosition.X + mainVectorizedPosition.X, 
                    vectorizedPosition.Y + mainVectorizedPosition.Y + self.getFontSize(), 
                    mainVectorizedSize.X
                );
            }
        });
    }

    getFontSize() { 
        return parseFloat(this.Font.split("px")[0]);
    }
}

let globalClickCallbacks = [];

class ButtonNode extends TextNode {
    constructor(parent, Text, callback) {
        super(parent);
        this.Text = Text;
        this.ClickCallbacks = [];

        globalClickCallbacks.push({
            self: this,
            callback: function(self) {
                if (!self.touchingMouse()) { return; }
                if (!self.Parent.Visible || !self.Visible) { return; }

                self.ClickCallbacks.forEach(callback => {
                    callback(mousePosition.X, mousePosition.Y);
                });
            }
        });

        if (callback != undefined) {
            this.ClickCallbacks.push(callback);
        }
    }

    addClickCallback(callback) {
        this.ClickCallbacks.push(callback);
    }
}

class ImageNode extends GuiNode {
    constructor(parent, source) {
        super(parent);
        this.source = source;

        this.AfterRender(function(self) {
            let vectorizedSize = self.Size.vectorize();
            let vectorizedPosition = self.Position.vectorize();

            ctx.drawImage(
                self.source, 
                vectorizedPosition.X,
                vectorizedPosition.Y,
                vectorizedSize.X,
                vectorizedSize.Y
            );
        });
    }
}

let mousePosition = new Vector2();

window.addEventListener("mousemove", function (event) {
    mousePosition.X = event.clientX;
    mousePosition.Y = event.clientY;
});

window.addEventListener("mousedown", function () {
    globalClickCallbacks.forEach(element => {
        element.callback(element.self);
    });
});