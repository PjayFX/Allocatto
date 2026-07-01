import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode, TouchEvent } from 'react';
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import PlannerPage from './features/planner/PlannerPage';
import TrackerPage from './features/tracker/TrackerPage';
import SavingsPage from './features/savings/SavingsPage';
import DashboardPage from './features/dashboard/DashboardPage';
import { BrandMark } from './components/BrandMark';
import { SettingsSheet } from './components/SettingsSheet';
import { BucketEditor } from './features/planner/BucketEditor';
import { CategoryManager } from './features/tracker/CategoryManager';
import { About } from './features/about/About';
import { AutoBackup, DataBackup, FileHandler, ImportPrompt } from './features/backup';

const tabs = [
  { to: '/', label: 'Allot', end: true },
  { to: '/tally', label: 'Tally', end: false },
  { to: '/savings', label: 'Savings', end: false },
  { to: '/summary', label: 'Summary', end: false },
];

/** Which tab a path belongs to, so we can slide in the right direction. */
function tabIndexOf(pathname: string): number {
  const index = tabs.findIndex((tab) =>
    tab.to === '/' ? pathname === '/' : pathname.startsWith(tab.to),
  );
  return index < 0 ? 0 : index;
}

/** Minimum horizontal travel (px) that counts as a tab swipe. */
const SWIPE_THRESHOLD = 60;

function SlidersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="4" y1="8" x2="20" y2="8" />
      <circle cx="9" cy="8" r="2.6" fill="var(--surface)" />
      <line x1="4" y1="16" x2="20" y2="16" />
      <circle cx="15" cy="16" r="2.6" fill="var(--surface)" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41 12 22l-9-9V3h10l7.59 7.59a2 2 0 0 1 0 2.82Z" />
      <circle cx="7.5" cy="7.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BackupIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </svg>
  );
}

/** The topbar's contextual action, or null on tabs that have no settings. */
interface TopbarAction {
  title: string;
  ariaLabel: string;
  icon: ReactNode;
  body: ReactNode;
}

function topbarActionFor(pathname: string): TopbarAction | null {
  if (pathname === '/') {
    return { title: 'Settings', ariaLabel: 'Settings', icon: <SlidersIcon />, body: <BucketEditor /> };
  }
  if (pathname.startsWith('/tally')) {
    return {
      title: 'Spending categories',
      ariaLabel: 'Manage spending categories',
      icon: <TagIcon />,
      body: <CategoryManager />,
    };
  }
  if (pathname.startsWith('/summary')) {
    return {
      title: 'Data & backup',
      ariaLabel: 'Data and backup',
      icon: <BackupIcon />,
      body: (
        <div className="about__section">
          <p>
            Your data lives only on this device. Keep a backup you can re-import anytime, on any
            device.
          </p>
          <DataBackup />
        </div>
      ),
    };
  }
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const action = topbarActionFor(pathname);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Ask the browser to keep our local data from being evicted under storage
  // pressure. Silent no-op where unsupported or already granted.
  useEffect(() => {
    navigator.storage?.persist?.().catch(() => {});
  }, []);

  // Direction of the last tab change drives the slide (right = forward).
  const currentIndex = tabIndexOf(pathname);
  const prevIndex = useRef(currentIndex);
  const forward = currentIndex >= prevIndex.current;
  useEffect(() => {
    prevIndex.current = currentIndex;
  }, [currentIndex]);

  // Close the sheet whenever the tab changes so one tab's settings never linger
  // open over another's.
  useEffect(() => {
    setSettingsOpen(false);
  }, [pathname]);

  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  function onTouchStart(event: TouchEvent) {
    const touch = event.changedTouches[0];
    swipeStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  }
  function onTouchEnd(event: TouchEvent) {
    const start = swipeStart.current;
    const touch = event.changedTouches[0];
    swipeStart.current = null;
    if (!start || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    // Ignore short or mostly-vertical gestures (those are scrolls).
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const next = currentIndex + (dx < 0 ? 1 : -1);
    if (next >= 0 && next < tabs.length) navigate(tabs[next]!.to);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          type="button"
          className="brand"
          onClick={() => setAboutOpen(true)}
          aria-label="About Allocatto"
        >
          <BrandMark />
          Allocatto
        </button>
        <span className="topbar__spacer" />
        {action ? (
          <button
            type="button"
            className="icon-action"
            onClick={() => setSettingsOpen(true)}
            aria-label={action.ariaLabel}
          >
            {action.icon}
          </button>
        ) : null}
      </header>

      <AutoBackup />
      <FileHandler />
      <main className="app-main" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <ImportPrompt />
        <div key={pathname} className={`page ${forward ? 'page--fwd' : 'page--back'}`}>
          <Routes>
            <Route path="/" element={<PlannerPage />} />
            <Route path="/tally" element={<TrackerPage />} />
            <Route path="/savings" element={<SavingsPage />} />
            <Route path="/summary" element={<DashboardPage />} />
          </Routes>
        </div>
      </main>

      <nav className="bottom-nav">
        <div className="bottom-nav__pill">
          <span className="nav-indicator" style={{ '--i': currentIndex } as CSSProperties} aria-hidden="true" />
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {action ? (
        <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} title={action.title}>
          {action.body}
          <div className="sheet__footer">
            <button type="button" className="btn btn-primary" onClick={() => setSettingsOpen(false)}>
              Done
            </button>
          </div>
        </SettingsSheet>
      ) : null}

      <SettingsSheet open={aboutOpen} onClose={() => setAboutOpen(false)} title="About Allocatto">
        <About />
      </SettingsSheet>
    </div>
  );
}
