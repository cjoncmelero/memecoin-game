"use client";

import { useEffect } from 'react';
import styles from './Background.module.css';

export default function Background() {
  useEffect(() => {
    // Cargar el script solo si no está ya cargado
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
  }, []);

  return <div id="particles-js" className={styles.canvas}></div>;
} 