const size = 5 // 5x5
const mines = 5

let money = 1000
let betMultiplier = 1;

let minesPlaces = 0
let mineArr = []

for (let x = 0; x < size; x++) {
    let row = []
    for (let y = 0; y < size; y++) row.push(0)
    mineArr.push(row)
}

while (minesPlaces < mines) {
    let row = Math.floor(Math.random() * 4)
    let column = Math.floor(Math.random() * 4)
    let tile = mineArr[row][column]

    if (tile == 0) {
        mineArr[row][column] = 1
        minesPlaces += 1
    }
}

let mineGrid = document.querySelector(".mines")
mineGrid.style.gridTemplateColumns = `repeat(${size}, 1fr)`
for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
        mineGrid.innerHTML += `<div class="mines__tile" id="${x},${y}"></div>`
    }
}

let betMultiplierLabel = document.querySelector(".bet__multiplier")
betMultiplierLabel.textContent = `${betMultiplier}x`

document.querySelectorAll(".mines__tile").forEach((mine) => {
    mine.addEventListener("click", () => {
        let pos = mine.id.split(",")
        if (mineArr[pos[0]][pos[1]] == 1) {
            mine.style.backgroundColor = "red"
        } else {
            mine.style.backgroundColor = "green"
            betMultiplier += 0.2;
            betMultiplier = betMultiplier.toFixed(2)
            betMultiplierLabel.textContent = `${betMultiplier}x`
        }
    })
})

console.log(mineArr)