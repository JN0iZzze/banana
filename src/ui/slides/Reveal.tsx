import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';
import type { RevealPreset } from '../../presentation/types';
import { cn } from './cn';

interface RevealProps extends PropsWithChildren {
  preset?: RevealPreset;
  delay?: number;
  className?: string;
}

const revealStates: Record<RevealPreset, { initial: Record<string, number>; animate: Record<string, number> }> = {
  hero: {
    initial: { opacity: 0, y: 42, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  soft: {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
  },
  /** No translation — scale + opacity only (e.g. media galleries). */
  'scale-in': {
    initial: { opacity: 0, scale: 0.94 },
    animate: { opacity: 1, scale: 1 },
  },
  'enter-up': {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
  },
  'enter-left': {
    initial: { opacity: 0, x: 28 },
    animate: { opacity: 1, x: 0 },
  },
  'enter-right': {
    initial: { opacity: 0, x: -28 },
    animate: { opacity: 1, x: 0 },
  },
  none: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
  },
};

export function Reveal({ children, preset = 'enter-up', delay = 0, className }: RevealProps) {
  const state = revealStates[preset];

  return (
    <motion.div
      initial={state.initial}
      animate={state.animate}
      transition={{
        duration: 0.72,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

