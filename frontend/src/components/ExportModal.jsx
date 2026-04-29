import { useState } from 'react';
import { createPortal } from 'react-dom';
import { jsPDF } from 'jspdf';

export default function ExportModal({ isOpen, onClose, activeQuery, data }) {
  const [format, setFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const tweets = data?.tweets || [];
  const stats = data?.stats || {};
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const exportedAt = new Date().toLocaleString();

  // ─── PDF Generator ────────────────────────────────────────────────────────────
  const generatePDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 18;
    const contentW = pageW - margin * 2;
    let y = 0;

    // ── Header bar ──────────────────────────────────
    doc.setFillColor(10, 15, 40);
    doc.rect(0, 0, pageW, 40, 'F');

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(140, 120, 255);
    doc.text('SentimentOS', margin, 18);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(160, 160, 200);
    doc.text('Sentiment Intelligence Report', margin, 27);

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 140);
    doc.text(exportedAt, pageW - margin, 27, { align: 'right' });

    y = 50;

    // ── Query badge ─────────────────────────────────
    doc.setFillColor(30, 25, 80);
    doc.roundedRect(margin, y, contentW, 12, 3, 3, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(140, 120, 255);
    doc.text(`# ${activeQuery.toUpperCase()}`, margin + 6, y + 8);
    y += 20;

    // ── Stats summary boxes ──────────────────────────
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 60);
    doc.text('Sentiment Overview', margin, y);
    y += 6;

    const boxW = (contentW - 6) / 4;
    const boxes = [
      { label: 'Total', value: String(stats.total || tweets.length), color: [99, 102, 241] },
      { label: 'Positive', value: `${stats.positive_percent ?? 0}%`, color: [34, 197, 94] },
      { label: 'Negative', value: `${stats.negative_percent ?? 0}%`, color: [239, 68, 68] },
      { label: 'Neutral', value: `${stats.neutral_percent ?? 0}%`, color: [156, 163, 175] },
    ];

    boxes.forEach((box, i) => {
      const x = margin + i * (boxW + 2);
      doc.setFillColor(245, 246, 255);
      doc.roundedRect(x, y, boxW, 22, 3, 3, 'F');
      doc.setDrawColor(...box.color);
      doc.setLineWidth(0.5);
      doc.roundedRect(x, y, boxW, 22, 3, 3, 'S');

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...box.color);
      doc.text(box.value, x + boxW / 2, y + 13, { align: 'center' });

      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 150);
      doc.text(box.label.toUpperCase(), x + boxW / 2, y + 19, { align: 'center' });
    });

    y += 30;

    // ── Sentiment bar ────────────────────────────────
    const pos = stats.positive_percent ?? 0;
    const neg = stats.negative_percent ?? 0;
    const neu = 100 - pos - neg;
    const barH = 5;

    doc.setFillColor(34, 197, 94);
    doc.rect(margin, y, contentW * (pos / 100), barH, 'F');
    doc.setFillColor(239, 68, 68);
    doc.rect(margin + contentW * (pos / 100), y, contentW * (neg / 100), barH, 'F');
    doc.setFillColor(156, 163, 175);
    doc.rect(margin + contentW * ((pos + neg) / 100), y, contentW * (neu / 100), barH, 'F');

    y += 10;

    // ── Tweet table ──────────────────────────────────
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 60);
    doc.text('Analyzed Tweets', margin, y);
    y += 6;

    // Table header row
    const colWidths = [10, 120, 25, 18];
    const colX = [margin, margin + 10, margin + 130, margin + 155];
    const rowH = 6;

    doc.setFillColor(30, 25, 80);
    doc.rect(margin, y, contentW, rowH, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(200, 190, 255);
    ['#', 'Tweet Text', 'Sentiment', 'Time'].forEach((h, i) => {
      doc.text(h, colX[i] + 1, y + 4.3);
    });
    y += rowH;

    // Table rows
    const sentimentColor = { Positive: [34, 197, 94], Negative: [239, 68, 68], Neutral: [156, 163, 175] };
    const displayTweets = tweets.slice(0, 40); // limit to 40 rows to fit A4

    displayTweets.forEach((tweet, idx) => {
      if (y > pageH - 20) {
        doc.addPage();
        y = margin;
      }

      const isEven = idx % 2 === 0;
      doc.setFillColor(isEven ? 248 : 255, isEven ? 248 : 255, isEven ? 255 : 255);
      doc.rect(margin, y, contentW, rowH, 'F');

      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 80);

      // Row number
      doc.text(String(idx + 1), colX[0] + 1, y + 4);

      // Tweet text — truncate to fit
      const maxTextLen = 75;
      const rawText = (tweet.text || '').replace(/\n/g, ' ');
      const displayText = rawText.length > maxTextLen ? rawText.slice(0, maxTextLen) + '…' : rawText;
      doc.text(displayText, colX[1] + 1, y + 4);

      // Sentiment badge
      const sColor = sentimentColor[tweet.sentiment] || [100, 100, 100];
      doc.setTextColor(...sColor);
      doc.setFont('helvetica', 'bold');
      doc.text(tweet.sentiment || '—', colX[2] + 1, y + 4);

      // Time
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 150);
      const timeStr = tweet.timestamp ? new Date(tweet.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';
      doc.text(timeStr, colX[3] + 1, y + 4);

      y += rowH;
    });

    if (tweets.length > 40) {
      y += 4;
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 150);
      doc.text(`… and ${tweets.length - 40} more records. Export as CSV for full dataset.`, margin, y);
    }

    // ── Footer ───────────────────────────────────────
    doc.setFillColor(10, 15, 40);
    doc.rect(0, pageH - 12, pageW, 12, 'F');
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 120);
    doc.text('Generated by SentimentOS — Sentiment Intelligence Platform', margin, pageH - 4);
    doc.text(`Page 1`, pageW - margin, pageH - 4, { align: 'right' });

    doc.save(`sentiment_${activeQuery}_${ts}.pdf`);
  };

  // ─── CSV / JSON Generators ────────────────────────────────────────────────────
  const generateCSV = () => {
    const lines = [
      ['# SentimentOS Export'],
      ['Query', activeQuery],
      ['Exported At', exportedAt],
      ['Total Analyzed', stats.total || tweets.length],
      ['Positive %', stats.positive_percent ?? ''],
      ['Negative %', stats.negative_percent ?? ''],
      ['Neutral %', stats.neutral_percent ?? ''],
      [],
      ['id', 'text', 'sentiment', 'timestamp'],
      ...tweets.map(t => [
        t.id,
        `"${(t.text || '').replace(/"/g, '""')}"`,
        t.sentiment,
        t.timestamp,
      ]),
    ];
    return lines.map(row => row.join(',')).join('\n');
  };

  const generateJSON = () => {
    return JSON.stringify({
      summary: {
        query: activeQuery,
        exported_at: new Date().toISOString(),
        total_analyzed: stats.total || tweets.length,
        positive_pct: stats.positive_percent,
        negative_pct: stats.negative_percent,
        neutral_pct: stats.neutral_percent,
      },
      tweets: tweets.map(t => ({ id: t.id, text: t.text, sentiment: t.sentiment, timestamp: t.timestamp })),
    }, null, 2);
  };

  // ─── Main handler ─────────────────────────────────────────────────────────────
  const handleExport = () => {
    setIsExporting(true);
    setSuccess(false);
    try {
      if (format === 'pdf') {
        generatePDF();
      } else {
        const content = format === 'csv' ? generateCSV() : generateJSON();
        const mimeType = format === 'csv' ? 'text/csv' : 'application/json';
        const filename = `sentiment_${activeQuery}_${ts}.${format}`;
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }

      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); }, 1800);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const recordCount = tweets.length;

  const modal = (
    /* Backdrop — always visible via inline styles */
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {/* Modal panel — solid dark background */}
      <div style={{
        width: '100%', maxWidth: '480px', margin: '0 16px',
        backgroundColor: '#0f1629',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '16px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="material-symbols-outlined" style={{ color: '#818cf8', fontSize: '22px' }}>file_download</span>
            <div>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '15px', margin: 0 }}>Export Report</h3>
              <p style={{ color: '#6b7280', fontSize: '11px', margin: '2px 0 0' }}>
                <span style={{ color: '#818cf8', fontFamily: 'monospace' }}>{recordCount}</span> records · Query:{' '}
                <span style={{ color: '#818cf8', fontFamily: 'monospace' }}>#{activeQuery}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>

          {/* Format selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#9ca3af', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
              Export Format
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { value: 'pdf', icon: 'picture_as_pdf', label: 'PDF Report', desc: 'Formatted' },
                { value: 'csv', icon: 'table_view', label: 'CSV', desc: 'Excel / Sheets' },
                { value: 'json', icon: 'data_object', label: 'JSON', desc: 'Raw data' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setFormat(opt.value)}
                  style={{
                    position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                    gap: '8px', padding: '14px 12px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer',
                    border: format === opt.value ? '1.5px solid rgba(99,102,241,0.6)' : '1.5px solid rgba(255,255,255,0.08)',
                    background: format === opt.value ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.04)',
                    transition: 'all 0.2s',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: format === opt.value ? '#818cf8' : '#6b7280' }}>
                    {opt.icon}
                  </span>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: format === opt.value ? '#fff' : '#d1d5db', margin: 0 }}>{opt.label}</p>
                    <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0' }}>{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            {format === 'pdf' && (
              <p style={{ fontSize: '10px', color: '#6b7280', marginTop: '8px' }}>
                ℹ️ PDF shows up to 40 tweets. Use CSV for the full dataset.
              </p>
            )}
          </div>

          {/* Snapshot */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', margin: '0 0 12px' }}>Snapshot</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center', gap: '8px' }}>
              <div>
                <p style={{ fontSize: '22px', fontWeight: 900, color: '#fff', margin: 0 }}>{recordCount}</p>
                <p style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tweets</p>
              </div>
              <div>
                <p style={{ fontSize: '22px', fontWeight: 900, color: '#6ee7b7', margin: 0 }}>{stats.positive_percent ?? 0}%</p>
                <p style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Positive</p>
              </div>
              <div>
                <p style={{ fontSize: '22px', fontWeight: 900, color: '#fca5a5', margin: 0 }}>{stats.negative_percent ?? 0}%</p>
                <p style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Negative</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '0 24px 24px', display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: '10px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, border: '1.5px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#9ca3af', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || recordCount === 0}
            style={{
              flex: 1, padding: '10px', borderRadius: '12px', fontSize: '13px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              cursor: recordCount === 0 ? 'not-allowed' : 'pointer',
              border: success ? '1.5px solid rgba(52,211,153,0.4)' : 'none',
              background: success
                ? 'rgba(52,211,153,0.15)'
                : recordCount === 0
                ? 'rgba(255,255,255,0.05)'
                : 'linear-gradient(135deg, #6366f1, #9333ea)',
              color: success ? '#6ee7b7' : recordCount === 0 ? '#6b7280' : '#fff',
              boxShadow: (!success && recordCount > 0) ? '0 4px 20px rgba(99,102,241,0.4)' : 'none',
            }}
          >
            {success ? (
              <><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span> Downloaded!</>
            ) : (
              <><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{format === 'pdf' ? 'picture_as_pdf' : 'file_download'}</span> Download .{format.toUpperCase()}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
