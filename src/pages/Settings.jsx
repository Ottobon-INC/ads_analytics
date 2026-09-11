import React from 'react';
import SheetConfig from '../components/settings/SheetConfig';

export default function Settings({
  sheetsList,
  activeSheetId,
  addSheet,
  removeSheet,
  setActiveSheetId,
  sheetUrl,
  headers,
  columnMap,
  refreshInterval,
  isDemoMode,
  lastSyncTime,
  onSaveColumnMap,
  onSaveRefreshInterval,
  onUploadCSV,
  onLoadDemoData,
  onTestConnection
}) {
  return (
    <div>
      <SheetConfig
        sheetsList={sheetsList}
        activeSheetId={activeSheetId}
        addSheet={addSheet}
        removeSheet={removeSheet}
        setActiveSheetId={setActiveSheetId}
        sheetUrl={sheetUrl}
        headers={headers}
        columnMap={columnMap}
        refreshInterval={refreshInterval}
        isDemoMode={isDemoMode}
        lastSyncTime={lastSyncTime}
        onSaveColumnMap={onSaveColumnMap}
        onSaveRefreshInterval={onSaveRefreshInterval}
        onUploadCSV={onUploadCSV}
        onLoadDemoData={onLoadDemoData}
        onTestConnection={onTestConnection}
      />
    </div>
  );
}
