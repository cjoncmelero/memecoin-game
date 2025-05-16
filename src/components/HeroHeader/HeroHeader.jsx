"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import styles from './HeroHeader.module.css';
import Link from 'next/link';

const HeroHeader = () => {
  const headerRef = useRef(null);
  const welcomeRef = useRef(null);
  const leftMeRef = useRef(null);
  const rightMeRef = useRef(null);
  const gameRef = useRef(null);
  const gameTextRef = useRef(null);
  const bgColorRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);
  
  // Usamos useCallback para mejorar la performance de los event listeners
  const handleScroll = useCallback(() => {
    if (!headerRef.current) return;
    
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Usar requestAnimationFrame para reducir la carga durante el scroll
    requestAnimationFrame(() => {
      // Hacer que todo el header desaparezca gradualmente cuando se hace scroll a la sección de reglas
      const headerFadeoutProgress = Math.min(Math.max((scrollY - windowHeight * 1.5) / (windowHeight * 0.5), 0), 1);
      
      if (headerRef.current) {
        headerRef.current.style.opacity = 1 - headerFadeoutProgress;
        if (headerFadeoutProgress >= 1) {
          headerRef.current.style.pointerEvents = 'none';
        } else {
          headerRef.current.style.pointerEvents = 'auto';
        }
      }
      
      // Fase inicial: Bienvenido desaparece
      if (welcomeRef.current) {
        const welcomeProgress = Math.min(Math.max(scrollY / (windowHeight * 0.2), 0), 1);
        welcomeRef.current.style.opacity = 1 - welcomeProgress;
        welcomeRef.current.style.transform = `translateY(${welcomeProgress * -50}px)`;
      }
      
      if (leftMeRef.current && rightMeRef.current) {
        // Primera fase: Las letras ME aparecen y se mueven hacia el centro
        const appearProgress = Math.min(Math.max((scrollY - windowHeight * 0.2) / (windowHeight * 0.4), 0), 1);
        
        // Opacidad
        leftMeRef.current.style.opacity = appearProgress;
        rightMeRef.current.style.opacity = appearProgress;
        
        // Movimiento de los laterales hacia posición invertida
        const moveProgress = Math.min(Math.max((scrollY - windowHeight * 0.6) / (windowHeight * 0.3), 0), 1);
        
        // Obtenemos la posición inicial de los elementos (en píxeles desde los bordes)
        const computedLeftStyle = window.getComputedStyle(leftMeRef.current);
        const computedRightStyle = window.getComputedStyle(rightMeRef.current);
        
        // Calculamos la distancia que deben moverse para cambiar exactamente de posición
        // Cuando moveProgress = 1, leftMe tomará la posición de rightMe y viceversa
        const leftToRight = window.innerWidth - parseFloat(computedLeftStyle.left) - leftMeRef.current.offsetWidth - parseFloat(computedRightStyle.right);
        const rightToLeft = window.innerWidth - parseFloat(computedRightStyle.right) - rightMeRef.current.offsetWidth - parseFloat(computedLeftStyle.left);
        
        leftMeRef.current.style.transform = `translateX(${moveProgress * leftToRight}px)`;
        rightMeRef.current.style.transform = `translateX(${-moveProgress * rightToLeft}px)`;
        
        // Segunda fase: Cambio de color de fondo y aparición de "GAME"
        const colorChangeProgress = Math.min(Math.max((scrollY - windowHeight * 1.0) / (windowHeight * 0.2), 0), 1);
        
        if (bgColorRef.current) {
          // Cambiar color de fondo
          bgColorRef.current.style.opacity = colorChangeProgress;
        }
        
        if (gameRef.current) {
          // Hacer aparecer "GAME"
          gameRef.current.style.opacity = colorChangeProgress;
          gameRef.current.style.transform = `translateY(${(1 - colorChangeProgress) * 50}px)`;
          
          // Activar efecto Squid Game cuando la opacidad es mayor a 0.8
          if (colorChangeProgress > 0.8 && !gameActive) {
            setGameActive(true);
            
            // Después de 1.5 segundos (duración de la animación de temblor más suave), mostrar el título completo
            setTimeout(() => {
              setShowFullTitle(true);
            }, 1500);
          } else if (colorChangeProgress <= 0.8 && gameActive) {
            setGameActive(false);
            setShowFullTitle(false);
          }
          
          // Desvanecer "MEME" al aparecer "GAME"
          if (colorChangeProgress > 0.5) {
            leftMeRef.current.style.opacity = 2 - colorChangeProgress * 2;
            rightMeRef.current.style.opacity = 2 - colorChangeProgress * 2;
          }
        }
      }
    });
  }, [gameActive]);
  
  useEffect(() => {
    setMounted(true);
    
    // Cargar el script de partículas de forma optimizada
    if (typeof window !== 'undefined') {
      if (!window.particlesJS) {
        const script = document.createElement('script');
        script.src = '/particles.min.js';
        script.async = true;
        script.defer = true; // Agregar defer para mejorar el rendimiento de carga
        script.onload = () => {
          window.particlesJS && window.particlesJS.load('particles-js', '/particles.json');
        };
        document.body.appendChild(script);
      } else {
        window.particlesJS.load('particles-js', '/particles.json');
      }
    }
    
    // Throttling del evento de scroll para mejor rendimiento
    let scrollTimeout;
    const throttledScrollHandler = () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          handleScroll();
          scrollTimeout = null;
        }, 10); // Throttle a 10ms
      }
    };
    
    // Ejecutar una vez al cargar
    handleScroll();
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', throttledScrollHandler);
  }, [handleScroll]);
  
  return (
    <header ref={headerRef} className={styles.header}>
      <div id="particles-js" className={styles.particlesContainer}></div>
      <div className={styles.starsBackground}></div>
      <div ref={bgColorRef} className={styles.colorOverlay}></div>
      
      <div className={styles.socialButtons}>
        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
          <i className="fab fa-twitter"></i> TWITTER
        </a>
        <a href="https://telegram.org/" target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
          <i className="fab fa-telegram-plane"></i> TELEGRAM
        </a>
        <a href="https://dexscreener.com/" target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
          <i className="fas fa-chart-line"></i> DEX_SCREENER
        </a>
      </div>
      
      <div ref={welcomeRef} className={styles.welcomeContainer}>
        <div className={styles.welcomeText}>
          Bienvenido
        </div>
      </div>
      
      <div className={styles.memesContainer}>
        <div ref={leftMeRef} className={`${styles.meText} ${styles.leftMe}`}>
          ME
        </div>
        <div ref={rightMeRef} className={`${styles.meText} ${styles.rightMe}`}>
          ME
        </div>
      </div>
      
      <div ref={gameRef} className={`${styles.gameContainer} ${gameActive ? styles.gameTextActive : ''}`}>
        <div 
          ref={gameTextRef} 
          className={`${styles.gameText} ${showFullTitle ? styles.fullTitleText : ''}`} 
          data-text={showFullTitle ? "MEME GAME" : "GAME"}
        >
          {showFullTitle ? (
            <>
              <span className={styles.memeText}>MEME</span> GAME
            </>
          ) : "GAME"}
        </div>
      </div>
      
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollText}>Scroll para continuar</div>
        <div className={styles.scrollIcon}></div>
      </div>

      <Link href="/game" className={styles.startGameButton}>
        <div className={styles.startGameContainer}>
          <div className={styles.startGameText}>
            EMPIEZA HORA
            <span className={styles.startGameSubtext}>IR AL JUEGO</span>
          </div>
        </div>
      </Link>
    </header>
  );
};

export default HeroHeader;