function gel(id) {
    return document.getElementById(id);
}

function degToRad(deg) {
    return deg * Math.PI / 180.0;
}

function radToDeg(rad) {
    return rad * 180.0 / Math.PI;
}

function rotate(point, deg, center) {
    if (!deg) {
        return point;
    }
    
    center = center || [0, 0];
    
    let rad = degToRad(deg);
    let x   = point[X];
    let y   = point[Y];
    let h   = center[X];
    let k   = center[Y];
    
    let cosA = Math.cos(rad);
    let sinA = Math.sin(rad);
    
    let xp = x * cosA - y * sinA + h;
    let yp = y * cosA + x * sinA + k;
    
    return [xp, yp];
}

// used for getting items from 2D point-array
const X  = 0;
const Y  = 1;
const DX = 0;
const DY = 1;