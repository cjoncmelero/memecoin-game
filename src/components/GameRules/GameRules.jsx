"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './GameRules.module.css';

const GameRules = () => {
  const sectionRef = useRef(null);
  const charactersRef = useRef(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [activeCharIndex, setActiveCharIndex] = useState(0);
  
  // Array de personajes para facilitar el carrusel
  const characters = [
    {
      id: 'pepe',
      name: 'Pepe',
      img: '/images/pj/pepe.png',
      multiplier: 'x1',
      probability: 'Alta',
      reward: 'Baja'
    },
    {
      id: 'doge',
      name: 'Doge',
      img: '/images/pj/doge.png',
      multiplier: 'x2.5',
      probability: 'Media',
      reward: 'Media'
    },
    {
      id: 'chillguy',
      name: 'Chill Guy',
      img: '/images/pj/chillguy.png',
      multiplier: 'x5',
      probability: 'Baja',
      reward: 'Alta'
    },
    {
      id: 'brett',
      name: 'Brett',
      img: '/images/pj/brett.png',
      multiplier: 'x10',
      probability: 'Muy baja',
      reward: 'Muy alta'
    }
  ];
  
  // Usar useCallback para optimizar el event listener
  const handleScroll = useCallback(() => {
    // Usar requestAnimationFrame para una mejor performance
    requestAnimationFrame(() => {
      if (sectionRef.current) {
        const sectionTop = sectionRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        // Hacer visible la sección cuando está a punto de entrar en la vista
        if (sectionTop < windowHeight * 0.9) {
          setSectionVisible(true);
        }
      }
      
      if (charactersRef.current) {
        const elementTop = charactersRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.75) {
          charactersRef.current.classList.add(styles.charactersVisible);
        }
      }
    });
  }, []);
  
  useEffect(() => {
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
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    handleScroll(); // Verificar al cargar
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [handleScroll]);

  // Función para mostrar detalles al seleccionar un personaje
  const handleCharacterClick = (character) => {
    setSelectedCharacter(character === selectedCharacter ? null : character);
  };
  
  // Funciones para el carrusel
  const nextCharacter = () => {
    setActiveCharIndex((prev) => (prev + 1) % characters.length);
  };
  
  const prevCharacter = () => {
    setActiveCharIndex((prev) => (prev - 1 + characters.length) % characters.length);
  };

  return (
    <section 
      ref={sectionRef} 
      className={`${styles.rulesSection} ${sectionVisible ? styles.rulesSectionVisible : ''}`}
    >
      <div className={styles.container}>
        <h2 className={styles.title}>Reglas del Juego</h2>
        
        <div className={styles.description}>
          <p>
            Bienvenido a <span className={styles.highlight}>MEME GAME</span>, el emocionante juego 
            inspirado en el famoso Juego del Calamar pero con un giro de criptomonedas meme.
          </p>
        </div>
        
        <div className={styles.contentLayout}>
          <div className={styles.leftContent}>
            <h3 className={styles.sectionTitle}>¿Cómo se juega?</h3>
            
            <div className={styles.gameplayContainer}>
              <div className={styles.rulesBlock}>
                <ul>
                  <li>Cuatro personajes icónicos de memecoins compiten entre sí</li>
                  <li>Cada personaje tiene su propio multiplicador de recompensa</li>
                  <li>Hay una fase de apuestas que dura 6 minutos</li>
                  <li>Después, los personajes comienzan a ser eliminados automáticamente</li>
                  <li>El último personaje en pie determina el ganador</li>
                  <li>Los apostadores del personaje ganador obtienen su recompensa multiplicada</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className={styles.rightContent}>
            <h3 className={styles.sectionTitle}>Los Participantes</h3>
            
            <div ref={charactersRef} className={styles.carouselContainer}>
              <div className={styles.carouselControls}>
                <button className={styles.carouselButton} onClick={prevCharacter}>
                  <span className={styles.prevArrow}></span>
                </button>
                <div className={styles.carouselTrack} style={{ transform: `translateX(-${activeCharIndex * 100}%)` }}>
                  {characters.map((char, index) => (
                    <div 
                      key={char.id}
                      className={`${styles.characterCard} ${styles[char.id]} ${activeCharIndex === index ? styles.activeCard : ''}`}
                    >
                      <div className={styles.characterWrapper}>
                        <div className={styles.characterImg}>
                          <img src={char.img} alt={char.name} />
                          <div className={styles.multiplierTag}>
                            <span className={styles.multiplier}>{char.multiplier}</span>
                          </div>
                        </div>
                        <div className={styles.characterInfo}>
                          <h4 className={styles.characterName}>{char.name}</h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className={styles.carouselButton} onClick={nextCharacter}>
                  <span className={styles.nextArrow}></span>
                </button>
              </div>
              
              <div className={styles.carouselIndicators}>
                {characters.map((_, index) => (
                  <div 
                    key={index} 
                    className={`${styles.indicator} ${activeCharIndex === index ? styles.activeIndicator : ''}`}
                    onClick={() => setActiveCharIndex(index)}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameRules; 