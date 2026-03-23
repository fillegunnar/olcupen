import { useState, useEffect, useRef, type ReactNode } from "react";
import "./Olabladet.css";

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
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

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
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

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
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
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
        <span style={{ color }}>{value}</span>
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

/* ── Stat card grid ── */

function StatCard({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="olabladet-stat-card">
      <span className="olabladet-stat-card-icon">{icon}</span>
      <div className="olabladet-stat-card-value">{children}</div>
      <span className="olabladet-stat-card-label">{label}</span>
    </div>
  );
}

/* ── Story data ── */

interface StoryContent {
  type: "text";
  value: string;
}
interface StoryWidget {
  type: "stats" | "bars";
  value: string; // widget key
}
type StoryBlock = StoryContent | StoryWidget;

interface Story {
  headline: string;
  publishDate: string;
  eventDate: string;
  eventSort: number;
  publishSort: number;
  blocks: StoryBlock[];
}

const stories: Story[] = [
  {
    headline: "Ölabladet lanseras - din källa till allt Ölcupen-relaterat",
    publishDate: "Mars 2026",
    eventDate: "Mars 2026",
    eventSort: 20260301,
    publishSort: 20260301,
    blocks: [
      {
        type: "text",
        value: "Visste du att Ölcupsledningens favoritöl är KUNG?",
      },
      {
        type: "text",
        value:
          "KUNG är en redig designburk och tillsammans med den låga kostnaden på 13:90 per burk så säga att det är ren, ärlig leverans varje gång. När livet sviker så står Kungen kvar – billig, stabil och lojal (förhoppningsvis kall).",
      },
      {
        type: "text",
        value: "Kanske inte bäst i världen.",
      },
      {
        type: "text",
        value: "Men alltid rätt i stunden.",
      },
      {
        type: "stats",
        value: "kung-facts",
      },
    ],
  },
];

/* ── Widget renderers ── */

function renderWidget(key: string): ReactNode {
  switch (key) {
    case "kung-facts":
      return (
        <div className="olabladet-widget">
          <StatCard icon="👑" label="Alkoholhalt">
            <AnimatedNumber value={5.2} suffix="%" />
          </StatCard>
          <StatCard icon="🧴" label="Volym">
            <AnimatedNumber value={500} suffix="ml" />
          </StatCard>
          <StatCard icon="🗓️" label="Började säljas">
            <AnimatedNumber value={2011} />
          </StatCard>
          <StatBar label="Beska" value={4} max={10} color="var(--gold)" />
          <StatBar label="Fyllighet" value={4} max={10} color="var(--gold)" />
          <StatBar label="Sötma" value={2} max={10} color="var(--gold)" />
        </div>
      );
    default:
      return null;
  }
}

/* ── Main component ── */

type ViewMode = "latest" | "timeline";

function getPreview(story: Story): string {
  const first = story.blocks.find((b) => b.type === "text");
  if (!first) return "";
  const text = first.value;
  if (text.length <= 120) return text;
  return text.slice(0, 120).replace(/\s+\S*$/, "") + "…";
}

export default function Olabladet() {
  const [mode, setMode] = useState<ViewMode>("latest");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

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
      <header className="olabladet-header">
        <h1 className="olabladet-title">Ölabladet</h1>
        <p className="olabladet-subtitle">
          Nyheter, rekord och minnesvärda ögonblick från Ölcupens historia
        </p>
      </header>

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
                      📅 {story.eventDate}
                    </span>
                    <span className="olabladet-publish-date">
                      Publicerad: {story.publishDate}
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
                  {story.blocks.map((block, i) =>
                    block.type === "text" ? (
                      <p key={i}>{block.value}</p>
                    ) : (
                      <div key={i}>{renderWidget(block.value)}</div>
                    ),
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
