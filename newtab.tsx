import { useEffect, useState, useRef } from "react"
import "./style.css"

// 定义书签树节点的类型
interface BookmarkTreeNode {
  id: string
  title: string
  url?: string
  children?: BookmarkTreeNode[]
  dateAdded?: number
  dateGroupModified?: number
  parentId?: string
}

// 编辑模式接口
interface EditingBookmark {
  id: string
  title: string
  url: string
  folderId: string
}

// 删除确认接口
interface DeleteConfirm {
  bookmarkId: string
  title: string
  folderId: string
}

// 定义主题类型
interface Theme {
  id: string
  name: string
  primary: string
  secondary: string
  gradient: string
  background: string
  hoverBg: string
  textPrimary: string
  textSecondary: string
}

// 定义背景图片接口
interface BackgroundImage {
  url: string
  author: string
  authorUrl: string
  downloadLocation: string
}

// 预设主题
const themes: Theme[] = [
  {
    id: "teal",
    name: "清新绿",
    primary: "bg-teal-500",
    secondary: "bg-teal-50",
    gradient: "bg-gradient-to-r from-teal-400 to-emerald-500",
    background: "bg-gradient-to-br from-teal-50 to-emerald-100",
    hoverBg: "bg-green-50",
    textPrimary: "text-teal-800",
    textSecondary: "text-teal-600"
  },
  {
    id: "blue",
    name: "天空蓝",
    primary: "bg-blue-500",
    secondary: "bg-blue-50",
    gradient: "bg-gradient-to-r from-blue-400 to-indigo-500",
    background: "bg-gradient-to-br from-blue-50 to-indigo-100",
    hoverBg: "bg-blue-50",
    textPrimary: "text-blue-800",
    textSecondary: "text-blue-600"
  },
  {
    id: "purple",
    name: "梦幻紫",
    primary: "bg-purple-500",
    secondary: "bg-purple-50",
    gradient: "bg-gradient-to-r from-purple-400 to-pink-500",
    background: "bg-gradient-to-br from-purple-50 to-pink-100",
    hoverBg: "bg-purple-50",
    textPrimary: "text-purple-800",
    textSecondary: "text-purple-600"
  },
  {
    id: "amber",
    name: "暖阳橙",
    primary: "bg-amber-500",
    secondary: "bg-amber-50",
    gradient: "bg-gradient-to-r from-amber-400 to-orange-500",
    background: "bg-gradient-to-br from-amber-50 to-orange-100",
    hoverBg: "bg-amber-50",
    textPrimary: "text-amber-800",
    textSecondary: "text-amber-600"
  },
  {
    id: "slate",
    name: "典雅灰",
    primary: "bg-slate-500",
    secondary: "bg-slate-50",
    gradient: "bg-gradient-to-r from-slate-400 to-gray-500",
    background: "bg-gradient-to-br from-slate-50 to-gray-100",
    hoverBg: "bg-slate-50",
    textPrimary: "text-slate-800",
    textSecondary: "text-slate-600"
  }
]

function NewTab() {
  // 获取当前时间
  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // 获取当前日期
  const getCurrentDate = () => {
    const now = new Date()
    return now.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const [bookmarkFolders, setBookmarkFolders] = useState<BookmarkTreeNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFolder, setActiveFolder] = useState<string | null>(null)
  const [theme, setTheme] = useState<Theme>(themes[0]) // 默认使用第一个主题
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<EditingBookmark | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirm | null>(null)
  const [actionMessage, setActionMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null)
  const [currentTime, setCurrentTime] = useState(getCurrentTime())
  const [currentDate, setCurrentDate] = useState(getCurrentDate())
  const [backgroundImage, setBackgroundImage] = useState<BackgroundImage | null>(null)
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(true)
  const editFormRef = useRef<HTMLDivElement>(null)

  // 从localStorage加载或保存主题设置
  useEffect(() => {
    // 加载保存的主题
    const savedThemeId = localStorage.getItem('bookmarkTheme')
    if (savedThemeId) {
      const savedTheme = themes.find(t => t.id === savedThemeId)
      if (savedTheme) {
        setTheme(savedTheme)
      }
    }
  }, [])

  // 保存主题设置
  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('bookmarkTheme', newTheme.id)
    setThemeMenuOpen(false)
  }

  // 获取随机背景图片
  useEffect(() => {
    const fetchRandomBackground = async () => {
      try {
        setIsBackgroundLoading(true)
        
        // 检查本地存储中是否有今天的图片
        const today = new Date().toDateString()
        const savedImage = localStorage.getItem('backgroundImage')
        const savedDate = localStorage.getItem('backgroundImageDate')
        
        // 如果有今天的图片，直接使用
        if (savedImage && savedDate === today) {
          setBackgroundImage(JSON.parse(savedImage))
          setIsBackgroundLoading(false)
          return
        }
        
        // 否则获取新图片
        const collections = '4246141,1258090,825770' // 精选自然、景观集合
        const response = await fetch(
          `https://api.unsplash.com/photos/random?collections=${collections}&orientation=landscape`,
          {
            headers: {
              Authorization: 'Client-ID 7dDzpUhR4Ydbe2AyQeWrXg7K7LSTbLVXEgZWW4uN5Rg' // 公共访问密钥
            }
          }
        )
        
        if (!response.ok) {
          throw new Error('获取背景图片失败')
        }
        
        const data = await response.json()
        
        const imageData: BackgroundImage = {
          url: data.urls.regular,
          author: data.user.name,
          authorUrl: data.user.links.html,
          downloadLocation: data.links.download_location
        }
        
        // 记录下载统计（Unsplash API要求）
        fetch(imageData.downloadLocation, {
          headers: {
            Authorization: 'Client-ID 7dDzpUhR4Ydbe2AyQeWrXg7K7LSTbLVXEgZWW4uN5Rg'
          }
        }).catch(e => console.error('Failed to trigger download count:', e))
        
        // 保存到本地存储
        localStorage.setItem('backgroundImage', JSON.stringify(imageData))
        localStorage.setItem('backgroundImageDate', today)
        
        setBackgroundImage(imageData)
        setIsBackgroundLoading(false)
      } catch (err) {
        console.error('获取背景图片失败:', err)
        setIsBackgroundLoading(false)
      }
    }
    
    fetchRandomBackground()
  }, [])

  useEffect(() => {
    // 获取书签数据
    const fetchBookmarks = async () => {
      try {
        // 确保chrome.bookmarks API可用
        if (!chrome.bookmarks) {
          throw new Error("书签API不可用")
        }

        // 获取所有书签
        const bookmarks = await chrome.bookmarks.getTree()
        
        // 处理书签树，提取文件夹
        const folders = extractFolders(bookmarks[0])
        setBookmarkFolders(folders)
        setLoading(false)
      } catch (err) {
        console.error("获取书签失败:", err)
        setError("获取书签失败，请检查扩展权限")
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [])

  // 提取书签文件夹及其内容
  const extractFolders = (node: BookmarkTreeNode): BookmarkTreeNode[] => {
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

  // 获取文件夹中的书签（最多5个）
  const getBookmarksInFolder = (folder: BookmarkTreeNode) => {
    if (!folder.children) return []
    
    return folder.children
      .filter(child => child.url) // 只选择有URL的项目（实际书签而非子文件夹）
      .slice(0, 5) // 最多展示5个
  }
  
  // 打开文件夹详情视图
  const openFolderDetail = (folderId: string) => {
    setActiveFolder(folderId)
  }
  
  // 关闭文件夹详情视图
  const closeFolderDetail = () => {
    setActiveFolder(null)
  }

  // 打开编辑模式
  const startEdit = (bookmark: BookmarkTreeNode, folderId: string) => {
    if (!bookmark.url) return
    
    setEditingBookmark({
      id: bookmark.id,
      title: bookmark.title,
      url: bookmark.url,
      folderId
    })
  }
  
  // 取消编辑
  const cancelEdit = () => {
    setEditingBookmark(null)
  }
  
  // 保存编辑后的书签
  const saveBookmark = async () => {
    if (!editingBookmark) return
    
    try {
      await chrome.bookmarks.update(editingBookmark.id, {
        title: editingBookmark.title,
        url: editingBookmark.url
      })
      
      // 更新本地数据
      setBookmarkFolders(prev => {
        return prev.map(folder => {
          if (folder.id === editingBookmark.folderId && folder.children) {
            return {
              ...folder,
              children: folder.children.map(child => {
                if (child.id === editingBookmark.id) {
                  return {
                    ...child,
                    title: editingBookmark.title,
                    url: editingBookmark.url
                  }
                }
                return child
              })
            }
          }
          return folder
        })
      })
      
      setEditingBookmark(null)
      showActionMessage('书签已更新', 'success')
    } catch (err) {
      console.error('更新书签失败:', err)
      showActionMessage('更新书签失败', 'error')
    }
  }
  
  // 确认删除书签
  const confirmDelete = (bookmark: BookmarkTreeNode, folderId: string) => {
    setDeleteConfirm({
      bookmarkId: bookmark.id,
      title: bookmark.title,
      folderId
    })
  }
  
  // 取消删除
  const cancelDelete = () => {
    setDeleteConfirm(null)
  }
  
  // 执行删除书签
  const executeDelete = async () => {
    if (!deleteConfirm) return
    
    try {
      await chrome.bookmarks.remove(deleteConfirm.bookmarkId)
      
      // 更新本地数据
      setBookmarkFolders(prev => {
        return prev.map(folder => {
          if (folder.id === deleteConfirm.folderId && folder.children) {
            return {
              ...folder,
              children: folder.children.filter(child => child.id !== deleteConfirm.bookmarkId)
            }
          }
          return folder
        })
      })
      
      setDeleteConfirm(null)
      showActionMessage('书签已删除', 'success')
    } catch (err) {
      console.error('删除书签失败:', err)
      showActionMessage('删除书签失败', 'error')
    }
  }
  
  // 显示操作结果消息
  const showActionMessage = (text: string, type: 'success' | 'error') => {
    setActionMessage({ text, type })
    setTimeout(() => setActionMessage(null), 3000)
  }
  
  // 点击外部关闭编辑表单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editFormRef.current && !editFormRef.current.contains(event.target as Node)) {
        cancelEdit()
      }
    }
    
    if (editingBookmark) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editingBookmark])

  // 过滤文件夹名称
  const filteredFolders = searchTerm 
    ? bookmarkFolders.filter(folder => 
        folder.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : bookmarkFolders

  // 时间更新器 - 每30秒更新一次时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime())
      setCurrentDate(getCurrentDate())
    }, 30000) // 30秒更新一次
    
    return () => clearInterval(timer) // 组件卸载时清除定时器
  }, [])

  // 渲染书签列表项
  const renderBookmarkItem = (bookmark: BookmarkTreeNode, folderId: string) => (
    <li key={bookmark.id} className={`hover:${theme.hoverBg} rounded transition-colors group/item`}>
      <div className="flex items-center justify-between p-2">
        <a 
          href={bookmark.url} 
          className={`flex items-center min-w-0 max-w-[calc(100%-80px)] text-gray-700 hover:${theme.textSecondary}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="inline-block w-5 h-5 mr-3 flex-shrink-0">
            {bookmark.url && (
              <img 
                src={`https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=64`} 
                alt=""
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.onerror = null
                  target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>'
                }}
              />
            )}
          </span>
          <span className="truncate">{bookmark.title || "无标题"}</span>
        </a>
        
        {/* 操作按钮 */}
        <div className="flex items-center gap-1 ml-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              startEdit(bookmark, folderId)
            }}
            className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
            title="编辑书签"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              confirmDelete(bookmark, folderId)
            }}
            className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
            title="删除书签"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </li>
  )

  // 渲染主题选择器
  const renderThemeSelector = () => (
    <div className={`fixed right-0 top-0 bottom-0 z-40 ${themeMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
      <div className="h-full w-64 bg-white shadow-xl flex flex-col">
        <div className={`${theme.gradient} p-4 text-white flex justify-between items-center`}>
          <h3 className="font-medium">选择主题</h3>
          <button 
            onClick={() => setThemeMenuOpen(false)}
            className="text-white hover:text-white/80"
            aria-label="关闭主题选择"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => changeTheme(themeOption)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  theme.id === themeOption.id ? 
                  `${themeOption.gradient} text-white` : 
                  'bg-gray-50 hover:bg-gray-100 text-gray-800'
                }`}
              >
                <div className={`w-6 h-6 rounded-full ${themeOption.gradient} mr-3`}></div>
                <span>{themeOption.name}</span>
                {theme.id === themeOption.id && (
                  <svg className="ml-auto h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // 渲染文件夹详情视图
  const renderFolderDetail = () => {
    if (!activeFolder) return null
    
    const folder = bookmarkFolders.find(f => f.id === activeFolder)
    if (!folder) return null
    
    const bookmarks = folder.children?.filter(child => child.url) || []
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-slideUp">
          <div className={`${theme.gradient} p-3 rounded-t-xl flex justify-between items-center`}>
            <div className="flex-1 flex items-center">
              <h2 className="text-xl font-semibold text-white">{folder.title}</h2>
              <p className="text-white/80 ml-2">{bookmarks.length} 个书签</p>
            </div>
            <button 
              onClick={closeFolderDetail}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors focus:outline-none"
              aria-label="关闭"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-grow">
            {bookmarks.length > 0 ? (
              <ul className="space-y-1 divide-y divide-gray-100">
                {bookmarks.map((bookmark) => renderBookmarkItem(bookmark, folder.id))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <p className="text-gray-500">此文件夹没有书签</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-100 p-4 flex justify-end bg-gray-50">
            <button 
              onClick={closeFolderDetail}
              className={`px-4 py-2 ${theme.primary} hover:opacity-90 text-white rounded-lg transition-colors`}
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 渲染编辑表单
  const renderEditForm = () => {
    if (!editingBookmark) return null
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div 
          ref={editFormRef}
          className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-slideUp"
        >
          <h3 className="text-xl font-semibold mb-4">编辑书签</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="bookmark-title" className="block text-sm font-medium text-gray-700 mb-1">
                标题
              </label>
              <input
                id="bookmark-title"
                type="text"
                value={editingBookmark.title}
                onChange={(e) => setEditingBookmark({...editingBookmark, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="书签标题"
              />
            </div>
            
            <div>
              <label htmlFor="bookmark-url" className="block text-sm font-medium text-gray-700 mb-1">
                网址
              </label>
              <input
                id="bookmark-url"
                type="url"
                value={editingBookmark.url}
                onChange={(e) => setEditingBookmark({...editingBookmark, url: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={cancelEdit}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={saveBookmark}
              className={`px-4 py-2 ${theme.primary} hover:opacity-90 text-white rounded-lg transition-colors`}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  // 渲染删除确认对话框
  const renderDeleteConfirm = () => {
    if (!deleteConfirm) return null
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-slideUp">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">确认删除书签</h3>
            <p className="text-sm text-gray-500 mb-6">
              您确定要删除书签 "{deleteConfirm.title || '无标题'}" 吗？此操作无法撤销。
            </p>
            
            <div className="flex justify-center space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // 渲染操作消息
  const renderActionMessage = () => {
    if (!actionMessage) return null
    
    const bgColor = actionMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
    
    return (
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn">
        <div className={`${bgColor} text-white px-4 py-2 rounded-lg shadow-lg`}>
          {actionMessage.text}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme.background}`}>
        <div className="flex flex-col items-center">
          <div className={`w-12 h-12 border-4 ${theme.primary} border-t-transparent rounded-full animate-spin mb-4`}></div>
          <div className={`text-xl ${theme.textPrimary}`}>加载书签中...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${theme.background}`}>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="text-xl text-red-500 mb-4">{error}</div>
          <p className="text-gray-600 mb-6">请确保扩展有权限访问书签数据</p>
          <button 
            onClick={() => window.location.reload()}
            className={`px-4 py-2 ${theme.primary} hover:opacity-90 text-white rounded-lg transition-colors`}
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  // 背景样式
  const backgroundStyle = backgroundImage ? {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage.url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : {}

  return (
    <div 
      className={`min-h-screen ${!backgroundImage ? theme.background : ''} p-8 transition-colors duration-300`}
      style={backgroundStyle}
    >
      {/* 主题切换按钮 */}
      <button
        onClick={() => setThemeMenuOpen(true)}
        className="fixed right-4 top-4 z-30 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all"
        aria-label="更换主题"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>

      {/* 主题选择器 */}
      {renderThemeSelector()}

      <div className="max-w-7xl mx-auto">
        {/* 顶部区域 */}
        <div className="mb-6 text-center">
          <div className={`text-4xl font-bold ${backgroundImage ? 'text-white' : theme.textPrimary} mb-2`}>{currentTime}</div>
          <div className={`text-lg ${backgroundImage ? 'text-white/80' : theme.textSecondary}`}>{currentDate}</div>
        </div>
        
        {/* 搜索栏 */}
        <div className="mb-4 max-w-lg mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索书签文件夹..."
              className={`w-full px-4 py-3 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-${theme.id}-400 focus:border-transparent bg-white/90 backdrop-blur-sm`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className={`absolute right-3 top-3 h-6 w-6 ${theme.textSecondary}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <h2 className={`text-2xl font-bold ${backgroundImage ? 'text-white' : theme.textPrimary} mb-6`}>我的书签目录</h2>
        
        {filteredFolders.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-600">
              {searchTerm ? "没有找到匹配的书签文件夹" : "没有找到书签文件夹"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFolders.map((folder) => {
              const bookmarksInFolder = folder.children?.filter(child => child.url) || []
              const totalBookmarks = bookmarksInFolder.length
              const hasMoreBookmarks = totalBookmarks > 5
              
              return (
                <div 
                  key={folder.id} 
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                >
                  <div className={`${theme.gradient} p-3 flex flex-row items-center justify-between`}>
                    <h4 className="flex-1 text-base font-semibold text-white truncate text-overflow-ellipsis">{folder.title}</h4>
                    <div className="text-white/80 text-sm mt-1">
                      {totalBookmarks} 个书签
                    </div>
                  </div>
                  
                  <div className="p-1">
                    {bookmarksInFolder.length > 0 ? (
                      <ul className="space-y-1 divide-y divide-gray-100">
                        {bookmarksInFolder.slice(0, 5).map((bookmark) => renderBookmarkItem(bookmark, folder.id))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic p-2 text-center">此文件夹没有书签</p>
                    )}
                  </div>
                  {hasMoreBookmarks && (
                    <div className="p-2 bg-gray-50 border-t border-gray-100 flex justify-end items-center">
                      <button 
                        onClick={() => openFolderDetail(folder.id)}
                        className={`px-1 py-1 ${theme.secondary} ${theme.textSecondary} hover:bg-opacity-80 rounded-lg transition-colors group-hover:bg-opacity-80`}
                      >
                        查看全部 {totalBookmarks} 项
                      </button>
                    </div>
                  )}
                  
                </div>
              )
            })}
          </div>
        )}
      </div>
      
      <footer className={`mt-16 text-center ${backgroundImage ? 'text-white/70' : theme.textSecondary} text-sm pb-8`}>
        {backgroundImage && (
          <div className="mb-2">
            背景由 <a 
              href={backgroundImage.authorUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline hover:text-white"
            >
              {backgroundImage.author}
            </a> 在 Unsplash 上提供
          </div>
        )}
        <p>书签管理器 - 轻松浏览您的所有书签目录</p>
      </footer>
      
      {/* 文件夹详情模态框 */}
      {renderFolderDetail()}
      
      {/* 编辑表单 */}
      {renderEditForm()}
      
      {/* 删除确认对话框 */}
      {renderDeleteConfirm()}
      
      {/* 操作消息 */}
      {renderActionMessage()}
    </div>
  )
}

export default NewTab 