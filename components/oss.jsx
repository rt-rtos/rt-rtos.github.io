/* eslint-disable */
const { useState, useEffect } = React;

/* ====== Open Source contributions ======
 *
 * The section is driven by three things:
 *
 *   1. OSS_CONFIG   - who to fetch for and where. `repos: []` means "every
 *                     public repo not owned by `username`", so new upstream
 *                     contributions appear automatically. List repos
 *                     (e.g. ["shorepine/amy"]) to restrict the section.
 *   2. OSS_NOTES    - optional one-line annotations, keyed "owner/repo#number".
 *                     Add a line here to explain why a contribution mattered.
 *   3. OSS_FALLBACK - static snapshot rendered when the GitHub API is
 *                     unreachable or rate-limited. Also the place to pin
 *                     contributions the API can't see (other forges, etc.).
 *                     Refresh it occasionally by copying the live data.
 */

const OSS_CONFIG = {
  username: "rt-rtos",
  repos: [],          // [] = all external repos; or e.g. ["shorepine/amy"]
  maxItems: 40,
  cacheMinutes: 30,   // localStorage cache TTL, keeps API calls rare
};

/* Per-item descriptions, shown beneath the entry. To annotate any PR or
 * issue - live-fetched or snapshot - add ONE line here, keyed
 * "owner/repo#number". Nothing renders for items without a key.
 * A string gives one paragraph; an array of strings gives several:
 *
 *   "shorepine/amy#787": "Closed, not rejected: re-landed by the maintainer as #809.",
 *   "owner/repo#123": ["First paragraph.", "Second paragraph."],
 *
 * Any "#123" in a note is auto-linked to that number in the same repo, so a
 * closed PR can point at wherever the work actually landed.
 */
const OSS_NOTES = {
  "shorepine/amy#881": "Putting my asmdiff tool to use in a real codebase. Full codegen scan identifiying all FP64 soft-floats",
  "shorepine/amy#950": "Root-caused clipping on resonant filters below ~100 Hz: the fixed-point multiply truncated the biquad's deliberately small feedback corrections down to 2-3 significant bits. Closed, not rejected - the maintainer took the exact 64-bit multiply, found it faster than the path it replaced, and rolled it out across all filtering in #951.",
  "shorepine/amy#790": "Caches the reverb delay-line state in locals instead of re-reading it through memory every sample. Closed, not rejected - the maintainer cloned it into #811 to fix the conflicts, and merged it there.",
  "shorepine/amy#787": "Reverb feedback was never written back through the low-pass filter. The two failing CI tests were the fix working - their reference WAVs came from the unfiltered path. Closed, not rejected - re-landed by the maintainer as #809.",
  "shorepine/amy#783": "Flagged the libm transcendentals still being called once per oscillator per render block - freq_of_logfreq, plus cosf/sinf in filter_process. The maintainer implemented the removals in #875, worth ~3% of total render time; #877 then extended the same treatment to the hpf and bpf coefficient generators.",
  "shorepine/amy#743": "First upstream fix - NULL deref found while building S3-Amysynth.",
  "shorepine/amy#827": "Fixed a clock wrap at ~25 h that silently degraded sequencer timing.",
  "shorepine/amy#893": "Hand-rolled ESP32-S3 PIE memset/memcpy asm in the render path.",
};

const OSS_FALLBACK = [
  { repo: "shorepine/amy", number: 950, type: "pr",    state: "closed", date: "2026-07-20", title: "Use full-precision multiply for biquad feedback coefficients" },
  { repo: "shorepine/amy", number: 949, type: "pr",    state: "merged", date: "2026-07-20", title: "Reject mod_source cycles so chained modulators can't recurse unbounded" },
  { repo: "shorepine/amy", number: 893, type: "pr",    state: "merged", date: "2026-07-15", title: "Inline PIE asm in algorithms.c zero()/copy()" },
  { repo: "shorepine/amy", number: 891, type: "issue", state: "open",   date: "2026-07-14", title: "Deterministic on-target A/B benchmark for DSP changes" },
  { repo: "shorepine/amy", number: 890, type: "issue", state: "closed", date: "2026-07-14", title: "loadsweep render_us: the EMA reads low and hides deadline misses" },
  { repo: "shorepine/amy", number: 889, type: "issue", state: "closed", date: "2026-07-14", title: "ESP32-S3: PIE (SIMD) block clear/copy in the render path" },
  { repo: "shorepine/amy", number: 881, type: "pr",    state: "merged", date: "2026-07-12", title: "Keep soft-float libcalls out of the render path" },
  { repo: "shorepine/amy", number: 877, type: "pr",    state: "merged", date: "2026-07-11", title: "sin/cos_lut in the hpf and bpf coefficient generators too" },
  { repo: "shorepine/amy", number: 827, type: "pr",    state: "merged", date: "2026-07-07", title: "amy_sysclock(): fix clock wrap at ~25 h and precision decay" },
  { repo: "shorepine/amy", number: 790, type: "pr",    state: "closed", date: "2026-07-04", title: "Hoist stereo_reverb() delay-line state into locals" },
  { repo: "shorepine/amy", number: 787, type: "pr",    state: "closed", date: "2026-07-03", title: "Fix stereo_reverb LPF state never being written back" },
  { repo: "shorepine/amy", number: 783, type: "issue", state: "closed", date: "2026-06-30", title: "Other hot-path exp2f/cosf/sinf call sites" },
  { repo: "shorepine/amy", number: 764, type: "pr",    state: "merged", date: "2026-06-25", title: "Fix float-mode build break: add MUL5A_SS / MUL6A_SS fallbacks" },
  { repo: "shorepine/amy", number: 744, type: "pr",    state: "merged", date: "2026-06-21", title: "Make reverb allocation failure-safe (mirrors existing echo guard)" },
  { repo: "shorepine/amy", number: 743, type: "pr",    state: "merged", date: "2026-06-20", title: "Fix NULL deref on freed chained_osc in render_osc_wave" },
  { repo: "shorepine/amy", number: 740, type: "pr",    state: "merged", date: "2026-06-20", title: "Fix copy-paste typo in stereo_reverb low-pass filter state" },
  { repo: "shorepine/amy", number: 625, type: "issue", state: "closed", date: "2026-03-22", title: "ESP-IDF: AMY crashes at boot - ESP_TASK_PRIO_MAX is invalid as a FreeRTOS task priority" },
];

const OSS_CACHE_KEY = "oss-contributions-v1";

function ossItemHref(it) {
  return `https://github.com/${it.repo}/${it.type === "pr" ? "pull" : "issues"}/${it.number}`;
}

function normalizeSearchItem(raw) {
  const isPr = !!raw.pull_request;
  return {
    repo: raw.repository_url.replace(/.*\/repos\//, ""),
    number: raw.number,
    type: isPr ? "pr" : "issue",
    state: isPr && raw.pull_request.merged_at ? "merged" : raw.state,
    date: raw.created_at.slice(0, 10),
    title: raw.title.trim(),
  };
}

function buildQuery() {
  const { username, repos } = OSS_CONFIG;
  const scope = repos.length
    ? repos.map((r) => `repo:${r}`).join(" ")
    : `-user:${username}`;
  return `author:${username} ${scope}`;
}

async function fetchContributions() {
  const url =
    "https://api.github.com/search/issues?q=" +
    encodeURIComponent(buildQuery()) +
    `&sort=created&order=desc&per_page=${OSS_CONFIG.maxItems}`;
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const data = await res.json();
  return data.items.map(normalizeSearchItem);
}

function readCache() {
  try {
    const raw = localStorage.getItem(OSS_CACHE_KEY);
    if (!raw) return null;
    const { at, items } = JSON.parse(raw);
    if (Date.now() - at > OSS_CONFIG.cacheMinutes * 60 * 1000) return null;
    return items;
  } catch {
    return null;
  }
}

function writeCache(items) {
  try {
    localStorage.setItem(OSS_CACHE_KEY, JSON.stringify({ at: Date.now(), items }));
  } catch {}
}

function useContributions() {
  const [items, setItems] = useState(null);
  const [source, setSource] = useState("loading");
  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setItems(cached);
      setSource("live");
      return;
    }
    let alive = true;
    fetchContributions()
      .then((fresh) => {
        if (!alive) return;
        writeCache(fresh);
        setItems(fresh);
        setSource("live");
      })
      .catch(() => {
        if (!alive) return;
        setItems(OSS_FALLBACK);
        setSource("snapshot");
      });
    return () => { alive = false; };
  }, []);
  return { items, source };
}

const OSS_STATE_LABEL = { merged: "merged", open: "open", closed: "closed" };

/* Notes routinely point at a sibling PR ("closed, re-landed as #809"), so any
 * "#123" in a note becomes a link into the same repo. GitHub redirects
 * /issues/N to /pull/N when N is a PR, so one form covers both. */
function ossNoteNodes(text, repo, keyPrefix) {
  const parts = [];
  let cursor = 0;
  for (const m of text.matchAll(/#(\d+)/g)) {
    if (m.index > cursor) parts.push(text.slice(cursor, m.index));
    parts.push(
      <a
        key={`${keyPrefix}-${m.index}`}
        className="oss-note-link"
        href={`https://github.com/${repo}/issues/${m[1]}`}
        target="_blank"
        rel="noreferrer"
      >
        #{m[1]}
      </a>
    );
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

/* The row is not a wrapping <a> - notes contain their own links, which cannot
 * legally nest. Instead the title anchor is stretched over the whole row via
 * .oss-title::after, and note links are lifted above it with z-index. */
function OssRow({ it }) {
  const note = OSS_NOTES[`${it.repo}#${it.number}`];
  return (
    <div className="oss-item">
      <div className="oss-date">{it.date.replace(/-/g, ".").slice(0, 7)}</div>
      <div className="oss-main">
        <a className="oss-title" href={ossItemHref(it)} target="_blank" rel="noreferrer">
          <span className="oss-ref">{it.repo}#{it.number}</span>
          {it.title}
          <span className="arr" aria-hidden="true"> ↗</span>
        </a>
        {note && (Array.isArray(note) ? note : [note]).map((n, i) => (
          <p key={i} className="oss-note">{ossNoteNodes(n, it.repo, i)}</p>
        ))}
      </div>
      <div className="oss-badge" data-state={it.state} data-type={it.type}>
        {it.type === "pr" ? "PR" : "issue"} · {OSS_STATE_LABEL[it.state] || it.state}
      </div>
    </div>
  );
}

function OpenSource() {
  const { items, source } = useContributions();
  const [filter, setFilter] = useState("all");
  const [collapsed, setCollapsed] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const LIST_LIMIT = 10;
  const shown = (items || []).filter(
    (it) => filter === "all" || it.type === filter
  );
  const visible = showAll ? shown : shown.slice(0, LIST_LIMIT);
  const merged = (items || []).filter((it) => it.state === "merged").length;
  const issues = (items || []).filter((it) => it.type === "issue").length;
  const repos = [...new Set((items || []).map((it) => it.repo))];

  return (
    <section className="section container" id="oss">
      <div className="section-grid">
        <div className="section-label">
          <div className="num">§03</div>
          <div className="name">Open Source</div>
        </div>
        <div>
          <Reveal>
            <p style={{ fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--ink-2)", maxWidth: "60ch", margin: "0 0 8px", textWrap: "pretty" }}>
              Upstream contributions - mostly to <a href="https://github.com/shorepine/amy" target="_blank" rel="noreferrer" style={{ borderBottom: "1px solid var(--rule)" }}>AMY</a>, the synthesis engine my handheld synth runs on.
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--ink-3)", letterSpacing: "0.04em", margin: "0 0 24px" }}>
              {source === "loading" && "querying api.github.com …"}
              {source === "live" && `live from GitHub · ${merged} merged · ${issues} issues · ${repos.join(" · ")}`}
              {source === "snapshot" && `offline snapshot · ${merged} merged · ${issues} issues · ${repos.join(" · ")}`}
            </p>
            <button
              className="oss-collapse"
              aria-expanded={!collapsed}
              aria-controls="oss-body"
              onClick={() => setCollapsed((c) => !c)}
            >
              {collapsed
                ? `▸ show ${items ? `all ${items.length} ` : ""}contributions`
                : "▾ collapse section"}
            </button>
          </Reveal>
          {!collapsed && (
          <div id="oss-body">
          <Reveal delay={100}>
            <div className="oss-filters" role="tablist" aria-label="Filter contributions">
              {[["all", "all"], ["pr", "pull requests"], ["issue", "issues"]].map(([key, label]) => (
                <button
                  key={key}
                  className="oss-filter"
                  data-active={filter === key}
                  onClick={() => setFilter(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </Reveal>
          <div className="oss-list">
            {items === null && (
              <div className="oss-empty">- loading contributions -</div>
            )}
            {items !== null && shown.length === 0 && (
              <div className="oss-empty">- nothing here yet -</div>
            )}
            {visible.map((it, i) => (
              <Reveal key={`${it.repo}#${it.number}`} delay={Math.min(i, 6) * 50}>
                <OssRow it={it} />
              </Reveal>
            ))}
          </div>
          {shown.length > LIST_LIMIT && (
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
              <button
                className="oss-collapse"
                style={{ marginBottom: 0 }}
                aria-expanded={showAll}
                onClick={() => setShowAll((s) => !s)}
              >
                {showAll
                  ? "▴ collapse list"
                  : `▾ expand · ${shown.length - LIST_LIMIT} more`}
              </button>
            </div>
          )}
          <Reveal delay={200}>
            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <a
                href={`https://github.com/search?q=${encodeURIComponent(buildQuery())}&type=pullrequests`}
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
                all pull requests on github ↗
              </a>
            </div>
          </Reveal>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { OpenSource });
