import React, { useState } from 'react';
import { 
  Link2, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Database, 
  Save,
  Sliders
} from 'lucide-react';
import { DEFAULT_COLUMN_MAP } from '../../config/sheets';

export default function SheetConfig({
  sheetsList = [],
  activeSheetId,
  addSheet,
  removeSheet,
  setActiveSheetId,
  sheetUrl,
  headers = [],
  columnMap = {},
  refreshInterval,
  isDemoMode,
  lastSyncTime,
  onUploadCSV,
  onLoadDemoData,
  onTestConnection
}) {
  const [inputName, setInputName] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [tempColumnMap, setTempColumnMap] = useState({ ...columnMap });
  const [isSaved, setIsSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleAddSheet = (e) => {
    e.preventDefault();
    if (inputName.trim() && inputUrl.trim()) {
      addSheet(inputName.trim(), inputUrl.trim());
      setInputName('');
      setInputUrl('');
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  const handleColumnMapChange = (fieldKey, selectedHeader) => {
    const next = { ...tempColumnMap, [fieldKey]: selectedHeader };
    setTempColumnMap(next);
  };

  const handleSaveMap = () => {
    onSaveColumnMap(tempColumnMap);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      if (onTestConnection) {
        await onTestConnection(inputUrl);
      }
      setTestResult({ success: true, message: 'Successfully connected and verified Google Sheet data stream!' });
    } catch (err) {
      setTestResult({ success: false, message: err.message || 'Could not connect. Please check permissions.' });
    } finally {
      setTesting(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file && onUploadCSV) {
      onUploadCSV(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '24px', color: 'var(--text-primary)' }}>Google Sheets Connection & Sync</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Connect your live Google Sheet CSV or upload local reports to power real-time analytics.
        </p>
      </div>

      {/* Mode Status Banner */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '16px 20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          borderLeft: isDemoMode ? '4px solid #7C3AED' : '4px solid #059669'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '10px', 
              background: isDemoMode ? '#FAF5FF' : '#ECFDF5',
              color: isDemoMode ? '#7C3AED' : '#059669',
              border: `1px solid ${isDemoMode ? '#E9D5FF' : '#A7F3D0'}`,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '14px' }}>
              {isDemoMode ? 'Running in Demo Dataset Mode' : 'Connected to Live Google Sheet'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {lastSyncTime ? `Last synced at ${new Date(lastSyncTime).toLocaleTimeString()}` : 'Syncing data...'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isDemoMode && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={onLoadDemoData}
            >
              <Database size={13} /> Switch to Demo Mode
            </button>
          )}
        </div>
      </div>

      {/* Connection Inputs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* URL Input Form */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link2 size={18} color="#4F46E5" />
            <h3 style={{ fontSize: '16px', color: 'var(--text-primary)' }}>Connected Sheets</h3>
          </div>

          {/* List of Sheets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
            {sheetsList.length === 0 && (
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>No sheets connected yet.</p>
            )}
            {sheetsList.map((sheet) => (
              <div 
                key={sheet.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1px solid ${sheet.id === activeSheetId ? '#4F46E5' : 'var(--border-subtle)'}`,
                  background: sheet.id === activeSheetId ? '#EEF2FF' : '#F8FAFC'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{sheet.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {sheet.url}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {sheet.id !== activeSheetId && (
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveSheetId(sheet.id)}
                      style={{ fontSize: '11px', padding: '4px 8px' }}
                    >
                      Select
                    </button>
                  )}
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => removeSheet(sheet.id)}
                    style={{ fontSize: '11px', padding: '4px 8px', color: '#E11D48', borderColor: '#FECDD3' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '8px' }}>Add New Sheet</h3>
          <form onSubmit={handleAddSheet} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Sheet Name:
              </label>
              <input
                type="text"
                className="input-control"
                placeholder="e.g. Q3 Leads"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                required
              />
            </div>


            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Sheet Share or Published CSV Link:
              </label>
              <input
                type="url"
                className="input-control"
                placeholder="https://docs.google.com/spreadsheets/d/your_sheet_id/edit?usp=sharing"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                <Save size={14} /> Connect Sheet
              </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  disabled={testing || !inputUrl}
                  onClick={handleTest}
                >
                  <RefreshCw size={14} className={testing ? 'animate-spin-fast' : ''} /> Test
                </button>
            </div>

            {testResult && (
              <div 
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: testResult.success ? '#ECFDF5' : '#FFF1F2',
                  color: testResult.success ? '#059669' : '#E11D48',
                  border: `1px solid ${testResult.success ? '#A7F3D0' : '#FECDD3'}`
                }}
              >
                {testResult.success ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                {testResult.message}
              </div>
            )}
          </form>

          {/* Guide Alert */}
          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HelpCircle size={14} color="#D97706" /> How to get your Google Sheet Link:
            </div>
            <ol style={{ paddingLeft: '18px' }}>
              <li>Open your Google Sheet</li>
              <li>Click <strong>Share</strong> (top right) → set to <strong>"Anyone with the link can view"</strong></li>
              <li>Or click <strong>File → Share → Publish to web → CSV</strong></li>
              <li>Paste the link above and click Connect!</li>
            </ol>
          </div>
        </div>

        {/* Drag and Drop CSV & Refresh Interval */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* CSV Dropzone */}
          <div 
            className="glass-card"
            style={{ 
              padding: '24px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              textAlign: 'center',
              border: '2px dashed var(--border-glass)',
              cursor: 'pointer',
              minHeight: '160px',
              background: '#FFFFFF'
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            onClick={() => document.getElementById('csv-file-input').click()}
          >
            <input 
              id="csv-file-input" 
              type="file" 
              accept=".csv" 
              style={{ display: 'none' }} 
              onChange={handleFileDrop}
            />
            <div 
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#EEF2FF',
                color: '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}
            >
              <Upload size={20} />
            </div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>
              Drop CSV File here or Click to Upload
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Upload local CSV file to view immediately
            </p>
          </div>

          {/* Sync Interval Configuration */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>
                Auto-Refresh Interval
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Poll Google Sheet in background
              </div>
            </div>

            <select
              className="select-control"
              value={refreshInterval}
              onChange={(e) => onSaveRefreshInterval(parseInt(e.target.value, 10))}
              style={{ width: '160px' }}
            >
              <option value="30000">Every 30 Seconds</option>
              <option value="60000">Every 1 Minute</option>
              <option value="300000">Every 5 Minutes</option>
              <option value="900000">Every 15 Minutes</option>
              <option value="0">Manual Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Column Mapping Table - Tailored strictly to the 7 real columns */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} color="#4F46E5" />
              <h3 style={{ fontSize: '17px', color: 'var(--text-primary)' }}>Google Sheet Columns ({Object.keys(DEFAULT_COLUMN_MAP).length} Active Fields)</h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              All 7 columns from your spreadsheet are mapped and verified.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isSaved && (
              <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> Mappings Saved!
              </span>
            )}
            <button className="btn btn-primary btn-sm" onClick={handleSaveMap}>
              <Save size={14} /> Save Mappings
            </button>
          </div>
        </div>

        {/* Detected Headers preview */}
        {headers.length > 0 && (
          <div style={{ marginBottom: '16px', padding: '12px 16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Detected Sheet Columns ({headers.length}):
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {headers.map(h => (
                <span key={h} className="badge badge-new" style={{ padding: '4px 10px' }}>
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Clean 7 Column Mapping Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {Object.entries(DEFAULT_COLUMN_MAP).map(([fieldKey, config]) => {
            const currentSelected = tempColumnMap[fieldKey] || config.defaultKey;
            const isMatched = headers.length === 0 || headers.includes(currentSelected);

            return (
              <div 
                key={fieldKey}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {config.label}
                  </span>
                  <span 
                    style={{ 
                      fontSize: '10px', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      background: isMatched ? '#ECFDF5' : '#FFFBEB',
                      color: isMatched ? '#059669' : '#D97706',
                      border: `1px solid ${isMatched ? '#A7F3D0' : '#FDE68A'}`,
                      fontWeight: 700
                    }}
                  >
                    {isMatched ? 'Matched' : 'Unmapped'}
                  </span>
                </div>

                <select
                  className="select-control"
                  value={currentSelected}
                  onChange={(e) => handleColumnMapChange(fieldKey, e.target.value)}
                  style={{ fontSize: '12px', padding: '7px 10px', background: '#FFFFFF' }}
                >
                  <option value={config.defaultKey}>
                    Default: {config.defaultKey}
                  </option>
                  {headers.map(h => (
                    <option key={h} value={h}>
                      Sheet Column: {h}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
