import Background from '../../components/Background/Background';
import SocialButtons from '../../components/SocialButtons/SocialButtons';
import Footer from '../../components/Footer/Footer';
import GameBoard from '../../components/GameBoard/GameBoard.jsx';

export default function GamePage() {
  return (
    <div className="relative min-h-screen font-sans text-base">
      <Background />
      <SocialButtons />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
          <span className="bg-gradient-to-r from-white to-pink-500 bg-clip-text text-transparent">
            Memecoin Game
          </span>
        </h1>
        <GameBoard />
      </main>
      <Footer />
    </div>
  );
} 