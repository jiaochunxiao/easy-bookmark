import type { BookmarkTreeNode } from '../types'

// 获取当前时间
export const getCurrentTime = () => {
  const now = new Date()
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// 获取当前日期
export const getCurrentDate = () => {
  const now = new Date()
  return now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

// 提取书签文件夹及其内容
export const extractFolders = (node: BookmarkTreeNode): BookmarkTreeNode[] => {
  const folders: BookmarkTreeNode[] = []
  
  // 处理根节点的子节点
  if (node.children) {
    // 根书签栏
    const bookmarkBar = node.children.find(child => child.id === "1")
    // 其他书签
    const otherBookmarks = node.children.find(child => child.id === "2")
    
    // 处理书签栏中的文件夹
    if (bookmarkBar && bookmarkBar.children) {
      const bookmarkBarFolders = bookmarkBar.children.filter(
        child => !child.url && child.children && child.children.length > 0
      )
      folders.push(...bookmarkBarFolders)
    }
    
    // 处理其他书签中的文件夹
    if (otherBookmarks && otherBookmarks.children) {
      const otherBookmarkFolders = otherBookmarks.children.filter(
        child => !child.url && child.children && child.children.length > 0
      )
      folders.push(...otherBookmarkFolders)
    }
  }
  
  return folders
}

// 提取未归纳进入文件夹的书签
export const extractUncategorizedBookmarks = (node: BookmarkTreeNode): BookmarkTreeNode[] => {
  const uncategorizedBookmarks: BookmarkTreeNode[] = []
  
  // 处理根节点的子节点
  if (node.children) {
    // 根书签栏
    const bookmarkBar = node.children.find(child => child.id === "1")
    // 其他书签
    const otherBookmarks = node.children.find(child => child.id === "2")
    
    // 处理书签栏中直接的书签（不在文件夹中的）
    if (bookmarkBar && bookmarkBar.children) {
      const directBookmarks = bookmarkBar.children.filter(child => child.url)
      uncategorizedBookmarks.push(...directBookmarks.map(bookmark => ({
        ...bookmark,
        parentId: bookmarkBar.id
      })))
    }
    
    // 处理其他书签中直接的书签（不在文件夹中的）
    if (otherBookmarks && otherBookmarks.children) {
      const directBookmarks = otherBookmarks.children.filter(child => child.url)
      uncategorizedBookmarks.push(...directBookmarks.map(bookmark => ({
        ...bookmark,
        parentId: otherBookmarks.id
      })))
    }
  }
  
  return uncategorizedBookmarks
}

// 获取文件夹中的书签（最多5个）
export const getBookmarksInFolder = (folder: BookmarkTreeNode) => {
  if (!folder.children) return []
  
  return folder.children
    .filter(child => child.url) // 只选择有URL的项目（实际书签而非子文件夹）
    .slice(0, 5) // 最多展示5个
} 