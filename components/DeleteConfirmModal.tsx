import type { DeleteConfirm } from "../types"

interface DeleteConfirmModalProps {
  deleteConfirm: DeleteConfirm | null
  onConfirm: () => void
  onCancel: () => void
}

export const DeleteConfirmModal = ({
  deleteConfirm,
  onConfirm,
  onCancel
}: DeleteConfirmModalProps) => {
  if (!deleteConfirm) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-slideUp">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            确认删除书签
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            您确定要删除书签 "{deleteConfirm.title || "无标题"}"
            吗？此操作无法撤销。
          </p>

          <div className="flex justify-center space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors">
              取消
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
