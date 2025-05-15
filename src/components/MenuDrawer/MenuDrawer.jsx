"use client";

import { useState, useEffect } from "react";
import styles from "./MenuDrawer.module.css";

const leftPanelImages = {
  default: "https://coingape.com/wp-content/uploads/2024/11/How-a-Memecoin-Investor-Turned-26-Into-61.5M.webp",
  reglasJuego: "https://coingape.com/wp-content/uploads/2024/11/How-a-Memecoin-Investor-Turned-26-Into-61.5M.webp",
  objetivosJuego: "https://coingape.com/wp-content/uploads/2024/11/How-a-Memecoin-Investor-Turned-26-Into-61.5M.webp",
  comoJugar: "https://coingape.com/wp-content/uploads/2024/11/How-a-Memecoin-Investor-Turned-26-Into-61.5M.webp",
  contacto: "https://coingape.com/wp-content/uploads/2024/11/How-a-Memecoin-Investor-Turned-26-Into-61.5M.webp",
};

export default function MenuDrawer() {
  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setIsClosing(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 420);
  };

  const getLeftPanelClass = () => {
    if (isClosing) {
      return styles.leftPanelOut;
    }
    return styles.leftPanelImg;
  };

  const getLeftPanelImage = () => {
    if (isClosing) return leftPanelImages.default;
    switch (hovered) {
      case "reglasJuego":
        return leftPanelImages.reglasJuego;
      case "objetivosJuego":
        return leftPanelImages.objetivosJuego;
      case "comoJugar":
        return leftPanelImages.comoJugar;
      case "contacto":
        return leftPanelImages.contacto;
      default:
        return leftPanelImages.default;
    }
  };

  // Si no estamos en el cliente, renderizamos un botón sin funcionalidad
  if (!isClient) {
    return (
      <button type="button" className={styles.menuButton}>
        <div className={styles.iconWrapper}>
          {/* SVG Icon: Placeholder simple - se reemplazará con uno más temático */}
          <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="4" rx="2" fill="#222"/>
            <rect y="8" width="28" height="4" rx="2" fill="#222"/>
            <rect y="16" width="28" height="4" rx="2" fill="#222"/>
          </svg>
        </div>
        <span className={styles.srOnly}>Ampliar el menú de navegación</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="menu-drawer"
        data-state={open ? "open" : "closed"}
        data-pressed={open}
        className={`${styles.menuButton} ${open ? styles.menuButtonOpen : ''}`}
        onClick={open ? handleClose : handleOpen}
      >
        <div className={styles.iconWrapper}>
          {/* SVG Icon: Este es el que se animará y estilizará más */}
          <svg className={styles.menuIconSvg} width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className={`${styles.menuIconLine} ${styles.menuIconLineTop}`} d="M2 4H26" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path className={`${styles.menuIconLine} ${styles.menuIconLineMiddle}`} d="M2 12H26" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path className={`${styles.menuIconLine} ${styles.menuIconLineBottom}`} d="M2 20H26" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className={styles.srOnly}>{(open ? "Cerrar" : "Ampliar")} el menú de navegación</span>
      </button>

      {(open || isClosing) && (
        <div className={isClosing ? styles.drawerOverlayOut : styles.drawerOverlay}>
          <div className={isClosing ? styles.drawerContainerOut : styles.drawerContainer} id="menu-drawer" role="dialog" aria-modal="true">
            <div className={getLeftPanelClass()} style={{ backgroundImage: `url('${getLeftPanelImage()}')` }}></div>
            <div className={isClosing ? styles.rightPanelOut : styles.rightPanel}>
              <button
                className={styles.closeButton}
                aria-label="Cerrar menú"
                onClick={handleClose}
              >
                ×
              </button>
              <nav className={styles.menuNav}>
                <ul>
                  <li>
                    <a href="#reglas-del-juego"
                      onClick={handleClose}
                      onMouseEnter={() => setHovered("reglasJuego")}
                      onMouseLeave={() => setHovered(null)}
                    >Reglas del Juego</a>
                  </li>
                  <li>
                    <a href="#objetivos-del-juego"
                      onClick={handleClose}
                      onMouseEnter={() => setHovered("objetivosJuego")}
                      onMouseLeave={() => setHovered(null)}
                    >Objetivos</a>
                  </li>
                  <li>
                    <a href="#como-jugar"
                      onClick={handleClose}
                      onMouseEnter={() => setHovered("comoJugar")}
                      onMouseLeave={() => setHovered(null)}
                    >Cómo Jugar</a>
                  </li>
                  <li>
                    <a href="#contacto"
                      onClick={handleClose}
                      onMouseEnter={() => setHovered("contacto")}
                      onMouseLeave={() => setHovered(null)}
                    >Contacto</a>
                  </li>
                </ul>
              </nav>
              
              {/* Elementos decorativos de esquina */}
              <div className={`${styles.cornerAccent} ${styles.cornerAccentTopLeft}`}></div>
              <div className={`${styles.cornerAccent} ${styles.cornerAccentTopRight}`}></div>
              <div className={`${styles.cornerAccent} ${styles.cornerAccentBottomLeft}`}></div>
              <div className={`${styles.cornerAccent} ${styles.cornerAccentBottomRight}`}></div>

            </div>
          </div>
        </div>
      )}
    </>
  );
} 