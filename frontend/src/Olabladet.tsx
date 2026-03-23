import { useState, useEffect, useRef, type ReactNode } from "react";

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
  {
    headline: "Rekordseger i finalen — 7-1 krossade allt motstånd",
    publishDate: "Juni 2024",
    eventDate: "Sommaren 2023",
    eventSort: 20230601,
    publishSort: 20240601,
    blocks: [
      {
        type: "text",
        value:
          "I 2023 års final såg vi något som aldrig hänt förut i Ölcupens historia. Laget Löa Legends körde över motståndarna med hela 7-1 i en match som hade allt: drömträffar, tavlor i ribban och en målvakt som hellre drack öl än räddade skott.",
      },
      { type: "bars", value: "final-2023" },
      {
        type: "text",
        value:
          "Redan efter tre minuter stod det 3-0, och resten av matchen var ren uppvisning. Segrarna belönades med 15 OPÖL — som försvann snabbare än målskillnaden antyder.",
      },
    ],
  },
  {
    headline: "Ölcupen grundades i en husvagn",
    publishDate: "Januari 2026",
    eventDate: "Sommaren 2016",
    eventSort: 20160601,
    publishSort: 20260102,
    blocks: [
      {
        type: "text",
        value:
          "Allt började med en diskussion kring en grill och en husvagn i Löa, sommaren 2016. Fyra kompisar bestämde sig för att arrangera en fotbollsturnering med en twist — förlorarna bjuder vinnarna på öl. Konceptet var så enkelt att det inte kunde misslyckas.",
      },
      { type: "stats", value: "founding" },
      {
        type: "text",
        value:
          "Första året deltog bara fyra lag, spelplatsen var en lerig äng bakom ladugården, och det fanns exakt en boll — som dessutom sprack under semifinalen. Men ingen brydde sig. Stämningen var magisk. Alla grillade, alla skrattade, och alla lovade att komma tillbaka nästa år.",
      },
      {
        type: "text",
        value:
          "Och det gjorde de. År två hade deltagarantalet dubblats. År tre kom det folk som ingen hade bjudit in — de hade bara hört ryktet. Husvagnen, som från början bara var parkerad i vägen, blev en samlingspunkt och sedan en symbol. Den finns kvar på loggan som en påminnelse om var allt började.",
      },
      {
        type: "text",
        value:
          "Idag, tio år senare, är Ölcupen en fast tradition. Reglerna har blivit fler, lagen har blivit bättre (marginellt), och ölinsatserna har växt. Men känslan är densamma: en sommardag med kompisar, fotboll, och en kyld öl i handen.",
      },
    ],
  },
  {
    headline: "Målvakten som räddade allt — utom sin värdighet",
    publishDate: "Mars 2026",
    eventDate: "Sommaren 2021",
    eventSort: 20210601,
    publishSort: 20260303,
    blocks: [
      {
        type: "text",
        value:
          "Under gruppspelet 2021 gjorde en anonym målvakt sju strålande räddningar i en och samma match. Laget vann 1-0 och supportrarna firade som om det var en VM-final. Problemet? I nästa match gled samme målvakt på en korv och missade hela andra halvlek.",
      },
      { type: "stats", value: "goalkeeper-2021" },
    ],
  },
];

/* ── Widget renderers ── */

function renderWidget(key: string): ReactNode {
  switch (key) {
    case "final-2023":
      return (
        <div className="olabladet-widget">
          <h3 className="olabladet-widget-title">
            Matchstatistik — Finalen 2023
          </h3>
          <StatBar label="Löa Legends" value={7} max={8} color="var(--gold)" />
          <StatBar
            label="Motståndarna"
            value={1}
            max={8}
            color="var(--white-50)"
          />
          <div className="olabladet-stat-cards">
            <StatCard icon="⚽" label="Totalt mål">
              <AnimatedNumber value={8} />
            </StatCard>
            <StatCard icon="⏱️" label="Minuter">
              <AnimatedNumber value={12} />
            </StatCard>
            <StatCard icon="🍺" label="OPÖL till vinnarna">
              <AnimatedNumber value={15} />
            </StatCard>
          </div>
        </div>
      );
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
    case "founding":
      return (
        <div className="olabladet-widget">
          <h3 className="olabladet-widget-title">Ölcupen i siffror</h3>
          <div className="olabladet-stat-cards">
            <StatCard icon="📅" label="År sedan starten">
              <AnimatedNumber value={10} suffix="+" />
            </StatCard>
            <StatCard icon="👕" label="Lag, första året">
              <AnimatedNumber value={4} />
            </StatCard>
            <StatCard icon="🍺" label="OPÖL utdelade totalt">
              <AnimatedNumber value={247} />
            </StatCard>
            <StatCard icon="🏆" label="Turneringar">
              <AnimatedNumber value={9} />
            </StatCard>
          </div>
        </div>
      );
    case "goalkeeper-2021":
      return (
        <div className="olabladet-widget">
          <div className="olabladet-stat-cards">
            <StatCard icon="🧤" label="Räddningar">
              <AnimatedNumber value={7} />
            </StatCard>
            <StatCard icon="🥅" label="Insläppta mål">
              <AnimatedNumber value={0} />
            </StatCard>
            <StatCard icon="🌭" label="Korvar halkade på">
              <AnimatedNumber value={1} />
            </StatCard>
          </div>
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
