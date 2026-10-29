import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import "./Hero.css";

/* 👇 Keep your existing video import/path here (change only if your filename differs) */
import heroVideo from "./assets/sc-academy hero.mp4";

const EASE = [0.22, 1, 0.36, 1];
const LEAD =
  "Develop your trading knowledge. Understand the markets. Build a disciplined approach to your future.";

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
});

/* Button with a gentle magnetic pull toward the pointer */
function MagneticLink({ href, className, reduced, children }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = (e) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.16);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.22);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </motion.a>
  );
}

export default function Hero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const frame = useRef(0);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  /* Video: autoplay, muted, loop. Paused only for reduced-motion users. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    if (reduced) {
      v.pause();
      return;
    }
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, [reduced]);

  /* Scroll-linked motion: each layer drifts at its own speed */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const k = reduced ? 0 : 1;
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -70 * k]);
  const leadY = useTransform(scrollYProgress, [0, 1], [0, -110 * k]);
  const ctaY = useTransform(scrollYProgress, [0, 1], [0, -150 * k]);
  const fade = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.5]);

  /* Cursor spotlight (overlay only, the video is never touched) */
  const px = useMotionValue(30);
  const py = useMotionValue(45);
  const spx = useSpring(px, { stiffness: 60, damping: 20 });
  const spy = useSpring(py, { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${spx}% ${spy}%, rgba(255,255,255,0.10), transparent 65%)`;

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const onMove = (e) => {
    if (reduced) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      px.set((clientX / window.innerWidth) * 100);
      py.set((clientY / window.innerHeight) * 100);
    });
  };

  const words = LEAD.split(" ");

  return (
    <section className="hero" id="home" ref={sectionRef} onPointerMove={onMove}>
      {/* ===== Background video ===== */}
      <div className="hero-media" aria-hidden="true">
        {!videoFailed && (
          <video
            ref={videoRef}
            className={`hero-video ${videoReady ? "is-ready" : ""}`}
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            onLoadedData={() => setVideoReady(true)}
            onError={() => setVideoFailed(true)}
          />
        )}
      </div>

      {/* ===== Overlays (translucent) ===== */}
      <div className="hero-tone" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-streak" aria-hidden="true" />
      <motion.div className="hero-spot" style={{ background: spotlight }} aria-hidden="true" />
      <motion.div className="hero-shade" style={{ opacity: shade }} aria-hidden="true" />

      {/* ===== Content ===== */}
      <div className="hero-inner">
        <div className="hero-content">
          <motion.div style={{ opacity: fade }}>
            <motion.p className="hero-eyebrow" {...rise(0.25)}>
              <motion.span
                className="hero-eyebrow__rule"
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.35, ease: EASE }}
              />
              <span>SC Academy</span>
              <span className="hero-eyebrow__slash" aria-hidden="true">/</span>
              <span>Elite Trading Education</span>
            </motion.p>
          </motion.div>

          <motion.h1
            className="hero-title"
            aria-label="Master the markets. Build your edge."
            style={{ y: titleY, opacity: fade }}
          >
            <span className="hero-title__mask" aria-hidden="true">
              <motion.span
                className="hero-title__line"
                initial={{ y: "115%", skewY: 5, opacity: 0 }}
                animate={{ y: 0, skewY: 0, opacity: 1 }}
                transition={{ duration: 1.15, delay: 0.5, ease: EASE }}
              >
                MASTER THE MARKETS.
              </motion.span>
            </span>
            <span className="hero-title__mask" aria-hidden="true">
              <motion.span
                className="hero-title__line"
                initial={{ y: "115%", skewY: 5, opacity: 0 }}
                animate={{ y: 0, skewY: 0, opacity: 1 }}
                transition={{ duration: 1.15, delay: 0.72, ease: EASE }}
              >
                BUILD <span className="hero-title__hl">YOUR EDGE.</span>
              </motion.span>
            </span>
          </motion.h1>

          <motion.p className="hero-lead" aria-label={LEAD} style={{ y: leadY, opacity: fade }}>
            {words.map((w, i) => (
              <motion.span
                key={i}
                className="hero-lead__word"
                aria-hidden="true"
                initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: 1.05 + i * 0.045, ease: EASE }}
              >
                {w}{" "}
              </motion.span>
            ))}
          </motion.p>

          <motion.div className="hero-cta" style={{ y: ctaY, opacity: fade }}>
            <motion.div {...rise(1.6)}>
              <MagneticLink href="#trading-programs" className="btn btn--primary" reduced={reduced}>
                <span>EXPLORE PROGRAMS</span>
                <ArrowRight className="btn__icon" size={17} strokeWidth={2} />
              </MagneticLink>
            </motion.div>
            <motion.div {...rise(1.75)}>
              <MagneticLink href="#about" className="btn btn--ghost" reduced={reduced}>
                <span>DISCOVER SC ACADEMY</span>
                <ArrowUpRight className="btn__icon btn__icon--diag" size={17} strokeWidth={2} />
              </MagneticLink>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ===== Scroll indicator ===== */}
      <div className="hero-scroll-wrap">
        <motion.a
          href="#about"
          className="hero-scroll"
          style={{ opacity: fade }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          aria-label="Scroll to explore"
        >
          <span className="hero-scroll__label">SCROLL</span>
          <span className="hero-scroll__track"><i /></span>
        </motion.a>
      </div>
    </section>
  );
}