import { useState, useEffect } from 'react'
import type { BookmarkTreeNode } from '../types'
import { extractFolders, extractUncategorizedBookmarks } from '../utils'

interface UseBookmarksReturn {
  bookmarkFolders: BookmarkTreeNode[]
  loading: boolean
  error: string | null
  updateBookmark: (bookmarkId: string, folderId: string, updates: { title: string; url: string }) => void
  removeBookmark: (bookmarkId: string, folderId: string) => void
}

// 未归纳书签虚拟文件夹的ID
export const UNCATEGORIZED_FOLDER_ID = 'uncategorized-bookmarks'

export const useBookmarks = (): UseBookmarksReturn => {
  const [bookmarkFolders, setBookmarkFolders] = useState<BookmarkTreeNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 更新书签（包括文件夹中的书签和未归纳的书签）
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

  // 删除书签（包括文件夹中的书签和未归纳的书签）
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

        // 处理书签树，提取文件夹和未归纳的书签
        const folders = extractFolders(bookmarks[0])
        const uncategorized = extractUncategorizedBookmarks(bookmarks[0])

        // 创建未归纳书签的虚拟文件夹
        const uncategorizedFolder: BookmarkTreeNode = {
          id: UNCATEGORIZED_FOLDER_ID,
          title: '未归类书签',
          children: uncategorized,
          parentId: 'virtual',
          dateAdded: Date.now(),
          dateGroupModified: Date.now()
        }

        // 将未归纳书签文件夹添加到文件夹列表的最后（如果有未归纳书签的话）
        const allFolders = uncategorized.length > 0
          ? [...folders, uncategorizedFolder]
          : folders

        setBookmarkFolders(allFolders)
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
