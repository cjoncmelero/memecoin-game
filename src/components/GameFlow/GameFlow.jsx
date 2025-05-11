"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './GameFlow.module.css';

const GameFlow = () => {
  const [isVisible, setIsVisible] = useState(false);
  const componentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);

  // Datos para los pasos del flujo
  const flowSteps = [
    {
      number: 1,
      title: "Fase de apuestas",
      description: "6 minutos para realizar tus apuestas"
    },
    {
      number: 2,
      title: "Inicio de eliminación",
      description: "Los personajes empiezan a caer"
    },
    {
      number: 3,
      title: "Superviviente",
      description: "El último personaje de pie gana"
    },
    {
      number: 4,
      title: "Recompensas",
      description: "Distribución del pozo acumulado"
    }
  ];

  return (
    <section 
      ref={componentRef}
      className={`${styles.gameFlowSection} ${isVisible ? styles.visible : ''}`}
    >
      <h3 className={styles.title}>Flujo del Juego</h3>
      
      <div className={styles.flowContainer}>
        <div className={styles.gameFlow}>
          {flowSteps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>{step.number}</div>
                <div className={styles.stepContent}>
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              </div>
              {index < flowSteps.length - 1 && (
                <div className={styles.arrow}>
                  <div className={styles.arrowLine}></div>
                  <div className={styles.arrowPoint}></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className={styles.gameRewards}>
        <div className={styles.rewardsHeader}>
          <h3>Sistema de Recompensas</h3>
        </div>
        <div className={styles.rewardsContent}>
          <p>
            Todo el pozo acumulado de apuestas se distribuye entre los ganadores según el multiplicador
            del personaje. <span className={styles.highlight}>A mayor riesgo, mayor recompensa</span>.
          </p>
          <p>
            Los multiplicadores están inversamente relacionados con la probabilidad de ganar de cada personaje,
            lo que genera un equilibrio entre riesgo y recompensa.
          </p>
          <div className={styles.multiplyGraphic}>
            <div className={styles.multiplyItem}>
              <span className={styles.multiplyValue}>x1</span>
              <span className={styles.multiplyText}>Bajo riesgo</span>
            </div>
            <div className={styles.multiplyItem}>
              <span className={styles.multiplyValue}>x2.5</span>
              <span className={styles.multiplyText}>Medio riesgo</span>
            </div>
            <div className={styles.multiplyItem}>
              <span className={styles.multiplyValue}>x5</span>
              <span className={styles.multiplyText}>Alto riesgo</span>
            </div>
            <div className={styles.multiplyItem}>
              <span className={styles.multiplyValue}>x10</span>
              <span className={styles.multiplyText}>Muy alto riesgo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameFlow; 