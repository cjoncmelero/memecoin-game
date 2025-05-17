"use client";

import { useEffect, useState } from 'react';
import styles from './Background.module.css';

export default function Background() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      if (!window.particlesJS) {
        const script = document.createElement('script');
        script.src = '/particles.min.js';
        script.async = true;
        script.onload = () => {
          window.particlesJS && window.particlesJS.load('particles-js', '/particles.json');
        };
        document.body.appendChild(script);
      } else {
        window.particlesJS.load('particles-js', '/particles.json');
      }
    }
  }, []);

  if (!mounted) {
    return <div id="particles-js" className={styles.canvas}></div>;
  }

  return <div id="particles-js" className={styles.canvas}></div>;
} 