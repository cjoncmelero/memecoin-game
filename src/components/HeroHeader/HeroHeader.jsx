"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import styles from './HeroHeader.module.css';
import Link from 'next/link';

const HeroHeader = () => {
  const headerRef = useRef(null);
  const welcomeRef = useRef(null);
  const leftMeRef = useRef(null);
  const rightMeRef = useRef(null);
  const gameRef = useRef(null);
  const gameTextRef = useRef(null);
  const bgColorRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [showFullTitle, setShowFullTitle] = useState(false);
  
  const handleScroll = useCallback(() => {
    if (!headerRef.current) return;
    
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    requestAnimationFrame(() => {
      const headerFadeoutProgress = Math.min(Math.max((scrollY - windowHeight * 1.5) / (windowHeight * 0.5), 0), 1);
      
      if (headerRef.current) {
        headerRef.current.style.opacity = 1 - headerFadeoutProgress;
        if (headerFadeoutProgress >= 1) {
          headerRef.current.style.pointerEvents = 'none';
        } else {
          headerRef.current.style.pointerEvents = 'auto';
        }
      }
      
      if (welcomeRef.current) {
        const welcomeProgress = Math.min(Math.max(scrollY / (windowHeight * 0.2), 0), 1);
        welcomeRef.current.style.opacity = 1 - welcomeProgress;
        welcomeRef.current.style.transform = `translateY(${welcomeProgress * -50}px)`;
      }
      
      if (leftMeRef.current && rightMeRef.current) {
        const appearProgress = Math.min(Math.max((scrollY - windowHeight * 0.2) / (windowHeight * 0.4), 0), 1);
        
        leftMeRef.current.style.opacity = appearProgress;
        rightMeRef.current.style.opacity = appearProgress;
        
        const moveProgress = Math.min(Math.max((scrollY - windowHeight * 0.6) / (windowHeight * 0.3), 0), 1);
        
        const computedLeftStyle = window.getComputedStyle(leftMeRef.current);
        const computedRightStyle = window.getComputedStyle(rightMeRef.current);
        
        const leftToRight = window.innerWidth - parseFloat(computedLeftStyle.left) - leftMeRef.current.offsetWidth - parseFloat(computedRightStyle.right);
        const rightToLeft = window.innerWidth - parseFloat(computedRightStyle.right) - rightMeRef.current.offsetWidth - parseFloat(computedLeftStyle.left);
        
        leftMeRef.current.style.transform = `translateX(${moveProgress * leftToRight}px)`;
        rightMeRef.current.style.transform = `translateX(${-moveProgress * rightToLeft}px)`;
        
        const colorChangeProgress = Math.min(Math.max((scrollY - windowHeight * 1.0) / (windowHeight * 0.2), 0), 1);
        
        if (bgColorRef.current) {
          bgColorRef.current.style.opacity = colorChangeProgress;
        }
        
        if (gameRef.current) {
          gameRef.current.style.opacity = colorChangeProgress;
          gameRef.current.style.transform = `translateY(${(1 - colorChangeProgress) * 50}px)`;
          
          if (colorChangeProgress > 0.8 && !gameActive) {
            setGameActive(true);
            setTimeout(() => {
              setShowFullTitle(true);
            }, 1500);
          } else if (colorChangeProgress <= 0.8 && gameActive) {
            setGameActive(false);
            setShowFullTitle(false);
          }
          
          if (colorChangeProgress > 0.5) {
            leftMeRef.current.style.opacity = 2 - colorChangeProgress * 2;
            rightMeRef.current.style.opacity = 2 - colorChangeProgress * 2;
          }
        }
      }
    });
  }, [gameActive]);
  
  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      if (!window.particlesJS) {
        const script = document.createElement('script');
        script.src = '/particles.min.js';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          window.particlesJS && window.particlesJS.load('particles-js', '/particles.json');
        };
        document.body.appendChild(script);
      } else {
        window.particlesJS.load('particles-js', '/particles.json');
      }
    }
    
    let scrollTimeout;
    const throttledScrollHandler = () => {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
          handleScroll();
          scrollTimeout = null;
        }, 10);
      }
    };
    
    handleScroll();
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', throttledScrollHandler);
  }, [handleScroll]);
  
  return (
    <header ref={headerRef} className={styles.header}>
      <div id="particles-js" className={styles.particlesContainer}></div>
      <div className={styles.starsBackground}></div>
      <div ref={bgColorRef} className={styles.colorOverlay}></div>
      
      <div className={styles.socialButtons}>
        <a href="https://x.com/thememegames2?s=21&t=VGVHbBWJBWztEjUlrZhPLg" target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
          <i className="fab fa-twitter"></i> TWITTER
        </a>
        <a href="https://t.me/+7MS1Wb-45XMwNThk" target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
          <i className="fab fa-telegram-plane"></i> TELEGRAM
        </a>
        <a href="https://dexscreener.com/solana/9tD91NGYMhRitLBM43WCPVfjHsjwqyoVyoyddhkhED61" target="_blank" rel="noopener noreferrer" className={styles.socialButton}>
          <i className="fas fa-chart-line"></i> DEX_SCREENER
        </a>
      </div>
      
      <div ref={welcomeRef} className={styles.welcomeContainer}>
        <div className={styles.welcomeText}>
          Bienvenido
        </div>
      </div>
      
      <div className={styles.memesContainer}>
        <div ref={leftMeRef} className={`${styles.meText} ${styles.leftMe}`}>
          ME
        </div>
        <div ref={rightMeRef} className={`${styles.meText} ${styles.rightMe}`}>
          ME
        </div>
      </div>
      
      <div ref={gameRef} className={`${styles.gameContainer} ${gameActive ? styles.gameTextActive : ''}`}>
        <div 
          ref={gameTextRef} 
          className={`${styles.gameText} ${showFullTitle ? styles.fullTitleText : ''}`} 
          data-text={showFullTitle ? "MEME GAME" : "GAME"}
        >
          {showFullTitle ? (
            <>
              <span className={styles.memeText}>MEME</span> GAME
            </>
          ) : "GAME"}
        </div>
      </div>
      
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollText}>Scroll para continuar</div>
        <div className={styles.scrollIcon}></div>
      </div>

      <Link href="/game" className={styles.startGameButton}>
        <div className={styles.startGameContainer}>
          <div className={styles.startGameText}>
            EMPIEZA HORA
            <span className={styles.startGameSubtext}>IR AL JUEGO</span>
          </div>
        </div>
      </Link>
    </header>
  );
};

export default HeroHeader;