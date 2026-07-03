// ============================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ============================================
var lCode = []
var skeletons = []
var flyingSkulls = []
var lasers = []
var mushrooms = []
var endPlane = null
var portal = null
var portalJump = null
var bgTexts = []
var explosionParticles = []
var menuParticles = []
var skeletonTrail = []
var gameStarted = false
var menuTime = 0
var screenShake = 0
var dangerLevel = 0
var player
var home = 0
var time = 0
var pst = 0
var placeO = 0
var placeOY = 0
var blocks = []
var mode = "block"
var modes = ["block", "spike", "mushroom", "del"]
var camY = 0
var sMoves = []

// ============================================
// SETUP
// ============================================
function setup() {
    createCanvas(1540, 720)
    
    for (let i = 0; i < 50; i++) {
        menuParticles.push({
            x: random(width),
            y: random(height),
            size: random(2, 8),
            speed: random(0.5, 2),
            alpha: random(100, 255),
            color: random([
                color(0, 255, 255),
                color(255, 0, 255),
                color(255, 255, 0)
            ])
        })
    }
    
    home = -1
}

// ============================================
// DRAW
// ============================================
function draw() {
    if (home == -1) {
        menuTime += 0.02
        background(10, 10, 30)
        
        strokeWeight(1)
        for (let i = 0; i < width; i += 100) {
            let offset = (menuTime * 50) % 100
            let alpha = 30 + sin(menuTime + i * 0.01) * 20
            stroke(0, 255, 255, alpha)
            line(i - offset, 0, i - offset, height)
        }
        for (let i = 0; i < height; i += 100) {
            let offset = (menuTime * 30) % 100
            let alpha = 30 + cos(menuTime + i * 0.01) * 20
            stroke(255, 0, 255, alpha)
            line(0, i - offset, width, i - offset)
        }
        
        noStroke()
        for (let p of menuParticles) {
            p.y -= p.speed
            if (p.y < -10) {
                p.y = height + 10
                p.x = random(width)
            }
            let pulse = sin(menuTime * 2 + p.x * 0.01) * 0.5 + 0.5
            let size = p.size * (1 + pulse * 0.5)
            let a = p.alpha * (0.5 + pulse * 0.5)
            drawingContext.shadowBlur = 15
            drawingContext.shadowColor = p.color
            fill(red(p.color), green(p.color), blue(p.color), a)
            ellipse(p.x, p.y, size)
            drawingContext.shadowBlur = 0
        }
        
        let titlePulse = sin(menuTime * 3) * 0.3 + 0.7
        let titleSize = 80 + sin(menuTime * 2) * 5
        textAlign(CENTER, CENTER)
        textSize(titleSize)
        drawingContext.shadowBlur = 40
        drawingContext.shadowColor = color(0, 255, 255)
        fill(0, 255, 255, 100 * titlePulse)
        text("NEON JUMP", width / 2, height / 2 - 120)
        drawingContext.shadowBlur = 25
        fill(0, 255, 255)
        text("NEON JUMP", width / 2, height / 2 - 120)
        
        let subtitlePulse = sin(menuTime * 4) * 0.5 + 0.5
        textSize(35)
        drawingContext.shadowBlur = 20
        drawingContext.shadowColor = color(255, 0, 255)
        fill(255, 0, 255, 200 + 55 * subtitlePulse)
        text("Нажмите для начала игры", width / 2, height / 2)
        
        textSize(22)
        let hintPulse = sin(menuTime * 2) * 0.5 + 0.5
        drawingContext.shadowBlur = 15
        drawingContext.shadowColor = color(255, 255, 0)
        fill(255, 255, 0, 150 + 105 * hintPulse)
        text("(Музыка начнется после клика)", width / 2, height / 2 + 60)
        drawingContext.shadowBlur = 0
        
        strokeWeight(3)
        noFill()
        let cornerSize = 60
        let cornerOffset = 30
        stroke(0, 255, 255)
        line(cornerOffset, cornerOffset, cornerOffset + cornerSize, cornerOffset)
        line(cornerOffset, cornerOffset, cornerOffset, cornerOffset + cornerSize)
        stroke(255, 0, 255)
        line(width - cornerOffset, cornerOffset, width - cornerOffset - cornerSize, cornerOffset)
        line(width - cornerOffset, cornerOffset, width - cornerOffset, cornerOffset + cornerSize)
        stroke(255, 255, 0)
        line(cornerOffset, height - cornerOffset, cornerOffset + cornerSize, height - cornerOffset)
        line(cornerOffset, height - cornerOffset, cornerOffset, height - cornerOffset - cornerSize)
        stroke(0, 255, 255)
        line(width - cornerOffset, height - cornerOffset, width - cornerOffset - cornerSize, height - cornerOffset)
        line(width - cornerOffset, height - cornerOffset, width - cornerOffset, height - cornerOffset - cornerSize)
    }
    
    if (home == 10) {
        background(10, 10, 30)
        fill(0, 255, 255)
        noStroke()
        textAlign(CENTER, CENTER)
        textSize(50)
        text("You beat the level!", width / 2, height / 2)
    }

    if (home == 0) {
        push()
        if (screenShake > 0) {
            translate(random(-screenShake, screenShake), random(-screenShake, screenShake))
            screenShake *= 0.9
            if (screenShake < 0.5) screenShake = 0
        }

        if (player.xR > 9000) { home = 10 }

        if (-player.y + height - 100 > height - 100) {
            if (camY > -player.y + height - 100 + 3) camY -= 3
            else if (camY < -player.y + height - 100 - 3) camY += 3
            else camY = -player.y + height - 100
        } else {
            if (camY > -player.y + height - 100 + 3) camY -= player.yVel + 30
        }

        translate(0, camY)
        background(10, 10, 30)
        
        if (dangerLevel > 0) {
            noStroke()
            fill(255, 0, 0, dangerLevel * 30)
            rect(-100, -1000, width + 200, height + 2000)
            dangerLevel *= 0.95
        }
        
        stroke(0, 255, 255, 30)
        strokeWeight(1)
        for (let i = 0; i < width; i += 100) {
            let offset = (player.xR / 2) % 100
            line(i - offset, 0, i - offset, height)
        }
        for (let i = 0; i < height; i += 100) {
            let offset = (player.xR / 3) % 100
            line(0, i - offset, width, i - offset)
        }

        for (let i = 0; i < skeletons.length; i++) {
            skeletons[i].chase()
            skeletons[i].show()
        }
        
        for (let i = flyingSkulls.length - 1; i >= 0; i--) {
            flyingSkulls[i].chase()
            flyingSkulls[i].show()
            if (!flyingSkulls[i].alive) flyingSkulls.splice(i, 1)
        }
        
        for (let i = lasers.length - 1; i >= 0; i--) {
            lasers[i].update()
            lasers[i].show()
            if (lasers[i].life <= 0) lasers.splice(i, 1)
        }
        
        for (let i = skeletonTrail.length - 1; i >= 0; i--) {
            skeletonTrail[i].update()
            skeletonTrail[i].show()
            if (skeletonTrail[i].life <= 0) skeletonTrail.splice(i, 1)
        }

        ground()
        player.air = true
        noStroke()
        player.move()
        noStroke()

        for (let i = 0; i < blocks.length; i++) blocks[i].show()
        for (let i = 0; i < mushrooms.length; i++) mushrooms[i].show()

        for (let i = 0; i < sMoves.length; i++) {
            sMoves[i].show()
            if (sMoves[i].x < -100) { sMoves.splice(i, 1); i-- }
        }

        if (endPlane) endPlane.show()
        if (portal) portal.show()
        if (portalJump) portalJump.show()

        for (let i = explosionParticles.length - 1; i >= 0; i--) {
            explosionParticles[i].update()
            explosionParticles[i].show()
            if (explosionParticles[i].life <= 0) explosionParticles.splice(i, 1)
        }

        push()
        player.show()
        pop()
        pop()
        time = 0
    }

    if (home == 1) {
        background(10, 10, 30)
        eGrid()
        for (let i = 0; i < blocks.length; i++) blocks[i].showEditor()
        for (let i = 0; i < mushrooms.length; i++) mushrooms[i].showEditor()
        showEditorUI()
    }

    if (home == 2) {
        home = 0
        player.xR = 0
        player.y = height - 100
        player.yVel = 0
        player.dead = false
        player.onPlane = false
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].xh !== undefined) blocks[i].x = blocks[i].xh
            if (blocks[i].x2 !== undefined) blocks[i].x = blocks[i].x2
        }
    }
}

// ============================================
// UI РЕДАКТОРА
// ============================================
function showEditorUI() {
    push()
    fill(0, 0, 0, 180)
    noStroke()
    rect(10, 10, 350, 150, 10)
    fill(0, 255, 255)
    textAlign(LEFT, TOP)
    textSize(24)
    text("РЕДАКТОР УРОВНЯ", 25, 20)
    textSize(18)
    let modeColor
    if (mode == "block") modeColor = color(255, 0, 255)
    else if (mode == "spike") modeColor = color(255, 100, 0)
    else if (mode == "mushroom") modeColor = color(0, 255, 100)
    else if (mode == "del") modeColor = color(255, 50, 50)
    fill(modeColor)
    text("Режим: " + mode.toUpperCase(), 25, 55)
    fill(255, 255, 255)
    textSize(14)
    text("1 - Блок (фиолетовый)", 25, 85)
    text("2 - Шип (оранжевый)", 25, 105)
    text("3 - Гриб (зеленый)", 25, 125)
    text("4 - Удаление (красный)", 25, 145)
    fill(255, 255, 0)
    textSize(16)
    text("TAB - играть / редактировать", 25, 175)
    text("ESC - выход из редактора", 25, 195)
    pop()
    showCursorPreview()
}

function showCursorPreview() {
    let mx = mouseX
    let my = mouseY
    let gridX = round(mx / 40) * 40
    let gridY = round(my / 40) * 40 + 29
    push()
    drawingContext.shadowBlur = 15
    if (mode == "block") {
        drawingContext.shadowColor = color(255, 0, 255)
        stroke(255, 0, 255)
        strokeWeight(2)
        noFill()
        rectMode(CENTER)
        rect(gridX, gridY, 40)
    } else if (mode == "spike") {
        drawingContext.shadowColor = color(255, 100, 0)
        stroke(255, 100, 0)
        strokeWeight(2)
        noFill()
        triangle(gridX - 20, gridY + 20, gridX + 20, gridY + 20, gridX, gridY - 20)
    } else if (mode == "mushroom") {
        drawingContext.shadowColor = color(0, 255, 100)
        stroke(0, 255, 100)
        strokeWeight(2)
        noFill()
        ellipse(gridX, gridY - 5, 40, 30)
    } else if (mode == "del") {
        stroke(255, 50, 50)
        strokeWeight(3)
        noFill()
        ellipse(gridX, gridY, 40, 40)
        line(gridX - 15, gridY - 15, gridX + 15, gridY + 15)
        line(gridX + 15, gridY - 15, gridX - 15, gridY + 15)
    }
    drawingContext.shadowBlur = 0
    pop()
}

// ============================================
// ЗАПУСК ИГРЫ
// ============================================
function startGame() {
    if (home == -1) {
        const music = document.getElementById("bgmusic")
        if (music) {
            music.play().catch(function(error) {
                console.log('Music play error:', error)
            })
        }
        
        lCode = [
            "blo", 1040, 600, "blo", 1080, 600, "blo", 1120, 600,
            "blo", 1160, 840, "blo", 1160, 600, "blo", 1200, 840,
            "blo", 1200, 600, "blo", 1240, 840, "blo", 1240, 600,
            "blo", 1280, 840, "blo", 1280, 600, "blo", 1320, 840,
            "blo", 1360, 840, "blo", 1400, 840, "blo", 1440, 840,
            "spi", 1320, 760, "spi", 1360, 760,
            "blo", 1320, 600, "blo", 1360, 600, "blo", 1400, 600, "blo", 1440, 600,
            "blo", 1400, 760, "blo", 1440, 760, "blo", 1480, 760,
            "blo", 1520, 760, "blo", 1560, 760, "blo", 1600, 760,
            "blo", 1640, 760, "blo", 1680, 760, "blo", 1720, 760,
            "blo", 1760, 760, "blo", 1800, 760, "blo", 1840, 760, "blo", 1880, 760,
            "spi", 1720, 840, "spi", 1760, 840,
            "blo", 1800, 840, "blo", 1840, 840, "blo", 1880, 840,
            "blo", 2040, 760, "blo", 2200, 840, "blo", 2360, 840,
            "blo", 3080, 840, "blo", 3120, 840, "blo", 3160, 840,
            "blo", 3200, 840, "blo", 3240, 840, "blo", 3280, 840,
            "blo", 3320, 840, "blo", 3360, 840, "blo", 3400, 840,
            "spi", 3200, 760, "spi", 3240, 760,
            "blo", 3520, 840, "blo", 3640, 760, "blo", 3680, 760,
            "blo", 3760, 840, "blo", 3800, 840, "blo", 3840, 840,
            "blo", 3880, 840, "blo", 3920, 840, "blo", 3960, 840,
            "blo", 4000, 840, "blo", 4040, 840, "blo", 4080, 840,
            "blo", 4120, 760, "blo", 4160, 760, "blo", 4200, 760, "blo", 4240, 760,
            "blo", 4400, 760, "blo", 4440, 760, "blo", 4480, 760, "blo", 4520, 760,
            "spi", 4240, 600, "spi", 4280, 600, "spi", 4320, 600,
            "spi", 4360, 600, "spi", 4400, 600,
            "spi", 4960, 600, "spi", 5000, 600,
            "blo", 5200, 600, "blo", 5240, 600, "blo", 5280, 600,
            "blo", 5320, 840, "blo", 5360, 840, "blo", 5400, 840,
            "blo", 5440, 840, "blo", 5480, 840, "blo", 5520, 840, "blo", 5560, 840,
            "spi", 5600, 760, "spi", 5640, 600, "spi", 5760, 600, "spi", 5800, 600
        ]

        for (let i = 0; i < lCode.length; i++) {
            if (lCode[i] == "spi") blocks.push(new spike(lCode[i + 1], lCode[i + 2]))
            if (lCode[i] == "blo") blocks.push(new block(lCode[i + 1], lCode[i + 2]))
        }

        // МЕДЛЕННЫЙ скелет
        skeletons = []
        skeletons.push(new ChasingSkeleton(-300, height - 140))
        
        // Летающий череп с лазерами
        flyingSkulls = []
        flyingSkulls.push(new FlyingSkullWithLaser(-500, 300))
        
        lasers = []
        skeletonTrail = []

        mushrooms.push(new Mushroom(1500, 840))
        mushrooms.push(new Mushroom(2500, 840))
        mushrooms.push(new Mushroom(3500, 840))
        mushrooms.push(new Mushroom(4500, 840))
        mushrooms.push(new Mushroom(5500, 840))

        endPlane = new EndAirplane(800, 600)
        portal = new Portal(1200, 300)
        portalJump = new JumpPortal(4200, 600)

        player = {
            x: 75, y: height - 100, yVel: 0, dead: false, air: false,
            rot: 0, xR: 0, jumpst: 0, c: 0, speed: 12,
            onPlane: false, neonGlow: 0, exploded: false,

            move: function() {
                if (!this.dead) this.xR += player.speed

                if (this.onPlane && endPlane) {
                    this.y = endPlane.getCurrentY() - 40
                    this.yVel = 0
                    this.air = false
                } else {
                    this.y += this.yVel
                    if (this.y > height - 99) {
                        this.y -= this.yVel
                        this.yVel = 0
                        this.air = false
                    } else {
                        this.yVel += 1.3
                    }
                    while (this.y > height - 99) this.y -= 0.1
                }

                if (this.dead) {
                    home = 1
                    this.dead = false
                    this.y = height - 100
                    this.onPlane = false
                    placeOY = round(placeOY / 40)
                    placeO = round(placeO / 40)
                    player.xR = 0
                    this.yVel = 0
                    this.c += 1 * 60 / frameRate()
                    if (this.c > 60) player.dead = false
                } else {
                    this.c = 0
                }
                this.neonGlow = (this.neonGlow + 2) % 360
            },

            show: function() {
                if (this.air) this.rot += 8
                else {
                    if (this.rot > round(this.rot / 90) * 90 + 40) this.rot -= 38
                    else if (this.rot < round(this.rot / 90) * 90 - 40) this.rot += 38
                    else this.rot = round(this.rot / 90) * 90
                }

                if (keyIsDown(32) || mouseIsPressed || keyIsDown(38)) {
                    if (this.onPlane) {
                        this.yVel = -13.3
                        this.air = true
                        this.onPlane = false
                    } else if (!this.air) {
                        this.yVel = -13.3
                        this.air = true
                    }
                }

                if (!this.dead) {
                    translate(75, this.y)
                    angleMode(DEGREES)
                    rotate(this.rot)
                    rectMode(CENTER)
                    let glowSize = 50 + sin(this.neonGlow) * 10
                    drawingContext.shadowBlur = 20
                    drawingContext.shadowColor = color(0, 255, 255)
                    noStroke()
                    fill(0, 255, 255, 50)
                    rect(0, 0, glowSize)
                    fill(0, 255, 255)
                    stroke(255, 255, 255)
                    strokeWeight(3)
                    rect(0, 0, 40)
                    fill(100, 255, 255, 150)
                    noStroke()
                    rect(0, 0, 30)
                    drawingContext.shadowBlur = 0
                }
            }
        }
        
        home = 0
        gameStarted = true
    }
}

// ============================================
// СОБЫТИЯ
// ============================================
function mousePressed() {
    if (home == -1) { startGame(); return }
    if (home == 1) placeB()
}

function mouseDragged() {
    if (home == 1) placeB()
}

function placeB() {
    if (home == 1 && mouseIsPressed) {
        if (mode == "block") blocks.push(new block(mouseX + placeO, mouseY - 40 + placeOY))
        if (mode == "spike") blocks.push(new spike(mouseX + placeO, mouseY - 40 + placeOY))
        if (mode == "mushroom") mushrooms.push(new Mushroom(mouseX + placeO, mouseY - 40 + placeOY))
        if (mode == "del") {
            for (let i = blocks.length - 1; i >= 0; i--) {
                let bx = blocks[i].xh !== undefined ? blocks[i].xh : blocks[i].x
                let by = blocks[i].y
                if (bx > mouseX - 20 + placeO && bx < mouseX + 20 + placeO &&
                    by > mouseY - 20 + placeOY && by < mouseY + 20 + placeOY) {
                    blocks.splice(i, 1)
                }
            }
            for (let i = mushrooms.length - 1; i >= 0; i--) {
                let mx = mushrooms[i].x2 !== undefined ? mushrooms[i].x2 : mushrooms[i].x
                let my = mushrooms[i].y
                if (mx > mouseX - 25 + placeO && mx < mouseX + 25 + placeO &&
                    my > mouseY - 25 + placeOY && my < mouseY + 25 + placeOY) {
                    mushrooms.splice(i, 1)
                }
            }
        }
    }
}

function keyPressed() {
    if (key == '1') mode = "block"
    if (key == '2') mode = "spike"
    if (key == '3') mode = "mushroom"
    if (key == '4') mode = "del"
    
    if (keyCode == 9) {
        if (home == 0) {
            home = 1
            player.xR = 0
            player.y = height - 100
            player.yVel = 0
            player.dead = false
            player.onPlane = false
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].xh !== undefined) blocks[i].x = blocks[i].xh
                if (blocks[i].x2 !== undefined) blocks[i].x = blocks[i].x2
            }
            for (let i = 0; i < mushrooms.length; i++) {
                if (mushrooms[i].x2 !== undefined) mushrooms[i].x = mushrooms[i].x2
            }
        } else if (home == 1) home = 2
    }
    
    if (keyCode == 27 && home == 1) home = 2
}

// ============================================
// ЗЕМЛЯ
// ============================================
function ground() {
    fill(10, 10, 30)
    rectMode(CORNER)
    stroke(0, 255, 255)
    strokeWeight(3)
    if (home == 1) {
        rect(-10, height - 100 + 22, width + 10, placeOY + 150)
        rect(-10, height - 100 + 22, width + 20, placeOY + 150)
    } else {
        rect(-10, height - 100 + 22, width + 10, 150)
        rect(-10, height - 100 + 22, width + 20, 150)
    }
}

// ============================================
// БЛОК
// ============================================
function block(x, y) {
    this.x = round(x / 40) * 40
    this.y = round(y / 40) * 40 + 29
    this.id = "blo"
    this.xh = round(x / 40) * 40

    this.show = function() {
        if (!player.dead && home == 0) this.x -= (player.speed / 1.4)
        if (home == 1 || player.dead) this.x = this.xh

        let drawX = this.x
        let drawY = this.y
        
        if (drawX > -100 && drawX < width + 100) {
            drawingContext.shadowBlur = 15
            drawingContext.shadowColor = color(255, 0, 255)
            fill(20, 20, 40)
            rectMode(CENTER)
            stroke(255, 0, 255)
            strokeWeight(2)
            rect(drawX, drawY, 40)
            fill(255, 0, 255, 50)
            noStroke()
            rect(drawX, drawY, 30)
            drawingContext.shadowBlur = 0
        }

        if (!player.onPlane && home == 0) {
            if (player.y > this.y - 39 && player.y < this.y + 20 &&
                player.x > this.x - 39 && player.x < this.x + 39) {
                player.y -= player.yVel
                player.yVel = 0
                player.air = false
            }
            if (player.y > this.y - 25 && player.y < this.y + 35 &&
                player.x > this.x - 39 && player.x < this.x + 39) {
                player.dead = true
            }
            while (player.y > this.y - 39 && player.y < this.y + 20 &&
                player.x > this.x - 39 && player.x < this.x + 39) {
                player.y -= 0.1
            }
        }
    }
    
    this.showEditor = function() {
        let drawX = this.xh
        let drawY = this.y
        drawingContext.shadowBlur = 15
        drawingContext.shadowColor = color(255, 0, 255)
        fill(20, 20, 40)
        rectMode(CENTER)
        stroke(255, 0, 255)
        strokeWeight(2)
        rect(drawX, drawY, 40)
        fill(255, 0, 255, 50)
        noStroke()
        rect(drawX, drawY, 30)
        drawingContext.shadowBlur = 0
    }
}

// ============================================
// ШИП
// ============================================
function spike(x, y) {
    this.x = round(x / 40) * 40
    this.x2 = round(x / 40) * 40
    this.id = "spi"
    this.y = round(y / 40) * 40 + 29
    this.c = color(random(100, 255), random(100, 255), random(100, 255))

    this.show = function() {
        if (!player.dead && home == 0) this.x -= player.speed / 1.4
        if (home == 1 || player.dead) this.x = this.x2

        let drawX = this.x
        let drawY = this.y
        
        if (drawX > -100 && drawX < width + 100) {
            drawingContext.shadowBlur = 20
            drawingContext.shadowColor = color(255, 100, 0)
            fill(255, 100, 0)
            rectMode(CENTER)
            stroke(255, 200, 0)
            strokeWeight(2)
            triangle(drawX - 20, drawY + 20, drawX + 20, drawY + 20, drawX, drawY - 20)
            fill(255, 200, 0, 100)
            noStroke()
            triangle(drawX - 10, drawY + 10, drawX + 10, drawY + 10, drawX, drawY - 10)
            drawingContext.shadowBlur = 0
        }

        if (home == 0 && player.y > this.y - 39 && player.y < this.y + 39 &&
            player.x > this.x - 25 && player.x < this.x + 25) {
            createExplosion(75, player.y)
            player.dead = true
        }
    }
    
    this.showEditor = function() {
        let drawX = this.x2
        let drawY = this.y
        drawingContext.shadowBlur = 20
        drawingContext.shadowColor = color(255, 100, 0)
        fill(255, 100, 0)
        rectMode(CENTER)
        stroke(255, 200, 0)
        strokeWeight(2)
        triangle(drawX - 20, drawY + 20, drawX + 20, drawY + 20, drawX, drawY - 20)
        fill(255, 200, 0, 100)
        noStroke()
        triangle(drawX - 10, drawY + 10, drawX + 10, drawY + 10, drawX, drawY - 10)
        drawingContext.shadowBlur = 0
    }
}

// ============================================
// ВЗРЫВ
// ============================================
function ExplosionParticle(x, y) {
    this.x = x
    this.y = y
    this.vx = random(-10, 10)
    this.vy = random(-10, 10)
    this.size = random(5, 15)
    this.life = random(30, 60)
    this.maxLife = this.life
    this.color = random([
        color(0, 255, 255), color(255, 0, 255),
        color(255, 255, 0), color(255, 100, 0)
    ])
    this.rotation = random(360)
    this.rotSpeed = random(-15, 15)

    this.update = function() {
        this.x += this.vx
        this.y += this.vy
        this.vy += 0.3
        this.vx *= 0.98
        this.life--
        this.rotation += this.rotSpeed
        this.size *= 0.97
    }

    this.show = function() {
        let alpha = map(this.life, 0, this.maxLife, 0, 255)
        push()
        translate(this.x, this.y)
        rotate(this.rotation)
        drawingContext.shadowBlur = 15
        drawingContext.shadowColor = this.color
        fill(red(this.color), green(this.color), blue(this.color), alpha)
        stroke(255, 255, 255, alpha)
        strokeWeight(1)
        rectMode(CENTER)
        rect(0, 0, this.size, this.size)
        drawingContext.shadowBlur = 0
        pop()
    }
}

function createExplosion(x, y) {
    for (let i = 0; i < 40; i++) {
        explosionParticles.push(new ExplosionParticle(x, y))
    }
}

// ============================================
// МЕДЛЕННЫЙ СКЕЛЕТ
// ============================================
function ChasingSkeleton(startX, startY) {
    this.x = startX
    this.y = startY
    this.baseSpeed = 5
    this.speed = this.baseSpeed
    this.acceleration = 0.0003
    this.bobTime = random(1000)
    this.attackMode = false
    this.eyeGlow = 0
    this.jawOpen = 0
    this.cloakWave = 0
    this.jumpVel = 0
    this.grounded = true
    
    this.chase = function() {
        if (player.dead || home != 0) return
        this.bobTime += 0.1
        this.eyeGlow = (this.eyeGlow + 3) % 360
        this.cloakWave += 0.05
        let distToPlayer = player.xR - this.x
        this.speed = this.baseSpeed + player.xR * this.acceleration
        let targetSpeed = this.speed
        
        if (distToPlayer < 200 && distToPlayer > 0) {
            this.attackMode = true
            targetSpeed = this.speed * 1.3
            dangerLevel = map(distToPlayer, 0, 200, 5, 0)
            screenShake = max(screenShake, map(distToPlayer, 0, 200, 4, 0))
        } else {
            this.attackMode = false
            dangerLevel = max(0, dangerLevel - 0.1)
        }
        
        if (this.grounded && distToPlayer < 400) {
            let checkX = this.x + 80
            for (let b of blocks) {
                let bx = b.xh !== undefined ? b.xh : b.x
                if (abs(bx - checkX) < 60 && b.y > this.y - 100) {
                    this.jumpVel = -18
                    this.grounded = false
                    break
                }
            }
        }
        
        if (!this.grounded) {
            this.y += this.jumpVel
            this.jumpVel += 0.8
            if (this.y >= height - 140) {
                this.y = height - 140
                this.grounded = true
                this.jumpVel = 0
            }
        }
        
        this.x += targetSpeed / 1.4
        
        if (frameCount % 5 == 0) {
            skeletonTrail.push(new SkeletonTrailParticle(
                this.x - player.xR / 1.4, this.y + random(-20, 20)
            ))
        }
        
        if (distToPlayer < 35 && abs(this.y - player.y) < 50) {
            createExplosion(75, player.y)
            player.dead = true
            screenShake = 20
        }
    }
    
    this.show = function() {
        if (home != 0) return
        let drawX = this.x - player.xR / 1.4
        let drawY = this.y + sin(this.bobTime) * 5
        if (drawX < -200 || drawX > width + 200) return
        
        push()
        translate(drawX, drawY)
        let glowIntensity = this.attackMode ? 30 : 15
        drawingContext.shadowBlur = glowIntensity
        drawingContext.shadowColor = color(255, 0, 0)
        
        noStroke()
        for (let i = 3; i > 0; i--) {
            let wave = sin(this.cloakWave + i) * 5
            fill(30, 0, 0, 40 - i * 10)
            ellipse(0, 10, 80 + i * 20 + wave, 100 + i * 15)
        }
        
        fill(220, 220, 200)
        stroke(80, 0, 0)
        strokeWeight(2)
        ellipse(0, -20, 50, 60)
        
        let eyePulse = sin(this.eyeGlow * 0.1) * 0.3 + 0.7
        noStroke()
        drawingContext.shadowBlur = 20
        drawingContext.shadowColor = color(255, 0, 0)
        fill(255, 0, 0, 200 * eyePulse)
        ellipse(-10, -25, 14, 18)
        ellipse(10, -25, 14, 18)
        fill(255, 100, 100)
        ellipse(-10, -25, 6, 8)
        ellipse(10, -25, 6, 8)
        
        fill(20, 0, 0)
        triangle(-3, -10, 3, -10, 0, -5)
        
        this.jawOpen = this.attackMode ? sin(this.bobTime * 2) * 8 + 5 : 0
        fill(20, 0, 0)
        stroke(80, 0, 0)
        strokeWeight(1)
        rect(-12, 0 + this.jawOpen, 24, 10, 3)
        
        fill(255, 255, 240)
        noStroke()
        for (let i = -10; i <= 10; i += 5) {
            triangle(i - 2, 0, i + 2, 0, i, 6)
            triangle(i - 2, 10 + this.jawOpen, i + 2, 10 + this.jawOpen, i, 4 + this.jawOpen)
        }
        
        stroke(200, 200, 180)
        strokeWeight(3)
        for (let i = 0; i < 4; i++) {
            let ribY = 15 + i * 8
            let ribWidth = 25 - i * 2
            noFill()
            arc(0, ribY, ribWidth, 10, 0, PI)
        }
        
        stroke(220, 220, 200)
        strokeWeight(4)
        let armReach = this.attackMode ? 40 : 25
        let armWave = sin(this.bobTime * 2) * 10
        line(-15, 20, -armReach, 15 + armWave)
        line(-armReach, 15 + armWave, -armReach - 10, 25 + armWave)
        line(15, 20, armReach, 15 - armWave)
        line(armReach, 15 - armWave, armReach + 10, 25 - armWave)
        
        strokeWeight(2)
        for (let f = -1; f <= 1; f++) {
            line(-armReach - 10, 25 + armWave, -armReach - 15 + f * 3, 32 + armWave)
            line(armReach + 10, 25 - armWave, armReach + 15 + f * 3, 32 - armWave)
        }
        
        strokeWeight(4)
        stroke(220, 220, 200)
        let legAnim = sin(this.bobTime * 3) * 10
        line(-8, 45, -12 + legAnim, 70)
        line(8, 45, 12 - legAnim, 70)
        
        if (this.attackMode) {
            noStroke()
            fill(255, 0, 0, 30 + sin(this.bobTime * 3) * 20)
            ellipse(0, 20, 120, 140)
        }
        drawingContext.shadowBlur = 0
        pop()
    }
}

function SkeletonTrailParticle(x, y) {
    this.x = x
    this.y = y
    this.size = random(5, 15)
    this.life = random(20, 40)
    this.maxLife = this.life
    this.vx = random(-1, 1)
    this.vy = random(-2, 0)
    
    this.update = function() {
        this.x += this.vx
        this.y += this.vy
        this.life--
        this.size *= 0.95
    }
    
    this.show = function() {
        let alpha = map(this.life, 0, this.maxLife, 0, 150)
        noStroke()
        fill(100, 0, 0, alpha)
        ellipse(this.x, this.y, this.size)
    }
}

// ============================================
// ЛЕТАЮЩИЙ ЧЕРЕП С ЛАЗЕРАМИ
// ============================================
function FlyingSkullWithLaser(startX, startY) {
    this.x = startX
    this.y = startY
    this.baseSpeed = 14
    this.speed = this.baseSpeed
    this.acceleration = 0.001
    this.wingAngle = 0
    this.bobTime = random(1000)
    this.eyeGlow = 0
    this.alive = true
    this.spawnDelay = 120
    this.laserCooldown = 0
    this.laserCharge = 0
    this.charging = false
    
    this.chase = function() {
        if (!this.alive || player.dead || home != 0) return
        if (this.spawnDelay > 0) { this.spawnDelay--; return }
        
        this.bobTime += 0.2
        this.wingAngle += 0.4
        this.eyeGlow = (this.eyeGlow + 6) % 360
        let yDist = player.y - this.y
        this.speed = this.baseSpeed + player.xR * this.acceleration
        
        let targetX = this.x + this.speed
        let targetY = this.y + (yDist * 0.1) + sin(this.bobTime) * 4
        this.x = targetX
        this.y = targetY
        
        if (frameCount % 3 == 0) {
            skeletonTrail.push(new SkeletonTrailParticle(
                this.x - player.xR / 1.4, this.y + random(-15, 15)
            ))
        }
        
        // Столкновение с шипами - ЧЕРЕП УМИРАЕТ!
        let screenX = this.x - player.xR / 1.4
        for (let i = blocks.length - 1; i >= 0; i--) {
            if (blocks[i].id == "spi") {
                let spikeScreenX = blocks[i].x
                let spikeY = blocks[i].y
                if (abs(screenX - spikeScreenX) < 40 && abs(this.y - spikeY) < 40) {
                    this.alive = false
                    createExplosion(screenX, this.y)
                    screenShake = 18
                    return
                }
            }
        }
        
        // ЛАЗЕР!
        if (this.laserCooldown > 0) {
            this.laserCooldown--
            this.charging = false
            this.laserCharge = 0
        } else {
            this.charging = true
            this.laserCharge += 2
            if (this.laserCharge >= 100) {
                let playerScreenX = 75
                let playerScreenY = player.y
                let dx = playerScreenX - screenX
                let dy = playerScreenY - this.y
                let dist = sqrt(dx * dx + dy * dy)
                if (dist > 0) {
                    lasers.push(new LaserBeam(screenX, this.y, dx / dist, dy / dist, 800))
                }
                this.laserCooldown = 120
                this.laserCharge = 0
                this.charging = false
                screenShake = 8
            }
        }
        
        // Столкновение с игроком
        if (screenX < 100 && screenX > 40 && abs(this.y - player.y) < 50) {
            createExplosion(75, player.y)
            player.dead = true
            screenShake = 25
        }
    }
    
    this.show = function() {
        if (!this.alive || home != 0 || this.spawnDelay > 0) return
        let drawX = this.x - player.xR / 1.4
        let drawY = this.y
        if (drawX < -200 || drawX > width + 100) return
        
        push()
        translate(drawX, drawY)
        drawingContext.shadowBlur = 35
        drawingContext.shadowColor = color(255, 0, 0)
        
        let wingFlap = sin(this.wingAngle) * 30
        fill(40, 0, 0, 180)
        stroke(150, 0, 0)
        strokeWeight(2)
        beginShape()
        vertex(-20, -5)
        vertex(-50, -20 + wingFlap)
        vertex(-70, -10 + wingFlap)
        vertex(-60, 5 + wingFlap)
        vertex(-40, 10)
        vertex(-20, 5)
        endShape(CLOSE)
        beginShape()
        vertex(20, -5)
        vertex(50, -20 - wingFlap)
        vertex(70, -10 - wingFlap)
        vertex(60, 5 - wingFlap)
        vertex(40, 10)
        vertex(20, 5)
        endShape(CLOSE)
        
        stroke(200, 200, 180)
        strokeWeight(2)
        for (let i = 0; i < 3; i++) {
            let offset = i * 15
            line(-25 - offset, -5, -35 - offset, -15 + wingFlap * 0.7)
            line(25 + offset, -5, 35 + offset, -15 - wingFlap * 0.7)
        }
        
        fill(240, 240, 220)
        stroke(100, 0, 0)
        strokeWeight(3)
        ellipse(0, 0, 55, 65)
        
        let eyePulse = sin(this.eyeGlow * 0.15) * 0.4 + 0.6
        let chargeBoost = this.charging ? (this.laserCharge / 100) * 1.5 : 0
        noStroke()
        drawingContext.shadowBlur = 30 + chargeBoost * 20
        drawingContext.shadowColor = color(255, 0, 0)
        fill(255, 0, 0, min(255, 220 * eyePulse + chargeBoost * 100))
        ellipse(-12, -8, 16 + chargeBoost * 4, 20 + chargeBoost * 4)
        ellipse(12, -8, 16 + chargeBoost * 4, 20 + chargeBoost * 4)
        fill(255, 200, 200)
        ellipse(-12, -8, 8, 10)
        ellipse(12, -8, 8, 10)
        
        fill(30, 0, 0)
        triangle(-4, 5, 4, 5, 0, 12)
        
        fill(255, 255, 240)
        stroke(150, 150, 140)
        strokeWeight(1)
        for (let i = -15; i <= 15; i += 6) {
            triangle(i - 3, 18, i + 3, 18, i, 26)
        }
        
        stroke(80, 0, 0)
        strokeWeight(2)
        line(-20, -25, -15, -15)
        line(18, -22, 22, -12)
        line(-5, -30, 0, -20)
        
        if (this.charging) {
            noStroke()
            fill(255, 0, 0, 100 + this.laserCharge)
            ellipse(0, 0, 80 + this.laserCharge * 0.5, 80 + this.laserCharge * 0.5)
        }
        drawingContext.shadowBlur = 0
        pop()
    }
}

// ============================================
// ЛАЗЕР
// ============================================
function LaserBeam(startX, startY, dirX, dirY, range) {
    this.x = startX
    this.y = startY
    this.dirX = dirX
    this.dirY = dirY
    this.range = range
    this.life = 30
    this.maxLife = 30
    this.warningTime = 15
    this.hasHit = false
    
    this.update = function() {
        this.life--
        if (this.life < this.warningTime && !this.hasHit && home == 0 && !player.dead) {
            let playerScreenX = 75
            let playerScreenY = player.y
            let endX = this.x + this.dirX * this.range
            let endY = this.y + this.dirY * this.range
            let dx = endX - this.x
            let dy = endY - this.y
            let len2 = dx * dx + dy * dy
            if (len2 > 0) {
                let t = ((playerScreenX - this.x) * dx + (playerScreenY - this.y) * dy) / len2
                t = constrain(t, 0, 1)
                let projX = this.x + t * dx
                let projY = this.y + t * dy
                let distX = playerScreenX - projX
                let distY = playerScreenY - projY
                let dist = sqrt(distX * distX + distY * distY)
                if (dist < 30) {
                    this.hasHit = true
                    createExplosion(playerScreenX, playerScreenY)
                    player.dead = true
                    screenShake = 25
                }
            }
        }
    }
    
    this.show = function() {
        let endX = this.x + this.dirX * this.range
        let endY = this.y + this.dirY * this.range
        push()
        if (this.life >= this.warningTime) {
            let warnAlpha = (this.life - this.warningTime) / (this.maxLife - this.warningTime) * 255
            stroke(255, 0, 0, warnAlpha)
            strokeWeight(1)
            drawingContext.shadowBlur = 5
            drawingContext.shadowColor = color(255, 0, 0)
            line(this.x, this.y, endX, endY)
            let blink = sin(frameCount * 0.5) > 0 ? 255 : 100
            fill(255, 0, 0, blink)
            noStroke()
            ellipse(endX, endY, 10, 10)
        } else {
            let activeAlpha = this.life / this.warningTime
            drawingContext.shadowBlur = 40
            drawingContext.shadowColor = color(255, 50, 50)
            stroke(255, 100, 100, 150 * activeAlpha)
            strokeWeight(20)
            line(this.x, this.y, endX, endY)
            stroke(255, 150, 150, 200 * activeAlpha)
            strokeWeight(10)
            line(this.x, this.y, endX, endY)
            stroke(255, 255, 255, 255 * activeAlpha)
            strokeWeight(4)
            line(this.x, this.y, endX, endY)
            noStroke()
            fill(255, 200, 200, 200 * activeAlpha)
            ellipse(this.x, this.y, 40 * activeAlpha, 40 * activeAlpha)
        }
        drawingContext.shadowBlur = 0
        pop()
    }
}

// ============================================
// ГРИБ
// ============================================
function Mushroom(x, y) {
    this.x = x
    this.x2 = round(x / 40) * 40
    this.y = round(y / 40) * 40 + 29
    this.baseY = this.y
    this.bounce = 0
    this.time = random(1000)

    this.show = function() {
        if (!player.dead && home == 0) this.x -= (player.speed / 1.4)
        if (home == 1 || player.dead) this.x = this.x2
        let drawX = this.x
        let drawY = this.y + sin(this.time * 0.05) * 5
        this.time++
        if (drawX > -100 && drawX < width + 100) {
            drawingContext.shadowBlur = 20
            drawingContext.shadowColor = color(0, 255, 100)
            fill(200, 200, 200)
            stroke(0, 255, 100)
            strokeWeight(2)
            rectMode(CENTER)
            rect(drawX, drawY + 10, 15, 25)
            fill(0, 255, 100)
            noStroke()
            ellipse(drawX, drawY - 5, 40, 30)
            fill(255, 255, 255)
            ellipse(drawX - 10, drawY - 8, 8, 8)
            ellipse(drawX + 10, drawY - 8, 8, 8)
            ellipse(drawX, drawY - 12, 6, 6)
            fill(0, 255, 100, 50)
            ellipse(drawX, drawY, 50, 40)
            drawingContext.shadowBlur = 0
            if (home == 0 && player.y > drawY - 30 && player.y < drawY + 20 &&
                player.x > drawX - 25 && player.x < drawX + 25) {
                if (player.yVel > 0) {
                    player.yVel = -15
                    player.air = true
                }
            }
        }
    }
    
    this.showEditor = function() {
        let drawX = this.x2
        let drawY = this.y
        drawingContext.shadowBlur = 20
        drawingContext.shadowColor = color(0, 255, 100)
        fill(200, 200, 200)
        stroke(0, 255, 100)
        strokeWeight(2)
        rectMode(CENTER)
        rect(drawX, drawY + 10, 15, 25)
        fill(0, 255, 100)
        noStroke()
        ellipse(drawX, drawY - 5, 40, 30)
        fill(255, 255, 255)
        ellipse(drawX - 10, drawY - 8, 8, 8)
        ellipse(drawX + 10, drawY - 8, 8, 8)
        ellipse(drawX, drawY - 12, 6, 6)
        fill(0, 255, 100, 50)
        ellipse(drawX, drawY, 50, 40)
        drawingContext.shadowBlur = 0
    }
}

// ============================================
// ПОРТАЛ ПРЫЖКА
// ============================================
function JumpPortal(x, y) {
    this.x = x
    this.x2 = x
    this.y = y
    this.angle = 0
    this.pulse = 0

    this.show = function() {
        if (!player.dead && home == 0) this.x -= (player.speed / 1.4)
        if (home == 1 || player.dead) this.x = this.x2
        let drawX = this.x
        let drawY = this.y
        this.pulse = (this.pulse + 3) % 360
        if (drawX > -100 && drawX < width + 100) {
            push()
            translate(drawX, drawY)
            this.angle += 5
            drawingContext.shadowBlur = 25
            drawingContext.shadowColor = color(255, 255, 0)
            noFill()
            stroke(255, 255, 0)
            strokeWeight(6)
            ellipse(0, 0, 80 + sin(this.pulse) * 10, 80 + sin(this.pulse) * 10)
            stroke(255, 200, 0)
            strokeWeight(4)
            ellipse(0, 0, 60 + sin(this.pulse) * 8, 60 + sin(this.pulse) * 8)
            fill(255, 255, 0, 100)
            noStroke()
            ellipse(0, 0, 40, 40)
            stroke(255, 255, 0)
            strokeWeight(3)
            for (let i = 0; i < 8; i++) {
                let a = this.angle + i * 45
                let x1 = cos(a) * 25
                let y1 = sin(a) * 25
                let x2 = cos(a) * 50
                let y2 = sin(a) * 50
                line(x1, y1, x2, y2)
            }
            drawingContext.shadowBlur = 0
            if (home == 0 && player.y > drawY - 40 && player.y < drawY + 40 &&
                player.x > drawX - 40 && player.x < drawX + 40) {
                player.yVel = -18
                player.air = true
            }
            pop()
        }
    }
}

// ============================================
// САМОЛЕТ
// ============================================
function EndAirplane(x, y) {
    this.baseX = x
    this.baseY = y
    this.propAngle = 0
    this.time = 0

    this.getCurrentY = function() {
        return this.baseY + sin(this.time * 0.05) * 80
    }
    this.getCurrentScreenX = function() {
        return this.baseX - player.xR / 1.4
    }

    this.show = function() {
        let drawX = this.getCurrentScreenX()
        let drawY = this.getCurrentY()
        this.time++
        if (drawX > -200 && drawX < width + 200) {
            if (!player.dead && !player.onPlane) {
                if (player.x > drawX - 60 && player.x < drawX + 60 &&
                    player.y > drawY - 40 && player.y < drawY + 10 &&
                    player.yVel >= 0) {
                    player.onPlane = true
                    player.yVel = 0
                    player.air = false
                }
            }
            push()
            translate(drawX, drawY)
            let tilt = cos(this.time * 0.05) * 5
            rotate(tilt)
            fill(150, 150, 150)
            stroke(100)
            strokeWeight(2)
            ellipse(0, 0, 120, 40)
            fill(100, 200, 255)
            noStroke()
            ellipse(20, -5, 30, 25)
            fill(180, 180, 180)
            stroke(100)
            strokeWeight(2)
            rect(-10, 0, 60, 15)
            triangle(-50, 0, -60, -20, -40, 0)
            triangle(-50, 0, -60, 20, -40, 0)
            push()
            translate(55, 0)
            this.propAngle += 25
            rotate(this.propAngle)
            fill(50)
            noStroke()
            rect(-3, -25, 6, 50)
            rect(-25, -3, 50, 6)
            pop()
            pop()
        }
    }
}

// ============================================
// ПОРТАЛ
// ============================================
function Portal(x, y) {
    this.x = x
    this.y = y
    this.angle = 0

    this.show = function() {
        let drawX = this.x - player.xR / 1.4
        if (drawX > -100 && drawX < width + 100) {
            push()
            translate(drawX, this.y)
            this.angle += 3
            drawingContext.shadowBlur = 25
            drawingContext.shadowColor = color(150, 0, 255)
            noFill()
            stroke(150, 0, 255)
            strokeWeight(8)
            ellipse(0, 0, 100, 100)
            stroke(200, 100, 255)
            strokeWeight(5)
            ellipse(0, 0, 70, 70)
            fill(255, 200, 255, 150)
            noStroke()
            ellipse(0, 0, 40, 40)
            stroke(255, 150, 255)
            strokeWeight(3)
            for (let i = 0; i < 8; i++) {
                let a = this.angle + i * 45
                let x1 = cos(a) * 20
                let y1 = sin(a) * 20
                let x2 = cos(a) * 45
                let y2 = sin(a) * 45
                line(x1, y1, x2, y2)
            }
            drawingContext.shadowBlur = 0
            pop()
        }
    }
}

// ============================================
// СЕТКИ
// ============================================
function eGrid() {
    stroke(0, 255, 255, 50)
    strokeWeight(1)
    for (let i = 0; i < width; i += 40) line(i, 0, i, height)
    for (let i = 0; i < height; i += 40) line(0, i, width, i)
}

function bGrid() {
    stroke(0, 255, 255, 50)
    for (let i = 0 + (-player.xR / 10 % 120) - 150; i < width + (-player.xR / 10 % 120) + 150; i += 120) {
        strokeWeight(2)
        line(i, 0, i, height - 100)
    }
    for (let i = 0 + (-player.xR % 120) - 150; i < width + (-player.xR % 120) + 150; i += 120) {
        strokeWeight(2)
        line(i, height - 100, i, height)
    }
}

function gS() {
    this.x = width + 100
    this.y = height - 50 + 10 + (170 / 4) + 10
    this.s = 170
    this.f = color(0, 0, 100)
    this.show = function() {
        if (!player.dead) this.x -= (11.2 * 40) / getFrameRate()
        rectMode(CENTER)
        fill(this.f)
        noStroke()
        rect(this.x, this.y, this.s, this.s, 15)
    }
}