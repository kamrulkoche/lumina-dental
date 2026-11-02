"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Clock, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { CLINIC, NAV_LINKS, type NavLink } from "@/lib/content";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className={cn(
          "transition-[background,border-color,backdrop-filter] duration-500",
          scrolled || mobileOpen ? "border-b border-white/10 bg-navy-950/75 backdrop-blur-xl" : "border-b border-transparent bg-transparent",
        )}
      >
        {/* Utility strip — the reel shows a slim row of contact links above the main nav */}
        <div
          className={cn(
            "hidden overflow-hidden text-[11px] text-steel-300 transition-all duration-500 lg:block",
            scrolled ? "max-h-0 opacity-0" : "max-h-8 opacity-100",
          )}
        >
          <div className="mx-auto flex max-w-7xl justify-end gap-6 px-6 pt-2.5">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3" aria-hidden /> {CLINIC.hours}
            </span>
            <a href={CLINIC.phoneHref} className="inline-flex items-center gap-1.5 hover:text-cyan-soft">
              <Phone className="size-3" aria-hidden /> {CLINIC.phone}
            </a>
          </div>
        </div>

        <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>{link.children ? <DesktopDropdown link={link} active={isActive(pathname, link.href)} /> : <DesktopLink link={link} active={isActive(pathname, link.href)} />}</li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ButtonLink href="/book" size="sm" className="hidden sm:inline-flex" data-testid="nav-book">
              Book Now
            </ButtonLink>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full text-white transition hover:bg-white/10 lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </motion.div>

      <AnimatePresence>{mobileOpen && <MobileMenu pathname={pathname} onNavigate={() => setMobileOpen(false)} />}</AnimatePresence>
    </header>
  );
}

function DesktopLink({ link, active }: { link: NavLink; active: boolean }) {
  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      className={cn("relative px-3.5 py-2 text-[13px] font-medium transition-colors", active ? "text-white" : "text-steel-300 hover:text-white")}
    >
      {link.label}
      {active && <motion.span layoutId="nav-underline" className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-cyan-glow shadow-glow" />}
    </Link>
  );
}

function DesktopDropdown({ link, active }: { link: NavLink; active: boolean }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOpen(false)}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        // Mouse users already opened it on hover, so a click keeps it open; keyboard (detail 0) toggles.
        onClick={(e) => (e.detail === 0 ? setOpen((o) => !o) : setOpen(true))}
        className={cn("relative inline-flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium transition-colors", active ? "text-white" : "text-steel-300 hover:text-white")}
      >
        {link.label}
        <ChevronDown className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")} aria-hidden />
        {active && <motion.span layoutId="nav-underline" className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-cyan-glow shadow-glow" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-navy-900/95 p-2 shadow-2xl backdrop-blur-xl">
              <Link href={link.href} className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/5" onClick={() => setOpen(false)}>
                Meet all dentists
              </Link>
              {link.children?.map((c) => (
                <Link key={c.href} href={c.href} onClick={() => setOpen(false)} className="group block rounded-xl px-3 py-2.5 transition hover:bg-white/5">
                  <span className="text-sm text-white group-hover:text-cyan-soft">{c.label}</span>
                  <span className="block text-xs text-steel-300">{c.note}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileMenu({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <motion.div
      id="mobile-menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-navy-950/97 backdrop-blur-xl lg:hidden"
    >
      <div className="lab-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <motion.ul
        className="relative flex flex-col gap-1 px-6 pt-8"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
      >
        {NAV_LINKS.map((link) => (
          <motion.li key={link.href} variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }} className="border-b border-white/8">
            {link.children ? (
              <>
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-4 font-display text-2xl font-bold uppercase tracking-wide text-white"
                  aria-expanded={expanded === link.href}
                  onClick={() => setExpanded((e) => (e === link.href ? null : link.href))}
                >
                  {link.label}
                  <ChevronDown className={cn("size-5 text-cyan-glow transition-transform", expanded === link.href && "rotate-180")} />
                </button>
                <AnimatePresence initial={false}>
                  {expanded === link.href && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="flex flex-col gap-1 pb-4 pl-1">
                        <Link href={link.href} onClick={onNavigate} className="py-2 text-steel-300 hover:text-white">
                          All dentists
                        </Link>
                        {link.children.map((c) => (
                          <Link key={c.href} href={c.href} onClick={onNavigate} className="py-2 text-steel-300 hover:text-white">
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href={link.href}
                onClick={onNavigate}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={cn("block py-4 font-display text-2xl font-bold uppercase tracking-wide", isActive(pathname, link.href) ? "text-cyan-glow" : "text-white")}
              >
                {link.label}
              </Link>
            )}
          </motion.li>
        ))}
      </motion.ul>
      <div className="relative mt-8 flex flex-col gap-3 px-6 pb-10">
        <ButtonLink href="/book" size="lg" onClick={onNavigate}>
          Book Now
        </ButtonLink>
        <a href={CLINIC.phoneHref} className="text-center text-sm text-steel-300">
          or call {CLINIC.phone}
        </a>
      </div>
    </motion.div>
  );
}
