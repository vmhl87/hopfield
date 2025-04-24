const ROWS = 8, COLS = 8, SZ = 40;

let graph = new Array(ROWS*COLS).fill(1),
	weights = new Array(ROWS*COLS);

for(let i=0; i<ROWS*COLS; ++i)
	weights[i] = new Array(ROWS*COLS).fill(1);

function setup(){
	createCanvas(windowWidth, windowHeight);
}

function draw(){
	background(100);

	// draw graph
	
	noStroke();
	for(let i=0; i<ROWS; ++i)
		for(let j=0; j<COLS; ++j){
			fill((graph[i*COLS+j]+1)*255/2);
			rect(width/2-SZ*COLS/2 + SZ*j, height/2-SZ*ROWS/2 + SZ*i, SZ, SZ);
		}
}
