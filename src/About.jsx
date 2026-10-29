import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------
   ROUTES — change these two lines to match your router.
   (If your project uses react-router, swap <a> for <Link to=...>.)
------------------------------------------------------------------- */
const COURSES_PATH = "/courses";
const CONTACT_PATH = "/contact";
const ABOUT_PATH = "/about";

/* ------------------------------------------------------------------
   CONTENT
------------------------------------------------------------------- */
const COURSES = [
  {
    no: "01",
    ghost: "FOUNDATION",
    category: "Beginner Level",
    title: "Market Foundation",
    tone: "light",
    description:
      "Build a strong understanding of financial markets and essential trading concepts. Learn the basics needed to understand how markets operate before progressing to more advanced topics.",
    topics: [
      "Introduction to financial markets",
      "Essential trading terminology",
      "Understanding price charts",
      "Basic market structure",
      "Introduction to risk management",
    ],
    href: `${COURSES_PATH}#market-foundation`,
  },
  {
    no: "02",
    ghost: "STRATEGY",
    category: "Strategy Development",
    title: "Price Action & Strategy",
    tone: "bright",
    featured: true,
    description:
      "Develop your understanding of price movements, market behavior, and structured trading strategies through focused educational sessions.",
    topics: [
      "Price action fundamentals",
      "Candlestick analysis",
      "Support and resistance",
      "Trend identification",
      "Trading setups and strategic planning",
      "Risk-to-reward concepts",
    ],
    href: `${COURSES_PATH}#price-action-strategy`,
  },
  {
    no: "03",
    ghost: "ANALYSIS",
    category: "Advanced Learning",
    title: "Advanced Market Analysis",
    tone: "wine",
    description:
      "Explore advanced approaches to understanding market structure, analyzing price movements, and evaluating potential trading opportunities.",
    topics: [
      "Advanced market structure",
      "Multi-timeframe analysis",
      "Market trend evaluation",
      "Confluence-based analysis",
      "Advanced chart interpretation",
      "Trading discipline and risk management",
    ],
    href: `${COURSES_PATH}#advanced-market-analysis`,
  },
];

const APPROACH = [
  {
    no: "01",
    title: "Learn the Fundamentals",
    text: "Develop a clear understanding of essential financial-market concepts and trading terminology.",
  },
  {
    no: "02",
    title: "Understand Market Behavior",
    text: "Study price action, market structure, and analytical methods through structured learning.",
  },
  {
    no: "03",
    title: "Develop Strategic Thinking",
    text: "Learn to evaluate trading scenarios, understand risk, and approach market analysis with discipline.",
  },
];

const WHY = [
  {
    icon: "layers",
    title: "Structured Learning",
    text: "Progress through trading concepts in a clear, organized learning journey.",
  },
  {
    icon: "globe",
    title: "Online Accessibility",
    text: "Access online educational opportunities from different locations.",
  },
  {
    icon: "chart",
    title: "Market-Focused Education",
    text: "Explore financial markets, price action, trading strategies, and market analysis.",
  },
  {
    icon: "shield",
    title: "Risk Awareness",
    text: "Understand the importance of risk management, discipline, and informed decision-making.",
  },
];

/* ------------------------------------------------------------------
   ILLUSTRATIVE SAMPLE DATA (deterministic — not real market data)
------------------------------------------------------------------- */
const rng = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

const makeSeries = (n, seed, drift = 0.35) => {
  const r = rng(seed);
  let v = 0;
  const out = [];
  for (let i = 0; i < n; i++) {
    v += (r() - 0.5) * 0.9 + drift * 0.12;
    out.push(v);
  }
  const min = Math.min(...out);
  const max = Math.max(...out);
  return out.map((x) => (x - min) / (max - min || 1));
};

const linePath = (vals, w, h, pad = 0.12) =>
  vals
    .map((v, i) => {
      const x = (i / (vals.length - 1)) * w;
      const y = h - (pad + v * (1 - pad * 2)) * h;
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

const makeCandles = (n, seed) => {
  const r = rng(seed);
  let prev = 0.5;
  const raw = [];
  for (let i = 0; i < n; i++) {
    const o = prev;
    const c = o + (r() - 0.44) * 0.2;
    const h = Math.max(o, c) + r() * 0.07;
    const l = Math.min(o, c) - r() * 0.07;
    raw.push({ o, c, h, l });
    prev = c;
  }
  const min = Math.min(...raw.map((k) => k.l));
  const max = Math.max(...raw.map((k) => k.h));
  const f = (x) => (x - min) / (max - min || 1);
  return raw.map((k) => ({ o: f(k.o), c: f(k.c), h: f(k.h), l: f(k.l) }));
};

const HERO_A = linePath(makeSeries(48, 11), 1440, 700, 0.18);
const HERO_B = linePath(makeSeries(48, 29, 0.2), 1440, 700, 0.1);
const FINAL_A = linePath(makeSeries(44, 47), 1440, 600, 0.15);
const LAPTOP = linePath(makeSeries(30, 83, 0.6), 300, 150, 0.1);
const LAPTOP_AREA = `${LAPTOP} L300 150 L0 150 Z`;
const TABLET = linePath(makeSeries(18, 5, 0.5), 120, 70, 0.12);
const PHONE = linePath(makeSeries(14, 91, 0.5), 70, 60, 0.12);
const CARD_LINE = [
  linePath(makeSeries(22, 61, 0.5), 400, 160, 0.1),
  linePath(makeSeries(22, 77, 0.7), 400, 160, 0.1),
  linePath(makeSeries(22, 33, 0.9), 400, 160, 0.1),
];

/* ------------------------------------------------------------------
   SMALL PRESENTATIONAL PIECES
------------------------------------------------------------------- */

/* Splits text into masked words. Wrap a word in *asterisks* for italic accent. */
function Split({ text, as: Tag = "span", hero = false, className = "" }) {
  let inEm = false;
  const words = text.split(" ").map((w) => {
    if (w.startsWith("*")) inEm = true;
    const item = { word: w.replace(/\*/g, ""), em: inEm };
    if (w.endsWith("*") || /\*[.,?!]$/.test(w)) inEm = false;
    return item;
  });
  return (
    <Tag
      className={`sc-split ${className}`}
      {...(hero ? { "data-hero-split": "" } : { "data-split": "" })}
    >
      {words.map(({ word, em }, i) => (
        <React.Fragment key={i}>
          <span className="sc-w">
            <span className={`sc-wi ${em ? "sc-em" : ""}`}>{word}</span>
          </span>{" "}
        </React.Fragment>
      ))}
    </Tag>
  );
}

function Arrow() {
  return (
    <svg className="sc-arrow" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function Btn({ href, children, variant = "solid" }) {
  return (
    <a className={`sc-btn sc-btn--${variant}`} href={href}>
      <span>{children}</span>
      <Arrow />
    </a>
  );
}

function Icon({ name }) {
  const p = {
    layers: (
      <>
        <path d="m12 2 10 5-10 5L2 7z" />
        <path d="m2 12 10 5 10-5" />
        <path d="m2 17 10 5 10-5" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20" />
      </>
    ),
    chart: (
      <>
        <path d="M3 3v16a2 2 0 0 0 2 2h16" />
        <path d="m19 9-5 5-4-4-3 3" />
      </>
    ),
    shield: (
      <>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  }[name];
  return (
    <svg className="sc-icon" viewBox="0 0 24 24" aria-hidden="true">
      {p}
    </svg>
  );
}

function Candles({ count = 16, seed = 7, className = "" }) {
  const data = makeCandles(count, seed);
  const W = 400;
  const H = 300;
  const step = W / count;
  return (
    <svg
      className={`sc-candles ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {data.map((k, i) => {
        const x = i * step + step / 2;
        const y = (v) => H - (0.08 + v * 0.84) * H;
        const up = k.c >= k.o;
        const top = y(Math.max(k.o, k.c));
        const bot = y(Math.min(k.o, k.c));
        return (
          <g key={i} className={`sc-candle ${up ? "is-up" : "is-down"}`}>
            <line x1={x} x2={x} y1={y(k.h)} y2={y(k.l)} />
            <rect
              x={x - step * 0.3}
              width={step * 0.6}
              y={top}
              height={Math.max(bot - top, 3)}
              rx="1.5"
            />
          </g>
        );
      })}
    </svg>
  );
}

/* Simplified "global connectivity" graphic */
function Globe() {
  const nodes = [
    [120, 150],
    [250, 95],
    [330, 200],
    [190, 260],
    [270, 330],
    [90, 300],
  ];
  const arcs = [
    "M120 150 Q185 60 250 95",
    "M250 95 Q335 120 330 200",
    "M120 150 Q130 230 190 260",
    "M190 260 Q250 250 330 200",
    "M190 260 Q215 320 270 330",
    "M90 300 Q130 290 190 260",
    "M120 150 Q60 220 90 300",
  ];
  return (
    <svg className="sc-globe" viewBox="0 0 420 420" aria-hidden="true">
      <circle className="sc-globe__ring" cx="210" cy="210" r="190" />
      <ellipse className="sc-globe__ring" cx="210" cy="210" rx="190" ry="70" />
      <ellipse className="sc-globe__ring" cx="210" cy="210" rx="90" ry="190" />
      <ellipse className="sc-globe__ring" cx="210" cy="210" rx="150" ry="190" />
      <line className="sc-globe__ring" x1="20" y1="210" x2="400" y2="210" />
      {arcs.map((d, i) => (
        <path key={i} d={d} pathLength="1" className="sc-globe__arc" />
      ))}
      {nodes.map(([x, y], i) => (
        <g key={i} className="sc-globe__node">
          <circle cx={x} cy={y} r="14" className="sc-globe__pulse" />
          <circle cx={x} cy={y} r="5" />
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------
   PAGE
------------------------------------------------------------------- */
export default function About({ showFooter = true, socials = [] }) {
  const root = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const q = (sel) => gsap.utils.toArray(sel, root.current);

    /* ------------------------ motion allowed ------------------------ */
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* ---------- HERO entrance (plays on load) ---------- */
      const hero = gsap.timeline({ defaults: { ease: "power4.out" } });
      gsap.set(q(".sc-hero__line"), { strokeDasharray: 1, strokeDashoffset: 1 });
      hero
        .to(q(".sc-hero__line"), {
          strokeDashoffset: 0,
          duration: 2.6,
          ease: "power2.inOut",
          stagger: 0.25,
        })
        .from(q("[data-hero-split] .sc-wi"), { yPercent: 115, rotate: 5, duration: 1.15, stagger: 0.07 }, 0.15)
        .from(q(".sc-hero__label"), { opacity: 0, y: 20, duration: 0.9 }, 0.1)
        .from(q(".sc-hero__sub"), { opacity: 0, y: 30, duration: 1 }, 0.7)
        .from(q(".sc-hero__copy p"), { opacity: 0, y: 30, duration: 1, stagger: 0.12 }, 0.9)
        .from(q(".sc-hero__cta .sc-btn"), { opacity: 0, y: 24, duration: 0.9, stagger: 0.12 }, 1.15)
        .from(q(".sc-chip"), { opacity: 0, scale: 0.85, y: 30, duration: 1, stagger: 0.14 }, 1.0)
        .from(q(".sc-hero__candles .sc-candle"), { opacity: 0, scaleY: 0, transformOrigin: "50% 100%", duration: 0.8, stagger: 0.05 }, 0.6);

      /* floating market chips */
      q(".sc-chip, .sc-float").forEach((el, i) => {
        gsap.to(el, {
          y: `+=${10 + (i % 3) * 5}`,
          duration: 3 + (i % 4) * 0.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.2,
        });
      });

      /* ---------- Scroll-triggered typography ---------- */
      q("[data-split]").forEach((el) => {
        gsap.from(el.querySelectorAll(".sc-wi"), {
          yPercent: 115,
          rotate: 4,
          duration: 1.05,
          ease: "power4.out",
          stagger: 0.055,
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });

      /* ---------- Directional reveals ---------- */
      q("[data-reveal]").forEach((el) => {
        const from = el.dataset.reveal;
        const v = {
          opacity: 0,
          duration: 1.05,
          ease: "power3.out",
          delay: parseFloat(el.dataset.delay || 0),
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
        };
        if (from === "left") Object.assign(v, { x: -90, rotate: -2 });
        else if (from === "right") Object.assign(v, { x: 90, rotate: 2 });
        else if (from === "scale") Object.assign(v, { scale: 0.88, y: 30 });
        else if (from === "tilt") Object.assign(v, { y: 70, rotateX: 14, transformPerspective: 1000, transformOrigin: "50% 100%" });
        else Object.assign(v, { y: 40 });
        gsap.from(el, v);
      });

      /* ---------- Parallax ---------- */
      q("[data-speed]").forEach((el) => {
        const s = parseFloat(el.dataset.speed);
        gsap.fromTo(
          el,
          { y: -70 * s },
          {
            y: 70 * s,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section") || el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      /* ---------- STORY: candles + line ---------- */
      gsap.from(q(".sc-story__panel .sc-candle"), {
        scaleY: 0,
        opacity: 0,
        transformOrigin: "50% 100%",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ".sc-story__panel", start: "top 75%", toggleActions: "play none none reverse" },
      });
      gsap.set(q(".sc-story__trend"), { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.to(q(".sc-story__trend"), {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: ".sc-story", start: "top 60%", end: "bottom 70%", scrub: 0.6 },
      });
      gsap.fromTo(
        ".sc-story__panel",
        { clipPath: "inset(10% 8% 10% 8% round 40px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 28px)",
          ease: "none",
          scrollTrigger: { trigger: ".sc-story", start: "top 85%", end: "top 25%", scrub: true },
        }
      );

      /* ---------- ONLINE section ---------- */
      const online = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: ".sc-online__stage", start: "top 75%", toggleActions: "play none none reverse" },
      });
      gsap.set(q(".sc-laptop__line, .sc-globe__arc"), { strokeDasharray: 1, strokeDashoffset: 1 });
      online
        .from(".sc-laptop", { y: 140, opacity: 0, rotateX: 18, transformPerspective: 1200, transformOrigin: "50% 100%", duration: 1.4 })
        .to(".sc-laptop__line", { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" }, "-=0.5")
        .from(".sc-laptop__area", { opacity: 0, duration: 1.2 }, "<0.6")
        .from(".sc-laptop__dot", { scale: 0, transformOrigin: "50% 50%", duration: 0.6, stagger: 0.12 }, "-=0.8")
        .from(".sc-device--tablet", { x: 80, y: 60, opacity: 0, rotate: 6, duration: 1.1 }, "-=1.4")
        .from(".sc-device--phone", { x: -60, y: 80, opacity: 0, rotate: -6, duration: 1.1 }, "-=1")
        .to(".sc-globe__arc", { strokeDashoffset: 0, duration: 1.4, stagger: 0.14, ease: "power2.inOut" }, "-=1.2")
        .from(".sc-globe__node", { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: 0.6, stagger: 0.1 }, "-=1.2")
        .from(".sc-online__tag", { opacity: 0, y: 20, duration: 0.8, stagger: 0.12 }, "-=0.8");

      q(".sc-globe__pulse").forEach((el, i) => {
        gsap.to(el, { scale: 2.2, opacity: 0, transformOrigin: "50% 50%", duration: 2.4, repeat: -1, delay: i * 0.35, ease: "power1.out" });
      });
      gsap.to(".sc-globe", { rotate: 360, duration: 180, repeat: -1, ease: "none" });

      /* ---------- CTA curtain ---------- */
      gsap.fromTo(
        ".sc-cta__bg",
        { clipPath: "inset(14% 7% 14% 7% round 56px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: { trigger: ".sc-cta", start: "top 90%", end: "top 20%", scrub: true },
        }
      );
      gsap.set(".sc-cta__line", { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.to(".sc-cta__line", {
        strokeDashoffset: 0,
        duration: 3,
        ease: "power2.inOut",
        scrollTrigger: { trigger: ".sc-cta", start: "top 55%", toggleActions: "play none none reverse" },
      });
      gsap.from(".sc-cta__inner .sc-btn", {
        opacity: 0,
        y: 28,
        duration: 0.9,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: { trigger: ".sc-cta__inner", start: "top 70%", toggleActions: "play none none reverse" },
      });
    });

    /* ---------------- WHY cards: draw top line when revealed ---------------- */
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      q(".sc-why__card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 60,
          x: i % 2 ? 40 : -40,
          rotate: i % 2 ? 2 : -2,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" },
        });
        gsap.from(card.querySelector(".sc-why__rule"), {
          scaleX: 0,
          transformOrigin: "0 50%",
          duration: 1.2,
          delay: 0.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
    });

    /* ------------- DESKTOP: pinned horizontal course showcase ------------- */
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      const stage = root.current.querySelector(".sc-courses__stage");
      const track = root.current.querySelector(".sc-courses__track");
      const panels = q(".sc-panel");
      const counter = root.current.querySelector(".sc-courses__count");
      const dots = q(".sc-courses__dot");
      const bar = root.current.querySelector(".sc-courses__barfill");
      if (!stage || !track || panels.length < 2) return;

      const step = () => panels[1].offsetLeft - panels[0].offsetLeft;
      const total = () => step() * (panels.length - 1);

      const update = () => {
        const vw = window.innerWidth;
        const s = step() || 1;
        let active = 0;
        let best = Infinity;
        panels.forEach((p, i) => {
          const r = p.getBoundingClientRect();
          const d = (r.left + r.width / 2 - vw / 2) / s; // -n..n, 0 = centred
          const ad = Math.min(Math.abs(d), 1.4);
          if (Math.abs(d) < best) {
            best = Math.abs(d);
            active = i;
          }
          gsap.set(p, {
            transformPerspective: 1500,
            rotateY: gsap.utils.clamp(-32, 32, -d * 30),
            scale: 1 - Math.min(ad, 1) * 0.1,
            opacity: 1 - Math.min(ad, 1) * 0.5,
            transformOrigin: d > 0 ? "0% 50%" : "100% 50%",
          });
          const ghost = p.querySelector(".sc-panel__ghost");
          if (ghost) gsap.set(ghost, { x: -d * 140 });
        });
        dots.forEach((dEl, i) => dEl.classList.toggle("is-active", i === active));
        if (counter) counter.textContent = `0${active + 1} / 0${panels.length}`;
      };

      gsap.set(track, { x: 0 });
      const tween = gsap.to(track, {
        x: () => -total(),
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${total() * 1.15}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: { snapTo: 1 / (panels.length - 1), duration: { min: 0.25, max: 0.7 }, ease: "power2.inOut" },
          onUpdate: (self) => {
            update();
            if (bar) gsap.set(bar, { scaleX: self.progress });
          },
          onRefresh: update,
        },
      });
      update();

      /* pointer tilt on the inner card (desktop, fine pointer only) */
      const cleanups = [];
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        panels.forEach((p) => {
          const inner = p.querySelector(".sc-panel__inner");
          const move = (e) => {
            const r = inner.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            gsap.to(inner, { rotateY: x * 5, rotateX: -y * 5, duration: 0.6, ease: "power3.out", transformPerspective: 1200 });
            inner.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
            inner.style.setProperty("--my", `${(y + 0.5) * 100}%`);
          };
          const leave = () => gsap.to(inner, { rotateY: 0, rotateX: 0, duration: 0.9, ease: "elastic.out(1,0.6)" });
          inner.addEventListener("pointermove", move);
          inner.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            inner.removeEventListener("pointermove", move);
            inner.removeEventListener("pointerleave", leave);
          });
        });
      }

      return () => {
        cleanups.forEach((fn) => fn());
        tween.scrollTrigger && tween.scrollTrigger.kill();
        tween.kill();
      };
    });

    /* ------------- MOBILE / TABLET: stacked course cards ------------- */
    mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
      q(".sc-panel").forEach((p, i) => {
        gsap.from(p.querySelector(".sc-panel__inner"), {
          opacity: 0,
          y: 80,
          rotateX: 10,
          transformPerspective: 900,
          transformOrigin: "50% 100%",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: p, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
    });

    /* ------------- APPROACH: connecting line fills on scroll ------------- */
    mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        ".sc-approach__fill",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "0 50%",
          ease: "none",
          scrollTrigger: { trigger: ".sc-approach__grid", start: "top 70%", end: "bottom 60%", scrub: 0.6 },
        }
      );
      q(".sc-step").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 80,
          rotateX: 12,
          transformPerspective: 1000,
          transformOrigin: "50% 100%",
          duration: 1,
          delay: i * 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".sc-approach__grid", start: "top 78%", toggleActions: "play none none reverse" },
        });
      });
    });
    mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        ".sc-approach__fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "50% 0",
          ease: "none",
          scrollTrigger: { trigger: ".sc-approach__grid", start: "top 70%", end: "bottom 70%", scrub: 0.6 },
        }
      );
      q(".sc-step").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 50,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
    });

    /* Recalculate once fonts/images settle so pins measure correctly */
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("load", onLoad);
      mm.revert(); // kills every tween + ScrollTrigger created inside matchMedia
    };
  }, []);

  return (
    <main className="sc-about" ref={root} id="top">
      {/* ================= 1. HERO ================= */}
      <section className="sc-hero sc-dark" aria-labelledby="about-title">
        <div className="sc-hero__bg" aria-hidden="true">
          <div className="sc-orb sc-orb--a" data-speed="0.8" />
          <div className="sc-orb sc-orb--b" data-speed="1.4" />
          <svg className="sc-hero__chart" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice">
            <path className="sc-hero__line sc-hero__line--faint" d={HERO_B} pathLength="1" />
            <path className="sc-hero__line" d={HERO_A} pathLength="1" />
          </svg>
          <Candles className="sc-hero__candles" count={18} seed={21} />
          <div className="sc-grain" />
        </div>

        <div className="sc-wrap sc-hero__grid">
          <div className="sc-hero__copy">
            <p className="sc-eyebrow sc-hero__label">SC ACADEMY · Trading Education Institute</p>
            <h1 id="about-title" className="sc-hero__title">
              <Split hero text="ABOUT SC *ACADEMY*" />
            </h1>
            <p className="sc-hero__sub">Building Smarter Traders. Creating Stronger Futures.</p>
            <p>
              SC ACADEMY is a trading education institute dedicated to helping aspiring traders understand financial
              markets through structured learning, practical market analysis, and strategic trading education.
            </p>
            <p>
              Our mission is to make quality trading education accessible to learners everywhere through flexible
              online classes, structured courses, and a strong foundation in market knowledge.
            </p>
            <div className="sc-hero__cta">
              <Btn href={COURSES_PATH}>Explore Our Courses</Btn>
              <Btn href="#approach" variant="ghost">
                Discover Our Approach
              </Btn>
            </div>
          </div>

          <div className="sc-hero__floats" aria-hidden="true">
            <div className="sc-chip sc-chip--1">
              <span className="sc-chip__k">Market Structure</span>
              <span className="sc-chip__v">Higher highs</span>
            </div>
            <div className="sc-chip sc-chip--2">
              <span className="sc-chip__k">Risk-to-Reward</span>
              <span className="sc-chip__v">1 : 2</span>
            </div>
            <div className="sc-chip sc-chip--3">
              <span className="sc-chip__k">Trend</span>
              <span className="sc-chip__v">Up ↗</span>
            </div>
            <p className="sc-hero__note">Illustrative graphics · sample data</p>
          </div>
        </div>
        <div className="sc-hero__scroll" aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      </section>

      {/* ================= 2. OUR STORY ================= */}
      <section className="sc-story sc-light sc-sheet" aria-labelledby="story-title">
        <div className="sc-wrap sc-story__grid">
          <div className="sc-story__panel" data-reveal="left">
            <div className="sc-story__panelbg" data-speed="0.6" aria-hidden="true" />
            <svg className="sc-story__trendsvg" viewBox="0 0 400 300" aria-hidden="true" preserveAspectRatio="none">
              <path className="sc-story__trend" d={linePath(makeSeries(26, 14, 0.9), 400, 300, 0.2)} pathLength="1" />
            </svg>
            <Candles count={16} seed={7} />
            <div className="sc-story__badge">
              <span>Sample chart</span>
              <b>Illustrative</b>
            </div>
          </div>

          <div className="sc-story__copy">
            <p className="sc-eyebrow sc-eyebrow--dark" data-reveal>
              OUR STORY
            </p>
            <h2 id="story-title" className="sc-h2">
              <Split text="More Than Trading. A *Foundation* for Better Decisions." />
            </h2>
            <p data-reveal data-delay="0.05">
              SC ACADEMY was created with a clear vision: to make trading education more structured, understandable,
              and accessible.
            </p>
            <p data-reveal data-delay="0.1">
              We believe that learning about financial markets requires more than following price movements. Traders
              need to understand market structure, price behavior, trading strategies, and risk management.
            </p>
            <p data-reveal data-delay="0.15">
              Our educational approach focuses on building knowledge progressively, helping students move from
              fundamental concepts toward more advanced market analysis.
            </p>
            <p data-reveal data-delay="0.2">
              Through online learning, students can access our educational programs from different locations without
              being restricted to a physical classroom.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 3. COURSES (pinned horizontal showcase) ================= */}
      <section className="sc-courses sc-wine sc-sheet" id="courses" aria-labelledby="courses-title">
        <div className="sc-courses__stage">
          <div className="sc-courses__bg" aria-hidden="true">
            <div className="sc-orb sc-orb--c" data-speed="1" />
            <div className="sc-grain" />
          </div>

          <header className="sc-courses__head">
            <p className="sc-eyebrow">Our Three Trading Courses</p>
            <h2 id="courses-title" className="sc-h2 sc-h2--light">
              <Split text="Your Journey Into the *Financial* Markets Starts Here." />
            </h2>
            <p className="sc-courses__lead" data-reveal>
              Explore our structured online trading education programs, designed to help learners build market knowledge
              and develop their analytical skills step by step.
            </p>
          </header>

          <div className="sc-courses__viewport">
            <div className="sc-courses__track">
              {COURSES.map((c, i) => (
                <article
                  key={c.no}
                  id={c.href.split("#")[1]}
                  className={`sc-panel sc-panel--${c.tone} ${c.featured ? "is-featured" : ""}`}
                >
                  <div className="sc-panel__inner">
                    <span className="sc-panel__ghost" aria-hidden="true">
                      {c.ghost}
                    </span>
                    <svg className="sc-panel__chart" viewBox="0 0 400 160" aria-hidden="true" preserveAspectRatio="none">
                      <path d={CARD_LINE[i]} />
                    </svg>
                    <div className="sc-panel__glow" aria-hidden="true" />

                    <div className="sc-panel__top">
                      <span className="sc-panel__no">{c.no}</span>
                      <span className="sc-panel__cat">{c.category}</span>
                    </div>

                    <div className="sc-panel__body">
                      <h3 className="sc-panel__title">{c.title}</h3>
                      <p className="sc-panel__desc">{c.description}</p>
                      <ul className="sc-panel__topics" aria-label={`${c.title} learning topics`}>
                        {c.topics.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                      <Btn href={c.href} variant={c.tone === "light" ? "solid" : "light"}>
                        Explore Course
                      </Btn>
                    </div>
                    <span className="sc-panel__rule" aria-hidden="true" />
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="sc-courses__ui" aria-hidden="true">
            <span className="sc-courses__count">01 / 03</span>
            <div className="sc-courses__bar">
              <i className="sc-courses__barfill" />
            </div>
            <div className="sc-courses__dots">
              {COURSES.map((c, i) => (
                <b key={c.no} className={`sc-courses__dot ${i === 0 ? "is-active" : ""}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. LEARN FROM ANYWHERE ================= */}
      <section className="sc-online sc-light sc-sheet" aria-labelledby="online-title">
        <div className="sc-wrap sc-online__grid">
          <div className="sc-online__copy">
            <p className="sc-eyebrow sc-eyebrow--dark" data-reveal>
              Online Education
            </p>
            <h2 id="online-title" className="sc-h2">
              <Split text="Your Classroom. *Anywhere* in the World." />
            </h2>
            <p data-reveal>
              SC ACADEMY provides online trading classes, allowing learners to access educational opportunities from
              wherever they are.
            </p>
            <p data-reveal data-delay="0.1">
              Whether you are learning from home or another location, our online learning approach makes it possible to
              explore trading education without needing to attend a physical classroom.
            </p>
            <ul className="sc-online__tags">
              <li className="sc-online__tag">Online classes</li>
              <li className="sc-online__tag">Learn from different locations</li>
              <li className="sc-online__tag">No physical classroom required</li>
            </ul>
          </div>

          <div className="sc-online__stage" aria-hidden="true">
            <div className="sc-online__shape" data-speed="1.2" />
            <Globe />

            <div className="sc-laptop">
              <div className="sc-laptop__screen">
                <div className="sc-laptop__bar">
                  <i />
                  <i />
                  <i />
                  <span>Sample chart</span>
                </div>
                <svg viewBox="0 0 300 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="scArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#A61E4D" stopOpacity=".55" />
                      <stop offset="1" stopColor="#A61E4D" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <g className="sc-laptop__grid">
                    <line x1="0" x2="300" y1="38" y2="38" />
                    <line x1="0" x2="300" y1="75" y2="75" />
                    <line x1="0" x2="300" y1="112" y2="112" />
                  </g>
                  <path className="sc-laptop__area" d={LAPTOP_AREA} fill="url(#scArea)" />
                  <path className="sc-laptop__line" d={LAPTOP} pathLength="1" />
                  <circle className="sc-laptop__dot" cx="300" cy={LAPTOP.split(" ").slice(-1)[0]} r="4" />
                </svg>
              </div>
              <div className="sc-laptop__base" />
            </div>

            <div className="sc-device sc-device--tablet sc-float">
              <svg viewBox="0 0 120 70" preserveAspectRatio="none">
                <path d={TABLET} />
              </svg>
              <span />
              <span />
            </div>
            <div className="sc-device sc-device--phone sc-float">
              <svg viewBox="0 0 70 60" preserveAspectRatio="none">
                <path d={PHONE} />
              </svg>
              <span />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. EDUCATIONAL APPROACH ================= */}
      <section className="sc-approach sc-dark sc-sheet" id="approach" aria-labelledby="approach-title">
        <div className="sc-hero__bg sc-approach__bg" aria-hidden="true">
          <div className="sc-orb sc-orb--d" data-speed="1.2" />
          <div className="sc-grain" />
        </div>
        <div className="sc-wrap">
          <p className="sc-eyebrow">Our Educational Approach</p>
          <h2 id="approach-title" className="sc-h2 sc-h2--light sc-approach__title">
            <Split text="Understand the Market. Build Your *Knowledge.* Trade With Discipline." />
          </h2>

          <div className="sc-approach__grid">
            <div className="sc-approach__line" aria-hidden="true">
              <i className="sc-approach__fill" />
            </div>
            {APPROACH.map((s) => (
              <article className="sc-step" key={s.no}>
                <span className="sc-step__node" aria-hidden="true" />
                <span className="sc-step__no">{s.no}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 6. WHY SC ACADEMY ================= */}
      <section className="sc-why sc-light sc-sheet" aria-labelledby="why-title">
        <div className="sc-wrap">
          <h2 id="why-title" className="sc-h2">
            <Split text="Why *SC ACADEMY?*" />
          </h2>
          <div className="sc-why__grid">
            {WHY.map((w, i) => (
              <article key={w.title} className={`sc-why__card ${i % 2 === 0 ? "is-wine" : "is-white"}`}>
                <span className="sc-why__rule" aria-hidden="true" />
                <span className="sc-why__idx">0{i + 1}</span>
                <Icon name={w.icon} />
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 7. FINAL CTA ================= */}
      <section className="sc-cta" aria-labelledby="cta-title">
        <div className="sc-cta__bg" aria-hidden="true">
          <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice">
            <path className="sc-cta__line" d={FINAL_A} pathLength="1" />
          </svg>
          <div className="sc-grain" />
        </div>
        <div className="sc-wrap sc-cta__inner">
          <h2 id="cta-title" className="sc-h2 sc-h2--light sc-cta__title">
            <Split text="Take the First Step Toward Understanding the *Markets.*" />
          </h2>
          <p data-reveal>
            Explore the SC ACADEMY learning programs and begin building your understanding of financial markets through
            structured online education.
          </p>
          <div className="sc-hero__cta sc-cta__btns">
            <Btn href={COURSES_PATH} variant="light">
              Explore Our Courses
            </Btn>
            <Btn href={CONTACT_PATH} variant="ghost">
              Contact SC ACADEMY
            </Btn>
          </div>
        </div>
      </section>

      {/* ================= 8. FOOTER ================= */}
      {/* {showFooter && (
        <footer className="sc-footer">
          <div className="sc-wrap sc-footer__grid">
            <div>
              <p className="sc-footer__brand">SC ACADEMY</p>
              <p className="sc-footer__text">
                A trading education institute offering structured online learning in financial markets, price action and
                market analysis.
              </p>
            </div>
            <nav aria-label="Footer">
              <a href={ABOUT_PATH}>About</a>
              <a href={COURSES_PATH}>Courses</a>
              <a href={CONTACT_PATH}>Contact</a>
              {socials.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="sc-wrap sc-footer__bar">
            <span>© {new Date().getFullYear()} SC ACADEMY. All rights reserved.</span>
            <span>Educational content only. Trading involves risk.</span>
          </div>
        </footer>
      )} */}
    </main>
  );
}