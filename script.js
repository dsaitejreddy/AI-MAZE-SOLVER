const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const rows = 20;
const cols = 20;
const size = canvas.width / cols;

let grid = Array.from({ length: rows }, () => Array(cols).fill(0));
let mode = "";
let start = null;
let end = null;
let speed = 20;

// MODE
function setMode(m) { mode = m; }

// CLICK
canvas.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    let x = Math.floor((e.clientX - rect.left) / size);
    let y = Math.floor((e.clientY - rect.top) / size);

    if (mode === "wall") grid[y][x] = 1;
    else if (mode === "erase") grid[y][x] = 0;
    else if (mode === "start") start = { x, y };
    else if (mode === "end") end = { x, y };

    draw();
});

// DRAW
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {

            if (grid[i][j]) {
                ctx.fillStyle = "white";
                ctx.fillRect(j * size, i * size, size, size);
            }

            if (start && start.x === j && start.y === i) {
                ctx.fillStyle = "green";
                ctx.fillRect(j * size, i * size, size, size);
            }

            if (end && end.x === j && end.y === i) {
                ctx.fillStyle = "red";
                ctx.fillRect(j * size, i * size, size, size);
            }

            ctx.strokeStyle = "#222";
            ctx.strokeRect(j * size, i * size, size, size);
        }
    }
}

// PATH DRAW
function drawPath(parent) {
    let cur = end;
    while (cur) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(cur.x * size, cur.y * size, size, size);
        cur = parent[`${cur.x},${cur.y}`];
    }
}

// BFS
function runBFS() {
    if (!start || !end) return alert("Set Start & End");

    let q = [start], vis = new Set(), parent = {};

    while (q.length) {
        let cur = q.shift();
        let key = `${cur.x},${cur.y}`;
        if (vis.has(key)) continue;
        vis.add(key);

        if (cur.x === end.x && cur.y === end.y) {
            draw(); drawPath(parent); return;
        }

        [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{
            let nx = cur.x+dx, ny = cur.y+dy;
            if(nx>=0&&ny>=0&&nx<cols&&ny<rows&&!grid[ny][nx]){
                let k=`${nx},${ny}`;
                if(!vis.has(k)){
                    q.push({x:nx,y:ny});
                    parent[k]=cur;
                }
            }
        });
    }
}

// DFS
function runDFS() {
    if (!start || !end) return alert("Set Start & End");

    let s = [start], vis = new Set(), parent = {};

    while (s.length) {
        let cur = s.pop();
        let key = `${cur.x},${cur.y}`;
        if (vis.has(key)) continue;
        vis.add(key);

        if (cur.x === end.x && cur.y === end.y) {
            draw(); drawPath(parent); return;
        }

        [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{
            let nx=cur.x+dx, ny=cur.y+dy;
            if(nx>=0&&ny>=0&&nx<cols&&ny<rows&&!grid[ny][nx]){
                let k=`${nx},${ny}`;
                if(!vis.has(k)){
                    s.push({x:nx,y:ny});
                    parent[k]=cur;
                }
            }
        });
    }
}

// A*
function runAStar() {
    if (!start || !end) return alert("Set Start & End");

    let open=[start], g={}, f={}, parent={};
    g[`${start.x},${start.y}`]=0;

    while(open.length){
        open.sort((a,b)=> (g[`${a.x},${a.y}`]+heuristic(a,end)) - (g[`${b.x},${b.y}`]+heuristic(b,end)));
        let cur=open.shift();

        if(cur.x===end.x&&cur.y===end.y){
            draw(); drawPath(parent); return;
        }

        [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{
            let nx=cur.x+dx, ny=cur.y+dy;
            if(nx<0||ny<0||nx>=cols||ny>=rows||grid[ny][nx]) return;

            let k=`${nx},${ny}`;
            let temp=g[`${cur.x},${cur.y}`]+1;

            if(g[k]===undefined||temp<g[k]){
                g[k]=temp;
                parent[k]=cur;
                open.push({x:nx,y:ny});
            }
        });
    }
}

function heuristic(a,b){
    return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
}

// MAZE
function generateMaze(density){
    grid = grid.map(row => row.map(()=> Math.random()<density?1:0));
    draw();
}

// SPEED
function setSpeed(s){ speed=s; }

// TOGGLE (dummy)
function toggleExploration(){
    alert("Exploration toggle added!");
}

// CLEAR
function clearGrid(){
    grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    start=null; end=null;
    draw();
}

draw();