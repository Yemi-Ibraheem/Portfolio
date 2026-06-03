import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, ArrowUpRight } from 'lucide-react';

const Navbar = ({ theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { title: 'Work', path: '/#work' },
    { title: 'Process', path: '/#process' },
    { title: 'Contact', path: '/#contact' },
  ];

  const handleAnchorClick = (event, path) => {
    if (!path.includes('#')) return;

    const [, hash] = path.split('#');
    if (location.pathname !== '/') {
      setIsOpen(false);
      return;
    }

    event.preventDefault();
    setIsOpen(false);
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 z-50 w-full px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-14 max-w-[1500px] items-center justify-between rounded-full border border-glass-border bg-background/84 px-4 shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-black tracking-tight text-text">
            yemi.
          </Link>
          <button
            onClick={toggleTheme}
            className="grid h-9 w-9 place-items-center rounded-full border border-glass-border text-text-muted transition-colors hover:bg-surface hover:text-text"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.title}
              href={link.path}
              onClick={(event) => handleAnchorClick(event, link.path)}
              className="text-sm font-semibold text-text-muted transition-colors hover:text-text"
            >
              {link.title}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://www.linkedin.com/in/yemi-aiyeola-598a9a225/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-text px-5 text-sm font-bold text-background transition-transform hover:-translate-y-0.5"
          >
            LinkedIn
            <ArrowUpRight size={16} />
          </a>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="grid h-10 w-10 place-items-center rounded-full border border-glass-border text-text md:hidden"
          aria-label="Open menu"
        >
          {isOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mx-auto mt-3 max-w-[1500px] rounded-[24px] border border-glass-border bg-background/94 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.12)] backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.path}
                  onClick={(event) => handleAnchorClick(event, link.path)}
                  className="rounded-2xl px-4 py-3 text-base font-semibold text-text"
                >
                  {link.title}
                </a>
              ))}
            </div>
            <a
              href="https://www.linkedin.com/in/yemi-aiyeola-598a9a225/"
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-text px-5 py-3 text-sm font-bold text-background"
            >
              LinkedIn
              <ArrowUpRight size={16} />
            </a>
          </Motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
