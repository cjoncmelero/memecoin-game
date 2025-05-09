import Hero from '../components/Hero/Hero';
import Features from '../components/Features/Features';
import Footer from '../components/Footer/Footer';
import SocialButtons from '../components/SocialButtons/SocialButtons';
import GameStats from '../components/GameStats/GameStats';
import Background from '../components/Background/Background';
import MenuDrawer from '../components/MenuDrawer/MenuDrawer';

export default function Home() {
  return (
    <div className="relative min-h-screen font-sans text-base">
      <MenuDrawer />
      <Background />
      <SocialButtons />
      <main>
        <Hero />
        <GameStats />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
