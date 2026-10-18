import React, { useState, useCallback } from 'react';
import { submitTrial, fetchRandomConfession } from '../api';
import { TrialResult, Personality } from '../types';
import { Shuffle, Gavel } from 'lucide-react';

interface Props {
  onTrialComplete: (result: TrialResult) => void;
}

const PERSONALITIES: { value: Personality; label: string; description: string; emoji: string }[] = [
  { value: 'friendly', label: 'Friendly', description: 'The judge is weirdly supportive.', emoji: '😊' },
  { value: 'brutally_honest', label: 'Brutally Honest', description: 'No mercy. Pure sarcasm.', emoji: '🔥' },
  { value: 'unhinged', label: 'Completely Unhinged', description: 'Absolute courtroom chaos.', emoji: '🦝' },
];

const PLACEHOLDER_CONFESSIONS = [
  '"I waved back at someone who wasn\'t waving at me and then pretended I was stretching..."',
  '"I said \'you too\' when the flight attendant said \'enjoy your flight\'..."',
  '"I rehearsed an argument against someone in the shower and still lost..."',
  '"I pretended to understand a joke for 45 minutes..."',
];

export default function ConfessionForm({ onTrialComplete }: Props) {
  const [confession, setConfession] = useState('');
  const [personality, setPersonality] = useState<Personality>('brutally_honest');
  const [loading, setLoading] = useState(false);
  const [loadingRandom, setLoadingRandom] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);

  const placeholderIdx = Math.floor(Date.now() / 5000) % PLACEHOLDER_CONFESSIONS.length;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confession.trim() || confession.trim().length < 10) {
      setError('The court requires more details. Please elaborate on your crime.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await submitTrial({ confession: confession.trim(), personality });
      onTrialComplete(result);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'The court system crashed. Even justice has bad days.');
    } finally {
      setLoading(false);
    }
  }, [confession, personality, onTrialComplete]);

  const handleRandomConfession = useCallback(async () => {
    setLoadingRandom(true);
    try {
      const c = await fetchRandomConfession();
      setConfession(c);
      setCharCount(c.length);
    } catch {
      setError('Could not generate a confession. You\'ll have to dig into your own memories.');
    } finally {
      setLoadingRandom(false);
    }
  }, []);

  return (
    <div className="glass-card-gold" style={{ padding: '40px', maxWidth: '680px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <p className="section-label" style={{ marginBottom: '12px' }}>Step Forward to the Stand</p>
        <h2 className="font-display text-gold-gradient" style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>
          Enter Your Confession
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '10px', fontSize: '14px' }}>
          What ridiculous thing did you do? Be honest. The raccoon judge has seen worse.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Confession textarea */}
        <div style={{ position: 'relative', marginBottom: '8px' }}>
          <textarea
            className="confession-input"
            value={confession}
            placeholder={PLACEHOLDER_CONFESSIONS[placeholderIdx]}
            maxLength={1000}
            onChange={(e) => {
              setConfession(e.target.value);
              setCharCount(e.target.value.length);
              setError('');
            }}
          />
          {/* Random confession button */}
          <button
            type="button"
            className="btn-secondary"
            onClick={handleRandomConfession}
            disabled={loadingRandom}
            style={{ position: 'absolute', top: '10px', right: '10px', padding: '6px 12px', fontSize: '12px' }}
          >
            <Shuffle size={13} />
            {loadingRandom ? 'Generating...' : 'Surprise me'}
          </button>
        </div>

        {/* Char count */}
        <div style={{ textAlign: 'right', marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', color: charCount > 800 ? 'var(--color-mostly-guilty)' : 'var(--color-text-muted)' }}>
            {charCount} / 1000
          </span>
        </div>

        {/* Personality selector */}
        <div style={{ marginBottom: '28px' }}>
          <p className="section-label" style={{ marginBottom: '14px' }}>Choose Your Court's Temperament</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {PERSONALITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPersonality(p.value)}
                style={{
                  background: personality === p.value
                    ? 'linear-gradient(135deg, rgba(122,28,59,0.4) 0%, rgba(165,43,82,0.2) 100%)'
                    : 'rgba(13, 10, 14, 0.6)',
                  border: `1px solid ${personality === p.value ? 'var(--color-gold)' : 'var(--color-border)'}`,
                  borderRadius: '10px',
                  padding: '16px 10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{p.emoji}</div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '13px',
                  color: personality === p.value ? 'var(--color-gold)' : 'var(--color-parchment)',
                  marginBottom: '4px',
                }}>
                  {p.label}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                  {p.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(224, 82, 82, 0.1)',
            border: '1px solid rgba(224, 82, 82, 0.3)',
            borderRadius: '8px',
            padding: '12px 16px',
            color: 'var(--color-guilty)',
            fontSize: '13px',
            marginBottom: '20px',
          }}>
            ⚖️ {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center', fontSize: '16px', padding: '16px' }}
        >
          <Gavel size={18} />
          {loading ? 'The court is deliberating...' : 'Bang the Gavel — Begin Trial'}
        </button>
      </form>
    </div>
  );
}
