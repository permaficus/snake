var [cols,rows,empty,snake_,food,left,up,right,down,keyLeft,keyUp,keyRight,keyDown] = [26,26,0,1,2,0,1,2,3,37,38,39,40],
canvas, ctx, keystate, frames, score;	  

grid = {

	width: null,  
	height: null, 
	grid_: null,  

	init: function(dim, cols_, rows_) {
		this.width = cols_;
		this.height = rows_;

		this.grid_ = [];
		for (let x=0; x < cols_; x++) {
			this.grid_.push([]);
			for (let y=0; y < rows_; y++) {
				this.grid_[x].push(dim);
			}
		}
	},

	set: function(val, x, y) { this.grid_[x][y] = val; },
	get: function(x, y) { return this.grid_[x][y];}
}


snake = {

	direction: null, 
	last: null,		 
	queue_: null,	
	
	init: function(d, x, y) {
		this.direction = d;

		this.queue_ = [];
		this.insert(x, y);
	},

	insert: function(x, y) {		
		this.queue_.unshift({x:x, y:y});
		this.last = this.queue_[0];
	},

	remove: function() {return this.queue_.pop();}
};


setFood = () => {
	let empty_ = [];
	
	for (let x=0; x < grid.width; x++) {
		for (let y=0; y < grid.height; y++) {
			if (grid.get(x, y) === empty) {
				empty_.push({x:x, y:y});
			}
		}
	}
	
	let randpos = empty_[Math.round(Math.random()*(empty_.length - 1))];
	grid.set(food, randpos.x, randpos.y);
}

main = () => {
	
	canvas = document.createElement("canvas");
	canvas.width = cols*20;
	canvas.height = rows*20;
	ctx = canvas.getContext("2d");
	
	document.body.appendChild(canvas);

	
	ctx.font = "12px Helvetica";

	frames = 0;
	keystate = {};
	
	document.addEventListener("keydown", evt => {
		keystate[evt.keyCode] = true;
	});
	document.addEventListener("keyup", evt => {
		delete keystate[evt.keyCode];
	});
	
	init();
	loop();
}

init = () => {
	score = 0;
	grid.init(empty, cols, rows);
	let sp = {x:Math.floor(cols/2), y:rows-1};
	snake.init(up, sp.x, sp.y);
	grid.set(snake_, sp.x, sp.y);

	setFood();
}

loop = () => {
	update();
	draw();
	
	window.requestAnimationFrame(loop, canvas);
}


update = () => {
	frames++;
		
	if (keystate[keyLeft] && snake.direction !== right) {
		snake.direction = left;
	}
	if (keystate[keyUp] && snake.direction !== down) {
		snake.direction = up;
	}
	if (keystate[keyRight] && snake.direction !== left) {
		snake.direction = right;
	}
	if (keystate[keyDown] && snake.direction !== up) {
		snake.direction = down;
	}

	
	if (frames%7 === 0) {
		
		let nx = snake.last.x, ny = snake.last.y;
		
		switch (snake.direction) {
			case left: nx--; break;
			case up: ny--; break;
			case right: nx++; break;
			case down: ny++; break;
		}
		
		if (0 > nx || nx > grid.width-1  ||
			0 > ny || ny > grid.height-1 ||
			grid.get(nx, ny) === snake_) {return init();}

		if (grid.get(nx, ny) === food) {
			score++;
			setFood();
		} else {
			let tail = snake.remove();
			grid.set(empty, tail.x, tail.y);
		}

		grid.set(snake_, nx, ny);
		snake.insert(nx, ny);
	}
}

draw = () => {
	
	let tw = canvas.width/grid.width, th = canvas.height/grid.height;
	
	for (let x=0; x < grid.width; x++) {
		for (let y=0; y < grid.height; y++) {
			
			switch (grid.get(x, y)) {
				case empty:
					ctx.fillStyle = "#fff";
					break;
				case snake_:
					ctx.fillStyle = "#333";
					break;
				case food:
					ctx.fillStyle = "#009BFF";
					break;
			}
			ctx.fillRect(x*tw, y*th, tw, th);
		}
	}
	
	ctx.fillStyle = "#000";
	ctx.fillText("SCORE: " + score, 10, canvas.height-10);
}


// main();