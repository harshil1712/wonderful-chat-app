import { Link } from "@tanstack/react-router";
import { Surface, Button } from "@cloudflare/kumo";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Chat", href: "/" },
  { name: "Image Generation", href: "/image" },
  { name: "Transcription", href: "/transcribe" },
  { name: "Text-to-Speech", href: "/tts" },
  { name: "Summarization", href: "/summarize" },
];

export default function Sidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        shape="square"
        aria-label="Toggle menu"
        className="lg:hidden fixed top-4 right-4 z-50 rounded-none border border-black bg-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} color="black" /> : <Menu size={24} color="black" />}
      </Button>

      <Surface
        as="nav"
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 h-full border-r border-black rounded-none
          transform transition-transform duration-300 ease-in-out bg-white
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full p-6">
          <div className="mb-8">
            <Button
              variant="primary"
              className="w-full bg-black text-white font-heading font-bold uppercase tracking-widest text-sm py-4 border-2 border-transparent hover:bg-white hover:text-black hover:border-black transition-colors rounded-none"
              onClick={() => {
                window.location.href = '/';
              }}
            >
              New Thread
            </Button>
          </div>

          <div className="mb-4">
            <div 
              className="text-xs font-bold uppercase tracking-widest mb-4 pb-2 border-b border-black text-black"
            >
              Functions
            </div>
          </div>
          
          <div className="flex-1 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                activeProps={{
                  className: "nav-link-active block",
                }}
                inactiveProps={{
                  className: "nav-link-inactive block",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="font-heading font-bold text-lg uppercase tracking-wider py-2 transition-all duration-200">
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Surface>

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <style>{`
        .nav-link-active {
          color: white;
          background: black;
          padding-left: 1rem;
        }
        .nav-link-inactive {
          color: black;
        }
        .nav-link-inactive:hover {
          padding-left: 0.5rem;
          background: rgba(0,0,0,0.05);
        }
      `}</style>
    </>
  );
}
