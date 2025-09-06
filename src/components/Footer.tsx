import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://alfabiz.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Alfabiz Soluções
          </a>
          . Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
