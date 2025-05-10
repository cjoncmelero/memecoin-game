"use client";

import { useRef, useEffect, useState } from 'react';
import styles from './GameIntro.module.css';

const GameIntro = () => {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const ctaRef = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Usar la instancia global de Lenis para efectos de scroll
  useEffect(() => {
    // Función para animar elementos basados en el scroll
    const onScroll = (e) => {
      if (!sectionRef.current) return;
      
      const scrollY = window.scrollY;
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      // Calcular el progreso del scroll en esta sección (0 a 1)
      const progress = Math.min(Math.max((scrollY - sectionTop) / (sectionHeight * 0.7), 0), 1);
      setScrollProgress(progress);
      
      // Aplicar efectos basados en el progreso del scroll con paralaje
      if (textRef.current) {
        textRef.current.style.transform = `translateY(${-progress * 80}px) scale(${1 - progress * 0.05})`;
        textRef.current.style.opacity = 1 - progress * 0.7;
      }
      
      if (ctaRef.current) {
        ctaRef.current.style.transform = `translateY(${-progress * 120}px) scale(${1 - progress * 0.1})`;
        ctaRef.current.style.opacity = 1 - progress * 0.9;
      }
      
      if (imageRef.current) {
        // Efecto paralaje más pronunciado para la imagen
        imageRef.current.style.transform = `translateY(${progress * 50}px) perspective(1000px) rotateX(${progress * 5}deg) scale(${1 - progress * 0.15})`;
        imageRef.current.style.opacity = 1 - progress * 0.8;
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
    };

    // Si Lenis está disponible globalmente, usar su evento de scroll
    if (window.lenis) {
      window.lenis.on('scroll', onScroll);
    } else {
      // Fallback a scroll nativo si Lenis no está disponible
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    
    // Ejecutar una vez al inicio para establecer posiciones iniciales
    setTimeout(() => {
      onScroll();
      setIsVisible(true); // Forzar visibilidad inicial
    }, 100);
    
    return () => {
      if (window.lenis) {
        window.lenis.off('scroll', onScroll);
      } else {
        window.removeEventListener('scroll', onScroll);
      }
    };
  }, [isVisible]);
  
  // Efecto para animar el título con una máquina de escribir
  useEffect(() => {
    if (isVisible && titleRef.current) {
      titleRef.current.classList.add(styles.titleVisible);
    }
  }, [isVisible]);
  
  // Manejar el clic en el botón de jugar
  const handlePlayClick = () => {
    const rulesSection = document.querySelector('#game-rules');
    if (rulesSection) {
      if (window.lenis) {
        // Usar Lenis para scroll suave
        window.lenis.scrollTo(rulesSection, {
          offset: 0,
          duration: 1.5,
          easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))
        });
      } else {
        // Fallback a scroll nativo
        rulesSection.scrollIntoView({ behavior: 'smooth' });
      }
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
    <section ref={sectionRef} className={`${styles.introSection} ${isVisible ? styles.sectionVisible : ''}`}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <div className={styles.textContent} ref={textRef}>
          <h2 className={styles.title} ref={titleRef}>THE GAME IS ABOUT TO BEGIN</h2>
          <p className={`${styles.description} ${isVisible ? styles.descriptionVisible : ''}`}>
            Prepárate para entrar en el mundo de los memes y la supervivencia, donde 
            solo los más estratégicos ganarán grandes recompensas.
          </p>
        </div>
        
        <div className={styles.imageContainer} ref={imageRef}>
          <div className={styles.imageWrapper}>
            <div className={`${styles.mainImageContainer} ${isVisible ? styles.mainImageVisible : ''}`}>
              <div className={styles.glowEffect}></div>
            </div>
          </div>
        </div>
        
        <div className={styles.ctaContainer} ref={ctaRef}>
          <p className={`${styles.ctaText} ${isVisible ? styles.ctaTextVisible : ''}`}>
            ¿Estás preparado para formar parte del juego?
          </p>
          <button 
            className={`${styles.playButton} ${isVisible ? styles.playButtonVisible : ''}`} 
            onClick={handlePlayClick}
          >
            <span>COMENZAR</span>
            <div className={styles.buttonGlow}></div>
          </button>
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