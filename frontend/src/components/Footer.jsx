import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* About Section */}
        <div>
          <h2 className="text-white text-xl font-semibold mb-3">About PixProof</h2>
          <p className="text-gray-400 text-sm">
            PixProof is a modern image verification platform that helps you
            identify real and fake images instantly. Powered by advanced AI
            and image forensics technology, we make authenticity simple and
            reliable.
          </p>
        </div>

        {/* Features / Services */}
        <div>
          <h2 className="text-white text-xl font-semibold mb-3">Features</h2>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>Instant image analysis</li>
            <li>Pixel-level authenticity checks</li>
            <li>Detailed forensic reports</li>
            <li>Camera capture & file upload</li>
            <li>Cross-platform accessibility</li>
          </ul>
        </div>

        {/* Info / Contact */}
        <div>
          <h2 className="text-white text-xl font-semibold mb-3">Quick Info</h2>
          <p className="text-gray-400 text-sm mb-2">
            Built with modern web technologies including React, Flask, and TailwindCSS.
          </p>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} PixProof. All rights reserved.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-6 py-4 text-center text-gray-500 text-sm">
        Crafted with precision for a premium experience.
      </div>
    </footer>
  );
}

export default Footer;
