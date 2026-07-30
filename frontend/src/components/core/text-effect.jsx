import { motion } from 'framer-motion';
import React from 'react';

const defaultContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const defaultPresetVariants = {
  fade: {
    hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  },
  slide: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  },
};

export function TextEffect({
  children,
  per = 'char',
  preset = 'fade',
  className = '',
  as: Component = 'span',
  delay = 0,
  variants = {},
}) {
  if (typeof children !== 'string') {
    return <Component className={className}>{children}</Component>;
  }

  const itemVariants = variants.item || defaultPresetVariants[preset] || defaultPresetVariants.fade;
  const containerVariants = {
    ...defaultContainerVariants,
    visible: {
      ...defaultContainerVariants.visible,
      transition: {
        delayChildren: delay,
        staggerChildren: per === 'char' ? 0.03 : 0.08,
      },
    },
    ...variants.container,
  };

  const MotionComponent = motion[Component] || motion.span;

  if (per === 'char') {
    const words = children.split(' ');
    return (
      <MotionComponent
        className={`inline-block ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: '0.3em' }}>
            {Array.from(word).map((char, charIndex) => (
              <motion.span
                key={charIndex}
                style={{ display: 'inline-block' }}
                variants={itemVariants}
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </MotionComponent>
    );
  }

  if (per === 'word') {
    const words = children.split(' ');
    return (
      <MotionComponent
        className={`inline-block ${className}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {words.map((word, wordIndex) => (
          <motion.span
            key={wordIndex}
            style={{ display: 'inline-block', marginRight: '0.3em' }}
            variants={itemVariants}
          >
            {word}
          </motion.span>
        ))}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.span className="inline-block" variants={itemVariants}>
        {children}
      </motion.span>
    </MotionComponent>
  );
}
