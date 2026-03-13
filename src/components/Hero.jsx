import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  // Stagger variants for text lines
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="relative w-full min-h-[60vh] lg:h-[70vh] flex items-center overflow-hidden px-6 lg:px-12 py-12 lg:py-0">
      {/* Background glow or shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          className="flex flex-col items-start text-left"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-300">Available for new opportunities</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight"
          >
            Hi, I am <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Yemi</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed mb-10"
          >
            A product designer focused on creating dynamic, intuitive, and beautiful user experiences that drive impact. Based in London, working globally.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <a href="#projects" className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 active:scale-95 transition-transform duration-300">
              View My Work
            </a>
            <a href="#contact" className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-full hover:bg-gray-700 hover:scale-105 active:scale-95 transition-all duration-300 border border-gray-700 hover:border-gray-500">
              Let's Talk
            </a>
          </motion.div>
        </motion.div>

        {/* Right Visual (Animation) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 50 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-md lg:max-w-full aspect-square lg:aspect-video rounded-3xl overflow-hidden border border-gray-800 bg-gray-900/30 backdrop-blur-3xl shadow-2xl group">
            <img 
              src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJsc3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3R4Z3ZSZ3ZSZ3ZSZ3ZSZ3ZSZ3ZSZ3ZSZ3ZSZ3ZSZ3ZS/3o7TKMGpxS7TKG-N44/giphy.gif" 
              alt="Design Animation" 
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 pointer-events-none" />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-pulse" />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 hidden lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.5, duration: 1 } }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-[1px] h-6 bg-gradient-to-b from-gray-500 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
