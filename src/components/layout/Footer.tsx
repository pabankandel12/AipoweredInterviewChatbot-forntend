import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold">
            AI<span className="text-blue-600">Interview</span>
          </h2>

          <p className="mt-4 text-sm text-gray-500">
            AI-powered interview platform that helps you practice, improve, and
            get hired faster.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold">Platform</h3>

          <div className="mt-4 flex flex-col gap-2 text-sm text-gray-600">
            <Link href="/">Home</Link>
            <Link href="/interview">Interview</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold">Resources</h3>

          <div className="mt-4 flex flex-col gap-2 text-sm text-gray-600">
            <Link href="#">Blog</Link>
            <Link href="#">Help Center</Link>
            <Link href="#">Privacy Policy</Link>
          </div>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold">Connect</h3>

          <div className="mt-4 flex gap-4 text-gray-600">
            <Link href="#">
              <FaGithub className="hover:text-black" />
            </Link>

            <Link href="#">
              <FaLinkedin className="hover:text-blue-600" />
            </Link>

            <Link href="#">
              <FaTwitter className="hover:text-sky-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} AIInterview. All rights reserved.
      </div>
    </footer>
  );
}
