"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Wrench, Clock, Zap, Settings, Server, Cpu, Activity } from "lucide-react";
import gsap from "gsap";

export default function MaintenancePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroIconRef = useRef<HTMLDivElement>(null);
  const floatingIconsRef = useRef<HTMLDivElement[]>([]);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  const [countdown, setCountdown] = useState("Calculating...");
  const [progress, setProgress] = useState(0);

  // Memoized end time (2 hours from now)
  const endTime = useMemo(() => new Date().getTime() + 2 * 60 * 60 * 1000, []);

  // Countdown and progress logic
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        setCountdown("Maintenance Complete!");
        setProgress(100);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );

      const totalTime = 2 * 60 * 60 * 1000;
      const elapsed = totalTime - distance;
      setProgress(Math.min((elapsed / totalTime) * 100, 100));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  // Progress bar animation
  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${progress}%`,
        duration: 0.8,
        ease: "power2.out"
      });
    }
  }, [progress]);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial page load animation
      const tl = gsap.timeline();
      
      // Hero icon entrance
      if (heroIconRef.current) {
        tl.set(heroIconRef.current, { scale: 0, rotation: -180 })
          .to(heroIconRef.current, {
            scale: 1,
            rotation: 0,
            duration: 1.2,
            ease: "back.out(1.7)"
          });
      }

      // Container entrance
      if (containerRef.current) {
        tl.set(containerRef.current, { y: 100, opacity: 0 })
          .to(containerRef.current, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out"
          }, "-=0.5");
      }

      // Floating icons animation
      floatingIconsRef.current.forEach((icon, index) => {
        if (icon) {
          gsap.set(icon, { 
            x: gsap.utils.random(-50, 50),
            y: gsap.utils.random(-50, 50),
            rotation: gsap.utils.random(-45, 45),
            scale: gsap.utils.random(0.8, 1.2)
          });
          
          gsap.to(icon, {
            y: "+=30",
            x: "+=20",
            rotation: "+=180",
            duration: gsap.utils.random(3, 6),
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: index * 0.2
          });
        }
      });

      // Particles animation
      particlesRef.current.forEach((particle, index) => {
        if (particle) {
          gsap.set(particle, {
            x: gsap.utils.random(-200, 200),
            y: gsap.utils.random(-200, 200),
            scale: gsap.utils.random(0.5, 1),
            opacity: gsap.utils.random(0.3, 0.8)
          });

          gsap.to(particle, {
            y: "-=100",
            x: `+=${gsap.utils.random(-50, 50)}`,
            rotation: 360,
            opacity: 0,
            duration: gsap.utils.random(8, 15),
            repeat: -1,
            ease: "none",
            delay: index * gsap.utils.random(0, 3)
          });
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Add floating icon ref
  const addToFloatingRefs = (el: HTMLDivElement | null) => {
    if (el && !floatingIconsRef.current.includes(el)) {
      floatingIconsRef.current.push(el);
    }
  };

  // Add particle ref
  const addToParticleRefs = (el: HTMLDivElement | null) => {
    if (el && !particlesRef.current.includes(el)) {
      particlesRef.current.push(el);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen text-white overflow-hidden">
      {/* Floating Background Particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`particle-${i}`}
          ref={addToParticleRefs}
          className="absolute w-2 h-2 bg-maintenance-primary rounded-full opacity-30"
        />
      ))}

      {/* Floating Icons Background */}
      {[
        { Icon: Settings, position: "top-1/4 left-1/4" },
        { Icon: Server, position: "top-1/3 right-1/4" },
        { Icon: Cpu, position: "bottom-1/3 left-1/3" },
        { Icon: Activity, position: "bottom-1/4 right-1/3" },
        { Icon: Clock, position: "top-1/2 left-1/6" },
        { Icon: Zap, position: "bottom-1/2 right-1/6" }
      ].map(({ Icon, position }, index) => (
        <div
          key={`floating-${index}`}
          ref={addToFloatingRefs}
          className={`absolute ${position} opacity-20`}
        >
          <Icon size={24} className="text-maintenance-secondary" />
        </div>
      ))}

      {/* Main Content */}
      <div
        ref={containerRef}
        className="glass-panel max-w-md mx-4 p-8 rounded-3xl space-y-8 z-10 pulse-glow"
      >
        {/* Hero Icon */}
        <div className="text-center">
          <div
            ref={heroIconRef}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-maintenance-primary/20 mb-6"
          >
            <Wrench className="w-10 h-10 text-maintenance-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2 gradient-text">
            Under Maintenance
          </h1>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-maintenance-primary to-maintenance-secondary rounded-full" />
        </div>

        {/* Status Message */}
        <div className="text-center space-y-3">
          <p className="text-lg text-muted-foreground">
            We're upgrading our systems to serve you better.
          </p>
          <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
            <Clock className="w-4 h-4 text-maintenance-secondary" />
            <span className="font-mono text-sm">
              {countdown}
            </span>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-maintenance-primary">
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className="relative">
            <div className="w-full h-3 bg-secondary/50 rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-maintenance-primary to-maintenance-secondary rounded-full transition-all duration-300"
                style={{ width: "0%" }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent h-3 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 0.2, 0.4].map((delay, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-maintenance-primary rounded-full animate-pulse"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-maintenance-glass-border/30">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} System Serenade. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}