import type { BookmarkTreeNode, Theme } from '../types'
import { BookmarkItem } from './BookmarkItem'

interface FolderCardProps {
  folder: BookmarkTreeNode
  theme: Theme
  useRandomBackground: boolean
  onEdit: (bookmark: BookmarkTreeNode, folderId: string) => void
  onDelete: (bookmark: BookmarkTreeNode, folderId: string) => void
  onOpenDetail: (folderId: string) => void
}

export const FolderCard = ({ 
  folder, 
  theme, 
  useRandomBackground, 
  onEdit, 
  onDelete, 
  onOpenDetail 
}: FolderCardProps) => {
  const bookmarksInFolder = folder.children?.filter(child => child.url) || []
  const totalBookmarks = bookmarksInFolder.length
  const hasMoreBookmarks = totalBookmarks > 5

  return (
    <div 
      className={`${
        useRandomBackground ? 'bg-white/80 opacity-80' : 'bg-white/90'
      } backdrop-blur-sm rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group`}
    >
      <div className={`${theme.gradient} p-3 flex flex-row items-center justify-between`}>
        <h4 className="flex-1 text-base font-semibold text-white truncate text-overflow-ellipsis">
          {folder.title}
        </h4>
        <div className="text-white/80 text-sm mt-1">
          {totalBookmarks} 个书签
        </div>
      </div>
      
      <div className="p-1">
        {bookmarksInFolder.length > 0 ? (
          <ul className="space-y-1 divide-y divide-gray-100">
            {bookmarksInFolder.slice(0, 5).map((bookmark) => (
              <BookmarkItem
                key={bookmark.id}
                bookmark={bookmark}
                folderId={folder.id}
                theme={theme}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic p-2 text-center">此文件夹没有书签</p>
        )}
      </div>
      
      {hasMoreBookmarks && (
        <div className="p-2 bg-gray-50 border-t border-gray-100 flex justify-end items-center">
          <button 
            onClick={() => onOpenDetail(folder.id)}
            className={`px-1 py-1 ${theme.secondary} ${theme.textSecondary} hover:bg-opacity-80 rounded-lg transition-colors group-hover:bg-opacity-80`}
          >
            查看全部 {totalBookmarks} 项
          </button>
        </div>
      )}
    </div>
  )
} 