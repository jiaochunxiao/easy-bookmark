import type { BookmarkTreeNode, Theme } from '../types'

interface BookmarkItemProps {
  bookmark: BookmarkTreeNode
  folderId: string
  theme: Theme
  onEdit: (bookmark: BookmarkTreeNode, folderId: string) => void
  onDelete: (bookmark: BookmarkTreeNode, folderId: string) => void
}

export const BookmarkItem = ({ bookmark, folderId, theme, onEdit, onDelete }: BookmarkItemProps) => {
  return (
    <li className={`hover:${theme.hoverBg} rounded transition-colors group/item`}>
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
              onEdit(bookmark, folderId)
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
              onDelete(bookmark, folderId)
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
} 