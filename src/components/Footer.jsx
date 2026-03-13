import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full glass py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-text-muted">
        <p>&copy; {new Date().getFullYear()} Yemi. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="https://www.behance.net/yemiui" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Behance</a>
          <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
          <Link to="/admin" className="hover:text-primary transition-colors opacity-50 hover:opacity-100">Admin</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
