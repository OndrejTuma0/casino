let diceSlider = document.getElementById("dice")
let startButton = document.getElementById("startDice")

let money = 1000
let winChance = 50
let multiplier = 2
let betAmount = 0
let guess = null
let roll = null

function updateSlider() {
    const min = diceSlider.min || 5
    const max = diceSlider.max || 99
    const val = (diceSlider.value - min) / (max - min) * 100
    diceSlider.style.background = `linear-gradient(to right, #c542ba ${val}%, #ffeb3c ${val}%)`
}

function getMultiplier(chance) {
    const k = 0.96
    const p = 1.015
    return (k * Math.pow(100 / chance, p)).toFixed(3)
}

function startDice() {
    roll = Math.floor(Math.random() * 100) + 1
    if (roll >= guess) {
        money += betAmount * multiplier
    }
    betAmount = 0
}

diceSlider.addEventListener("input", () => {
    winChance = 100 - diceSlider.value
    document.querySelector(".win__text-dice").textContent = `Win chance: ${winChance}%`

    multiplier = getMultiplier(winChance)
    document.querySelector(".bet__multiplier-dice").textContent = `Multiplier: ${multiplier}x`
    updateSlider()
})

startButton.addEventListener("click", () => {
    let betInput = parseFloat(document.querySelector(".bet__input").value)
    if (!isNaN(betInput) && betInput <= money && betInput > 0) {
        betAmount = betInput
        guess = diceSlider.value
        money -= betInput
        startDice()
        document.querySelector(".money").textContent = `Money: ${money.toFixed(2)}$`
        document.querySelector(".dice__roll").textContent = `Rolled: ${roll}`
    }
})

updateSlider()