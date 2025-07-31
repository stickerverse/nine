// Vanilla JavaScript Vortex Effect
class VortexEffect {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.animationId = null;
    
    // Configuration
    this.particleCount = options.particleCount || 700;
    this.particlePropCount = 9;
    this.particlePropsLength = this.particleCount * this.particlePropCount;
    this.rangeY = options.rangeY || 100;
    this.baseTTL = 50;
    this.rangeTTL = 150;
    this.baseSpeed = options.baseSpeed || 0.0;
    this.rangeSpeed = options.rangeSpeed || 1.5;
    this.baseRadius = options.baseRadius || 1;
    this.rangeRadius = options.rangeRadius || 2;
    this.baseHue = options.baseHue || 220;
    this.rangeHue = 100;
    this.noiseSteps = 3;
    this.xOff = 0.00125;
    this.yOff = 0.00125;
    this.zOff = 0.0005;
    this.backgroundColor = options.backgroundColor || '#000000';
    
    this.tick = 0;
    this.particleProps = new Float32Array(this.particlePropsLength);
    this.center = [0, 0];
    
    // Constants
    this.HALF_PI = 0.5 * Math.PI;
    this.TAU = 2 * Math.PI;
    this.TO_RAD = Math.PI / 180;
    
    this.init();
  }
  
  // Simple noise function (simplified version)
  noise3D(x, y, z) {
    // Simple pseudo-random noise function
    const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    return n - Math.floor(n);
  }
  
  rand(n) {
    return n * Math.random();
  }
  
  randRange(n) {
    return n - this.rand(2 * n);
  }
  
  fadeInOut(t, m) {
    const hm = 0.5 * m;
    return Math.abs(((t + hm) % m) - hm) / hm;
  }
  
  lerp(n1, n2, speed) {
    return (1 - speed) * n1 + speed * n2;
  }
  
  init() {
    this.resize();
    this.initParticles();
    this.draw();
    
    // Handle window resize
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    const container = this.canvas.parentElement;
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    
    this.center[0] = 0.5 * this.canvas.width;
    this.center[1] = 0.5 * this.canvas.height;
  }
  
  initParticles() {
    this.tick = 0;
    this.particleProps = new Float32Array(this.particlePropsLength);
    
    for (let i = 0; i < this.particlePropsLength; i += this.particlePropCount) {
      this.initParticle(i);
    }
  }
  
  initParticle(i) {
    const x = this.rand(this.canvas.width);
    const y = this.center[1] + this.randRange(this.rangeY);
    const vx = 0;
    const vy = 0;
    const life = 0;
    const ttl = this.baseTTL + this.rand(this.rangeTTL);
    const speed = this.baseSpeed + this.rand(this.rangeSpeed);
    const radius = this.baseRadius + this.rand(this.rangeRadius);
    const hue = this.baseHue + this.rand(this.rangeHue);
    
    this.particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
  }
  
  draw() {
    this.tick++;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Background
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawParticles();
    this.renderGlow();
    
    this.animationId = requestAnimationFrame(() => this.draw());
  }
  
  drawParticles() {
    for (let i = 0; i < this.particlePropsLength; i += this.particlePropCount) {
      this.updateParticle(i);
    }
  }
  
  updateParticle(i) {
    const i2 = 1 + i;
    const i3 = 2 + i;
    const i4 = 3 + i;
    const i5 = 4 + i;
    const i6 = 5 + i;
    const i7 = 6 + i;
    const i8 = 7 + i;
    const i9 = 8 + i;
    
    const x = this.particleProps[i];
    const y = this.particleProps[i2];
    const n = this.noise3D(x * this.xOff, y * this.yOff, this.tick * this.zOff) * this.noiseSteps * this.TAU;
    const vx = this.lerp(this.particleProps[i3], Math.cos(n), 0.5);
    const vy = this.lerp(this.particleProps[i4], Math.sin(n), 0.5);
    const life = this.particleProps[i5];
    const ttl = this.particleProps[i6];
    const speed = this.particleProps[i7];
    const x2 = x + vx * speed;
    const y2 = y + vy * speed;
    const radius = this.particleProps[i8];
    const hue = this.particleProps[i9];
    
    this.drawParticle(x, y, x2, y2, life, ttl, radius, hue);
    
    const newLife = life + 1;
    
    this.particleProps[i] = x2;
    this.particleProps[i2] = y2;
    this.particleProps[i3] = vx;
    this.particleProps[i4] = vy;
    this.particleProps[i5] = newLife;
    
    if (this.checkBounds(x, y) || newLife > ttl) {
      this.initParticle(i);
    }
  }
  
  drawParticle(x, y, x2, y2, life, ttl, radius, hue) {
    this.ctx.save();
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = radius;
    this.ctx.strokeStyle = `hsla(${hue},100%,60%,${this.fadeInOut(life, ttl)})`;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();
  }
  
  checkBounds(x, y) {
    return x > this.canvas.width || x < 0 || y > this.canvas.height || y < 0;
  }
  
  renderGlow() {
    this.ctx.save();
    this.ctx.filter = 'blur(8px) brightness(200%)';
    this.ctx.globalCompositeOperation = 'lighter';
    this.ctx.drawImage(this.canvas, 0, 0);
    this.ctx.restore();
    
    this.ctx.save();
    this.ctx.filter = 'blur(4px) brightness(200%)';
    this.ctx.globalCompositeOperation = 'lighter';
    this.ctx.drawImage(this.canvas, 0, 0);
    this.ctx.restore();
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.resize);
  }
}

// Initialize vortex effect on page load
document.addEventListener('DOMContentLoaded', function() {
  const vortexContainer = document.getElementById('vortex-container');
  if (vortexContainer) {
    const canvas = vortexContainer.querySelector('canvas');
    if (canvas) {
      new VortexEffect(canvas, {
        backgroundColor: 'black',
        particleCount: 700,
        baseHue: 220
      });
    }
  }
}); 