const boxes = document.querySelectorAll(".box");
const timer = document.querySelector(".time");
const wintext = document.querySelector(".win-text");

let timerStarted = false;
let timerStart = 0;

const PLAYERS = {
    BOT: -1,
    HUMAN: 1,
}

const getBlockingMove = () => {
    for (let i = 0; i < 9; i += 3) {
        if (boxes[i].dataset.player === '1'
            && boxes[i + 1].dataset.player === '1'
            && !boxes[i + 2].dataset.player) {
            return i + 2;
        }
        if (boxes[i].dataset.player === '1'
            && !boxes[i + 1].dataset.player
            && boxes[i + 2].dataset.player === '1') {
            return i + 1;
        }
        if (!boxes[i].dataset.player
            && boxes[i + 1].dataset.player === '1'
            && boxes[i + 2].dataset.player === '1') {
            return i;
        }
    }

    for (let i = 0; i < 3; i++) {
        if (boxes[i].dataset.player === '1'
            && boxes[i + 3].dataset.player === '1'
            && !boxes[i + 6].dataset.player) {
            return i + 6;
        }
        if (boxes[i].dataset.player === '1'
            && !boxes[i + 3].dataset.player
            && boxes[i + 6].dataset.player === '1') {
            return i + 3;
        }
        if (!boxes[i].dataset.player
            && boxes[i + 3].dataset.player === '1'
            && boxes[i + 6].dataset.player === '1') {
            return i;
        }
    }

    if (boxes[0].dataset.player === '1'
        && boxes[4].dataset.player === '1'
        && !boxes[8].dataset.player) {
        return 8;
    }
    if (boxes[0].dataset.player === '1'
        && !boxes[4].dataset.player
        && boxes[8].dataset.player === '1') {
        return 4;
    }
    if (!boxes[0].dataset.player
        && boxes[4].dataset.player === '1'
        && boxes[8].dataset.player === '1') {
        return 0;
    }
    if (boxes[2].dataset.player === '1'
        && boxes[4].dataset.player === '1'
        && !boxes[6].dataset.player) {
        return 6;
    }
    if (boxes[2].dataset.player === '1'
        && !boxes[4].dataset.player
        && boxes[6].dataset.player === '1') {
        return 4;
    }
    if (!boxes[2].dataset.player
        && boxes[4].dataset.player === '1'
        && boxes[6].dataset.player === '1') {
        return 2;
    }

    return null;
}

const botTurn = () => {
    handleTimer();

    uncheckedBoxes = Array.from(boxes).filter(box => !box.dataset.player);
    if (uncheckedBoxes.length == 0) {
        wintext.innerHTML = "Draw!";
        resetBoard();
        return;
    }

    let move = getBlockingMove(uncheckedBoxes);
    if (!move) {
        console.log(1)
        move = Math.floor((Math.random() * uncheckedBoxes.length));
        uncheckedBoxes[move].dataset.player = PLAYERS.BOT;
    } else {
        console.log(2)
        boxes[move].dataset.player = PLAYERS.BOT;
    }

    let win = checkForWin();
    if (win != 0) {
        if (win == 1) {
            wintext.innerHTML = "You won!"
        } else {
            wintext.innerHTML = "You lost!"
        }
        resetBoard();
    }
}

const resetBoard = () => {
    timerStarted = false;

    boxes.forEach((box) => {
        delete box.dataset.player;
    })

    handleTimer();
}

const handleTimer = () => {
    timer.dataset.active = timerStarted;

    if (!timerStarted) {
        timer.innerHTML = "00:00"
        return;
    }

    const timeInSeconds = (Date.now() - timerStart) / 1000;

    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = Math.round(timeInSeconds % 60)

    if (minutes <= 9) {
        minutes = "0" + minutes;
    }

    if (seconds <= 9) {
        seconds = "0" + seconds;
    }

    timer.innerHTML = `${minutes}:${seconds}`
}
let timerInterval = setInterval(handleTimer, 1000);

const checkForWin = () => {
    const winningCombinations = [
        // Rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Diagonals
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (
            boxes[a].dataset.player === boxes[b].dataset.player &&
            boxes[a].dataset.player === boxes[c].dataset.player &&
            boxes[a].dataset.player
        ) {
            return boxes[a].dataset.player;
        }
    }

    return 0;
}

boxes.forEach((box) => {
    box.addEventListener("click", (e) => {
        const box = e.target;
        e.preventDefault();

        if (box.dataset.player) {
            return;
        }

        if (!timerStarted) {
            timerStarted = true;
            timerStart = Date.now()
        }

        box.dataset.player = PLAYERS.HUMAN;
        let win = checkForWin();

        if (win == 0) {
            botTurn();
        } else {
            if (win != 0) {
                if (win == 1) {
                    wintext.innerHTML = "You won!"
                } else {
                    wintext.innerHTML = "You lost!"
                }
                resetBoard();
            }
            resetBoard();
        }
    });
})

handleTimer();