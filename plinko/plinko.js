let plinko = document.querySelector(".plinko")
let plinkoGrid = document.querySelector(".plinko__dots")
let plinkoLast = document.querySelector(".plinko__last")
let startButton = document.getElementById("startPlinko")

const size = 10
const multiColors = ["#bf43f8", "#e432db", "#e02750", "#f08f34", "#f08f34", "#f1bb45", "#f08f34", "#f08f34", "#e02750", "#e432db", "#bf43f8"]
const multipliersEasy = [8.5, 3, 1.2, 1, 0.8, 0.5, 0.8, 1, 1.2, 3, 8.5]
const multipliersNormal = [20, 5, 2, 1.3, 0.6, 0.4, 0.6, 1.3, 2, 5, 20]
const multipliersHard = [67, 8, 2.5, 0.7, 0.2, 0, 0.2, 0.7, 2.5, 8, 67]

let difficulty = "easy"
let betAmount = 0
let ballAmount = 1
let money = 1000
let balls = 0

function drawPlinko() {
    plinkoGrid.innerHTML = ""
    plinkoLast.innerHTML = ""

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

    for (let x = 0; x < multiColors.length; x++) {
        let plinkoCatch = document.createElement("div")
        let multiplier = difficulty === "easy" ? multipliersEasy[x] : difficulty === "normal" ? multipliersNormal[x] : multipliersHard[x]
        plinkoCatch.textContent = `${multiplier}x`
        plinkoCatch.dataset.value = multiplier
        plinkoCatch.style.backgroundColor = multiColors[x]
        plinkoCatch.classList.add("plinko__lastdot")
        plinkoLast.appendChild(plinkoCatch)
    }

    plinko.appendChild(plinkoLast)
}

function checkBalls() {
    let difficulties = document.querySelector(".towers__difficulties")
    if (balls === 0) {
        difficulties.classList.remove("locked")
    } else {
        difficulties.classList.add("locked")
    }
}

function startPlinko() {
    let betInput = parseFloat(document.querySelector(".bet__input").value)
    let ballInput = parseInt(document.querySelector(".ball__input").value)
    if (!isNaN(betInput) && betInput > 0 && betInput <= money && !isNaN(ballInput) && ballInput > 0) {
        if (betInput * ballInput > money) return
        ballAmount = ballInput
        betAmount = betInput * ballInput
        money -= betInput * ballAmount
        document.querySelector(".money").textContent = `Money: ${money.toFixed(2)}$`
        balls += ballAmount
        checkBalls()
    } else return

    const ballsArr = []
    const plinkoRect = document.querySelector(".plinko").getBoundingClientRect()

    for (let x = 0; x < ballAmount; x++) { // spawn ballAmount of balls
        const ballEl = document.createElement("div")
        ballEl.style.cssText = `
            position: absolute; width: 16px; height: 16px;
            border-radius: 50%; background-color: #ffd84d;
            pointer-events: none; z-index: 999;
            transform: translate(-50%, -50%);`
        document.body.appendChild(ballEl)

        const ball = Bodies.circle(plinkoRect.left + plinkoRect.width / 2, plinkoRect.top + window.scrollY, 8, {
            restitution: 0.5, friction: 0.01, frictionAir: 0.007, collisionFilter: {group: noCollide}, label: "ball", plugin: {value: betInput}
        })
        ball.domElement = ballEl
        ballsArr.push(ball)
        Body.setVelocity(ball, { x: (Math.random() - 0.5) * 0.5, y: 0 }) // random physics
    }

    World.add(engine.world, ballsArr)
}

document.querySelectorAll(".difficulty").forEach((diff) => {
    diff.addEventListener("click", () => {
        document.getElementById(difficulty).classList.remove("difficulty--selected")
        diff.classList.add("difficulty--selected")
        difficulty = diff.id
        drawPlinko()
    })
})

document.addEventListener("keydown", (key) => {
    if (key.key === " ") { // check for space
        startPlinko()
    }
})

drawPlinko()

// Physics
Matter.Engine.create()
const { Engine, Bodies, Body, World, Events, Runner } = Matter
const engine = Engine.create({gravity: { y: 2 }})
Runner.run(Runner.create(), engine)

const noCollide = Matter.Body.nextGroup(true)

document.querySelectorAll(".plinko__dot").forEach((dot) => {
    const rect = dot.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2 + window.scrollY
    World.add(engine.world, Bodies.circle(x, y, rect.width / 2, {label: "dot", isStatic: true}))
})

document.querySelectorAll(".plinko__lastdot").forEach((lastdot) => {
    const rect = lastdot.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2 + window.scrollY
    World.add(engine.world, Bodies.rectangle(x, y, rect.width, rect.height, {label: "rect", isStatic: true, plugin: {multi: lastdot.dataset.value}}))
})

// on collision
Events.on(engine, 'collisionStart', (event) => {
    event.pairs.forEach(pair => {
        const {bodyA, bodyB} = pair
        let ball, dot, lastdot

        if (bodyA.label === "ball" && bodyB.label === "dot") {
            ball = bodyA
            dot = bodyB
        } else if (bodyB.label === "ball" && bodyA.label === "dot") {
            ball = bodyB
            dot = bodyA
        } else if (bodyA.label === "ball" && bodyB.label === "rect") {
            ball = bodyA
            lastdot = bodyB
        } else if (bodyB.label === "ball" && bodyA.label === "rect") {
            ball = bodyB
            lastdot = bodyA
        }

        if (ball && dot) {
            const direction = Math.random() < 0.5 ? -1 : 1 // 50/50 left or right
            const horizontalSpeed = 1.5
            const verticalSpeed = 2
            Body.setVelocity(ball, { x: direction * horizontalSpeed, y: verticalSpeed })
        }

        if (ball && lastdot) {
            money += ball.plugin.value * Number(lastdot.plugin.multi)
            ball.domElement.remove()
            World.remove(engine.world, ball)
            balls -= 1
            document.querySelector(".money").textContent = `Money: ${money.toFixed(2)}$`
            checkBalls()
        }
    })
})

startButton.addEventListener("click", () => {
    startPlinko()
})

// on every frame
Events.on(engine, 'afterUpdate', () => {
    engine.world.bodies.forEach(body => {
        if (body.domElement) {
            body.domElement.style.left = body.position.x + 'px'
            body.domElement.style.top = body.position.y + 'px'
        }
    })
})
