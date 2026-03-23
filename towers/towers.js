let towersGrid = document.querySelector(".towers")
let startButton = document.getElementById("startTowers")
let cashoutButton = document.getElementById("cashout")
let difficulties = document.querySelector(".towers__difficulties")
let betMultiplierLabel = document.querySelector(".bet__multiplier")

const size = 6

let money = 1000
let betAmount = 0
let betMultiplier = 1
let betMultiGrow = 0
let difficulty = "easy"
let towerArr = []
let stage = 0

function drawTower() {
    let cols = difficulty === "normal" ? 2 : 3
    towersGrid.innerHTML = ""
    for (let x = size-1; x >= 0; x--) {
        let row = document.createElement("div")
        row.classList.add("towers__row")
        if (x !== 0) row.classList.add("locked")
        row.id = `row${x}`
        for (let y = 0; y < cols; y++) {
            let tile = document.createElement("div")
            tile.classList.add("towers__tile")
            tile.id = `${y}`
            row.appendChild(tile)
        }
        towersGrid.appendChild(row)
    }

    document.querySelectorAll(".towers__tile").forEach((tile) => {
        tile.addEventListener("click", () => {
            let id = Number(tile.id)
            if (difficulty == "easy") {
                if (towerArr[stage].includes(id)) {
                    tile.style.backgroundColor = "green"
                    if (stage === size-1) {
                        endTowers(true)
                        return
                    }
                    document.getElementById(`row${stage}`).classList.add("locked")
                    document.getElementById(`row${stage+1}`).classList.remove("locked")
                    stage+=1
                    betMultiplier += betMultiGrow
                    betMultiGrow += 0.2
                    betMultiplier = Number(betMultiplier.toFixed(2))
                    betMultiplierLabel.textContent = `${betMultiplier}x (+${(betAmount * betMultiplier).toFixed(2)}$)`
                } else {
                    tile.style.backgroundColor = "red"
                    endTowers(false)
                }
            } else {
                if (id === towerArr[stage]) {
                    tile.style.backgroundColor = "green"
                    if (stage === size-1) {
                        endTowers(true)
                        return
                    }
                    document.getElementById(`row${stage}`).classList.add("locked")
                    document.getElementById(`row${stage+1}`).classList.remove("locked")
                    stage+=1
                    betMultiplier += betMultiGrow
                    betMultiGrow *= difficulty === "normal" ? 1.9 : 2.9
                    betMultiplier = Number(betMultiplier.toFixed(2))
                    betMultiplierLabel.textContent = `${betMultiplier}x (+${(betAmount * betMultiplier).toFixed(2)}$)`
                } else {
                    tile.style.backgroundColor = "red"
                    endTowers(false)
                }
            }
        })
    })
}

function startTowers() {
    drawTower()
    towerArr = []
    betMultiplier = 1
    stage = 0
    startButton.classList.add("locked")
    towersGrid.classList.remove("locked")
    cashoutButton.classList.remove("locked")
    difficulties.classList.add("locked")
    betMultiplierLabel.textContent = `${betMultiplier}x (+${(betAmount * betMultiplier).toFixed(2)}$)`
    for (let x = 0; x < size; x++) {
        if (difficulty === "easy") {
            betMultiGrow = 0.42
            let idkCro = []
            idkCro.push(Math.floor(Math.random() * 3))
            let jew
            do {
                jew = Math.floor(Math.random() * 3)
            } while (idkCro.includes(jew))
            idkCro.push(jew)
            towerArr.push(idkCro)
        } else if (difficulty === "normal") {
            betMultiGrow = 0.9
            towerArr.push(Math.floor(Math.random() * 2))
        } else {
            betMultiGrow = 1.8
            towerArr.push(Math.floor(Math.random() * 3))
        }
    }
}

function endTowers(win) {
    towersGrid.classList.add("locked")
    startButton.classList.remove("locked")
    cashoutButton.classList.add("locked")
    difficulties.classList.remove("locked")
    if (win === true) {
        money += betAmount * betMultiplier
        document.querySelector(".money").textContent = `Money: ${money.toFixed(2)}$`
    }
    betAmount = 0
}

document.querySelectorAll(".difficulty").forEach((diff) => {
    diff.addEventListener("click", () => {
        document.getElementById(difficulty).classList.remove("difficulty--selected")
        diff.classList.add("difficulty--selected")
        difficulty = diff.id
        drawTower()
    })
})

startButton.addEventListener("click", () => {
    let betInput = parseFloat(document.querySelector(".bet__input").value)
    if (!isNaN(betInput) && betInput > 0 && betInput <= money) {
        betAmount = betInput
        startTowers()
        money -= betInput
        document.querySelector(".money").textContent = `Money: ${money.toFixed(2)}$`
    }
})

cashoutButton.addEventListener("click", () => {
    endTowers(true)
})

drawTower()