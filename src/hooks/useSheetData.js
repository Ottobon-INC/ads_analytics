import { useState, useEffect, useCallback, useRef } from 'react';
import Papa from 'papaparse';
import { 
  STORAGE_KEYS, 
  DEFAULT_COLUMN_MAP, 
  autoDetectColumnMap, 
  generateMockData,
  USER_LIVE_SHEET_URL
} from '../config/sheets';

// Convert any standard Google Sheet URL into the direct CSV URL
export function normalizeGoogleSheetUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();

  if (trimmed.includes('output=csv') || trimmed.endsWith('.csv')) {
    return trimmed;
  }

  // Published sheet URL
  if (trimmed.includes('/pubhtml') || trimmed.includes('/pub')) {
    const base = trimmed.split('/pub')[0];
    const gidMatch = trimmed.match(/gid=([0-9]+)/);
    const gid = gidMatch ? `&gid=${gidMatch[1]}` : '';
    return `${base}/pub?output=csv${gid}`;
  }

  // Standard edit URL: https://docs.google.com/spreadsheets/d/{ID}/edit#gid=0
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    const gidMatch = trimmed.match(/gid=([0-9]+)/);
    const gid = gidMatch ? `&gid=${gidMatch[1]}` : '';
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${gid}`;
  }

  return trimmed;
}

export function useSheetData() {
  const [sheetUrl, setSheetUrlState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.SHEET_URL) || USER_LIVE_SHEET_URL;
  });

  const [columnMap, setColumnMapState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COLUMN_MAP);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [refreshInterval, setRefreshIntervalState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REFRESH_INTERVAL);
    return saved ? parseInt(saved, 10) : 30000; // 30s auto-refresh default
  });

  const [dateRange, setDateRangeState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.DATE_RANGE) || 'all';
  });

  const [rawData, setRawData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [crmOverrides, setCrmOverrides] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_LEADS);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const timerRef = useRef(null);

  const setSheetUrl = useCallback((url) => {
    setSheetUrlState(url);
    if (url) {
      localStorage.setItem(STORAGE_KEYS.SHEET_URL, url);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SHEET_URL);
    }
  }, []);

  const setColumnMap = useCallback((map) => {
    setColumnMapState(map);
    localStorage.setItem(STORAGE_KEYS.COLUMN_MAP, JSON.stringify(map));
  }, []);

  const setRefreshInterval = useCallback((ms) => {
    setRefreshIntervalState(ms);
    localStorage.setItem(STORAGE_KEYS.REFRESH_INTERVAL, String(ms));
  }, []);

  const setDateRange = useCallback((range) => {
    setDateRangeState(range);
    localStorage.setItem(STORAGE_KEYS.DATE_RANGE, range);
  }, []);

  const updateLeadCRM = useCallback((leadId, updates) => {
    setCrmOverrides(prev => {
      const next = {
        ...prev,
        [leadId]: {
          ...(prev[leadId] || {}),
          ...updates,
          updatedAt: new Date().toISOString()
        }
      };
      localStorage.setItem(STORAGE_KEYS.CUSTOM_LEADS, JSON.stringify(next));
      return next;
    });
  }, []);

  // Fetch & Parse data directly from Google Sheet
  const fetchData = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setLoading(true);
    setError(null);

    const currentUrl = sheetUrl.trim();

    if (!currentUrl) {
      const mockRows = generateMockData();
      setRawData(mockRows);
      const mockHeaders = Object.keys(mockRows[0] || {});
      setHeaders(mockHeaders);
      const detected = autoDetectColumnMap(mockHeaders);
      setColumnMapState(prev => Object.keys(prev).length > 0 ? prev : detected);
      setIsDemoMode(true);
      setLoading(false);
      setIsRefreshing(false);
      setLastSyncTime(new Date());
      return;
    }

    const csvUrl = normalizeGoogleSheetUrl(currentUrl);

    try {
      Papa.parse(csvUrl, {
        download: true,
        header: true,
        skipEmptyLines: 'greedy',
        dynamicTyping: false,
        complete: (results) => {
          if (results.errors && results.errors.length > 0 && (!results.data || !results.data.length)) {
            throw new Error(results.errors[0].message || 'Failed to parse Google Sheets CSV.');
          }

          const parsedRows = results.data || [];
          const parsedHeaders = results.meta?.fields || (parsedRows[0] ? Object.keys(parsedRows[0]) : []);

          if (parsedRows.length === 0) {
            throw new Error('Google Sheet returned 0 rows. Please verify your sheet content.');
          }

          setRawData(parsedRows);
          setHeaders(parsedHeaders);
          setIsDemoMode(false);

          // Auto-detect mappings for user's sheet
          const detected = autoDetectColumnMap(parsedHeaders);
          setColumnMapState(prev => {
            const merged = { ...detected, ...prev };
            localStorage.setItem(STORAGE_KEYS.COLUMN_MAP, JSON.stringify(merged));
            return merged;
          });

          setLastSyncTime(new Date());
          setError(null);
          setLoading(false);
          setIsRefreshing(false);
        },
        error: (err) => {
          console.error('PapaParse error:', err);
          setError(`Could not fetch Google Sheet. Check if sharing is set to "Anyone with the link can view".`);
          setLoading(false);
          setIsRefreshing(false);
        }
      });
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Error connecting to Google Sheet.');
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [sheetUrl]);

  const parseUploadedCSV = useCallback((file) => {
    setLoading(true);
    setError(null);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        const parsedRows = results.data || [];
        const parsedHeaders = results.meta?.fields || (parsedRows[0] ? Object.keys(parsedRows[0]) : []);

        if (parsedRows.length === 0) {
          setError('Uploaded CSV contains no valid data rows.');
          setLoading(false);
          return;
        }

        setRawData(parsedRows);
        setHeaders(parsedHeaders);
        const detected = autoDetectColumnMap(parsedHeaders);
        setColumnMapState(detected);
        localStorage.setItem(STORAGE_KEYS.COLUMN_MAP, JSON.stringify(detected));
        setIsDemoMode(false);
        setLastSyncTime(new Date());
        setLoading(false);
      },
      error: (err) => {
        setError('Failed to parse uploaded CSV file: ' + err.message);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (refreshInterval <= 0) return;

    timerRef.current = setInterval(() => {
      fetchData(true);
    }, refreshInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchData, refreshInterval]);

  return {
    rawData,
    headers,
    loading,
    isRefreshing,
    error,
    lastSyncTime,
    isDemoMode,
    sheetUrl,
    columnMap,
    refreshInterval,
    dateRange,
    crmOverrides,
    setSheetUrl,
    setColumnMap,
    setRefreshInterval,
    setDateRange,
    updateLeadCRM,
    refreshData: () => fetchData(true),
    parseUploadedCSV,
    loadDemoData: () => {
      setSheetUrl('');
      fetchData();
    }
  };
}
