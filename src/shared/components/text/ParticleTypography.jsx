import React, { useRef, useEffect } from "react";
import { useCssVarColor } from "@/shared/hooks/useCssVarColor";

/**
 * Renders `text` as a field of particles sampled from its glyph shapes on an
 * offscreen canvas. Particles start scattered and spring into formation once
 * scrolled into view, then scatter away from the cursor on hover — a Canvas2D
 * effect (no WebGL needed for 2D pixel sampling + simple point rendering).
 */
export const ParticleTypography = ({
  text,
  colorVar = "--text",
  fallbackColor = "#e6f1ff",
  fontSize = 90,
  fontFamily = "Montserrat, sans-serif",
  fontWeight = 900,
  particleSize = 1.6,
  particleDensity = 4,
  dispersionStrength = 55,
  returnSpeed = 0.08,
  height = 140,
  glow = false,
  glowBlur = 12,
  className = "",
}) => {
  const canvasRef = useRef(null);
  const color = useCssVarColor(colorVar, fallbackColor);
  const colorRef = useRef(color);
  colorRef.current = color;

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let particles = [];
    let inView = false;
    let width = 0;

    const buildParticles = () => {
      width = parent.clientWidth;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;
      const octx = off.getContext("2d");
      octx.fillStyle = "#fff";
      octx.textAlign = "center";
      octx.textBaseline = "middle";

      let size = fontSize;
      octx.font = `${fontWeight} ${size}px ${fontFamily}`;
      while (octx.measureText(text).width > width * 0.94 && size > 24) {
        size -= 2;
        octx.font = `${fontWeight} ${size}px ${fontFamily}`;
      }
      octx.fillText(text, width / 2, height / 2);

      // Keep roughly the same sampling density relative to glyph stroke
      // width even after the font has shrunk to fit a narrow container —
      // otherwise a fixed pixel stride leaves shrunk strokes too sparse to
      // read as letters.
      const density = Math.max(1, Math.round((size / fontSize) * particleDensity));

      const imageData = octx.getImageData(0, 0, width, height).data;
      const next = [];
      for (let y = 0; y < height; y += density) {
        for (let x = 0; x < width; x += density) {
          const alpha = imageData[(y * width + x) * 4 + 3];
          if (alpha > 128) {
            next.push({
              x: Math.random() * width,
              y: Math.random() * height,
              tx: x,
              ty: y,
              vx: 0,
              vy: 0,
            });
          }
        }
      }
      particles = next;
    };

    buildParticles();
    window.addEventListener("resize", buildParticles);

    const mouse = { x: -9999, y: -9999, active: false };
    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const handleLeave = () => {
      mouse.active = false;
    };
    canvas.addEventListener("pointermove", handleMove);
    canvas.addEventListener("pointerleave", handleLeave);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          inView = true;
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(canvas);

    let rafId;
    const influenceRadius = 70;

    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = colorRef.current;
      if (glow) {
        ctx.shadowColor = colorRef.current;
        ctx.shadowBlur = glowBlur;
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          if (dist < influenceRadius) {
            const force = (1 - dist / influenceRadius) * dispersionStrength;
            p.vx += (dx / dist) * force * 0.05;
            p.vy += (dy / dist) * force * 0.05;
          }
        }

        if (inView) {
          p.vx += (p.tx - p.x) * returnSpeed;
          p.vy += (p.ty - p.y) * returnSpeed;
        }
        p.vx *= 0.82;
        p.vy *= 0.82;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", buildParticles);
      canvas.removeEventListener("pointermove", handleMove);
      canvas.removeEventListener("pointerleave", handleLeave);
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, fontSize, fontFamily, fontWeight, particleSize, particleDensity, dispersionStrength, returnSpeed, height, glow, glowBlur]);

  return (
    <div className={className} style={{ width: "100%", height }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
};
