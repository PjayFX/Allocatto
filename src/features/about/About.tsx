const CLAUDE_CLAY = '#D97757';
const BURST_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

/** A stylized sunburst nod to Claude's mark (not the exact trademark). */
function ClaudeMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" role="img" aria-label="Claude">
      <g fill={CLAUDE_CLAY}>
        {BURST_ANGLES.map((angle) => (
          <rect key={angle} x="11.1" y="2.8" width="1.8" height="7" rx="0.9" transform={`rotate(${angle} 12 12)`} />
        ))}
      </g>
    </svg>
  );
}

/** Credits / about copy shown when the brand logo is tapped. */
export function About() {
  return (
    <div className="about">
      <p className="about__lead">
        Allocatto turns one question into a habit: <em>how much can I spend today?</em>
      </p>

      <section className="about__section">
        <h3 className="field-label">What it does</h3>
        <p>
          Split each paycheck into buckets (savings, bills, wants), then track daily spending against
          a simple per-day allowance. A running view of savings keeps the whole picture in one place.
        </p>
      </section>

      <section className="about__section">
        <h3 className="field-label">Fewer taps, less friction</h3>
        <p>
          Most finance apps bury you in actions — accounts to link, menus to drill through, screens to
          hop between. Allocatto is built for speed: log a spend in a tap or two, glance at what's left
          today, and get on with your day.
        </p>
      </section>

      <section className="about__section">
        <h3 className="field-label">Your data, yours</h3>
        <p>
          Everything lives locally on your device — no accounts, no sign-ups, no server quietly holding
          your finances. Because it's stored on this device, clearing your browser data would erase it,
          so keep a backup: export a full snapshot you can re-import anytime, on any device.
        </p>
      </section>

      <section className="about__section">
        <h3 className="field-label">Maker</h3>
        <p className="about__maker-name">Fernando De Leon Pagbilao Jr.</p>
        <p className="about__maker-title">Software Engineer</p>
        <a
          className="about__link"
          href="https://github.com/PjayFX"
          target="_blank"
          rel="noreferrer"
        >
          github.com/PjayFX
        </a>
      </section>

      <div className="about__collab">
        <span>In collaboration with</span>
        <ClaudeMark />
      </div>
    </div>
  );
}
