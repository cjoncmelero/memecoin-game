"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './GameBoard.module.css';

export default function GameBoard() {
  // Estados para manejar los diferentes elementos del juego (sin lógica, solo estructura)
  const [balance, setBalance] = useState(2345.67);
  const [chatInput, setChatInput] = useState("");
  const [showAllEmojis, setShowAllEmojis] = useState(false);
  const [activeTab, setActiveTab] = useState('players'); // Para las pestañas móviles
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const [potAmount, setPotAmount] = useState(3000);
  const [isCountingUp, setIsCountingUp] = useState(false);
  const [displayAmount, setDisplayAmount] = useState(3000);
  const [balanceState, setBalanceState] = useState(""); // "increasing" o "decreasing"
  
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
          
          // Iniciar cuenta regresiva si quedan 5 segundos
          if (newTime === 5) {
            // Asegurarse de que todos los estados del modal estén reiniciados
            setIsFadingOut(false);
            setShowFinalMessage(false);
            setCountdownNumber(5);
            // Ahora mostrar el modal
            setShowCountdown(true);
          }
          
          return newTime;
        });
      }, 1000);
    } else if (roundTime === 0) {
      // La ronda ha terminado
      setIsRoundActive(false);
      // Asegurarse de que el modal se cierre limpiamente
      setIsFadingOut(true);
      setTimeout(() => {
        setShowCountdown(false);
        setShowFinalMessage(false);
        setIsFadingOut(false);
        setCountdownNumber(5);
      }, 800);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRoundActive, roundTime]);
  
  // Para depuración: monitorear el estado del modal
  useEffect(() => {
    console.log("Estado del modal:", { showCountdown, showFinalMessage, isFadingOut });
  }, [showCountdown, showFinalMessage, isFadingOut]);
  
  // Efecto para la cuenta regresiva
  useEffect(() => {
    let countdownTimer;
    
    if (showCountdown && countdownNumber > 0) {
      console.log(`Cuenta regresiva: ${countdownNumber}`);
      countdownTimer = setTimeout(() => {
        setCountdownNumber(prev => prev - 1);
      }, 1000);
    } else if (countdownNumber === 0 && !showFinalMessage) {
      console.log("Llegó a cero, mostrando mensaje final");
      // Al llegar a 0, mostrar solo el mensaje final
      setShowFinalMessage(true);
      
      // Mostrar el mensaje por 4 segundos (antes eran 2)
      countdownTimer = setTimeout(() => {
        console.log("Iniciando animación de desvanecimiento");
        // Iniciar la animación de desvanecimiento
        setIsFadingOut(true);
        
        // Esperar a que termine la animación antes de ocultar completamente
        countdownTimer = setTimeout(() => {
          console.log("Finalizando animación, reiniciando estados");
          // Esta es la parte crítica - asegurarse de que todo se resetee
          setShowCountdown(false);
          setShowFinalMessage(false);
          setIsFadingOut(false);
          setCountdownNumber(5);
          
          console.log("Ahora vamos a empezar la animación de selección");
          // Iniciar la animación de selección y eliminación
          setTimeout(() => {
            console.log("Llamando a startSelectionAndElimination");
            startSelectionAndElimination();
          }, 100);
          
          // Forzar actualización del estado
          setTimeout(() => {
            console.log("Estados después de reset:", { 
              showCountdown: false, 
              showFinalMessage: false, 
              isFadingOut: false 
            });
          }, 100);
        }, 1000); // Aumentar la duración de la animación
      }, 4000); // Aumentar a 4 segundos para mostrar el mensaje
    }
    
    return () => {
      if (countdownTimer) clearTimeout(countdownTimer);
    };
  }, [showCountdown, countdownNumber, showFinalMessage]);
  
  // Reiniciar la ronda (para depuración)
  const forceHideModal = () => {
    // Primero activar la animación de desvanecimiento
    setIsFadingOut(true);
    
    // Luego esperar a que termine la animación antes de ocultar
    setTimeout(() => {
      setShowCountdown(false);
      setShowFinalMessage(false);
      setIsFadingOut(false);
      setCountdownNumber(5);
      
      console.log("Modal forzado a cerrar");
    }, 3500); // Ajustar al nuevo tiempo de la animación CSS
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
  const characters = [
    {
      id: 'pepe',
      name: 'Pepe',
      img: '/images/pj/pepe.png',
      multiplier: '1.5x',
      position: 'top-left'
    },
    {
      id: 'doge',
      name: 'Doge',
      img: '/images/pj/doge.png',
      multiplier: '2x',
      position: 'top-right'
    },
    {
      id: 'chillguy',
      name: 'Chill Guy',
      img: '/images/pj/chillguy.png',
      multiplier: '3x',
      position: 'bottom-left'
    },
    {
      id: 'brett',
      name: 'Brett',
      img: '/images/pj/brett.png',
      multiplier: '5x',
      position: 'bottom-right'
    }
  ];

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
    console.log("Iniciando animación de selección y eliminación");
    // Asegurarnos de que las imágenes estén precargadas
    const sniperImg = new Image();
    sniperImg.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='none' stroke='%23ff0000' stroke-width='2'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23ff0000' stroke-width='1'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%23ff0000'/%3E%3Cline x1='5' y1='50' x2='25' y2='50' stroke='%23ff0000' stroke-width='1'/%3E%3Cline x1='75' y1='50' x2='95' y2='50' stroke='%23ff0000' stroke-width='1'/%3E%3Cline x1='50' y1='5' x2='50' y2='25' stroke='%23ff0000' stroke-width='1'/%3E%3Cline x1='50' y1='75' x2='50' y2='95' stroke='%23ff0000' stroke-width='1'/%3E%3C/svg%3E";

    // Seleccionar un personaje aleatorio
    const randomIndex = Math.floor(Math.random() * characters.length);
    const winnerId = characters[randomIndex].id;
    console.log(`Personaje ganador seleccionado: ${winnerId}`);
    setSelectedCharacterId(winnerId);
    setShowSelectionAnimation(true);
    
    // Comprobar si los refs existen
    console.log("Verificando referencias DOM:", {
      hasSniperRef: !!sniperRef.current,
      hasLaserBeamRef: !!laserBeamRef.current,
      hasGunshotFlashRef: !!gunshotFlashRef.current,
      hasDeathFlashRef: !!deathFlashRef.current,
      hasGameContainerRef: !!gameContainerRef.current,
      bloodSplatterRefsKeys: Object.keys(bloodSplatterRefs.current)
    });
    
    // Crear el elemento de mira si no existe
    if (!sniperRef.current) {
      const sniperElement = document.createElement('div');
      sniperElement.className = styles.sniper;
      sniperElement.style.position = 'fixed';
      sniperElement.style.zIndex = '1000';
      sniperElement.style.display = 'none';
      document.body.appendChild(sniperElement);
      sniperRef.current = sniperElement;
      console.log("Elemento de mira creado dinámicamente");
    }
    
    // Crear el elemento de láser si no existe
    if (!laserBeamRef.current) {
      const laserElement = document.createElement('div');
      laserElement.className = styles.laserBeam;
      laserElement.style.position = 'fixed';
      laserElement.style.zIndex = '990';
      laserElement.style.display = 'none';
      document.body.appendChild(laserElement);
      laserBeamRef.current = laserElement;
      console.log("Elemento de láser creado dinámicamente");
    }
    
    // Crear el elemento de destello si no existe
    if (!gunshotFlashRef.current) {
      const flashElement = document.createElement('div');
      flashElement.className = styles.gunshotFlash;
      flashElement.style.position = 'fixed';
      flashElement.style.zIndex = '995';
      flashElement.style.display = 'none';
      document.body.appendChild(flashElement);
      gunshotFlashRef.current = flashElement;
      console.log("Elemento de destello creado dinámicamente");
    }
    
    // Crear el elemento de flash de muerte si no existe
    if (!deathFlashRef.current) {
      const deathFlashElement = document.createElement('div');
      deathFlashElement.className = styles.deathFlash;
      deathFlashElement.style.position = 'fixed';
      deathFlashElement.style.zIndex = '989';
      deathFlashElement.style.display = 'none';
      document.body.appendChild(deathFlashElement);
      deathFlashRef.current = deathFlashElement;
      console.log("Elemento de flash de muerte creado dinámicamente");
    }
    
    // Empezar el proceso de eliminación
    setEliminationStep(1); // Iniciar escaneo
    
    // Aplicar la clase de escaneo a todos los personajes
    setTimeout(() => {
      const characterCards = document.querySelectorAll(`.${styles.characterCard}`);
      console.log(`Aplicando escaneo a ${characterCards.length} tarjetas de personajes`);
      
      if (characterCards.length === 0) {
        console.error("Error: No se encontraron tarjetas de personajes");
        return; // Terminar si no hay tarjetas
      }
      
      characterCards.forEach(card => {
        card.classList.add(styles.scanning);
      });
      
      console.log("Fase de escaneo iniciada");
      
      // Después de 2 segundos, mostrar el sniper y comenzar a apuntar
      setTimeout(() => {
        setEliminationStep(2); // Apuntando
        console.log("Fase de apuntado iniciada");
        
        if (sniperRef.current) {
          console.log("Mostrando mira de francotirador");
          sniperRef.current.style.display = 'block';
        } else {
          console.error("Error: sniperRef.current es null");
        }
        
        // Mover el sniper a cada personaje excepto el ganador
        const losers = characters.filter(char => char.id !== winnerId);
        console.log(`Personajes a eliminar: ${losers.map(l => l.id).join(", ")}`);
        
        // Usamos una función recursiva para procesar cada perdedor secuencialmente
        const eliminateLoser = (index) => {
          if (index >= losers.length) {
            // Todos los perdedores han sido eliminados
            setTimeout(() => {
              setEliminationStep(4); // Eliminación completa
              console.log("Fase de eliminación completa");
              
              // Ocultar el sniper
              if (sniperRef.current) {
                sniperRef.current.style.display = 'none';
              }
              
              // Mostrar el ganador
              const winnerCard = document.getElementById(`character-${winnerId}`);
              if (winnerCard) {
                winnerCard.classList.remove(styles.scanning);
                winnerCard.classList.add(styles.winner);
                console.log(`Personaje ganador mostrado: ${winnerId}`);
              } else {
                console.error(`Error: No se encontró el elemento con id character-${winnerId}`);
              }
              
              // Resetear todo después de la animación completa
              setTimeout(() => {
                resetCharacters();
              }, 5000);
            }, 1000);
            return;
          }
          
          const loser = losers[index];
          const loserCard = document.getElementById(`character-${loser.id}`);
          
          if (loserCard && sniperRef.current) {
            // Tomar las coordenadas relativas a la ventana, no al documento
            const rect = loserCard.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            console.log(`Apuntando a ${loser.name} en (${centerX}, ${centerY})`);
            
            // Mover la mira hacia el objetivo
            sniperRef.current.style.left = `${centerX - 50}px`;
            sniperRef.current.style.top = `${centerY - 50}px`;
            
            // Después de apuntar, disparar
            setTimeout(() => {
              setEliminationStep(3); // Disparando
              console.log(`Disparando a ${loser.name}`);
              
              // Mostrar el láser
              if (laserBeamRef.current) {
                const laserBeam = laserBeamRef.current;
                laserBeam.style.display = 'block';
                laserBeam.style.opacity = '1';
                laserBeam.style.left = `${centerX}px`;
                
                // Rotación del láser (apuntando hacia abajo)
                laserBeam.style.transform = `rotate(90deg)`;
              }
              
              // Mostrar el destello del disparo
              if (gunshotFlashRef.current) {
                gunshotFlashRef.current.style.display = 'block';
                gunshotFlashRef.current.style.left = `${centerX - 30}px`;
                gunshotFlashRef.current.style.top = `0px`;
              }
              
              // Añadir efecto de temblor en la pantalla
              if (gameContainerRef.current) {
                gameContainerRef.current.classList.add(styles.bodyShaking);
                
                // Quitar la clase después de la animación
                setTimeout(() => {
                  gameContainerRef.current.classList.remove(styles.bodyShaking);
                }, 500);
              }
              
              // Mostrar el flash de muerte
              if (deathFlashRef.current) {
                deathFlashRef.current.style.display = 'block';
                
                // Ocultar después de la animación
                setTimeout(() => {
                  deathFlashRef.current.style.display = 'none';
                }, 300);
              }
              
              // Mostrar el efecto de sangre
              setTimeout(() => {
                if (bloodSplatterRefs.current[loser.id]) {
                  bloodSplatterRefs.current[loser.id].style.display = 'block';
                  console.log(`Efecto de sangre mostrado para ${loser.id}`);
                } else {
                  console.error(`Error: bloodSplatterRefs.current[${loser.id}] es null`);
                  // Intentar crear el efecto de sangre dinámicamente
                  const splatterElement = document.createElement('div');
                  splatterElement.className = styles.bloodSplatter;
                  splatterElement.style.display = 'block';
                  
                  const imageContainer = loserCard.querySelector(`.${styles.characterImageContainer}`);
                  if (imageContainer) {
                    imageContainer.appendChild(splatterElement);
                    bloodSplatterRefs.current[loser.id] = splatterElement;
                    console.log(`Efecto de sangre creado dinámicamente para ${loser.id}`);
                  }
                }
                
                // Añadir la clase de perdedor
                if (loserCard) {
                  loserCard.classList.remove(styles.scanning);
                  loserCard.classList.add(styles.loser);
                  console.log(`Personaje ${loser.id} marcado como perdedor`);
                }
                
                // Ocultar el láser y el destello después de un breve tiempo
                setTimeout(() => {
                  if (laserBeamRef.current) {
                    laserBeamRef.current.style.display = 'none';
                  }
                  if (gunshotFlashRef.current) {
                    gunshotFlashRef.current.style.display = 'none';
                  }
                  
                  // Continuar con el siguiente perdedor
                  setTimeout(() => {
                    eliminateLoser(index + 1);
                  }, 500);
                }, 500);
              }, 300);
            }, 800);
          } else {
            // Si no se encuentra el elemento, pasar al siguiente
            console.error(`Error: No se encontró el elemento con id character-${loser.id} o sniperRef.current es null`);
            eliminateLoser(index + 1);
          }
        };
        
        // Iniciar la eliminación con el primer perdedor
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
    
    // Ocultar los efectos de sangre
    Object.values(bloodSplatterRefs.current).forEach(ref => {
      if (ref) ref.style.display = 'none';
    });
    
    // Resetear los estados
    setSelectedCharacterId(null);
    setShowSelectionAnimation(false);
    setEliminationStep(0);
  };

  // Función para iniciar manualmente la animación (para pruebas)
  const triggerSelectionAnimation = () => {
    console.log("Activando animación de selección manualmente");
    startSelectionAndElimination();
  };

  // Inicializar las referencias de salpicaduras de sangre
  useEffect(() => {
    // Inicializar bloodSplatterRefs vacío
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

      {/* Modal de cuenta regresiva */}
      <div className={`
        ${styles.countdownModal} 
        ${(showCountdown || showFinalMessage) ? styles.countdownModalVisible : ''} 
        ${isFadingOut ? styles.countdownModalFading : ''}
      `}
        style={{ display: (showCountdown || showFinalMessage) ? 'flex' : 'none' }}
      >
        {/* Botón para cerrar el modal */}
        <button 
          className={styles.modalCloseButton}
          onClick={forceHideModal}
          aria-label="Cerrar"
        >
          ×
        </button>
        
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

      {/* Botón de prueba para activar la animación (solo para depuración) */}
      <button 
        onClick={triggerSelectionAnimation}
        style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: '10px', 
          zIndex: 1100,
          background: 'red',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          cursor: 'pointer'
        }}
      >
        Activar Animación
      </button>

      {/* Contenedor principal del juego */}
      <div className={styles.mainGameArea}>
        {/* Lista de jugadores a la izquierda (solo desktop) */}
        {!isMobile && (
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
            className={isSmallMobile ? `${styles.charactersGrid} ${styles.mobileGrid}` : styles.charactersGrid}
          >
            {renderCharacterCards()}
          </div>

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
            
            {/* Botón de depuración para forzar el cierre del modal */}
            {(showCountdown || showFinalMessage) && (
              <button 
                className={styles.placeBetButton} 
                onClick={forceHideModal} 
                style={{ position: 'absolute', right: '10px', bottom: '10px', zIndex: 1001 }}
              >
                Cerrar Modal
              </button>
            )}
          </div>

          {/* Tabs para móvil - siempre presente en dispositivos móviles */}
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
        </div>

        {/* Área de chat a la derecha (solo desktop) */}
        {!isMobile && (
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

      {/* Barra de notificaciones en la parte inferior */}
      <div className={styles.notificationsBar}>
        <div className={styles.notificationsScroller}>
          {notifications.map((notification, index) => (
            <span key={index} className={styles.notificationItem}>
              {notification}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}