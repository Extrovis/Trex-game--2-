//Trex
var trex, trex_animation, trexCollided;

//Ground
var ground, ground_image;

//Invisible ground
var invisibleGround;

//Cloud
var cloud, cloudImage;

//Score
var score = 0;

//Highscore
var highScore = 0;

//Obstacles
var obstacle, obstacleImage1, obstacleImage2, obstacleImage3, obstacleImage4, obstacleImage5, obstacleImage6;

//Obstacles
var groupObstacle;
var groupClouds;
var groupFlyingDino;

//Gamestates
var gameState = "play";

//Gameover
var gameOver, gameOverImage;

//Restart
var restart, restartImage;

//Sound
var dieSound;
var jumpSound;
var checkpointSound;

//Flying dino
var flyingDino, flyingDinoAnimation;

function preload() {
  trex_animation = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexCollided = loadAnimation("trex_collided.png");

  flyingDinoAnimation = loadAnimation("FD1.png", "FD2.png");

  ground_image = loadImage("ground4.png");

  cloudImage = loadImage("cloud.png");

  obstacleImage1 = loadImage("obstacle1.png");
  obstacleImage2 = loadImage("obstacle2.png");
  obstacleImage3 = loadImage("obstacle3.png");
  obstacleImage4 = loadImage("obstacle4.png");
  obstacleImage5 = loadImage("obstacle5.png");
  obstacleImage6 = loadImage("obstacle6.png");

  gameOverImage = loadImage("GameOver.png");

  restartImage = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkpointSound = loadSound("checkPoint.mp3");



}

function setup() {
  createCanvas(windowWidth, windowHeight);
  setFrameRate(50);

  //Ground
  ground = createSprite(width / 2, height / 3 * 2, width, 10);
  ground.addImage("ground", ground_image);


  //Invisible ground
  invisibleGround = createSprite(width / 2, ground.y + 30, width, 10);
  invisibleGround.visible = false;

  //Trex
  trex = createSprite(50, invisibleGround.y, 20, 40);
  trex.addAnimation("trex", trex_animation);
  trex.addAnimation("trexCollided", trexCollided);
  trex.scale = 0.5;
  trex.setCollider("circle", 0, 0, 45);

  //Game Over
  gameOver = createSprite(width / 2, height / 2 - 20, 10, 10);
  gameOver.addImage("game over", gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  //Restart
  restart = createSprite(width / 2, height / 2 + 20, 10, 10);
  restart.addImage("restart", restartImage);
  restart.scale = 0.4;
  restart.visible = false;
  //Obstacles
  groupObstacle = createGroup();

  groupClouds = createGroup();

  //Flying Dino
  groupFlyingDino = createGroup();
}

function draw() {
  background(200);

  textFont("Broadway");
  textSize(15);
  displayScore(" High score: ", highScore, width - 400, 30);
  displayScore(" Score: ", score,  width - 200, 30);
  
  if (gameState == "play") {
    if (frameCount % 5 == 0) {
      score++;
    }

    if (score % 50 == 0 && score != 0) {
      checkpointSound.play();
    }

    //Ground
    ground.velocityX = -(6 + score / 50);
    if (ground.x < 0) {
      ground.x = width / 2;
    }

    //Trex jump
    if (touches.length > 0 || keyDown("space") && trex.y > ground.y - 20) {
      trex.velocityY = -12;
      
      touches = [];
      
      jumpSound.play();
    }

    gravity(0.8);

    spawnClouds();

    if (score < 200) {
      spawnObstacles();
    } else if (score > 200) {
      var rand = round(random(1, 2));

      switch (rand) {
        case 1:
          spawnObstacles();
          break;
        case 2:
          spawnFlyingDino();
          break;
      }
    }


    if (trex.isTouching(groupObstacle) || trex.isTouching(groupFlyingDino)) {
      gameState = "end";
      dieSound.play();
    }
  } else if (gameState == "end") {
    trex.changeAnimation("trexCollided", trexCollided);
    groupObstacle.setVelocityEach(0, 0);
    groupObstacle.setLifetimeEach(-1);

    groupClouds.setVelocityEach(0, 0);
    groupClouds.setLifetimeEach(-1);

    groupFlyingDino.setVelocityEach(0, 0);
    groupFlyingDino.setLifetimeEach(-1);

    ground.velocityX = 0;

    trex.velocityY = 0;

    restart.visible = true;

    gameOver.visible = true;

    if (score > highScore) {
      highScore = score;
    }

    if (touches.length > 0 || mousePressedOver(restart)) {
      reset();
      
      touches = [];
    }


  }

  trex.collide(invisibleGround);

  drawSprites();
  //text(mouseX + " , " + mouseY, mouseX, mouseY);
}

function displayScore(txt, s, x, y) {
  // we are converting our score which is a int into a string than we are storing it in   a variable
  var stringScore = str(s);

  //We are storing the length of the string in a variable
  var scoreLength = stringScore.length;

  switch (scoreLength) {
    case 1:
      text(txt + "000" + stringScore[0], x, y);
      break;
    case 2:
      text(txt + "00" + stringScore[0] + stringScore[1], x, y);
      break;
    case 3:
      text(txt + "0" + stringScore[0] + stringScore[1] + stringScore[2], x, y);
      break;
    case 4:
      text(txt + "" + stringScore[0] + stringScore[1] + stringScore[2] + stringScore[3], x, y);
  }
}

function gravity(g) {

  trex.velocityY += g;

}

function spawnClouds() {
  if (frameCount % 150 == 0 || frameCount == 10) {
    cloud = createSprite(width, 50, 10, 10);
    cloud.velocityX = -2;
    cloud.addImage("cloud", cloudImage);
    cloud.scale = random(0.08, 0.12);
    groupClouds.add(cloud);

    cloud.y = random(40, 100);
    cloud.lifetime = width / cloud.velocityX;

    trex.depth = cloud.depth + 1;

  }
}

function spawnFlyingDino() {

  if (frameCount % 75 == 0) {

    flyingDino = createSprite(width, 500, 10, 10);
    flyingDino.y = random(ground.y - 40, ground.y);
    flyingDino.velocityX = ground.velocityX;
    flyingDino.addAnimation("flyingDino", flyingDinoAnimation);
    flyingDino.setCollider("circle", 0, 0, 30);

    groupFlyingDino.add(flyingDino);

    flyingDino.lifetime = width / flyingDino.velocityX;

  }
}

function spawnObstacles() {

  if (frameCount % 75 == 0 || frameCount == 30) {
    obstacle = createSprite(width, ground.y - 10, 10, 10);
    obstacle.velocityX = ground.velocityX;
    groupObstacle.add(obstacle);

    obstacle.lifetime = width / obstacle.velocityX;
    var rand = round(random(1, 6));

    switch (rand) {
      case 1:
        obstacle.addImage("obstacle1", obstacleImage1);
        obstacle.scale = 0.08;
        break;
      case 2:
        obstacle.addImage("obstacle2", obstacleImage2);
        obstacle.scale = 0.08;
        break;
      case 3:
        obstacle.addImage("obstacle3", obstacleImage3);
        obstacle.scale = 0.1;
        break;
      case 4:
        obstacle.addImage("obstacle4", obstacleImage4);
        obstacle.scale = 0.04;
        break;
      case 5:
        obstacle.addImage("obstacle5", obstacleImage5);
        obstacle.scale = 0.04;
        break;
      case 6:
        obstacle.addImage("obstacle6", obstacleImage6);
        obstacle.scale = 0.08;
        break;
    }
  }
}

function reset() {
  gameState = "play";

  gameOver.visible = false;
  restart.visible = false;

  score = 0;

  trex.changeAnimation("trex", trex_animation);

  groupClouds.destroyEach();

  groupObstacle.destroyEach();

  groupFlyingDino.destroyEach();
}