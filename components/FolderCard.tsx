import type { BookmarkTreeNode, Theme } from '../types'
import { BookmarkItem } from './BookmarkItem'
import { UNCATEGORIZED_FOLDER_ID } from '../hooks/useBookmarks'

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
  const isUncategorizedFolder = folder.id === UNCATEGORIZED_FOLDER_ID

  return (
    <div 
      className={`${
        useRandomBackground ? 'bg-white/80 opacity-80' : 'bg-white/90'
      } backdrop-blur-sm rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group`}
    >
      <div className={`${theme.gradient} p-3 flex flex-row items-center justify-between`}>
        <h4 className="flex-1 text-base font-semibold text-white truncate">
          {isUncategorizedFolder ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {folder.title}
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {folder.title}
            </>
          )}
        </h4>
        <div className="text-white/80 text-sm">
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
          <p className="text-gray-500 italic p-2 text-center">
            {isUncategorizedFolder ? "没有未归类的书签" : "此文件夹没有书签"}
          </p>
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
      
      {isUncategorizedFolder && !hasMoreBookmarks && (
        <div className="p-2 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            这些书签没有被归类到任何文件夹中
          </p>
        </div>
      )}
    </div>
  )
} 