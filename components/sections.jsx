/* eslint-disable */
const { useState, useEffect, useRef } = React;

/* ====== Reveal-on-scroll wrapper ====== */
function Reveal({ children, delay = 0, as: Tag = "div", className = "", ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setShown(true), delay);
          io.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return (
    <Tag ref={ref} className={`reveal ${shown ? "in" : ""} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/* ====== Top bar ====== */
function TopBar({ now }) {
  return (
    <header className="topbar">
      <div className="left">
        <div className="mark">
          <span className="glyph" aria-hidden="true"></span>
          <span>RT&nbsp;//&nbsp;rt-rtos</span>
        </div>
        <nav className="nav">
          <a href="#projects">projects</a>
          <a href="#writing">writing</a>
          <a href="#about">about</a>
          <a href="#contact">contact</a>
        </nav>
      </div>
      <div className="right">
        <span className="status">
          <span className="dot" aria-hidden="true"></span>
          <span>available · Aug - 2026</span>
        </span>
        <span style={{ color: "var(--ink-3)" }}>{now}</span>
      </div>
    </header>
  );
}

/* ====== Hero ====== */
function Hero({ heroLineA, heroLineB, heroAccent, heroLineC, lede }) {
  const [seq, setSeq] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeq((s) => (s + 1) % 4096), 1100);
    return () => clearInterval(id);
  }, []);
  const seqHex = seq.toString(16).toUpperCase().padStart(3, "0");

  return (
    <section className="hero container" id="top">
      <div className="hero-meta">
        <div>Portfolio · v0.4.2 · build {seqHex}</div>
        <div className="right">Stockholm, Sweden</div>
      </div>

      <Reveal>
        <h1>
          {heroLineA}<br/>
          {heroLineB}{" "}<span className="accent">{heroAccent}</span><br/>
          {heroLineC}<span className="cursor" aria-hidden="true"></span>
        </h1>
      </Reveal>

      <div className="hero-sub">
        <Reveal delay={150} className="lede" as="p">
          {lede}
        </Reveal>
        <Reveal delay={300}>
          <div className="stack">
            <div className="row"><span className="k">role</span><span className="v">Embedded Developer</span></div>
            <div className="row"><span className="k">studying</span><span className="v">IoT &amp; Embedded Dev · Jensen YH </span></div>
            <div className="row"><span className="k">stack</span><span className="v">C / C++ · RTOS · ESP-IDF · Python </span></div>
            <div className="row"><span className="k">interests</span><span className="v">HW ⇄ SW | analog ⇄ digital</span></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ====== About ====== */
function About() {
  return (
    <section className="section container" id="about">
      <div className="section-grid">
        <div className="section-label">
          <div className="num">§01</div>
          <div className="name">About</div>
        </div>
        <div className="about-body">
          <Reveal>
         
            <p><b><u>I&rsquo;m fascinated by:</u></b></p>
         
            <p> The interplay between <span className="em"> <b>hardware </b></span> and <span className="em"> <b> software </b> </span></p>
           
             <p>The threshold between <span className="em"> <b>  analog </b></span> and <span className="em"> <b> digital </b> </span> </p>
             
             <p>I like getting my hands dirty with the hardware, trying to understand how things work at a fundamental level. </p>
             
             <p>I&rsquo;m currently focused on building a strong foundation in embedded systems, real-time programming and signal processing, while also exploring PCB design with the goal of developing complete insights and intuition for embedded systems.</p>
         
          </Reveal>
          <Reveal delay={200}>
            <div className="about-card">
              <div className="head">
                <span>readme.md</span>
                <span></span>
              </div>
              <div className="body">
                <span className="k">name</span><span className="v">Rasmus Tikkanen</span>
                <span className="k">github</span><span className="v">@rt-rtos</span>
                <span className="k">based</span><span className="v">Stockholm, Sweden</span>
                <span className="k">field</span><span className="v">Embedded · IoT</span>
                <span className="k">tools</span><span className="v">ESP-IDF · FreeRTOS · PlatformIO · Arduino · KiCAD </span>
                <span className="k">learning</span><span className="v"> STM32Cube · RPI SDK · Zephyr + West · Advanced KiCAD </span>
                <span className="k">langs</span><span className="v">C · C++ · Python </span>
                <span className="k">native</span><span className="v"> SV · EN</span>
              </div>
            </div>
            
          </Reveal>
          <div className="about-footnote">
            <Reveal>
              
              <span className="about-footnote-label">Working on / Learning:</span>
              {" "}STM32 · Cortex-M · STM32CubeMX · Baremetal · Secure Networking · PCB design · Amysynth
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====== Projects ====== */
const PROJECTS = [
  {
    num: "001",
    title: "ESP-32-RFID-WebUI",
    desc:
      "A small RFID reader built on an ESP32. It shows the scanned tag on an SD1316 OLED, stores entries in an external SQLite database and verifies UID access through offline-first look-up. Syncs and Persists UIDs to local storage, tolerant of connection loss as long as one sync has occurred. Coursework for IoT25S.",
    year: "2025",
    lang: "C++",
    langColor: "oklch(0.62 0.16 35)",
    tags: ["ESP32", "RFID", "SQLite3", "WebUI", "OLED", "WiFi"],
    href: "https://github.com/rt-rtos/ESP-32-RFID-WebUI",
    schema: "rfid",
  },
  {
    num: "002",
    title: "S3-FFT-Matplot",
    desc:
      "A learning project for signal processing. The ESP32-S3 samples an ADC input, runs an FFT, and sends the spectrum data using CRC32 frames through USB-CDC to a Python script that plots it with matplotlib. Mostly an excuse to evaluate the capabilities of the ESP32-S3s new features and deepen my familiarity with the DSP pipeline and toolchain.",
    year: "2025",
    lang: "C",
    langColor: "oklch(0.55 0.12 250)",
    tags: ["ESP32-S3", "DSP", "FFT", "I2S", "matplotlib"],
    href: "https://github.com/rt-rtos/S3-FFT-Matplot",
    schema: "fft",
  },
  {
    num: "003",
    title: "S3-Amysynth",
    desc:
      "A custom handheld synthesizer and drum sequencer built on the ESP32-S3 using ESP-IDF 6.0 and FreeRTOS. Runs the open-source AMY synthesis engine for real-time audio generation, drives a 16-step editable drum sequencer, and streams 48 kHz stereo audio over USB Audio Class 2.0 via TinyUSB. Controlled through a rotary encoder and push buttons with an SSD1306 OLED for sequencer state and UI feedback. Hardware path also includes a PCM5102 I2S DAC for standalone output.",
    year: "2026",
    lang: "C",
    langColor: "oklch(0.55 0.12 250)",
    tags: ["ESP32-S3", "Audio", "AMY", "FreeRTOS", "I2S", "USB-Audio", "Sequencer"],
    href: "https://github.com/rt-rtos/S3-Amysynth",
    schema: "amysynth",
  },
  {
    num: "004",
    title: "snake-game",
    desc:
      "Snake in the terminal, written in C against PDcurses on Windows and Ncurses on Linux. A small project to get more comfortable with C, static compilation, and the curses event loop.",
    year: "2025",
    lang: "C",
    langColor: "oklch(0.55 0.12 250)",
    tags: ["C", "ncurses", "PDcurses", "TUI"],
    href: "https://github.com/rt-rtos/snake-game",
    schema: "snake",
  },
];

function ProjectSchema({ kind }) {
  if (kind === "rfid") {
    return (
      <svg viewBox="0 0 800 220" preserveAspectRatio="xMidYMid meet" fill="none" stroke="currentColor" strokeWidth="1">
        <defs>
          <pattern id="rfid-hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="0.7" opacity="0.3" />
          </pattern>
          <marker id="rfid-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" fill="currentColor" stroke="none" />
          </marker>
          <marker id="rfid-arr-d" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" fill="currentColor" stroke="none" opacity="0.4" />
          </marker>
        </defs>

        {/* Title */}
        <text x="4" y="13" fontFamily="JetBrains Mono" fontSize="8" fill="var(--ink-3)" stroke="none" letterSpacing="0.06em">DENY ACCESS CONTROL FLOW</text>
        <line x1="4" y1="16" x2="168" y2="16" strokeOpacity="0.3" />

        {/* Feedback / cache update arrows (dashed, behind everything) */}
        <path d="M727,150 L790,150 L790,22 L310,22 L310,66" strokeDasharray="4,3" strokeOpacity="0.38" markerEnd="url(#rfid-arr-d)" />
        <text x="553" y="17" fontFamily="JetBrains Mono" fontSize="5.5" fill="var(--ink-3)" stroke="none" textAnchor="middle">= add to deny cache</text>
        <path d="M727,88 L778,88 L778,36 L453,36 L453,66" strokeDasharray="4,3" strokeOpacity="0.38" markerEnd="url(#rfid-arr-d)" />
        <text x="618" y="31" fontFamily="JetBrains Mono" fontSize="5.5" fill="var(--ink-3)" stroke="none" textAnchor="middle">= add to allow cache</text>

        {/* 1. Card Scan */}
        <rect x="4" y="70" width="95" height="36" rx="1" />
        <text x="52" y="86" fontFamily="JetBrains Mono" fontSize="8" fill="currentColor" stroke="none" textAnchor="middle">Card Scanned</text>
        <text x="52" y="98" fontFamily="JetBrains Mono" fontSize="7" fill="var(--ink-3)" stroke="none" textAnchor="middle">"04A1B2C3"</text>
        <line x1="99" y1="88" x2="127" y2="88" markerEnd="url(#rfid-arr)" />

        {/* 2. Compute Hash */}
        <rect x="129" y="70" width="95" height="36" rx="1" />
        <text x="177" y="85" fontFamily="JetBrains Mono" fontSize="8" fill="currentColor" stroke="none" textAnchor="middle">Compute Hash</text>
        <text x="177" y="98" fontFamily="JetBrains Mono" fontSize="7" fill="var(--ink-3)" stroke="none" textAnchor="middle">0x8f3a4b2c…</text>
        <line x1="224" y1="88" x2="252" y2="88" markerEnd="url(#rfid-arr)" />

        {/* 3. BinSearch denyHashes (hatched) */}
        <rect x="254" y="66" width="112" height="44" />
        <rect x="254" y="66" width="112" height="44" fill="url(#rfid-hatch)" stroke="none" />
        <text x="310" y="83" fontFamily="JetBrains Mono" fontSize="8" fill="currentColor" stroke="none" textAnchor="middle">BinSearch</text>
        <text x="310" y="96" fontFamily="JetBrains Mono" fontSize="7.5" fill="var(--ink-3)" stroke="none" textAnchor="middle">local denyHashes_</text>
        <line x1="366" y1="88" x2="395" y2="88" markerEnd="url(#rfid-arr)" />
        <text x="381" y="82" fontFamily="JetBrains Mono" fontSize="6.5" fill="var(--ink-3)" stroke="none" textAnchor="middle">≠</text>

        {/* 4. BinSearch allowHashes (hatched) */}
        <rect x="397" y="66" width="112" height="44" />
        <rect x="397" y="66" width="112" height="44" fill="url(#rfid-hatch)" stroke="none" />
        <text x="453" y="83" fontFamily="JetBrains Mono" fontSize="8" fill="currentColor" stroke="none" textAnchor="middle">BinSearch</text>
        <text x="453" y="96" fontFamily="JetBrains Mono" fontSize="7.5" fill="var(--ink-3)" stroke="none" textAnchor="middle">local allowHashes_</text>
        <line x1="509" y1="88" x2="535" y2="88" markerEnd="url(#rfid-arr)" />
        <text x="522" y="82" fontFamily="JetBrains Mono" fontSize="6.5" fill="var(--ink-3)" stroke="none" textAnchor="middle">≠</text>

        {/* 5. Server Reachable? Diamond */}
        <path d="M537,88 L565,62 L593,88 L565,114 Z" />
        <text x="565" y="85" fontFamily="JetBrains Mono" fontSize="7.5" fill="currentColor" stroke="none" textAnchor="middle">Server</text>
        <text x="565" y="96" fontFamily="JetBrains Mono" fontSize="7.5" fill="currentColor" stroke="none" textAnchor="middle">Up?</text>

        {/* No branch → offline path */}
        <line x1="565" y1="114" x2="565" y2="136" markerEnd="url(#rfid-arr)" />
        <text x="573" y="130" fontFamily="JetBrains Mono" fontSize="6.5" fill="var(--ink-3)" stroke="none">No</text>
        <rect x="505" y="138" width="120" height="30" rx="1" />
        <text x="565" y="157" fontFamily="JetBrains Mono" fontSize="8" fill="currentColor" stroke="none" textAnchor="middle">Offline | Unknown</text>
        <line x1="565" y1="168" x2="565" y2="177" markerEnd="url(#rfid-arr)" />
        <rect x="529" y="179" width="72" height="24" rx="1" stroke="var(--accent)" fill="var(--accent)" fillOpacity="0.12" />
        <text x="565" y="195" fontFamily="JetBrains Mono" fontSize="8.5" fill="var(--accent)" stroke="none" textAnchor="middle">= DENIED</text>
        <text x="565" y="213" fontFamily="JetBrains Mono" fontSize="7" fill="var(--ink-3)" stroke="none" textAnchor="middle">→ Queue to post</text>

        {/* Yes branch → online / DB path */}
        <line x1="593" y1="88" x2="613" y2="88" markerEnd="url(#rfid-arr)" />
        <text x="603" y="82" fontFamily="JetBrains Mono" fontSize="6.5" fill="var(--ink-3)" stroke="none" textAnchor="middle">Yes</text>

        {/* 8. DB search allow (hatched) */}
        <rect x="615" y="66" width="112" height="44" />
        <rect x="615" y="66" width="112" height="44" fill="url(#rfid-hatch)" stroke="none" />
        <text x="671" y="83" fontFamily="JetBrains Mono" fontSize="8" fill="currentColor" stroke="none" textAnchor="middle">Ext. DB search</text>
        <text x="671" y="96" fontFamily="JetBrains Mono" fontSize="7.5" fill="var(--ink-3)" stroke="none" textAnchor="middle">allow</text>
        <line x1="671" y1="110" x2="671" y2="126" markerEnd="url(#rfid-arr)" />
        <text x="679" y="122" fontFamily="JetBrains Mono" fontSize="6.5" fill="var(--ink-3)" stroke="none">≠</text>

        {/* 9. DB search deny (hatched) */}
        <rect x="615" y="128" width="112" height="44" />
        <rect x="615" y="128" width="112" height="44" fill="url(#rfid-hatch)" stroke="none" />
        <text x="671" y="145" fontFamily="JetBrains Mono" fontSize="8" fill="currentColor" stroke="none" textAnchor="middle">Ext. DB search</text>
        <text x="671" y="158" fontFamily="JetBrains Mono" fontSize="7.5" fill="var(--ink-3)" stroke="none" textAnchor="middle">deny</text>
        <line x1="671" y1="172" x2="671" y2="182" markerEnd="url(#rfid-arr)" />
        <text x="679" y="180" fontFamily="JetBrains Mono" fontSize="6.5" fill="var(--ink-3)" stroke="none">≠</text>

        {/* 10. Online | Unknown → = DENIED */}
        <rect x="615" y="184" width="112" height="28" rx="1" />
        <text x="671" y="202" fontFamily="JetBrains Mono" fontSize="8" fill="currentColor" stroke="none" textAnchor="middle">Online | Unknown</text>
        <line x1="727" y1="198" x2="736" y2="198" markerEnd="url(#rfid-arr)" />
        <rect x="738" y="184" width="58" height="28" rx="1" stroke="var(--accent)" fill="var(--accent)" fillOpacity="0.12" />
        <text x="767" y="202" fontFamily="JetBrains Mono" fontSize="8.5" fill="var(--accent)" stroke="none" textAnchor="middle">= DENIED</text>
        <text x="767" y="215" fontFamily="JetBrains Mono" fontSize="7" fill="var(--ink-3)" stroke="none" textAnchor="middle">→ Poll GetAuth API</text>
      </svg>
    );
  }
  if (kind === "fft") {
    return (
      <svg viewBox="0 0 800 220" preserveAspectRatio="xMidYMid meet" fill="none" stroke="currentColor" strokeWidth="1">
        {/* sine wave */}
        <path d="M20 110 Q 60 40, 100 110 T 180 110 T 260 110 T 340 110" strokeWidth="1.5" />
        <text x="20" y="30" fontFamily="JetBrains Mono" fontSize="10" fill="currentColor" stroke="none">analog in</text>
        {/* arrow */}
        <path d="M360 110 L420 110 M410 105 L420 110 L410 115" />
        {/* mcu */}
        <rect x="430" y="70" width="100" height="80" />
        <text x="480" y="105" fontFamily="JetBrains Mono" fontSize="10" fill="currentColor" stroke="none" textAnchor="middle">FFT</text>
        <text x="480" y="120" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-3)" stroke="none" textAnchor="middle">N=1024</text>
        <path d="M530 110 L580 110 M570 105 L580 110 L570 115" />
        {/* spectrum bars */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
          const heights = [20, 50, 80, 60, 110, 95, 70, 45, 30, 22, 18, 14];
          const h = heights[i];
          return (
            <rect key={i} x={590 + i * 16} y={170 - h} width="10" height={h} fill="currentColor" stroke="none" opacity={0.65} />
          );
        })}
        <line x1="585" y1="170" x2="800" y2="170" />
        <text x="780" y="190" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-3)" stroke="none" textAnchor="end">freq →</text>
      </svg>
    );
  }
  if (kind === "amysynth") {
    return (
      <svg viewBox="0 0 800 220" preserveAspectRatio="xMidYMid meet" fill="none" stroke="currentColor" strokeWidth="1">
        {/* Encoder + Buttons */}
        <rect x="20" y="70" width="110" height="70" />
        <text x="75" y="101" fontFamily="JetBrains Mono" fontSize="10" fill="currentColor" stroke="none" textAnchor="middle">Encoder</text>
        <text x="75" y="116" fontFamily="JetBrains Mono" fontSize="10" fill="currentColor" stroke="none" textAnchor="middle">+ Buttons</text>
        <text x="75" y="131" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-3)" stroke="none" textAnchor="middle">GPIO</text>
        {/* ESP32-S3 */}
        <rect x="195" y="35" width="155" height="145" />
        <text x="272" y="65" fontFamily="JetBrains Mono" fontSize="11" fill="currentColor" stroke="none" textAnchor="middle">ESP32-S3</text>
        <text x="272" y="80" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-3)" stroke="none" textAnchor="middle">N16R8</text>
        {/* AMY engine dashed box inside ESP32 */}
        <rect x="213" y="95" width="119" height="68" strokeDasharray="4,3" />
        <text x="272" y="115" fontFamily="JetBrains Mono" fontSize="9" fill="currentColor" stroke="none" textAnchor="middle">AMY engine</text>
        <text x="272" y="130" fontFamily="JetBrains Mono" fontSize="8" fill="var(--ink-3)" stroke="none" textAnchor="middle">synth + sequencer</text>
        <text x="272" y="153" fontFamily="JetBrains Mono" fontSize="8" fill="var(--ink-3)" stroke="none" textAnchor="middle">FreeRTOS tasks</text>
        {/* SSD1306 OLED */}
        <rect x="430" y="15" width="130" height="55" />
        <text x="495" y="40" fontFamily="JetBrains Mono" fontSize="10" fill="currentColor" stroke="none" textAnchor="middle">SSD1306</text>
        <text x="495" y="57" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-3)" stroke="none" textAnchor="middle">128×64 OLED</text>
        {/* PCM5102 DAC */}
        <rect x="430" y="148" width="130" height="55" />
        <text x="495" y="172" fontFamily="JetBrains Mono" fontSize="10" fill="currentColor" stroke="none" textAnchor="middle">PCM5102</text>
        <text x="495" y="189" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-3)" stroke="none" textAnchor="middle">I2S DAC</text>
        {/* USB Audio */}
        <rect x="640" y="80" width="130" height="60" />
        <text x="705" y="104" fontFamily="JetBrains Mono" fontSize="10" fill="currentColor" stroke="none" textAnchor="middle">USB Audio</text>
        <text x="705" y="119" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-3)" stroke="none" textAnchor="middle">UAC2 · TinyUSB</text>
        <text x="705" y="132" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-3)" stroke="none" textAnchor="middle">48kHz 16-bit</text>
        {/* Lines */}
        <path d="M130 105 L195 105" />
        <circle cx="130" cy="105" r="3" fill="currentColor" />
        <path d="M350 65 L430 42" />
        <circle cx="350" cy="65" r="3" fill="currentColor" />
        <path d="M350 163 L430 175" />
        <circle cx="350" cy="163" r="3" fill="currentColor" />
        <path d="M350 110 L640 110" />
        <circle cx="350" cy="110" r="3" fill="currentColor" />
        {/* Bus labels */}
        <text x="368" y="38" fontFamily="JetBrains Mono" fontSize="8" fill="var(--ink-3)" stroke="none">I2C</text>
        <text x="368" y="182" fontFamily="JetBrains Mono" fontSize="8" fill="var(--ink-3)" stroke="none">I2S</text>
        <text x="478" y="104" fontFamily="JetBrains Mono" fontSize="8" fill="var(--ink-3)" stroke="none">USB</text>
      </svg>
    );
  }
  /* snake */
  return (
    <svg viewBox="0 0 800 220" preserveAspectRatio="xMidYMid meet" fill="none" stroke="currentColor" strokeWidth="1">
      {Array.from({ length: 18 }).map((_, c) =>
        Array.from({ length: 8 }).map((_, r) => (
          <rect key={`${c}-${r}`} x={120 + c * 32} y={20 + r * 22} width="32" height="22" opacity="0.18" />
        ))
      )}
      {/* snake body */}
      {[ [3,4],[4,4],[5,4],[6,4],[7,4],[7,3],[7,2],[8,2],[9,2] ].map(([c, r], i) => (
        <rect key={i} x={120 + c * 32 + 3} y={20 + r * 22 + 3} width="26" height="16" fill="currentColor" stroke="none" />
      ))}
      {/* food */}
      <rect x={120 + 13 * 32 + 6} y={20 + 5 * 22 + 5} width="18" height="12" fill="var(--accent)" stroke="none" />
      <text x="20" y="40" fontFamily="JetBrains Mono" fontSize="10" fill="currentColor" stroke="none">stdscr</text>
      <text x="20" y="55" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-3)" stroke="none">80×24</text>
      <text x="20" y="200" fontFamily="JetBrains Mono" fontSize="9" fill="var(--ink-3)" stroke="none">score: 008</text>
    </svg>
  );
}

function Project({ p, idx, open, onToggle }) {
  return (
    <article
      className="project"
      data-open={open}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}
    >
      <div className="project-num">/{p.num}</div>
      <div>
        <div className="project-title">
          {p.title}
          <span className="arrow" aria-hidden="true">↗</span>
        </div>
        <div className="project-tags">
          {p.tags.map((t) => (<span key={t} className="project-tag">{t}</span>))}
        </div>
      </div>
      <div className="project-desc">{p.desc}</div>
      <div className="project-meta">
        <div>year &nbsp;·&nbsp; {p.year}</div>
        <div>repo &nbsp;·&nbsp; rt-rtos/{p.title.toLowerCase()}</div>
        <div className="project-lang-bar">
          <span className="project-lang-dot" style={{ background: p.langColor }}></span>
          <span>{p.lang}</span>
        </div>
      </div>
      <div className="project-schema">
        <div className="project-schema-inner">
          <ProjectSchema kind={p.schema} />
        </div>
      </div>
    </article>
  );
}

function Projects() {
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section className="section container" id="work">
      <div className="section-grid">
        <div className="section-label">
          <div className="num">§02</div>
          <div className="name">Selected Work</div>
        </div>
        <div>
          <Reveal>
            <p style={{ fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--ink-2)", maxWidth: "60ch", margin: "0 0 32px", textWrap: "pretty" }}>
              A few things I&rsquo;ve been working on while learning. Click
              any row to see a rough sketch of how it&rsquo;s wired up.
            </p>
          </Reveal>
          <div className="projects">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.num} delay={i * 80}>
                <Project p={p} idx={i} open={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}>
            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <a
                href="https://github.com/rt-rtos"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  borderBottom: "1px solid var(--accent)",
                  paddingBottom: 2,
                }}
              >
                full repository index ↗
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ====== Writing ====== */
const WRITING = [
  { date: "2025.11", title: "Trying to fit a small webserver on an ESP32", tag: "ESP32" },
  { date: "2025.09", title: "What I keep getting wrong about FreeRTOS priorities", tag: "RTOS" },
  { date: "2025.06", title: "Reading a microphone with I2S on the ESP32-S3", tag: "DSP" },
  { date: "2025.03", title: "A weekend of trying to hand-solder 0402 parts", tag: "Hardware" },
  { date: "2024.12", title: "Notes on getting an interrupt to actually fire", tag: "Notes" },
];

function Writing() {
  return (
    <section className="section container" id="writing">
      <div className="section-grid">
        <div className="section-label">
          <div className="num">§03</div>
          <div className="name">Writing</div>
        </div>
        <div>
          <Reveal>
            <p style={{ fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--ink-2)", maxWidth: "60ch", margin: "0 0 32px", textWrap: "pretty" }}>
              Short notes I write while figuring things out, mostly so
              I can find the answer again later.
            </p>
          </Reveal>
          <div className="writing-list">
            {WRITING.map((w, i) => (
              <Reveal key={w.title} delay={i * 60}>
                <a className="write-item" href="#" onClick={(e) => e.preventDefault()}>
                  <div className="write-date">{w.date}</div>
                  <div className="write-title">{w.title}<span className="arr">↗</span></div>
                  <div className="write-tag">{w.tag}</div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 
/* ====== Experience ====== */
const EXP = [
  {
    when: "2025 — now",
    role: "Studying IoT & Embedded Development at Jensen Yrkeshögskola.",
    place: "Stockholm, Sweden",
    desc: "Coursework in embedded C/C++, real-time systems, sensor networks, basic signal processing and electronics.",
  },
  {
    when: "Summer 2026",
    role: "Internship — placeholder",
    place: "",
    desc: "",
  },
  {
    when: "2021 — 2024",
    role: "Tinkering at home",
    place: "Home lab",
    desc: "Taking things apart and putting them back together again, trying to understand how they work. Electronics, Circuit design & simulation, signal integrity & grounding , analysis & troubleshooting. ",
  },
];

function Experience() {
  return (
    <section className="section container" id="experience">
      <div className="section-grid">
        <div className="section-label">
          <div className="num">§04</div>
          <div className="name">Experience</div>
        </div>
        <div>
          <div className="exp-list">
            {EXP.map((e, i) => (
              <Reveal key={e.role} delay={i * 80}>
                <div className="exp">
                  <div className="exp-when">{e.when}</div>
                  <div>
                    <div className="exp-role">{e.role}</div>
                    <div className="exp-place">{e.place}</div>
                  </div>
                  <div className="exp-desc">{e.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ====== Contact ====== */
function Contact() {
  return (
    <section className="contact container" id="contact">
      <div className="contact-grid">
        <Reveal>
          <div>
            <div className="eyebrow" style={{ marginBottom: 24 }}>§05 · Contact</div>
            <h2>
              Happy to <span className="em">chat</span><br/>
              about embedded.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="contact-links">
            <a className="contact-link" href="mailto:rasmus.tikkanen95@gmail.com" target="_blank" rel="noreferrer">
              <span className="k">email</span>
              <span className="v">rasmus.tikkanen95@gmail.com ↗</span>
            </a>
            <a className="contact-link" href="https://github.com/rt-rtos" target="_blank" rel="noreferrer">
              <span className="k">github</span>
              <span className="v">@rt-rtos ↗</span>
            </a>
            <a className="contact-link" href="#" onClick={(e) => e.preventDefault()}>
              <span className="k">linkedin</span>
              <span className="v">/in/rasmus-tikkanen ↗</span>
            </a>
            <a className="contact-link" href="#" onClick={(e) => e.preventDefault()}>
              <span className="k">cv</span>
              <span className="v">tikkanen-cv-2026.pdf ↗</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ====== Footer ====== */
function Footer() {
  return (
    <footer className="footer">
      <span>© 2026 Rasmus Tikkanen</span>
      <span>last build · {new Date().toISOString().slice(0, 10)}</span>
    </footer>
  );
}

Object.assign(window, { Reveal, TopBar, Hero, About, Projects, Writing, Experience, Contact, Footer });
