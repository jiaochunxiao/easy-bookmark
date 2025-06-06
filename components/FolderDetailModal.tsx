import type { BookmarkTreeNode, Theme } from '../types'
import { BookmarkItem } from './BookmarkItem'
import { UNCATEGORIZED_FOLDER_ID } from '../hooks/useBookmarks'

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
  const isUncategorizedFolder = folder.id === UNCATEGORIZED_FOLDER_ID
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-slideUp">
        <div className={`${theme.gradient} p-3 rounded-t-xl flex justify-between items-center`}>
          <div className="flex-1 flex items-center">
            {isUncategorizedFolder ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            )}
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
              {isUncategorizedFolder ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              )}
              <p className="text-gray-500">
                {isUncategorizedFolder ? "没有未归类的书签" : "此文件夹没有书签"}
              </p>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-100 p-4 flex justify-between items-center bg-gray-50">
          {isUncategorizedFolder && (
            <p className="text-sm text-gray-600">
              这些书签没有被归类到任何文件夹中
            </p>
          )}
          <button 
            onClick={onClose}
            className={`px-4 py-2 ${theme.primary} hover:opacity-90 text-white rounded-lg transition-colors ${isUncategorizedFolder ? '' : 'ml-auto'}`}
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
} 