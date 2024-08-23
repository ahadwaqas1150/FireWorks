let fireworks = [];
let timer = 5; // Countdown timer in seconds
let timerActive = true;
let messageVisible = false;
let burstTriggered = false;
let stars = []; // Array to hold the star objects

// Target date and time (00:00 of September 28th)
let targetDate = new Date();
targetDate.setMonth(8); // September (0-indexed: January = 0)
targetDate.setDate(28);
targetDate.setHours(0, 0, 0, 0); // Midnight of September 28th

function setup() {
createCanvas(windowWidth, windowHeight); // Responsive canvas sizing
textAlign(CENTER, CENTER);
calculateTimer();
generateStars(); // Generate stars for the background
}

function draw() {
background(0); // Black background for night sky

// Display the stars
displayStars();

if (timerActive) {
    displayTimer();

    // Decrease the timer by 1 every second
    if (frameCount % 60 == 0 && timer > 0) {
    timer--;
    }

    // When the timer hits zero, stop the timer, start fireworks, and show the message
    if (timer <= 0) {
    timerActive = false;
    messageVisible = true;

    if (!burstTriggered) {
        burstFireworks();
        burstTriggered = true;
    }

    setInterval(() => {
        fireworks.push(new Firework());
    }, 1000);
    }
} else {
    for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].done()) {
        fireworks.splice(i, 1);
    }
    }

    if (messageVisible) {
    displayBirthdayMessage();
    }
}
}

function generateStars() {
let numStars = 100; // Number of stars to generate
for (let i = 0; i < numStars; i++) {
    stars.push({
    x: random(width),
    y: random(height),
    size: random(1, 3),
    brightness: random(100, 255)
    });
}
}

function displayStars() {
noStroke();
for (let star of stars) {
    fill(star.brightness);
    ellipse(star.x, star.y, star.size, star.size);
}
}

function calculateTimer() {
let currentTime = new Date();
let timeDifference = targetDate - currentTime;
timer = floor(timeDifference / 1000); // Convert milliseconds to seconds
}

function burstFireworks() {
for (let i = 0; i < 10; i++) {
    fireworks.push(new Firework());
}
}

function displayTimer() {
let days = floor(timer / (24 * 3600)); // Calculate the number of days
let hours = floor((timer % (24 * 3600)) / 3600); // Remaining hours after days are removed
let minutes = floor((timer % 3600) / 60); // Remaining minutes after hours are removed
let seconds = timer % 60; // Remaining seconds

let timeString = nf(days, 2) + 'd ' + nf(hours, 2) + ':' + nf(minutes, 2) + ':' + nf(seconds, 2);

fill(255);
textSize(windowWidth / 15); // Adjust the timer text size as needed
text(timeString, width / 2, height / 2);
}

function displayBirthdayMessage() {
let alpha = map(sin(frameCount * 0.05), -1, 1, 150, 255);
let scale = map(sin(frameCount * 0.05), -1, 1, 0.98, 1.02);

fill(255, 204, 0, alpha);
textSize((windowWidth / 18) * scale);
text("Happy Birthday Arooba!", width / 2, height / 2 - windowHeight / 12);

let textSizeValue;
  if (windowWidth < 900) {
    textSizeValue = windowWidth / 30;
  } else {
    textSizeValue = windowWidth / 100;
  }

fill(255);
textSize(textSizeValue);
textAlign(CENTER);
textWrap(WORD);
text(`happy birthday, you're a great friend who's always willing to listen to myproblems and is always happy for my success and motivates me for itand I hope you'll continue doing so in the future too. Party hard enjoy your day you deserve it queen`, width / 2 - windowWidth / 4, height / 2 + windowHeight / 20, windowWidth / 2);
}

function windowResized() {
resizeCanvas(windowWidth, windowHeight);
}

class Firework {
constructor() {
    this.x = random(width);
    this.y = height;
    this.exploded = false;
    this.explosionTimer = 0;

    this.vx = random(-1, 1);
    this.vy = random(-20, -15);
    this.explosionRadius = random(50, 150);
    this.explosionColor = color(random(255), random(255), random(255));

    this.missileTrail = [];
    this.explosionTrail = [];
}

update() {
    if (!this.exploded) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.5;
    this.missileTrail.push(createVector(this.x, this.y));

    if (this.vy >= 0) {
        this.explode();
    }
    } else {
    for (let particle of this.explosionTrail) {
        particle.update();
    }
    this.explosionTimer++;
    }
}

show() {
    if (!this.exploded) {
    noFill();
    strokeWeight(3);
    stroke(255, 150);
    beginShape();
    for (let pt of this.missileTrail) {
        vertex(pt.x, pt.y);
    }
    endShape();
    } else {
    for (let particle of this.explosionTrail) {
        particle.show();
    }
    }
}

explode() {
    for (let i = 0; i < 100; i++) {
    let angle = random(TWO_PI);
    let speed = random(2, 10);
    this.explosionTrail.push(new Particle(this.x, this.y, angle, speed, this.explosionRadius, this.explosionColor));
    }
    this.exploded = true;
}

done() {
    return this.exploded && this.explosionTimer > 60;
}
}

class Particle {
constructor(x, y, angle, speed, explosionRadius, explosionColor) {
    this.x = x;
    this.y = y;
    this.vx = cos(angle) * speed;
    this.vy = sin(angle) * speed;
    this.explosionRadius = explosionRadius;
    this.explosionColor = explosionColor;
    this.alpha = 255;
    this.size = random(2, 8);
}

update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
}

show() {
    noStroke();
    fill(this.explosionColor.levels[0], this.explosionColor.levels[1], this.explosionColor.levels[2], this.alpha);
    ellipse(this.x, this.y, this.size, this.size);
}
}
