import { type CSSProperties, useEffect, useState } from "react";
import { Eyes, type EyeLayout, type EyeLayoutPresets } from "react-halloween";
import { useIsMobile } from "@/hooks/useIsMobile.ts";

/**
 * This wraps the eyes component from react-halloween
 */

const CONTENT_MAX_W = 896;
const EYES_W = 90;
const MIN_MARGIN = EYES_W + 48;
const TOP_JITTER_VH = 7;
const EYES_H = EYES_W * 0.8;
const X_JITTER_FRACTION = 0.08;
const SLEEPING_EYES_KEY = "SPOOKY_EYES_SLEEPING";

export function readEyesAsleep(): boolean {
  try {
    return localStorage.getItem(SLEEPING_EYES_KEY) === "true";
  } catch {
    return false;
  }
}

export function writeEyesAsleep(asleep: boolean): void {
  try {
    localStorage.setItem(SLEEPING_EYES_KEY, String(asleep));
  } catch {
    /* ignore */
  }
}

/**
 * True when the page has room for the eyes: non-mobile viewport with side
 * margins wide enough to fit a set.
 */
export function useEyesHaveRoom(): boolean {
  const isMobile = useIsMobile();
  const [hasSpace, setHasSpace] = useState(false);

  useEffect(() => {
    const roomy = () => (window.innerWidth - CONTENT_MAX_W) / 2 >= MIN_MARGIN;
    setHasSpace(roomy());
    const onResize = () => setHasSpace(roomy());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return !isMobile && hasSpace;
}

/**
 * Custom eye styles
 */

const CLOSED = "M 0 4 C 3 4 7 4 10 4 C 7 4 3 4 0 4";

const wearyLayout: EyeLayout = {
  left: {
    opened: "M 0 4 C 3 6 7 6 10 4 C 7 2 3 2 0 4",
    closed: CLOSED,
  },
  right: {
    opened: "M 0 4 C 3 6 7 6 10 4 C 7 2 3 2 0 4",
    closed: CLOSED,
  },
  pupil: { cx: 5, cy: 4 },
};

const startledLayout: EyeLayout = {
  left: {
    opened: "M 0 4 C 2 7.5 8 7.5 10 4 C 8 0.5 2 0.5 0 4",
    closed: CLOSED,
  },
  right: {
    opened: "M 0 4 C 2 7.5 8 7.5 10 4 C 8 0.5 2 0.5 0 4",
    closed: CLOSED,
  },
  pupil: { cx: 5, cy: 4 },
};

const slyLayout: EyeLayout = {
  left: {
    opened: "M 0 4 C 3 6.5 7 6.5 10 4 C 8 2.7 2 2.7 0 4",
    closed: CLOSED,
  },
  right: {
    opened: "M 0 4 C 3 6.5 7 6.5 10 4 C 8 2.7 2 2.7 0 4",
    closed: CLOSED,
  },
  pupil: { cx: 5, cy: 4.5 },
};

const crazedLayout: EyeLayout = {
  left: {
    opened: "M 0 4 C 2 7.6 8 7.6 10 4 C 8 0.4 2 0.4 0 4",
    closed: CLOSED,
  },
  right: {
    opened: "M 0 4 C 3 5.5 7 5.5 10 4 C 7 2.5 3 2.5 0 4",
    closed: CLOSED,
  },
  pupil: { cx: 5, cy: 4 },
};

const sorrowfulLayout: EyeLayout = {
  left: {
    opened: "M 0 4 C 3 6.5 6 7 10 4 C 6 1.5 3 3 0 4",
    closed: CLOSED,
  },
  right: {
    opened: "M 0 4 C 4 7 7 6.5 10 4 C 7 3 4 1.5 0 4",
    closed: CLOSED,
  },
  pupil: { cx: 5, cy: 4 },
};

const squintingLayout: EyeLayout = {
  left: {
    opened: "M 0 4 C 3 5.2 7 5.2 10 4 C 7 2.8 3 2.8 0 4",
    closed: CLOSED,
  },
  right: {
    opened: "M 0 4 C 3 5.2 7 5.2 10 4 C 7 2.8 3 2.8 0 4",
    closed: CLOSED,
  },
  pupil: { cx: 5, cy: 4 },
};

const furiousLayout: EyeLayout = {
  left: {
    opened: "M 0 4 C 3 6.8 6 7 10 4 C 6 3.5 2 1 0 4",
    closed: CLOSED,
  },
  right: {
    opened: "M 0 4 C 4 7 7 6.8 10 4 C 8 1 4 3.5 0 4",
    closed: CLOSED,
  },
  pupil: { cx: 5, cy: 4.5 },
};

interface EyeSetConfig {
  id: string;
  layout: EyeLayoutPresets | EyeLayout;
  irisColor: string;
  side: "left" | "right";
  topVh: number; // base position
}

const EYE_SETS: EyeSetConfig[] = [
  { id: "unfriendly", layout: "unfriendly", irisColor: "#c43b3b", side: "left", topVh: 10 },
  { id: "startled", layout: startledLayout, irisColor: "#4f9fd4", side: "left", topVh: 28 },
  { id: "menacing", layout: "menacing", irisColor: "#e08e2b", side: "left", topVh: 46 },
  { id: "sly", layout: slyLayout, irisColor: "#c94fd0", side: "left", topVh: 64 },
  { id: "squinting", layout: squintingLayout, irisColor: "#d47f4f", side: "left", topVh: 82 },
  { id: "neutral", layout: "neutral", irisColor: "#8a5fd4", side: "right", topVh: 14 },
  { id: "crazed", layout: crazedLayout, irisColor: "#d4c23f", side: "right", topVh: 32 },
  { id: "weary", layout: wearyLayout, irisColor: "#4faf5c", side: "right", topVh: 50 },
  { id: "sorrowful", layout: sorrowfulLayout, irisColor: "#3fb8a8", side: "right", topVh: 68 },
  { id: "furious", layout: furiousLayout, irisColor: "#e04f6a", side: "right", topVh: 86 },
];

function marginPosition(side: "left" | "right", xFraction: number): CSSProperties {
  const offset = `calc((100vw - ${CONTENT_MAX_W}px) * ${0.25 + xFraction} - ${EYES_W / 2}px)`;
  return side === "left" ? { left: offset } : { right: offset };
}

function EyeSet({
  config,
  topOffsetVh,
  xOffsetFraction,
  open,
}: {
  config: EyeSetConfig;
  topOffsetVh: number;
  xOffsetFraction: number;
  open: boolean;
}) {
  return (
    <div
      style={{
        position: "fixed",
        // min() keeps the lowest pairs fully on-screen on short windows
        top: `min(${config.topVh + topOffsetVh}vh, calc(100vh - ${EYES_H + 12}px))`,
        ...marginPosition(config.side, xOffsetFraction),
        zIndex: 30,
        pointerEvents: "none",
      }}
    >
      <Eyes
        open={open}
        eyeLayout={config.layout}
        width={EYES_W}
        irisColor={config.irisColor}
        animationTime={0.5}
      />
    </div>
  );
}

interface SpookyEyesProps {
  active: boolean;
  asleep: boolean;
}

export function SpookyEyes({ active, asleep }: SpookyEyesProps) {
  const hasRoom = useEyesHaveRoom();
  const [awake, setAwake] = useState(false);

  const [offsets] = useState(() =>
    EYE_SETS.map(() => ({
      topVh: (Math.random() - 0.5) * TOP_JITTER_VH,
      xFraction: (Math.random() - 0.5) * 2 * X_JITTER_FRACTION,
    })),
  );

  useEffect(() => {
    const onScroll = () => setAwake(window.scrollY > 0);
    const onResize = () => setAwake(false);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (!active || !hasRoom) return null;

  return (
    <>
      {EYE_SETS.map((config, i) => (
        <EyeSet
          key={config.id}
          config={config}
          topOffsetVh={offsets[i].topVh}
          xOffsetFraction={offsets[i].xFraction}
          open={awake && !asleep}
        />
      ))}
    </>
  );
}
