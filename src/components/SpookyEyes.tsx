import { type CSSProperties, useEffect, useState } from "react";
import { Eyes, type EyeLayout, type EyeLayoutPresets } from "react-halloween";
import { useIsMobile } from "@/hooks/useIsMobile.ts";

/**
 * SpookyEyes — four sets of eyes that lurk in the side margins of the page
 * (dark mode, desktop only).
 *
 * This wraps the eyes component from react-halloween
 */

/** Width of the content column: md:max-w-4xl = 56rem = 896px */
const CONTENT_MAX_W = 896;
/** Width of one set of eyes */
const EYES_W = 90;
/** Margin must fit the eyes plus some breathing room on each side */
const MIN_MARGIN = EYES_W + 48;

/** localStorage key holding the JSON array of dismissed eye-set indexes */
const SLEEPING_EYES_KEY = "SPOOKY_EYES_SLEEPING";

function readDismissed(): number[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(SLEEPING_EYES_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === "number") : [];
  } catch {
    return [];
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

/** A 4th eye style ("weary") to go with the 3 built-in presets */
const wearyLayout: EyeLayout = {
  left: {
    opened: "M 0 4 C 3 6 7 6 10 4 C 7 2 3 2 0 4",
    closed: "M 0 4 C 3 4 7 4 10 4 C 7 4 3 4 0 4",
  },
  right: {
    opened: "M 0 4 C 3 6 7 6 10 4 C 7 2 3 2 0 4",
    closed: "M 0 4 C 3 4 7 4 10 4 C 7 4 3 4 0 4",
  },
  pupil: { cx: 5, cy: 4 },
};

interface EyeSetConfig {
  id: string;
  layout: EyeLayoutPresets | EyeLayout;
  irisColor: string;
  side: "left" | "right";
  top: string;
}

const EYE_SETS: EyeSetConfig[] = [
  { id: "unfriendly", layout: "unfriendly", irisColor: "#c43b3b", side: "left", top: "18vh" },
  { id: "menacing", layout: "menacing", irisColor: "#e08e2b", side: "left", top: "62vh" },
  { id: "neutral", layout: "neutral", irisColor: "#8a5fd4", side: "right", top: "30vh" },
  { id: "weary", layout: wearyLayout, irisColor: "#4faf5c", side: "right", top: "72vh" },
];

/** Horizontal center of the side margin, for one set of eyes */
function marginPosition(side: "left" | "right"): CSSProperties {
  const offset = `calc((100vw - ${CONTENT_MAX_W}px) / 4 - ${EYES_W / 2}px)`;
  return side === "left" ? { left: offset } : { right: offset };
}

function EyeSet({
  config,
  open,
  onDismiss,
}: {
  config: EyeSetConfig;
  open: boolean;
  onDismiss: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: config.top,
        ...marginPosition(config.side),
        padding: 12, // comfortable hover target around the eyes
        zIndex: 30,
      }}
      onMouseEnter={onDismiss}
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
  /** Render only when true (pass the app's dark-mode flag) */
  active: boolean;
  /** Increment to clear the persisted dismissals and re-open every set */
  wakeSignal?: number;
}

export function SpookyEyes({ active, wakeSignal = 0 }: SpookyEyesProps) {
  const hasRoom = useEyesHaveRoom();
  const [awake, setAwake] = useState(false);
  const [dismissed, setDismissed] = useState<number[]>(readDismissed);

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

  // The "Wake up" button was pressed: forget every dismissal and open all
  // the eyes, regardless of scroll position.
  useEffect(() => {
    if (!wakeSignal) return;
    try {
      localStorage.removeItem(SLEEPING_EYES_KEY);
    } catch {
      /* ignore */
    }
    setDismissed([]);
    setAwake(true);
  }, [wakeSignal]);

  const dismiss = (index: number) => {
    setDismissed((prev) => {
      if (prev.includes(index)) return prev;
      const next = [...prev, index];
      try {
        localStorage.setItem(SLEEPING_EYES_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  if (!active || !hasRoom) return null;

  return (
    <>
      {EYE_SETS.map((config, i) => (
        <EyeSet
          key={config.id}
          config={config}
          open={awake && !dismissed.includes(i)}
          onDismiss={() => dismiss(i)}
        />
      ))}
    </>
  );
}
