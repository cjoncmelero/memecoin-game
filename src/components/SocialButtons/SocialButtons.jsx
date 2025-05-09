import styles from './SocialButtons.module.css';

export default function SocialButtons() {
  return (
    <div className={styles.socialButtons}>
      <a href="#" className={`${styles.socialButton} ${styles.twitter}`}>
        Twitter
      </a>
      <a href="#" className={`${styles.socialButton} ${styles.telegram}`}>
        Telegram
      </a>
      <a href="#" className={`${styles.socialButton} ${styles.whitepaper}`}>
        Whitepaper
      </a>
    </div>
  );
} 