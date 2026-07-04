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
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.72);
  const videoRef = useRef(null);
  useEffect(() => {
    const id = setInterval(() => setSeq((s) => (s + 1) % 4096), 1100);
    return () => clearInterval(id);
  }, []);
  const seqHex = seq.toString(16).toUpperCase().padStart(3, "0");

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (!nextMuted) {
        videoRef.current.volume = volume;
      }
    }
  };

  const handleVolumeChange = (e) => {
    const nextVolume = Number(e.target.value) / 100;
    setVolume(nextVolume);
    if (videoRef.current) {
      videoRef.current.volume = nextVolume;
      const shouldMute = nextVolume === 0;
      videoRef.current.muted = shouldMute;
      setIsMuted(shouldMute);
    }
  };

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

      <Reveal delay={180}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(11px, 0.95vw, 13px)", color: "var(--accent)", margin: "10px 0 0", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          &#9656;&nbsp; Seeking LIA internship · Autumn 2026
        </p>
      </Reveal>

      <div className="hero-sub">
        <Reveal delay={150} className="hero-intro">
          <p className="lede">{lede}</p>
        </Reveal>
        <Reveal delay={300} className="hero-video-wrap">
          <figure className="hero-video-frame">
            <div className="hero-video-bar" aria-hidden="true">
              <span className="hero-video-bar-dots"><span></span><span></span><span></span></span>
              <span className="hero-video-bar-label">amybox.mp4</span>
            </div>
            <div className="hero-video-wrapper">
              <video
                ref={videoRef}
                className="hero-video"
                autoPlay
                muted={isMuted}
                loop
                playsInline
                preload="metadata"
                poster="assets/Amysynth/1.jpg"
                aria-label="S3-Amysynth handheld synthesizer demo video"
              >
                <source src="assets/amybox.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="hero-video-overlay" aria-hidden="true">
                <span className="hero-video-overlay-dot"></span>
                Now playing — S3-Amysynth · ESP32-S3 · FreeRTOS · AMY engine · 48 kHz stereo · USB Audio 2.0
              </div>
            </div>
            <figcaption className="hero-video-caption">S3-Amysynth · ESP32-S3 · groovebox · real-time synthesis</figcaption>
            <div className="hero-video-controls">
              <button type="button" className="hero-video-audio" onClick={handleToggleMute}>
                {isMuted ? (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M1 4.5v3h2l3 2.5V2L3 4.5H1z" fill="currentColor" stroke="none"/>
                    <line x1="8.5" y1="4" x2="11" y2="7.5"/>
                    <line x1="11" y1="4" x2="8.5" y2="7.5"/>
                  </svg>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                    <path d="M1 4.5v3h2l3 2.5V2L3 4.5H1z" fill="currentColor" stroke="none"/>
                    <path d="M8 4a2.5 2.5 0 0 1 0 4" strokeLinecap="round"/>
                    <path d="M9.5 2.5a5 5 0 0 1 0 7" strokeLinecap="round"/>
                  </svg>
                )}
                {isMuted ? "Sound off" : "Sound on"}
              </button>
              <label className="hero-video-volume" htmlFor="hero-volume" data-muted={isMuted}>
                <span>Vol</span>
                <input
                  id="hero-volume"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={Math.round(volume * 100)}
                  onChange={handleVolumeChange}
                  aria-label="Video volume"
                  style={{ background: `linear-gradient(to right, ${isMuted ? "var(--ink-3)" : "var(--accent)"} ${Math.round(volume * 100)}%, color-mix(in oklab, var(--rule) 78%, var(--paper)) ${Math.round(volume * 100)}%)` }}
                />
              </label>
              <a
                className="hero-video-link"
                href="https://github.com/rt-rtos/S3-Amysynth"
                target="_blank"
                rel="noreferrer"
                aria-label="Open S3-Amysynth repository on GitHub"
              >
                View repo ↗
              </a>
            </div>
          </figure>
        </Reveal>
      </div>

      <Reveal delay={360}>
        <div className="stack hero-stack">
          <div className="row"><span className="k">role</span><span className="v">Embedded Developer</span></div>
          <div className="row"><span className="k">studying</span><span className="v">IoT &amp; Embedded Dev · Jensen YH </span></div>
          <div className="row"><span className="k">stack</span><span className="v">C / C++ · RTOS · ESP-IDF · Python </span></div>
          <div className="row"><span className="k">interests</span><span className="v">HW ⇄ SW | analog ⇄ digital</span></div>
          <div className="row">
            <span className="k">contact</span>
            <span className="v">
              <a href="mailto:rasmus.tikkanen95@gmail.com" style={{ color: "inherit", textDecoration: "none" }}>rasmus.tikkanen95@gmail.com</a>
              {" · "}
              <a href="https://www.linkedin.com/in/rasmus-tikkanen-7803763a5" target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>LinkedIn ↗</a>
            </span>
          </div>
        </div>
      </Reveal>
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
    title: "S3-Amysynth",
    desc:
      "A custom handheld synthesizer and drum sequencer built on the ESP32-S3 using ESP-IDF 6.0 and FreeRTOS. Runs the open-source AMY synthesis engine for real-time audio generation, drives a 16-step editable drum sequencer, and streams 48 kHz stereo audio over USB Audio Class 2.0 via TinyUSB. Controlled through a rotary encoder and push buttons with an SSD1306 OLED for sequencer state and UI feedback. Hardware path also includes a PCM5102 I2S DAC for standalone output.",
    year: "2026",
    lang: "C",
    langColor: "oklch(0.55 0.12 250)",
    tags: ["ESP32-S3", "Audio", "AMY", "FreeRTOS", "I2S", "USB-Audio", "Sequencer"],
    href: "https://github.com/rt-rtos/S3-Amysynth",
    schema: "amysynth",
    thumbnail: "assets/Amysynth/1.jpg",
    images: [
      { src: "assets/Amysynth/1.jpg", alt: "Amysynth — hardware prototype running the drum sequencer on perfboard" },
    ],
  },
  {
    num: "002",
    title: "asmdiff",
    desc:
      "A command-line tool for diffing compiled assembly across builds. Point it at two versions of a function and it normalises and compares the generated instructions, so you can see exactly what a source change, compiler flag, or optimization actually did at the instruction level - instead of guessing from noisy wall-clock timings. Grew directly out of profiling AMY's audio render loop.",
    year: "2026",
    lang: "Python",
    langColor: "oklch(0.72 0.13 95)",
    tags: ["Python", "CLI", "Assembly", "Optimization", "uvx"],
    href: "https://github.com/rt-rtos/asmdiff",
    run: "uvx asmdiff",
    runHref: "https://pypi.org/project/asmdiff/",
  },
  {
    num: "003",
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
    num: "004",
    title: "S3-FFT-Matplot",
    desc:
      "A learning project for signal processing. The ESP32-S3 samples an ADC input, runs an FFT, and sends the spectrum data using CRC32 frames through USB-CDC to a Python script that plots it with matplotlib. Mostly an excuse to evaluate the capabilities of the ESP32-S3s new features and deepen my familiarity with the DSP pipeline and toolchain.",
    year: "2025",
    lang: "C",
    langColor: "oklch(0.55 0.12 250)",
    tags: ["ESP32-S3", "DSP", "FFT", "I2S", "matplotlib"],
    href: "https://github.com/rt-rtos/S3-FFT-Matplot",
    schema: "fft",
    thumbnail: "assets/FFTPlots.png",
    images: [
      { src: "assets/FFTPlots.png",       alt: "matplotlib output — time domain (top) and frequency spectrum (bottom)" },
      { src: "assets/FFTSquareWave.png",  alt: "square wave capture — aliasing visible at harmonic rolloff" },
    ],
  },
  {
    num: "005",
    title: "Grupparbete-IoT25S",
    desc:
      "A group project alarm clock on the ESP32-C3. The web UI is compiled directly into the firmware image as a linked binary blob — no SD card, no SPIFFS partition, no host dependency. The device serves its own interface over WiFi straight from flash, keeping the footprint minimal and the setup genuinely self-contained. NTP sync for time, configurable alarms, and a clean browser UI served from ~20 KB of embedded static assets.",
    year: "2025",
    lang: "C",
    langColor: "oklch(0.55 0.12 250)",
    tags: ["ESP32-C3", "ESP-IDF", "NTP", "WebUI", "WiFi", "Embedded Web"],
    href: "https://github.com/rt-rtos/Grupparbete-IoT25S",
    schema: "snake",
    thumbnail: "assets/alarm/Provision.jpg",
    images: [
      { src: "assets/alarm/alarm.png",       alt: "Web UI — alarm dashboard served directly from flash" },
      { src: "assets/alarm/Provisioned.jpg", alt: "OLED showing time and IP after WiFi provisioning" },
      { src: "assets/alarm/Provision.jpg",   alt: "OLED WiFi provisioning screen — SSID and password" },
    ],
  },
  {
    num: "006",
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

function ProjectImageGallery({ images }) {
  const [idx, setIdx] = useState(0);
  const prev = (e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length); };
  const img = images[idx];
  return (
    <div className="proj-gallery" onClick={(e) => e.stopPropagation()}>
      <img src={img.src} alt={img.alt} className="project-schema-img" />
      <div className="proj-gallery-bar">
        <button className="proj-gallery-btn" onClick={prev} aria-label="Previous image">&#8592;</button>
        <span className="proj-gallery-counter">{idx + 1}&thinsp;/&thinsp;{images.length}</span>
        <button className="proj-gallery-btn" onClick={next} aria-label="Next image">&#8594;</button>
        <span className="project-schema-img-label proj-gallery-caption">{img.alt}</span>
      </div>
    </div>
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
          <a
            href={p.href}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {p.title}
            <span className="arrow" aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="project-tags">
          {p.tags.map((t) => (<span key={t} className="project-tag">{t}</span>))}
        </div>
        {p.thumbnail && !open && (
          <img src={p.thumbnail} alt={p.title} className="project-thumb" />
        )}
      </div>
      <div className="project-desc">
        {p.desc}
        {p.run && (
          <div className="project-run">
            <span className="project-run-try">▶ try it</span>
            {p.runHref ? (
              <a
                href={p.runHref}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="project-run-cmd project-run-link"
              >
                <code>{p.run}</code>
                <span className="project-run-ext" aria-hidden="true">↗</span>
              </a>
            ) : (
              <code className="project-run-cmd">{p.run}</code>
            )}
          </div>
        )}
      </div>
      <div className="project-meta">
        <div>year &nbsp;·&nbsp; {p.year}</div>
        <div>
          <a
            href={p.href}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            repo &nbsp;·&nbsp; rt-rtos/{p.title.toLowerCase()} ↗
          </a>
        </div>
        <div className="project-lang-bar">
          <span className="project-lang-dot" style={{ background: p.langColor }}></span>
          <span>{p.lang}</span>
        </div>
      </div>
      {((p.images && p.images.length) || p.schema) && (
        <div className="project-schema" data-image={!!(p.images && p.images.length)}>
          <div className="project-schema-inner">
            {p.images && p.images.length
              ? <ProjectImageGallery images={p.images} />
              : <ProjectSchema kind={p.schema} />
            }
          </div>
        </div>
      )}
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
              A few things I&rsquo;ve been working on while learning. Click for details and link. 
            </p>
             <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--ink-3)", letterSpacing: "0.04em", margin: "0 0 32px" }}>
              More detailed documentation is found in the repositories themselves.
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
  {
    date: "2026.07",
    title: "Contributing upstream to AMY",
    tag: "Open Source",
    body: [
      { t: "p", text: "AMY - the additive synthesis engine doing the actual sound generation in my handheld synth - is the first serious, professional codebase I've spent real time inside. For months I kept a small pile of local fixes against it that I never dared to send upstream. I was sure they were wrong, or trivial, or already obvious to people who actually understood the DSP. It was easier to sit on the patches than to risk being wrong in public." },
      { t: "p", text: "What changed was watching a couple of the exact bugs I'd quietly worked around on my own machine get found and fixed in the open, months later. At some point sitting on them stopped feeling like modesty and started feeling like taking from a project I depend on without ever giving anything back. So I started opening PRs - small, self-contained, each one written to be as easy as possible to say yes to: minimal diffs, the reasoning spelled out, and wherever I could, mirroring a pattern the codebase already used so nothing new had to be maintained." },
      { t: "p", text: "I didn't expect how much the responses would land. A \"thanks, merged\" from someone whose work I've been learning from has been genuinely one of the most motivating things I've had in a while - more than I'd admit out loud. It turned AMY from something I use into something I feel a small, real sense of care for." },
      { t: "links", items: [
        { href: "https://github.com/shorepine/amy/pull/744",   label: "#744 - reverb allocation made failure-safe" },
        { href: "https://github.com/shorepine/amy/pull/743",   label: "#743 - NULL-deref guard in the oscillator path" },
        { href: "https://github.com/shorepine/amy/issues/783", label: "#783 - hot-path transcendental call sites" },
      ]},
    ],
  },
  {
    date: "2026.07",
    title: "Optimizing AMY's hot path - and building asmdiff to see it",
    tag: "Tooling",
    body: [
      { t: "p", text: "One thread in the AMY work pulled me somewhere unexpected. A lot of the render loop's cost lives in per-oscillator transcendental calls - exp2f, sinf, cosf, run once per oscillator per audio block - and there are open questions about making them cheaper without changing the sound. I tried an \"obvious\" swap (exp2f to ldexpf) on the ESP32-S3 float build and it turned out to be a regression, which is exactly the kind of thing you can't tell by staring at the C." },
      { t: "p", text: "The problem was that I kept guessing at what the compiler actually emitted. Timing an audio loop is noisy, and reading the source tells you what you hoped happened, not what did. So I built asmdiff: give it two builds and it normalises and diffs the generated instructions for a function, so I can see precisely what a change did - did the constant fold, did the call inline, did the loop body get shorter - before trusting it anywhere near real-time audio." },
      { t: "p", text: "It started as pure scaffolding for the AMY hot-path work, but it's become a small tool I reach for whenever I want the compiler to show its work rather than take its word for it. Run uvx asmdiff if you want to try it." },
      { t: "links", items: [
        { href: "https://github.com/shorepine/amy/pull/790",   label: "#790 - hoisting reverb delay-line state into locals" },
        { href: "https://github.com/shorepine/amy/issues/783", label: "#783 - the hot-path call sites that started it" },
        { href: "https://github.com/rt-rtos/asmdiff",          label: "rt-rtos/asmdiff" },
      ]},
    ],
  },
  {
    date: "2026.05",
    title: "Fixing a NAD 3020i: chasing DC offset on the outputs",
    tag: "Repair",
    body: [
      { t: "p", text: "The NAD 3020i is a late-70s integrated amplifier with something of a cult following — modest power figures on paper, but widely regarded as one of the better-sounding budget amplifiers of its era. This one had both fuses blown and a full negative-rail DC offset sitting on the speaker outputs." },
      { t: "p", text: "" },
      { t: "imgs", items: [
        { src: "assets/NadTopView.jpg", caption: "Internals mid-repair" },
        { src: "assets/NadOutputMods.jpg", caption: "PCB underside — base stoppers and added emitter resistors" },
        { src: "assets/Nad30201.jpg", caption: "The finished amp" },
      ]},
      { t: "p", text: "The actual culprits after replacing the failed output transistors were R437 and R438 — the Emitter/Collector resistor for the VAS-stage Sziklai pair Q405-408 — both open circuit. This disconnects the VAS transistors from the positive rail. The output stage being unregulated runs away in a feedback loop. slamming into the negative rail. A cracked star-ground point under a PCB mounting screw compounded things further." },
      { t: "list", items: [
        "Replaced R437 + R438 and Q400 output transistors",
        "Added base stopper resistors — trace cut, bridged with resistors for HF stability",
        "Added external emitter resistance at the output devices to compensate for epitaxial replacement transistors",
        "Replaced aging electrolytic and ceramic decoupling caps with film types",
        "New bulk filter capacitors",
        "Repaired the cracked star-ground trace",
        "Added heatsinks to Q507/Q508, which were running close to their maximum rated temperature to increase lifespan",
        "Full solder reflow, bias + DC offset calibration, stability and stress testing",
      ]},
      { t: "p", text: "The amp is from 1979 and sounds exactly like it should. Let´s hope for at least another 50 years of life" },
    ],
  },


];

function PostContent({ blocks }) {
  return (
    <div className="post-content">
      {blocks.map((b, i) => {
        if (b.t === "p") return <p key={i} className="post-p">{b.text}</p>;
        if (b.t === "imgs") return (
          <div key={i} className="post-imgs">
            {b.items.map((img, j) => (
              <figure key={j} className="post-figure">
                <img src={img.src} alt={img.caption} className="post-img" loading="lazy" />
                <figcaption className="post-caption">{img.caption}</figcaption>
              </figure>
            ))}
          </div>
        );
        if (b.t === "list") return (
          <ul key={i} className="post-list">
            {b.items.map((item, j) => <li key={j}>{item}</li>)}
          </ul>
        );
        if (b.t === "links") return (
          <div key={i} className="post-links">
            {b.items.map((lnk, j) => (
              <a key={j} href={lnk.href} target="_blank" rel="noreferrer" className="post-link">
                {lnk.label}<span aria-hidden="true"> ↗</span>
              </a>
            ))}
          </div>
        );
        return null;
      })}
    </div>
  );
}

function Writing() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <section className="section container" id="writing">
      <div className="section-grid">
        <div className="section-label">
          <div className="num">§03</div>
          <div className="name">Writing</div>
        </div>
        <div>
          <Reveal>
            <p style={{ fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--ink-2)", maxWidth: "60ch", margin: "0 0 8px", textWrap: "pretty" }}>
             Short writings and project postmortems from time to time, as I learn new things and want to share them.
            </p>
           
          </Reveal>
          <div className="writing-list">
            {WRITING.map((w, i) => (
              <Reveal key={w.title} delay={i * 60}>
                <div
                  className="write-item"
                  data-open={openIdx === i}
                  role={w.body ? "button" : undefined}
                  tabIndex={w.body ? 0 : undefined}
                  onClick={() => w.body && setOpenIdx(openIdx === i ? null : i)}
                  onKeyDown={(e) => { if (w.body && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setOpenIdx(openIdx === i ? null : i); } }}
                >
                  <div className="write-date">{w.date}</div>
                  <div className="write-title-col">
                    <div className="write-title">{w.title}<span className="arr">{w.body ? (openIdx === i ? " ↑" : " ↓") : " ↗"}</span></div>
                    {w.body && openIdx !== i && (() => { const first = w.body.find(b => b.t === 'p'); return first ? <p className="write-preview">{first.text}</p> : null; })()}
                  </div>
                  <div className="write-tag">{w.tag}</div>
                </div>
                {w.body && openIdx === i && (
                  <div className="write-body">
                    <PostContent blocks={w.body} />
                  </div>
                )}
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
    when: "Autumn 2026",
    role: "LIA Internship — Seeking Position",
    place: "Stockholm, Sweden",
    desc: "Looking for an embedded or hardware-adjacent team where I can contribute from day one. I work comfortably across the stack — from schematic and simulation through firmware and debugging. I'm self-driven, used to learning fast from documentation and datasheets, and I care about building things that actually work reliably.",
  },
  {
    when: "2025 — now",
    role: "Studying IoT & Embedded Development at Jensen Yrkeshögskola.",
    place: "Stockholm, Sweden",
    desc: "Coursework in embedded C/C++, real-time systems, sensor networks, basic signal processing and electronics.",
  },
  {
    when: "2023 — 2026",
    role: "Analog Circuit Design / Simulation",
    place: "Home lab",
    desc: "Designing and simulating analog circuits — op-amp stages, filters, oscillators and power supply topologies. Using LTspice and KiCad for schematic capture and SPICE simulation, developing intuition for signal integrity, noise and component behaviour.",
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
            <a className="contact-link" href="https://www.linkedin.com/in/rasmus-tikkanen-7803763a5" target="_blank" rel="noreferrer">
              <span className="k">linkedin</span>
              <span className="v">Rasmus Tikkanen ↗</span>
            </a>
            <a className="contact-link" href="#" onClick={(e) => e.preventDefault()}>
              <span className="k">cv</span>
              <span className="v">Provided On Request</span>
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
