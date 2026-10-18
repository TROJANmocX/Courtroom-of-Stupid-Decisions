import React, { useState, useEffect } from 'react';
import { TrialResult } from './types';
import { fetchCase } from './api';
import ConfessionForm from './components/ConfessionForm';
import TrialView from './components/TrialView';
import CaseHistory from './components/CaseHistory';

type View = 'home' | 'loading' | 'trial' | 'history' | 'case';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [currentTrial, setCurrentTrial] = useState<TrialResult | null>(null);
  const [viewingCaseId, setViewingCaseId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState('');

  const handleTrialComplete = (result: TrialResult) => {
    setCurrentTrial(result);
    setView('trial');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCase = async (id: string) => {
    setViewingCaseId(id);
    setView('loading');
    try {
      const result = await fetchCase(id);
      setCurrentTrial(result);
      setView('trial');
    } catch (e) {
      setLoadError('Could not load this case. The records may have been lost.');
      setView('history');
    }
  };

  const handleReset = () => {
    setCurrentTrial(null);
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ─── Header ─── */}
      <header style={{
        borderBottom: '1px solid var(--color-border)',
        background: 'rgba(13, 10, 14, 0.95)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <button
            onClick={() => setView('home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <h1 className="font-display text-gold-gradient" style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 900,
              letterSpacing: '0.5px',
            }}>
              ⚖️ Courtroom of Stupid Decisions
            </h1>
          </button>
          <button
            className="btn-secondary"
            onClick={() => setView('history')}
            style={{ fontSize: '13px', padding: '7px 14px' }}
          >
            📁 Case Archive
          </button>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main style={{ padding: '48px 24px', maxWidth: '900px', margin: '0 auto' }}>

        {/* Home / Confession Form */}
        {view === 'home' && (
          <div>
            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: '52px' }}>
              <div style={{ fontSize: '72px', marginBottom: '20px', filter: 'drop-shadow(0 0 20px rgba(201,162,39,0.4))' }}>
                🦝
              </div>
              <h1 className="font-display text-gold-gradient" style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, margin: '0 0 16px', lineHeight: 1.1 }}>
                Courtroom of<br />Stupid Decisions
              </h1>
              <p style={{ color: 'var(--color-parchment-dim)', fontSize: '18px', maxWidth: '480px', margin: '0 auto 12px', lineHeight: 1.6 }}>
                Where your most embarrassing moments face fictional justice.
              </p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
                Presided over by Judge Randy Trash-Panda III and his gavel of questionable wisdom.
              </p>
            </div>
            <ConfessionForm onTrialComplete={handleTrialComplete} />
          </div>
        )}

        {/* Loading */}
        {view === 'loading' && (
          <div style={{ textAlign: 'center', padding: '120px 0' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px', animation: 'pulse-glow 1.5s infinite' }}>⚖️</div>
            <p className="font-display" style={{ fontSize: '22px', color: 'var(--color-gold)' }}>Loading case file...</p>
            <p style={{ color: 'var(--color-text-muted)' }}>The raccoon is looking for it under his bench.</p>
          </div>
        )}

        {/* Trial Result */}
        {view === 'trial' && currentTrial && (
          <TrialView
            result={currentTrial}
            onReset={handleReset}
            onViewHistory={() => setView('history')}
          />
        )}

        {/* Case History */}
        {view === 'history' && (
          <CaseHistory
            onBack={() => setView(currentTrial ? 'trial' : 'home')}
            onViewCase={handleViewCase}
          />
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: '24px',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        fontSize: '12px',
      }}>
        <p style={{ margin: 0 }}>
          ⚖️ Courtroom of Stupid Decisions — All verdicts are fictional and legally non-binding.
          Judge Randy assumes no liability for emotional damage.
        </p>
      </footer>
    </div>
  );
}
