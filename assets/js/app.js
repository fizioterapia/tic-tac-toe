const boxes = document.querySelectorAll(".box");
const timer = document.querySelector(".time");

let timerStarted = false;
let timerStart = 0;

const PLAYERS = {
    BOT: -1,
    HUMAN: 1,
}

const botTurn = () => {
    handleTimer();
    
    uncheckedBoxes = [];
    boxes.forEach((box) => {
        if (!box.dataset.player) {
            uncheckedBoxes.push(box);
        }
    })

    if (uncheckedBoxes.length == 0) {
        resetBoard();
        return;
    }

    uncheckedBoxes[Math.floor((Math.random() * uncheckedBoxes.length))].dataset.player = PLAYERS.BOT;

    let win = checkForWin();
    if (win != 0) {
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

        if(box.dataset.player) {
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
            resetBoard();
        }
    });
})

handleTimer();