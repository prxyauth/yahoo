
const Footer = () => {
  const links = ["Terms", "Privacy", "Your Privacy Choices", "Help"];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e0dce5] py-3">
      <div className="mx-auto max-w-[1200px] px-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#6e6d7a]">
          {links.map((link) => (
            <a
              key={link}
              href="#"
              className="hover:underline hover:text-[#6001d2]"
            >
              {link}
            </a>
          ))}
        </div>
        <div className="text-xs text-[#6e6d7a]">© 2026 Yahoo</div>
      </div>
    </footer>
  );
};

export default Footer;
