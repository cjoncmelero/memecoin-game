"use client";

import dynamic from 'next/dynamic';

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

const GameObjectives = dynamic(() => import('../components/GameObjectives/GameObjectives'), { 
  ssr: false, 
  loading: () => null 
});

const GameFlow = dynamic(() => import('../components/GameFlow/GameFlow'), { 
  ssr: false, 
  loading: () => null 
});

const CasinoRevenueSplit = dynamic(() => import('../components/CasinoRevenueSplit/CasinoRevenueSplit'), {
  ssr: false,
  loading: () => null
});

const Footer = dynamic(() => import('../components/Footer/Footer'), { 
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
        <section id="objetivos-del-juego">
        <GameObjectives />
        </section>
        <section id="como-jugar">
        <GameFlow />
        </section>
        <section id="reglas-del-juego">
        <GameRules />
        </section>
        <div className="py-20 px-4 max-w-6xl mx-auto">
        </div>
        <CasinoRevenueSplit />
      </main>
      <section id="contacto">
      <Footer />
      </section>
    </div>
  );
}
