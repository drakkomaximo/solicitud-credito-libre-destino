'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.4,
  className = '',
  direction = 'up',
}: FadeInProps) {
  const offset = {
    up: { y: 16 },
    down: { y: -16 },
    left: { x: 16 },
    right: { x: -16 },
    none: {},
  }[direction];

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
