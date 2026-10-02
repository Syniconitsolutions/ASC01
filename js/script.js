

document.addEventListener('DOMContentLoaded', function(){

  /* Navbar scroll state + progress bar + back-to-top */
  var nav = document.getElementById('siteNav');
  var progressBar = document.getElementById('progressBar');
  var backTop = document.getElementById('backTop');
  function onScroll(){
    var y = window.scrollY;
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle('scrolled', y > 40);
    progressBar.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
    backTop.classList.toggle('show', y > 600);
  }
  document.addEventListener('scroll', onScroll);
  onScroll();
  backTop.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}); });

  /* Mobile nav panel */
  var panel = document.getElementById('mobilePanel');
  var toggle = document.getElementById('navToggle');
  var close = document.getElementById('mobileClose');
  function openPanel(){ panel.classList.add('open'); toggle.setAttribute('aria-expanded','true'); }
  function closePanel(){ panel.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }
  toggle.addEventListener('click', openPanel);
  close.addEventListener('click', closePanel);
  panel.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closePanel); });

  /* Active nav link on scroll */
  var sections = ['home','about','services','peb','projects','process','insights','contact'];
  var navAnchors = document.querySelectorAll('.nav-links a');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var id = entry.target.id;
        navAnchors.forEach(function(a){
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, {rootMargin:'-45% 0px -50% 0px'});
  sections.forEach(function(id){
    var el = document.getElementById(id);
    if(el) io.observe(el);
  });

  /* Stat counters — works for any number of stat blocks on a page (.stat, .mini-stat, or any [data-count]/[data-static] .num) */
  var allCounters = document.querySelectorAll('.num[data-count], .num[data-static]');
  if(allCounters.length){
    var runCounter = function(el){
      var staticVal = el.getAttribute('data-static');
      if(staticVal){ el.textContent = staticVal; return; }
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var current = 0;
      var step = Math.max(1, Math.ceil(target / 40));
      (function tick(){
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if(current < target) requestAnimationFrame(tick);
      })();
    };
    var counterIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          runCounter(entry.target);
          counterIo.unobserve(entry.target);
        }
      });
    }, {threshold:.4});
    allCounters.forEach(function(el){ counterIo.observe(el); });
  }

  /* PEB anatomy hotspots */
  var diagram = document.getElementById('pebDiagram');
  var tooltip = document.getElementById('pebTooltip');
  if(diagram && tooltip){
    var hotspots = document.querySelectorAll('.hotspot');
    var showTip = function(btn){
      hotspots.forEach(function(h){ h.classList.remove('active'); });
      btn.classList.add('active');
      tooltip.innerHTML = '<strong>' + btn.getAttribute('data-label') + '</strong>' + btn.getAttribute('data-desc');
      var left = parseFloat(btn.style.left);
      var top = parseFloat(btn.style.top);
      tooltip.style.left = (left > 60 ? left - 26 : left + 4) + '%';
      tooltip.style.top = (top > 70 ? top - 22 : top + 6) + '%';
      tooltip.classList.add('show');
    };
    hotspots.forEach(function(btn){
      btn.addEventListener('mouseenter', function(){ showTip(btn); });
      btn.addEventListener('focus', function(){ showTip(btn); });
      btn.addEventListener('click', function(e){ e.preventDefault(); showTip(btn); });
    });
    document.addEventListener('click', function(e){
      if(!diagram.contains(e.target)){
        hotspots.forEach(function(h){ h.classList.remove('active'); });
        tooltip.classList.remove('show');
      }
    });
  }

  /* Project filter */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      filterBtns.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      projectCards.forEach(function(card){
        var cats = card.getAttribute('data-category');
        card.classList.toggle('hidden', filter !== 'all' && cats.indexOf(filter) === -1);
      });
    });
  });

  /* Contact form (front-end only, no backend configured) */
  var form = document.getElementById('enquiryForm');
  var msg = document.getElementById('formMessage');
  if(form && msg){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(form.checkValidity()){
        msg.textContent = 'Thank you. Our team will contact you within one business day.';
        form.reset();
      } else {
        msg.style.color = '#B3261E';
        msg.textContent = 'Please fill in the required fields.';
      }
    });
  }


  /* Sub-nav tab active state (services page) */
  var subnavLinks = document.querySelectorAll('.subnav a');
  if(subnavLinks.length){
    var subSections = Array.prototype.map.call(subnavLinks, function(a){
      return document.querySelector(a.getAttribute('href'));
    }).filter(Boolean);
    var subIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var id = '#' + entry.target.id;
          subnavLinks.forEach(function(a){ a.classList.toggle('active', a.getAttribute('href') === id); });
        }
      });
    }, {rootMargin:'-30% 0px -55% 0px'});
    subSections.forEach(function(el){ subIo.observe(el); });
  }


  /* Subpage hero parallax */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var parallaxEls = document.querySelectorAll('.page-hero-photo-wrap');
  if(parallaxEls.length && !reduceMotion){
    var pTicking = false;
    var updateParallax = function(){
      var y = window.scrollY;
      var offset = Math.min(80, y * 0.22);
      parallaxEls.forEach(function(el){ el.style.transform = 'translateY(' + offset + 'px)'; });
      pTicking = false;
    };
    document.addEventListener('scroll', function(){
      if(!pTicking){ requestAnimationFrame(updateParallax); pTicking = true; }
    });
    updateParallax();
  }


  /* Hub diagram (What ASC Does) */
  var hubNodes = document.querySelectorAll('.hub-node');
  var hubPanel = document.getElementById('hubPanel');
  if(hubNodes.length && hubPanel){
    var showHub = function(node){
      hubNodes.forEach(function(n){ n.classList.remove('active'); });
      node.classList.add('active');
      hubPanel.innerHTML = '<strong>' + node.getAttribute('data-label') + '</strong><span>' + node.getAttribute('data-desc') + '</span>';
    };
    hubNodes.forEach(function(node){
      node.addEventListener('mouseenter', function(){ showHub(node); });
      node.addEventListener('focus', function(){ showHub(node); });
      node.addEventListener('click', function(e){ e.preventDefault(); showHub(node); });
    });
  }

  /* Process track — scroll-triggered connecting line */
  var processTrack = document.querySelector('.process-track');
  if(processTrack){
    var trackIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          processTrack.classList.add('in-view');
          trackIo.unobserve(processTrack);
        }
      });
    }, {threshold:.35});
    trackIo.observe(processTrack);
  }

});

