export default function PlaceholderPage({ title, description }) {
  return (
    <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>{title}</h2>
      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{description}</p>
      <div style={{ marginTop: '2rem', padding: '3rem', border: '2px dashed #cbd5e1', borderRadius: '8px', textAlign: 'center', color: '#94a3b8' }}>
        Dynamic data table for <strong>{title}</strong> will load here.
      </div>
    </div>
  );
}