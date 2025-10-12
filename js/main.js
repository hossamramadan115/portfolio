// menu toggle
const btn = document.getElementById('menu-btn');
const nav = document.getElementById('nav-links');

btn && btn.addEventListener('click', ()=> {
  if (!nav) return;
  if (nav.style.display === 'block') nav.style.display = '';
  else nav.style.display = 'block';
});

// current year
document.getElementById('year').textContent = new Date().getFullYear();

// smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', function(e){
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
      if (window.innerWidth < 920 && nav) nav.style.display = '';
    }
  })
})
