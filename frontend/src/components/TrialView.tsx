import React, { useState, useEffect } from 'react';
import { TrialResult, Verdict } from '../types';
import { Scale, FileText, AlertTriangle, Zap, Stamp } from 'lucide-react';

interface Props {
  result: TrialResult;
  onReset: () => void;
  onViewHistory: () => void;
}

const VERDICT_CONFIG: Record<Verdict, { className: string; emoji: string; stamp: string }> = {
  'GUILTY': { className: 'verdict-guilty', emoji: '🔨', stamp: 'GUILTY' },
  'MOSTLY GUILTY': { className: 'verdict-mostly-guilty', emoji: '⚖️', stamp: 'MOSTLY\nGUILTY' },
  'NOT GUILTY': { className: 'verdict-not-guilty', emoji: '🌿', stamp: 'NOT\nGUILTY' },
};

const CATEGORY_LABELS: Record<string, string> = {
  social_embarrassment: '😳 Social Embarrassment',
  procrastination: '⏰ Procrastination',
  questionable_texting: '📱 Questionable Texting',
  unnecessary_overthinking: '🧠 Unnecessary Overthinking',
  petty_revenge: '😈 Petty Revenge',
  academic_disaster: '📚 Academic Disaster',
  general_stupidity: '🤦 General Stupidity',
  digital_crimes: '💻 Digital Crimes',
  food_crimes: '🍕 Food Crimes',
  friendship_betrayal: '💔 Friendship Betrayal',
};

function SeverityMeter({ score }: { score: number }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Stupidity Level</span>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-gold)' }}>{score}/10</span>
      </div>
      <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
        <div
          className="severity-bar"
          style={{ width: `${score * 10}%`, height: '100%', transition: 'width 1s ease' }}
        />
      </div>
    </div>
  );
}

function VerdictStamp({ verdict }: { verdict: Verdict }) {
  const [show, setShow] = useState(false);
  const config = VERDICT_CONFIG[verdict];

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ textAlign: 'center', margin: '32px 0' }}>
      {show && (
        <div
          className={`animate-stamp ${config.className}`}
          style={{
            display: 'inline-block',
            border: '4px solid currentColor',
            borderRadius: '8px',
            padding: '16px 32px',
            fontFamily: 'var(--font-display)',
            fontSize: '42px',
            fontWeight: 900,
            letterSpacing: '4px',
            whiteSpace: 'pre-line',
            lineHeight: 1.1,
            transform: 'rotate(-3deg)',
            opacity: 0.95,
          }}
        >
          {config.stamp}
        </div>
      )}
    </div>
  );
}

export default function TrialView({ result, onReset, onViewHistory }: Props) {
  const [activeTab, setActiveTab] = useState<'prosecution' | 'defense' | 'events'>('prosecution');
  const [revealedArgs, setRevealedArgs] = useState(0);

  // Reveal arguments one by one
  useEffect(() => {
    if (revealedArgs < 3) {
      const t = setTimeout(() => setRevealedArgs(r => r + 1), 600);
      return () => clearTimeout(t);
    }
  }, [revealedArgs]);

  const categoryLabel = CATEGORY_LABELS[result.category] || result.category;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>

      {/* ─── Case Header ─── */}
      <div className="glass-card-gold animate-fade-in-up" style={{ padding: '32px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <p className="section-label" style={{ marginBottom: '8px' }}>Case #{result.id.slice(0, 8).toUpperCase()}</p>
            <h2 className="font-display" style={{ fontSize: '22px', margin: 0, color: 'var(--color-parchment)' }}>
              The People vs. The Defendant
            </h2>
            <p style={{ color: 'var(--color-text-muted)', marginTop: '6px', fontSize: '13px' }}>
              {categoryLabel}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Court Personnel</div>
            <div style={{ fontSize: '12px', color: 'var(--color-parchment-dim)', lineHeight: 1.8 }}>
              <div>👨‍⚖️ {result.judge_name}</div>
              <div>⚔️ {result.prosecutor_name}</div>
              <div>🛡️ {result.defense_name}</div>
            </div>
          </div>
        </div>

        <hr className="divider-gold" />

        {/* Confession */}
        <div>
          <p className="section-label" style={{ marginBottom: '10px' }}>The Confession</p>
          <blockquote className="typewriter" style={{
            margin: 0,
            padding: '16px',
            background: 'rgba(201, 162, 39, 0.04)',
            borderLeft: '3px solid var(--color-gold)',
            borderRadius: '0 8px 8px 0',
            color: 'var(--color-parchment)',
            fontSize: '15px',
          }}>
            "{result.confession}"
          </blockquote>
        </div>

        <div style={{ marginTop: '20px' }}>
          <SeverityMeter score={result.severity_score} />
        </div>
      </div>

      {/* ─── Evidence ─── */}
      <div className="glass-card animate-fade-in-up" style={{ padding: '28px', marginBottom: '20px', animationDelay: '0.15s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <FileText size={18} style={{ color: 'var(--color-gold)' }} />
          <h3 className="font-display" style={{ margin: 0, fontSize: '18px' }}>Evidence Presented</h3>
        </div>
        <div style={{ display: 'grid', gap: '12px' }}>
          {result.evidence.map((item, i) => (
            <div key={i} className="evidence-card animate-fade-in-up" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-parchment)', fontSize: '14px' }}>{item.title}</span>
                <span style={{ fontSize: '11px', color: 'var(--color-gold)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                  {item.exhibit_label}
                </span>
              </div>
              <p className="typewriter" style={{ margin: 0 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Arguments ─── */}
      <div className="glass-card animate-fade-in-up" style={{ padding: '28px', marginBottom: '20px', animationDelay: '0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Scale size={18} style={{ color: 'var(--color-gold)' }} />
          <h3 className="font-display" style={{ margin: 0, fontSize: '18px' }}>The Arguments</h3>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px' }}>
          {(['prosecution', 'defense', 'events'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
                transition: 'all 0.2s',
                background: activeTab === tab ? 'rgba(201, 162, 39, 0.15)' : 'transparent',
                color: activeTab === tab ? 'var(--color-gold)' : 'var(--color-text-muted)',
                borderBottom: activeTab === tab ? '2px solid var(--color-gold)' : '2px solid transparent',
              }}
            >
              {tab === 'prosecution' ? '⚔️ Prosecution' : tab === 'defense' ? '🛡️ Defense' : '⚡ Events'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'prosecution' && (
          <div style={{ display: 'grid', gap: '14px' }}>
            {result.prosecution_arguments.slice(0, revealedArgs).map((arg, i) => (
              <div key={i} className="speech-bubble animate-fade-in-up">
                <div style={{ fontSize: '11px', color: 'var(--color-guilty)', marginBottom: '8px', fontWeight: 600 }}>
                  ⚔️ Vicky Overkill — Argument {i + 1}
                </div>
                <p className="typewriter" style={{ margin: 0, color: 'var(--color-parchment)' }}>{arg}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'defense' && (
          <div style={{ display: 'grid', gap: '14px' }}>
            {result.defense_arguments.map((arg, i) => (
              <div key={i} className="speech-bubble animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{ fontSize: '11px', color: 'var(--color-not-guilty)', marginBottom: '8px', fontWeight: 600 }}>
                  🛡️ Greg Bumble — Argument {i + 1}
                </div>
                <p className="typewriter" style={{ margin: 0, color: 'var(--color-parchment)' }}>{arg}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div style={{ display: 'grid', gap: '14px' }}>
            {result.courtroom_events.map((event, i) => (
              <div key={i} className="animate-fade-in-up" style={{
                padding: '14px 18px',
                borderRadius: '8px',
                border: '1px solid',
                animationDelay: `${i * 0.1}s`,
                ...(event.type === 'objection'
                  ? { borderColor: 'rgba(224,82,82,0.3)', background: 'rgba(224,82,82,0.06)' }
                  : event.type === 'event'
                  ? { borderColor: 'rgba(201,162,39,0.2)', background: 'rgba(201,162,39,0.04)' }
                  : { borderColor: 'rgba(82,192,132,0.2)', background: 'rgba(82,192,132,0.04)' }),
              }}>
                <div style={{ fontSize: '11px', marginBottom: '6px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  {event.type === 'objection' ? '🚨 OBJECTION' : event.type === 'event' ? '⚡ COURT EVENT' : '💥 INTERRUPTION'} — {event.character}
                </div>
                <p className="typewriter" style={{ margin: 0, color: 'var(--color-parchment)' }}>{event.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Verdict ─── */}
      <div className="glass-card-gold animate-fade-in-up" style={{ padding: '36px', marginBottom: '20px', animationDelay: '0.5s', textAlign: 'center' }}>
        <p className="section-label" style={{ marginBottom: '8px' }}>The Court Finds the Defendant</p>
        <VerdictStamp verdict={result.verdict} />
        <hr className="divider-gold" />
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            <Stamp size={16} style={{ color: 'var(--color-gold)' }} />
            <span className="section-label">The Sentence</span>
          </div>
          <p className="font-display" style={{ fontSize: '18px', color: 'var(--color-parchment)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
            {result.sentence}
          </p>
        </div>
      </div>

      {/* ─── Actions ─── */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', paddingBottom: '60px' }}>
        <button className="btn-primary" onClick={onReset}>
          🦝 Confess Another Crime
        </button>
        <button className="btn-secondary" onClick={onViewHistory}>
          📁 View Case History
        </button>
      </div>
    </div>
  );
}
