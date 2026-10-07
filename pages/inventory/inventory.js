const storage = require('../../utils/storage.js');

Page({
  data: {
    keyword: '',
    allItems: [],
    items: [],
    totalItems: 0,
    totalQuantity: 0,
    lowStockItems: 0
  },

  onShow() {
    this.loadInventory();
  },

  loadInventory() {
    const allItems = storage.getInventory();
    const totalQuantity = allItems.reduce((sum, i) => sum + (i.quantity || 0), 0);
    const lowStockItems = allItems.filter(i => (i.quantity || 0) <= (i.threshold || 10)).length;
    this.setData({
      allItems,
      items: allItems,
      totalItems: allItems.length,
      totalQuantity,
      lowStockItems
    });
  },

  onSearchInput(e) {
    const keyword = e.detail.value.trim().toLowerCase();
    const items = this.data.allItems.filter(i =>
      (i.name && i.name.toLowerCase().includes(keyword)) ||
      (i.code && i.code.toLowerCase().includes(keyword))
    );
    this.setData({ keyword, items });
  },

  goScan() {
    wx.navigateTo({ url: '/pages/scan/scan?mode=inventory' });
  }
});
