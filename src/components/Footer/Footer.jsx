"use client";

import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.footerDecoration}>
        <div className={styles.decorCircle}></div>
        <div className={styles.decorTriangle}></div>
        <div className={styles.decorSquare}></div>
      </div>
      
      <div className={styles.footerContent}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBranding}>
            <div className={styles.logoWrapper}>
              <div className={styles.logoSymbol}>
                <div className={styles.logoTriangle}></div>
                <div className={styles.logoCircle}></div>
                <div className={styles.logoSquare}></div>
              </div>
              <h3 className={styles.footerTitle}>MEME GAME</h3>
            </div>
            <p className={styles.tagline}>Sobrevive y gana en el juego de las memecoins</p>
          </div>
          
          <div className={styles.footerNav}>
            <h4>Enlaces</h4>
            <ul>
              <li><a href="#">Inicio</a></li>
              <li><a href="#">Cómo Jugar</a></li>
              <li><a href="#">Personajes</a></li>
              <li><a href="#">Recompensas</a></li>
            </ul>
          </div>
          
          <div className={styles.footerNav}>
            <h4>Recursos</h4>
            <ul>
              <li><a href="#">Documentación</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Términos</a></li>
              <li><a href="#">Privacidad</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSocial}>
            <h4>Síguenos</h4>
            <div className={styles.socialIcons}>
              <a href="https://x.com/thememegames2?s=21&t=VGVHbBWJBWztEjUlrZhPLg" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://t.me/+7MS1Wb-45XMwNThk" aria-label="Telegram">
                <i className="fab fa-telegram"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <div className={styles.divider}></div>
          <p className={styles.copyright}>
            &copy; {currentYear} MEME GAME. Todos los derechos reservados.
          </p>
          <p className={styles.disclaimer}>
            Inspirado en el Juego del Calamar. No relacionado con la serie original.
          </p>
          <div className={styles.poweredBy}>
            <a href="#" className={styles.poweredLink}>Powered by Memecoin</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 