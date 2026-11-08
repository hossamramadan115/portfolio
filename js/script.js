// menu toggle
const btn = document.getElementById("menu-btn");
const nav = document.getElementById("nav-links");

if (btn && nav) {
    btn.addEventListener("click", () => {
        nav.classList.toggle("show");
    });
}

// current year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", function (e) {
        const id = this.getAttribute("href");
        if (!id || id.length < 2) return; // ignore plain "#"
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            if (window.innerWidth < 920 && nav) nav.classList.remove("show");
        }
    });
});

// ===== Showcase galleries (Speed Fleet + Thiqah) =====
(function () {
    const lb = document.getElementById("sf-lightbox");
    const lbImg = document.getElementById("sf-lb-img");
    if (!lb || !lbImg) return;

    let list = [];
    let current = 0;

    const show = (i) => {
        if (!list.length) return;
        current = (i + list.length) % list.length;
        lbImg.src = list[current].src;
        lbImg.alt = list[current].alt;
    };
    const open = (imgs, i) => {
        list = imgs;
        show(i);
        lb.classList.add("open");
        lb.setAttribute("aria-hidden", "false");
    };
    const close = () => {
        lb.classList.remove("open");
        lb.setAttribute("aria-hidden", "true");
    };

    document.getElementById("sf-close")?.addEventListener("click", close);
    document.getElementById("sf-lb-prev")?.addEventListener("click", () => show(current - 1));
    document.getElementById("sf-lb-next")?.addEventListener("click", () => show(current + 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
        if (!lb.classList.contains("open")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") show(current - 1);
        if (e.key === "ArrowRight") show(current + 1);
    });

    function initGallery(ids) {
        const track = document.getElementById(ids.track);
        if (!track) return;

        const bar = document.getElementById(ids.bar);
        const getImgs = () => Array.from(track.querySelectorAll("img"));
        const step = () => (track.querySelector("figure")?.offsetWidth || 220) + 22;

        document.getElementById(ids.prev)?.addEventListener("click", () =>
            track.scrollBy({ left: -step() * 2, behavior: "smooth" }));
        document.getElementById(ids.next)?.addEventListener("click", () =>
            track.scrollBy({ left: step() * 2, behavior: "smooth" }));

        // progress bar
        const updateBar = () => {
            const max = track.scrollWidth - track.clientWidth;
            if (bar) bar.style.width = (max > 0 ? Math.max(8, (track.scrollLeft / max) * 100) : 100) + "%";
        };
        track.addEventListener("scroll", updateBar, { passive: true });
        window.addEventListener("resize", updateBar);
        updateBar();

        // hide any screenshot that fails to load (missing file)
        track.addEventListener("error", (e) => {
            if (e.target.tagName === "IMG") {
                e.target.closest("figure")?.remove();
                updateBar();
            }
        }, true);

        // mouse drag (touch uses native swipe)
        let down = false, startX = 0, startLeft = 0, moved = 0;
        track.addEventListener("pointerdown", (e) => {
            if (e.pointerType !== "mouse") return;
            down = true; moved = 0; startX = e.clientX; startLeft = track.scrollLeft;
        });
        window.addEventListener("pointermove", (e) => {
            if (!down) return;
            const dx = e.clientX - startX;
            moved = Math.max(moved, Math.abs(dx));
            if (moved > 5) track.classList.add("dragging");
            track.scrollLeft = startLeft - dx;
        });
        window.addEventListener("pointerup", () => {
            if (!down) return;
            down = false;
            setTimeout(() => track.classList.remove("dragging"), 0);
        });

        // click a screen -> lightbox
        track.addEventListener("click", (e) => {
            const fig = e.target.closest("figure");
            if (!fig || moved > 5) return;
            const imgs = getImgs();
            const i = imgs.indexOf(fig.querySelector("img"));
            if (i > -1) open(imgs, i);
        });
    }

    initGallery({ track: "sf-track", prev: "sf-prev", next: "sf-next", bar: "sf-bar" });
    initGallery({ track: "th-track", prev: "th-prev", next: "th-next", bar: "th-bar" });
})();