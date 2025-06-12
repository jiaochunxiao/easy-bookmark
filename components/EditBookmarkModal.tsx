import { useEffect, useRef } from "react"

import type { EditingBookmark, Theme } from "../types"

interface EditBookmarkModalProps {
  editingBookmark: EditingBookmark | null
  theme: Theme
  onSave: () => void
  onCancel: () => void
  onChange: (updates: Partial<EditingBookmark>) => void
}

export const EditBookmarkModal = ({
  editingBookmark,
  theme,
  onSave,
  onCancel,
  onChange
}: EditBookmarkModalProps) => {
  const editFormRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭编辑表单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editFormRef.current &&
        !editFormRef.current.contains(event.target as Node)
      ) {
        onCancel()
      }
    }

    if (editingBookmark) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [editingBookmark, onCancel])

  if (!editingBookmark) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        ref={editFormRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-slideUp">
        <h3 className="text-xl font-semibold mb-4">编辑书签</h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="bookmark-title"
              className="block text-sm font-medium text-gray-700 mb-1">
              标题
            </label>
            <input
              id="bookmark-title"
              type="text"
              value={editingBookmark.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="书签标题"
            />
          </div>

          <div>
            <label
              htmlFor="bookmark-url"
              className="block text-sm font-medium text-gray-700 mb-1">
              网址
            </label>
            <input
              id="bookmark-url"
              type="url"
              value={editingBookmark.url}
              onChange={(e) => onChange({ url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors">
            取消
          </button>
          <button
            onClick={onSave}
            className={`px-4 py-2 ${theme.primary} hover:opacity-90 text-white rounded-lg transition-colors`}>
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
