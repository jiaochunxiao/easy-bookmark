import type { Theme } from '../types'
import { themes } from '../config/themes'

interface ThemeSelectorProps {
  isOpen: boolean
  currentTheme: Theme
  useRandomBackground: boolean
  backgroundLoading: boolean
  onClose: () => void
  onThemeChange: (theme: Theme) => void
  onToggleBackground: () => void
  onFetchBackground: () => void
}

export const ThemeSelector = ({
  isOpen,
  currentTheme,
  useRandomBackground,
  backgroundLoading,
  onClose,
  onThemeChange,
  onToggleBackground,
  onFetchBackground
}: ThemeSelectorProps) => {
  return (
    <div className={`fixed right-0 top-0 bottom-0 z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
      <div className="h-full w-64 bg-white shadow-xl flex flex-col">
        <div className={`${currentTheme.gradient} p-4 text-white flex justify-between items-center`}>
          <h3 className="font-medium">个性化设置</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-white/80"
            aria-label="关闭设置"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {/* 背景设置区域 */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">背景设置</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-700">随机背景</span>
                </div>
                <button
                  onClick={onToggleBackground}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    useRandomBackground ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      useRandomBackground ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {useRandomBackground && (
                <button
                  onClick={onFetchBackground}
                  disabled={backgroundLoading}
                  className="w-full flex items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {backgroundLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                      获取中...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      更换背景
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* 主题选择区域 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">主题颜色</h4>
            <div className="space-y-3">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => onThemeChange(themeOption)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    currentTheme.id === themeOption.id ? 
                    `${themeOption.gradient} text-white` : 
                    'bg-gray-50 hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full ${themeOption.gradient} mr-3`}></div>
                  <span>{themeOption.name}</span>
                  {currentTheme.id === themeOption.id && (
                    <svg className="ml-auto h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 