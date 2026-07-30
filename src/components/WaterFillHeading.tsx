import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

/**
 * WaterFillHeading - heading text that fills up like water being poured
 * into a cup, then settles into solid text.
 *
 * How it works:
 *  - The text is a <clipPath>, so the water is only visible inside the
 *    letterforms.
 *  - A single water body sits inside the clip. Its top edge is a periodic
 *    wave (quadratic béziers) extended far below so it reads as a solid
 *    body of water with a wavy surface.
 *  - Animations are SMIL (<animateTransform>) rather than CSS, because
 *    WebKit/Safari does not reliably repaint CSS-animated content inside
 *    SVG clips — SMIL animates in the SVG rendering tree itself.
 *  - Two motions run at once:
 *      1. The water group rises (the pour). It stops (fill="freeze") with
 *         the surface ABOVE the top of the text, so the letters are
 *         completely filled and no wavy surface remains visible.
 *      2. The wave slides horizontally by exactly one wavelength on an
 *         infinite loop; since the path is periodic, the loop is seamless.
 *
 * Sizing / font: the component sets NO font properties on the SVG <text>.
 * font-family, font-size, font-weight and letter-spacing all inherit from
 * the surrounding element (e.g. the <h1>), so the rendered text matches
 * the page exactly, including responsive font-size breakpoints. The SVG
 * is then sized to the measured glyph bounding box at a 1:1 user-unit /
 * pixel ratio, so the letters render at their true size. The fill color is
 * currentColor, so it also matches the surrounding text color.
 *
 * Note: SMIL clock times are measured from the SVG document timeline, NOT
 * from component mount, so the pour uses begin="indefinite" and is kicked
 * off imperatively with beginElementAt(), this also replays it whenever
 * the measured box changes (e.g. crossing a font-size breakpoint).
 */

interface WaterFillHeadingProps {
  text?: string;
  /** Seconds for the fill to complete */
  fillDuration?: number;
  /** Delay before pouring starts, in seconds */
  fillDelay?: number;
  className?: string;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize: number;
}

/**
 * Builds a periodic wave: a wavy top edge (surface at local y=0) spanning
 * [startX, endX], closed into a deep rectangle below. Period = waveLength,
 * so translating by -waveLength loops seamlessly.
 */
function wavePath(startX: number, endX: number, waveLength: number, amp: number, depth: number): string {
  const half = waveLength / 2;
  const quarter = waveLength / 4;
  let d = `M ${startX} 0`;
  for (let x = startX; x < endX; x += waveLength) {
    d += ` Q ${x + quarter} ${-amp} ${x + half} 0`;
    d += ` Q ${x + half + quarter} ${amp} ${x + waveLength} 0`;
  }
  d += ` L ${endX} ${depth} L ${startX} ${depth} Z`;
  return d;
}

export default function WaterFillHeading({
  text = "patorjk.com",
  fillDuration = 3.2,
  fillDelay = 0.3,
  className,
}: WaterFillHeadingProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const clipId = `waterfill-clip-${uid}`;
  const measureRef = useRef<SVGTextElement | null>(null);
  const pourRef = useRef<SVGAnimateTransformElement | null>(null);
  const [box, setBox] = useState<Box | null>(null);

  // Measure the glyph bounding box (and the inherited font size) so the SVG
  // can size itself 1:1 to the real text. Re-measures on resize; setBox only
  // updates when the box actually changes (font-size only changes at
  // breakpoints), which keeps the pour from replaying on every resize tick.
  useLayoutEffect(() => {
    const measure = () => {
      const el = measureRef.current;
      if (!el) return;
      const bb = el.getBBox();
      const fontSize = parseFloat(getComputedStyle(el).fontSize) || bb.height;
      setBox((prev) => {
        const next: Box = { x: bb.x, y: bb.y, w: bb.width, h: bb.height, fontSize };
        if (
          prev &&
          Math.abs(prev.x - next.x) < 0.5 &&
          Math.abs(prev.y - next.y) < 0.5 &&
          Math.abs(prev.w - next.w) < 0.5 &&
          Math.abs(prev.h - next.h) < 0.5
        ) {
          return prev;
        }
        return next;
      });
    };

    measure();
    window.addEventListener("resize", measure);
    // Re-measure once web fonts have loaded (no-op for system fonts).
    document.fonts?.ready.then(measure).catch((err) => {
      console.error('something is not right', err);
    });
    return () => window.removeEventListener("resize", measure);
  }, [text]);

  const geom = useMemo(() => {
    if (!box) return null;
    const P = 2; // small padding so strokes/antialiasing aren't clipped
    const vbX = box.x - P;
    const vbY = box.y - P;
    const vbW = box.w + 2 * P;
    const vbH = box.h + 2 * P;

    const amp = box.fontSize * 0.14;
    const waveLength = box.fontSize * 2.6;

    const textTop = box.y;
    const textBottom = box.y + box.h;

    // Water surface y-positions (surface is at local y=0 within the group).
    const emptySurface = textBottom + amp + 2; // below the text: no water
    const filledSurface = textTop - amp - 2; // above the text: fully filled
    const depth = box.h + amp * 2 + 40;

    const wave = wavePath(vbX - waveLength, vbX + vbW + waveLength, waveLength, amp, depth);

    return { vbX, vbY, vbW, vbH, waveLength, emptySurface, filledSurface, wave };
  }, [box]);

  // Kick off / replay the pour relative to MOUNT (or box change), not the
  // SVG document timeline.
  useEffect(() => {
    if (!geom) return;
    pourRef.current?.beginElementAt(fillDelay);
  }, [geom, fillDelay]);

  return (
    <svg
      className={className}
      style={{ display: "block", overflow: "visible", visibility: geom ? "visible" : "hidden" }}
      width={geom ? geom.vbW : undefined}
      height={geom ? geom.vbH : undefined}
      viewBox={geom ? `${geom.vbX} ${geom.vbY} ${geom.vbW} ${geom.vbH}` : undefined}
      role="img"
      aria-label={text}
    >
      <defs>
        <clipPath id={clipId}>
          <text ref={measureRef} x={0} y={0}>
            {text}
          </text>
        </clipPath>
      </defs>

      {/* The water, visible only inside the letterforms */}
      {geom && (
        <g clipPath={`url(#${clipId})`}>
          <g transform={`translate(0 ${geom.emptySurface})`}>
            {/* The pour: rise from below the text to above the caps */}
            <animateTransform
              ref={pourRef}
              attributeName="transform"
              type="translate"
              values={`0 ${geom.emptySurface}; 0 ${geom.filledSurface}`}
              keyTimes="0; 1"
              calcMode="spline"
              keySplines="0.33 0.9 0.45 1"
              begin="indefinite"
              dur={`${fillDuration}s`}
              fill="freeze"
            />

            {/* The single wave surface */}
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values={`0 0; ${-geom.waveLength} 0`}
                dur="2.6s"
                repeatCount="indefinite"
              />
              <path d={geom.wave} fill="currentColor" />
            </g>
          </g>
        </g>
      )}
    </svg>
  );
}
