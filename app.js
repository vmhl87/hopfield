const ROWS = 8, COLS = 8, SZ = 40, E = 5, SPEEDS = [1, 5, 10, 100];

let graph = new Array(ROWS*COLS).fill(1),
	weight = new Array(ROWS*COLS);

for(let i=0; i<ROWS*COLS; ++i)
	weight[i] = new Array(ROWS*COLS).fill(0);

function setup(){
	createCanvas(windowWidth, windowHeight);
	textAlign(CENTER, CENTER);
	textSize(16);
	noStroke();
}

let col = 0, run = false, perturb = false, speed = SPEEDS[0], memories = 0;

function draw(){
	background(100);

	if(run) for(let i=0; i<speed; ++i){
		const C = Math.floor(Math.random()*ROWS*COLS);
		let V = 0; for(let j=0; j<ROWS*COLS; ++j) V += weight[C][j] * graph[j];
		graph[C] = V < 0 ? -1 : 1;
	}

	for(let i=0; i<ROWS; ++i)
		for(let j=0; j<COLS; ++j){
			fill((graph[i*COLS+j]+1)*255/2);
			rect(width/2-SZ*COLS/2 + SZ*j + E/2, height/2-SZ*ROWS/2 + SZ*i + E/2, SZ-E, SZ-E);
			if(mouseIsPressed && Math.abs(width/2-SZ*COLS/2 + SZ*j + SZ/2 - mouseX) < SZ/2 && Math.abs(height/2-SZ*ROWS/2 + SZ*i + SZ/2 - mouseY) < SZ/2){
				if(col == 0) col = -graph[i*COLS+j];
				graph[i*COLS+j] = col;
			}
		}

	fill(225);
	
	button(run ? "PAUSE" : "RUN", width/2-50, height/2-SZ*ROWS/2-40, 50);
	button("SPEED: " + speed.toString(), width/2+50, height/2-SZ*ROWS/2-40, 50);

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
	col = 0;

	if(mouseIn(width/2-50, height/2-SZ*ROWS/2-40, 50, 20)) run = !run;

	if(mouseIn(width/2+50, height/2-SZ*ROWS/2-40, 50, 20)) speed = SPEEDS[(SPEEDS.indexOf(speed)+1)%SPEEDS.length];

	if(mouseIn(width/2-50, height/2+SZ*ROWS/2+40, 50, 20))
		for(let i=0; i<ROWS*COLS; ++i) graph[i] = 1;

	if(mouseIn(width/2+50, height/2+SZ*ROWS/2+40, 50, 20))
		for(let i=0; i<ROWS*COLS; ++i) graph[i] = Math.random() > 0.5 ? 1 : -1;

	if(mouseIn(width/2-100, height/2+SZ*ROWS/2+80, 100, 20)){
		for(let i=0; i<ROWS*COLS; ++i)
			for(let j=0; j<ROWS*COLS; ++j)
				weight[i][j] = 0;
		memories = 0;
	}

	if(mouseIn(width/2+100, height/2+SZ*ROWS/2+80, 100, 20)){
		for(let i=0; i<ROWS*COLS; ++i)
			for(let j=0; j<ROWS*COLS; ++j)
				if(i != j) weight[i][j] += graph[i]*graph[j];
		++memories;
	}
}
