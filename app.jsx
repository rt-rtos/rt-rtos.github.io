/* eslint-disable */
const { useEffect, useState } = React;

const SITE_DEFAULTS = {
  "theme": "system",
  "type": "default",
  "density": "default",
  "texture": "none",
  "heroLineA": "Rasmus",
  "heroLineB": "Tikkanen,",
  "heroAccent": "learning",
  "heroLineC": "embedded.",
  "lede": "Studying IoT and embedded development in Stockholm. I like working where hardware meets software — mixed-domain signals, analog and digital electronics."
};

function App() {
  const [now, setNow] = useState("");

  const SHOW_WRITING = true;

  useEffect(() => {
    const applyTheme = (themeVal) => {
      if (themeVal === 'system') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.dataset.theme = prefersDark ? 'dark' : 'light';
      } else {
        document.body.dataset.theme = themeVal;
      }
      document.body.dataset.type = SITE_DEFAULTS.type;
      document.body.dataset.density = SITE_DEFAULTS.density;
      document.body.dataset.texture = SITE_DEFAULTS.texture;
    };

    applyTheme(SITE_DEFAULTS.theme);

    let mql;
    const onPrefChange = (e) => {
      if (SITE_DEFAULTS.theme === 'system') applyTheme('system');
    };
    if (window.matchMedia) {
      mql = window.matchMedia('(prefers-color-scheme: dark)');
      if (mql.addEventListener) mql.addEventListener('change', onPrefChange);
      else if (mql.addListener) mql.addListener(onPrefChange);
    }
    return () => {
      if (mql) {
        if (mql.removeEventListener) mql.removeEventListener('change', onPrefChange);
        else if (mql.removeListener) mql.removeListener(onPrefChange);
      }
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      setNow(`${hh}:${mm}:${ss} EET`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <TopBar now={now} />
      <main>
        <Hero
          heroLineA={SITE_DEFAULTS.heroLineA}
          heroLineB={SITE_DEFAULTS.heroLineB}
          heroAccent={SITE_DEFAULTS.heroAccent}
          heroLineC={SITE_DEFAULTS.heroLineC}
          lede={SITE_DEFAULTS.lede}
        />
        <About />
        <Projects />
        {SHOW_WRITING && <Writing />}
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
