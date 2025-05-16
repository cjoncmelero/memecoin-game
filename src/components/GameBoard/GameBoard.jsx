"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './GameBoard.module.css';
import DebugModals from '../DebugModals/DebugModals';

export default function GameBoard() {
  const [balance, setBalance] = useState(2345.67);
  const [chatInput, setChatInput] = useState("");
  const [showAllEmojis, setShowAllEmojis] = useState(false);
  const [activeTab, setActiveTab] = useState('players');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const [potAmount, setPotAmount] = useState(3000);
  const [isCountingUp, setIsCountingUp] = useState(false);
  const [displayAmount, setDisplayAmount] = useState(3000);
  const [balanceState, setBalanceState] = useState(""); // "increasing" o "decreasing"
  const [showFullscreenChat, setShowFullscreenChat] = useState(false);
  const [mobileLayout, setMobileLayout] = useState("normal");
  
  const [roundTime, setRoundTime] = useState(10); // Tiempo de ronda en segundos
  const [isRoundActive, setIsRoundActive] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(5);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [showSelectionAnimation, setShowSelectionAnimation] = useState(false);
  const [eliminationStep, setEliminationStep] = useState(0); // 0: no iniciado, 1: escaneo, 2: apuntando, 3: disparando, 4: eliminación completa
  const [eliminatedCharactersIds, setEliminatedCharactersIds] = useState(new Set());
  
  const prevAmount = useRef(3000);
  const prevBalance = useRef(2345.67);
  const charactersGridRef = useRef(null);
  const sniperRef = useRef(null);
  const laserBeamRef = useRef(null);
  const gunshotFlashRef = useRef(null);
  const bloodSplatterRefs = useRef({});
  const deathFlashRef = useRef(null);
  const gameContainerRef = useRef(null);
  
  useEffect(() => {
    if (isCountingUp) {
      const diff = potAmount - prevAmount.current;
      const duration = 1500; 
      const increment = diff / (duration / 16);
      let currentAmount = prevAmount.current;
      let lastTime = 0;
      
      const animate = (timestamp) => {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        
        currentAmount += increment * (deltaTime / 16);
        
        if ((increment > 0 && currentAmount >= potAmount) || 
            (increment < 0 && currentAmount <= potAmount)) {
          setDisplayAmount(potAmount);
          setIsCountingUp(false);
          prevAmount.current = potAmount;
          return;
        }
        
        setDisplayAmount(Math.round(currentAmount));
        requestAnimationFrame(animate);
      };
      
      requestAnimationFrame(animate);
    }
  }, [isCountingUp, potAmount]);
  
  useEffect(() => {
    let timer;
    if (isRoundActive && roundTime > 0) {
      timer = setInterval(() => {
        setRoundTime(prevTime => {
          const newTime = prevTime - 1;
          
          if (newTime === 5 && !showCountdown) {
            setIsFadingOut(false);
            setShowFinalMessage(false);
            setCountdownNumber(5);
            setShowCountdown(true);
          }
          
          return newTime;
        });
      }, 1000);
    } else if (roundTime === 0 && isRoundActive) {
      setIsRoundActive(false);
      
      if (!showCountdown) {
        setShowCountdown(false);
        setShowFinalMessage(false);
        setIsFadingOut(false);
        setCountdownNumber(5); 
      }
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRoundActive, roundTime, showCountdown]);
  
  useEffect(() => {
    let initialCountdownTimerId;
    let finalMessageSequenceTimerId;

    if (showCountdown && countdownNumber > 0 && !showFinalMessage) {
      initialCountdownTimerId = setTimeout(() => {
        setCountdownNumber(prev => prev - 1);
      }, 1000);
    } else if (showCountdown && countdownNumber === 0 && !showFinalMessage) {
      setShowFinalMessage(true);
    } else if (showCountdown && countdownNumber === 0 && showFinalMessage) {
      if (!isFadingOut && !document.body.dataset.finalSequenceRunning) { 
        document.body.dataset.finalSequenceRunning = "true"; 

        finalMessageSequenceTimerId = setTimeout(() => {
          setIsFadingOut(true); 

          setTimeout(() => {
            startSelectionAndElimination();
            setShowCountdown(false);
            setShowFinalMessage(false);
            setIsFadingOut(false);
            setCountdownNumber(5); 
          }, 1000);

        }, 4000);
      }
    }
    
    return () => {
      if (initialCountdownTimerId) clearTimeout(initialCountdownTimerId);
      if (finalMessageSequenceTimerId) { 
        clearTimeout(finalMessageSequenceTimerId);
        delete document.body.dataset.finalSequenceRunning;
      }
    };
  }, [showCountdown, countdownNumber, showFinalMessage, isFadingOut]); 
  
  const forceHideModal = () => {
    // Función deshabilitada - el usuario ya no puede cerrar manualmente el modal
    console.log("Cerrar modal manualmente está deshabilitado");
    return;
  };
  
  const handleBet = (amount) => {
    prevAmount.current = potAmount;
    setPotAmount(prev => prev + amount);
    setIsCountingUp(true);
    
    prevBalance.current = balance;
    setBalance(prev => prev - amount);
    setBalanceState("decreasing");
    
    setTimeout(() => {
      setBalanceState("");
    }, 1500);
  };
  
  useEffect(() => {
    const checkMobile = () => {
      setIsTablet(window.innerWidth <= 1250);
      setIsMobile(window.innerWidth <= 768);
      setIsSmallMobile(window.innerWidth <= 430);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  const commonEmojis = ["😀", "👍", "🔥", "🚀", "💰", "😎", "🎮", "🎯"];
  const allEmojis = [
    "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", 
    "👍", "👎", "👏", "🙌", "🤝", "🙏", "💪", "✌️", "🤘", "🫰",
    "🔥", "💯", "⭐", "🌟", "✨", "💫", "🚀", "💰", "🎮", "🎯",
    "💎", "🏆", "🥇", "🥈", "🥉", "🎖️", "🎨", "🎭", "🎪", "🎟️"
  ];
  
  const insertEmoji = (emoji) => {
    setChatInput(prev => prev + emoji);
  };

  const charactersBaseData = [
    {
      id: 'pepe',
      name: 'Pepe',
      imgNormal: '/images/pj/pepe.png',
      imgPreocupado: '/images/pj/preocupado.jpeg',
      imgMuerto: '/images/pj/muerto.jpeg',
      imgGanador: '/images/pj/ganador.jpeg',
      multiplier: '1.5x'
    },
    {
      id: 'doge',
      name: 'Doge',
      imgNormal: '/images/pj/doge.png',
      imgPreocupado: '/images/pj/preocupado.jpeg',
      imgMuerto: '/images/pj/muerto.jpeg',
      imgGanador: '/images/pj/ganador.jpeg',
      multiplier: '2x'
    },
    {
      id: 'chillguy',
      name: 'Chill Guy',
      imgNormal: '/images/pj/chillguy.png',
      imgPreocupado: '/images/pj/preocupado.jpeg',
      imgMuerto: '/images/pj/muerto.jpeg',
      imgGanador: '/images/pj/ganador.jpeg',
      multiplier: '3x'
    },
    {
      id: 'brett',
      name: 'Brett',
      imgNormal: '/images/pj/brett.png',
      imgPreocupado: '/images/pj/preocupado.jpeg',
      imgMuerto: '/images/pj/muerto.jpeg',
      imgGanador: '/images/pj/ganador.jpeg',
      multiplier: '5x'
    }
  ];

  const getPositionByLayout = (index, layout) => {
    const positions = {
      normal: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      diagonal: ['diagonal-topleft', 'diagonal-topright', 'diagonal-bottomleft', 'diagonal-bottomright'],
      z: ['z-topleft', 'z-topright', 'z-bottomleft', 'z-bottomright'],
      circle: ['circle-topleft', 'circle-topright', 'circle-bottomleft', 'circle-bottomright']
    };
    return positions[layout][index];
  };

  const characters = charactersBaseData.map((char, index) => ({
    ...char,
    position: getPositionByLayout(index, mobileLayout)
  }));

  const chatMessages = [
    { id: 1, user: 'Player1', message: 'Buena suerte a todos!' },
    { id: 2, user: 'Player2', message: 'Vamos por Doge!' },
    { id: 3, user: 'Player3', message: 'Pepe es el mejor!' }
  ];

  const players = [
    { id: 1, name: 'Player1', bet: 100, character: 'pepe' },
    { id: 2, name: 'Player2', bet: 250, character: 'doge' },
    { id: 3, name: 'Player3', bet: 500, character: 'chillguy' },
    { id: 4, name: 'Player4', bet: 1000, character: 'brett' },
    { id: 5, name: 'Player5', bet: 50, character: 'pepe' }
  ];

  const notifications = [
    "Player1 apostó 100 a Pepe",
    "Player2 apostó 250 a Doge",
    "Nueva ronda comienza en 5 minutos"
  ];

  const resetRound = () => {
    setRoundTime(10);
    setIsRoundActive(true);
    setShowCountdown(false);
    setShowFinalMessage(false);
    setCountdownNumber(5);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const renderTimeDigits = (timeString) => {
    return timeString.split('').map((char, index) => {
      if (char === ':') {
        return <span key={index} className={styles.timeColon}>:</span>;
      }
      
      const isSecondDigit = index >= 3;
      
      return (
        <span 
          key={index} 
          className={`${styles.roundTimeDigit} ${isSecondDigit ? styles.timeSeconds : ''}`}
        >
          {char}
        </span>
      );
    });
  };
  
  const isTimeWarning = roundTime <= 30;
  const progressPercentage = ((120 - roundTime) / 120) * 100;

  const getCharacterImageSrc = (character) => {
    if (eliminationStep === 4 && character.id === selectedCharacterId) {
      return character.imgGanador;
    }
    if (eliminatedCharactersIds.has(character.id)) {
      return character.imgMuerto;
    }
    if (showSelectionAnimation && eliminationStep > 0 && eliminationStep < 4) {
      return character.imgPreocupado;
    }
    return character.imgNormal;
  };
  
  const startSelectionAndElimination = () => {
    const sniperImg = new Image();
    sniperImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='none' stroke='%23ff0000' stroke-width='2'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23ff0000' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%23ff0000'/%3E%3Cline x1='5' y1='50' x2='25' y2='50' stroke='%23ff0000' stroke-width='1'/%3E%3Cline x1='75' y1='50' x2='95' y2='50' stroke='%23ff0000' stroke-width='1'/%3E%3Cline x1='50' y1='5' x2='50' y2='25' stroke='%23ff0000' stroke-width='1'/%3E%3Cline x1='50' y1='75' x2='50' y2='95' stroke='%23ff0000' stroke-width='1'/%3E%3C/svg%3E";

    if (characters.length === 0) {
      console.error("startSelectionAndElimination: No hay personajes para seleccionar.");
      return;
    }
    const randomIndex = Math.floor(Math.random() * characters.length);
    const winnerId = characters[randomIndex].id;
    setSelectedCharacterId(winnerId);
    setShowSelectionAnimation(true);
    
    if (!sniperRef.current) {
      const sniperElement = document.createElement('div');
      sniperElement.className = styles.sniper;
      sniperElement.style.position = 'fixed';
      sniperElement.style.zIndex = '1000';
      sniperElement.style.display = 'none';
      document.body.appendChild(sniperElement);
      sniperRef.current = sniperElement;
    }
    
    if (!laserBeamRef.current) {
      const laserElement = document.createElement('div');
      laserElement.className = styles.laserBeam;
      laserElement.style.position = 'fixed';
      laserElement.style.zIndex = '990';
      laserElement.style.display = 'none';
      document.body.appendChild(laserElement);
      laserBeamRef.current = laserElement;
    }
    
    if (!gunshotFlashRef.current) {
      const flashElement = document.createElement('div');
      flashElement.className = styles.gunshotFlash;
      flashElement.style.position = 'fixed';
      flashElement.style.zIndex = '995';
      flashElement.style.display = 'none';
      document.body.appendChild(flashElement);
      gunshotFlashRef.current = flashElement;
    }
    
    if (!deathFlashRef.current) {
      const deathFlashElement = document.createElement('div');
      deathFlashElement.className = styles.deathFlash;
      deathFlashElement.style.position = 'fixed';
      deathFlashElement.style.zIndex = '989';
      deathFlashElement.style.display = 'none';
      document.body.appendChild(deathFlashElement);
      deathFlashRef.current = deathFlashElement;
    }
    
    setEliminationStep(1);
    
    setTimeout(() => {
      const characterCards = document.querySelectorAll(`.${styles.characterCard}`);
      if (characterCards.length === 0) {
        console.error("Error: No se encontraron tarjetas de personajes");
        return;
      }
      
      characterCards.forEach(card => {
        card.classList.add(styles.scanning);
      });
      
      setTimeout(() => {
        setEliminationStep(2);
        
        if (sniperRef.current) {
        } else {
          console.error("Error: sniperRef.current es null");
        }
        
        const losers = characters.filter(char => char.id !== winnerId);
        
        const eliminateLoser = (index) => {
          if (index >= losers.length) {
            setTimeout(() => {
              setEliminationStep(4);
              
              if (sniperRef.current) {
                sniperRef.current.style.display = 'none';
              }
              
              const winnerCard = document.getElementById(`character-${winnerId}`);
              if (winnerCard) {
                winnerCard.classList.remove(styles.scanning);
                winnerCard.classList.add(styles.winner);
              } else {
                console.error(`Error: No se encontró el elemento con id character-${winnerId}`);
              }
              
              setTimeout(() => {
                resetCharacters();
              }, 5000);
            }, 1000);
            return;
          }
          
          const loser = losers[index];
          const loserCard = document.getElementById(`character-${loser.id}`);
          
          if (loserCard && sniperRef.current) {
            const rect = loserCard.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const randomOffsetX = Math.random() * 40 - 20;
            const randomOffsetY = Math.random() * 40 - 20;
            
            sniperRef.current.style.left = `${centerX - 50 + randomOffsetX + 30}px`;
            sniperRef.current.style.top = `${centerY - 50 + randomOffsetY - 50}px`;
            sniperRef.current.style.display = 'block';
            
            const moveSniperToTarget = () => {
              let startTime = null;
              const duration = 800;
              const startX = parseFloat(sniperRef.current.style.left);
              const startY = parseFloat(sniperRef.current.style.top);
              const targetX = centerX - 50 + 10;
              const targetY = centerY - 50 - 50;
              
              const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeOutQuad = t => t * (2 - t);
                const easedProgress = easeOutQuad(progress);
                
                const oscillationFactor = 1 - easedProgress;
                const oscillationX = oscillationFactor * Math.sin(elapsed * 0.03) * 8;
                const oscillationY = oscillationFactor * Math.sin(elapsed * 0.04) * 8;
                
                const newX = startX + (targetX - startX) * easedProgress + oscillationX;
                const newY = startY + (targetY - startY) * easedProgress + oscillationY;
                
                sniperRef.current.style.left = `${newX}px`;
                sniperRef.current.style.top = `${newY}px`;
                
                if (progress < 1) {
                  requestAnimationFrame(animate);
                } else {
                  setTimeout(() => {
                    setEliminationStep(3);
                    
                    if (laserBeamRef.current) {
                      const laserBeam = laserBeamRef.current;
                      laserBeam.style.display = 'block';
                      laserBeam.style.opacity = '1';
                      laserBeam.style.left = `${centerX + 15}px`;
                      laserBeam.style.transform = `rotate(90deg)`;
                    }
                    
                    if (gunshotFlashRef.current) {
                      gunshotFlashRef.current.style.display = 'block';
                      gunshotFlashRef.current.style.left = `${centerX - 15}px`;
                      gunshotFlashRef.current.style.top = `0px`;
                    }
                    
                    if (gameContainerRef.current) {
                      gameContainerRef.current.classList.add(styles.bodyShaking);
                      
                      setTimeout(() => {
                        gameContainerRef.current.classList.remove(styles.bodyShaking);
                      }, 500);
                    }
                    
                    if (deathFlashRef.current) {
                      deathFlashRef.current.style.display = 'block';
                      
                      setTimeout(() => {
                        deathFlashRef.current.style.display = 'none';
                      }, 300);
                    }
                    
                    setTimeout(() => {
                      if (bloodSplatterRefs.current[loser.id]) {
                        bloodSplatterRefs.current[loser.id].style.display = 'block';
                      } else {
                        console.error(`Error: bloodSplatterRefs.current[${loser.id}] es null`);
                        const splatterElement = document.createElement('div');
                        splatterElement.className = styles.bloodSplatter;
                        splatterElement.style.display = 'block';
                        
                        const imageContainer = loserCard.querySelector(`.${styles.characterImageContainer}`);
                        if (imageContainer) {
                          imageContainer.appendChild(splatterElement);
                          bloodSplatterRefs.current[loser.id] = splatterElement;
                        }
                      }
                      
                      if (loserCard) {
                        loserCard.classList.remove(styles.scanning);
                        loserCard.classList.add(styles.loser);
                        setEliminatedCharactersIds(prevIds => new Set(prevIds).add(loser.id));
                      }
                      
                      setTimeout(() => {
                        if (laserBeamRef.current) {
                          laserBeamRef.current.style.display = 'none';
                        }
                        if (gunshotFlashRef.current) {
                          gunshotFlashRef.current.style.display = 'none';
                        }
                        
                        setTimeout(() => {
                          eliminateLoser(index + 1);
                        }, 500);
                      }, 500);
                    }, 300);
                  }, 200);
                }
              };
              
              requestAnimationFrame(animate);
            };
            
            setTimeout(moveSniperToTarget, 200);
          } else {
            console.error(`Error: No se encontró el elemento con id character-${loser.id} o sniperRef.current es null`);
            eliminateLoser(index + 1);
          }
        };
        
        setTimeout(() => {
          eliminateLoser(0);
        }, 1000);
      }, 2000);
    }, 500);
  };
  
  const resetCharacters = () => {
    const characterCards = document.querySelectorAll(`.${styles.characterCard}`);
    characterCards.forEach(card => {
      card.classList.remove(styles.scanning, styles.winner, styles.loser);
    });
    
    Object.values(bloodSplatterRefs.current).forEach(ref => {
      if (ref) ref.style.display = 'none';
    });
    
    setEliminatedCharactersIds(new Set());
    setSelectedCharacterId(null);
    setShowSelectionAnimation(false);
    setEliminationStep(0);
  };

  useEffect(() => {
    bloodSplatterRefs.current = {};
  }, []);
  
  const renderCharacterCards = () => {
    return characters.map(character => {
      const imageSrc = getCharacterImageSrc(character);
      return (
        <div 
          key={character.id}
          id={`character-${character.id}`}
          className={`${styles.characterCard} ${styles[character.id]} ${isSmallMobile ? styles[character.position] : ''}`}
          data-multiplier={character.multiplier}
        >
          <div className={styles.characterImageContainer}>
            <img 
              src={imageSrc}
              alt={character.name} 
              className={styles.characterImage}
            />
            <div 
              ref={el => bloodSplatterRefs.current[character.id] = el}
              className={styles.bloodSplatter}
              style={{ display: 'none' }}
            ></div>
          </div>
          <div className={styles.characterInfo}>
            <h4 className={styles.characterName}>{character.name}</h4>
          </div>
          <div className={styles.betInputContainer}>
            <button 
              className={`${styles.betArrow} ${styles.betArrowDown}`}
              onClick={() => {
                const input = document.getElementById(`bet-${character.id}`);
                const newValue = parseInt(input.value || 0) - 1;
                input.value = newValue >= 0 ? newValue : 0;
              }}
            >
              <span>-</span>
            </button>
            <input 
              id={`bet-${character.id}`}
              type="number" 
              className={styles.characterBetInput} 
              defaultValue="0"
              min="0"
              step="1"
            />
            <button 
              className={`${styles.betArrow} ${styles.betArrowUp}`}
              onClick={() => {
                const input = document.getElementById(`bet-${character.id}`);
                input.value = parseInt(input.value || 0) + 1;
              }}
            >
              <span>+</span>
            </button>
          </div>
          <button
            className={styles.placeBetButton}
            onClick={() => {
              const input = document.getElementById(`bet-${character.id}`);
              const betAmount = parseInt(input.value || 0);
              if (betAmount > 0) {
                handleBet(betAmount);
                input.value = "0";
              }
            }}
          >
            Apostar
          </button>
        </div>
      );
    });
  };
  
  const toggleFullscreenChat = () => {
    setShowFullscreenChat(!showFullscreenChat);
    if (!showFullscreenChat) {
      setTimeout(() => {
        const fullscreenInput = document.getElementById('fullscreen-chat-input');
        if (fullscreenInput) {
          fullscreenInput.focus();
        }
      }, 300);
    }
  };
  
  const changeLayout = () => {
    const layouts = ['normal', 'diagonal', 'z', 'circle'];
    const currentIndex = layouts.indexOf(mobileLayout);
    const nextIndex = (currentIndex + 1) % layouts.length;
    setMobileLayout(layouts[nextIndex]);
  };
  
  return (
    <div className={styles.gameContainer} ref={gameContainerRef}>
      <div className={styles.logoHeader}>
        <div style={{ flex: 1 }}>
          <h1 className={styles.logo}>
            <span>MEME</span>
            <span>GAME</span>
          </h1>
        </div>
        
        <div className={styles.balanceContainer}>
          <span className={styles.balanceLabel}>BALANCE</span>
          <span className={`${styles.balanceAmount} ${styles[balanceState]}`}>${balance.toFixed(2)}</span>
        </div>
      </div>
      
      {isTablet && (
        <div className={`${styles.notificationsBar} ${styles.notificationsBarTop}`}>
          <div className={styles.notificationsScroller}>
            {notifications.map((notification, index) => (
              <span key={index} className={styles.notificationItem}>
                {notification}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className={`
        ${styles.countdownModal} 
        ${(showCountdown || showFinalMessage) ? styles.countdownModalVisible : ''} 
        ${isFadingOut ? styles.countdownModalFading : ''}
      `}
        style={{ display: (showCountdown || showFinalMessage) ? 'flex' : 'none' }}
      >
        <div className={styles.countdownContent}>
          {!showFinalMessage && (
            <>
              <div className={styles.countdownCircle}></div>
              <div className={styles.countdownRipple}></div>
              <div className={styles.countdownRipple}></div>
              <div className={styles.countdownRipple}></div>
              <div className={styles.countdownNumber}>
                {countdownNumber}
              </div>
            </>
          )}
          {showFinalMessage && (
            <div className={`
              ${styles.countdownMessage}
              ${isFadingOut ? styles.countdownMessageFading : ''}
            `}>
              ¡Empieza la Ronda!
            </div>
          )}
        </div>
      </div>
      
      <div 
        ref={sniperRef} 
        className={styles.sniper}
        style={{ position: 'fixed', zIndex: 1000, display: 'none' }}
      ></div>
      <div 
        ref={laserBeamRef} 
        className={styles.laserBeam}
        style={{ position: 'fixed', zIndex: 990, display: 'none' }}
      ></div>
      <div 
        ref={gunshotFlashRef} 
        className={styles.gunshotFlash}
        style={{ position: 'fixed', zIndex: 995, display: 'none' }}
      ></div>
      <div 
        ref={deathFlashRef} 
        className={styles.deathFlash}
        style={{ position: 'fixed', zIndex: 989, display: 'none' }}
      ></div>

      <div className={styles.mainGameArea}>
        {!isTablet && (
          <div className={styles.playersListContainer}>
            <h3 className={styles.sectionTitle}>
              JUGADORES
              <span className={styles.playersCount}>{players.length}</span>
            </h3>
            <div className={styles.playersList}>
              {players.map(player => (
                <div key={player.id} className={styles.playerItem}>
                  <span className={styles.playerName}>{player.name}</span>
                  <span className={styles.playerBet}>${player.bet}</span>
                  <span className={`${styles.playerCharacter} ${styles[player.character]}`}></span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.charactersContainer}>
          <div className={styles.potInfo}>
            <span className={styles.potLabel}>TOTAL APOSTADO</span>
            <span className={`${styles.potAmount} ${isCountingUp ? styles.countingUp : ''}`}>
              ${displayAmount}
              {isCountingUp && (
                <>
                  <span className={`${styles.moneySymbol} ${styles.symbolPlus1}`}>+</span>
                  <span className={`${styles.moneySymbol} ${styles.symbolDollar1}`}>$</span>
                  <span className={`${styles.moneySymbol} ${styles.symbolPlus2}`}>+</span>
                  <span className={`${styles.moneySymbol} ${styles.symbolDollar2}`}>$</span>
                  <span className={`${styles.moneySymbol} ${styles.symbolPlus3}`}>+</span>
                  <span className={`${styles.moneySymbol} ${styles.symbolDollar3}`}>$</span>
                  <span className={`${styles.moneySymbol} ${styles.symbolPlus4}`}>+</span>
                </>
              )}
            </span>
          </div>

          <div 
            ref={charactersGridRef}
            className={isSmallMobile ? `${styles.charactersGrid} ${styles.mobileGrid} ${styles[mobileLayout]}` : styles.charactersGrid}
          >
            {renderCharacterCards()}
          </div>

          {isSmallMobile && (
            <button 
              className={styles.changeLayoutButton}
              onClick={changeLayout}
              aria-label="Cambiar disposición"
            >
              <span role="img" aria-label="Disposición">🔄</span>
            </button>
          )}

          <div className={styles.roundTimerContainer}>
            <span className={styles.roundTimerLabel}>LA SIGUIENTE RONDA COMIENZA EN </span>
            <div className={styles.roundTimer}>
              <span className={isTimeWarning ? styles.roundTimerWarning : ''}>
                {renderTimeDigits(formatTime(roundTime))}
              </span>
            </div>
            
            <div className={styles.roundProgressContainer}>
              <div 
                className={styles.roundProgressBar} 
                style={{ width: `${progressPercentage}%` }}
              ></div>
              <div className={styles.roundProgressMarkers}>
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className={styles.roundProgressMarker}
                    style={{ '--index': i }}
                  ></div>
                ))}
              </div>
              <div className={styles.roundProgressText}>
                {Math.ceil(roundTime / 60)} min
              </div>
            </div>
          </div>

          {isTablet && (
            <div className={styles.mobileTabs}>
              <div className={styles.tabsContainer}>
                <div 
                  className={`${styles.tab} ${activeTab === 'players' ? styles.active : ''}`}
                  onClick={() => setActiveTab('players')}
                >
                  Jugadores
                </div>
                <div 
                  className={`${styles.tab} ${activeTab === 'chat' ? styles.active : ''}`}
                  onClick={() => setActiveTab('chat')}
                >
                  Chat
                </div>
              </div>
              
              {activeTab === 'players' && (
                <div className={styles.mobilePanel}>
                  <h3 className={styles.sectionTitle}>
                    JUGADORES
                    <span className={styles.playersCount}>{players.length}</span>
                  </h3>
                  {players.map(player => (
                    <div key={player.id} className={styles.playerItem}>
                      <span className={styles.playerName}>{player.name}</span>
                      <span className={styles.playerBet}>${player.bet}</span>
                      <span className={`${styles.playerCharacter} ${styles[player.character]}`}></span>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === 'chat' && (
                <div className={styles.mobilePanel}>
                  <h3 className={styles.sectionTitle}>CHAT</h3>
                  <div className={styles.chatMessages}>
                    {chatMessages.map(msg => (
                      <div key={msg.id} className={styles.chatMessage}>
                        <span className={styles.chatUser}>{msg.user}:</span>
                        <span className={styles.chatText}>{msg.message}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className={styles.emojiSection}>
                    <div className={styles.emojiContainer}>
                      {(showAllEmojis ? allEmojis : commonEmojis).map((emoji, index) => (
                        <button 
                          key={index} 
                          className={styles.emojiButton}
                          onClick={() => insertEmoji(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <button 
                      className={styles.emojiToggleButton}
                      onClick={() => setShowAllEmojis(!showAllEmojis)}
                    >
                      {showAllEmojis ? "Menos emojis" : "Más emojis"}
                    </button>
                  </div>
                  
                  <div className={styles.chatInputContainer}>
                    <input 
                      type="text" 
                      className={styles.chatInput} 
                      placeholder="Escribe un mensaje..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                    />
                    <button className={styles.chatSendButton}>Enviar</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {!isTablet && (
          <div className={styles.chatContainer}>
            <h3 className={styles.sectionTitle}>CHAT</h3>
            <div className={styles.chatMessages}>
              {chatMessages.map(msg => (
                <div key={msg.id} className={styles.chatMessage}>
                  <span className={styles.chatUser}>{msg.user}:</span>
                  <span className={styles.chatText}>{msg.message}</span>
                </div>
              ))}
            </div>
            
            <div className={styles.emojiSection}>
              <div className={styles.emojiContainer}>
                {(showAllEmojis ? allEmojis : commonEmojis).map((emoji, index) => (
                  <button 
                    key={index} 
                    className={styles.emojiButton}
                    onClick={() => insertEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button 
                className={styles.emojiToggleButton}
                onClick={() => setShowAllEmojis(!showAllEmojis)}
              >
                {showAllEmojis ? "Menos emojis" : "Más emojis"}
              </button>
            </div>
            
            <div className={styles.chatInputContainer}>
              <input 
                type="text" 
                className={styles.chatInput} 
                placeholder="Escribe un mensaje..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button className={styles.chatSendButton}>Enviar</button>
            </div>
          </div>
        )}
      </div>

      {!isTablet && (
        <div className={styles.notificationsBar}>
          <div className={styles.notificationsScroller}>
            {notifications.map((notification, index) => (
              <span key={index} className={styles.notificationItem}>
                {notification}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {isTablet && (
        <button 
          className={styles.chatFloatingButton}
          onClick={toggleFullscreenChat}
          aria-label="Abrir chat"
        />
      )}
      
      <div className={`${styles.chatFullscreen} ${showFullscreenChat ? styles.chatFullscreenVisible : ''}`}>
        <div className={styles.chatFullscreenHeader}>
          <h2 className={styles.chatFullscreenTitle}>CHAT DEL JUEGO</h2>
          <button 
            className={styles.chatFullscreenClose}
            onClick={toggleFullscreenChat}
            aria-label="Cerrar chat"
          >
            ×
          </button>
        </div>
        <div className={styles.chatFullscreenBody}>
          <div className={styles.chatFullscreenMessages}>
            {chatMessages.map(msg => (
              <div key={msg.id} className={styles.chatMessage}>
                <span className={styles.chatUser}>{msg.user}:</span>
                <span className={styles.chatText}>{msg.message}</span>
              </div>
            ))}
          </div>
          
          <div className={styles.emojiSection}>
            <div className={styles.emojiContainer}>
              {(showAllEmojis ? allEmojis : commonEmojis).map((emoji, index) => (
                <button 
                  key={index} 
                  className={styles.emojiButton}
                  onClick={() => insertEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <button 
              className={styles.emojiToggleButton}
              onClick={() => setShowAllEmojis(!showAllEmojis)}
            >
              {showAllEmojis ? "Menos emojis" : "Más emojis"}
            </button>
          </div>
          
          <div className={styles.chatFullscreenInputContainer}>
            <input 
              id="fullscreen-chat-input"
              type="text" 
              className={styles.chatFullscreenInput} 
              placeholder="Escribe un mensaje..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button className={styles.chatFullscreenSendButton}>
              Enviar
            </button>
          </div>
        </div>
      </div>

      <DebugModals />
    </div>
  );
}