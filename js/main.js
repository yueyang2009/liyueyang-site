/* ===================================================
   李岳阳财税顾问官网 - 全局脚本
   =================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // ===================== 1. 移动端菜单切换 =====================
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.navbar-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // 点击导航链接后关闭菜单
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });

    // 点击页面其他区域关闭菜单
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.navbar')) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  // ===================== 2. 平滑滚动 =====================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===================== 3. 数据滚动条数字动画 =====================
  function animateCounter(element, target, suffix) {
    const duration = 2000; // 动画时长 ms
    const startTime = performance.now();
    suffix = suffix || '';

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      if (element.dataset.prefix) {
        element.textContent = element.dataset.prefix + current.toLocaleString() + suffix;
      } else {
        element.textContent = current.toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (element.dataset.prefix) {
          element.textContent = element.dataset.prefix + target.toLocaleString() + suffix;
        } else {
          element.textContent = target.toLocaleString() + suffix;
        }
      }
    }

    requestAnimationFrame(update);
  }

  // 启动数字动画 —— 使用 IntersectionObserver 触发
  const statNumbers = document.querySelectorAll('.hero-stat-number');

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const raw = el.dataset.target;
          const suffix = el.dataset.suffix || '';
          if (raw) {
            const target = parseInt(raw, 10);
            animateCounter(el, target, suffix);
          }
          statsObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) {
      statsObserver.observe(el);
    });
  } else {
    // 降级：直接显示数字
    statNumbers.forEach(function (el) {
      const raw = el.dataset.target;
      const suffix = el.dataset.suffix || '';
      if (raw) {
        if (el.dataset.prefix) {
          el.textContent = el.dataset.prefix + parseInt(raw, 10).toLocaleString() + suffix;
        } else {
          el.textContent = parseInt(raw, 10).toLocaleString() + suffix;
        }
      }
    });
  }

  // ===================== 4. 滚动渐入观察器 =====================
  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // 降级：直接显示
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ===================== 5. 服务卡片展开/收起 =====================
  document.querySelectorAll('.service-detail-card').forEach(function (card) {
    const header = card.querySelector('.service-detail-header');
    if (header) {
      header.addEventListener('click', function () {
        // 可选：同一时间只展开一个
        // 如果不需要互斥，注释掉下面的代码
        // if (!card.classList.contains('open')) {
        //   document.querySelectorAll('.service-detail-card.open').forEach(function (other) {
        //     other.classList.remove('open');
        //   });
        // }
        card.classList.toggle('open');
      });
    }
  });

  // 如果 URL 中有 hash（如 #service-0），自动展开对应卡片
  const hash = window.location.hash;
  if (hash) {
    const targetCard = document.querySelector(hash);
    if (targetCard && targetCard.classList.contains('service-detail-card')) {
      // 延迟一下等页面渲染完成
      setTimeout(function () {
        targetCard.classList.add('open');
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }

  // ===================== 6. 导航高亮当前页面 =====================
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    }
  });

});
