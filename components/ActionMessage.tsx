import type { ActionMessage as ActionMessageType } from '../types'

interface ActionMessageProps {
  message: ActionMessageType | null
}

export const ActionMessage = ({ message }: ActionMessageProps) => {
  if (!message) return null
  
  const bgColor = message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
  
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn">
      <div className={`${bgColor} text-white px-4 py-2 rounded-lg shadow-lg`}>
        {message.text}
      </div>
    </div>
  )
} 