import { useEffect, useRef } from "react";

/**
 * Canvas-based animated background with falling money particles
 * Lightweight, smooth, and CPU efficient
 * Perfect for finance/money theme
 */
export default function CanvasAnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.vx = (Math.random() - 0.5) * 2; // Horizontal velocity
        this.vy = Math.random() * 3 + 2; // Vertical velocity
        this.size = Math.random() * 30 + 10;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.type = Math.random();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // Wrap around edges
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = -50;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Draw based on type
        if (this.type < 0.3) {
          // Coin emoji
          ctx.font = `${this.size}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("💰", 0, 0);
        } else if (this.type < 0.6) {
          // Dollar bill emoji
          ctx.font = `${this.size}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("💵", 0, 0);
        } else if (this.type < 0.8) {
          // Diamond emoji
          ctx.font = `${this.size}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("💎", 0, 0);
        } else {
          // Graph emoji
          ctx.font = `${this.size}px Arial`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("📈", 0, 0);
        }

        ctx.restore();
      }
    }

    // Create particles
    const particles = [];
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      // Clear canvas with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(
        0,
        "rgba(102, 126, 234, 0.95)"
      ); // Purple
      gradient.addColorStop(0.5, "rgba(240, 147, 251, 0.95)"); // Pink
      gradient.addColorStop(1, "rgba(79, 172, 254, 0.95)"); // Blue
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add some animated shapes in background
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";

      // Animated circles
      for (let i = 0; i < 3; i++) {
        const time = Date.now() * 0.0001;
        const x = canvas.width / 2 + Math.cos(time + i) * 200;
        const y = canvas.height / 2 + Math.sin(time + i) * 200;
        const radius = 150 + Math.sin(time + i * 2) * 50;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Reset alpha
      ctx.globalAlpha = 1;

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Occasionally add new particles
      if (Math.random() < 0.3) {
        if (particles.length < particleCount + 10) {
          particles.push(new Particle());
        }
      }

      // Remove old particles
      particles.splice(0, Math.max(0, particles.length - particleCount - 5));

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full blur-sm"
      style={{
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #667eea 100%)",
      }}
    />
  );
}
