import { useState, useRef, useEffect } from "react";

// ─── ICONS (inline SVG helpers) ───────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor", fill = "none", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  creditCard: "M1 4h22v16H1z M1 10h22",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  plus: "M12 5v14 M5 12h14",
  search: "M11 17a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M21 21l-4.35-4.35",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2",
  calendar: "M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18",
  trending: "M23 6l-9.5 9.5-5-5L1 18",
  package: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18 M6 6l12 12",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6 M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2",
  filter: "M22 3H2l8 9.46V19l4 2V12.46L22 3z",
  map: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  arrow: "M5 12h14 M12 5l7 7-7 7",
};

// ─── SAMPLE DATA ──────────────────────────────────────────────────────────────
const SAMPLE_PRODUCTS = [
  { id: 1, title: "DJI Drone Pro", category: "Electronics", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=80", owner: "Arjun K.", rating: 4.8, reviews: 42, location: "Bengaluru", hourly: 250, daily: 1500, weekly: 8000, monthly: 25000, available: true, description: "Professional grade DJI drone with 4K camera." },
  { id: 2, title: "Canon EOS R5 Camera", category: "Photography", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80", owner: "Priya M.", rating: 4.9, reviews: 87, location: "Mumbai", hourly: 400, daily: 2500, weekly: 14000, monthly: 45000, available: true, description: "Full-frame mirrorless camera, 45MP sensor." },
  { id: 3, title: "Mountain Bike Trek X1", category: "Sports", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", owner: "Ravi S.", rating: 4.6, reviews: 31, location: "Pune", hourly: 80, daily: 400, weekly: 2000, monthly: 6000, available: true, description: "High-performance mountain bike for all terrains." },
  { id: 4, title: "Sony A7 IV + Lens Kit", category: "Photography", image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&q=80", owner: "Meera R.", rating: 4.7, reviews: 55, location: "Delhi", hourly: 350, daily: 2000, weekly: 11000, monthly: 38000, available: false, description: "Professional Sony mirrorless with full lens kit." },
  { id: 5, title: "Camping Tent (6-person)", category: "Outdoor", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80", owner: "Kavya T.", rating: 4.5, reviews: 23, location: "Bengaluru", hourly: 60, daily: 300, weekly: 1500, monthly: 5000, available: true, description: "Weatherproof 6-person family camping tent." },
  { id: 6, title: "iPad Pro 12.9\" M2", category: "Electronics", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80", owner: "Suresh N.", rating: 4.9, reviews: 68, location: "Hyderabad", hourly: 150, daily: 900, weekly: 5000, monthly: 16000, available: true, description: "Latest iPad Pro with Apple Pencil included." },
];

const CATEGORIES = ["All", "Electronics", "Photography", "Sports", "Outdoor", "Vehicles", "Tools", "Furniture"];

// ─── STYLES (CSS-in-JS via template literals injected in head) ────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0b0f;
    --surface: #12141a;
    --surface2: #1a1d26;
    --surface3: #21253a;
    --accent: #f5a623;
    --accent2: #ff6b35;
    --text: #f0f0f8;
    --muted: #8890a8;
    --border: rgba(255,255,255,0.07);
    --radius: 14px;
    --success: #22c55e;
    --danger: #ef4444;
    --info: #3b82f6;
  }
  html, body, #root { height: 100%; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--surface3); border-radius: 99px; }
  input, select, textarea { font-family: 'DM Sans', sans-serif; }
  button { cursor: pointer; font-family: 'DM Sans', sans-serif; }
  
  @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes slideIn { from{transform:translateX(-100%);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes popIn { from{transform:scale(.9);opacity:0} to{transform:scale(1);opacity:1} }
`;

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────
const Badge = ({ children, color = "accent", size = "sm" }) => {
  const colors = { accent: "#f5a623", success: "#22c55e", danger: "#ef4444", info: "#3b82f6", muted: "#8890a8" };
  return (
    <span style={{
      background: colors[color] + "22", color: colors[color],
      border: `1px solid ${colors[color]}44`,
      padding: size === "sm" ? "2px 9px" : "5px 14px",
      borderRadius: 99, fontSize: size === "sm" ? 11 : 13, fontWeight: 600, letterSpacing: .3,
    }}>{children}</span>
  );
};

const Btn = ({ children, variant = "primary", onClick, style: s = {}, disabled, icon, size = "md" }) => {
  const base = {
    display: "flex", alignItems: "center", gap: 8, border: "none", borderRadius: 10,
    fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? .5 : 1,
    transition: "all .2s", whiteSpace: "nowrap",
    padding: size === "sm" ? "8px 16px" : size === "lg" ? "15px 32px" : "11px 22px",
    fontSize: size === "sm" ? 13 : size === "lg" ? 16 : 14,
  };
  const variants = {
    primary: { background: "linear-gradient(135deg,#f5a623,#ff6b35)", color: "#0a0b0f", boxShadow: "0 4px 20px rgba(245,166,35,.35)" },
    secondary: { background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)" },
    ghost: { background: "transparent", color: "var(--muted)", border: "1px solid var(--border)" },
    danger: { background: "#ef444420", color: "#ef4444", border: "1px solid #ef444440" },
    success: { background: "#22c55e20", color: "#22c55e", border: "1px solid #22c55e40" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...s }}>
      {icon && icon}{children}
    </button>
  );
};

const Input = ({ label, type = "text", value, onChange, placeholder, icon, required, hint }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", letterSpacing: .5 }}>{label}{required && <span style={{ color: "var(--accent)" }}> *</span>}</label>}
    <div style={{ position: "relative" }}>
      {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}>{icon}</span>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width: "100%", background: "var(--surface2)", border: "1.5px solid var(--border)",
          borderRadius: 10, padding: icon ? "12px 14px 12px 42px" : "12px 14px",
          color: "var(--text)", fontSize: 14, outline: "none", transition: "border-color .2s",
        }}
        onFocus={e => e.target.style.borderColor = "var(--accent)"}
        onBlur={e => e.target.style.borderColor = "var(--border)"}
      />
    </div>
    {hint && <span style={{ fontSize: 12, color: "var(--muted)" }}>{hint}</span>}
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", letterSpacing: .5 }}>{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{
        background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: 10,
        padding: "12px 14px", color: "var(--text)", fontSize: 14, outline: "none",
      }}>
      {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
    </select>
  </div>
);

const Card = ({ children, style: s = {}, onClick, hover = false }) => (
  <div onClick={onClick}
    style={{
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)",
      overflow: "hidden", transition: "all .25s", cursor: onClick ? "pointer" : "default",
      ...(hover ? { ":hover": { transform: "translateY(-2px)" } } : {}), ...s,
    }}
    onMouseEnter={hover ? e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,.5)"; e.currentTarget.style.borderColor = "rgba(245,166,35,.2)"; } : undefined}
    onMouseLeave={hover ? e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--border)"; } : undefined}
  >{children}</div>
);

const Modal = ({ open, onClose, title, children, width = 520 }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.75)", backdropFilter: "blur(6px)" }} />
      <div style={{ position: "relative", width: Math.min(width, window.innerWidth - 32), maxHeight: "90vh", overflow: "auto", background: "var(--surface)", borderRadius: 18, border: "1px solid var(--border)", boxShadow: "0 40px 100px rgba(0,0,0,.8)", animation: "popIn .25s ease", padding: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "var(--surface2)", border: "none", borderRadius: 8, padding: 8, color: "var(--muted)", cursor: "pointer" }}>
            <Icon d={icons.x} size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Toast = ({ message, type = "success", onClose }) => (
  <div style={{
    position: "fixed", bottom: 24, right: 24, zIndex: 2000,
    background: type === "success" ? "#22c55e22" : type === "error" ? "#ef444422" : "#3b82f622",
    border: `1px solid ${type === "success" ? "#22c55e" : type === "error" ? "#ef4444" : "#3b82f6"}66`,
    color: type === "success" ? "#22c55e" : type === "error" ? "#ef4444" : "#3b82f6",
    padding: "14px 20px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10,
    fontWeight: 600, fontSize: 14, animation: "fadeUp .3s ease", minWidth: 260,
    boxShadow: "0 8px 32px rgba(0,0,0,.5)",
  }}>
    <Icon d={type === "success" ? icons.check : icons.x} size={18} color="currentColor" />
    {message}
    <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: "currentColor", cursor: "pointer" }}>×</button>
  </div>
);

// ─── STAR RATING ──────────────────────────────────────────────────────────────
const Stars = ({ rating }) => (
  <span style={{ display: "flex", gap: 1 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <Icon key={i} d={icons.star} size={13} fill={i <= Math.floor(rating) ? "#f5a623" : "none"} color={i <= Math.floor(rating) ? "#f5a623" : "#555"} strokeWidth={1.5} />
    ))}
  </span>
);

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
const AuthScreen = ({ onLogin }) => {
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", phone: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (field) => (val) => setForm(f => ({ ...f, [field]: val }));

  const submit = () => {
    setError("");
    if (mode === "signup") {
      if (!form.name || !form.email || !form.password) return setError("Please fill all required fields.");
      if (form.password !== form.confirm) return setError("Passwords do not match.");
      if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    } else if (mode === "login") {
      if (!form.email || !form.password) return setError("Enter email and password.");
    } else {
      if (!form.email) return setError("Enter your email.");
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === "forgot") { setMode("login"); return; }
      onLogin({ name: form.name || "Rahul Sharma", email: form.email, phone: form.phone });
    }, 1500);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", background: "var(--bg)",
      backgroundImage: "radial-gradient(ellipse at 70% 20%, rgba(245,166,35,.08) 0%, transparent 60%)",
    }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 80px", maxWidth: 560, animation: "fadeUp .5s ease" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#f5a623,#ff6b35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={icons.package} size={22} color="#0a0b0f" strokeWidth={2} />
          </div>
          <span style={{ fontFamily: "Syne", fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>erentify</span>
        </div>

        <h1 style={{ fontFamily: "Syne", fontSize: 32, fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
          {mode === "login" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password"}
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: 32, fontSize: 15 }}>
          {mode === "login" ? "Sign in to rent or list your items." : mode === "signup" ? "Join thousands of renters across India." : "We'll send a reset link to your email."}
        </p>

        {error && (
          <div style={{ background: "#ef444415", border: "1px solid #ef444440", color: "#ef4444", padding: "12px 16px", borderRadius: 10, marginBottom: 20, fontSize: 13, fontWeight: 500 }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "signup" && <Input label="Full Name" value={form.name} onChange={handle("name")} placeholder="Rahul Sharma" required icon={<Icon d={icons.user} size={16} />} />}
          <Input label="Email Address" type="email" value={form.email} onChange={handle("email")} placeholder="you@example.com" required icon={<Icon d={icons.tag} size={16} />} />
          {mode === "signup" && <Input label="Phone Number" value={form.phone} onChange={handle("phone")} placeholder="+91 98765 43210" icon={<Icon d={icons.bell} size={16} />} />}
          {mode !== "forgot" && (
            <div style={{ position: "relative" }}>
              <Input label="Password" type={showPass ? "text" : "password"} value={form.password} onChange={handle("password")} placeholder="Min. 8 characters" required icon={<Icon d={icons.lock} size={16} />} />
              <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, bottom: 12, background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}>
                <Icon d={icons.eye} size={16} />
              </button>
            </div>
          )}
          {mode === "signup" && <Input label="Confirm Password" type="password" value={form.confirm} onChange={handle("confirm")} placeholder="Repeat password" icon={<Icon d={icons.lock} size={16} />} />}
        </div>

        {mode === "login" && (
          <div style={{ textAlign: "right", marginTop: 8 }}>
            <button onClick={() => setMode("forgot")} style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>Forgot password?</button>
          </div>
        )}

        <Btn onClick={submit} disabled={loading} size="lg" style={{ marginTop: 24, width: "100%", justifyContent: "center" }}>
          {loading ? "Please wait..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
        </Btn>

        {/* Social */}
        {mode !== "forgot" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0", color: "var(--muted)", fontSize: 13 }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} /> or continue with <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {["Google", "GitHub"].map(s => (
                <button key={s} onClick={() => onLogin({ name: "Demo User", email: "demo@erentify.in", phone: "+91 9999999999" })}
                  style={{ flex: 1, padding: "11px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--text)", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all .2s" }}>
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        <p style={{ textAlign: "center", marginTop: 28, color: "var(--muted)", fontSize: 14 }}>
          {mode === "login" ? "Don't have an account? " : mode === "signup" ? "Already have an account? " : "Remember your password? "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #12141a 0%, #1a1d26 100%)",
        borderLeft: "1px solid var(--border)", padding: 60, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,166,35,.12) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,.1) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 400, textAlign: "center" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 }}>
            {[
              { icon: icons.package, label: "50K+ Items Listed", color: "#f5a623" },
              { icon: icons.user, label: "120K+ Active Users", color: "#3b82f6" },
              { icon: icons.shield, label: "Verified & Secure", color: "#22c55e" },
              { icon: icons.creditCard, label: "Safe Payments", color: "#a855f7" },
            ].map(({ icon, label, color }) => (
              <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
                  <Icon d={icon} size={20} color={color} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>
          <h2 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Rent Anything.<br />List Everything.</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>From cameras to camping gear — rent what you need, earn from what you own. Hourly, daily, weekly, or monthly.</p>
        </div>
      </div>
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive, user, onLogout, collapsed, setCollapsed }) => {
  const navItems = [
    { id: "dashboard", icon: icons.home, label: "Dashboard" },
    { id: "browse", icon: icons.search, label: "Browse Items" },
    { id: "my-rentals", icon: icons.clock, label: "My Rentals" },
    { id: "my-listings", icon: icons.tag, label: "My Listings" },
    { id: "upload", icon: icons.upload, label: "List an Item" },
    { id: "payments", icon: icons.creditCard, label: "Payments" },
    { id: "security", icon: icons.shield, label: "Security" },
    { id: "profile", icon: icons.user, label: "Profile" },
  ];

  return (
    <div style={{
      width: collapsed ? 70 : 240, minHeight: "100vh", background: "var(--surface)",
      borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column",
      transition: "width .3s cubic-bezier(.4,0,.2,1)", flexShrink: 0, overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? "24px 0" : "24px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)", justifyContent: collapsed ? "center" : "flex-start" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#f5a623,#ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon d={icons.package} size={18} color="#0a0b0f" strokeWidth={2} />
        </div>
        {!collapsed && <span style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>erentify</span>}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
        {navItems.map(({ id, icon, label }) => (
          <button key={id} onClick={() => setActive(id)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: collapsed ? "12px 0" : "12px 14px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 500, fontSize: 14,
              background: active === id ? "rgba(245,166,35,.12)" : "transparent",
              color: active === id ? "var(--accent)" : "var(--muted)",
              transition: "all .2s", width: "100%",
            }}
            onMouseEnter={e => { if (active !== id) { e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.color = "var(--text)"; } }}
            onMouseLeave={e => { if (active !== id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted)"; } }}
          >
            <Icon d={icon} size={18} color="currentColor" />
            {!collapsed && label}
          </button>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: collapsed ? "16px 0" : "16px 10px", borderTop: "1px solid var(--border)" }}>
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "var(--surface2)", borderRadius: 10, marginBottom: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#f5a623,#ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#0a0b0f", flexShrink: 0 }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
            </div>
          </div>
        )}
        <button onClick={onLogout}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "12px 0" : "10px 14px", justifyContent: collapsed ? "center" : "flex-start", width: "100%", background: "none", border: "none", color: "var(--muted)", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 500, transition: "all .2s" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "#ef444415"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "transparent"; }}>
          <Icon d={icons.logout} size={18} color="currentColor" />
          {!collapsed && "Sign Out"}
        </button>
        <button onClick={() => setCollapsed(!collapsed)}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px 0" : "10px 14px", justifyContent: collapsed ? "center" : "flex-start", width: "100%", background: "none", border: "none", color: "var(--muted)", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all .2s", marginTop: 4 }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.color = "var(--text)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted)"; }}>
          <Icon d={collapsed ? icons.arrow : "M15 18l-6-6 6-6"} size={18} color="currentColor" />
          {!collapsed && "Collapse"}
        </button>
      </div>
    </div>
  );
};

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
const DashboardPage = ({ user, setActive }) => {
  const stats = [
    { label: "Total Earned", value: "₹42,500", icon: icons.trending, color: "#22c55e", change: "+12% this month" },
    { label: "Active Rentals", value: "7", icon: icons.clock, color: "#3b82f6", change: "3 ending soon" },
    { label: "Listed Items", value: "12", icon: icons.tag, color: "#f5a623", change: "2 pending review" },
    { label: "Rating", value: "4.8★", icon: icons.star, color: "#a855f7", change: "from 86 reviews" },
  ];

  const recentActivity = [
    { type: "rental", msg: "DJI Drone rented by Ankit S.", time: "2h ago", icon: icons.package, color: "#3b82f6" },
    { type: "payment", msg: "₹2,500 received for Camera rental", time: "5h ago", icon: icons.creditCard, color: "#22c55e" },
    { type: "review", msg: "New 5★ review on Mountain Bike", time: "1d ago", icon: icons.star, color: "#f5a623" },
    { type: "listing", msg: "iPad Pro listing approved", time: "2d ago", icon: icons.check, color: "#22c55e" },
    { type: "return", msg: "Camping Tent returned by Rahul K.", time: "3d ago", icon: icons.package, color: "#8890a8" },
  ];

  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
          Good morning, {user.name?.split(" ")[0]} 👋
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 15 }}>Here's what's happening with your rentals today.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {stats.map(({ label, value, icon, color, change }) => (
          <Card key={label} style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={icon} size={20} color={color} />
              </div>
              <Badge color={color === "#22c55e" ? "success" : color === "#ef4444" ? "danger" : "accent"}>↑</Badge>
            </div>
            <div style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>{label}</div>
            <div style={{ fontSize: 12, color, marginTop: 6, fontWeight: 500 }}>{change}</div>
          </Card>
        ))}
      </div>

      {/* Lower grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
        {/* Recent Activity */}
        <Card style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 17 }}>Recent Activity</h3>
            <Btn variant="ghost" size="sm">View all</Btn>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {recentActivity.map(({ msg, time, icon, color }, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: "var(--surface2)", borderRadius: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon d={icon} size={16} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{msg}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 17, marginBottom: 16 }}>Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "List a New Item", icon: icons.plus, action: "upload" },
                { label: "Browse Rentals", icon: icons.search, action: "browse" },
                { label: "View Payments", icon: icons.creditCard, action: "payments" },
                { label: "Security Settings", icon: icons.shield, action: "security" },
              ].map(({ label, icon, action }) => (
                <button key={label} onClick={() => setActive(action)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "13px 16px",
                    background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10,
                    color: "var(--text)", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all .2s", textAlign: "left",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,166,35,.4)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text)"; }}>
                  <Icon d={icon} size={16} color="currentColor" />
                  {label}
                  <Icon d={icons.arrow} size={14} color="currentColor" style={{ marginLeft: "auto" }} />
                </button>
              ))}
            </div>
          </Card>

          <Card style={{ padding: 24, background: "linear-gradient(135deg, rgba(245,166,35,.12), rgba(255,107,53,.08))", borderColor: "rgba(245,166,35,.2)" }}>
            <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, marginBottom: 8 }}>🔥 Pro Tip</div>
            <div style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text)" }}>Items with high-quality photos get <strong>3× more rentals</strong>. Upload at least 4 images per listing!</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── BROWSE PAGE ──────────────────────────────────────────────────────────────
const BrowsePage = ({ onRent }) => {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [period, setPeriod] = useState("daily");
  const [sort, setSort] = useState("popular");

  const filtered = SAMPLE_PRODUCTS.filter(p =>
    (cat === "All" || p.category === cat) &&
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => sort === "price-asc" ? a[period] - b[period] : sort === "price-desc" ? b[period] - a[period] : b.reviews - a.reviews);

  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Browse Items</h1>
        <p style={{ color: "var(--muted)", fontSize: 15 }}>Rent from verified owners across India.</p>
      </div>

      {/* Filters Bar */}
      <Card style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted)" }}><Icon d={icons.search} size={16} /></span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items…"
              style={{ width: "100%", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px 10px 38px", color: "var(--text)", fontSize: 14, outline: "none" }} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["hourly", "daily", "weekly", "monthly"].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .2s", textTransform: "capitalize",
                  background: period === p ? "rgba(245,166,35,.15)" : "var(--surface2)",
                  borderColor: period === p ? "var(--accent)" : "var(--border)",
                  color: period === p ? "var(--accent)" : "var(--muted)" }}>
                {p}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", color: "var(--text)", fontSize: 13, outline: "none" }}>
            <option value="popular">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* Categories */}
        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding: "6px 14px", borderRadius: 99, border: "1px solid", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s",
                background: cat === c ? "var(--accent)" : "transparent",
                borderColor: cat === c ? "var(--accent)" : "var(--border)",
                color: cat === c ? "#0a0b0f" : "var(--muted)" }}>
              {c}
            </button>
          ))}
        </div>
      </Card>

      {/* Results */}
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>{filtered.length} items found</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {filtered.map(p => (
          <Card key={p.id} hover style={{ cursor: "pointer" }}>
            <div style={{ position: "relative" }}>
              <img src={p.image} alt={p.title} style={{ width: "100%", height: 180, objectFit: "cover" }} />
              <div style={{ position: "absolute", top: 10, right: 10 }}>
                <Badge color={p.available ? "success" : "muted"}>{p.available ? "Available" : "Rented"}</Badge>
              </div>
              <div style={{ position: "absolute", top: 10, left: 10 }}>
                <Badge color="accent">{p.category}</Badge>
              </div>
            </div>
            <div style={{ padding: 18 }}>
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{p.title}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, color: "var(--muted)", fontSize: 12 }}>
                <Icon d={icons.map} size={12} color="currentColor" />{p.location} · by {p.owner}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
                <Stars rating={p.rating} />
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{p.rating} ({p.reviews})</span>
              </div>

              {/* Pricing tiers */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 16 }}>
                {[["hourly", "hr"], ["daily", "day"], ["weekly", "wk"], ["monthly", "mo"]].map(([key, label]) => (
                  <div key={key} style={{
                    padding: "8px 10px", borderRadius: 8, textAlign: "center",
                    background: period === key ? "rgba(245,166,35,.12)" : "var(--surface2)",
                    border: `1px solid ${period === key ? "var(--accent)" : "var(--border)"}`,
                    cursor: "pointer", transition: "all .15s",
                  }} onClick={() => setPeriod(key)}>
                    <div style={{ fontFamily: "Syne", fontSize: 14, fontWeight: 700, color: period === key ? "var(--accent)" : "var(--text)" }}>₹{p[key].toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: .5 }}>/{label}</div>
                  </div>
                ))}
              </div>

              <Btn onClick={() => p.available && onRent(p, period)} disabled={!p.available} style={{ width: "100%", justifyContent: "center" }} size="sm">
                {p.available ? `Rent Now · ₹${p[period].toLocaleString()}/${period === "hourly" ? "hr" : period === "daily" ? "day" : period === "weekly" ? "wk" : "mo"}` : "Not Available"}
              </Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── UPLOAD / LIST ITEM PAGE ──────────────────────────────────────────────────
const UploadPage = ({ onSuccess }) => {
  const [form, setForm] = useState({ title: "", category: "", description: "", location: "", hourly: "", daily: "", weekly: "", monthly: "", condition: "Excellent" });
  const [images, setImages] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [step, setStep] = useState(1);
  const fileRef = useRef();
  const handle = f => v => setForm(p => ({ ...p, [f]: v }));

  const handleFiles = (files) => {
    const newImgs = Array.from(files).slice(0, 6 - images.length).map(f => ({
      file: f, url: URL.createObjectURL(f), name: f.name, size: (f.size / 1024).toFixed(0) + " KB",
    }));
    setImages(p => [...p, ...newImgs]);
  };

  const submit = () => {
    if (step < 3) { setStep(s => s + 1); return; }
    onSuccess();
  };

  const stepLabels = ["Item Details", "Pricing", "Media & Review"];

  return (
    <div style={{ animation: "fadeUp .4s ease", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, marginBottom: 6 }}>List Your Item</h1>
        <p style={{ color: "var(--muted)", fontSize: 15 }}>Earn money by renting out what you own.</p>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", gap: 0, marginBottom: 36, position: "relative" }}>
        {stepLabels.map((label, i) => {
          const done = i + 1 < step, active = i + 1 === step;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative" }}>
              {i < 2 && <div style={{ position: "absolute", top: 16, left: "50%", width: "100%", height: 2, background: done ? "var(--accent)" : "var(--border)", zIndex: 0, transition: "background .3s" }} />}
              <div style={{ width: 32, height: 32, borderRadius: "50%", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, transition: "all .3s",
                background: done ? "var(--accent)" : active ? "rgba(245,166,35,.2)" : "var(--surface2)",
                border: `2px solid ${done || active ? "var(--accent)" : "var(--border)"}`,
                color: done ? "#0a0b0f" : active ? "var(--accent)" : "var(--muted)" }}>
                {done ? <Icon d={icons.check} size={14} color="#0a0b0f" /> : i + 1}
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: active ? "var(--accent)" : "var(--muted)" }}>{label}</div>
            </div>
          );
        })}
      </div>

      <Card style={{ padding: 32 }}>
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Item Information</h3>
            <Input label="Item Title" value={form.title} onChange={handle("title")} placeholder='e.g. "DJI Mavic Pro 3 Drone"' required />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Select label="Category" value={form.category} onChange={handle("category")} options={["", ...CATEGORIES.slice(1)].map(v => ({ value: v, label: v || "Select category…" }))} />
              <Select label="Condition" value={form.condition} onChange={handle("condition")} options={["Excellent", "Good", "Fair"].map(v => ({ value: v, label: v }))} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>Description <span style={{ color: "var(--accent)" }}>*</span></label>
              <textarea value={form.description} onChange={e => handle("description")(e.target.value)} placeholder="Describe your item, what's included, usage guidelines…" rows={4}
                style={{ background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: 10, padding: "12px 14px", color: "var(--text)", fontSize: 14, outline: "none", resize: "vertical", fontFamily: "DM Sans" }}
                onFocus={e => e.target.style.borderColor = "var(--accent)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
            </div>
            <Input label="Location / City" value={form.location} onChange={handle("location")} placeholder="e.g. Bengaluru, Koramangala" icon={<Icon d={icons.map} size={16} />} />
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Set Your Rental Prices</h3>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>Set prices for different rental periods. Leave blank if you don't offer that option.</p>
            </div>
            {[
              { key: "hourly", label: "Hourly Rate", icon: icons.clock, hint: "Good for tools, bikes, etc." },
              { key: "daily", label: "Daily Rate", icon: icons.calendar, hint: "Most popular option" },
              { key: "weekly", label: "Weekly Rate", icon: icons.calendar, hint: "Offer a discount vs daily" },
              { key: "monthly", label: "Monthly Rate", icon: icons.calendar, hint: "Best for long-term needs" },
            ].map(({ key, label, icon, hint }) => (
              <div key={key}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Icon d={icon} size={16} color="var(--accent)" />
                  <label style={{ fontSize: 14, fontWeight: 600 }}>{label}</label>
                </div>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--accent)", fontWeight: 700, fontSize: 15 }}>₹</span>
                  <input type="number" value={form[key]} onChange={e => handle(key)(e.target.value)} placeholder="0.00"
                    style={{ width: "100%", background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: 10, padding: "12px 14px 12px 32px", color: "var(--text)", fontSize: 15, fontWeight: 600, outline: "none" }}
                    onFocus={e => e.target.style.borderColor = "var(--accent)"}
                    onBlur={e => e.target.style.borderColor = "var(--border)"} />
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{hint}</div>
              </div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Upload Photos</h3>
              <p style={{ color: "var(--muted)", fontSize: 14 }}>Upload up to 6 high-quality photos. Good photos get 3× more rentals.</p>
            </div>

            {/* Drop Zone */}
            <div
              onClick={() => fileRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
              style={{
                border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 14, padding: 40, textAlign: "center", cursor: "pointer",
                background: dragging ? "rgba(245,166,35,.05)" : "var(--surface2)", transition: "all .2s",
              }}>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
              <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(245,166,35,.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <Icon d={icons.upload} size={24} color="var(--accent)" />
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>Drop images here or click to upload</div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>PNG, JPG, WEBP up to 10MB each · Max 6 images</div>
            </div>

            {images.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {images.map((img, i) => (
                  <div key={i} style={{ position: "relative", borderRadius: 10, overflow: "hidden", aspectRatio: "4/3" }}>
                    <img src={img.url} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 10, opacity: 0, transition: "opacity .2s" }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                      onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                      <button onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))}
                        style={{ alignSelf: "flex-end", background: "#ef444444", border: "none", borderRadius: 6, padding: 4, cursor: "pointer", color: "#fff" }}>
                        <Icon d={icons.x} size={14} color="#fff" />
                      </button>
                      {i === 0 && <Badge color="accent">Cover</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Review Summary */}
            <div style={{ background: "var(--surface2)", borderRadius: 12, padding: 20, border: "1px solid var(--border)" }}>
              <h4 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Listing Summary</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  ["Title", form.title || "—"], ["Category", form.category || "—"],
                  ["Location", form.location || "—"], ["Condition", form.condition],
                  ["Hourly", form.hourly ? `₹${form.hourly}` : "Not offered"],
                  ["Daily", form.daily ? `₹${form.daily}` : "Not offered"],
                  ["Weekly", form.weekly ? `₹${form.weekly}` : "Not offered"],
                  ["Monthly", form.monthly ? `₹${form.monthly}` : "Not offered"],
                ].map(([k, v]) => (
                  <div key={k} style={{ fontSize: 13 }}>
                    <span style={{ color: "var(--muted)" }}>{k}: </span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
          {step > 1 ? <Btn variant="secondary" onClick={() => setStep(s => s - 1)}>← Back</Btn> : <div />}
          <Btn onClick={submit} size="lg">{step < 3 ? "Continue →" : "🚀 Publish Listing"}</Btn>
        </div>
      </Card>
    </div>
  );
};

// ─── PAYMENTS PAGE ────────────────────────────────────────────────────────────
const PaymentsPage = () => {
  const [tab, setTab] = useState("overview");
  const [payModal, setPayModal] = useState(false);
  const [cardForm, setCardForm] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [payMethod, setPayMethod] = useState("card");
  const [processing, setProcessing] = useState(false);

  const transactions = [
    { id: "TXN001", desc: "DJI Drone rental (3 days)", amount: 4500, type: "debit", status: "completed", date: "Apr 18, 2025" },
    { id: "TXN002", desc: "Camera rental income", amount: 7500, type: "credit", status: "completed", date: "Apr 15, 2025" },
    { id: "TXN003", desc: "Mountain Bike rental income", amount: 1200, type: "credit", status: "pending", date: "Apr 14, 2025" },
    { id: "TXN004", desc: "iPad Pro rental (1 week)", amount: 5000, type: "debit", status: "completed", date: "Apr 10, 2025" },
    { id: "TXN005", desc: "Security deposit refund", amount: 2000, type: "credit", status: "completed", date: "Apr 8, 2025" },
  ];

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setPayModal(false); }, 2000);
  };

  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Payments</h1>
          <p style={{ color: "var(--muted)", fontSize: 15 }}>Manage your transactions and payment methods.</p>
        </div>
        <Btn onClick={() => setPayModal(true)} icon={<Icon d={icons.plus} size={16} color="currentColor" />}>Add Payment Method</Btn>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "var(--surface)", borderRadius: 10, padding: 4, width: "fit-content", border: "1px solid var(--border)" }}>
        {["overview", "transactions", "methods", "payouts"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, textTransform: "capitalize", transition: "all .2s",
              background: tab === t ? "var(--accent)" : "transparent",
              color: tab === t ? "#0a0b0f" : "var(--muted)" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { label: "Total Earnings", value: "₹42,500", icon: icons.trending, color: "#22c55e", sub: "This month" },
            { label: "Pending Payouts", value: "₹3,200", icon: icons.clock, color: "#f5a623", sub: "Processing" },
            { label: "Total Spent", value: "₹18,700", icon: icons.creditCard, color: "#3b82f6", sub: "On rentals" },
          ].map(({ label, value, icon, color, sub }) => (
            <Card key={label} style={{ padding: 28 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon d={icon} size={22} color={color} />
              </div>
              <div style={{ fontFamily: "Syne", fontSize: 32, fontWeight: 800, marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 14, color: "var(--muted)" }}>{label}</div>
              <div style={{ fontSize: 12, color, marginTop: 4, fontWeight: 500 }}>{sub}</div>
            </Card>
          ))}
          {/* Payment gateways */}
          <Card style={{ padding: 24, gridColumn: "1 / -1" }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Payment Gateways Supported</h3>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { name: "Razorpay", color: "#3395FF", desc: "UPI, Cards, Wallets" },
                { name: "PayU", color: "#F36D20", desc: "Credit/Debit Cards" },
                { name: "Paytm", color: "#00BAF2", desc: "Paytm Wallet, UPI" },
                { name: "Stripe", color: "#635BFF", desc: "International Cards" },
                { name: "PhonePe", color: "#5F259F", desc: "UPI Payments" },
                { name: "BHIM UPI", color: "#00A13A", desc: "All UPI Apps" },
              ].map(({ name, color, desc }) => (
                <div key={name} style={{ padding: "14px 20px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, display: "flex", alignItems: "center", gap: 12, minWidth: 180 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color, letterSpacing: -0.5 }}>{name.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{desc}</div>
                  </div>
                  <Badge color="success">Active</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === "transactions" && (
        <Card>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16 }}>Transaction History</h3>
            <Btn variant="ghost" size="sm">Export CSV</Btn>
          </div>
          <div>
            {transactions.map(({ id, desc, amount, type, status, date }) => (
              <div key={id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: type === "credit" ? "#22c55e22" : "#ef444422", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon d={type === "credit" ? icons.trending : icons.arrow} size={18} color={type === "credit" ? "#22c55e" : "#ef4444"} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{desc}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{id} · {date}</div>
                </div>
                <Badge color={status === "completed" ? "success" : "accent"}>{status}</Badge>
                <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, color: type === "credit" ? "#22c55e" : "#ef4444" }}>
                  {type === "credit" ? "+" : "-"}₹{amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === "methods" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { type: "Visa", last4: "4242", expiry: "12/27", isDefault: true },
            { type: "Mastercard", last4: "8903", expiry: "09/26", isDefault: false },
          ].map(({ type, last4, expiry, isDefault }) => (
            <Card key={last4} style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 56, height: 40, borderRadius: 8, background: "var(--surface2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "var(--accent)" }}>{type.toUpperCase().slice(0, 4)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{type} ending in {last4}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Expires {expiry}</div>
              </div>
              {isDefault && <Badge color="success">Default</Badge>}
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="ghost" size="sm">Edit</Btn>
                <Btn variant="danger" size="sm">Remove</Btn>
              </div>
            </Card>
          ))}
          <Btn onClick={() => setPayModal(true)} variant="secondary" icon={<Icon d={icons.plus} size={16} color="currentColor" />} style={{ width: "fit-content" }}>Add New Method</Btn>
        </div>
      )}

      {tab === "payouts" && (
        <Card style={{ padding: 32, maxWidth: 500 }}>
          <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Request Payout</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ padding: 16, background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 10 }}>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Available Balance</div>
              <div style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, color: "#22c55e" }}>₹39,300</div>
            </div>
            <Input label="Bank Account / UPI ID" value={upiId} onChange={setUpiId} placeholder="yourname@upi or XXXX account" />
            <Input label="Amount to Withdraw" type="number" value="" onChange={() => {}} placeholder="Min ₹500" icon={<span style={{ color: "var(--accent)", fontWeight: 700 }}>₹</span>} />
            <Btn size="lg" style={{ width: "100%", justifyContent: "center" }}>Request Payout</Btn>
            <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center" }}>Payouts processed within 1-3 business days.</p>
          </div>
        </Card>
      )}

      {/* Payment Modal */}
      <Modal open={payModal} onClose={() => setPayModal(false)} title="Add Payment Method">
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {["card", "upi", "wallet"].map(m => (
            <button key={m} onClick={() => setPayMethod(m)}
              style={{ flex: 1, padding: "10px", borderRadius: 8, border: `2px solid ${payMethod === m ? "var(--accent)" : "var(--border)"}`, background: payMethod === m ? "rgba(245,166,35,.1)" : "var(--surface2)", color: payMethod === m ? "var(--accent)" : "var(--muted)", fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize" }}>
              {m === "upi" ? "UPI" : m === "card" ? "💳 Card" : "👛 Wallet"}
            </button>
          ))}
        </div>

        {payMethod === "card" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Card Number" value={cardForm.number} onChange={v => setCardForm(f => ({ ...f, number: v }))} placeholder="1234 5678 9012 3456" />
            <Input label="Cardholder Name" value={cardForm.name} onChange={v => setCardForm(f => ({ ...f, name: v }))} placeholder="As on card" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Input label="Expiry" value={cardForm.expiry} onChange={v => setCardForm(f => ({ ...f, expiry: v }))} placeholder="MM/YY" />
              <Input label="CVV" type="password" value={cardForm.cvv} onChange={v => setCardForm(f => ({ ...f, cvv: v }))} placeholder="•••" />
            </div>
            <div style={{ display: "flex", align: "center", gap: 8, fontSize: 12, color: "var(--muted)", padding: "10px 14px", background: "rgba(245,166,35,.06)", borderRadius: 8, border: "1px solid rgba(245,166,35,.15)" }}>
              <Icon d={icons.shield} size={14} color="var(--accent)" />
              Secured with 256-bit SSL encryption. Powered by Razorpay.
            </div>
          </div>
        )}

        {payMethod === "upi" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="UPI ID" value={upiId} onChange={setUpiId} placeholder="yourname@paytm / @phonepe / @ybl" />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["@paytm", "@phonepe", "@ybl", "@okhdfcbank", "@okaxis"].map(suffix => (
                <button key={suffix} onClick={() => setUpiId(prev => prev.split("@")[0] + suffix)}
                  style={{ padding: "6px 14px", borderRadius: 99, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--muted)", fontSize: 12, cursor: "pointer" }}>
                  {suffix}
                </button>
              ))}
            </div>
          </div>
        )}

        {payMethod === "wallet" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {["Paytm", "PhonePe", "Amazon Pay", "Mobikwik"].map(w => (
              <button key={w}
                style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: 12, background: "var(--surface2)", color: "var(--text)", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all .2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                {w}
              </button>
            ))}
          </div>
        )}

        <Btn onClick={handlePay} disabled={processing} size="lg" style={{ width: "100%", justifyContent: "center", marginTop: 24 }}>
          {processing ? "Processing…" : "Save Payment Method"}
        </Btn>
      </Modal>
    </div>
  );
};

// ─── SECURITY PAGE ────────────────────────────────────────────────────────────
const SecurityPage = ({ user }) => {
  const [twoFA, setTwoFA] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpStep, setOtpStep] = useState(false);
  const [sessions, ] = useState([
    { device: "Chrome on Windows", location: "Bengaluru, IN", time: "Active now", current: true },
    { device: "Safari on iPhone 15", location: "Mumbai, IN", time: "2 hours ago", current: false },
    { device: "Firefox on MacBook", location: "Delhi, IN", time: "3 days ago", current: false },
  ]);

  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Security</h1>
        <p style={{ color: "var(--muted)", fontSize: 15 }}>Keep your account safe and secure.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Security Score */}
        <Card style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
              <svg viewBox="0 0 90 90" width={90} height={90}>
                <circle cx={45} cy={45} r={38} fill="none" stroke="var(--surface2)" strokeWidth={8} />
                <circle cx={45} cy={45} r={38} fill="none" stroke={twoFA ? "#22c55e" : "#f5a623"} strokeWidth={8}
                  strokeDasharray={`${(twoFA ? 82 : 60) * 2.39} 239`} strokeLinecap="round" transform="rotate(-90 45 45)" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne", fontWeight: 800, fontSize: 18, color: twoFA ? "#22c55e" : "#f5a623" }}>
                {twoFA ? "82" : "60"}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 20, marginBottom: 6 }}>Security Score: {twoFA ? "Good" : "Fair"}</div>
              <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
                {twoFA ? "Great job! Your account is well protected." : "Enable 2FA and complete your profile to boost your score."}
              </div>
            </div>
          </div>
        </Card>

        {/* 2FA */}
        <Card style={{ padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <Icon d={icons.shield} size={20} color="var(--accent)" />
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 17 }}>Two-Factor Authentication</h3>
                <Badge color={twoFA ? "success" : "muted"}>{twoFA ? "Enabled" : "Disabled"}</Badge>
              </div>
              <p style={{ color: "var(--muted)", fontSize: 14, maxWidth: 400 }}>Add an extra layer of security. We'll ask for a verification code when you sign in.</p>
            </div>
            <button onClick={() => { setOtpStep(true); }}
              style={{ padding: "10px 22px", borderRadius: 10, border: `1.5px solid ${twoFA ? "#ef444440" : "var(--accent)"}`, background: twoFA ? "#ef444415" : "rgba(245,166,35,.12)", color: twoFA ? "#ef4444" : "var(--accent)", fontWeight: 600, cursor: "pointer", fontSize: 14, transition: "all .2s" }}>
              {twoFA ? "Disable 2FA" : "Enable 2FA"}
            </button>
          </div>
          {otpStep && !twoFA && (
            <div style={{ marginTop: 24, padding: 20, background: "var(--surface2)", borderRadius: 12, border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 14, marginBottom: 16, color: "var(--muted)" }}>Enter the 6-digit OTP sent to {user.phone || "+91 98765 XXXXX"}</p>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                {otp.map((v, i) => (
                  <input key={i} maxLength={1} value={v}
                    onChange={e => { const n = [...otp]; n[i] = e.target.value; setOtp(n); if (e.target.value && i < 5) document.getElementById(`otp-${i + 1}`)?.focus(); }}
                    id={`otp-${i}`}
                    style={{ width: 46, height: 52, textAlign: "center", fontFamily: "Syne", fontSize: 22, fontWeight: 700, background: "var(--surface)", border: `2px solid ${v ? "var(--accent)" : "var(--border)"}`, borderRadius: 10, color: "var(--text)", outline: "none" }} />
                ))}
              </div>
              <Btn onClick={() => { setTwoFA(true); setOtpStep(false); setOtp(["", "", "", "", "", ""]); }}>Verify & Enable</Btn>
            </div>
          )}
        </Card>

        {/* Password */}
        <Card style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Icon d={icons.lock} size={20} color="var(--accent)" />
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 17 }}>Change Password</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 400 }}>
            <Input label="Current Password" type="password" value="" onChange={() => {}} placeholder="••••••••" />
            <Input label="New Password" type="password" value="" onChange={() => {}} placeholder="Min 8 characters" hint="Use uppercase, numbers and symbols for a stronger password." />
            <Input label="Confirm New Password" type="password" value="" onChange={() => {}} placeholder="••••••••" />
            <Btn style={{ width: "fit-content" }}>Update Password</Btn>
          </div>
        </Card>

        {/* Active Sessions */}
        <Card style={{ padding: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon d={icons.eye} size={20} color="var(--accent)" />
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 17 }}>Active Sessions</h3>
            </div>
            <Btn variant="danger" size="sm">Revoke All Others</Btn>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sessions.map(({ device, location, time, current }) => (
              <div key={device} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "var(--surface2)", borderRadius: 10, border: `1px solid ${current ? "rgba(245,166,35,.2)" : "var(--border)"}` }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: current ? "rgba(245,166,35,.12)" : "var(--surface3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d={icons.shield} size={18} color={current ? "var(--accent)" : "var(--muted)"} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    {device}
                    {current && <Badge color="success">This device</Badge>}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{location} · {time}</div>
                </div>
                {!current && <Btn variant="danger" size="sm">Revoke</Btn>}
              </div>
            ))}
          </div>
        </Card>

        {/* Verification */}
        <Card style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Icon d={icons.check} size={20} color="var(--accent)" />
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 17 }}>Verification Status</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Email Verified", done: true },
              { label: "Phone Verified", done: true },
              { label: "Aadhaar / Govt ID", done: false },
              { label: "Bank Account Linked", done: false },
            ].map(({ label, done }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", background: "var(--surface2)", borderRadius: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: done ? "#22c55e22" : "var(--surface3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon d={done ? icons.check : icons.x} size={14} color={done ? "#22c55e" : "#8890a8"} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
                </div>
                {done ? <Badge color="success">Verified</Badge> : <Btn variant="ghost" size="sm">Verify Now</Btn>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── MY RENTALS PAGE ──────────────────────────────────────────────────────────
const MyRentalsPage = () => {
  const rentals = [
    { id: "R001", item: "DJI Drone Pro", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=200&q=80", from: "Apr 15", to: "Apr 18", cost: 4500, status: "completed", period: "daily" },
    { id: "R002", item: "Canon EOS R5", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&q=80", from: "Apr 20", to: "Apr 27", cost: 14000, status: "active", period: "weekly" },
    { id: "R003", item: "iPad Pro 12.9\"", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80", from: "May 1", to: "May 31", cost: 16000, status: "upcoming", period: "monthly" },
  ];
  const statusColor = { active: "#22c55e", completed: "#8890a8", upcoming: "#3b82f6" };

  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, marginBottom: 6 }}>My Rentals</h1>
        <p style={{ color: "var(--muted)", fontSize: 15 }}>Track everything you've rented.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {rentals.map(({ id, item, image, from, to, cost, status, period }) => (
          <Card key={id} style={{ display: "flex", alignItems: "center", gap: 20, padding: 20 }} hover>
            <img src={image} alt={item} style={{ width: 88, height: 66, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{item}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>
                <Icon d={icons.calendar} size={12} color="currentColor" style={{ display: "inline", marginRight: 4 }} />
                {from} → {to} · <span style={{ textTransform: "capitalize" }}>{period}</span> rate
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 18, marginBottom: 6 }}>₹{cost.toLocaleString()}</div>
              <Badge color={status === "active" ? "success" : status === "upcoming" ? "info" : "muted"} size="md">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {status === "active" && <Btn variant="secondary" size="sm">Extend</Btn>}
              {status === "completed" && <Btn variant="ghost" size="sm">Re-rent</Btn>}
              {status === "upcoming" && <Btn variant="danger" size="sm">Cancel</Btn>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ─── MY LISTINGS PAGE ─────────────────────────────────────────────────────────
const MyListingsPage = ({ setActive }) => (
  <div style={{ animation: "fadeUp .4s ease" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
      <div>
        <h1 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, marginBottom: 6 }}>My Listings</h1>
        <p style={{ color: "var(--muted)", fontSize: 15 }}>Manage your listed items.</p>
      </div>
      <Btn onClick={() => setActive("upload")} icon={<Icon d={icons.plus} size={16} color="currentColor" />}>Add New Listing</Btn>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
      {SAMPLE_PRODUCTS.slice(0, 3).map(p => (
        <Card key={p.id} hover>
          <div style={{ position: "relative" }}>
            <img src={p.image} alt={p.title} style={{ width: "100%", height: 170, objectFit: "cover" }} />
            <div style={{ position: "absolute", top: 10, right: 10 }}>
              <Badge color={p.available ? "success" : "muted"}>{p.available ? "Active" : "Paused"}</Badge>
            </div>
          </div>
          <div style={{ padding: 18 }}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{p.title}</h3>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>
              ₹{p.daily}/day · ₹{p.weekly}/week · {p.reviews} rentals
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="secondary" size="sm" icon={<Icon d={icons.edit} size={13} color="currentColor" />} style={{ flex: 1, justifyContent: "center" }}>Edit</Btn>
              <Btn variant="danger" size="sm" icon={<Icon d={icons.trash} size={13} color="currentColor" />}>Delete</Btn>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
const ProfilePage = ({ user }) => {
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone || "", bio: "", city: "Bengaluru" });
  const handle = f => v => setForm(p => ({ ...p, [f]: v }));

  return (
    <div style={{ animation: "fadeUp .4s ease", maxWidth: 640 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Profile</h1>
        <p style={{ color: "var(--muted)", fontSize: 15 }}>Manage your personal information.</p>
      </div>

      <Card style={{ padding: 32 }}>
        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32, paddingBottom: 28, borderBottom: "1px solid var(--border)" }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#f5a623,#ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, color: "#0a0b0f", fontFamily: "Syne" }}>
              {form.name?.charAt(0).toUpperCase()}
            </div>
            <button style={{ position: "absolute", bottom: -2, right: -2, width: 26, height: 26, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon d={icons.upload} size={12} color="#0a0b0f" />
            </button>
          </div>
          <div>
            <h2 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 20 }}>{form.name}</h2>
            <div style={{ color: "var(--muted)", fontSize: 14 }}>Member since April 2024</div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Badge color="success">Verified</Badge>
              <Badge color="accent">Top Lister</Badge>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Full Name" value={form.name} onChange={handle("name")} />
            <Input label="Email" type="email" value={form.email} onChange={handle("email")} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Phone" value={form.phone} onChange={handle("phone")} placeholder="+91 XXXXX XXXXX" />
            <Input label="City" value={form.city} onChange={handle("city")} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>Bio</label>
            <textarea value={form.bio} onChange={e => handle("bio")(e.target.value)} placeholder="Tell renters a bit about yourself…" rows={3}
              style={{ background: "var(--surface2)", border: "1.5px solid var(--border)", borderRadius: 10, padding: "12px 14px", color: "var(--text)", fontSize: 14, outline: "none", resize: "vertical", fontFamily: "DM Sans" }} />
          </div>
          <Btn style={{ width: "fit-content" }}>Save Changes</Btn>
        </div>
      </Card>
    </div>
  );
};

// ─── RENT MODAL ───────────────────────────────────────────────────────────────
const RentModal = ({ item, period: initialPeriod, onClose, onConfirm }) => {
  const [period, setPeriod] = useState(initialPeriod || "daily");
  const [qty, setQty] = useState(1);
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState("upi");
  const cost = item ? item[period] * qty : 0;

  if (!item) return null;

  return (
    <Modal open={!!item} onClose={onClose} title={step === 1 ? "Confirm Rental" : "Payment"} width={500}>
      {step === 1 && (
        <>
          <div style={{ display: "flex", gap: 16, marginBottom: 24, padding: 16, background: "var(--surface2)", borderRadius: 12 }}>
            <img src={item.image} alt={item.title} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 8 }} />
            <div>
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>by {item.owner} · {item.location}</div>
              <Stars rating={item.rating} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 8 }}>Rental Period</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {["hourly", "daily", "weekly", "monthly"].map(p => (
                  <button key={p} onClick={() => setPeriod(p)}
                    style={{ padding: "10px 6px", borderRadius: 8, border: `1.5px solid ${period === p ? "var(--accent)" : "var(--border)"}`, background: period === p ? "rgba(245,166,35,.1)" : "var(--surface2)", color: period === p ? "var(--accent)" : "var(--muted)", fontWeight: 600, fontSize: 12, cursor: "pointer", textTransform: "capitalize" }}>
                    {p}<br />
                    <span style={{ fontSize: 13, color: "var(--text)" }}>₹{item[p]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 8 }}>Quantity / Duration</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)", fontSize: 18, cursor: "pointer" }}>−</button>
                <span style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 700, minWidth: 30, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)", fontSize: 18, cursor: "pointer" }}>+</button>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>{period === "hourly" ? "hours" : period === "daily" ? "days" : period === "weekly" ? "weeks" : "months"}</span>
              </div>
            </div>
          </div>

          <div style={{ padding: 16, background: "var(--surface2)", borderRadius: 12, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
              <span style={{ color: "var(--muted)" }}>Rental ({qty} × ₹{item[period]})</span>
              <span>₹{(item[period] * qty).toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
              <span style={{ color: "var(--muted)" }}>Security Deposit</span>
              <span>₹{Math.round(item[period] * 1.5).toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
              <span style={{ color: "var(--muted)" }}>Platform Fee (5%)</span>
              <span>₹{Math.round(item[period] * qty * 0.05).toLocaleString()}</span>
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, display: "flex", justifyContent: "space-between", fontFamily: "Syne", fontWeight: 800, fontSize: 18 }}>
              <span>Total</span>
              <span style={{ color: "var(--accent)" }}>₹{(item[period] * qty + Math.round(item[period] * 1.5) + Math.round(item[period] * qty * 0.05)).toLocaleString()}</span>
            </div>
          </div>
          <Btn size="lg" onClick={() => setStep(2)} style={{ width: "100%", justifyContent: "center" }}>Proceed to Payment →</Btn>
        </>
      )}

      {step === 2 && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {["upi", "card", "wallet"].map(m => (
              <button key={m} onClick={() => setPayMethod(m)}
                style={{ flex: 1, padding: "10px", borderRadius: 8, border: `2px solid ${payMethod === m ? "var(--accent)" : "var(--border)"}`, background: payMethod === m ? "rgba(245,166,35,.1)" : "var(--surface2)", color: payMethod === m ? "var(--accent)" : "var(--muted)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          {payMethod === "upi" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: 120, height: 120, background: "white", borderRadius: 14, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid var(--accent)" }}>
                <div style={{ fontSize: 11, color: "#222", fontWeight: 700, fontFamily: "monospace" }}>QR CODE<br />SCAN<br />TO PAY</div>
              </div>
              <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 16 }}>Scan with any UPI app or pay to:</div>
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, color: "var(--accent)" }}>erentify@razorpay</div>
              <div style={{ margin: "20px 0 8px", fontFamily: "Syne", fontSize: 24, fontWeight: 800 }}>₹{(item[period] * qty + Math.round(item[period] * 1.5) + Math.round(item[period] * qty * 0.05)).toLocaleString()}</div>
            </div>
          )}

          {payMethod === "card" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Input label="Card Number" value="" onChange={() => {}} placeholder="1234 5678 9012 3456" />
              <Input label="Name on Card" value="" onChange={() => {}} placeholder="Full name" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Input label="Expiry" value="" onChange={() => {}} placeholder="MM/YY" />
                <Input label="CVV" type="password" value="" onChange={() => {}} placeholder="•••" />
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <Btn variant="secondary" onClick={() => setStep(1)} style={{ flex: 0.4, justifyContent: "center" }}>← Back</Btn>
            <Btn onClick={onConfirm} style={{ flex: 1, justifyContent: "center" }} size="lg">
              Pay ₹{(item[period] * qty + Math.round(item[period] * 1.5) + Math.round(item[period] * qty * 0.05)).toLocaleString()}
            </Btn>
          </div>
        </>
      )}
    </Modal>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [rentItem, setRentItem] = useState(null);
  const [rentPeriod, setRentPeriod] = useState("daily");
  const [toast, setToast] = useState(null);

  // Inject styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  if (!user) return <AuthScreen onLogin={u => { setUser(u); showToast(`Welcome to Erentify, ${u.name?.split(" ")[0]}!`); }} />;

  const renderPage = () => {
    switch (active) {
      case "dashboard": return <DashboardPage user={user} setActive={setActive} />;
      case "browse": return <BrowsePage onRent={(item, period) => { setRentItem(item); setRentPeriod(period); }} />;
      case "my-rentals": return <MyRentalsPage />;
      case "my-listings": return <MyListingsPage setActive={setActive} />;
      case "upload": return <UploadPage onSuccess={() => { setActive("my-listings"); showToast("🎉 Item listed successfully!"); }} />;
      case "payments": return <PaymentsPage />;
      case "security": return <SecurityPage user={user} />;
      case "profile": return <ProfilePage user={user} />;
      default: return <DashboardPage user={user} setActive={setActive} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar active={active} setActive={setActive} user={user} onLogout={() => { setUser(null); showToast("Signed out successfully.", "info"); }} collapsed={collapsed} setCollapsed={setCollapsed} />
      
      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto", background: "var(--bg)", backgroundImage: "radial-gradient(ellipse at 80% 0%, rgba(245,166,35,.04) 0%, transparent 50%)" }}>
        {/* Top bar */}
        <div style={{ position: "sticky", top: 0, zIndex: 100, padding: "16px 32px", background: "rgba(10,11,15,.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            <span style={{ color: "var(--accent)", fontWeight: 600 }}>erentify</span> / {active.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 14px", color: "var(--muted)", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
              <Icon d={icons.search} size={15} color="currentColor" /> Search
            </button>
            <button style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
              <Icon d={icons.bell} size={17} color="var(--muted)" />
              <div style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--bg)" }} />
            </button>
            <div onClick={() => setActive("profile")} style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#f5a623,#ff6b35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#0a0b0f", cursor: "pointer", fontFamily: "Syne" }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: "36px 40px" }}>
          {renderPage()}
        </div>
      </div>

      {/* Rent Modal */}
      <RentModal item={rentItem} period={rentPeriod}
        onClose={() => setRentItem(null)}
        onConfirm={() => { setRentItem(null); showToast("🎉 Rental confirmed! Check My Rentals."); }} />

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
