import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./scroll-stack.css";

export const ScrollStackItem = ({
  children,
  index = 0,
  totalItems = 1,
  itemDistance = 40,
  itemClassName = ""
}) => {
  const ref = useRef(null);

  // Track scroll position of this specific card relative to the top of the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Smooth clean fade as the card is covered by the next one to eliminate misaligned double borders
  const opacity = useTransform(scrollYProgress, [0, 0.08, 0.2], [1, 0.1, 0]);

  // Use a clean unified sticky top with generous breathing room below the fixed navbar
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const stickyTop = isMobile ? 90 : 120;

  return (
    <motion.div
      ref={ref}
      style={{
        position: "sticky",
        top: `${stickyTop}px`,
        opacity,
        willChange: "opacity",
        transformOrigin: "top center",
        zIndex: index + 1
      }}
      className={`scroll-stack-card ${itemClassName}`.trim()}
    >
      {children}
    </motion.div>
  );
};

export const ScrollStack = ({
  children,
  itemDistance = 40,
  className = "",
  useWindowScroll = false,
  ...props
}) => {
  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const trackPadding = (totalItems - 1) * (isMobile ? 10 : 20);

  return (
    <div 
      className={`relative w-full ${className}`} 
      style={{ paddingBottom: `${trackPadding}px`, ...props.style }}
      {...props}
    >
      {childrenArray.map((child, index) => {
        // Pass index and totalItems props to each ScrollStackItem child
        return React.cloneElement(child, {
          index,
          totalItems,
          itemDistance
        });
      })}
    </div>
  );
};

export default ScrollStack;
