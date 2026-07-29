"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export default function Reveal({
  children,
  as = "div",
  className = "",
  delay = 0,
}) {
  const Tag = motion[as] || motion.div;

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.9, delay: delay * 0.12, ease: EASE }}
    >
      {children}
    </Tag>
  );
}
