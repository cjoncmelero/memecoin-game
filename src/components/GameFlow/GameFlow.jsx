"use client";

import { useEffect, useRef } from 'react';
import styles from './GameFlow.module.css';

export default function GameFlow() {
  const sectionRef = useRef(null);
  
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
    <section ref={sectionRef} className={styles.gameFlowSection}>
      
      
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>Flujo del Juego</h2>
          <div className={styles.titleUnderline}></div>
        </div>
        
        <div className={styles.flowContainer}>
          <div className={styles.gameFlow}>
            
            {/* Paso 1 */}
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h4>Fase de Preparación</h4>
                <p>Los participantes se unen y realizan sus apuestas iniciales para entrar en la competencia</p>
                <div className={styles.stepHighlight}></div>
              </div>
              <div className={styles.stepGlow}></div>
            </div>

            {/* Paso 2 */}
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h4>Elección de Avatar</h4>
                <p>Selecciona tu meme preferido con su correspondiente nivel de riesgo y recompensa</p>
                <div className={styles.stepHighlight}></div>
              </div>
              <div className={styles.stepGlow}></div>
            </div>

            {/* Paso 3 */}
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h4>Competición</h4>
                <p>Compite contra otros jugadores recolectando monedas rápidamente antes del tiempo límite</p>
                <div className={styles.stepHighlight}></div>
              </div>
              <div className={styles.stepGlow}></div>
            </div>

            {/* Paso 4 */}
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h4>Distribución Final</h4>
                <p>Los últimos supervivientes reciben recompensas según su desempeño y multiplicadores</p>
                <div className={styles.stepHighlight}></div>
              </div>
              <div className={styles.stepGlow}></div>
            </div>

          </div>
        </div>

        <div className={styles.gameRewards}>
          <div className={styles.rewardsHeader}>
            <div className={styles.rewardsSymbol}></div>
            <h3>Sistema de Recompensas</h3>
            <div className={styles.rewardsSymbol}></div>
          </div>
          <div className={styles.rewardsContent}>
            <p>El pozo de premios se distribuye entre los supervivientes aplicando los multiplicadores correspondientes</p>
            <div className={styles.multiplierGrid}>
              <div className={styles.multiplierItem}>
                <span className={styles.multiplierValue}>x1</span>
                <span className={styles.multiplierLabel}>Riesgo Bajo</span>
              </div>
              <div className={styles.multiplierItem}>
                <span className={styles.multiplierValue}>x3</span>
                <span className={styles.multiplierLabel}>Riesgo Medio</span>
              </div>
              <div className={styles.multiplierItem}>
                <span className={styles.multiplierValue}>x5</span>
                <span className={styles.multiplierLabel}>Riesgo Alto</span>
              </div>
              <div className={styles.multiplierItem}>
                <span className={styles.multiplierValue}>x10</span>
                <span className={styles.multiplierLabel}>Riesgo Extremo</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.gameNote}>
          <p>En el juego del calamar, solo uno puede sobrevivir</p>
        </div>
      </div>
    </section>
  );
} 