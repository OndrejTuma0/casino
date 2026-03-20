const size = 5 // 5x5
const mines = 5

let money = 1000
let betMultiplier = 1
let betAmount = 0

let mineGrid = document.querySelector(".mines")
let betMultiplierLabel = document.querySelector(".bet__multiplier")
let startMinesButton = document.getElementById("startMines")
let cashoutButton = document.getElementById("cashout")

for (let x = 0; x < size*size; x++) {
    mineGrid.innerHTML += `<div class="mines__tile"></div>`
}

function startMines(size, mines) {
    let minesPlaced = 0
    let mineArr = []

    for (let x = 0; x < size; x++) {
        let row = []
        for (let y = 0; y < size; y++) row.push(0)
        mineArr.push(row)
    }

    while (minesPlaced < mines) {
        let row = Math.floor(Math.random() * 4)
        let column = Math.floor(Math.random() * 4)
        let tile = mineArr[row][column]

        if (tile == 0) {
            mineArr[row][column] = 1
            minesPlaced += 1
        }
    }

    betMultiplier = 1
    betMultiplierLabel.textContent = `${betMultiplier}x`

    mineGrid.classList.remove("locked")
    mineGrid.style.gridTemplateColumns = `repeat(${size}, 1fr)`
    mineGrid.innerHTML = ""
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            mineGrid.innerHTML += `<div class="mines__tile" id="${x},${y}"></div>`
        }
    }

    startMinesButton.classList.add("locked")
    cashoutButton.classList.remove("locked")

    document.querySelectorAll(".mines__tile").forEach((mine) => {
        mine.addEventListener("click", () => {
            let pos = mine.id.split(",")
            if (mineArr[pos[0]][pos[1]] == 1) {
                mine.style.backgroundColor = "red"
                endMines()
            } else {
                if (mine.style.backgroundColor !== "green") {
                    mine.style.backgroundColor = "green"
                    betMultiplier += 0.2;
                    betMultiplier = Number(betMultiplier.toFixed(2))
                    betMultiplierLabel.textContent = `${betMultiplier}x`
                }
            }
        })
    })
}

function endMines() {
    cashoutButton.classList.add("locked")
    startMinesButton.classList.remove("locked")
    mineGrid.classList.add("locked")
    betAmount = 0
}

startMinesButton.addEventListener("click", () => {
    let betInput = document.querySelector(".bet__input").value
    if (!isNaN(betInput) && betInput > 0) {
        startMines(size, mines)
        betAmount = betInput
        money -= betInput
        document.querySelector(".money").textContent = `Money: ${money}`
    }
})

cashoutButton.addEventListener("click", () => {
    money += betAmount * betMultiplier
    endMines()
    document.querySelector(".money").textContent = `Money: ${money}`
})