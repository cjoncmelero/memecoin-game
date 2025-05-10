"use client";

import dynamic from 'next/dynamic';

// Importar los componentes de forma dinámica con opciones optimizadas
const Background = dynamic(() => import('../components/Background/Background'), { 
  ssr: false, 
  loading: () => null 
});

const MenuDrawer = dynamic(() => import('../components/MenuDrawer/MenuDrawer'), { 
  ssr: false, 
  loading: () => null 
});

const HeroHeader = dynamic(() => import('../components/HeroHeader/HeroHeader'), { 
  ssr: false, 
  loading: () => null 
});

const SquidGameParallax = dynamic(() => import('../components/Decoration/SquidGameParallax'), { 
  ssr: false, 
  loading: () => null 
});

const GameIntro = dynamic(() => import('../components/GameIntro/GameIntro'), { 
  ssr: false, 
  loading: () => null 
});

const GameRules = dynamic(() => import('../components/GameRules/GameRules'), { 
  ssr: false, 
  loading: () => null 
});

export default function Home() {
  return (
    <div className="relative min-h-screen font-sans text-base">
      <MenuDrawer />
      <Background />
      <SquidGameParallax />
      <main>
        <HeroHeader />
        <GameIntro />
        <div className="relative" style={{ marginTop: '-15vh' }} id="game-rules">
          <GameRules />
        </div>
        <div className="py-20 px-4 max-w-6xl mx-auto">
          {/* Contenido adicional de la página */}
        </div>
      </main>
    </div>
  );
}
