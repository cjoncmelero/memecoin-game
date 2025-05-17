"use client";

import { useEffect, useRef } from 'react';
import styles from './FloatingLogo.module.css';

export default function FloatingLogo() {
  const logoRef = useRef(null);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!logoRef.current) return;
      
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const moveX = (clientX - centerX) / 25;
      const moveY = (clientY - centerY) / 25;
      
      logoRef.current.style.transform = `translate(${moveX}px, ${moveY}px) rotateY(${moveX * 0.5}deg) rotateX(${-moveY * 0.5}deg)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div className={styles.logoContainer}>
      <div ref={logoRef} className={styles.logo}>
        <div className={styles.circleBorder}>
          <div className={styles.innerCircle}>
            <div className={styles.squidGameSymbol}>
              <div className={styles.triangle}></div>
              <div className={styles.circle}></div>
              <div className={styles.square}></div>
            </div>
            <div className={styles.logoText}>MG</div>
          </div>
        </div>
        <div className={styles.glowEffect}></div>
      </div>
    </div>
  );
} 