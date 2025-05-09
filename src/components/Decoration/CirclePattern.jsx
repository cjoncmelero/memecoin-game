"use client";

import React from 'react';
import styles from './Decoration.module.css';

export default function CirclePattern({ position = "top-right" }) {
  return (
    <div className={`${styles.circlePatternContainer} ${styles[position]}`}>
      <div className={styles.circlePattern}>
        <div className={`${styles.circle} ${styles.circle1}`}></div>
        <div className={`${styles.circle} ${styles.circle2}`}></div>
        <div className={`${styles.circle} ${styles.circle3}`}></div>
        <div className={`${styles.circle} ${styles.circle4}`}></div>
      </div>
      
      <div className={styles.symbols}>
        <div className={styles.triangle}></div>
        <div className={styles.square}></div>
        <div className={styles.circle}></div>
      </div>
    </div>
  );
} 