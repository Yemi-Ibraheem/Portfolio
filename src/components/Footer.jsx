import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="contact" className="mt-auto w-full bg-text px-4 py-10 text-background sm:px-6 lg:px-8">
      <div className="relative mx-auto flex max-w-[1500px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black uppercase opacity-60">Available for new work</p>
          <h2 className="mt-2 max-w-3xl text-5xl font-black leading-none md:text-7xl">Let's make the next piece worth scrolling for.</h2>
        </div>
        <div className="flex flex-wrap gap-5 text-sm font-bold uppercase">
          <a href="https://www.behance.net/yemiui" target="_blank" rel="noreferrer" className="hover:text-primary">Behance</a>
          <a href="mailto:hello@yemi.design" className="hover:text-primary">Email</a>
          <Link to="/admin" className="opacity-60 hover:opacity-100">CMS</Link>
        </div>
        <p className="text-xs font-bold uppercase opacity-50 md:absolute md:bottom-0 md:left-0">&copy; {new Date().getFullYear()} Yemi</p>
      </div>
    </footer>
  );
};

export default Footer;
