import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import "./Olabladet.css";

const SHEET_ID = "1lUacLqD8ZikXIq_SSgafWOPGt-P3HhFFBHn4ALXmlpc";

/* ── Animated counter: rolls from 0 to target when visible ── */

function AnimatedNumber({
  value,
  duration = 3000,
  suffix = "",
}: {
  value: number;
  duration?: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  const decimals = Number.isInteger(value)
    ? 0
    : (value.toString().split(".")[1]?.length ?? 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = eased * value;
            setDisplay(
              decimals > 0
                ? current.toFixed(decimals)
                : String(Math.round(current)),
            );
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration, decimals]);

  return (
    <span ref={ref} className="olabladet-animated-number">
      {display}
      {suffix}
    </span>
  );
}

/* ── Stat bar: horizontal bar that animates width when visible ── */

function StatBar({
  label,
  value,
  max,
  suffix = "",
  color = "var(--gold)",
  hideValue = false,
}: {
  label: string;
  value: number;
  max: number;
  suffix?: string;
  color?: string;
  hideValue?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pct = (value / max) * 100;

  return (
    <div ref={ref} className="olabladet-stat-bar">
      <div className="olabladet-stat-bar-label">
        <span>{label}</span>
        <span style={{ color }}>
          {!hideValue && value}
          {suffix && ` ${suffix}`}
        </span>
      </div>
      <div className="olabladet-stat-bar-track">
        <div
          className="olabladet-stat-bar-fill"
          style={{
            width: visible ? `${pct}%` : "0%",
            background: color,
          }}
        />
      </div>
    </div>
  );
}

/* ── Types ── */

type ParsedBlock =
  | { type: "text"; value: string }
  | { type: "img"; url: string }
  | { type: "an"; value: number; suffix: string; label: string }
  | {
      type: "sb";
      value: number;
      max: number;
      suffix: string;
      label: string;
      hideValue?: boolean;
    };

interface Story {
  headline: string;
  eventSort: number;
  category: string;
  blocks: ParsedBlock[];
}

/* ── Date formatting ── */

function formatSortDate(sort: number): string {
  const s = String(sort);
  const year = s.slice(0, 4);
  const month = s.slice(4, 6);
  const day = s.slice(6, 8);
  return `${year}-${month}-${day}`;
}

/* ── Parse story content into blocks ── */

function parseStoryContent(text: string): ParsedBlock[] {
  const lines = text.split("\n");
  const blocks: ParsedBlock[] = [];
  let currentText = "";

  for (const line of lines) {
    const trimmed = line.trim();
    const anMatch = trimmed.match(/^<an\s*;\s*(.+?)\s*;\s*(.*?)\s*;\s*(.+?)>$/);
    const sbMatch = trimmed.match(
      /^<sb\s*;\s*(.+?)\s*;\s*(.*?)\s*;\s*(.+?)(?:\s*;\s*(.+?))?\s*>$/,
    );
    const isImage = trimmed.startsWith("https://lh3.googleusercontent.com/");

    if (isImage) {
      if (currentText.trim()) {
        blocks.push({ type: "text", value: currentText.trimEnd() });
        currentText = "";
      }
      blocks.push({ type: "img", url: trimmed });
    } else if (anMatch) {
      if (currentText.trim()) {
        blocks.push({ type: "text", value: currentText.trimEnd() });
        currentText = "";
      }
      const rawValue = anMatch[1].trim();
      const suffix = anMatch[2].trim();
      const label = anMatch[3].trim();
      const num = parseFloat(rawValue.replace(",", ".")) || 0;
      blocks.push({ type: "an", value: num, suffix, label });
    } else if (sbMatch) {
      if (currentText.trim()) {
        blocks.push({ type: "text", value: currentText.trimEnd() });
        currentText = "";
      }
      const rawValue = sbMatch[1].trim();
      const suffix = sbMatch[2].trim();
      const label = sbMatch[3].trim();
      const [v, m] = rawValue.split("/").map(Number);
      const hideValue = sbMatch[4]?.trim().toLowerCase() === "hidevalue";
      blocks.push({ type: "sb", value: v, max: m, suffix, label, hideValue });
    } else {
      currentText += line + "\n";
    }
  }

  if (currentText.trim()) {
    blocks.push({ type: "text", value: currentText.trimEnd() });
  }

  return blocks;
}

/* ── Fetch stories from Google Sheet ── */

type GvizCell = { v: string | number | null; f?: string } | null;
type GvizRow = { c: GvizCell[] };

async function fetchStories(): Promise<Story[]> {
  const url =
    `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq` +
    `?tqx=out:json&headers=0&range=A1:F100`;
  const res = await fetch(url);
  const text = await res.text();
  const jsonStr = text.replace(/^[^(]*\(/, "").replace(/\);?\s*$/, "");
  const data = JSON.parse(jsonStr);

  const rows = data.table.rows as GvizRow[];
  const stories: Story[] = [];

  for (const row of rows) {
    const cells = row.c;
    const status =
      cells[0]?.v != null ? String(cells[0].v).trim().toLowerCase() : "";
    if (status !== "r") continue;

    const eventSort = Number(cells[2]?.f ?? cells[2]?.v ?? 0);
    const headline = cells[3]?.v != null ? String(cells[3].v) : "";
    const rawContent = cells[4]?.v != null ? String(cells[4].v) : "";
    const category =
      cells[5]?.v != null ? String(cells[5].v).trim().toLowerCase() : "";
    if (!headline) continue;

    stories.push({
      headline,
      eventSort,
      category,
      blocks: parseStoryContent(rawContent),
    });
  }

  return stories;
}

/* ── Render parsed blocks ── */

function renderBlocks(blocks: ParsedBlock[]): ReactNode[] {
  const result: ReactNode[] = [];
  let widgetGroup: ParsedBlock[] = [];

  const flushWidgets = () => {
    if (widgetGroup.length === 0) return;
    const anBlocks = widgetGroup.filter((w) => w.type === "an");
    const sbBlocks = widgetGroup.filter((w) => w.type === "sb");
    result.push(
      <div key={`widgets-${result.length}`} className="olabladet-widget">
        {anBlocks.length > 0 && (
          <div className="olabladet-stat-cards">
            {anBlocks.map((w, i) =>
              w.type === "an" ? (
                <div key={i} className="olabladet-stat-card">
                  <div className="olabladet-stat-card-value">
                    <AnimatedNumber value={w.value} suffix={w.suffix} />
                  </div>
                  <span className="olabladet-stat-card-label">{w.label}</span>
                </div>
              ) : null,
            )}
          </div>
        )}
        {sbBlocks.map((w, i) =>
          w.type === "sb" ? (
            <StatBar
              key={i}
              label={w.label}
              value={w.value}
              max={w.max}
              suffix={w.suffix}
              hideValue={w.type === "sb" && w.hideValue}
            />
          ) : null,
        )}
      </div>,
    );
    widgetGroup = [];
  };

  for (const block of blocks) {
    if (block.type === "text") {
      flushWidgets();
      result.push(
        <p key={`text-${result.length}`} style={{ whiteSpace: "pre-wrap" }}>
          {block.value}
        </p>,
      );
    } else if (block.type === "img") {
      flushWidgets();
      result.push(
        <img
          key={`img-${result.length}`}
          src={block.url}
          alt=""
          className="olabladet-story-image"
        />,
      );
    } else {
      widgetGroup.push(block);
    }
  }
  flushWidgets();

  return result;
}

/* ── Main component ── */

type ViewMode = "nyhet" | "historia" | "statistik";

function getEventYear(story: Story): string {
  return String(story.eventSort).slice(0, 4);
}

function getPreview(story: Story): string {
  const first = story.blocks.find((b) => b.type === "text");
  if (!first || first.type !== "text") return "";
  const text = first.value;
  if (text.length <= 120) return text;
  return text.slice(0, 120).replace(/\s+\S*$/, "") + "…";
}

export default function Olabladet() {
  const [mode, setMode] = useState<ViewMode>("nyhet");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStories = useCallback(async () => {
    try {
      const data = await fetchStories();
      setStories(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch Ölabladet stories:", err);
      setError("Kunde inte hämta artiklar.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  const toggle = (headline: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(headline)) next.delete(headline);
      else next.add(headline);
      return next;
    });

  const [collapsedYears, setCollapsedYears] = useState<Set<string>>(new Set());

  const toggleYear = (year: string) =>
    setCollapsedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });

  const today = (() => {
    const d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  })();

  const published = stories.filter((s) => s.eventSort <= today);

  const filtered = published.filter((s) => s.category === mode);

  const sorted = [...filtered].sort((a, b) =>
    mode === "historia" ? a.eventSort - b.eventSort : b.eventSort - a.eventSort,
  );

  /* Group stories by event year for historia mode */
  const yearGroups =
    mode === "historia"
      ? [...filtered]
          .sort((a, b) => a.eventSort - b.eventSort)
          .reduce<{ year: string; stories: Story[] }[]>((acc, story) => {
            const year = getEventYear(story);
            const last = acc[acc.length - 1];
            if (last && last.year === year) {
              last.stories.push(story);
            } else {
              acc.push({ year, stories: [story] });
            }
            return acc;
          }, [])
      : [];

  const renderStoryCard = (story: Story) => {
    const isOpen = expanded.has(story.headline);
    return (
      <article
        key={story.headline}
        className={`olabladet-story${isOpen ? " open" : ""}`}
        onClick={() => toggle(story.headline)}
      >
        <div className="olabladet-story-header">
          <div>
            <span className="olabladet-event-date">
              📅 {formatSortDate(story.eventSort)}
            </span>
            <h2>{story.headline}</h2>
          </div>
          <span className="olabladet-expand-icon">{isOpen ? "▲" : "▼"}</span>
        </div>

        {!isOpen && <p className="olabladet-preview">{getPreview(story)}</p>}

        {isOpen && (
          <div className="olabladet-story-body">
            {renderBlocks(story.blocks)}
          </div>
        )}
      </article>
    );
  };

  return (
    <div className="page olabladet">
      <OlabladetHeader />
      <ToggleNewsSort mode={mode} setMode={setMode} />

      {loading && <p className="tournament-loading">Hämtar artiklar…</p>}
      {error && <p className="tournament-error">{error}</p>}

      {mode === "nyhet" && sorted.length > 0 && (
        <article className="olabladet-hero">
          <span className="olabladet-event-date">
            📅 {formatSortDate(sorted[0].eventSort)}
          </span>
          <h2>{sorted[0].headline}</h2>
          <div className="olabladet-story-body">
            {renderBlocks(sorted[0].blocks)}
          </div>
        </article>
      )}

      {mode === "historia" ? (
        <div className="olabladet-chronicle">
          {yearGroups.map(({ year, stories: yearStories }) => {
            const isCollapsed = collapsedYears.has(year);
            return (
              <section key={year} className="olabladet-year-section">
                <button
                  className="olabladet-year-header"
                  onClick={() => toggleYear(year)}
                >
                  <span className="olabladet-year-label">{year}</span>
                  <span className="olabladet-year-count">
                    {yearStories.length} artik
                    {yearStories.length === 1 ? "el" : "lar"}
                  </span>
                  <span className="olabladet-expand-icon">
                    {isCollapsed ? "▼" : "▲"}
                  </span>
                </button>
                {!isCollapsed && (
                  <div className="olabladet-stories timeline">
                    {yearStories.map(renderStoryCard)}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <div className="olabladet-stories">
          {sorted.slice(mode === "nyhet" ? 1 : 0).map(renderStoryCard)}
        </div>
      )}
    </div>
  );
}

const TOGGLE_MODES: ViewMode[] = ["nyhet", "historia", "statistik"];
const TOGGLE_LABELS: Record<ViewMode, string> = {
  nyhet: "Nyhet",
  historia: "Historia",
  statistik: "Statistik",
};

function ToggleNewsSort({
  mode,
  setMode,
}: {
  mode: ViewMode;
  setMode: Dispatch<SetStateAction<ViewMode>>;
}) {
  const [phase, setPhase] = useState<"idle" | "drain" | "pour">("idle");
  const [prevMode, setPrevMode] = useState<ViewMode>(mode);
  const [nextMode, setNextMode] = useState<ViewMode>(mode);
  const [kungLeft, setKungLeft] = useState(0);
  const [kungReady, setKungReady] = useState(false);
  const [kungTilted, setKungTilted] = useState(false);
  const [kungTransition, setKungTransition] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([null, null, null]);

  const computeKungLeft = useCallback((m: ViewMode): number => {
    const idx = TOGGLE_MODES.indexOf(m);
    const btn = btnRefs.current[idx];
    const wrapper = wrapperRef.current;
    if (!btn || !wrapper) return 0;
    const wRect = wrapper.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    return bRect.left - wRect.left;
  }, []);

  useEffect(() => {
    setKungLeft(computeKungLeft(mode));
    setKungReady(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (newMode: ViewMode) => {
    if (newMode === mode || phase !== "idle") return;
    setPrevMode(mode);
    setNextMode(newMode);
    setPhase("drain");
    setKungTransition(true);
    setKungTilted(false);
    setKungLeft(computeKungLeft(newMode));
  };

  useEffect(() => {
    if (phase === "drain") {
      const t = setTimeout(() => {
        setMode(nextMode);
        setPhase("pour");
        setKungTilted(true);
      }, 500);
      return () => clearTimeout(t);
    }
    if (phase === "pour") {
      const t = setTimeout(() => {
        setPhase("idle");
        setKungTilted(false);
        setKungTransition(false);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [phase, nextMode, setMode]);

  const getButtonClass = (m: ViewMode): string => {
    if (phase === "idle" && m === mode) return "active";
    if (phase === "drain" && m === prevMode) return "draining";
    if (phase === "pour" && m === nextMode) return "pouring";
    return "";
  };

  const kungStyle = {
    left: kungLeft,
    transform: kungTilted ? "rotate(60deg)" : "rotate(0deg)",
    opacity: kungReady ? 1 : 0,
    transition: kungTransition
      ? "left 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.3s ease, opacity 0.3s"
      : "opacity 0.3s",
  };

  return (
    <div className="olabladet-toggle">
      <div className="olabladet-toggle-buttons" ref={wrapperRef}>
        {TOGGLE_MODES.map((m, i) => (
          <button
            key={m}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            className={getButtonClass(m)}
            onClick={() => handleClick(m)}
          >
            <span className="btn-fill" />
            <span className="btn-label">{TOGGLE_LABELS[m]}</span>
          </button>
        ))}
        <img
          src="/img/KUNG.png"
          alt=""
          className="olabladet-kung-can"
          style={kungStyle}
        />
      </div>
    </div>
  );
}

function OlabladetHeader() {
  return (
    <header className="olabladet-header">
      <h1 className="olabladet-title">Ölabladet</h1>
      <p className="olabladet-subtitle">
        Nyheter, rekord och minnesvärda ögonblick från Ölcupens historia
      </p>
    </header>
  );
}
