"use client";

import React from 'react';
import styles from './Decoration.module.css';

export default function SquarePattern({ position = "bottom-left" }) {
  return (
    <div className={`${styles.squarePatternContainer} ${styles[position]}`}>
      <div className={styles.squareGroup}>
        <div className={`${styles.square} ${styles.square1}`}></div>
        <div className={`${styles.square} ${styles.square2}`}></div>
        <div className={`${styles.square} ${styles.square3}`}></div>
      </div>
      
      <div className={styles.dotPattern}>
        {Array(16).fill(0).map((_, i) => (
          <div key={i} className={styles.dot} style={{
            animationDelay: `${(i * 0.1) % 2}s`,
            top: `${Math.floor(i / 4) * 30}px`,
            left: `${(i % 4) * 30}px`
          }}></div>
        ))}
      </div>
    </div>
  );
} 