export const drawHand = (
  ctx: CanvasRenderingContext2D,
  landmarks: Array<[number, number, number]>
) => {
  if (!ctx) return;

  // Draw connections
  const fingerConnections = [
    [0, 1, 2, 3, 4],       // Thumb
    [0, 5, 6, 7, 8],       // Index
    [0, 9, 10, 11, 12],    // Middle
    [0, 13, 14, 15, 16],   // Ring
    [0, 17, 18, 19, 20]    // Pinky
  ];

  // Set drawing styles
  ctx.strokeStyle = '#00FFFF';
  ctx.fillStyle = '#FF0000';
  ctx.lineWidth = 2;

  // Draw connections
  fingerConnections.forEach(connection => {
    ctx.beginPath();
    connection.forEach((jointIdx, i) => {
      const [x, y] = landmarks[jointIdx];
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  });

  // Draw landmarks
  landmarks.forEach(landmark => {
    const [x, y] = landmark;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });
};