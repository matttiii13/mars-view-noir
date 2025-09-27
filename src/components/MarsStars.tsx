import { useEffect, useRef } from 'react';

const MarsStars = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    const stars: Array<{ x: number; y: number; size: number; speed: number; opacity: number }> = [];
    const dustParticles: Array<{ x: number; y: number; size: number; speed: number; opacity: number }> = [];
    const numStars = 120;
    const numDust = 30;

    // Create stars with Mars-like colors
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.8 + 0.2,
      });
    }

    // Create dust particles
    for (let i = 0; i < numDust; i++) {
      dustParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.1 + 0.05,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars with Mars-like twinkle
      stars.forEach(star => {
        star.y += star.speed;
        
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        // Mars-like star colors (reddish white)
        const colors = [
          `rgba(255, 220, 180, ${star.opacity})`, // Warm white
          `rgba(255, 200, 150, ${star.opacity})`, // Orange-ish
          `rgba(255, 180, 120, ${star.opacity})`, // More orange
        ];
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fill();
      });

      // Draw dust particles
      dustParticles.forEach(dust => {
        dust.x += dust.speed;
        dust.y += dust.speed * 0.3;
        
        if (dust.x > canvas.width) {
          dust.x = -10;
          dust.y = Math.random() * canvas.height;
        }

        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 100, 50, ${dust.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default MarsStars;