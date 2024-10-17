
function createBoundingBox(mesh) {
    const box = new THREE.Box3().setFromObject(mesh);
    return box;
}

// 壁とロボットの当たり判定を行う関数
export function checkCollision(x, z, walls) {
    for (let wall of walls) {
        const wallBox = createBoundingBox(wall);
        const robotBox = createBoundingBox(new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1)));
        robotBox.setFromCenterAndSize(new THREE.Vector3(x, 1, z), new THREE.Vector3(1, 2, 1));

        if (wallBox.intersectsBox(robotBox)) {
            console.log("true")
            return true;  // 壁と衝突している場合
            
        }
    }
    console.log("false")
    return false;  // 衝突していない場合
}

