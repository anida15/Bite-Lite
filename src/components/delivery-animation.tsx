"use client";

import clsx from "clsx";

interface DeliveryAnimationProps {
  className?: string;
}

const foodItems = [
  "🍕", "🍔", "🍟", "🌮", "🍰", "🍗", "🥗", "🍜", "🍝", "🍱", "🥘", "🍲"
];

const DeliveryAnimation = ({ className }: DeliveryAnimationProps) => {
  const duplicatedItems = [...foodItems, ...foodItems];

  return (
    <div className={clsx("w-full overflow-hidden", className)}>
      <div className="relative h-24 sm:h-28 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-yellow-950/20 rounded-xl border-2 border-orange-200 dark:border-orange-800 overflow-hidden shadow-lg">
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

        <div className="relative h-full flex items-center">
          <div className="flex-shrink-0 px-4 sm:px-6 z-10">
            <div className="flex items-center gap-2">
              <div 
                className="text-3xl sm:text-4xl"
                style={{
                  animation: "move-truck 2s ease-in-out infinite",
                }}
              >
                🚚
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-orange-600 dark:text-orange-400">
                  Fresh Food
                </h3>
                <p className="text-xs text-default-600 dark:text-default-400">
                  Fast Delivery
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <div 
              className="flex items-center gap-6 sm:gap-8"
              style={{
                animation: "scroll-food 20s linear infinite",
              }}
            >
              {duplicatedItems.map((emoji, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 text-4xl sm:text-5xl select-none"
                  style={{
                    animation: `float-food 3s ease-in-out infinite`,
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 px-4 sm:px-6 z-10">
            <div className="text-right">
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                Order Now!
              </p>
              <p className="text-[10px] sm:text-xs text-default-500">
                🎉 Special Offers
              </p>
            </div>
          </div>
        </div>

        <div 
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            animation: "shine-food 3s ease-in-out infinite",
          }}
        />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes scroll-food {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes float-food {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
          }
          @keyframes shine-food {
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
        `
      }} />
    </div>
  );
};

export default DeliveryAnimation;

