const Footer = () => {
  return (
    <footer id="contact" className="mt-auto w-full bg-text px-4 py-10 text-background sm:px-6 lg:px-8">
      <div className="relative mx-auto grid max-w-[1500px] gap-8 md:grid-cols-2 md:items-end md:gap-0">
        <div className="min-w-0 md:pr-8">
          <p className="flex items-center gap-2 text-sm font-black text-green-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" aria-hidden="true" />
            Available for new work
          </p>
          <h2 className="mt-2 w-full text-5xl font-black leading-none md:text-[clamp(3.25rem,4.8vw,4.5rem)]">
            <span className="block md:whitespace-nowrap">Let's make the next</span>
            <span className="block md:whitespace-nowrap">piece worth scrolling for.</span>
          </h2>
        </div>
        <div className="flex flex-wrap gap-5 text-sm font-bold uppercase md:justify-self-end md:pl-8">
          <a href="https://www.behance.net/yemiui" target="_blank" rel="noreferrer" className="hover:text-primary">Behance</a>
          <a href="https://www.linkedin.com/in/yemi-aiyeola-598a9a225/" target="_blank" rel="noreferrer" className="hover:text-primary">LinkedIn</a>
          <a href="mailto:yemi_aiyeola@hotmail.com" className="hover:text-primary">Email</a>
        </div>
        <p className="text-xs font-bold uppercase opacity-50 md:absolute md:right-0 md:top-0">&copy; {new Date().getFullYear()} Yemi</p>
      </div>
    </footer>
  );
};

export default Footer;
