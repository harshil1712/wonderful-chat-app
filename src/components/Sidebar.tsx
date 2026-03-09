import { Link } from "@tanstack/react-router";
import { Surface, Button } from "@cloudflare/kumo";
import {
  MessageSquare,
  Image as ImageIcon,
  Mic,
  Volume2,
  FileText,
  Menu,
  X,
  Plus,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    name: "Chat",
    href: "/",
    icon: MessageSquare,
  },
  {
    name: "Image Generation",
    href: "/image",
    icon: ImageIcon,
  },
  {
    name: "Transcription",
    href: "/transcribe",
    icon: Mic,
  },
  {
    name: "Text-to-Speech",
    href: "/tts",
    icon: Volume2,
  },
  {
    name: "Summarization",
    href: "/summarize",
    icon: FileText,
  },
];

export default function Sidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="secondary"
        shape="square"
        aria-label="Toggle menu"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Sidebar */}
      <Surface
        as="nav"
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-72 h-full border-r
          transform transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          backgroundColor: 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
          backdropFilter: mobileMenuOpen ? 'blur(8px)' : 'none',
        }}
      >
        <div className="flex flex-col h-full p-5">
          {/* Quick Action */}
          <div className="mb-6">
            <Button
              variant="primary"
              className="w-full"
              icon={<Plus size={18} strokeWidth={2.5} />}
              onClick={() => {
                // Reload page for new chat
                window.location.href = '/';
              }}
            >
              New Conversation
            </Button>
          </div>

          <div className="mb-4">
            <div 
              className="text-xs font-bold uppercase tracking-wider px-3 mb-2"
              style={{ 
                fontFamily: 'var(--font-ui)',
                color: 'var(--theme-text-subtle)',
              }}
            >
              Capabilities
            </div>
          </div>
          
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                activeProps={{
                  className:
                    "nav-link-active",
                }}
                inactiveProps={{
                  className:
                    "nav-link-inactive",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="nav-link-indicator" />
                <item.icon size={20} strokeWidth={2} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </Surface>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 transition-opacity duration-300"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <style>{`
        .nav-link-active,
        .nav-link-inactive {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0.875rem;
          border-radius: 0.75rem;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        
        .nav-link-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 0;
          background: var(--theme-accent);
          border-radius: 0 2px 2px 0;
          transition: height 0.2s ease;
        }
        
        .nav-link-active {
          background: linear-gradient(135deg, var(--theme-accent-subtle), transparent);
          color: var(--theme-accent-dark);
          font-weight: 600;
        }
        
        .nav-link-active .nav-link-indicator {
          height: 60%;
        }
        
        .nav-link-inactive {
          color: var(--theme-text-secondary);
        }
        
        .nav-link-inactive:hover {
          background: var(--theme-surface-hover);
          color: var(--theme-text-primary);
          transform: translateX(2px);
        }
        
        .nav-link-inactive:hover .nav-link-indicator {
          height: 40%;
        }
      `}</style>
    </>
  );
}
