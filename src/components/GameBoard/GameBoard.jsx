"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './GameBoard.module.css';
import DebugModals from '../DebugModals/DebugModals';

export default function GameBoard() {
  const [balance, setBalance] = useState(2345.67);
  const [chatInput, setChatInput] = useState("");
  const [showAllEmojis, setShowAllEmojis] = useState(false);
  const [activeTab, setActiveTab] = useState('players'); // Para las pestañas móviles
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false); // Nuevo estado para modo tableta (1250px)
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const [potAmount, setPotAmount] = useState(3000);
  const [isCountingUp, setIsCountingUp] = useState(false);
  const [displayAmount, setDisplayAmount] = useState(3000);
  const [balanceState, setBalanceState] = useState(""); // "increasing" o "decreasing"
  const [showFullscreenChat, setShowFullscreenChat] = useState(false); // Estado para controlar el chat pantalla completa
  const [mobileLayout, setMobileLayout] = useState("normal"); // "normal", "diagonal", "z", "circle"
  
  // Estados para el contador de ronda
  const [roundTime, setRoundTime] = useState(10); // 2 minutos por ronda
  const [isRoundActive, setIsRoundActive] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(5);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  // Estados para la selección y eliminación de personajes
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [showSelectionAnimation, setShowSelectionAnimation] = useState(false);
  const [eliminationStep, setEliminationStep] = useState(0); // 0: no iniciado, 1: escaneo, 2: apuntando, 3: disparando, 4: eliminación completa
  
  // Referencias a los elementos DOM
  const prevAmount = useRef(3000);
  const prevBalance = useRef(2345.67);
  const charactersGridRef = useRef(null);
  const sniperRef = useRef(null);
  const laserBeamRef = useRef(null);
  const gunshotFlashRef = useRef(null);
  const bloodSplatterRefs = useRef({});
  const deathFlashRef = useRef(null);
  const gameContainerRef = useRef(null);
  
  // Efecto para animar el incremento del monto
  useEffect(() => {
    if (isCountingUp) {
      const diff = potAmount - prevAmount.current;
      const duration = 1500; // duración de la animación en ms
      const increment = diff / (duration / 16); // incremento por frame (60fps)
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
  
  // Efecto para el contador de ronda
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
  
  // Para depuración: monitorear el estado del modal
  useEffect(() => {
    // console.log("Estado del modal:", { showCountdown, showFinalMessage, isFadingOut });
  }, [showCountdown, showFinalMessage, isFadingOut]);
  
  // Efecto para la cuenta regresiva
  useEffect(() => {
    let initialCountdownTimerId;
    let finalMessageSequenceTimerId; // Un solo timer para la secuencia final

    if (showCountdown && countdownNumber > 0 && !showFinalMessage) {
      initialCountdownTimerId = setTimeout(() => {
        setCountdownNumber(prev => prev - 1);
      }, 1000);
    } else if (showCountdown && countdownNumber === 0 && !showFinalMessage) {
      setShowFinalMessage(true); // Esto re-ejecutará el efecto
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
  
  // Función para reiniciar la ronda (para demostración) - DESHABILITADA
  const forceHideModal = () => {
    // Función deshabilitada - el usuario ya no puede cerrar manualmente el modal
    console.log("Cerrar modal manualmente está deshabilitado");
    return;
    
    // Código original comentado
    /*
    setIsFadingOut(true);
    
    setTimeout(() => {
      setShowCountdown(false);
      setShowFinalMessage(false);
      setIsFadingOut(false);
      setCountdownNumber(5);
    }, 3500); 
    */
  };
  
  // Función simulada para cuando un usuario apuesta
  const handleBet = (amount) => {
    prevAmount.current = potAmount;
    setPotAmount(prev => prev + amount);
    setIsCountingUp(true);
    
    // Actualizar el balance (disminuye)
    prevBalance.current = balance;
    setBalance(prev => prev - amount);
    setBalanceState("decreasing");
    
    // Restaurar el estado normal después de la animación
    setTimeout(() => {
      setBalanceState("");
    }, 1500);
  };
  
  // Detectar si estamos en un dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsTablet(window.innerWidth <= 1250); // Nuevo breakpoint para tabletas
      setIsMobile(window.innerWidth <= 768);
      setIsSmallMobile(window.innerWidth <= 430);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Emojis comunes para el chat
  const commonEmojis = ["😀", "👍", "🔥", "🚀", "💰", "😎", "🎮", "🎯"];
  const allEmojis = [
    "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", 
    "👍", "👎", "👏", "🙌", "🤝", "🙏", "💪", "✌️", "🤘", "🫰",
    "🔥", "💯", "⭐", "🌟", "✨", "💫", "🚀", "💰", "🎮", "🎯",
    "💎", "🏆", "🥇", "🥈", "🥉", "🎖️", "🎨", "🎭", "🎪", "🎟️"
  ];
  
  // Función para insertar emoji en el chat
  const insertEmoji = (emoji) => {
    setChatInput(prev => prev + emoji);
  };

  // Personajes del juego (como en GameRules.jsx)
  const charactersBaseData = [
    {
      id: 'pepe',
      name: 'Pepe',
      img: '/images/pj/pepe.png',
      multiplier: '1.5x'
    },
    {
      id: 'doge',
      name: 'Doge',
      img: '/images/pj/doge.png',
      multiplier: '2x'
    },
    {
      id: 'chillguy',
      name: 'Chill Guy',
      img: '/images/pj/chillguy.png',
      multiplier: '3x'
    },
    {
      id: 'brett',
      name: 'Brett',
      img: '/images/pj/brett.png',
      multiplier: '5x'
    }
  ];

  // Asignar posiciones según el layout seleccionado
  const getPositionByLayout = (index, layout) => {
    const positions = {
      normal: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      diagonal: ['diagonal-topleft', 'diagonal-topright', 'diagonal-bottomleft', 'diagonal-bottomright'],
      z: ['z-topleft', 'z-topright', 'z-bottomleft', 'z-bottomright'],
      circle: ['circle-topleft', 'circle-topright', 'circle-bottomleft', 'circle-bottomright']
    };
    return positions[layout][index];
  };

  // Crear array de personajes con las posiciones actualizadas según el layout
  const characters = charactersBaseData.map((char, index) => ({
    ...char,
    position: getPositionByLayout(index, mobileLayout)
  }));

  // Datos de ejemplo para el chat
  const chatMessages = [
    { id: 1, user: 'Player1', message: 'Buena suerte a todos!' },
    { id: 2, user: 'Player2', message: 'Vamos por Doge!' },
    { id: 3, user: 'Player3', message: 'Pepe es el mejor!' }
  ];

  // Jugadores ejemplo
  const players = [
    { id: 1, name: 'Player1', bet: 100, character: 'pepe' },
    { id: 2, name: 'Player2', bet: 250, character: 'doge' },
    { id: 3, name: 'Player3', bet: 500, character: 'chillguy' },
    { id: 4, name: 'Player4', bet: 1000, character: 'brett' },
    { id: 5, name: 'Player5', bet: 50, character: 'pepe' }
  ];

  // Notificaciones ejemplo
  const notifications = [
    "Player1 apostó 100 a Pepe",
    "Player2 apostó 250 a Doge",
    "Nueva ronda comienza en 5 minutos"
  ];

  // Función para reiniciar la ronda (para demostración)
  const resetRound = () => {
    setRoundTime(10);
    setIsRoundActive(true);
    setShowCountdown(false);
    setShowFinalMessage(false);
    setCountdownNumber(5);
  };
  
  // Función para formatear el tiempo en formato mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Función para renderizar los dígitos del tiempo con animación
  const renderTimeDigits = (timeString) => {
    return timeString.split('').map((char, index) => {
      if (char === ':') {
        return <span key={index} className={styles.timeColon}>:</span>;
      }
      
      // Determinar si este carácter es parte de los segundos
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
  
  // Determinar si el tiempo está en estado de advertencia (menos de 30 segundos)
  const isTimeWarning = roundTime <= 30;
  
  // Calcular el porcentaje de tiempo transcurrido para la barra de progreso
  const progressPercentage = ((120 - roundTime) / 120) * 100;

  // Función para iniciar la animación de selección y eliminación
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
          // Eliminamos esta línea que hacía que la mira apareciera en la esquina
          // sniperRef.current.style.display = 'block';
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
            
            // Ubicar el sniper en una posición inicial aleatoria alrededor del objetivo
            const randomOffsetX = Math.random() * 40 - 20; // valor entre -20 y 20
            const randomOffsetY = Math.random() * 40 - 20; // valor entre -20 y 20
            
            // Ajustes de posición: +30px a la derecha, -50px hacia arriba
            sniperRef.current.style.left = `${centerX - 50 + randomOffsetX + 30}px`;
            sniperRef.current.style.top = `${centerY - 50 + randomOffsetY - 50}px`;
            sniperRef.current.style.display = 'block';
            
            // Función para animar el movimiento del sniper
            const moveSniperToTarget = () => {
              let startTime = null;
              const duration = 800; // duración en ms
              const startX = parseFloat(sniperRef.current.style.left);
              const startY = parseFloat(sniperRef.current.style.top);
              // Ajustamos también la posición final
              const targetX = centerX - 50 + 10; // +30px a la derecha
              const targetY = centerY - 50 - 50; // -50px hacia arriba
              
              const animate = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Función de suavizado para un movimiento más natural
                const easeOutQuad = t => t * (2 - t);
                const easedProgress = easeOutQuad(progress);
                
                // Aplicar pequeñas oscilaciones aleatorias que disminuyen con el tiempo
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
                  // Una vez completada la animación, disparar
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
            
            // Iniciar la animación tras un breve retraso
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
  
  // Función para resetear el estado de los personajes
  const resetCharacters = () => {
    const characterCards = document.querySelectorAll(`.${styles.characterCard}`);
    characterCards.forEach(card => {
      card.classList.remove(styles.scanning, styles.winner, styles.loser);
    });
    
    Object.values(bloodSplatterRefs.current).forEach(ref => {
      if (ref) ref.style.display = 'none';
    });
    
    setSelectedCharacterId(null);
    setShowSelectionAnimation(false);
    setEliminationStep(0);
  };

  // Inicializar las referencias de salpicaduras de sangre
  useEffect(() => {
    bloodSplatterRefs.current = {};
  }, []);
  
  // Renderizar los personajes con IDs correctos
  const renderCharacterCards = () => {
    return characters.map(character => (
      <div 
        key={character.id}
        id={`character-${character.id}`}
        className={`${styles.characterCard} ${styles[character.id]} ${isSmallMobile ? styles[character.position] : ''}`}
        data-multiplier={character.multiplier}
      >
        <div className={styles.characterImageContainer}>
          <img 
            src={character.img} 
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
    ));
  };
  
  // Función para alternar la visibilidad del chat en pantalla completa
  const toggleFullscreenChat = () => {
    setShowFullscreenChat(!showFullscreenChat);
    // Si abrimos el chat, enfocamos el campo de entrada
    if (!showFullscreenChat) {
      setTimeout(() => {
        const fullscreenInput = document.getElementById('fullscreen-chat-input');
        if (fullscreenInput) {
          fullscreenInput.focus();
        }
      }, 300);
    }
  };
  
  // Cambiar al siguiente layout para dispositivos móviles
  const changeLayout = () => {
    const layouts = ['normal', 'diagonal', 'z', 'circle'];
    const currentIndex = layouts.indexOf(mobileLayout);
    const nextIndex = (currentIndex + 1) % layouts.length;
    setMobileLayout(layouts[nextIndex]);
  };
  
  return (
    <div className={styles.gameContainer} ref={gameContainerRef}>
      {/* Logo y balance en la parte superior */}
      <div className={styles.logoHeader}>
        <div style={{ flex: 1 }}>
          <h1 className={styles.logo}>
            <span>MEME</span>
            <span>GAME</span>
          </h1>
        </div>
        
        {/* Información del balance del usuario */}
        <div className={styles.balanceContainer}>
          <span className={styles.balanceLabel}>BALANCE</span>
          <span className={`${styles.balanceAmount} ${styles[balanceState]}`}>${balance.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Barra de notificaciones en la parte superior para vistas móviles/tablet */}
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
      
      {/* Modal de cuenta regresiva */}
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
      
      {/* Elementos de animación para la selección y eliminación */}
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

      {/* Contenedor principal del juego */}
      <div className={styles.mainGameArea}>
        {/* Lista de jugadores a la izquierda (solo desktop) */}
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

        {/* Área central con los personajes y apuestas */}
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

          {/* Botón flotante para cambiar la disposición (solo en móvil) */}
          {isSmallMobile && (
            <button 
              className={styles.changeLayoutButton}
              onClick={changeLayout}
              aria-label="Cambiar disposición"
            >
              <span role="img" aria-label="Disposición">🔄</span>
            </button>
          )}

          {/* Contador de tiempo para la ronda */}
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

          {/* Tabs para tableta/móvil - visible en dispositivos con ancho <= 1250px */}
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

        {/* Área de chat a la derecha (solo desktop) */}
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
            
            {/* Sección de emojis rápidos */}
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

      {/* Barra de notificaciones en la parte inferior solo para escritorio */}
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
      
      {/* Botón flotante para abrir el chat en pantalla completa (visible en <= 1250px) */}
      {isTablet && (
        <button 
          className={styles.chatFloatingButton}
          onClick={toggleFullscreenChat}
          aria-label="Abrir chat"
        />
      )}
      
      {/* Chat en pantalla completa */}
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
          
          {/* Sección de emojis rápidos */}
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

      {/* Componente de Modales de Debug */}
      <DebugModals />
    </div>
  );
}