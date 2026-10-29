import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Courses.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------
   EDIT HERE
   - price:  replace with your real course price in dollars, e.g. "$199".
   - href:   where the Enroll button goes (your enroll / contact / payment page).
------------------------------------------------------------------- */
const ENROLL_PATH = "/contact";

const COURSES = [
  {
    no: "01",
    level: "Beginner Level",
    name: "Market Foundation",
    text: "Build a strong understanding of financial markets and essential trading concepts. Learn the basics needed to understand how markets operate before progressing to more advanced topics.",
    price: "$249", // <-- put your price, e.g. "$199"
    href: `${ENROLL_PATH}?course=market-foundation`,
    tone: "white",
  },
  {
    no: "02",
    level: "Strategy Development",
    name: "Price Action & Strategy",
    text: "Develop your understanding of price movements, market behavior, and structured trading strategies through focused educational sessions.",
    price: "$349", // <-- put your price, e.g. "$199"
    href: `${ENROLL_PATH}?course=price-action-strategy`,
    tone: "bright",
    featured: true,
  },
  {
    no: "03",
    level: "Advanced Learning",
    name: "Advanced Market Analysis",
    text: "Explore advanced approaches to understanding market structure, analyzing price movements, and evaluating potential trading opportunities.",
    price: "$499", // <-- put your price, e.g. "$199"
    href: `${ENROLL_PATH}?course=advanced-market-analysis`,
    tone: "wine",
  },
];

/* illustrative line shapes for the sparkline in each card + background chart */
const rng = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const series = (n, seed) => {
  const r = rng(seed);
  let v = 0;
  const out = [];
  for (let i = 0; i < n; i++) out.push((v += (r() - 0.45) * 0.9));
  const min = Math.min(...out);
  const max = Math.max(...out);
  return out.map((x) => (x - min) / (max - min || 1));
};
const path = (vals, w, h, pad = 0.12) =>
  vals
    .map((v, i) => `${i ? "L" : "M"}${((i / (vals.length - 1)) * w).toFixed(1)} ${(h - (pad + v * (1 - pad * 2)) * h).toFixed(1)}`)
    .join(" ");
const BG_PATH = path(series(46, 17), 1440, 700, 0.15);
const BG_PATH_2 = path(series(46, 53), 1440, 700, 0.1);
const SPARKS = [path(series(20, 3), 200, 60), path(series(20, 9), 200, 60), path(series(20, 21), 200, 60)];
const TICKER = ["SC ACADEMY", "ONLINE TRADING EDUCATION", "MARKET FOUNDATION", "PRICE ACTION & STRATEGY", "ADVANCED MARKET ANALYSIS", "LEARN FROM ANYWHERE"];

/* digits roll randomly, then settle on the real price */
function rollPrice(el, final) {
  const len = final.length;
  const state = { p: 0 };
  return gsap.to(state, {
    p: 1,
    duration: 1.1,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = final
        .split("")
        .map((ch, i) => (/[0-9X]/.test(ch) && i / len > state.p ? String(Math.floor(Math.random() * 10)) : ch))
        .join("");
    },
    onComplete: () => (el.textContent = final),
  });
}

function Arrow() {
  return (
    <svg className="cr-arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function Courses() {
  const root = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const q = (s) => gsap.utils.toArray(s, root.current);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* ---- title: letters rise through a mask ---- */
      gsap.from(q(".cr-ch"), { yPercent: 125, rotate: 8, duration: 1.1, ease: "power4.out", stagger: 0.045 });
      gsap.from(q(".cr-eyebrow, .cr-lead"), { opacity: 0, y: 24, duration: 1, ease: "power3.out", stagger: 0.15, delay: 0.5 });

      /* ---- background chart draws itself on a loop ---- */
      gsap.set(q(".cr-chartline"), { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.to(q(".cr-chartline"), { strokeDashoffset: 0, duration: 5, ease: "power1.inOut", stagger: 0.8, repeat: -1, yoyo: true, repeatDelay: 1.2 });

      /* ---- drifting light orbs ---- */
      q(".cr-orb").forEach((el, i) => {
        gsap.to(el, { x: i ? 60 : -70, y: i ? -50 : 60, scale: 1.15, duration: 9 + i * 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });

      /* ---- outlined words drift with scroll ---- */
      q(".cr-ghost span").forEach((el, i) => {
        gsap.fromTo(el, { x: i % 2 ? 160 : -160 }, {
          x: i % 2 ? -160 : 160,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 },
        });
      });

      /* ---- ticker tape: endless, speeds up while you scroll ---- */
      const track = root.current.querySelector(".cr-ticker__track");
      if (track) {
        const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const v = Math.min(Math.abs(self.getVelocity()) / 250, 6);
            gsap.to(loop, { timeScale: 1 + v, duration: 0.2, overwrite: true });
            gsap.to(loop, { timeScale: 1, duration: 1, delay: 0.2 });
          },
        });
      }

      const cleanups = [];

      /* ---- cards: slide in, then their contents stagger, price rolls, sparkline draws ---- */
      q(".cr-card").forEach((card, i) => {
        const inner = card.querySelector(".cr-card__inner");
        const price = card.querySelector(".cr-price__value");
        const final = price.dataset.price;
        const spark = card.querySelector(".cr-spark path");
        gsap.set(spark, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(inner.querySelectorAll(".cr-card__level, .cr-card__name, .cr-card__text, .cr-price, .cr-btn"), { opacity: 0, y: 28 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" },
          defaults: { ease: "power3.out" },
        });
        tl.from(card, { opacity: 0, x: [-110, 0, 110][i], y: i === 1 ? 140 : 80, rotate: [-4, 0, 4][i], scale: 0.94, duration: 1.2 })
          .from(inner.querySelector(".cr-card__no"), { yPercent: 60, opacity: 0, scale: 0.7, transformOrigin: "0 100%", duration: 0.9 }, 0.35)
          .to(inner.querySelectorAll(".cr-card__level, .cr-card__name, .cr-card__text, .cr-price, .cr-btn"), { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.5)
          .to(spark, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" }, 0.6)
          .add(() => rollPrice(price, final), 0.9);

        /* price re-rolls on hover */
        const hover = () => rollPrice(price, final);
        card.addEventListener("pointerenter", hover);
        cleanups.push(() => card.removeEventListener("pointerenter", hover));
      });

      /* gentle floating on the featured card */
      gsap.to(q(".cr-card.is-featured .cr-card__no"), { y: -6, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 });

      return () => cleanups.forEach((fn) => fn());
    });

    /* ---- desktop mouse only: 3D tilt + magnetic Enroll buttons ---- */
    mm.add("(min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const off = [];
      q(".cr-card__inner").forEach((el) => {
        const move = (e) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(el, { rotateY: x * 8, rotateX: -y * 8, transformPerspective: 1000, duration: 0.5, ease: "power3.out" });
          el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
          el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
        };
        const leave = () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.9, ease: "elastic.out(1,0.6)" });
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        off.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
      q(".cr-btn").forEach((btn) => {
        const move = (e) => {
          const r = btn.getBoundingClientRect();
          gsap.to(btn, { x: (e.clientX - (r.left + r.width / 2)) * 0.18, y: (e.clientY - (r.top + r.height / 2)) * 0.3, duration: 0.4, ease: "power3.out" });
        };
        const leave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1,0.5)" });
        btn.addEventListener("pointermove", move);
        btn.addEventListener("pointerleave", leave);
        off.push(() => {
          btn.removeEventListener("pointermove", move);
          btn.removeEventListener("pointerleave", leave);
        });
      });
      return () => off.forEach((fn) => fn());
    });

    return () => mm.revert();
  }, []);

  return (
    <main className="cr" ref={root}>
      <div className="cr-bg" aria-hidden="true">
        <div className="cr-orb cr-orb--a" />
        <div className="cr-orb cr-orb--b" />
        <svg className="cr-chart" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice">
          <path className="cr-chartline cr-chartline--faint" d={BG_PATH_2} pathLength="1" />
          <path className="cr-chartline" d={BG_PATH} pathLength="1" />
        </svg>
        <div className="cr-ghost">
          <span>YOUR TRADING</span>
          <span>PARTNER</span>
        </div>
        <div className="cr-grain" />
      </div>

      <header className="cr-head">
        <p className="cr-eyebrow">
          <i className="cr-live" aria-hidden="true" />
          SC ACADEMY
        </p>
        <h1 className="cr-title" aria-label="Our Courses">
          {["OUR", "COURSES"].map((w) => (
            <span className="cr-mask" key={w}>
              <span className="cr-word" aria-hidden="true">
                {w.split("").map((ch, i) => (
                  <span className="cr-ch" key={i}>
                    {ch}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h1>
        <p className="cr-lead">Three online trading courses. Pick your level and enroll.</p>
      </header>

      <div className="cr-ticker" aria-hidden="true">
        <div className="cr-ticker__track">
          {[...TICKER, ...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i}>
              {t}
              <b>✦</b>
            </span>
          ))}
        </div>
      </div>

      <section className="cr-grid" aria-label="Courses">
        {COURSES.map((c) => (
          <article key={c.no} className={`cr-card cr-card--${c.tone} ${c.featured ? "is-featured" : ""}`}>
            <div className="cr-card__inner">
              <div className="cr-card__glow" aria-hidden="true" />
              <svg className="cr-spark" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
                <path d={SPARKS[COURSES.indexOf(c)]} pathLength="1" />
              </svg>
              <div className="cr-card__top">
                <span className="cr-card__no">{c.no}</span>
                <span className="cr-card__level">{c.level}</span>
              </div>

              <div className="cr-card__body">
                <h2 className="cr-card__name">{c.name}</h2>
                <p className="cr-card__text">{c.text}</p>
              </div>

              <div className="cr-card__foot">
                <div className="cr-price">
                  <span className="cr-price__label">Course fee</span>
                  <span className="cr-price__value" data-price={c.price}>
                    {c.price}
                  </span>
                </div>
                <a className="cr-btn" href={c.href} aria-label={`Enroll in ${c.name}`}>
                  <span>Enroll Now</span>
                  <Arrow />
                </a>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}