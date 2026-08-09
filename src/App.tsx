import { useState, useEffect, useCallback } from 'react'
import { Home, Search, ClipboardList, MessageCircle, User, type LucideIcon } from 'lucide-react'
import HomeScreen from './screens/HomeScreen'
import SearchScreen from './screens/SearchScreen'
import SpecialistScreen from './screens/SpecialistScreen'
import BookingScreen from './screens/BookingScreen'
import ChatScreen from './screens/ChatScreen'
import DashboardScreen from './screens/DashboardScreen'
import type { Screen, TabName, Specialist, Conversation } from './types'
import { fetchSpecialists, fetchConversations } from './lib/api'

const TABS: { name: TabName; icon: LucideIcon; label: string }[] = [
  { name: 'home',     icon: Home,           label: 'Home' },
  { name: 'explore',  icon: Search,         label: 'Explore' },
  { name: 'bookings', icon: ClipboardList,  label: 'Bookings' },
  { name: 'messages', icon: MessageCircle,  label: 'Messages' },
  { name: 'profile',  icon: User,           label: 'Profile' },
]

function BottomNav({ activeTab, onTabChange, unreadMessages }: {
  activeTab: TabName
  onTabChange: (tab: TabName) => void
  unreadMessages: number
}) {
  return (
    <div
      style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430, zIndex: 100,
      }}
    >
      <div
        className="glass-dark"
        style={{
          display: 'flex', justifyContent: 'space-around', alignItems: 'center',
          padding: '10px 0 26px', borderTop: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '24px 24px 0 0',
        }}
      >
        {TABS.map(tab => {
          const isActive = activeTab === tab.name
          return (
            <button
              key={tab.name}
              onClick={() => onTabChange(tab.name)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '8px 16px', borderRadius: 16, border: 'none',
                background: isActive ? 'rgba(10,186,181,0.12)' : 'transparent',
                cursor: 'pointer', position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              <tab.icon
                size={22}
                strokeWidth={isActive ? 2.4 : 2}
                color={isActive ? '#0ABAB5' : 'rgba(255,255,255,0.4)'}
                style={{
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.2s ease, color 0.2s ease',
                }}
              />
              <span style={{
                fontSize: 10, fontWeight: isActive ? 700 : 500,
                color: isActive ? '#0ABAB5' : 'rgba(255,255,255,0.35)',
                transition: 'color 0.2s',
              }}>
                {tab.label}
              </span>
              {tab.name === 'messages' && unreadMessages > 0 && (
                <span style={{
                  position: 'absolute', top: 4, right: 8,
                  background: '#0ABAB5', borderRadius: '50%',
                  width: 16, height: 16, fontSize: 9, fontWeight: 900,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#080808', border: '2px solid #111',
                }}>
                  {unreadMessages}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('home')
  const [screenStack, setScreenStack] = useState<Screen[]>([{ name: 'home' }])
  const [specialists, setSpecialists] = useState<Specialist[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const currentScreen = screenStack[screenStack.length - 1]
  const unreadMessages = conversations.reduce((sum, c) => sum + c.unread, 0)

  const refreshConversations = useCallback(() => {
    fetchConversations().then(setConversations).catch(err => console.error(err))
  }, [])

  useEffect(() => {
    Promise.all([fetchSpecialists(), fetchConversations()])
      .then(([sp, conv]) => {
        setSpecialists(sp)
        setConversations(conv)
      })
      .catch(err => setLoadError(err.message ?? 'Failed to load data'))
      .finally(() => setLoading(false))
  }, [])

  function navigate(screen: Screen) {
    setScreenStack(prev => [...prev, screen])

    // Sync tab indicator
    if (screen.name === 'home') setActiveTab('home')
    else if (screen.name === 'search') setActiveTab('explore')
    else if (screen.name === 'chats' || screen.name === 'chat') setActiveTab('messages')
    else if (screen.name === 'dashboard') setActiveTab('profile')
  }

  function goBack() {
    if (screenStack.length > 1) {
      setScreenStack(prev => prev.slice(0, -1))
    }
  }

  function handleTabChange(tab: TabName) {
    setActiveTab(tab)
    switch (tab) {
      case 'home':     setScreenStack([{ name: 'home' }]); break
      case 'explore':  setScreenStack([{ name: 'search' }]); break
      case 'bookings': setScreenStack([{ name: 'search' }]); break
      case 'messages': setScreenStack([{ name: 'chats' }]); break
      case 'profile':  setScreenStack([{ name: 'dashboard' }]); break
    }
  }

  function renderScreen(screen: Screen) {
    switch (screen.name) {
      case 'home':
        return <HomeScreen specialists={specialists} onNavigate={navigate} />
      case 'search':
        return <SearchScreen specialists={specialists} initialCategory={screen.category} onNavigate={navigate} />
      case 'specialist':
        return <SpecialistScreen specialists={specialists} specialistId={screen.id} onNavigate={navigate} onBack={goBack} />
      case 'booking':
        return (
          <BookingScreen
            specialists={specialists}
            specialistId={screen.specialistId}
            onBookingConfirmed={refreshConversations}
            onNavigate={navigate}
            onBack={goBack}
          />
        )
      case 'chats':
        return <ChatScreen specialists={specialists} conversations={conversations} onRefreshConversations={refreshConversations} onNavigate={navigate} onBack={goBack} />
      case 'chat':
        return (
          <ChatScreen
            specialists={specialists}
            conversations={conversations}
            conversationId={screen.conversationId}
            onRefreshConversations={refreshConversations}
            onNavigate={navigate}
            onBack={goBack}
          />
        )
      case 'dashboard':
        return <DashboardScreen specialists={specialists} onNavigate={navigate} />
      default:
        return <HomeScreen specialists={specialists} onNavigate={navigate} />
    }
  }

  const showBottomNav = !['booking', 'specialist', 'chat'].includes(currentScreen.name)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#030303',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      {/* Desktop backdrop */}
      <div
        style={{
          position: 'fixed', inset: 0,
          background: 'radial-gradient(ellipse at 30% 20%, rgba(10,186,181,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(10,186,181,0.04) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* App shell */}
      <div
        style={{
          width: '100%',
          maxWidth: 430,
          minHeight: '100vh',
          position: 'relative',
          background: '#080808',
          boxShadow: '0 0 80px rgba(0,0,0,0.8)',
          overflow: 'hidden',
        }}
      >
        {/* Screen content */}
        <div
          key={currentScreen.name + (currentScreen.name === 'specialist' ? (currentScreen as any).id : '') + (currentScreen.name === 'chat' ? (currentScreen as any).conversationId : '')}
          className="fade-in"
          style={{ minHeight: '100vh' }}
        >
          {loading ? (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="spinner" style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(10,186,181,0.25)', borderTopColor: '#0ABAB5' }} />
            </div>
          ) : loadError ? (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
              <p style={{ color: 'white', fontWeight: 700 }}>Couldn't reach the server</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>{loadError}</p>
            </div>
          ) : (
            renderScreen(currentScreen)
          )}
        </div>

        {/* Bottom nav */}
        {showBottomNav && (
          <BottomNav
            activeTab={activeTab}
            onTabChange={handleTabChange}
            unreadMessages={unreadMessages}
          />
        )}
      </div>
    </div>
  )
}
