import React, { useEffect, useState } from 'react';
import { fetchCases, deleteCase } from '../api';
import { CaseSummary, Verdict } from '../types';
import { Trash2, Eye, ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
  onViewCase: (id: string) => void;
}

const VERDICT_COLOR: Record<Verdict, string> = {
  'GUILTY': 'var(--color-guilty)',
  'MOSTLY GUILTY': 'var(--color-mostly-guilty)',
  'NOT GUILTY': 'var(--color-not-guilty)',
};

export default function CaseHistory({ onBack, onViewCase }: Props) {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCases(0, 50)
      .then(setCases)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteCase(id);
      setCases(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
        <button className="btn-secondary" onClick={onBack} style={{ padding: '8px 14px' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <div>
          <h2 className="font-display text-gold-gradient" style={{ margin: 0, fontSize: '26px', fontWeight: 900 }}>
            Case Archive
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-muted)' }}>
            {cases.length} {cases.length === 1 ? 'crime' : 'crimes'} on record
          </p>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
          Consulting the records...
        </div>
      )}

      {!loading && cases.length === 0 && (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🦝</div>
          <p style={{ color: 'var(--color-text-muted)' }}>No cases on record. The court is suspicious of your innocence.</p>
        </div>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {cases.map((c, i) => (
          <div
            key={c.id}
            className="glass-card animate-fade-in-up"
            style={{ padding: '20px 24px', animationDelay: `${i * 0.05}s` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: VERDICT_COLOR[c.verdict],
                    border: `1px solid ${VERDICT_COLOR[c.verdict]}`,
                    borderRadius: '4px',
                    padding: '2px 8px',
                    letterSpacing: '1px',
                  }}>
                    {c.verdict}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    Severity: {c.severity_score}/10
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p style={{
                  margin: '0 0 6px',
                  color: 'var(--color-parchment)',
                  fontSize: '14px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  "{c.confession}"
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                  {c.sentence.slice(0, 80)}...
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  className="btn-secondary"
                  onClick={() => onViewCase(c.id)}
                  style={{ padding: '7px 12px', fontSize: '12px' }}
                >
                  <Eye size={13} /> View
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={deletingId === c.id}
                  style={{
                    padding: '7px 10px',
                    background: 'transparent',
                    border: '1px solid rgba(224,82,82,0.3)',
                    borderRadius: '6px',
                    color: 'var(--color-guilty)',
                    cursor: 'pointer',
                    opacity: deletingId === c.id ? 0.5 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
