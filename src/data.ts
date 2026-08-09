import {
  Clapperboard, Smartphone, BarChart3, Target, PenSquare, Newspaper,
  Camera, Code2, Globe, Palette, Shirt,
  Medal, Trophy, Gem,
  Package, Layers, Crown,
} from 'lucide-react'

export const CATEGORIES = [
  { key: 'video',   label: 'Videographer',    icon: Clapperboard, color: '#E64D4D' },
  { key: 'mobile',  label: 'Mobilographer',   icon: Smartphone,   color: '#E6844D' },
  { key: 'smm',     label: 'SMM',             icon: BarChart3,    color: '#E6C94D' },
  { key: 'target',  label: 'Targeting',       icon: Target,       color: '#4DE6A0' },
  { key: 'content', label: 'Content Creator', icon: PenSquare,    color: '#4DB5E6' },
  { key: 'blogger', label: 'Blogger',         icon: Newspaper,    color: '#844DE6' },
  { key: 'photo',   label: 'Photographer',    icon: Camera,       color: '#E64DA8' },
  { key: 'prog',    label: 'Programmer',      icon: Code2,        color: '#4D84E6' },
  { key: 'web',     label: 'Web Developer',   icon: Globe,        color: '#0ABAB5' },
  { key: 'design',  label: 'Designer',        icon: Palette,      color: '#C94DE6' },
  { key: 'model',   label: 'Model',           icon: Shirt,        color: '#E6A44D' },
] as const

export const SUBSCRIPTIONS = [
  { id: 'sub1', name: 'One-time Shoot', price: 350000, description: '1 session, edited materials', icon: Camera },
  { id: 'sub2', name: 'Basic', price: 900000, description: '5 videos / month', icon: Package, popular: false },
  { id: 'sub3', name: 'Standard', price: 1500000, description: '10 videos / month', icon: Layers, popular: true },
  { id: 'sub4', name: 'Premium', price: 2500000, description: '15–20 videos / month', icon: Crown, popular: false },
]

export const BUSY_DAYS = [3, 4, 10, 17, 18, 24]
export const AVAILABLE_SLOTS = ['09:00', '11:00', '13:00', '15:00', '17:00']

export function formatPrice(amount: number) {
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' UZS'
}

export function getLevelConfig(level: string) {
  const configs: Record<string, { label: string; color: string; icon: typeof Medal }> = {
    bronze:   { label: 'Bronze',   color: '#CD7F32', icon: Medal },
    silver:   { label: 'Silver',   color: '#C0C0C0', icon: Medal },
    gold:     { label: 'Gold',     color: '#FFD700', icon: Trophy },
    platinum: { label: 'Platinum', color: '#E5E4E2', icon: Gem },
  }
  return configs[level] ?? configs.bronze
}
