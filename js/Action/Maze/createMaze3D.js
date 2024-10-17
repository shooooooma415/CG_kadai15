import { createMaze, maze, mazel } from './createMaze2D.js';

export function createMaze3D(scene) {
    createMaze(); // 2D迷路を生成する

    // 壁のジオメトリとマテリアル
    const wallGeometry = new THREE.BoxGeometry(1, 2, 1);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    // 迷路の壁を3Dボックスとして配置
    for (let x = 0; x <= mazel; x++) {
        for (let y = 0; y <= mazel; y++) {
            if (maze[x][y] === 1) { // 壁がある場合
                const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                wall.position.set(x, 0.5, y); // Yは高さ
                scene.add(wall);
            }
        }
    }
}
