import type { Theme } from '../types'

// 预设主题
export const themes: Theme[] = [
  {
    id: "teal",
    name: "清新绿",
    primary: "bg-teal-500",
    secondary: "bg-teal-50",
    gradient: "bg-gradient-to-r from-teal-400 to-emerald-500 opacity-80",
    background: "bg-gradient-to-br from-teal-50 to-emerald-100",
    hoverBg: "bg-green-50",
    textPrimary: "text-teal-800",
    textSecondary: "text-teal-600"
  },
  {
    id: "blue",
    name: "天空蓝",
    primary: "bg-blue-500",
    secondary: "bg-blue-50",
    gradient: "bg-gradient-to-r from-blue-400 to-indigo-500 opacity-80",
    background: "bg-gradient-to-br from-blue-50 to-indigo-100",
    hoverBg: "bg-blue-50",
    textPrimary: "text-blue-800",
    textSecondary: "text-blue-600"
  },
  {
    id: "purple",
    name: "梦幻紫",
    primary: "bg-purple-500",
    secondary: "bg-purple-50",
    gradient: "bg-gradient-to-r from-purple-400 to-pink-500 opacity-80",
    background: "bg-gradient-to-br from-purple-50 to-pink-100",
    hoverBg: "bg-purple-50",
    textPrimary: "text-purple-800",
    textSecondary: "text-purple-600"
  },
  {
    id: "amber",
    name: "暖阳橙",
    primary: "bg-amber-500",
    secondary: "bg-amber-50",
    gradient: "bg-gradient-to-r from-amber-400 to-orange-500 opacity-80",
    background: "bg-gradient-to-br from-amber-50 to-orange-100",
    hoverBg: "bg-amber-50",
    textPrimary: "text-amber-800",
    textSecondary: "text-amber-600"
  },
  {
    id: "slate",
    name: "典雅灰",
    primary: "bg-slate-500",
    secondary: "bg-slate-50",
    gradient: "bg-gradient-to-r from-slate-400 to-gray-500 opacity-80",
    background: "bg-gradient-to-br from-slate-50 to-gray-100",
    hoverBg: "bg-slate-50",
    textPrimary: "text-slate-800",
    textSecondary: "text-slate-600"
  }
] 