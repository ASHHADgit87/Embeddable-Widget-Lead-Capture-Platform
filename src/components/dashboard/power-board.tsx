"use client";

const CURRENT_COLOR = "#34c281";

interface PowerBoardProps {
  powered: boolean;
  onToggle: () => void;
  socketRef: (el: HTMLDivElement | null) => void;
}

export function PowerBoard({ powered, onToggle, socketRef }: PowerBoardProps) {
  return (
    <div className="relative hidden w-[64px] shrink-0 rounded-xl border border-[#4a4a56] bg-gradient-to-b from-[#3a3a42] to-[#232329] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.55)] sm:flex sm:flex-col sm:items-center">
      <div className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#15151a] shadow-inner" />
      <div className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#15151a] shadow-inner" />
      <div className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-[#15151a] shadow-inner" />
      <div className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#15151a] shadow-inner" />

      <div
        ref={socketRef}
        className="relative mt-2 flex h-9 w-9 items-center justify-center rounded-full border border-[#15151a] bg-[#15151a] shadow-[inset_0_2px_6px_rgba(0,0,0,0.7)]"
      >
        <div className="grid grid-cols-2 gap-1">
          <div className="h-1.5 w-1 rounded-full bg-[#3a3a42]" />
          <div className="h-1.5 w-1 rounded-full bg-[#3a3a42]" />
        </div>
        <span
          className="absolute -right-1 -top-1 h-2 w-2 rounded-full transition-colors duration-300"
          style={{
            backgroundColor: powered ? CURRENT_COLOR : "#4a4a56",
            boxShadow: powered ? `0 0 8px 2px ${CURRENT_COLOR}` : "none",
          }}
        />
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="mt-3 flex w-full flex-col items-center gap-1 rounded-lg border border-[#15151a] bg-[#1c1c20] py-2 transition hover:brightness-125"
      >
        <span
          className="h-2.5 w-2.5 rounded-full transition-colors duration-300"
          style={{
            backgroundColor: powered ? CURRENT_COLOR : "#4a4a56",
            boxShadow: powered ? `0 0 10px 3px ${CURRENT_COLOR}` : "none",
          }}
        />
        <span className="font-mono text-[8px] uppercase tracking-widest text-white/50">
          {powered ? "On" : "Off"}
        </span>
      </button>
    </div>
  );
}
