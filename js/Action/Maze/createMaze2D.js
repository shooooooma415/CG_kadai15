export let mazel = 21; // 迷路のサイズ（奇数が推奨）
export let maze = [];

export function createMaze() {
    for (let x = 0; x <= mazel; x++) {
        maze[x] = [];
        for (let y = 0; y <= mazel; y++) {
            maze[x][y] = 0;
        }
    }
    for (let x = 0; x <= mazel; x++) {
        maze[x][0] = 1;
        maze[x][mazel] = 1;
    }
    for (let y = 0; y <= mazel; y++) {
        maze[0][y] = 1;
        maze[maze.length - 1][y] = 1;
    }
    for (let x = 2; x < (mazel - 1); x += 2) {
        for (let y = 2; y < (mazel - 1); y += 2) {
            maze[x][y] = 1;
            while (true) {
                let rr = 0; // 0: ↑, 1: →, 2: ↓, 3: ←
                let xx = x, yy = y;
                if (y === 2) {
                    rr = Math.floor(Math.random() * 4);
                } else {
                    rr = Math.floor(Math.random() * 3) + 1;
                }
                if (rr === 0) { yy--; }
                if (rr === 1) { xx++; }
                if (rr === 2) { yy++; }
                if (rr === 3) { xx--; }
                if (maze[xx][yy] === 0) {
                    maze[xx][yy] = 1;
                    break;
                }
            }
        }
    }
}
