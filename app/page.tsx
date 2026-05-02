'use client';

import { useRef } from 'react';
import { useHabitStore } from '@/lib/store';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ReactLenis } from 'lenis/react';
import { ArrowUpRight, Terminal, BrainCircuit, Activity, Clock, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const setAuthModalOpen = useHabitStore((s) => s.setAuthModalOpen);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrubWords = "Motivation is a myth. Discipline is a system. GRIND removes the friction of choice so you can execute the things that matter most, every single day.".split(" ");

  useGSAP(() => {
    // 1. Hero Text Parallax Marquee
    gsap.to('.hero-text-1', { xPercent: -15, ease: 'none', scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to('.hero-text-2', { xPercent: 15, ease: 'none', scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 1 } });

    // 2. Infinite Marquee
    gsap.to('.marquee-inner', {
      xPercent: -50,
      ease: 'none',
      duration: 20,
      repeat: -1
    });

    // 3. Scrubbing Text Reveal
    gsap.to('.scrub-word', {
      opacity: 1,
      stagger: 0.1,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: '.scrub-container',
        start: 'top 70%',
        end: 'bottom 60%',
        scrub: 1,
      }
    });

    // 4. Horizontal Scroll Pinning (Desktop Only)
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const wrapper = document.querySelector('.horizontal-scroll-wrapper');
      const panels = gsap.utils.toArray('.h-panel');
      if (wrapper && panels.length > 0) {
        gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            pin: true,
            scrub: 1,
            snap: 1 / (panels.length - 1),
            end: () => "+=" + (wrapper as HTMLElement).offsetWidth * (panels.length - 1)
          }
        });
      }
    });

    // 5. Image Scale Reveals
    gsap.utils.toArray('.reveal-img').forEach((img: any) => {
      gsap.fromTo(img, 
        { scale: 0.8, filter: 'grayscale(100%) contrast(1.2)' },
        { scale: 1, filter: 'grayscale(20%) contrast(1)', duration: 1.5, ease: 'expo.out', 
          scrollTrigger: { trigger: img, start: 'top 85%' }
        }
      );
    });

    // 6. Fade Sections
    gsap.utils.toArray('.fade-section').forEach((section: any) => {
      gsap.fromTo(section,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 80%' } }
      );
    });

  }, { scope: containerRef });

  return (
    <ReactLenis root>
      <main ref={containerRef} className="bg-[#FDFBF7] text-[#0A0A0A] min-h-[100dvh] overflow-x-hidden selection:bg-emerald-500 selection:text-white font-sans w-full max-w-full relative">
      
      {/* Impeccable Design Overlay: Fine Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 pointer-events-none">
        <div className="flex items-center gap-6 md:gap-12 px-6 md:px-8 py-3 bg-white/90 backdrop-blur-xl rounded-full border border-black/5 shadow-[0_8px_32px_rgba(0,0,0,0.04)] pointer-events-auto">
          <div className="font-medium tracking-tight text-base md:text-lg flex items-center gap-2">
            <Terminal size={18} /> GRIND.
          </div>
          <button 
            onClick={() => setAuthModalOpen(true)}
            className="group flex items-center gap-2 text-[10px] md:text-[11px] font-mono uppercase tracking-widest bg-black text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-500"
          >
            Authenticate
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform hidden md:block" />
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="hero-section min-h-[100dvh] flex flex-col justify-center pt-32 pb-20 overflow-hidden relative">
        <div className="w-full relative z-10 flex flex-col gap-2 md:gap-4 px-4 md:px-0">
          
          <h1 className="hero-text-1 text-[clamp(3.2rem,11vw,12rem)] leading-[0.85] font-light tracking-tighter uppercase whitespace-nowrap pl-0 md:pl-12">
            SHAPE <span className="inline-block w-16 md:w-72 h-10 md:h-32 rounded-full bg-cover bg-center align-middle mx-2 md:mx-6 shadow-2xl reveal-img" style={{backgroundImage: 'url(https://picsum.photos/seed/geometry/800/400)'}} /> YOUR
          </h1>
          
          <h1 className="hero-text-2 text-[clamp(3.2rem,11vw,12rem)] leading-[0.85] font-light tracking-tighter uppercase whitespace-nowrap flex items-center justify-end pr-0 md:pr-12">
            <span className="inline-block w-12 md:w-56 h-10 md:h-32 rounded-[2rem] bg-cover bg-center align-middle mx-2 md:mx-6 shadow-2xl reveal-img" style={{backgroundImage: 'url(https://picsum.photos/seed/architecture/800/400)'}} /> DIGITAL
          </h1>
          
          <h1 className="hero-text-1 text-[clamp(3.2rem,11vw,12rem)] leading-[0.85] font-light tracking-tighter uppercase whitespace-nowrap pl-4 md:pl-32">
            ROUTINE <span className="text-emerald-500">.</span>
          </h1>

          <div className="mt-16 md:mt-24 pl-4 md:pl-12 max-w-lg">
            <p className="text-[#0A0A0A]/60 text-base md:text-xl font-light leading-relaxed">
              The terminal-native habit tracker that strips away noise and automates discipline for developers.
            </p>
            <div className="mt-8 flex items-center gap-6">
               <button 
                onClick={() => setAuthModalOpen(true)} 
                className="px-8 py-4 bg-black text-white rounded-full text-xs font-medium uppercase tracking-widest hover:bg-emerald-500 transition-colors shadow-xl"
               >
                 Start Executing
               </button>
               <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-mono uppercase tracking-widest text-black/40">System Operational</span>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── METRICS MARQUEE ─── */}
      <div className="w-full border-y border-black/10 py-5 bg-white/50 backdrop-blur-sm overflow-hidden flex relative z-10">
        <div className="marquee-inner flex whitespace-nowrap" style={{ width: '200%' }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16 font-mono text-[10px] md:text-xs uppercase tracking-widest text-black/40 items-center justify-around w-1/2">
              <span>100% Telemetry</span>
              <span className="text-emerald-500">✦</span>
              <span>Zero Gamification</span>
              <span className="text-emerald-500">✦</span>
              <span>Automated Discipline</span>
              <span className="text-emerald-500">✦</span>
              <span>Neural Integration</span>
              <span className="text-emerald-500">✦</span>
              <span>Developer Focused</span>
              <span className="text-emerald-500">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── DESIRE: SCRUBBING TEXT REVEAL ─── */}
      <section className="scrub-container min-h-[60dvh] md:min-h-[80dvh] flex items-center justify-center px-6 md:px-12 bg-[#0A0A0A] text-[#FDFBF7] py-24 md:py-0 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-[clamp(2rem,4vw,4.5rem)] leading-[1.2] font-medium tracking-tight">
            {scrubWords.map((word, i) => (
              <span key={i} className="scrub-word inline-block mr-[0.3em]" style={{opacity: 0.15}}>
                {word}
              </span>
            ))}
          </h2>
        </div>
      </section>

      {/* ─── SYSTEM ARCHITECTURE BENTO ─── */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="mb-16">
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-black/40 mb-4 flex items-center gap-2"><ShieldCheck size={14}/> Architecture Overview</h2>
          <h3 className="text-4xl md:text-6xl font-light tracking-tight">Built for <br/> strict execution.</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="md:col-span-2 bg-white rounded-[2rem] p-8 md:p-12 border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[320px] group hover:border-black/10 transition-colors fade-section">
             <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-12"><Terminal size={20}/></div>
             <div>
               <h4 className="text-2xl font-medium mb-3">Terminal Native Interface</h4>
               <p className="text-black/50 font-light text-lg max-w-lg leading-relaxed">The core interface is designed to feel like a powerful IDE. Minimal clicks, high information density, completely stripped of noisy notifications.</p>
             </div>
          </div>
          {/* Card 2 */}
          <div className="md:col-span-1 bg-[#0A0A0A] text-[#FDFBF7] rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.1)] flex flex-col justify-between min-h-[320px] relative overflow-hidden group fade-section">
             <div className="absolute -right-10 -top-10 w-48 h-48 bg-emerald-500/20 blur-[50px] rounded-full group-hover:bg-emerald-500/40 transition-colors duration-700" />
             <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center mb-12 relative z-10"><BrainCircuit size={20}/></div>
             <div className="relative z-10">
               <h4 className="text-2xl font-medium mb-3">Neural Directives</h4>
               <p className="text-white/60 font-light leading-relaxed">Powered by advanced LLMs for daily insights, adaptive focus areas, and path evolution.</p>
             </div>
          </div>
          {/* Card 3 */}
          <div className="md:col-span-3 bg-white rounded-[2rem] p-8 md:p-12 border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col md:flex-row justify-between items-start md:items-center gap-10 fade-section">
             <div className="flex-1">
               <h4 className="text-2xl font-medium mb-3">Frictionless Execution</h4>
               <p className="text-black/50 font-light max-w-lg leading-relaxed">Zero loading screens. Zero cloud latency. Your entire protocol is engineered to execute at the speed of thought, keeping you locked in the flow state.</p>
             </div>
             <div className="flex flex-wrap gap-3">
               {['Deep Work', 'Zero Latency', 'Focus-Driven', 'Offline Capable'].map(tag => (
                 <div key={tag} className="px-4 py-2 rounded-full border border-black/10 text-[10px] font-mono uppercase tracking-widest text-black/60 bg-black/5">{tag}</div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* ─── PATH EVOLUTION TIMELINE ─── */}
      <section className="py-32 md:py-48 px-6 md:px-12 max-w-7xl mx-auto relative z-10 border-t border-black/5">
        <div className="text-center mb-24 max-w-3xl mx-auto fade-section">
          <h2 className="text-[clamp(3rem,6vw,6rem)] leading-[0.9] font-light tracking-tighter mb-6">Path Evolution.</h2>
          <p className="text-lg md:text-xl text-[#0A0A0A]/60 font-light leading-relaxed">A structured, algorithmic progression from foundation to mastery. The neural engine continuously adjusts your trajectory based on execution velocity.</p>
        </div>

        <div className="relative">
          {/* Vertical tracking line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-black/10 hidden md:block" />
          
          <div className="space-y-16 md:space-y-32">
            {/* Phase 1 */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 group fade-section">
              <div className="flex-1 md:text-right w-full">
                 <div className="text-[10px] font-mono uppercase tracking-widest text-black/40 mb-3">Phase 01</div>
                 <h4 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">Baseline Calibration</h4>
                 <p className="text-black/60 font-light max-w-md md:ml-auto leading-relaxed">The system tracks your raw input and consistency limits. Establishing the structural bedrock before optimizing your schedule.</p>
              </div>
              <div className="w-4 h-4 rounded-full bg-emerald-500 hidden md:block z-10 ring-8 ring-[#FDFBF7]" />
              <div className="flex-1 w-full">
                 {/* Custom CSS Mockup instead of vague image */}
                 <div className="w-full h-[280px] rounded-[2rem] bg-white border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.04)] p-8 flex flex-col justify-between transition-transform duration-700 group-hover:-translate-y-2">
                    <div className="flex items-center gap-2 mb-6 border-b border-black/5 pb-4">
                      <div className="w-2 h-2 rounded-full bg-black/20" />
                      <div className="w-2 h-2 rounded-full bg-black/20" />
                      <div className="w-2 h-2 rounded-full bg-black/20" />
                    </div>
                    <div className="space-y-4">
                      <div className="w-3/4 h-3 bg-black/5 rounded-full" />
                      <div className="w-1/2 h-3 bg-black/5 rounded-full" />
                      <div className="w-full h-3 bg-black/5 rounded-full" />
                    </div>
                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-black/5">
                      <span className="text-[10px] font-mono uppercase text-black/40">Status: Calibrating</span>
                      <div className="w-8 h-8 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                    </div>
                 </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8 md:gap-16 group fade-section">
              <div className="flex-1 w-full">
                 <div className="text-[10px] font-mono uppercase tracking-widest text-black/40 mb-3">Phase 02</div>
                 <h4 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">Adaptive Overload</h4>
                 <p className="text-black/60 font-light max-w-md leading-relaxed">Dynamic scheduling activates. The LLM begins rotating your focus areas between deep work, targeted learning, and maintenance.</p>
              </div>
              <div className="w-4 h-4 rounded-full bg-black/10 group-hover:bg-emerald-500 transition-colors duration-500 hidden md:block z-10 ring-8 ring-[#FDFBF7]" />
              <div className="flex-1 w-full">
                 {/* Custom CSS Mockup instead of vague image */}
                 <div className="w-full h-[280px] rounded-[2rem] bg-[#0A0A0A] shadow-[0_20px_60px_rgba(0,0,0,0.1)] p-8 flex flex-col justify-between transition-transform duration-700 group-hover:-translate-y-2 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/20 blur-[30px] rounded-full" />
                    <div className="grid grid-cols-2 gap-4 relative z-10 h-full">
                      <div className="bg-white/5 rounded-xl border border-white/10 p-4 flex flex-col justify-between">
                         <span className="text-[10px] font-mono uppercase text-white/40">Node Alpha</span>
                         <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs">A</div>
                      </div>
                      <div className="bg-white/5 rounded-xl border border-white/10 p-4 flex flex-col justify-between">
                         <span className="text-[10px] font-mono uppercase text-white/40">Node Beta</span>
                         <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs">B</div>
                      </div>
                      <div className="col-span-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 p-4 flex items-center justify-between mt-auto">
                         <span className="text-[10px] font-mono uppercase text-emerald-500">Rotation Initiated</span>
                         <Activity size={14} className="text-emerald-500" />
                      </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 group fade-section">
              <div className="flex-1 md:text-right w-full">
                 <div className="text-[10px] font-mono uppercase tracking-widest text-black/40 mb-3">Phase 03</div>
                 <h4 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">Autonomous Execution</h4>
                 <p className="text-black/60 font-light max-w-md md:ml-auto leading-relaxed">Complete system sync. You no longer plan; you only execute. The terminal dictates the optimal daily path for maximum throughput.</p>
              </div>
              <div className="w-4 h-4 rounded-full bg-black/10 group-hover:bg-emerald-500 transition-colors duration-500 hidden md:block z-10 ring-8 ring-[#FDFBF7]" />
              <div className="flex-1 w-full">
                 {/* Custom CSS Mockup instead of vague image */}
                 <div className="w-full h-[280px] rounded-[2rem] bg-white border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.04)] p-8 flex flex-col justify-center gap-8 transition-transform duration-700 group-hover:-translate-y-2">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white shadow-md"><Terminal size={16}/></div>
                      <div className="flex-1 h-3 bg-black/5 rounded-full overflow-hidden"><div className="w-full h-full bg-black" /></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center text-black/40"><BrainCircuit size={16}/></div>
                      <div className="flex-1 h-3 bg-black/5 rounded-full overflow-hidden"><div className="w-[80%] h-full bg-emerald-500" /></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center text-black/40"><ShieldCheck size={16}/></div>
                      <div className="flex-1 h-3 bg-black/5 rounded-full overflow-hidden"><div className="w-[60%] h-full bg-black/20" /></div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTEREST: HORIZONTAL PINNED GALLERY ─── */}
      <div className="horizontal-scroll-wrapper w-full overflow-hidden bg-[#FDFBF7] border-t border-black/5 relative z-10">
        <div className="horizontal-scroll-track flex flex-col md:flex-row w-full md:w-[300vw]">
          
          {/* Panel 1 */}
          <section className="h-panel w-full md:w-screen min-h-[60vh] md:min-h-screen shrink-0 flex items-center justify-center px-6 md:px-24 py-16 md:py-0">
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="space-y-6 md:space-y-8 order-2 md:order-1">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <BrainCircuit size={28} strokeWidth={1.5} />
                </div>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter">Oracle <br className="hidden md:block"/> Directives.</h2>
                <p className="text-lg md:text-xl text-[#0A0A0A]/60 font-light max-w-md leading-relaxed">
                  Daily strategic briefings synthesized by advanced LLMs. It analyzes your telemetry and path stage to output precise focus areas.
                </p>
              </div>
              <div className="h-[40vh] md:h-[70vh] rounded-[2rem] bg-cover bg-center shadow-2xl reveal-img order-1 md:order-2 relative flex items-center justify-center" style={{backgroundImage: 'url(https://picsum.photos/seed/code/800/1200)'}}>
                 <div className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl w-64 md:w-80 border border-black/5">
                   <div className="text-[10px] font-mono uppercase text-emerald-600 mb-2">New Directive Payload</div>
                   <div className="text-sm font-medium leading-snug">"Focus on advanced state management today. Refactor the habit store."</div>
                 </div>
              </div>
            </div>
          </section>

          {/* Panel 2 */}
          <section className="h-panel w-full md:w-screen min-h-[60vh] md:min-h-screen shrink-0 flex items-center justify-center px-6 md:px-24 py-16 md:py-0 bg-[#EBE8E0]">
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="h-[40vh] md:h-[70vh] rounded-[2rem] bg-cover bg-center shadow-2xl reveal-img relative flex items-center justify-center" style={{backgroundImage: 'url(https://picsum.photos/seed/system/800/1200)'}}>
                 <div className="bg-black/80 backdrop-blur-md p-6 rounded-2xl shadow-xl w-64 md:w-80 border border-white/10 text-white">
                   <div className="text-[10px] font-mono uppercase text-white/50 mb-4">Active Rotation</div>
                   <div className="space-y-3">
                     <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2"><span>Frontend Mastery</span><span className="text-emerald-400">●</span></div>
                     <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2 text-white/40"><span>Algorithms</span></div>
                   </div>
                 </div>
              </div>
              <div className="space-y-6 md:space-y-8">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/5 flex items-center justify-center text-black">
                  <Clock size={28} strokeWidth={1.5} />
                </div>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter">Dynamic <br className="hidden md:block"/> Rotation.</h2>
                <p className="text-lg md:text-xl text-[#0A0A0A]/60 font-light max-w-md leading-relaxed">
                  Automated scheduling for development sprints and college subjects. The system intelligently rotates your active protocols.
                </p>
              </div>
            </div>
          </section>

          {/* Panel 3 */}
          <section className="h-panel w-full md:w-screen min-h-[60vh] md:min-h-screen shrink-0 flex items-center justify-center px-6 md:px-24 py-16 md:py-0">
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
              <div className="space-y-6 md:space-y-8 order-2 md:order-1">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-black/5 flex items-center justify-center text-black">
                  <Activity size={28} strokeWidth={1.5} />
                </div>
                <h2 className="text-5xl md:text-7xl font-light tracking-tighter">Deep <br className="hidden md:block"/> Telemetry.</h2>
                <p className="text-lg md:text-xl text-[#0A0A0A]/60 font-light max-w-md leading-relaxed">
                  Visual analytics of consistency, mood, and peak output capacity. Absolute visibility into your execution metrics.
                </p>
              </div>
              <div className="h-[40vh] md:h-[70vh] rounded-[2rem] bg-[#0A0A0A] shadow-2xl p-8 md:p-12 flex flex-col justify-end text-[#FDFBF7] relative overflow-hidden group order-1 md:order-2">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-end border-b border-white/20 pb-4">
                    <span className="font-mono uppercase tracking-widest text-xs opacity-50">Completion</span>
                    <span className="text-4xl md:text-6xl font-light">84%</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/20 pb-4">
                    <span className="font-mono uppercase tracking-widest text-xs opacity-50">Active Streak</span>
                    <span className="text-4xl md:text-6xl font-light">12d</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* ─── THE ANTI-FEATURE WALL (NEW) ─── */}
      <section className="py-32 md:py-48 px-6 md:px-12 bg-black text-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 md:mb-32 fade-section">
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-4">Design Philosophy</h2>
            <h3 className="text-[clamp(3rem,6vw,6rem)] leading-[0.9] font-light tracking-tighter">Addition by <br/> <span className="italic font-serif text-white/50">subtraction.</span></h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
            <div className="border-t border-white/20 pt-8 fade-section">
              <div className="text-emerald-500 font-mono text-xs mb-8 uppercase tracking-widest">Rule 01</div>
              <h4 className="text-3xl font-medium mb-4">No Gamification.</h4>
              <p className="text-white/50 font-light leading-relaxed text-lg">We don't treat your career like a mobile game. No arbitrary points, no badges, no confetti. Just raw telemetry and execution data.</p>
            </div>
            <div className="border-t border-white/20 pt-8 fade-section">
              <div className="text-emerald-500 font-mono text-xs mb-8 uppercase tracking-widest">Rule 02</div>
              <h4 className="text-3xl font-medium mb-4">No Social Noise.</h4>
              <p className="text-white/50 font-light leading-relaxed text-lg">Productivity is a single-player game. There are no leaderboards, no feeds, and no sharing buttons. Your routine is yours alone.</p>
            </div>
            <div className="border-t border-white/20 pt-8 fade-section">
              <div className="text-emerald-500 font-mono text-xs mb-8 uppercase tracking-widest">Rule 03</div>
              <h4 className="text-3xl font-medium mb-4">No Interruptions.</h4>
              <p className="text-white/50 font-light leading-relaxed text-lg">The system never sends push notifications. It waits silently in the terminal until you are ready to review your directives and log progress.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTION: MASSIVE CTA ─── */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20 text-center bg-[#0A0A0A] text-[#FDFBF7] relative z-10 border-t border-white/10">
        <div className="space-y-12 max-w-4xl w-full">
          <h2 className="text-[clamp(3.5rem,8vw,8rem)] leading-[0.9] font-light tracking-tighter fade-section">
            INITIALIZE <br className="hidden md:block" />
            <span className="text-emerald-500 italic font-serif">WORKSPACE.</span>
          </h2>
          
          <div className="flex justify-center fade-section">
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="group flex items-center gap-4 md:gap-6 bg-[#FDFBF7] text-[#0A0A0A] px-8 py-4 md:px-10 md:py-5 rounded-full text-base md:text-lg font-medium tracking-wide hover:scale-105 transition-all duration-700 ease-out shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              Authenticate
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#0A0A0A]/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowUpRight size={18} />
              </div>
            </button>
          </div>
          
          <div className="pt-12 text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#FDFBF7]/30 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 fade-section">
            <span>GRIND &copy; 2026</span>
            <span className="hidden md:inline">|</span>
            <span>Zero Gamification</span>
          </div>
        </div>
      </section>

    </main>
    </ReactLenis>
  );
}
