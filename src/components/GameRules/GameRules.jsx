"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './GameRules.module.css';

const GameRules = () => {
  const sectionRef = useRef(null);
  const charactersRef = useRef(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  
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
        
        <h3 className={styles.sectionTitle}>Los Participantes</h3>
        
        <div ref={charactersRef} className={styles.characters}>
          <div 
            className={`${styles.character} ${styles.pepe} ${selectedCharacter === 'pepe' ? styles.selected : ''}`}
            onClick={() => handleCharacterClick('pepe')}
          >
            <div className={styles.characterWrapper}>
              <div className={styles.characterImg}>
                <img src="/images/pj/pepe.png" alt="Pepe" />
                <div className={styles.multiplierTag}>
                  <span className={styles.multiplier}>x1</span>
                </div>
              </div>
              <div className={styles.characterInfo}>
                <h4 className={styles.characterName}>Pepe</h4>
                {selectedCharacter === 'pepe' && (
                  <div className={styles.characterDetails}>
                    <p>Probabilidad de ganar: Alta</p>
                    <p>Multiplicador: x1</p>
                    <p>Recompensa: Baja</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div 
            className={`${styles.character} ${styles.doge} ${selectedCharacter === 'doge' ? styles.selected : ''}`}
            onClick={() => handleCharacterClick('doge')}
          >
            <div className={styles.characterWrapper}>
              <div className={styles.characterImg}>
                <img src="/images/pj/doge.png" alt="Doge" />
                <div className={styles.multiplierTag}>
                  <span className={styles.multiplier}>x2.5</span>
                </div>
              </div>
              <div className={styles.characterInfo}>
                <h4 className={styles.characterName}>Doge</h4>
                {selectedCharacter === 'doge' && (
                  <div className={styles.characterDetails}>
                    <p>Probabilidad de ganar: Media</p>
                    <p>Multiplicador: x2.5</p>
                    <p>Recompensa: Media</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div 
            className={`${styles.character} ${styles.chillguy} ${selectedCharacter === 'chillguy' ? styles.selected : ''}`}
            onClick={() => handleCharacterClick('chillguy')}
          >
            <div className={styles.characterWrapper}>
              <div className={styles.characterImg}>
                <img src="/images/pj/chillguy.png" alt="Chill Guy" />
                <div className={styles.multiplierTag}>
                  <span className={styles.multiplier}>x5</span>
                </div>
              </div>
              <div className={styles.characterInfo}>
                <h4 className={styles.characterName}>Chill Guy</h4>
                {selectedCharacter === 'chillguy' && (
                  <div className={styles.characterDetails}>
                    <p>Probabilidad de ganar: Baja</p>
                    <p>Multiplicador: x5</p>
                    <p>Recompensa: Alta</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div 
            className={`${styles.character} ${styles.brett} ${selectedCharacter === 'brett' ? styles.selected : ''}`}
            onClick={() => handleCharacterClick('brett')}
          >
            <div className={styles.characterWrapper}>
              <div className={styles.characterImg}>
                <img src="/images/pj/brett.png" alt="Brett" />
                <div className={styles.multiplierTag}>
                  <span className={styles.multiplier}>x10</span>
                </div>
              </div>
              <div className={styles.characterInfo}>
                <h4 className={styles.characterName}>Brett</h4>
                {selectedCharacter === 'brett' && (
                  <div className={styles.characterDetails}>
                    <p>Probabilidad de ganar: Muy baja</p>
                    <p>Multiplicador: x10</p>
                    <p>Recompensa: Muy alta</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <h3 className={styles.sectionTitle}>Flujo del Juego</h3>
        
        <div className={styles.gameflowContainer}>
          <div className={styles.gameflow}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h4>Fase de apuestas</h4>
                <p>6 minutos para realizar tus apuestas</p>
              </div>
            </div>
            <div className={styles.arrow}></div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h4>Inicio de eliminación</h4>
                <p>Los personajes empiezan a caer</p>
              </div>
            </div>
            <div className={styles.arrow}></div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h4>Superviviente</h4>
                <p>El último personaje de pie gana</p>
              </div>
            </div>
            <div className={styles.arrow}></div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h4>Recompensas</h4>
                <p>Distribución del pozo acumulado</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.gameRewards}>
          <h3>Sistema de Recompensas</h3>
          <p>
            Todo el pozo acumulado de apuestas se distribuye entre los ganadores según el multiplicador
            del personaje. <span className={styles.highlight}>A mayor riesgo, mayor recompensa</span>.
          </p>
          <p>
            Los multiplicadores están inversamente relacionados con la probabilidad de ganar de cada personaje,
            lo que genera un equilibrio entre riesgo y recompensa.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GameRules; 