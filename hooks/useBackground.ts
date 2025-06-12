import { useState, useEffect } from 'react'
import type { ActionMessage } from '../types'

interface UseBackgroundReturn {
  backgroundImage: string
  backgroundLoading: boolean
  useRandomBackground: boolean
  fetchRandomBackground: () => Promise<void>
  toggleBackgroundMode: () => void
}

export const useBackground = (
  showActionMessage: (text: string, type: 'success' | 'error') => void
): UseBackgroundReturn => {
  const [backgroundImage, setBackgroundImage] = useState<string>("")
  const [backgroundLoading, setBackgroundLoading] = useState(false)
  const [useRandomBackground, setUseRandomBackground] = useState(false)

  // 获取随机背景图片
  const fetchRandomBackground = async () => {
    setBackgroundLoading(true)
    try {
      const response = await fetch('https://bing.img.run/rand_uhd.php', {
        method: 'GET',
        mode: 'cors'
      })
      
      if (response.ok) {
        // 获取图片的blob数据
        const blob = await response.blob()
        
        // 将 blob 转换为 base64 格式
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          setBackgroundImage(base64String)
          
          // 保存到localStorage
          localStorage.setItem('randomBackgroundImage', base64String)
          localStorage.setItem('backgroundImageTimestamp', Date.now().toString())
          
          showActionMessage('背景图片已更新', 'success')
        }
        reader.readAsDataURL(blob)
      } else {
        throw new Error('获取图片失败')
      }
    } catch (err) {
      console.error('获取随机背景图片失败:', err)
      showActionMessage('获取背景图片失败', 'error')
    } finally {
      setBackgroundLoading(false)
    }
  }

  // 切换背景模式
  const toggleBackgroundMode = () => {
    const newMode = !useRandomBackground
    setUseRandomBackground(newMode)
    localStorage.setItem('useRandomBackground', newMode.toString())
    if (newMode && !backgroundImage) {
      fetchRandomBackground()
    }
  }

  // 初始化背景设置
  useEffect(() => {
    const savedBackgroundMode = localStorage.getItem('useRandomBackground')
    if (savedBackgroundMode === 'true') {
      setUseRandomBackground(true)
      
      // 检查是否有缓存的背景图片
      const savedImage = localStorage.getItem('randomBackgroundImage')
      const timestamp = localStorage.getItem('backgroundImageTimestamp')
      
      if (savedImage && timestamp) {
        const imageAge = Date.now() - parseInt(timestamp)
        // 如果图片缓存超过24小时，重新获取
        if (imageAge < 7 * 24 * 60 * 60 * 1000) {
          setBackgroundImage(savedImage)
        } else {
          fetchRandomBackground()
        }
      } else {
        fetchRandomBackground()
      }
    }
  }, [])

  return {
    backgroundImage,
    backgroundLoading,
    useRandomBackground,
    fetchRandomBackground,
    toggleBackgroundMode
  }
} 