const rows = 20, cols = 20, size = 20;

const bfsCanvas = document.getElementById("bfsCanvas");
const dfsCanvas = document.getElementById("dfsCanvas");
const astarCanvas = document.getElementById("astarCanvas");

[bfsCanvas, dfsCanvas, astarCanvas].forEach(c => {
    c.width = cols * size;
    c.height = rows * size;
});

const bfsCtx = bfsCanvas.getContext("2d");
const dfsCtx = dfsCanvas.getContext("2d");
const astarCtx = astarCanvas.getContext("2d");

let mode = "";
let start = null;
let end = null;

function createMaze() {
return [
[0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
[1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0],
[0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0],
[0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0],
[0,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0],
[0,1,0,1,1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,0],
[0,1,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0],
[0,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,0],
[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0],
[0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0],
[0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0],
[0,1,0,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0],
[0,1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0],
[0,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0],
[0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,1,0],
[0,1,1,1,1,0,1,1,1,0,1,1,1,0,1,0,1,0,1,0],
[0,1,0,0,1,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0],
[0,1,0,0,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0],
[0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0],
[0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0]
];
}

let maze = createMaze();

function draw(ctx) {
    ctx.clearRect(0,0,cols*size,rows*size);

    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            if(maze[i][j]){
                ctx.fillStyle="#1f2937";
                ctx.fillRect(j*size,i*size,size,size);
            }
            ctx.strokeRect(j*size,i*size,size,size);
        }
    }

    if(start){
        ctx.fillStyle="red";
        ctx.fillRect(start.x*size,start.y*size,size,size);
    }

    if(end){
        ctx.fillStyle="lime";
        ctx.fillRect(end.x*size,end.y*size,size,size);
    }
}

[bfsCanvas, dfsCanvas, astarCanvas].forEach(canvas=>{
    canvas.addEventListener("click",e=>{
        let rect=canvas.getBoundingClientRect();
        let x=Math.floor((e.clientX-rect.left)/size);
        let y=Math.floor((e.clientY-rect.top)/size);

        if(mode==="start") start={x,y};
        if(mode==="end") end={x,y};

        drawAll();
    });
});

function setMode(m){ mode=m; }

function drawAll(){
    draw(bfsCtx);
    draw(dfsCtx);
    draw(astarCtx);
}

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function runBFS(){
let q=[start],vis=new Set();
while(q.length){
let cur=q.shift();
let key=`${cur.x},${cur.y}`;
if(vis.has(key)) continue;
vis.add(key);

bfsCtx.fillStyle="blue";
bfsCtx.fillRect(cur.x*size,cur.y*size,size,size);
await sleep(5);

if(cur.x===end.x&&cur.y===end.y) return;

[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{
let nx=cur.x+dx,ny=cur.y+dy;
if(nx>=0&&ny>=0&&nx<cols&&ny<rows&&!maze[ny][nx]){
q.push({x:nx,y:ny});
}
});
}
}

async function runDFS(){
let stack=[start],vis=new Set();
while(stack.length){
let cur=stack.pop();
let key=`${cur.x},${cur.y}`;
if(vis.has(key)) continue;
vis.add(key);

dfsCtx.fillStyle="green";
dfsCtx.fillRect(cur.x*size,cur.y*size,size,size);
await sleep(5);

if(cur.x===end.x&&cur.y===end.y) return;

[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{
let nx=cur.x+dx,ny=cur.y+dy;
if(nx>=0&&ny>=0&&nx<cols&&ny<rows&&!maze[ny][nx]){
stack.push({x:nx,y:ny});
}
});
}
}

async function runAStar(){
let open=[start],vis=new Set();
while(open.length){
let cur=open.shift();
let key=`${cur.x},${cur.y}`;
if(vis.has(key)) continue;
vis.add(key);

astarCtx.fillStyle="purple";
astarCtx.fillRect(cur.x*size,cur.y*size,size,size);
await sleep(5);

if(cur.x===end.x&&cur.y===end.y) return;

[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{
let nx=cur.x+dx,ny=cur.y+dy;
if(nx>=0&&ny>=0&&nx<cols&&ny<rows&&!maze[ny][nx]){
open.push({x:nx,y:ny});
}
});
}
}

function runAll(){
if(!start||!end){
alert("Select Start and End");
return;
}
runBFS();
runDFS();
runAStar();
}

function resetAll(){
start=null;
end=null;
drawAll();
}

drawAll();