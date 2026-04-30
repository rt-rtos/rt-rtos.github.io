/* eslint-disable */
const { useEffect, useState } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "system",
  "type": "default",
  "density": "default",
  "texture": "none",
  "heroLineA": "Rasmus",
  "heroLineB": "Tikkanen,",
  "heroAccent": "learning",
  "heroLineC": "embedded.",
  "lede": "Studying IoT and embedded development in Stockholm. I like working where hardware meets software — mixed-domain signals, analog and digital electronics."
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [now, setNow] = useState("");

  const SHOW_WRITING = false; // flip to true later

  useEffect(() => {
    const applyTheme = (themeVal) => {
      if (themeVal === 'system') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.dataset.theme = prefersDark ? 'dark' : 'light';
      } else {
        document.body.dataset.theme = themeVal;
      }
      document.body.dataset.type = t.type;
      document.body.dataset.density = t.density;
      document.body.dataset.texture = t.texture;
    };

    applyTheme(t.theme);

    let mql;
    const onPrefChange = (e) => {
      if (t.theme === 'system') applyTheme('system');
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
  }, [t.theme, t.type, t.density, t.texture]);

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
          heroLineA={t.heroLineA}
          heroLineB={t.heroLineB}
          heroAccent={t.heroAccent}
          heroLineC={t.heroLineC}
          lede={t.lede}
        />
        <About />
        <Projects />
        {SHOW_WRITING && <Writing />}
        <Experience />
        <Contact />
      </main>
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme">
          <TweakRadio
            label="Color"
            value={t.theme}
            onChange={(v) => setTweak("theme", v)}
            options={[
              { value: "light", label: "Paper" },
              { value: "dark", label: "Ink" },
              { value: "terminal", label: "Term" },
              { value: "system", label: "System" },
            ]}
          />
          <TweakSelect
            label="Texture"
            value={t.texture}
            onChange={(v) => setTweak("texture", v)}
            options={[
              { value: "none", label: "None" },
              { value: "grid", label: "Grid" },
              { value: "dots", label: "Dots" },
              { value: "lines", label: "Lines" },
              { value: "paper", label: "Paper" },
            ]}
          />
        </TweakSection>

        <TweakSection label="Typography">
          <TweakSelect
            label="Pairing"
            value={t.type}
            onChange={(v) => setTweak("type", v)}
            options={[
              { value: "default", label: "Inter Tight + Mono" },
              { value: "grotesk", label: "Space Grotesk + Mono" },
              { value: "serif", label: "Instrument Serif" },
              { value: "humanist", label: "Fraunces" },
            ]}
          />
        </TweakSection>

        <TweakSection label="Layout">
          <TweakRadio
            label="Density"
            value={t.density}
            onChange={(v) => setTweak("density", v)}
            options={[
              { value: "compact", label: "Compact" },
              { value: "default", label: "Default" },
              { value: "airy", label: "Airy" },
            ]}
          />
        </TweakSection>

        <TweakSection label="Hero copy">
          <TweakText label="Line 1" value={t.heroLineA} onChange={(v) => setTweak("heroLineA", v)} />
          <TweakText label="Line 2" value={t.heroLineB} onChange={(v) => setTweak("heroLineB", v)} />
          <TweakText label="Accent" value={t.heroAccent} onChange={(v) => setTweak("heroAccent", v)} />
          <TweakText label="Line 3" value={t.heroLineC} onChange={(v) => setTweak("heroLineC", v)} />
          <TweakText label="Lede" value={t.lede} onChange={(v) => setTweak("lede", v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
