const ROWS = 8, COLS = 8, SZ = 40, E = 5, SPEEDS = [1, 5, 10, 100];

let graph = new Array(ROWS*COLS*3).fill(1),
	weight = new Array(ROWS*COLS*3);

for(let i=0; i<ROWS*COLS*3; ++i)
	weight[i] = new Array(ROWS*COLS*3).fill(0);

function setup(){
	createCanvas(windowWidth, windowHeight);
	textAlign(CENTER, CENTER);
	textSize(16);
	noStroke();
}

const COLORS = [
	["BLACK", [-1, -1, -1]],
	["RED", [1, -1, -1]],
	["GREEN", [-1, 1, -1]],
	["BLUE", [-1, -1, 1]],
	["YELLOW", [1, 1, -1]],
	["MAGENTA", [1, -1, 1]],
	["CYAN", [-1, 1, 1]],
	["WHITE", [1, 1, 1]]
];

let col = 0, run = false, perturb = false, speed = SPEEDS[0], memories = 0;

function draw(){
	background(100);

	if(run) for(let i=0; i<speed*3; ++i){
		const C = Math.floor(Math.random()*ROWS*COLS*3);
		let V = 0; for(let j=0; j<ROWS*COLS*3; ++j) V += weight[C][j] * graph[j];
		graph[C] = V < 0 ? -1 : 1;
	}

	for(let i=0; i<ROWS; ++i)
		for(let j=0; j<COLS; ++j){
			fill((graph[(i*COLS+j)*3]+1)*255/2,
			(graph[1+(i*COLS+j)*3]+1)*255/2,
			(graph[2+(i*COLS+j)*3]+1)*255/2);
			rect(width/2-SZ*COLS/2 + SZ*j + E/2, height/2-SZ*ROWS/2 + SZ*i + E/2, SZ-E, SZ-E);
			if(mouseIsPressed && Math.abs(width/2-SZ*COLS/2 + SZ*j + SZ/2 - mouseX) < SZ/2 && Math.abs(height/2-SZ*ROWS/2 + SZ*i + SZ/2 - mouseY) < SZ/2)
				for(let k=0; k<3; ++k) graph[k+(i*COLS+j)*3] = COLORS[col][1][k];
		}

	fill(225);
	
	button(run ? "PAUSE" : "RUN", width/2-50, height/2-SZ*ROWS/2-40, 50);
	button("SPEED: " + speed.toString(), width/2+50, height/2-SZ*ROWS/2-40, 50);

	fill((COLORS[col][1][0]+1)*255/2,
	(COLORS[col][1][1]+1)*255/2,
	(COLORS[col][1][2]+1)*255/2);
	button("COLOR: " + COLORS[col][0], width/2, height/2-SZ*ROWS/2-80, 100);
	fill(255);

	button("CLEAR", width/2-50, height/2+SZ*ROWS/2+40, 50);
	button("RANDOMIZE", width/2+50, height/2+SZ*ROWS/2+40, 50);
	button("RESET MEMORIES", width/2-100, height/2+SZ*ROWS/2+80, 100);
	button("ADD MEMORY (" + memories.toString() + " stored)", width/2+100, height/2+SZ*ROWS/2+80, 100);
}

function button(T, x, y, w){
	textSize(mouseIn(x, y, w, 20) ? 17 : 16);
	text(T, x, y);
}

function mouseIn(x, y, w, h){
	return abs(x-mouseX) < w && abs(y-mouseY) < h;
}

function mouseReleased(){
	if(mouseIn(width/2-50, height/2-SZ*ROWS/2-40, 50, 20)) run = !run;

	if(mouseIn(width/2+50, height/2-SZ*ROWS/2-40, 50, 20)) speed = SPEEDS[(SPEEDS.indexOf(speed)+1)%SPEEDS.length];

	if(mouseIn(width/2, height/2-SZ*ROWS/2-80, 100, 20)) col = (col+1)%COLORS.length;

	if(mouseIn(width/2-50, height/2+SZ*ROWS/2+40, 50, 20))
		for(let i=0; i<ROWS*COLS*3; ++i) graph[i] = 1;

	if(mouseIn(width/2+50, height/2+SZ*ROWS/2+40, 50, 20))
		for(let i=0; i<ROWS*COLS*3; ++i) graph[i] = Math.random() > 0.5 ? 1 : -1;

	if(mouseIn(width/2-100, height/2+SZ*ROWS/2+80, 100, 20)){
		for(let i=0; i<ROWS*COLS*3; ++i)
			for(let j=0; j<ROWS*COLS*3; ++j)
				weight[i][j] = 0;
		memories = 0;
	}

	if(mouseIn(width/2+100, height/2+SZ*ROWS/2+80, 100, 20)){
		for(let i=0; i<ROWS*COLS*3; ++i)
			for(let j=0; j<ROWS*COLS*3; ++j)
				if(i != j) weight[i][j] += graph[i]*graph[j];
		++memories;
	}
}
