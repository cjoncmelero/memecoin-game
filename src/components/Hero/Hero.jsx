import styles from './Hero.module.css';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.shapes}>
        <div className={`${styles.shape} ${styles.triangle}`}></div>
        <div className={`${styles.shape} ${styles.circle}`}></div>
        <div className={`${styles.shape} ${styles.square}`}></div>
      </div>
      
      <div className={styles.contentWrapper}>
        <div className={styles.titleContainer}>
          <h1 className={styles.mainTitle}>
            <span>Bienvenido a</span>
            <br />
            <span className={styles.highlight}>Memecoin Game</span>
          </h1>
        </div>
        <p>¡La mejor plataforma para jugar y ganar con memecoins!</p>
        <Link href="/game">
          <button className={styles.cta}>Comenzar</button>
        </Link>
      </div>
    </section>
  );
} 