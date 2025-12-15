const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-white">DONATIONS</h2>
          <p className="mt-3 text-gray-400">
            A secure way to support causes that matter.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <a href="/" className="hover:text-blue-500">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-blue-500">
                About
              </a>
            </li>
            <li>
              <a href="/products" className="hover:text-blue-500">
                Products
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-blue-500">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <li>
              <a href="/" className="hover:text-blue-500">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-blue-500">
                About
              </a>
            </li>
            <li>
              <a href="/products" className="hover:text-blue-500">
                Products
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-blue-500">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">Contact Us</h3>
          <p className="mt-3 text-gray-400">Email: support@example.com</p>
          <p className="text-gray-400">Phone: +880 1234 567890</p>
        </div>
      </div>

      <div className="text-center mt-10 text-gray-500 text-sm">
        © {new Date().getFullYear()} DONATIONS — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
