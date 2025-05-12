"use client";

import { useEffect, useRef, useState } from 'react';
import styles from './GameObjectives.module.css';

export default function GameObjectives() {
  const sectionRef = useRef(null);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    }, { threshold: 0.1 });

    if(sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.objectivesSection}>
      <div className={styles.decorationCircle}></div>
      <div className={styles.decorationTriangle}></div>
      <div className={styles.decorationSquare}></div>
      
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <div className={styles.titleSymbol}></div>
          <h2 className={styles.title}>Objetivos del Juego</h2>
          <div className={styles.titleSymbol}></div>
        </div>
        
        <div className={styles.gridContainer}>
          <div 
            className={`${styles.objectiveCard} ${activeCard === 0 ? styles.activeCard : ''}`}
            onMouseEnter={() => setActiveCard(0)}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className={styles.cardSymbol}></div>
            <div className={styles.cardIcon}>🎯</div>
            <h3 className={styles.cardTitle}>Recolectar Monedas</h3>
            <p className={styles.cardText}>
              Consigue la mayor cantidad de memecoins antes que el tiempo se agote para maximizar tus ganancias
            </p>
            <div className={styles.cardGlow}></div>
            <span className={styles.cardNumber}>01</span>
          </div>

          <div 
            className={`${styles.objectiveCard} ${activeCard === 1 ? styles.activeCard : ''}`}
            onMouseEnter={() => setActiveCard(1)}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className={styles.cardSymbol}></div>
            <div className={styles.cardIcon}>💎</div>
            <h3 className={styles.cardTitle}>Multiplicadores</h3>
            <p className={styles.cardText}>
              Activa bonificaciones especiales para aumentar tus ganancias y superar a la competencia
            </p>
            <div className={styles.cardGlow}></div>
            <span className={styles.cardNumber}>02</span>
          </div>

          <div 
            className={`${styles.objectiveCard} ${activeCard === 2 ? styles.activeCard : ''}`}
            onMouseEnter={() => setActiveCard(2)}
            onMouseLeave={() => setActiveCard(null)}
          >
            <div className={styles.cardSymbol}></div>
            <div className={styles.cardIcon}>🏆</div>
            <h3 className={styles.cardTitle}>Clasificación</h3>
            <p className={styles.cardText}>
              Supera a otros jugadores en la tabla de líderes global y conviértete en el último superviviente
            </p>
            <div className={styles.cardGlow}></div>
            <span className={styles.cardNumber}>03</span>
          </div>
        </div>

        <div className={styles.warningBox}>
          <div className={styles.warningIcon}>
            <span>⚠️</span>
          </div>
          <div className={styles.warningContent}>
            <h4 className={styles.warningTitle}>ALERTA</h4>
            <p className={styles.warningText}>
              ¡Cuidado! Los jugadores eliminados pierden todo su progreso y quedan fuera del juego definitivamente
            </p>
          </div>
          <div className={styles.pulse}></div>
        </div>
        
        <div className={styles.finalMessage}>
          <p>La única manera de ganar es sobrevivir</p>
        </div>
      </div>
    </section>
  );
}
