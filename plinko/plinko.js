let plinko = document.querySelector(".plinko")
let plinkoGrid = document.querySelector(".plinko__dots")
let plinkoLast = document.querySelector(".plinko__last")

const size = 10
let multiColors = ["#bf43f8", "#e432db", "#e02750", "#f08f34", "#f08f34"]

function drawPlinko() {
    for (let x = 3; x < size+3; x++) {
        let plinkoRow = document.createElement("div")
        plinkoRow.classList.add("plinko__row")
        for (let y = 0; y < x; y++) {
            let plinkoDot = document.createElement("div")
            plinkoDot.classList.add("plinko__dot")
            plinkoRow.appendChild(plinkoDot)
        }
        plinkoGrid.appendChild(plinkoRow)
    }

    let multiplier = 9
    let colorIndex = 0
    for (let y = 0; y < Math.round(size/2); y++) {
        let plinkoLastDot = document.createElement("div")
        plinkoLastDot.textContent = `${multiplier.toFixed(1)}x`
        plinkoLastDot.classList.add("plinko__lastdot")
        plinkoLastDot.style.backgroundColor = multiColors[colorIndex]
        plinkoLast.appendChild(plinkoLastDot)

        multiplier = Math.sqrt(multiplier)
        colorIndex += 1
    }

    let plinkoLastMiddle = document.createElement("div")
    plinkoLastMiddle.classList.add("plinko__lastdot")
    plinkoLastMiddle.textContent = `0.5x`
    plinkoLastMiddle.style.backgroundColor = "#f1bb45"
    plinkoLast.appendChild(plinkoLastMiddle)

    multiplier = multiplier**2
    colorIndex -= 1
    for (let y = 0; y < Math.round(size/2); y++) {
        let plinkoLastDot = document.createElement("div")
        plinkoLastDot.textContent = `${multiplier.toFixed(1)}x`
        plinkoLastDot.classList.add("plinko__lastdot")
        plinkoLastDot.style.backgroundColor = multiColors[colorIndex]
        plinkoLast.appendChild(plinkoLastDot)

        multiplier = multiplier**2
        colorIndex -= 1
    }
    
    plinko.appendChild(plinkoLast)
}

drawPlinko()