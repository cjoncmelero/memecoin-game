"use client";
import { useState } from 'react';
import styles from './DebugModals.module.css';
import gameBoardStyles from '../GameBoard/GameBoard.module.css'; // Para reutilizar estilos del modal principal

export default function DebugModals() {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);

  const openModal = (message) => {
    setModalMessage(message);
    setIsFadingOut(false); // Resetear el estado de fadeOut al abrir
    setShowModal(true);
  };

  const closeModal = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setShowModal(false);
      setIsFadingOut(false); // Resetear para la próxima vez que se abra
    }, 500); // Coincide con la duración de la animación fadeOutModal (0.5s)
  };

  // No renderizar nada si no hay mensaje (o el modal no está visible)
  // if (!showModal) return null; // Alternativa: controlar visibilidad con display en el div principal

  return (
    <>
      <div className={styles.debugButtonContainer}>
        <button 
          onClick={() => openModal("Victoria")} 
          className={styles.debugButton}
        >
          Mostrar Victoria
        </button>
        <button 
          onClick={() => openModal("Derrota")} 
          className={`${styles.debugButton} ${styles.defeatButtonTheme}`}
        >
          Mostrar Derrota
        </button>
      </div>

      {showModal && (
        <div
          className={`
            ${gameBoardStyles.countdownModal} 
            ${gameBoardStyles.countdownModalVisible} 
            ${isFadingOut ? gameBoardStyles.countdownModalFading : ''}
            ${styles.debugResultModal} 
          `}
          // style={{ display: showModal ? 'flex' : 'none' }} // Controlado por la clase countdownModalVisible y el renderizado condicional
        >
          <button
            className={gameBoardStyles.modalCloseButton}
            onClick={closeModal}
            aria-label="Cerrar"
          >
            ×
          </button>
          <div className={`${gameBoardStyles.countdownContent} ${styles.debugModalContentStyles}`}>
            <div className={`
              ${gameBoardStyles.countdownMessage} 
              ${isFadingOut ? gameBoardStyles.countdownMessageFading : ''} 
              ${styles.resultText} 
              ${modalMessage === "Victoria" ? styles.victoryText : styles.defeatText}
            `}>
              {modalMessage}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 