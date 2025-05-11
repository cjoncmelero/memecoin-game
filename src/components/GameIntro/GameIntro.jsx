"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import Lenis from '@studio-freight/lenis';
import styles from './GameIntro.module.css';
import Link from 'next/link';

const GameIntro = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const ctaRef = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [lenisInstance, setLenisInstance] = useState(null);
  
  // Inicializar Lenis para scroll suave
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    setLenisInstance(lenis);

    return () => {
      lenis.destroy();
    };
  }, []);
  
  // Manejar las animaciones basadas en scroll
  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return;
    
    const scrollY = window.scrollY;
    const sectionTop = sectionRef.current.offsetTop;
    const sectionHeight = sectionRef.current.offsetHeight;
    const progress = Math.min(Math.max((scrollY - sectionTop + window.innerHeight * 0.5) / (sectionHeight * 0.7), 0), 1);
    setScrollProgress(progress);
    
    // Aplicar efectos basados en el progreso del scroll con paralaje
    if (textRef.current) {
      textRef.current.style.transform = `translateY(${-progress * 80}px) scale(${1 - progress * 0.05})`;
    }
    
    if (ctaRef.current) {
      ctaRef.current.style.transform = `translateY(${-progress * 120}px) scale(${1 - progress * 0.1})`;
    }
    
    if (imageRef.current) {
      // Efecto paralaje más pronunciado para la imagen
      imageRef.current.style.transform = `translateY(${progress * 50}px) perspective(1000px) rotateX(${progress * 5}deg) scale(${1 - progress * 0.15})`;
    }
    
    // Determinar si la sección es visible para activar animaciones
    const rect = sectionRef.current.getBoundingClientRect();
    const isInView = (
      rect.top <= window.innerHeight * 0.75 &&
      rect.bottom >= window.innerHeight * 0.25
    );
    
    if (isInView && !isVisible) {
      setIsVisible(true);
    } else if (!isInView && isVisible) {
      setIsVisible(false);
    }
  }, [isVisible]);

  // Conectar el manejador de scroll a Lenis
  useEffect(() => {
    if (!lenisInstance) return;
    
    const onScroll = (e) => {
      handleScroll();
    };

    lenisInstance.on('scroll', onScroll);
    
    // Ejecutar una vez al inicio para establecer posiciones iniciales
    setTimeout(() => {
      handleScroll();
    }, 100);
    
    return () => {
      lenisInstance.off('scroll', onScroll);
    };
  }, [lenisInstance, handleScroll]);
  
  // Animación de caracteres del título 
  useEffect(() => {
    if (!isVisible || !titleRef.current) return;
    
    const title = titleRef.current;
    const titleText = title.textContent;
    title.textContent = '';
    title.classList.add(styles.titleVisible);
    
    // Crear un span para cada carácter y animarlo
    [...titleText].forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.className = styles.titleChar;
      
      title.appendChild(span);
      
      // Animar cada carácter con un retraso proporcional a su posición
      setTimeout(() => {
        span.classList.add(styles.titleCharVisible);
      }, 100 + index * 50);
    });
    
    // Añadir efecto de brillo después de que aparezcan todos los caracteres
    setTimeout(() => {
      title.classList.add(styles.titleGlowing);
    }, 100 + titleText.length * 50 + 500);
    
  }, [isVisible]);
  
  // Manejar el clic en el botón de jugar
  const handlePlayClick = () => {
    const rulesSection = document.querySelector('#game-rules');
    if (rulesSection && lenisInstance) {
      lenisInstance.scrollTo(rulesSection, {
        offset: 0,
        duration: 1.5,
      });
    }
  };
  
  // Crear un efecto con la imagen
  useEffect(() => {
    // Efecto de resplandor para la imagen
    const interval = setInterval(() => {
      if (imageRef.current && isVisible) {
        imageRef.current.classList.add(styles.imagePulse);
        setTimeout(() => {
          if (imageRef.current) {
            imageRef.current.classList.remove(styles.imagePulse);
          }
        }, 1500);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isVisible]);
  
  return (
    <section ref={sectionRef} className={`${styles.introSection} ${isVisible ? styles.sectionVisible : ''}`} data-lenis-scroll-snap-align="start">
      <div className={styles.content}>
        <div className={styles.textContent} ref={textRef}>
          <div className={styles.headerShape}></div>
          <h2 className={styles.title} ref={titleRef}>THE GAME <br/> IS ABOUT <br/> TO BEGIN</h2>
          <p className={`${styles.description} ${isVisible ? styles.descriptionVisible : ''}`}>
            Prepárate para entrar en el mundo de los memes y la supervivencia, donde 
            solo los más estratégicos sobrevivirán y ganarán grandes recompensas.
          </p>
          
          <div className={styles.stats}>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>456</span>
              <span className={styles.statLabel}>Jugadores</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>45.6B</span>
              <span className={styles.statLabel}>Pool de premios</span>
            </div>
          </div>
        </div>
        
        <div className={styles.imageContainer} ref={imageRef}>
          <div className={styles.imageWrapper}>
            <div className={`${styles.mainImageContainer} ${isVisible ? styles.mainImageVisible : ''}`}>
              <div className={styles.glowEffect}></div>
              <div className={styles.cornerShape1}></div>
              <div className={styles.cornerShape2}></div>
              <div className={styles.cornerShape3}></div>
              <div className={styles.cornerShape4}></div>
            </div>
          </div>
        </div>
        
        <div className={styles.ctaContainer} ref={ctaRef}>
          <p className={`${styles.ctaText} ${isVisible ? styles.ctaTextVisible : ''}`}>
            ¿Estás preparado para formar parte del juego?
          </p>
          
          <div className={styles.buttonGroup}>
            <button 
              className={`${styles.playButton} ${isVisible ? styles.playButtonVisible : ''}`} 
              onClick={handlePlayClick}
            >
              <span>DESCUBRIR REGLAS</span>
              <div className={styles.buttonGlow}></div>
            </button>
            
            <Link href="/game" className={`${styles.gameButton} ${isVisible ? styles.gameButtonVisible : ''}`}>
              <span>JUGAR AHORA</span>
              <div className={styles.buttonArrow}></div>
            </Link>
          </div>
          
          <div className={styles.scrollIndicator}>
            <p>SCROLL PARA DESCUBRIR MÁS</p>
            <div className={styles.scrollArrow}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameIntro; 