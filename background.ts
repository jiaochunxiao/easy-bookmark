// 初始化扩展，确保所需权限
chrome.runtime.onInstalled.addListener(() => {
  console.log("书签管理器扩展已安装")
})

// 保持空的导出以满足TypeScript模块要求
export {} 