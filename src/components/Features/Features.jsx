import styles from './Features.module.css';

export default function Features() {
  return (
    <section className={styles.features}>
      <h2>Características principales</h2>
      <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>★</span>
          <h3 className={styles.featureTitle}>Juega y gana</h3>
          <p className={styles.featureDesc}>Obtén tokens cada día participando en nuestros juegos exclusivos</p>
        </div>
        
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>⚡</span>
          <h3 className={styles.featureTitle}>Compite con amigos</h3>
          <p className={styles.featureDesc}>Sube en el ranking y demuestra quién es el mejor jugador</p>
        </div>
        
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>💰</span>
          <h3 className={styles.featureTitle}>Retiro fácil</h3>
          <p className={styles.featureDesc}>Retira tus ganancias a tu wallet de forma rápida y segura</p>
        </div>
      </div>
    </section>
  );
} 