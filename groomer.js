const GROOMER_EXPR = [
    "nice",
    "ok",
    "very cool",
    "yay",
    "big",
    "wow",
    "mmmm"
]

const GROOMER_SENTENCE_EXPR = [
    "You are very [EXPR]",
    "Do [EXPR]",
    "You are such [EXPR]",
    "Oh my gosh middleton think [EXPR]",
    "Great good [EXPR]",
    "WONDER[EXPR]",
    "AMAZING[EXPR]",
    "You did so [EXPR]",
    "Such [EXPR]"
]

const GROOMER_EXPR_START = [
    "Well I think [SE]",
    "However, [SE]",
    "That is so! [SE]",
    "Mmmm... oh. [SE]",
    "Like say so [SE]"
]

function randomElement(arr) {
    return  arr[Math.floor(Math.random() * arr.length)];
}

var groomer = {};

groomer.generate_se = function() {
    return randomElement(GROOMER_SENTENCE_EXPR).replace("[EXPR]", randomElement(GROOMER_EXPR));
}

groomer.generate = function() {
    return randomElement(GROOMER_EXPR_START).replace("[SE]", groomer.generate_se())
}