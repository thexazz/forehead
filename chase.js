var razorImage = new Image();
razorImage.src = "razorface1.png";

var acydImage = new Image();
acydImage.src = "acydface1.png";

var acydForehead = new Image();
acydForehead.src = "acydforehead.png";


var nosxBeard = new Image();
nosxBeard.src = "mistiksdog.png";

var gameOver = new Image();
gameOver.src = "gameover.png";

victim = {
	x : 1,
	y : 1,
	size : 50,
	color : "brown",
	speed : 10,
	width: 256,
	height: 256,
	
	draw : function(ctx) {
		ctx.drawImage(razorImage, victim.x - victim.width / 2, victim.y - victim.height / 2);
//		ctx.rect(victim.x, victim.y, victim.size, victim.size);
//		ctx.fillStyle = victim.color;
	},
	move : function(direction, width, height) {
		// handle player movement
		switch(direction) {
			case "up":
				victim.y += -victim.speed;
				break;
			case "down":
				victim.y += victim.speed;
				break;
			case "right":
				victim.x += victim.speed;
				break;
			case "left":
				victim.x += -victim.speed;
				break;
		}
		// handle wall collisions
		if(victim.x + victim.width / 2 < 0) victim.x = canvas.width;
		if (victim.x - victim.width / 2 > canvas.width) victim.x = 0;
		if (victim.y + victim.height / 2 < 0) victim.y = canvas.height
		if (victim.y - victim.height / 2 > canvas.height) victim.y = 0;
	}
}

beard = {
	x: innerWidth / 2,
	y: innerHeight / 2,
	width: 61.8 * 2,
	height: 42.4 * 2,
	draw: function(ctx) {
		ctx.drawImage(nosxBeard, beard.x - beard.width / 2, beard.y - beard.height / 2, beard.width, beard.height);
	}
}

forehead = {
	x : 900,
	y : 700,
	size : 500,
	box: {},
	width: 144,
	speed : 1,
	draw : function(ctx) {
		var foreheadSize = acydForehead.height;
		var newSize = foreheadSize + game.level * 10;
		
		forehead.box = {
			height: newSize + acydImage.height, //Forehead + acyd 
			y: ((forehead.y - newSize - acydImage.height / 2) + (forehead.y + acydImage.height)) / 2 //Estimate acyd y position
		}
		//Draw forehead
		ctx.drawImage(acydForehead, forehead.x - acydForehead.width / 2, forehead.y - newSize - acydImage.height / 2, acydForehead.width, newSize);
		
		//Draw acyd
		ctx.drawImage(acydImage, forehead.x - acydImage.width / 2, forehead.y - acydImage.height / 2);
		
	},
	getCoords: function() {
		return {
			x: forehead.x,
			y: ((forehead.y - acydForehead.height + game.level * 10) + (forehead.y + acydImage.height)) / 2
		}
	},
	chase : function(victim) {
		// chase the player
		if (victim.x > forehead.x) {
			forehead.x += forehead.speed;
		} else {
			forehead.x += -forehead.speed;
		}
		if (victim.y > forehead.y) {
			forehead.y += forehead.speed;
		} else {
			forehead.y += -forehead.speed;
		}
	}
}

game = {
	canvas : document.getElementById("canvas"),
	ctx :  canvas.getContext("2d"),
	direction : "down",
	slow : 10,
	fast : 20,
	tickCount: 0,
	time: 25,
	level: 1,
	loss: false,
	start : function (){
		game.ctx = game.canvas.getContext("2d");
		
		game.canvas.width = window.innerWidth;
		game.canvas.height = window.innerHeight;
		//eventlistener to move the snake
		player = victim;
		acyd = forehead;

		window.addEventListener("keydown", function(event){
			var keypress = event.key.toLowerCase();
			switch(keypress) {
				case "w":
					game.direction = "up";
					break;
				case "s":
					game.direction = "down";
					break;
				case "a":
					game.direction = "left";
					break;
				case "d":
					game.direction = "right";
					break;
				case "shift":
					player.speed = game.fast;
					break;
				default:
					console.log("unhandled keydown "+keypress);
					break;
			}
			console.log("game direction is now " + game.direction);
		})
		window.addEventListener("keyup", function(event){
			if (event.key == "Shift") {
				player.speed = game.slow;
			}
		})

		
		setInterval(game.repeat, 1000/60)
	},

	repeat : function(){

		//clearCanvas
		game.ctx.beginPath();
		game.ctx.setTransform(1, 0, 0, 1, 0, 0);
		game.clearCanvas();
		
		if (game.loss) {
			game.ctx.drawImage(gameOver, 0, 0, canvas.width, canvas.height);
			return;
		}

		// move our sprites
		player.move(game.direction, game.canvas.width, game.canvas.height);
		acyd.chase(player);

		// draw our sprites
		player.draw(game.ctx);
		acyd.draw(game.ctx);
		beard.draw(game.ctx);

		game.ctx.font = "30px Ubutnu"
		const { width } = game.ctx.measureText(game.getText());
		game.ctx.fillText(game.getText(), canvas.width / 2 - width / 2, 25);
		game.ctx.stroke();
		game.ctx.fill();
		
		
	

		var victimBox = {x: victim.x - victim.width / 2, y: victim.y - victim.height / 2, width: victim.width, height: victim.height}
		var foreheadBox = {x: forehead.x - forehead.width / 2, y: forehead.box.y - forehead.box.height / 2, width: forehead.width, height: forehead.box.height}
		var beardBox = {x: beard.x - beard.width / 2, y: beard.y - beard.height / 2, width: beard.width, height: beard.height};
		
		if (game.checkCollision(victimBox, foreheadBox)) {
		   game.loss = true;
		}
	
		
		if (game.checkCollision(victimBox, beardBox)) {
			game.resetLevel(game.level + 1);
		}
		game.tickCount++
		
		if (game.tickCount % 60 == 0) game.checkTimer();
	},
	
	checkCollision: function(rect1, rect2) {
		return (rect1.x < rect2.x + rect2.width &&
		   rect1.x + rect1.width > rect2.x &&
		   rect1.y < rect2.y + rect2.height &&
		   rect1.y + rect1.height > rect2.y)
	},
	
	getText: function() {
		return `Level ${game.level} | Timer: ${game.time} seconds | Forehead Capacity ${Math.floor((acydForehead.height + game.level * 10) / acydForehead.height * 100)} %`
	},
	
	checkTimer: function() {
		game.time--
		if (game.time == 0) {
			game.resetLevel(0);
		}
		
	},
	
	resetLevel: function(lvl) {
		game.level = lvl
		
		//Reset player
		player.x = 1;
		player.y = 1;
		
		//Reset Forehead
		forehead.x = 900
		forehead.y = 700;
		
		forehead.speed = 0.5 * game.level; //Forehead difficulty
		
		beard.x = canvas.width * Math.random()
		beard.y = canvas.height * Math.random();
		
		game.direction = ""
		game.time = 25
	},

	clearCanvas : function (){
	
		game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height)
		//console.log(0, 0, game.canvas.width, game.canvas.height)
		
	}

}

game.start();
