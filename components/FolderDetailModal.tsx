import type { BookmarkTreeNode, Theme } from '../types'
import { BookmarkItem } from './BookmarkItem'

interface FolderDetailModalProps {
  folder: BookmarkTreeNode | null
  theme: Theme
  onClose: () => void
  onEdit: (bookmark: BookmarkTreeNode, folderId: string) => void
  onDelete: (bookmark: BookmarkTreeNode, folderId: string) => void
}

export const FolderDetailModal = ({ 
  folder, 
  theme, 
  onClose, 
  onEdit, 
  onDelete 
}: FolderDetailModalProps) => {
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
            onClick={onClose}
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
              {bookmarks.map((bookmark) => (
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
            onClick={onClose}
            className={`px-4 py-2 ${theme.primary} hover:opacity-90 text-white rounded-lg transition-colors`}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
} 