"use client";

import { useEffect, useRef } from 'react';
import styles from './SquidGameParallax.module.css';

export default function SquidGameParallax() {
  const circleRef = useRef(null);
  const triangleRef = useRef(null);
  const squareRef = useRef(null);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      if (circleRef.current) {
        circleRef.current.style.transform = `translateY(${scrollPosition * 0.2}px) rotate(${scrollPosition * 0.05}deg)`;
      }
      
      if (triangleRef.current) {
        triangleRef.current.style.transform = `translateY(${scrollPosition * -0.1}px) rotate(${scrollPosition * -0.03}deg)`;
      }
      
      if (squareRef.current) {
        squareRef.current.style.transform = `translateY(${scrollPosition * 0.15}px) rotate(${scrollPosition * 0.02}deg)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className={styles.parallaxContainer}>
      <div ref={circleRef} className={`${styles.shape} ${styles.circle}`}></div>
      <div ref={triangleRef} className={`${styles.shape} ${styles.triangle}`}></div>
      <div ref={squareRef} className={`${styles.shape} ${styles.square}`}></div>
    </div>
  );
} 