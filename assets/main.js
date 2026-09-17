/* ========== AOS Initialization ========== */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 80,
      easing: 'ease-out-cubic',
    });
  }

  initNavbar();
  initCounters();
  initHeroCanvas();
  initCharts();
  initTimelineTabs();
  initContactForm();
  initBackToTop();
});

/* ========== Navbar ========== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });
}

/* ========== Animated Counters ========== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target, 1500);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el, target, duration) {
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

/* ========== Hero Canvas Particle Network ========== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 55;
  const connectionDistance = 130;
  let mouse = { x: null, y: null };
  let rafId;
  let isVisible = true;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
      });
    }
  }

  function draw() {
    if (!isVisible) return;
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(37, 99, 235, 0.55)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${0.2 * (1 - dist / connectionDistance)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      if (mouse.x !== null && mouse.y !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectionDistance * 1.6) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(8, 145, 178, ${0.24 * (1 - dist / (connectionDistance * 1.6))})`;
          ctx.stroke();
        }
      }
    });

    rafId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const heroSection = document.getElementById('home');
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible && !rafId) draw();
      else if (!isVisible && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });
  }, { threshold: 0.05 });
  visibilityObserver.observe(heroSection);
}

/* ========== ECharts ========== */
function initCharts() {
  if (typeof echarts === 'undefined') return;

  const chartInstances = [];

  const commonOption = {
    backgroundColor: 'transparent',
    textStyle: { fontFamily: '"Inter", "Noto Sans SC", sans-serif', color: '#1e293b' },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      borderColor: 'rgba(37, 99, 235, 0.25)',
      textStyle: { color: '#1e293b' },
      extraCssText: 'box-shadow: 0 6px 24px rgba(37,99,235,0.12);',
    },
  };

  // Radar Chart
  const radarChart = echarts.init(document.getElementById('radarChart'));
  radarChart.setOption({
    ...commonOption,
    color: ['#0891b2'],
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      borderColor: 'rgba(37, 99, 235, 0.25)',
      textStyle: { color: '#1e293b' },
    },
    radar: {
      indicator: [
        { name: 'HarmonyOS\n移动开发', max: 100 },
        { name: '网络与\n通信技术', max: 100 },
        { name: '数据挖掘\n与大数据', max: 100 },
        { name: 'Java Web\n开发', max: 100 },
        { name: '嵌入式\n开发', max: 100 },
        { name: '人工智能\n基础', max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 4,
      axisName: {
        color: '#475569',
        fontSize: 12,
        lineHeight: 16,
      },
      splitLine: {
        lineStyle: { color: 'rgba(37, 99, 235, 0.14)' },
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(37, 99, 235, 0.03)', 'rgba(37, 99, 235, 0.06)'],
        },
      },
      axisLine: {
        lineStyle: { color: 'rgba(37, 99, 235, 0.14)' },
      },
    },
    series: [{
      type: 'radar',
      data: [{
        value: [96, 94, 92, 90, 84, 82],
        name: '综合能力',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(8, 145, 178, 0.5)' },
            { offset: 1, color: 'rgba(37, 99, 235, 0.15)' },
          ]),
        },
        lineStyle: { width: 2, color: '#0891b2' },
        itemStyle: { color: '#0891b2' },
      }],
    }],
  });
  chartInstances.push(radarChart);

  // Course Distribution Donut Chart
  const courseChart = echarts.init(document.getElementById('courseChart'));
  courseChart.setOption({
    ...commonOption,
    color: ['#2563eb', '#059669', '#7c3aed', '#0891b2'],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} 门 ({d}%)',
    },
    legend: {
      bottom: '4%',
      textStyle: { color: '#475569' },
      itemWidth: 12,
      itemHeight: 12,
    },
    series: [{
      type: 'pie',
      radius: ['42%', '68%'],
      center: ['50%', '46%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#ffffff',
        borderWidth: 3,
      },
      label: {
        show: true,
        color: '#1e293b',
        formatter: '{b}\n{c}门',
      },
      labelLine: {
        lineStyle: { color: 'rgba(148, 163, 184, 0.3)' },
      },
      emphasis: {
        label: { show: true, fontSize: 14, fontWeight: 'bold' },
        itemStyle: { shadowBlur: 20, shadowColor: 'rgba(0,0,0,0.4)' },
      },
      data: [
        { value: 1, name: '移动开发' },
        { value: 3, name: 'Web 与编程' },
        { value: 2, name: '数据与 AI' },
        { value: 4, name: '网络与通信' },
      ],
    }],
  });
  chartInstances.push(courseChart);

  // Competition Mentoring Bar Chart
  const competitionChart = echarts.init(document.getElementById('competitionChart'));
  competitionChart.setOption({
    ...commonOption,
    color: ['#2563eb', '#0891b2'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: {
      top: '4%',
      textStyle: { color: '#475569' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '16%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['蓝桥杯', '华为 ICT', '大唐杯'],
      axisLine: { lineStyle: { color: 'rgba(37, 99, 235, 0.2)' } },
      axisLabel: { color: '#475569' },
    },
    yAxis: {
      type: 'value',
      name: '指导届数/年',
      nameTextStyle: { color: '#94a3b8' },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: 'rgba(37, 99, 235, 0.1)' } },
      axisLabel: { color: '#475569' },
    },
    series: [
      {
        name: '省级奖项',
        type: 'bar',
        stack: 'total',
        barWidth: '45%',
        itemStyle: { borderRadius: [0, 0, 4, 4] },
        data: [3, 2, 2],
      },
      {
        name: '国家级奖项',
        type: 'bar',
        stack: 'total',
        barWidth: '45%',
        itemStyle: { borderRadius: [4, 4, 0, 0] },
        data: [2, 2, 1],
      },
    ],
  });
  chartInstances.push(competitionChart);

  window.addEventListener('resize', () => {
    chartInstances.forEach(chart => chart && chart.resize());
  });
}

/* ========== Timeline Tabs ========== */
function initTimelineTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.timeline-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      contents.forEach(c => c.classList.remove('active'));
      const target = document.getElementById(tab === 'honors' ? 'honorsTab' : 'appointmentsTab');
      if (target) {
        target.classList.add('active');
        // Trigger AOS refresh for newly visible items
        if (typeof AOS !== 'undefined') AOS.refresh();
      }
    });
  });
}

/* ========== Contact Form Demo ========== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-check"></i> 已收到留言';
    btn.disabled = true;
    btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

/* ========== Back to Top ========== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
