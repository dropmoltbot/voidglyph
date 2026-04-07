'use client';
import { useEffect, useRef } from 'react';

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'VOIDGLYPH∞01ΣψλΔΦΩ★☆✦⟨⟩⟁⬡⬢◊◈◇△▽⟐⟑';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx!.fillStyle = 'rgba(10, 10, 18, 0.05)';
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      ctx!.fillStyle = '#00ff9d';
      ctx!.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        if (Math.random() > 0.98) ctx!.fillStyle = '#ff007f';
        else if (Math.random() > 0.95) ctx!.fillStyle = '#00f7ff';
        else ctx!.fillStyle = `rgba(0, 255, 157, ${0.4 + Math.random() * 0.6})`;

        ctx!.fillText(char, x, y);
        if (y > canvas!.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
  }, []);

  return <canvas ref={canvasRef} className="matrix-canvas" />;
}
