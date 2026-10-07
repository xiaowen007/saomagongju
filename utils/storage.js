const SCAN_RECORDS_KEY = 'scan_records';
const GENERATE_RECORDS_KEY = 'generate_records';
const INVENTORY_KEY = 'inventory_items';

function getNow() {
  const now = new Date();
  return now.toISOString();
}

function uuid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}

// =================== 扫码记录 ===================
function getScanRecords() {
  try {
    return wx.getStorageSync(SCAN_RECORDS_KEY) || [];
  } catch (e) {
    return [];
  }
}

function addScanRecord(data) {
  const records = getScanRecords();
  const record = {
    id: uuid(),
    type: data.type || 'single',
    code: data.code || '',
    result: data.result || data.code || '',
    scanType: data.scanType || 'QR_CODE',
    quantity: data.quantity || 1,
    amount: data.amount || null,
    weight: data.weight || null,
    createdAt: getNow(),
    remark: data.remark || ''
  };
  records.unshift(record);
  wx.setStorageSync(SCAN_RECORDS_KEY, records);
  return record;
}

function addScanRecords(list) {
  const records = getScanRecords();
  const newRecords = list.map(item => ({
    id: uuid(),
    type: item.type || 'batch',
    code: item.code || '',
    result: item.result || item.code || '',
    scanType: item.scanType || 'QR_CODE',
    quantity: item.quantity || 1,
    createdAt: getNow(),
    remark: item.remark || ''
  }));
  records.unshift(...newRecords);
  wx.setStorageSync(SCAN_RECORDS_KEY, records);
  return newRecords;
}

function deleteScanRecord(id) {
  const records = getScanRecords().filter(r => r.id !== id);
  wx.setStorageSync(SCAN_RECORDS_KEY, records);
}

function clearScanRecords() {
  wx.removeStorageSync(SCAN_RECORDS_KEY);
}

// =================== 生成记录 ===================
function getGenerateRecords() {
  try {
    return wx.getStorageSync(GENERATE_RECORDS_KEY) || [];
  } catch (e) {
    return [];
  }
}

function addGenerateRecord(data) {
  const records = getGenerateRecords();
  const record = {
    id: uuid(),
    type: data.type || 'qrcode', // barcode / qrcode
    content: data.content || '',
    createdAt: getNow()
  };
  records.unshift(record);
  wx.setStorageSync(GENERATE_RECORDS_KEY, records);
  return record;
}

function deleteGenerateRecord(id) {
  const records = getGenerateRecords().filter(r => r.id !== id);
  wx.setStorageSync(GENERATE_RECORDS_KEY, records);
}

function clearGenerateRecords() {
  wx.removeStorageSync(GENERATE_RECORDS_KEY);
}

// =================== 库存物料 ===================
function getInventory() {
  try {
    return wx.getStorageSync(INVENTORY_KEY) || [];
  } catch (e) {
    return [];
  }
}

function addOrUpdateInventory(item) {
  const list = getInventory();
  const idx = list.findIndex(i => i.code === item.code);
  if (idx >= 0) {
    list[idx].quantity = (list[idx].quantity || 0) + (item.quantity || 1);
    list[idx].updatedAt = getNow();
    if (item.name) list[idx].name = item.name;
  } else {
    list.unshift({
      id: uuid(),
      code: item.code,
      name: item.name || item.code,
      quantity: item.quantity || 1,
      threshold: item.threshold || 10,
      createdAt: getNow(),
      updatedAt: getNow()
    });
  }
  wx.setStorageSync(INVENTORY_KEY, list);
  return list;
}

function updateInventoryItem(id, updates) {
  const list = getInventory();
  const idx = list.findIndex(i => i.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...updates, updatedAt: getNow() };
    wx.setStorageSync(INVENTORY_KEY, list);
  }
  return list;
}

function deleteInventoryItem(id) {
  const list = getInventory().filter(i => i.id !== id);
  wx.setStorageSync(INVENTORY_KEY, list);
  return list;
}

function clearInventory() {
  wx.removeStorageSync(INVENTORY_KEY);
}

// =================== 导出 ===================
function exportAllData() {
  return {
    scanRecords: getScanRecords(),
    generateRecords: getGenerateRecords(),
    inventory: getInventory(),
    settings: wx.getStorageSync('app_settings') || {},
    exportedAt: getNow()
  };
}

module.exports = {
  getScanRecords,
  addScanRecord,
  addScanRecords,
  deleteScanRecord,
  clearScanRecords,
  getGenerateRecords,
  addGenerateRecord,
  deleteGenerateRecord,
  clearGenerateRecords,
  getInventory,
  addOrUpdateInventory,
  updateInventoryItem,
  deleteInventoryItem,
  clearInventory,
  exportAllData,
  uuid,
  getNow
};
