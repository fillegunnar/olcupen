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
}: {
  label: string;
  value: number;
  max: number;
  suffix?: string;
  color?: string;
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
          {value}
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
  | { type: "an"; value: number; suffix: string; label: string }
  | { type: "sb"; value: number; max: number; suffix: string; label: string };

interface Story {
  headline: string;
  publishSort: number;
  eventSort: number;
  blocks: ParsedBlock[];
}

/* ── Date formatting ── */

const MONTHS = [
  "Januari",
  "Februari",
  "Mars",
  "April",
  "Maj",
  "Juni",
  "Juli",
  "Augusti",
  "September",
  "Oktober",
  "November",
  "December",
];

function formatSortDate(sort: number): string {
  const s = String(sort);
  const year = s.slice(0, 4);
  const month = parseInt(s.slice(4, 6), 10);
  return `${MONTHS[month - 1]} ${year}`;
}

/* ── Parse story content into blocks ── */

function parseStoryContent(text: string): ParsedBlock[] {
  const lines = text.split("\n");
  const blocks: ParsedBlock[] = [];
  let currentText = "";

  for (const line of lines) {
    const trimmed = line.trim();
    const anMatch = trimmed.match(/^<an\s*;\s*(.+?)\s*;\s*(.*?)\s*;\s*(.+?)>$/);
    const sbMatch = trimmed.match(/^<sb\s*;\s*(.+?)\s*;\s*(.*?)\s*;\s*(.+?)>$/);

    if (anMatch) {
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
      blocks.push({ type: "sb", value: v, max: m, suffix, label });
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
    `?tqx=out:json&headers=0&range=A1:E100`;
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

    const publishSort = Number(cells[1]?.f ?? cells[1]?.v ?? 0);
    const eventSort = Number(cells[2]?.f ?? cells[2]?.v ?? 0);
    const headline = cells[3]?.v != null ? String(cells[3].v) : "";
    const rawContent = cells[4]?.v != null ? String(cells[4].v) : "";
    if (!headline) continue;

    stories.push({
      headline,
      publishSort,
      eventSort,
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
    } else {
      widgetGroup.push(block);
    }
  }
  flushWidgets();

  return result;
}

/* ── Main component ── */

type ViewMode = "latest" | "timeline";

function getPreview(story: Story): string {
  const first = story.blocks.find((b) => b.type === "text");
  if (!first || first.type !== "text") return "";
  const text = first.value;
  if (text.length <= 120) return text;
  return text.slice(0, 120).replace(/\s+\S*$/, "") + "…";
}

export default function Olabladet() {
  const [mode, setMode] = useState<ViewMode>("latest");
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

  const sorted = [...stories].sort((a, b) =>
    mode === "latest"
      ? b.publishSort - a.publishSort
      : a.eventSort - b.eventSort,
  );

  return (
    <div className="page olabladet">
      <OlabladetHeader />
      <ToggleNewsSort mode={mode} setMode={setMode} />

      {loading && <p className="tournament-loading">Hämtar artiklar…</p>}
      {error && <p className="tournament-error">{error}</p>}

      <div className={`olabladet-stories ${mode}`}>
        {sorted.map((story) => {
          const isOpen = expanded.has(story.headline);
          return (
            <article
              key={story.headline}
              className={`olabladet-story${isOpen ? " open" : ""}`}
              onClick={() => toggle(story.headline)}
            >
              <div className="olabladet-story-header">
                <div>
                  <div className="olabladet-story-dates">
                    <span className="olabladet-event-date">
                      📅 {formatSortDate(story.eventSort)}
                    </span>
                    <span className="olabladet-publish-date">
                      Publicerad: {formatSortDate(story.publishSort)}
                    </span>
                  </div>
                  <h2>{story.headline}</h2>
                </div>
                <span className="olabladet-expand-icon">
                  {isOpen ? "▲" : "▼"}
                </span>
              </div>

              {!isOpen && (
                <p className="olabladet-preview">{getPreview(story)}</p>
              )}

              {isOpen && (
                <div className="olabladet-story-body">
                  {renderBlocks(story.blocks)}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function ToggleNewsSort({
  mode,
  setMode,
}: {
  mode: ViewMode;
  setMode: Dispatch<SetStateAction<ViewMode>>;
}) {
  return (
    <div className="olabladet-toggle">
      <button
        className={mode === "latest" ? "active" : ""}
        onClick={() => setMode("latest")}
      >
        Senaste nytt
      </button>
      <button
        className={mode === "timeline" ? "active" : ""}
        onClick={() => setMode("timeline")}
      >
        Tidslinje
      </button>
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
