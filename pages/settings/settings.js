const storage = require('../../utils/storage.js');
const cloud = require('../../utils/cloud.js');

Page({
  data: {
    settings: {
      storageMode: 'local',
      cloudEnv: '',
      autoSync: false,
      warnThreshold: 10
    }
  },

  onShow() {
    const app = getApp();
    this.setData({ settings: { ...app.globalData.settings } });
  },

  goCloud() {
    wx.navigateTo({ url: '/pages/cloud/cloud' });
  },

  toggleAutoSync(e) {
    const autoSync = e.detail.value;
    this.updateSettings({ autoSync });
    if (autoSync && !cloud.isCloudReady()) {
      wx.showToast({ title: '请先配置云环境', icon: 'none' });
    }
  },

  updateThreshold(e) {
    const val = parseInt(e.detail.value, 10);
    if (!isNaN(val) && val > 0) {
      this.updateSettings({ warnThreshold: val });
    }
  },

  updateSettings(patch) {
    const settings = { ...this.data.settings, ...patch };
    this.setData({ settings });
    getApp().saveSettings(settings);
  },

  exportData() {
    const data = storage.exportAllData();
    const fs = wx.getFileSystemManager();
    const filePath = `${wx.env.USER_DATA_PATH}/inventory_backup_${Date.now()}.json`;
    fs.writeFile({
      filePath,
      data: JSON.stringify(data, null, 2),
      encoding: 'utf8',
      success: () => {
        wx.openDocument({ filePath, fileType: 'json' });
      },
      fail: () => {
        wx.showToast({ title: '导出失败', icon: 'none' });
      }
    });
  },

  clearAllData() {
    wx.showModal({
      title: '危险操作',
      content: '将清空所有扫码记录、生成记录和库存数据，是否继续？',
      confirmColor: '#FF5B5B',
      success: (res) => {
        if (res.confirm) {
          storage.clearScanRecords();
          storage.clearGenerateRecords();
          storage.clearInventory();
          wx.showToast({ title: '已清空', icon: 'success' });
        }
      }
    });
  }
});
