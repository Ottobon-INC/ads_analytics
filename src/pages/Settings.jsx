import React from 'react';
import SheetConfig from '../components/settings/SheetConfig';

export default function Settings({
  sheetUrl,
  headers,
  columnMap,
  refreshInterval,
  isDemoMode,
  lastSyncTime,
  onSaveSheetUrl,
  onSaveColumnMap,
  onSaveRefreshInterval,
  onUploadCSV,
  onLoadDemoData,
  onTestConnection
}) {
  return (
    <div>
      <SheetConfig
        sheetUrl={sheetUrl}
        headers={headers}
        columnMap={columnMap}
        refreshInterval={refreshInterval}
        isDemoMode={isDemoMode}
        lastSyncTime={lastSyncTime}
        onSaveSheetUrl={onSaveSheetUrl}
        onSaveColumnMap={onSaveColumnMap}
        onSaveRefreshInterval={onSaveRefreshInterval}
        onUploadCSV={onUploadCSV}
        onLoadDemoData={onLoadDemoData}
        onTestConnection={onTestConnection}
      />
    </div>
  );
}
