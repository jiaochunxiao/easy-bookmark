import { useEffect, useState } from "react"

import "./style.css"

import { ActionMessage as ActionMessageComponent } from "./components/ActionMessage"
import { DeleteConfirmModal } from "./components/DeleteConfirmModal"
import { EditBookmarkModal } from "./components/EditBookmarkModal"
// 导入组件
import { FolderCard } from "./components/FolderCard"
import { FolderDetailModal } from "./components/FolderDetailModal"
import { ThemeSelector } from "./components/ThemeSelector"
// 导入主题配置
import { themes } from "./config/themes"
import { useBackground } from "./hooks/useBackground"
// 导入自定义 hooks
import { useBookmarks } from "./hooks/useBookmarks"
// 导入类型定义
import type {
  ActionMessage,
  BookmarkTreeNode,
  DeleteConfirm,
  EditingBookmark
} from "./types"
// 导入工具函数
import { getCurrentDate, getCurrentTime } from "./utils"

function NewTab() {
  // 状态管理
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFolder, setActiveFolder] = useState<string | null>(null)
  const [theme, setTheme] = useState(themes[0]) // 默认使用第一个主题
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [editingBookmark, setEditingBookmark] =
    useState<EditingBookmark | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirm | null>(null)
  const [actionMessage, setActionMessage] = useState<ActionMessage | null>(null)
  const [currentTime, setCurrentTime] = useState(getCurrentTime())
  const [currentDate, setCurrentDate] = useState(getCurrentDate())

  // 显示操作结果消息
  const showActionMessage = (text: string, type: "success" | "error") => {
    setActionMessage({ text, type })
    setTimeout(() => setActionMessage(null), 3000)
  }

  // 使用自定义 hooks
  const { bookmarkFolders, loading, error, updateBookmark, removeBookmark } =
    useBookmarks()
  const {
    backgroundImage,
    backgroundLoading,
    useRandomBackground,
    fetchRandomBackground,
    toggleBackgroundMode
  } = useBackground(showActionMessage)

  // 从localStorage加载或保存主题设置
  useEffect(() => {
    // 加载保存的主题
    const savedThemeId = localStorage.getItem("bookmarkTheme")
    if (savedThemeId) {
      const savedTheme = themes.find((t) => t.id === savedThemeId)
      if (savedTheme) {
        setTheme(savedTheme)
      }
    }
  }, [])

  // 保存主题设置
  const changeTheme = (newTheme: (typeof themes)[0]) => {
    setTheme(newTheme)
    localStorage.setItem("bookmarkTheme", newTheme.id)
    setThemeMenuOpen(false)
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

  // 更新编辑中的书签
  const updateEditingBookmark = (updates: Partial<EditingBookmark>) => {
    if (!editingBookmark) return
    setEditingBookmark({ ...editingBookmark, ...updates })
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
      updateBookmark(editingBookmark.id, editingBookmark.folderId, {
        title: editingBookmark.title,
        url: editingBookmark.url
      })

      setEditingBookmark(null)
      showActionMessage("书签已更新", "success")
    } catch (err) {
      console.error("更新书签失败:", err)
      showActionMessage("更新书签失败", "error")
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

      // 删除本地数据
      removeBookmark(deleteConfirm.bookmarkId, deleteConfirm.folderId)

      setDeleteConfirm(null)
      showActionMessage("书签已删除", "success")
    } catch (err) {
      console.error("删除书签失败:", err)
      showActionMessage("删除书签失败", "error")
    }
  }

  // 过滤文件夹名称和书签标题
  const filteredFolders = searchTerm
    ? bookmarkFolders.filter((folder) => {
        // 搜索文件夹名称
        if (folder.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true
        }
        // 搜索文件夹内的书签标题
        return folder.children?.some(
          (child) =>
            child.url &&
            child.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    : bookmarkFolders

  // 时间更新器 - 每30秒更新一次时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime())
      setCurrentDate(getCurrentDate())
    }, 30000) // 30秒更新一次

    return () => clearInterval(timer) // 组件卸载时清除定时器
  }, [])

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${theme.background}`}>
        <div className="flex flex-col items-center">
          <div
            className={`w-12 h-12 border-4 ${theme.primary} border-t-transparent rounded-full animate-spin mb-4`}></div>
          <div className={`text-xl ${theme.textPrimary}`}>加载书签中...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${theme.background}`}>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="text-xl text-red-500 mb-4">{error}</div>
          <p className="text-gray-600 mb-6">请确保扩展有权限访问书签数据</p>
          <button
            onClick={() => window.location.reload()}
            className={`px-4 py-2 ${theme.primary} hover:opacity-90 text-white rounded-lg transition-colors`}>
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        useRandomBackground && backgroundImage
          ? "bg-contain bg-position-left-top bg-repeat"
          : theme.background
      }`}
      style={
        useRandomBackground && backgroundImage
          ? { backgroundImage: `url(${backgroundImage})` }
          : {}
      }>
      {/* 如果使用随机背景，添加半透明遮罩层 */}
      {useRandomBackground && backgroundImage && (
        <div className="fixed inset-0 bg-black bg-opacity-10 z-0"></div>
      )}

      <div className="relative z-10 p-8">
        {/* 主题切换按钮 */}
        <button
          onClick={() => setThemeMenuOpen(true)}
          className="fixed right-4 top-4 z-30 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all"
          aria-label="个性化设置">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>

        {/* 主题选择器 */}
        <ThemeSelector
          isOpen={themeMenuOpen}
          currentTheme={theme}
          useRandomBackground={useRandomBackground}
          backgroundLoading={backgroundLoading}
          onClose={() => setThemeMenuOpen(false)}
          onThemeChange={changeTheme}
          onToggleBackground={toggleBackgroundMode}
          onFetchBackground={fetchRandomBackground}
        />

        <div className="max-w-7xl mx-auto">
          {/* 顶部区域 */}
          <div className="mb-6 text-center">
            <div
              className={`text-4xl font-bold mb-2 ${
                useRandomBackground
                  ? "text-white drop-shadow-lg"
                  : theme.textPrimary
              }`}>
              {currentTime}
            </div>
            <div
              className={`text-lg ${
                useRandomBackground
                  ? "text-white/90 drop-shadow-md"
                  : theme.textSecondary
              }`}>
              {currentDate}
            </div>
          </div>

          {/* 搜索栏 */}
          <div className="mb-4 max-w-lg mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索书签文件夹和书签..."
                className={`w-full px-4 py-3 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-${theme.id}-400 focus:border-transparent ${
                  useRandomBackground ? "bg-white/90" : "bg-white/90"
                } backdrop-blur-sm`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className={`absolute right-3 top-3 h-6 w-6 ${theme.textSecondary}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <h2
            className={`text-2xl font-bold mb-6 ${
              useRandomBackground
                ? "text-white drop-shadow-lg"
                : theme.textPrimary
            }`}>
            我的书签目录
          </h2>

          {filteredFolders.length === 0 ? (
            <div
              className={`${
                useRandomBackground ? "bg-white/95" : "bg-white/90"
              } backdrop-blur-sm rounded-xl shadow-md p-8 text-center mb-8`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-300 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-gray-600">
                {searchTerm
                  ? "没有找到匹配的书签文件夹或书签"
                  : "没有找到书签文件夹"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredFolders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  theme={theme}
                  useRandomBackground={useRandomBackground}
                  onEdit={startEdit}
                  onDelete={confirmDelete}
                  onOpenDetail={openFolderDetail}
                />
              ))}
            </div>
          )}
        </div>

        <footer
          className={`mt-16 text-center text-sm pb-8 ${
            useRandomBackground
              ? "text-white/80 drop-shadow-md"
              : `${theme.textSecondary}`
          }`}>
          <p>书签管理器 - 轻松浏览您的所有书签目录</p>
        </footer>
      </div>

      {/* 文件夹详情模态框 */}
      <FolderDetailModal
        folder={bookmarkFolders.find((f) => f.id === activeFolder) || null}
        theme={theme}
        onClose={closeFolderDetail}
        onEdit={startEdit}
        onDelete={confirmDelete}
      />

      {/* 编辑表单 */}
      <EditBookmarkModal
        editingBookmark={editingBookmark}
        theme={theme}
        onSave={saveBookmark}
        onCancel={cancelEdit}
        onChange={updateEditingBookmark}
      />

      {/* 删除确认对话框 */}
      <DeleteConfirmModal
        deleteConfirm={deleteConfirm}
        onConfirm={executeDelete}
        onCancel={cancelDelete}
      />

      {/* 操作消息 */}
      <ActionMessageComponent message={actionMessage} />
    </div>
  )
}

export default NewTab
