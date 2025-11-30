"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

interface DeliveryAnimationProps {
  className?: string;
}

interface PromoBanner {
  id: number;
  title: string;
  subtitle: string;
  badge?: string;
  icon: string;
  gradient: string;
}

interface LiveAd {
  id: number;
  text: string;
  badge?: string;
  gradient: string;
}

const liveAdvertisements: LiveAd[] = [
  {
    id: 1,
    text: "Free Delivery on Orders Over $50 - Order Now!",
    badge: "HOT",
    gradient: "from-orange-500 to-red-500"
  },
  {
    id: 2,
    text: "Weekend Special: 50% Off All Items - Limited Time!",
    badge: "SALE",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    text: "New Arrivals Every Day - Fresh Products Available!",
    badge: "NEW",
    gradient: "from-yellow-400 to-orange-500"
  },
  {
    id: 4,
    text: "Flash Sale: Up to 70% Off - Shop Now Before It's Gone!",
    badge: "FLASH",
    gradient: "from-blue-500 to-purple-500"
  },
  {
    id: 5,
    text: "Bulk Orders Get Special Discounts - Contact Us Today!",
    badge: "DEAL",
    gradient: "from-green-500 to-teal-500"
  },
  {
    id: 6,
    text: "Premium Quality Guaranteed - Satisfaction 100%!",
    badge: "PREMIUM",
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    id: 7,
    text: "Express Delivery Available - Get It in 15 Minutes!",
    badge: "FAST",
    gradient: "from-red-500 to-orange-500"
  },
  {
    id: 8,
    text: "Join Our Loyalty Program - Earn Points with Every Purchase!",
    badge: "REWARD",
    gradient: "from-pink-500 to-red-500"
  }
];

const promotionalBanners: PromoBanner[] = [
  {
    id: 1,
    title: "Free Delivery",
    subtitle: "On orders over $50",
    badge: "HOT",
    icon: "🚚",
    gradient: "from-orange-500 via-red-500 to-pink-500"
  },
  {
    id: 2,
    title: "50% Off",
    subtitle: "Weekend Special",
    badge: "SALE",
    icon: "🎉",
    gradient: "from-purple-500 via-pink-500 to-red-500"
  },
  {
    id: 3,
    title: "New Arrivals",
    subtitle: "Fresh daily",
    badge: "NEW",
    icon: "⭐",
    gradient: "from-yellow-400 via-orange-500 to-red-500"
  },
  {
    id: 4,
    title: "Flash Sale",
    subtitle: "Limited time only",
    badge: "FLASH",
    icon: "⚡",
    gradient: "from-blue-500 via-purple-500 to-pink-500"
  }
];

const DeliveryAnimation = ({ className }: DeliveryAnimationProps) => {
  const [currentPromo, setCurrentPromo] = useState(0);
  const duplicatedAds = [...liveAdvertisements, ...liveAdvertisements];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promotionalBanners.length);
    }, 4000); // Change promo every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const activePromo = promotionalBanners[currentPromo];

  return (
    <div className={clsx("w-full overflow-hidden", className)}>
      <div className="relative h-28 sm:h-32 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-yellow-950/20 rounded-xl border-2 border-orange-200 dark:border-orange-800 overflow-hidden shadow-lg">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              currentColor 10px,
              currentColor 20px
            )`,
          }} />
        </div>

        {/* Main Content */}
        <div className="relative h-full flex items-center">
          {/* Left: Delivery Truck & Info */}
          <div className="flex-shrink-0 px-4 sm:px-6 z-10">
            <div className="flex items-center gap-3">
              <div 
                className="text-4xl sm:text-5xl"
                style={{
                  animation: "move-truck 2s ease-in-out infinite",
                }}
              >
                🚚
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-orange-600 dark:text-orange-400">
                  Fast Delivery
                </h3>
                <p className="text-xs text-default-600 dark:text-default-400">
                  30-45 min delivery
                </p>
              </div>
            </div>
          </div>

          {/* Center: Scrolling Live Advertisements (Desktop Only) */}
          <div className="flex-1 overflow-hidden relative hidden md:block">
            <div 
              className="flex items-center gap-8"
              style={{
                animation: "scroll-ads 60s linear infinite",
              }}
            >
              {duplicatedAds.map((ad, index) => (
                <div
                  key={`${ad.id}-${index}`}
                  className="flex-shrink-0 flex items-center gap-3 px-6"
                >
                  {ad.badge && (
                    <span className={clsx(
                      "px-3 py-1 text-[10px] font-bold rounded-full text-white uppercase tracking-wide whitespace-nowrap",
                      "bg-gradient-to-r",
                      ad.gradient,
                      "shadow-md"
                    )}>
                      {ad.badge}
                    </span>
                  )}
                  <span className="text-sm sm:text-base font-semibold text-foreground whitespace-nowrap">
                    {ad.text}
                  </span>
                  <div className={clsx(
                    "w-2 h-2 rounded-full",
                    "bg-gradient-to-r",
                    ad.gradient
                  )} />
                </div>
              ))}
            </div>
          </div>

          {/* Center: Rotating Promotional Banner (Mobile/Desktop) */}
          <div className="flex-1 overflow-hidden relative md:hidden px-4">
            <div className="h-full flex items-center justify-center">
              <div
                key={currentPromo}
                className="flex items-center gap-3 animate-slide-in"
                style={{
                  animation: "slideInPromo 0.5s ease-out",
                }}
              >
                <div className={clsx(
                  "text-3xl animate-bounce",
                  "bg-gradient-to-br",
                  activePromo.gradient,
                  "bg-clip-text text-transparent"
                )}>
                  {activePromo.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-foreground">
                      {activePromo.title}
                    </p>
                    {activePromo.badge && (
                      <span className={clsx(
                        "px-2 py-0.5 text-[10px] font-bold rounded-full text-white",
                        "bg-gradient-to-r",
                        activePromo.gradient,
                        "shadow-sm animate-pulse"
                      )}>
                        {activePromo.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-default-600 dark:text-default-400">
                    {activePromo.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Promotional Banner (Desktop) */}
          <div className="flex-shrink-0 px-4 sm:px-6 z-10 hidden md:block">
            <div 
              key={currentPromo}
              className="text-right animate-fade-in"
              style={{
                animation: "fadeInPromo 0.5s ease-out",
              }}
            >
              <div className="flex items-center justify-end gap-2 mb-1">
                {activePromo.badge && (
                  <span className={clsx(
                    "px-2.5 py-1 text-[10px] font-bold rounded-full text-white uppercase tracking-wide",
                    "bg-gradient-to-r",
                    activePromo.gradient,
                    "shadow-md animate-pulse"
                  )}>
                    {activePromo.badge}
                  </span>
                )}
                <span className={clsx(
                  "text-2xl",
                  "bg-gradient-to-br",
                  activePromo.gradient,
                  "bg-clip-text text-transparent"
                )}>
                  {activePromo.icon}
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-foreground mb-0.5">
                {activePromo.title}
              </p>
              <p className="text-xs text-default-600 dark:text-default-400">
                {activePromo.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Promo Indicators (Desktop) */}
        <div className="absolute bottom-2 right-6 hidden md:flex gap-1.5 z-10">
          {promotionalBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPromo(index)}
              className={clsx(
                "h-1.5 rounded-full transition-all duration-300",
                currentPromo === index
                  ? "w-6 bg-orange-500"
                  : "w-1.5 bg-orange-300/50 hover:bg-orange-400"
              )}
              aria-label={`View promotion ${index + 1}`}
            />
          ))}
        </div>

        {/* Shine Effect */}
        <div 
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{
            animation: "shine-ads 3s ease-in-out infinite",
          }}
        />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll-ads {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes shine-ads {
            0% { transform: translateX(-100%); }
            50%, 100% { transform: translateX(200%); }
          }
          @keyframes move-truck {
            0%, 100% { 
              transform: translateX(0) translateY(0) rotate(0deg);
            }
            25% { 
              transform: translateX(3px) translateY(-2px) rotate(-1deg);
            }
            50% { 
              transform: translateX(6px) translateY(0) rotate(0deg);
            }
            75% { 
              transform: translateX(3px) translateY(-2px) rotate(1deg);
            }
          }
          @keyframes slideInPromo {
            0% {
              opacity: 0;
              transform: translateX(20px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes fadeInPromo {
            0% {
              opacity: 0;
              transform: translateY(-10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slide-in {
            animation: slideInPromo 0.5s ease-out;
          }
          .animate-fade-in {
            animation: fadeInPromo 0.5s ease-out;
          }
        `
      }} />
    </div>
  );
};

export default DeliveryAnimation;
