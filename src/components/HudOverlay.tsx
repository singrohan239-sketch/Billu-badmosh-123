import { Maximize, Activity, Zap } from 'lucide-react';

export function HudOverlay() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-4 md:p-8 font-mono text-[#00D9FF] text-xs select-none flicker overflow-hidden">
      
      {/* Top Row */}
      <div className="flex justify-between items-start">
        <div className="hud-panel px-4 py-1.5 flex items-center gap-3">
          <Zap size={14} className="text-[#7FFFFF]" />
          <span className="tracking-widest opacity-90">UID: JARVIS-CAT-01</span>
        </div>
        
        <div className="text-right">
          <h1 className="text-2xl md:text-3xl tracking-widest text-glow mb-1 font-bold">J.A.R.V.I.S</h1>
          <p className="text-[10px] tracking-widest opacity-60">HOLOGRAPHIC PROJECTION SYS_V2</p>
        </div>
      </div>

      {/* Middle Row (Left/Right Panels) */}
      <div className="flex justify-between items-center flex-1 py-4">
        {/* Left Target Reticle */}
        <div className="hidden md:flex flex-col gap-10 opacity-40 ml-4">
          <div className="w-4 h-4 border-t-2 border-l-2 border-[#00D9FF]"></div>
          <div className="w-4 h-4 border-b-2 border-l-2 border-[#00D9FF]"></div>
        </div>

        {/* Right Details Panel */}
        <div className="hud-panel p-5 w-56 md:w-64 text-[10px] leading-relaxed self-end md:self-auto pointer-events-auto transition-transform hover:scale-105 mr-4">
          <div className="grid grid-cols-[80px_1fr] gap-2.5 mb-5">
            <span className="opacity-50 tracking-widest">SPECIES</span><span className="tracking-wider text-right">FELIS CATUS</span>
            <span className="opacity-50 tracking-widest">STATUS</span><span className="text-[#7FFFFF] tracking-wider text-right text-glow">ACTIVE</span>
            <span className="opacity-50 tracking-widest">MODE</span><span className="tracking-wider text-right">INTERACTIVE</span>
            <span className="opacity-50 tracking-widest">MOTION</span><span className="tracking-wider text-right text-[#7FFFFF]">DETECTED</span>
          </div>

          {/* Fake charts / UI elements */}
          <div className="border-t border-[#00D9FF]/20 pt-5 flex items-center justify-between">
             <div className="flex flex-col gap-[4px] w-28">
                <div className="h-[1px] bg-[#00D9FF]/20 w-full overflow-hidden"><div className="h-full bg-[#00D9FF] w-3/4 animate-pulse"></div></div>
                <div className="h-[1px] bg-[#00D9FF]/20 w-full overflow-hidden"><div className="h-full bg-[#00D9FF] w-1/2 animate-pulse" style={{ animationDelay: '200ms'}}></div></div>
                <div className="h-[1px] bg-[#00D9FF]/20 w-full overflow-hidden"><div className="h-full bg-[#00D9FF] w-5/6 animate-pulse" style={{ animationDelay: '400ms'}}></div></div>
                <div className="text-[8px] opacity-60 mt-2 tracking-widest flex items-center gap-1.5"><Activity size={10}/> STREAM ACTIVE</div>
             </div>
             <div className="w-9 h-9 rounded-full border border-[#00D9FF]/50 flex items-center justify-center cursor-pointer hover:bg-[#00D9FF]/20 hover:box-glow transition-all">
                <Maximize size={14} />
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex justify-center items-end pointer-events-auto mb-2">
         <div className="hud-panel px-8 py-2.5 flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-[#7FFFFF] animate-pulse"></div>
            <span className="tracking-widest text-glow opacity-90">
              SYSTEM READY: DRAG TO ROTATE
            </span>
         </div>
      </div>

      {/* Scanlines Effect */}
      <div className="scanlines"></div>
    </div>
  );
}
