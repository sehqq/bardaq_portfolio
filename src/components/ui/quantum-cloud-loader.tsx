'use client'

export default function CloudLoader() {
  return (
    <div className="flex min-h-[500px] items-center justify-center overflow-hidden">
      <div className="relative isolate flex h-80 w-[560px] items-center justify-center">

        {/* Particle 1 — Fast inner particle */}
        <div className="absolute z-30 h-16 w-16 animate-quantum-p1">
          <div className="h-full w-full rounded-full bg-white shadow-[0_0_35px_rgba(255,255,255,0.9),0_0_75px_rgba(255,255,255,0.4)]" />
        </div>

        {/* Particle 2 — Large outer particle */}
        <div className="absolute z-10 h-20 w-20 animate-quantum-p2">
          <div className="h-full w-full rounded-full bg-white shadow-[0_0_45px_rgba(255,255,255,0.85),0_0_90px_rgba(255,255,255,0.35)]" />
        </div>

        {/* Particle 3 — Center oscillator */}
        <div className="absolute z-40 h-[70px] w-[70px] animate-quantum-p3">
          <div className="h-full w-full rounded-full bg-white shadow-[0_0_40px_rgba(255,255,255,0.9),0_0_80px_rgba(255,255,255,0.4)]" />
        </div>

        {/* Particle 4 — Slow orbital sweep */}
        <div className="absolute z-0 h-12 w-12 animate-quantum-p4">
          <div className="h-full w-full rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.8),0_0_65px_rgba(255,255,255,0.3)]" />
        </div>

      </div>

      <style>{`
        @keyframes quantum-p1 {
          0% {
            transform: translate3d(-160px, 25px, 0) scale(0.75);
            opacity: 0.4;
          }
          25% {
            transform: translate3d(-80px, -25px, 0) scale(0.95);
            opacity: 0.8;
          }
          50% {
            transform: translate3d(160px, 0, 0) scale(1.15);
            opacity: 1;
          }
          75% {
            transform: translate3d(80px, 25px, 0) scale(0.95);
            opacity: 0.8;
          }
          100% {
            transform: translate3d(-160px, 25px, 0) scale(0.75);
            opacity: 0.4;
          }
        }

        .animate-quantum-p1 {
          animation: quantum-p1 3.8s cubic-bezier(0.37, 0, 0.63, 1) infinite;
          will-change: transform, opacity;
        }

        @keyframes quantum-p2 {
          0% {
            transform: translate3d(130px, -15px, 0) scale(1);
            opacity: 0.95;
          }
          25% {
            transform: translate3d(65px, 25px, 0) scale(0.88);
            opacity: 0.7;
          }
          50% {
            transform: translate3d(-130px, 10px, 0) scale(0.68);
            opacity: 0.35;
          }
          75% {
            transform: translate3d(-65px, -25px, 0) scale(0.88);
            opacity: 0.7;
          }
          100% {
            transform: translate3d(130px, -15px, 0) scale(1);
            opacity: 0.95;
          }
        }

        .animate-quantum-p2 {
          animation: quantum-p2 5.6s cubic-bezier(0.37, 0, 0.63, 1) infinite;
          will-change: transform, opacity;
        }

        @keyframes quantum-p3 {
          0% {
            transform: translate3d(-95px, 8px, 0) scale(0.82);
            opacity: 0.6;
          }
          20% {
            transform: translate3d(-60px, -18px, 0) scale(0.94);
            opacity: 0.85;
          }
          50% {
            transform: translate3d(95px, 0, 0) scale(1.08);
            opacity: 1;
          }
          80% {
            transform: translate3d(60px, 18px, 0) scale(0.94);
            opacity: 0.85;
          }
          100% {
            transform: translate3d(-95px, 8px, 0) scale(0.82);
            opacity: 0.6;
          }
        }

        .animate-quantum-p3 {
          animation: quantum-p3 3.1s cubic-bezier(0.37, 0, 0.63, 1) infinite;
          will-change: transform, opacity;
        }

        @keyframes quantum-p4 {
          0% {
            transform: translate3d(220px, 20px, 0) scale(0.55);
            opacity: 0.25;
          }
          20% {
            transform: translate3d(145px, -18px, 0) scale(0.7);
            opacity: 0.45;
          }
          50% {
            transform: translate3d(0, 10px, 0) scale(1);
            opacity: 0.95;
          }
          80% {
            transform: translate3d(-145px, -18px, 0) scale(0.7);
            opacity: 0.45;
          }
          100% {
            transform: translate3d(-220px, 20px, 0) scale(0.55);
            opacity: 0.25;
          }
        }

        .animate-quantum-p4 {
          animation: quantum-p4 6.4s cubic-bezier(0.37, 0, 0.63, 1) infinite alternate;
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-quantum-p1,
          .animate-quantum-p2,
          .animate-quantum-p3,
          .animate-quantum-p4 {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

export { CloudLoader }
