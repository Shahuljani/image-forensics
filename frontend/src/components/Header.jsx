import React from "react";

function Header() {
  return (
    <header className="bg-gray-900 text-white shadow-md p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
        {/* Logo and description */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            PixProof
          </h1>
          <p className="mt-2 text-gray-300 text-sm md:text-base">
            Verify images instantly. Know what’s real and what’s not.
          </p>
        </div>

        {/* Optional space for nav or future elements */}
        <nav>
          <ul className="flex gap-8 text-lg font-medium">
            {/* Empty for now */}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
