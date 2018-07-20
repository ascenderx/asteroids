function strokePolygon(ctx, color, points, center) {
    center = center || [0, 0];
    ctx.strokeStyle = color;
    ctx.lineWidth = '2';
    ctx.beginPath();
    ctx.moveTo(points[0][X] + center[X], points[0][Y] + center[Y]);
    for (let p = 1; p < points.length; p++) {
        ctx.lineTo(points[p][X] + center[X], points[p][Y] + center[Y]);
    }
    ctx.closePath();
    ctx.stroke();
}

function drawPoint(ctx, position, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth   = '1';
    ctx.beginPath();
    ctx.rect(position[X], position[Y], 2, 2);
    ctx.stroke();
}
