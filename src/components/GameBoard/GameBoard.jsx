"use client";

import { useState } from 'react';
import styles from './GameBoard.module.css';

export default function GameBoard() {
  // Estados para manejar los diferentes elementos del juego (sin lógica, solo estructura)
  const [balance, setBalance] = useState(2345.67);
  const [chatInput, setChatInput] = useState("");
  const [showAllEmojis, setShowAllEmojis] = useState(false);
  
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

  return (
    <div className={styles.gameContainer}>
      {/* Logo en la parte superior */}
      <div className={styles.logoHeader}>
        <h1 className={styles.logo}>MEME GAME</h1>
      </div>

      {/* Información del balance del usuario */}
      <div className={styles.balanceContainer}>
        <span className={styles.balanceLabel}>BALANCE</span>
        <span className={styles.balanceAmount}>${balance.toFixed(2)}</span>
      </div>

      {/* Contenedor principal del juego */}
      <div className={styles.mainGameArea}>
        {/* Lista de jugadores a la izquierda */}
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

        {/* Área central con los personajes y apuestas */}
        <div className={styles.charactersContainer}>
          <div className={styles.potInfo}>
            <span className={styles.potLabel}>TOTAL APOSTADO</span>
            <span className={styles.potAmount}>$3000</span>
          </div>

          <div className={styles.charactersGrid}>
            {characters.map(character => (
              <div 
                key={character.id} 
                className={`${styles.characterCard} ${styles[character.id]}`}
                data-multiplier={character.multiplier}
              >
                <div className={styles.characterImageContainer}>
                  <img 
                    src={character.img} 
                    alt={character.name} 
                    className={styles.characterImage}
                  />
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
              </div>
            ))}
          </div>
        </div>

        {/* Área de chat a la derecha */}
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