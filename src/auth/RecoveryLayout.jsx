import './recovery.css';

export default function RecoveryLayout({ title, children }) {
  return <div className="recovery-page">
    <section className="recovery-card">
      <h1>{title}</h1>
      {children}
    </section>
  </div>;
}
