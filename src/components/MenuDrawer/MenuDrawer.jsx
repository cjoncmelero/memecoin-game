"use client";

import { useState } from "react";
import styles from "./MenuDrawer.module.css";

export default function MenuDrawer() {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setIsClosing(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 420); // Debe coincidir con la duración de la animación de salida
  };

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
            <div className={isClosing ? styles.leftPanelOut : styles.leftPanel}></div>
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
                  <li><a href="#">Personajes</a></li>
                  <li><a href="#">Lugares</a></li>
                  <li><a href="#">Tráilers</a></li>
                  <li><a href="#">Descargas</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 