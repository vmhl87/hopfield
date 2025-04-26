const ROWS = 8, COLS = 8, SZ = 40, E = 5, SPEEDS = [1, 5, 10, 100];

let graph = new Array(ROWS*COLS*3).fill(1),
	weight = [new Array(ROWS*COLS*3), new Array(ROWS*COLS*3)];

for(let i=0; i<ROWS*COLS*3; ++i){
	weight[0][i] = new Array(ROWS*COLS*3).fill(0);
	weight[1][i] = new Array(ROWS*COLS*3).fill(0);
}

function setup(){
	createCanvas(windowWidth, windowHeight);
	textAlign(CENTER, CENTER);
	textSize(16);
	noStroke();
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
}

const COLORS = [
	["OFF", [1, 1, 1]],
	["BLACK", [-1, -1, -1]],
	["RED", [1, -1, -1]],
	["GREEN", [-1, 1, -1]],
	["BLUE", [-1, -1, 1]],
	["YELLOW", [1, 1, -1]],
	["MAGENTA", [1, -1, 1]],
	["CYAN", [-1, 1, 1]],
	["WHITE", [1, 1, 1]]
];

let col = 0, col2 = 0, run = false, temp = 0, speed = SPEEDS[0], memories = 0, negs = 0, paused = false;

function draw(){
	background(100);

	if(run){
		if(col) for(let i=0; i<speed*3; ++i){
			const C = Math.floor(Math.random()*ROWS*COLS*3);

			let V = 0;
			if(memories) for(let j=0; j<ROWS*COLS*3; ++j){
				V += weight[0][C][j] * graph[j] / memories;
				if(negs) V -= weight[1][C][j] * graph[j] / negs;
			}

			const P = 1/(1+Math.pow(Math.E, -2*V/(temp+0.01)));
			graph[C] = Math.random() > P ? -1 : 1;
		}

		if(!col) for(let i=0; i<speed; ++i){
			const C = Math.floor(Math.random()*ROWS*COLS)*3;

			let V = 0;
			if(memories) for(let j=0; j<ROWS*COLS; ++j){
				V += weight[0][C][j*3] * graph[j*3] / memories;
				if(negs) V -= weight[1][C][j*3] * graph[j*3] / negs;
			}

			const P = 1/(1+Math.pow(Math.E, -2*V/(temp+0.01)));
			graph[C] = Math.random() > P ? -1 : 1;
		}
	}

	for(let i=0; i<ROWS; ++i)
		for(let j=0; j<COLS; ++j){
			if(col)
				fill((graph[(i*COLS+j)*3]+1)*255/2,
				(graph[1+(i*COLS+j)*3]+1)*255/2,
				(graph[2+(i*COLS+j)*3]+1)*255/2);
			else
				fill((graph[(i*COLS+j)*3]+1)*255/2);

			rect(width/2-SZ*COLS/2 + SZ*j + E/2, height/2-SZ*ROWS/2 + SZ*i + E/2, SZ-E, SZ-E);
			if(mouseIsPressed &&
				Math.abs(width/2-SZ*COLS/2 + SZ*j + SZ/2 - mouseX) < SZ/2 &&
				Math.abs(height/2-SZ*ROWS/2 + SZ*i + SZ/2 - mouseY) < SZ/2){
				if(col) for(let k=0; k<3; ++k) graph[k+(i*COLS+j)*3] = COLORS[col][1][k];
				else{
					if(col2 == 0) col2 = -graph[(i*COLS+j)*3];
					for(let k=0; k<3; ++k) graph[k+(i*COLS+j)*3] = col2;
				}
			}
		}

	fill(225);
	
	button(run ? "PAUSE" : "RUN", width/2-130, height/2-SZ*ROWS/2-40, 50);
	button("SPEED: " + speed.toString(), width/2-30, height/2-SZ*ROWS/2-40, 50);

	fill((COLORS[col][1][0]+1)*255/2,
	(COLORS[col][1][1]+1)*255/2,
	(COLORS[col][1][2]+1)*255/2);
	button("COLOR: " + COLORS[col][0], width/2+100, height/2-SZ*ROWS/2-40, 50);
	fill(255)

	button("TEMPERATURE: " + (Math.floor(temp*10)/10).toString(), width/2, height/2-SZ*ROWS/2-80, 100);

	button("CLEAR", width/2-50, height/2+SZ*ROWS/2+40, 50);
	button("RANDOMIZE", width/2+50, height/2+SZ*ROWS/2+40, 50);
	button("DECORRELATE", width/2-80, height/2+SZ*ROWS/2+80, 50);
	button("CLEAR FEEDBACK", width/2+80, height/2+SZ*ROWS/2+80, 50);
	button("RESET MEMORIES", width/2-100, height/2+SZ*ROWS/2+120, 100);
	button("ADD MEMORY (" + memories.toString() + " stored)", width/2+100, height/2+SZ*ROWS/2+120, 100);

	if(paused){
		fill(0);
		text("PAUSED", width/2, 40);
		noLoop();
	}
}

function keyReleased(){
	if(key == 'a'){
		if(paused) { paused = false; loop(); }
		else paused = true;
	}
}

function button(T, x, y, w){
	textSize(mouseIn(x, y, w, 20) ? 17 : 16);
	text(T, x, y);
}

function mouseIn(x, y, w, h){
	return abs(x-mouseX) < w && abs(y-mouseY) < h;
}

function mouseWheel(e){
	if(mouseIn(width/2, height/2-SZ*ROWS/2-80, 100, 20))
		temp = Math.max(0, Math.min(10, temp + (e.delta < 0 ? 1 : -1)*0.1));

	if(mouseIn(width/2+100, height/2-SZ*ROWS/2-40, 50, 20))
		col = Math.max(0, Math.min(COLORS.length-1, col + (e.delta < 0 ? 1 : -1)));
}

function mouseReleased(){
	col2 = 0;

	if(mouseIn(width/2-130, height/2-SZ*ROWS/2-40, 50, 20)) run = !run;

	if(mouseIn(width/2-30, height/2-SZ*ROWS/2-40, 50, 20))
		speed = SPEEDS[(SPEEDS.indexOf(speed)+1)%SPEEDS.length];

	if(mouseIn(width/2+100, height/2-SZ*ROWS/2-40, 50, 20)) col = (col+1)%COLORS.length;

	if(mouseIn(width/2-50, height/2+SZ*ROWS/2+40, 50, 20))
		for(let i=0; i<ROWS*COLS*3; ++i) graph[i] = 1;

	if(mouseIn(width/2+50, height/2+SZ*ROWS/2+40, 50, 20))
		for(let i=0; i<ROWS*COLS*3; ++i) graph[i] = Math.random() > 0.5 ? 1 : -1;

	if(mouseIn(width/2-80, height/2+SZ*ROWS/2+80, 100, 20)){
		for(let i=0; i<ROWS*COLS*3; ++i)
			for(let j=0; j<ROWS*COLS*3; ++j)
				if(i != j) weight[1][i][j] += graph[i]*graph[j];
		++negs;
	}

	if(mouseIn(width/2+80, height/2+SZ*ROWS/2+80, 100, 20)){
		for(let i=0; i<ROWS*COLS*3; ++i)
			for(let j=0; j<ROWS*COLS*3; ++j)
				weight[1][i][j] = 0;
		negs = 0;
	}


	if(mouseIn(width/2-100, height/2+SZ*ROWS/2+120, 100, 20)){
		for(let i=0; i<ROWS*COLS*3; ++i)
			for(let j=0; j<ROWS*COLS*3; ++j)
				weight[0][i][j] = 0;
		for(let i=0; i<ROWS*COLS*3; ++i)
			for(let j=0; j<ROWS*COLS*3; ++j)
				weight[1][i][j] = 0;
		memories = 0;
		negs = 0;
	}

	if(mouseIn(width/2+100, height/2+SZ*ROWS/2+120, 100, 20)){
		for(let i=0; i<ROWS*COLS*3; ++i)
			for(let j=0; j<ROWS*COLS*3; ++j)
				if(i != j) weight[0][i][j] += graph[i]*graph[j];
		++memories;
	}
}
