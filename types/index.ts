// 定义书签树节点的类型
export interface BookmarkTreeNode {
  id: string
  title: string
  url?: string
  children?: BookmarkTreeNode[]
  dateAdded?: number
  dateGroupModified?: number
  parentId?: string
}

// 编辑模式接口
export interface EditingBookmark {
  id: string
  title: string
  url: string
  folderId: string
}

// 删除确认接口
export interface DeleteConfirm {
  bookmarkId: string
  title: string
  folderId: string
}

// 定义主题类型
export interface Theme {
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

// 操作消息类型
export interface ActionMessage {
  text: string
  type: 'success' | 'error'
} 