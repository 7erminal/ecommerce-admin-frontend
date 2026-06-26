import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

type MobileAdminLink = {
  label: string;
  to: string;
  menuKey: string;
};

type CustomNavProps = {
  mobileAdminLinks?: MobileAdminLink[];
  onMobileAdminLinkClick?: (menuKey: string) => void;
};

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Explore", href: "#courses" },
  { label: "About", to: "/about" },
  { label: "Partner With Us", href: "#contact" },
];

const CustomNav: React.FC<CustomNavProps> = ({
  mobileAdminLinks = [],
  onMobileAdminLinkClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav
      style={{
        background: "#fff",
        borderBottom: "2px solid #e53e3e",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          to="/admin/"
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "#c53030",
            letterSpacing: "-0.5px",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "32px",
              height: "32px",
              background: "#c53030",
              borderRadius: "8px",
              marginRight: "6px",
              verticalAlign: "middle",
            }}
          />
          ecommerce Admin
        </Link>

        {/* Desktop Links */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            alignItems: "center",
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                style={{
                  padding: "6px 16px",
                  borderRadius: "8px",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  color: location.pathname === link.to ? "#c53030" : "#4a1010",
                  background: location.pathname === link.to ? "#030303" : "transparent",
                  textDecoration: "none",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#fee2e2";
                  (e.currentTarget as HTMLElement).style.color = "#c53030";
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== link.to) {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#4a1010";
                  }
                }}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                style={{
                  padding: "6px 16px",
                  borderRadius: "8px",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  color: "#4a1010",
                  background: "transparent",
                  textDecoration: "none",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#fee2e2";
                  (e.currentTarget as HTMLElement).style.color = "#c53030";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#4a1010";
                }}
              >
                {link.label}
              </a>
            )
          )}
        </div>

        {/* CTA Button */}
        <Link
          to="/login"
          className="hidden-mobile"
          style={{
            background: "#c53030",
            color: "#fff",
            padding: "8px 22px",
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "0.95rem",
            textDecoration: "none",
            border: "2px solid #c53030",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#fff";
            (e.currentTarget as HTMLElement).style.color = "#c53030";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#c53030";
            (e.currentTarget as HTMLElement).style.color = "#fff";
          }}
        >
          Get Started
        </Link>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="show-mobile"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: "24px",
                height: "2px",
                background: "#c53030",
                borderRadius: "2px",
                transition: "transform 0.2s",
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: "#fff",
            borderTop: "1px solid #fecaca",
            padding: "16px 24px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {mobileAdminLinks.length > 0 && (
            <>
              <p
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#9ca3af",
                  padding: "6px 14px",
                  marginTop: "2px",
                }}
              >
                Admin Menu
              </p>
              {mobileAdminLinks.map((link) => (
                <Link
                  key={link.menuKey}
                  to={link.to}
                  onClick={() => {
                    onMobileAdminLinkClick?.(link.menuKey);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    fontWeight: 600,
                    color: location.pathname === link.to ? "#c53030" : "#4a1010",
                    background: location.pathname === link.to ? "#fee2e2" : "transparent",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div
                style={{
                  height: "1px",
                  background: "#fecaca",
                  margin: "8px 0",
                }}
              />
            </>
          )}

          {navLinks.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontWeight: 500,
                  color: "#4a1010",
                  textDecoration: "none",
                  background: "transparent",
                }}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontWeight: 500,
                  color: "#4a1010",
                  textDecoration: "none",
                  background: "transparent",
                }}
              >
                {link.label}
              </a>
            )
          )}
          <Link
            to="/login"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              marginTop: "10px",
              background: "#c53030",
              color: "#fff",
              padding: "10px 0",
              borderRadius: "10px",
              fontWeight: 600,
              textAlign: "center",
              textDecoration: "none",
              border: "2px solid #c53030",
            }}
          >
            Get Started
          </Link>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; align-items: center; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default CustomNav;