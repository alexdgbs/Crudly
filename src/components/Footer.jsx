import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 border-t text-black font-medium py-4 text-center text-xs">
      <div className="container mx-auto px-4 md:px-6">
      <p>&copy; {currentYear} Crudly</p>
      </div>
    </footer>
  );
};

export default Footer;