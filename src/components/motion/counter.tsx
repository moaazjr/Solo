"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
};

/** Counts up from zero the first time it enters the viewport. Screen readers get the final value. */
export function Counter({ value, prefix = "", suffix = "", duration = 1.6 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node) return;
    const render = (n: number) => {
      node.textContent = `${prefix}${Math.round(n)}${suffix}`;
    };
    if (reduceMotion) {
      render(value);
      return;
    }
    const controls = animate(0, value, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: render });
    return () => controls.stop();
  }, [inView, reduceMotion, value, prefix, suffix, duration]);

  return (
    <>
      <span className="sr-only">{`${prefix}${value}${suffix}`}</span>
      <span ref={ref} aria-hidden>
        {`${prefix}0${suffix}`}
      </span>
    </>
  );
}
