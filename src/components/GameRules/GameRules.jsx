"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './GameRules.module.css';

const GameRules = () => {
  const sectionRef = useRef(null);
  const charactersRef = useRef(null);
  const carouselTrackRef = useRef(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [activeCharIndex, setActiveCharIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isCarouselLoaded, setIsCarouselLoaded] = useState(false);
  
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
  
  const handleScroll = useCallback(() => {
    requestAnimationFrame(() => {
      if (sectionRef.current) {
        const sectionTop = sectionRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.9) {
          setSectionVisible(true);
        }
      }
      
      if (charactersRef.current) {
        const elementTop = charactersRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.75) {
          charactersRef.current.classList.add(styles.charactersVisible);
          setTimeout(() => {
            setIsCarouselLoaded(true);
          }, 300);
        }
      }
    });
  }, []);
  
  useEffect(() => {
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
    handleScroll(); 
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (!isCarouselLoaded) return;
    
    const autoplayInterval = setInterval(() => {
      if (!isTransitioning) {
        nextCharacter();
      }
    }, 5000); // Cambiar cada 5 segundos
    
    return () => clearInterval(autoplayInterval);
  }, [activeCharIndex, isTransitioning, isCarouselLoaded]);

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character === selectedCharacter ? null : character);
  };
  
  const nextCharacter = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setActiveCharIndex((prev) => (prev + 1) % characters.length);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
  };
  
  const prevCharacter = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setActiveCharIndex((prev) => (prev - 1 + characters.length) % characters.length);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
  };
  
  const goToCharacter = (index) => {
    if (isTransitioning || index === activeCharIndex) return;
    
    setIsTransitioning(true);
    setActiveCharIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700);
  };

  const getTouchStartX = useRef(0);
  const handleTouchStart = (e) => {
    getTouchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = getTouchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) { 
      if (diff > 0) {
        nextCharacter(); 
      } else {
        prevCharacter(); 
      }
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className={`${styles.rulesSection} ${sectionVisible ? styles.rulesSectionVisible : ''}`}
      style={{ position: 'relative', zIndex: 10 }}
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
            
            <div 
              ref={charactersRef} 
              className={`${styles.carouselContainer} ${isCarouselLoaded ? styles.carouselLoaded : ''}`}
            >
              <div className={styles.carouselWrapper}>
                <button 
                  className={`${styles.carouselButton} ${styles.prevButton} ${isTransitioning ? styles.disabled : ''}`} 
                  onClick={prevCharacter}
                  disabled={isTransitioning}
                >
                  <span className={styles.prevArrow}></span>
                </button>
                
                <div 
                  className={styles.carouselControls} 
                  onTouchStart={handleTouchStart} 
                  onTouchEnd={handleTouchEnd}
                >
                  <div 
                    ref={carouselTrackRef}
                    className={styles.carouselTrack} 
                    style={{ transform: `translateX(-${activeCharIndex * 100}%)` }}
                  >
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
                            {activeCharIndex === index && (
                              <div className={styles.characterStats}>
                                <div className={styles.statItem}>
                                  <span className={styles.statLabel}>Probabilidad:</span>
                                  <span className={styles.statValue}>{char.probability}</span>
                                </div>
                                <div className={styles.statItem}>
                                  <span className={styles.statLabel}>Recompensa:</span>
                                  <span className={styles.statValue}>{char.reward}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button 
                  className={`${styles.carouselButton} ${styles.nextButton} ${isTransitioning ? styles.disabled : ''}`} 
                  onClick={nextCharacter}
                  disabled={isTransitioning}
                >
                  <span className={styles.nextArrow}></span>
                </button>
              </div>
              
              <div 
                className={styles.carouselIndicators}
                style={{ position: 'relative', zIndex: 20 }}
              >
                {characters.map((_, index) => (
                  <div 
                    key={index} 
                    className={`${styles.indicator} ${activeCharIndex === index ? styles.activeIndicator : ''}`}
                    onClick={() => goToCharacter(index)}
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