import { HologramScene } from './components/HologramScene';
import { HudOverlay } from './components/HudOverlay';

export default function App() {
  return (
    <div className="w-full h-screen bg-[#010308] overflow-hidden relative flex items-center justify-center">
      <HologramScene />
      <HudOverlay />
    </div>
  );
}
