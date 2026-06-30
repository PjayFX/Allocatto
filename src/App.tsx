import { useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import PlannerPage from './features/planner/PlannerPage';
import ComingSoon from './components/ComingSoon';
import { BrandMark } from './components/BrandMark';
import { SettingsSheet } from './components/SettingsSheet';
import { BucketEditor } from './features/planner/BucketEditor';

const tabs = [
  { to: '/', label: 'Planner', end: true },
  { to: '/tracker', label: 'Tracker', end: false },
  { to: '/savings', label: 'Savings', end: false },
  { to: '/dashboard', label: 'Dashboard', end: false },
];

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

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="topbar">
        <span className="brand">
          <BrandMark />
          Allocatto
        </span>
        <span className="topbar__spacer" />
        <button
          type="button"
          className="icon-action"
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
        >
          <SlidersIcon />
        </button>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<PlannerPage />} />
          <Route path="/tracker" element={<ComingSoon title="Tracker" />} />
          <Route path="/savings" element={<ComingSoon title="Savings" />} />
          <Route path="/dashboard" element={<ComingSoon title="Dashboard" />} />
        </Routes>
      </main>

      <nav className="bottom-nav">
        <div className="bottom-nav__pill">
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

      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} title="Settings">
        <BucketEditor />
        <div className="sheet__footer">
          <button type="button" className="btn btn-primary" onClick={() => setSettingsOpen(false)}>
            Save
          </button>
        </div>
      </SettingsSheet>
    </div>
  );
}
