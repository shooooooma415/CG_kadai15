import { createMaze, maze, mazel } from './createMaze2D.js';

export function createMaze3D(scene) {
    createMaze();

    const walls = [];
    const wallGeometry = new THREE.BoxGeometry(1, 2, 1);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    for (let x = 0; x <= mazel; x++) {
        for (let y = 0; y <= mazel; y++) {
            if (maze[x][y] === 1) { 
                const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                wall.position.set(x, 0.5, y);

                scene.add(wall);
                walls.push(wall);
            }
        }
    }

    return walls;
}
