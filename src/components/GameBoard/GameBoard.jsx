"use client";

import { useState, useEffect } from 'react';
import styles from './GameBoard.module.css';

export default function GameBoard() {
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, gameOver
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [coins, setCoins] = useState([]);
  
  // Generar posiciones aleatorias para las monedas
  const generateRandomCoins = (count) => {
    const newCoins = [];
    for (let i = 0; i < count; i++) {
      newCoins.push({
        id: `coin-${Date.now()}-${i}`,
        top: `${Math.random() * 80}%`,
        left: `${Math.random() * 80}%`,
        delay: Math.random() * 0.5
      });
    }
    return newCoins;
  };
  
  // Iniciar el juego
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    setCoins(generateRandomCoins(5));
    
    // Iniciar el temporizador
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameState('gameOver');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };
  
  // Regenerar monedas cuando se hacen clic
  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        if (coins.length < 5) {
          setCoins(prevCoins => [...prevCoins, ...generateRandomCoins(1)]);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [gameState, coins.length]);
  
  // Incrementar la puntuación cuando se hace clic en un memecoin
  const handleCoinClick = (coinId) => {
    if (gameState === 'playing') {
      setScore(prevScore => prevScore + 1);
      setCoins(prevCoins => prevCoins.filter(coin => coin.id !== coinId));
    }
  };
  
  return (
    <div className={styles.gameBoard}>
      <div className={styles.gameInfo}>
        <div className={styles.scoreContainer}>
          <h2>Puntuación</h2>
          <p className={styles.score}>{score}</p>
        </div>
        
        <div className={styles.timeContainer}>
          <h2>Tiempo</h2>
          <p className={styles.time}>{timeLeft}s</p>
        </div>
      </div>
      
      {gameState === 'waiting' && (
        <div className={styles.startScreen}>
          <h2>¿Estás listo?</h2>
          <p>Haz clic en todos los memecoins que puedas en 60 segundos.</p>
          <button className={styles.startButton} onClick={startGame}>
            ¡Empezar!
          </button>
        </div>
      )}
      
      {gameState === 'playing' && (
        <div className={styles.playArea}>
          {coins.map(coin => (
            <div 
              key={coin.id}
              className={styles.coin} 
              style={{ 
                top: coin.top, 
                left: coin.left,
                animationDelay: `${coin.delay}s`
              }}
              onClick={() => handleCoinClick(coin.id)}
            >
              🪙
            </div>
          ))}
        </div>
      )}
      
      {gameState === 'gameOver' && (
        <div className={styles.endScreen}>
          <h2>¡Tiempo Agotado!</h2>
          <p>Has conseguido <span className={styles.finalScore}>{score}</span> memecoins</p>
          <button className={styles.restartButton} onClick={startGame}>
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}