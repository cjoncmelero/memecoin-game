"use client";

import React from 'react';
import styles from './CasinoRevenueSplit.module.css';

const CasinoRevenueSplit = () => {
  return (
    <section className={styles.casinoSection}>
      <div className={styles.container}>
        <h2 className={styles.title}>
          Ingresos del Casino y el Token <span className={styles.tokenName}>$MEMGM</span>
        </h2>
        <p className={styles.paragraph}>
          Una porción significativa de las ganancias generadas por nuestro casino se reinvierte directamente en el ecosistema del token <span className={styles.tokenName}>$MEMGM</span>.
        </p>
        <p className={styles.paragraph}>
          Esto incluye mecanismos como la recompra y quema de tokens, lo que ayuda a reducir el suministro total y potencialmente aumentar su valor. Además, otra parte de los ingresos se distribuye entre los poseedores del token, recompensando a nuestra comunidad.
        </p>
        <p className={styles.paragraph}>
          Creemos en un modelo sostenible donde el éxito del casino impulsa directamente el valor y los beneficios para los holders de <span className={styles.tokenName}>$MEMGM</span>.
        </p>
        <a href="https://the-memegame.gitbook.io/whitepaper/the-meme-game/token" target="_blank" rel="noopener noreferrer" className={styles.whitepaperLink}>
          Leer más en el Whitepaper
        </a>
      </div>
    </section>
  );
};

export default CasinoRevenueSplit; 