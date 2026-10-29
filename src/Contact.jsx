import { useEffect, useRef, useState } from "react";
import { Link, useInRouterContext } from "react-router-dom";
import { Mail, ArrowRight, ArrowUpRight } from "lucide-react";
import "./Contact.css";

/* ------------------------------------------------------------------
   CONFIGURATION: fill these in. Nothing is invented.
   ------------------------------------------------------------------ */
const CONTACT_CONFIG = {
  email: "", // e.g. "info@yourdomain.com"
  instagramUrl: "", // e.g. "https://www.instagram.com/yourhandle"
  instagramHandle: "", // e.g. "@yourhandle"
  facebookUrl: "", // e.g. "https://www.facebook.com/yourpage"
  facebookName: "", // e.g. "SC ACADEMY"
  // Digits only, with country code, no +, spaces or hyphens. India example: 91XXXXXXXXXX
  whatsappNumber: "",
  whatsappDisplay: "", // e.g. "+91 XXXXX XXXXX"
  coursesPath: "/courses",
};

const COURSES = [
  "Market Foundation",
  "Price Action & Strategy",
  "Advanced Market Analysis",
  "General Enquiry",
];

/* ---------------- Brand logos (inline SVG) ---------------- */
const InstagramLogo = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-11.8a1.4 1.4 0 100 2.9 1.4 1.4 0 000-2.9z" />
  </svg>
);
const FacebookLogo = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.02 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.09 24 12.07z" />
  </svg>
);
const WhatsAppLogo = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 012.89 6.99c0 5.45-4.44 9.88-9.88 9.88zM20.52 3.45A11.8 11.8 0 0012.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41z" />
  </svg>
);

/* Router-safe link: uses <Link> inside a Router, falls back to a normal <a> outside one,
   so the page never crashes with "useContext(...) is null". */
function CourseLink({ to, children, ...rest }) {
  const inRouter = useInRouterContext();
  return inRouter ? (
    <Link to={to} {...rest}>{children}</Link>
  ) : (
    <a href={to} {...rest}>{children}</a>
  );
}

/* ---------------- Helpers ---------------- */
const waBase = () =>
  CONTACT_CONFIG.whatsappNumber
    ? `https://wa.me/${CONTACT_CONFIG.whatsappNumber.replace(/\D/g, "")}`
    : "";

const ChartLines = ({ className = "" }) => (
  <svg className={`chart-lines ${className}`} viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true">
    <path className="cl cl1" d="M0 320 L100 280 L200 300 L320 210 L430 250 L560 150 L680 190 L800 90 L920 140 L1050 60 L1200 100" />
    <path className="cl cl2" d="M0 360 L140 330 L260 345 L380 270 L520 300 L640 220 L780 250 L900 170 L1040 200 L1200 150" />
    <path className="cl cl3" d="M0 380 L180 360 L300 370 L460 320 L600 340 L760 290 L920 310 L1080 260 L1200 280" />
  </svg>
);

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
}

/* 3D tilt for desktop pointers only */
function tiltHandlers() {
  const fine = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return {
    onMouseMove: (e) => {
      if (!fine() || reduce()) return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-6px)`;
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = "";
    },
  };
}

/* ---------------- Page ---------------- */
export default function Contact() {
  const pageRef = useReveal();
  const formRef = useRef(null);
  const heroBgRef = useRef(null);

  const empty = { name: "", email: "", phone: "", course: "", message: "" };
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");

  // Gentle parallax on hero background
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (heroBgRef.current)
          heroBgRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.15}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const validate = (v) => {
    const e = {};
    if (!v.name.trim()) e.name = "Please enter your full name.";
    if (!v.email.trim()) e.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
      e.email = "Please enter a valid email address.";
    if (v.phone.trim() && !/^[+\d][\d\s\-()]{6,17}$/.test(v.phone.trim()))
      e.phone = "Please enter a valid phone number or leave it blank.";
    if (!v.course) e.course = "Please select a course.";
    if (!v.message.trim()) e.message = "Please tell us how we can help.";
    return e;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setNotice("");
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    const base = waBase();
    if (!base) {
      setNotice("WhatsApp number is not configured yet. Set CONTACT_CONFIG.whatsappNumber in Contact.jsx.");
      return;
    }
    const lines = [
      "Hello SC ACADEMY,",
      "",
      "I would like to know more about your trading education programs.",
      "",
      `Name: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
    ];
    if (values.phone.trim()) lines.push(`Phone: ${values.phone.trim()}`);
    lines.push(
      `Interested Course: ${values.course}`,
      `Message: ${values.message.trim()}`,
      "",
      "Please provide me with more information.",
      "",
      "Thank you."
    );
    const url = `${base}?text=${encodeURIComponent(lines.join("\n"))}`;
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) window.location.href = url; // popup blocked fallback
    setNotice("WhatsApp is opening with your message. Review it and press send there to reach us.");
  };

  const mailto = CONTACT_CONFIG.email ? `mailto:${CONTACT_CONFIG.email}` : null;
  const waHref = waBase() || null;

  const contactCards = [
    {
      key: "email",
      title: "Email Us",
      desc: "Have questions about our courses? Send us an email.",
      icon: <Mail />,
      label: CONTACT_CONFIG.email || "Add email in CONTACT_CONFIG",
      href: mailto,
      external: false,
    },
    {
      key: "instagram",
      title: "Instagram",
      desc: "Follow SC ACADEMY for updates, educational content, and academy news.",
      icon: <InstagramLogo />,
      label: CONTACT_CONFIG.instagramHandle || "Add Instagram in CONTACT_CONFIG",
      href: CONTACT_CONFIG.instagramUrl || null,
      external: true,
    },
    {
      key: "facebook",
      title: "Facebook",
      desc: "Connect with SC ACADEMY and follow our latest updates.",
      icon: <FacebookLogo />,
      label: CONTACT_CONFIG.facebookName || "Add Facebook in CONTACT_CONFIG",
      href: CONTACT_CONFIG.facebookUrl || null,
      external: true,
    },
    {
      key: "whatsapp",
      title: "WhatsApp",
      desc: "Have a quick question? Contact us directly through WhatsApp.",
      icon: <WhatsAppLogo />,
      label: CONTACT_CONFIG.whatsappDisplay || "Add WhatsApp in CONTACT_CONFIG",
      href: waHref,
      external: true,
    },
  ];

  const renderCard = ({ c, i, className = "ccard" }) => {
    const props = c.href
      ? { href: c.href, ...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {}) }
      : { role: "link", "aria-disabled": "true", onClick: (e) => e.preventDefault(), className: "is-unset" };
    return (
      <a
        key={c.key}
        {...props}
        className={`${className} ${c.key} ${c.href ? "" : "is-unset"}`}
        data-reveal
        style={{ "--d": `${i * 110}ms` }}
        {...tiltHandlers()}
      >
        <span className="ccard-line" />
        <span className="ccard-icon">{c.icon}</span>
        <h3>{c.title}</h3>
        <p>{c.desc}</p>
        <span className="ccard-label">{c.label}</span>
        <ArrowUpRight className="ccard-arrow" />
      </a>
    );
  };

  const renderField = ({ name, label, type = "text", placeholder, optional, children }) => (
    <div key={name} className={`field ${errors[name] ? "has-error" : ""}`}>
      <label htmlFor={`f-${name}`}>
        {label} {optional && <em>(optional)</em>}
      </label>
      {children || (
        <input
          id={`f-${name}`}
          name={name}
          type={type}
          value={values[name]}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `e-${name}` : undefined}
          autoComplete={name === "name" ? "name" : name === "email" ? "email" : name === "phone" ? "tel" : "off"}
        />
      )}
      <span className="field-line" />
      <p className="field-error" id={`e-${name}`} role="alert">
        {errors[name] || "\u00A0"}
      </p>
    </div>
  );

  return (
    <main className="contact-page" ref={pageRef}>
      {/* HERO */}
      <section className="c-hero">
        <div className="c-hero-bg" ref={heroBgRef}>
          <ChartLines />
          <span className="orb orb1" />
          <span className="orb orb2" />
        </div>
        <div className="c-wrap c-hero-inner">
          <p className="c-eyebrow hero-in" style={{ "--d": "0ms" }}>SC ACADEMY / CONTACT</p>
          <h1 className="c-hero-title" aria-label="Let's talk about your trading journey.">
            {["LET'S TALK ABOUT", "YOUR TRADING", "JOURNEY."].map((l, i) => (
              <span className="mask" key={l} aria-hidden="true">
                <span className="mask-in" style={{ "--d": `${200 + i * 160}ms` }}>{l}</span>
              </span>
            ))}
          </h1>
          <p className="c-hero-sub hero-in" style={{ "--d": "700ms" }}>
            Have questions about our trading courses or online classes? Connect with SC ACADEMY. We're here to help you explore our educational programs and take the next step in your market-learning journey.
          </p>
          <div className="c-btn-row">
            <button type="button" className="btn btn-light hero-in" style={{ "--d": "850ms" }} onClick={scrollToForm}>
              Send Us a Message <ArrowRight />
            </button>
            <CourseLink to={CONTACT_CONFIG.coursesPath} className="btn btn-ghost hero-in" style={{ "--d": "980ms" }}>
              Explore Our Courses
            </CourseLink>
          </div>
        </div>
        <svg className="c-hero-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 80V40C240 0 480 70 720 40S1200 0 1440 40V80Z" />
        </svg>
      </section>

      {/* CONTACT CARDS */}
      <section className="c-section c-cards-sec">
        <div className="c-wrap">
          <div className="c-cards">
            {contactCards.map((c, i) => renderCard({ c, i }))}
          </div>
        </div>
      </section>

      {/* FORM + ILLUSTRATION */}
      <section className="c-section c-form-sec" ref={formRef} id="contact-form">
        <div className="c-wrap c-form-grid">
          <div className="c-form-side" data-reveal>
            <h2 className="c-h2">HOW CAN WE HELP YOU?</h2>
            <span className="c-underline" />
            <p className="c-lead">
              Tell us what you'd like to know about SC ACADEMY, and connect with us to learn more about our trading education programs.
            </p>

            <svg className="c-illustration" viewBox="0 0 400 300" role="img" aria-label="Contact methods connected to SC Academy">
              <g className="paths" fill="none" stroke="#800020" strokeWidth="1.5" strokeLinecap="round">
                <path d="M200 150 C 150 110, 120 90, 70 60" />
                <path d="M200 150 C 250 110, 280 90, 330 60" />
                <path d="M200 150 C 150 190, 120 210, 70 240" />
                <path d="M200 150 C 250 190, 280 210, 330 240" />
              </g>
              <circle className="hub" cx="200" cy="150" r="34" fill="#800020" />
              <text x="200" y="155" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700" letterSpacing="1">SC</text>
              <g className="node n1"><circle cx="70" cy="60" r="24" fill="#fff" stroke="#800020" /><g transform="translate(58 48)" color="#800020"><Mail width="24" height="24" /></g></g>
              <g className="node n2"><circle cx="330" cy="60" r="24" fill="#fff" stroke="#800020" /><g transform="translate(318 48)" color="#800020"><InstagramLogo width="24" height="24" /></g></g>
              <g className="node n3"><circle cx="70" cy="240" r="24" fill="#fff" stroke="#800020" /><g transform="translate(58 228)" color="#800020"><FacebookLogo width="24" height="24" /></g></g>
              <g className="node n4"><circle cx="330" cy="240" r="24" fill="#fff" stroke="#800020" /><g transform="translate(318 228)" color="#800020"><WhatsAppLogo width="24" height="24" /></g></g>
              <rect className="bubble b1" x="150" y="40" width="46" height="26" rx="13" fill="#F0DDE3" />
              <rect className="bubble b2" x="210" y="244" width="56" height="26" rx="13" fill="#F0DDE3" />
            </svg>
          </div>

          <form className="c-form" onSubmit={onSubmit} noValidate data-reveal style={{ "--d": "120ms" }}>
            {renderField({ name: "name", label: "Full Name", placeholder: "Enter your full name" })}
            {renderField({ name: "email", label: "Email Address", type: "email", placeholder: "Enter your email address" })}
            {renderField({ name: "phone", label: "Phone Number", type: "tel", placeholder: "Enter your phone number", optional: true })}
            {renderField({ name: "course", label: "Interested Course", children: (
              <select id="f-course" name="course" value={values.course} onChange={onChange} aria-invalid={!!errors.course}>
                <option value="">Select a course</option>
                {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            ) })}
            {renderField({ name: "message", label: "Your Message", children: (
              <textarea
                id="f-message" name="message" rows={4} value={values.message} onChange={onChange}
                placeholder="Tell us how we can help you" aria-invalid={!!errors.message}
              />
            ) })}
            <button type="submit" className="btn btn-wine btn-wa">
              <WhatsAppLogo className="btn-ico" />
              <span>SEND MESSAGE ON WHATSAPP</span>
              <ArrowRight className="btn-arrow" />
            </button>
            <p className="form-note" aria-live="polite">
              {notice || "This opens WhatsApp with your details filled in. Your message is sent only when you press send in WhatsApp."}
            </p>
          </form>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="c-cta">
        <ChartLines className="cta-lines" />
        <div className="c-wrap c-cta-inner" data-reveal>
          <h2 className="c-cta-title">LET'S START A CONVERSATION.</h2>
          <p>
            Whether you're exploring your first trading course or looking to develop your market knowledge, SC ACADEMY is ready to help you discover the right learning path.
          </p>
          <div className="c-btn-row center">
            <a
              className={`btn btn-light ${waHref ? "" : "is-unset"}`}
              href={waHref || undefined}
              target="_blank" rel="noopener noreferrer"
              onClick={(e) => !waHref && e.preventDefault()}
            >
              <WhatsAppLogo className="btn-ico" /> CONTACT US ON WHATSAPP
            </a>
            <CourseLink to={CONTACT_CONFIG.coursesPath} className="btn btn-ghost">EXPLORE COURSES</CourseLink>
          </div>
        </div>
      </section>
    </main>
  );
}