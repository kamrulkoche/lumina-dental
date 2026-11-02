// Paste into Chrome DevTools Console (F12 -> Console) while the reel
// https://www.facebook.com/reel/1292965033904944 is open.
// It pauses the 10s reel, grabs a frame every 0.25s at native 720x1280,
// and saves them all as one file: lumina-reel-frames.json (~7.8 MB).
(async () => {
  const v = [...document.querySelectorAll('video')].find(x => Math.abs(x.duration - 10) < 1);
  if (!v) return console.error('Reel video not found - let it start playing, then rerun.');
  v.pause();
  const out = {};
  for (let i = 0; i <= 40; i++) {
    const t = Math.min(i * 0.25, 9.95);
    v.currentTime = t;
    await new Promise(r => v.addEventListener('seeked', r, { once: true }));
    const c = document.createElement('canvas');
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    out[`frame_${t.toFixed(2).padStart(5, '0')}s.jpg`] = c.toDataURL('image/jpeg', 0.95);
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], { type: 'application/json' }));
  a.download = 'lumina-reel-frames.json';
  a.click();
  console.log('Saved', Object.keys(out).length, 'frames');
})();
