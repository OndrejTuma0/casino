const size = 5 // 5x5
let mines = 5

let money = 1000
let betMultiplier = 1
let multiplierGrow = 1
let betAmount = 0
let mineArr = []

let mineGrid = document.querySelector(".mines")
let betMultiplierLabel = document.querySelector(".bet__multiplier")
let startMinesButton = document.getElementById("startMines")
let cashoutButton = document.getElementById("cashout")

for (let x = 0; x < size*size; x++) {
    mineGrid.innerHTML += `<div class="mines__tile"></div>`
}

function startMines(size, mines) {
    let minesPlaced = 0
    mineArr = []
    multiplierGrow = 1
    betMultiplier = 1

    for (let x = 0; x < size; x++) {
        let row = []
        for (let y = 0; y < size; y++) row.push(0)
        mineArr.push(row)
    }

    while (minesPlaced < mines) {
        let row = Math.floor(Math.random() * size)
        let column = Math.floor(Math.random() * size)
        let tile = mineArr[row][column]

        if (tile == 0) {
            mineArr[row][column] = 1
            minesPlaced += 1
        }
    }

    betMultiplierLabel.textContent = `${betMultiplier}x (+${(betAmount * betMultiplier).toFixed(2)}$)`

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
            if (mineArr[pos[0]][pos[1]] === 1) {
                mine.style.backgroundColor = "red"
                endMines()
            } else {
                if (mine.style.backgroundColor !== "green") {
                    mine.style.backgroundColor = "green"
                    multiplierGrow += 0.04
                    betMultiplier += ((size**2 / (size**2 - mines)) - 1) * multiplierGrow;
                    betMultiplier = Number(betMultiplier.toFixed(2))
                    betMultiplierLabel.textContent = `${betMultiplier}x (+${(betAmount * betMultiplier).toFixed(2)}$)`
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

    document.querySelectorAll(".mines__tile").forEach((mine) => {
        let pos = mine.id.split(",")
        let row = parseInt(pos[0])
        let col = parseInt(pos[1])
        if (mineArr[row][col] === 1) {
            mine.style.backgroundColor = "red"
        } else {
            mine.style.backgroundColor = "green"
        }
    })
}

startMinesButton.addEventListener("click", () => {
    let betInput = parseFloat(document.querySelector(".bet__input").value)
    let mineInput = parseInt(document.querySelector(".mines__input").value)
    if (!isNaN(betInput) && betInput > 0 && !isNaN(mineInput) && mineInput > 0 && betInput <= money && mineInput < size**2) {
        mines = mineInput
        betAmount = betInput
        startMines(size, mines)
        money -= betInput
        document.querySelector(".money").textContent = `Money: ${money.toFixed(2)}$`
    }
})

cashoutButton.addEventListener("click", () => {
    money += betAmount * betMultiplier
    endMines()
    document.querySelector(".money").textContent = `Money: ${money.toFixed(2)}$`
})