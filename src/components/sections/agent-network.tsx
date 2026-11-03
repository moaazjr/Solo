"use client";

import { motion, useReducedMotion } from "framer-motion";

const C = 260;
const R = 182;

const nodes = [
  { label: "Engineering", sub: "ECC", angle: -90 },
  { label: "Code Review", sub: "ECC", angle: -30 },
  { label: "Security", sub: "ECC", angle: 30 },
  { label: "Sales", sub: "Harvey", angle: 90 },
  { label: "Research", sub: "ECC", angle: 150 },
  { label: "Next hire", sub: "Open", angle: 210, open: true },
].map((n) => {
  const rad = (n.angle * Math.PI) / 180;
  return { ...n, x: C + R * Math.cos(rad), y: C + R * Math.sin(rad) };
});

/**
 * The company's signature visual: one human at the centre, AI agents around them.
 * Purely decorative. The same information is stated in text on the page.
 */
export function AgentNetwork({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg viewBox="0 0 520 520" className={className} aria-hidden role="presentation">
      <defs>
        <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7a2e3b" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#7a2e3b" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx={C} cy={C} r={150} fill="url(#core-glow)" />

      {/* Orbits */}
      <motion.g
        style={{ originX: "260px", originY: "260px" }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <circle cx={C} cy={C} r={R} fill="none" stroke="#0e0d0c" strokeOpacity="0.12" strokeDasharray="2 6" />
        <circle cx={C + R} cy={C} r={2.5} fill="#7a2e3b" />
      </motion.g>
      <circle cx={C} cy={C} r={R * 0.55} fill="none" stroke="#0e0d0c" strokeOpacity="0.08" />
      <circle cx={C} cy={C} r={R * 1.32} fill="none" stroke="#0e0d0c" strokeOpacity="0.05" />

      {/* Connections */}
      {nodes.map((n, i) => (
        <g key={n.label}>
          <motion.line
            x1={C}
            y1={C}
            x2={n.x}
            y2={n.y}
            stroke="#0e0d0c"
            strokeOpacity={n.open ? 0.12 : 0.22}
            strokeDasharray={n.open ? "3 5" : undefined}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, delay: 0.5 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          />
          {!n.open && !reduce && (
            <motion.circle
              r={2.5}
              fill="#7a2e3b"
              initial={{ cx: C, cy: C, opacity: 0 }}
              animate={{ cx: [C, n.x], cy: [C, n.y], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.4, delay: 1.8 + i * 0.55, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }}
            />
          )}
        </g>
      ))}

      {/* Agent nodes */}
      {nodes.map((n, i) => (
        <motion.g
          key={`node-${n.label}`}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.9 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: `${n.x}px`, originY: `${n.y}px` }}
        >
          <rect
            x={n.x - 54}
            y={n.y - 22}
            width={108}
            height={44}
            rx={4}
            fill={n.open ? "transparent" : "#fffdf9"}
            stroke="#0e0d0c"
            strokeOpacity={n.open ? 0.25 : 0.12}
            strokeDasharray={n.open ? "3 4" : undefined}
          />
          <text x={n.x} y={n.y - 3} textAnchor="middle" fontSize="12.5" fill="#0e0d0c" fontFamily="var(--font-geist-sans)" fontWeight={500}>
            {n.label}
          </text>
          <text x={n.x} y={n.y + 12} textAnchor="middle" fontSize="8.5" letterSpacing="1.4" fill={n.open ? "#6b645c" : "#7a2e3b"} fontFamily="var(--font-geist-mono)">
            {n.sub.toUpperCase()}
          </text>
        </motion.g>
      ))}

      {/* Human core */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: "260px", originY: "260px" }}
      >
        {!reduce && (
          <motion.circle
            cx={C}
            cy={C}
            r={52}
            fill="none"
            stroke="#7a2e3b"
            strokeOpacity={0.4}
            animate={{ r: [52, 72], opacity: [0.6, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <circle cx={C} cy={C} r={52} fill="#0e0d0c" />
        <text x={C} y={C - 2} textAnchor="middle" fontSize="20" fill="#f7f4ef" fontFamily="var(--font-instrument-serif)">
          Founder
        </text>
        <text x={C} y={C + 15} textAnchor="middle" fontSize="8" letterSpacing="1.6" fill="#e3a9b4" fontFamily="var(--font-geist-mono)">
          HUMAN
        </text>
      </motion.g>
    </svg>
  );
}
