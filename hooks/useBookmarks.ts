import { useState, useEffect } from 'react'
import type { BookmarkTreeNode } from '../types'
import { extractFolders } from '../utils'

interface UseBookmarksReturn {
  bookmarkFolders: BookmarkTreeNode[]
  loading: boolean
  error: string | null
  updateBookmark: (bookmarkId: string, folderId: string, updates: { title: string; url: string }) => void
  removeBookmark: (bookmarkId: string, folderId: string) => void
}

export const useBookmarks = (): UseBookmarksReturn => {
  const [bookmarkFolders, setBookmarkFolders] = useState<BookmarkTreeNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 更新书签
  const updateBookmark = (bookmarkId: string, folderId: string, updates: { title: string; url: string }) => {
    setBookmarkFolders(prev => {
      return prev.map(folder => {
        if (folder.id === folderId && folder.children) {
          return {
            ...folder,
            children: folder.children.map(child => {
              if (child.id === bookmarkId) {
                return {
                  ...child,
                  title: updates.title,
                  url: updates.url
                }
              }
              return child
            })
          }
        }
        return folder
      })
    })
  }

  // 删除书签
  const removeBookmark = (bookmarkId: string, folderId: string) => {
    setBookmarkFolders(prev => {
      return prev.map(folder => {
        if (folder.id === folderId && folder.children) {
          return {
            ...folder,
            children: folder.children.filter(child => child.id !== bookmarkId)
          }
        }
        return folder
      })
    })
  }

  // 获取书签数据
  useEffect(() => {
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

  return {
    bookmarkFolders,
    loading,
    error,
    updateBookmark,
    removeBookmark
  }
} 