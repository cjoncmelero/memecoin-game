"use client";

import { useState, useEffect } from "react";
import styles from "./MenuDrawer.module.css";

const leftPanelImages = {
  default: "https://coingape.com/wp-content/uploads/2024/11/How-a-Memecoin-Investor-Turned-26-Into-61.5M.webp",
  personajes: "https://coingape.com/wp-content/uploads/2024/11/How-a-Memecoin-Investor-Turned-26-Into-61.5M.webp",
  lugares: "https://coingape.com/wp-content/uploads/2024/11/How-a-Memecoin-Investor-Turned-26-Into-61.5M.webp",
  trailers: "https://coingape.com/wp-content/uploads/2024/11/How-a-Memecoin-Investor-Turned-26-Into-61.5M.webp",
  descargas: "https://coingape.com/wp-content/uploads/2024/11/How-a-Memecoin-Investor-Turned-26-Into-61.5M.webp",
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
      case "personajes":
        return leftPanelImages.personajes;
      case "lugares":
        return leftPanelImages.lugares;
      case "trailers":
        return leftPanelImages.trailers;
      case "descargas":
        return leftPanelImages.descargas;
      default:
        return leftPanelImages.default;
    }
  };

  // Si no estamos en el cliente, renderizamos un botón sin funcionalidad
  if (!isClient) {
    return (
      <button
        type="button"
        className={styles.menuButton}
      >
        <div className={styles.iconWrapper}>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
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
        className={styles.menuButton}
        onClick={handleOpen}
      >
        <div className={styles.iconWrapper}>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
        </div>
        <span className={styles.srOnly}>Ampliar el menú de navegación</span>
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
                    <a href="#"
                      onMouseEnter={() => setHovered("personajes")}
                      onMouseLeave={() => setHovered(null)}
                    >Personajes</a>
                  </li>
                  <li>
                    <a href="#"
                      onMouseEnter={() => setHovered("lugares")}
                      onMouseLeave={() => setHovered(null)}
                    >Lugares</a>
                  </li>
                  <li>
                    <a href="#"
                      onMouseEnter={() => setHovered("trailers")}
                      onMouseLeave={() => setHovered(null)}
                    >Tráilers</a>
                  </li>
                  <li>
                    <a href="#"
                      onMouseEnter={() => setHovered("descargas")}
                      onMouseLeave={() => setHovered(null)}
                    >Descargas</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 