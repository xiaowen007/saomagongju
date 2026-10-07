const storage = require('../../utils/storage.js');

Page({
  data: {
    todayCount: 0,
    totalCount: 0,
    recentRecords: []
  },

  onShow() {
    this.loadStats();
  },

  loadStats() {
    const records = storage.getScanRecords();
    const today = new Date().toISOString().slice(0, 10);
    const todayCount = records.filter(r => r.createdAt && r.createdAt.slice(0, 10) === today).length;
    this.setData({
      todayCount,
      totalCount: records.length,
      recentRecords: records.slice(0, 5)
    });
  },

  startBatchScan() {
    wx.navigateTo({ url: '/pages/scan/scan?mode=batch' });
  }
});
