import Background from '../../components/Background/Background';
import GameBoard from '../../components/GameBoard/GameBoard.jsx';

export default function GamePage() {
  return (
    <div className="relative min-h-screen w-full font-sans text-base overflow-hidden">
      <Background />
      <main className="w-full h-full">
        <GameBoard />
      </main>
    </div>
  );
} 