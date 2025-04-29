// @ts-ignore
const nodeWebcam = require('node-webcam');
const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'test-captures');
if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);

const tryDevices = [0, 1, 'win32', 'dshow']; // Common Windows options

function testCamera(device: string | number) {
  const testFile = path.join(testDir, `test-${device}-${Date.now()}.jpg`);
  const Webcam = nodeWebcam.create({
    width: 640,
    height: 480,
    quality: 80,
    device: device,
    callbackReturn: 'base64',
    verbose: true
  });

  console.log(`Testing device: ${device}`);
  Webcam.capture(testFile, (err: Error | null, data: string) => {
    if (err) {
      console.error(`❌ ${device} failed:`, err.message);
      const next = tryDevices.shift();
      if (next) testCamera(next);
    } else {
      fs.writeFileSync(testFile, Buffer.from(data, 'base64'));
      console.log(`✅ Working with ${device}! Image saved.`);
    }
  });
}

testCamera(tryDevices.shift()!);