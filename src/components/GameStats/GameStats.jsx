import styles from './GameStats.module.css';

export default function GameStats() {
  return (
    <div className={styles.statsContainer}>
      <div className={styles.stat}>
        <span className={styles.value}>1,234</span>
        <span className={styles.label}>Jugadores Activos</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>$50K</span>
        <span className={styles.label}>Premio Total</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>24H</span>
        <span className={styles.label}>Próximo Juego</span>
      </div>
    </div>
  );
} 