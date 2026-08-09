import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, Phone, Paperclip, MapPin, Image, ClipboardList, Smile, Send, MessageCircle } from 'lucide-react'
import { fetchMessages, sendMessage as sendMessageApi, subscribeToMessages } from '../lib/api'
import type { Screen, Message, Specialist, Conversation } from '../types'

interface Props {
  specialists: Specialist[]
  conversations: Conversation[]
  conversationId?: string
  onRefreshConversations: () => void
  onNavigate: (screen: Screen) => void
  onBack: () => void
}

function ConversationList({ specialists, conversations, onNavigate }: {
  specialists: Specialist[]
  conversations: Conversation[]
  onNavigate: (screen: Screen) => void
}) {
  return (
    <div style={{ background: '#080808', minHeight: '100%', paddingBottom: 100 }}>
      <div style={{ padding: '56px 20px 20px', background: 'linear-gradient(180deg, #0f1410 0%, #080808 100%)' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Messages</h1>
      </div>

      {conversations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 32px', color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
            <MessageCircle size={40} color="rgba(255,255,255,0.3)" />
          </div>
          <p>No conversations yet.<br />Book a specialist to start chatting.</p>
        </div>
      ) : (
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {conversations.map(conv => {
            const sp = specialists.find(s => s.id === conv.specialistId)
            if (!sp) return null
            return (
              <button
                key={conv.id}
                onClick={() => onNavigate({ name: 'chat', conversationId: conv.id })}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 16px', borderRadius: 18, border: 'none',
                  background: 'rgba(255,255,255,0.03)', textAlign: 'left', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={sp.avatar}
                    alt={sp.name}
                    style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover', background: '#111' }}
                  />
                  <span style={{
                    position: 'absolute', bottom: 1, right: 1,
                    width: 13, height: 13, borderRadius: '50%',
                    background: '#4ade80', border: '2px solid #080808',
                  }} />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'white' }}>{sp.name}</p>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>{conv.lastTime}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: 8 }}>
                      {conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                      <span style={{
                        background: '#0ABAB5', borderRadius: '50%', width: 20, height: 20,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 800, color: '#080808', flexShrink: 0,
                      }}>
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ChatThread({ specialists, conversations, conversationId, onRefreshConversations, onBack }: {
  specialists: Specialist[]
  conversations: Conversation[]
  conversationId: string
  onRefreshConversations: () => void
  onBack: () => void
}) {
  const conv = conversations.find(c => c.id === conversationId)
  const sp = conv ? specialists.find(s => s.id === conv.specialistId) : null
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages(conversationId).then(setMessages).catch(err => console.error(err))
    return subscribeToMessages(conversationId, message => {
      setMessages(prev => (prev.some(m => m.id === message.id) ? prev : [...prev, message]))
    })
  }, [conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    const text = input.trim()
    if (!text) return
    setInput('')
    try {
      await sendMessageApi(conversationId, 'me', text)
      onRefreshConversations()
      setTimeout(async () => {
        await sendMessageApi(conversationId, 'them', "Got it! I'll prepare everything for the session.")
        onRefreshConversations()
      }, 1200)
    } catch (err) {
      console.error(err)
    }
  }

  if (!sp) return null

  return (
    <div style={{ background: '#080808', height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div className="glass-dark" style={{ padding: '52px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%',
              width: 36, height: 36, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <div style={{ position: 'relative' }}>
            <img src={sp.avatar} alt={sp.name} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', background: '#111' }} />
            <span style={{ position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: '50%', background: '#4ade80', border: '2px solid #111' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 1px', fontSize: 15, fontWeight: 700 }}>{sp.name}</p>
            <p style={{ margin: 0, fontSize: 11, color: '#4ade80', fontWeight: 500 }}>● Online</p>
          </div>
          <button style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 36, height: 36, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Phone size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="hide-scrollbar"
        style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}
      >
        {/* Date separator */}
        <div style={{ textAlign: 'center', margin: '8px 0' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.06)', padding: '4px 12px', borderRadius: 20 }}>
            Today
          </span>
        </div>

        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: 8,
            }}
          >
            {msg.from === 'them' && (
              <img src={sp.avatar} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, background: '#111' }} />
            )}
            <div
              style={{
                maxWidth: '72%',
                padding: '10px 14px',
                borderRadius: msg.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.from === 'me'
                  ? 'linear-gradient(135deg, #0ABAB5 0%, #08918d 100%)'
                  : 'rgba(255,255,255,0.08)',
                color: 'white',
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              <p style={{ margin: '0 0 4px' }}>{msg.text}</p>
              <p style={{ margin: 0, fontSize: 10, color: msg.from === 'me' ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.35)', textAlign: 'right' }}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick actions */}
      <div className="hide-scrollbar" style={{ display: 'flex', gap: 8, padding: '0 20px 10px', overflowX: 'auto' }}>
        {[
          { label: 'File', icon: Paperclip },
          { label: 'Location', icon: MapPin },
          { label: 'Image', icon: Image },
          { label: 'Reference', icon: ClipboardList },
        ].map(a => (
          <button
            key={a.label}
            style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 20, border: 'none',
              background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)',
              fontSize: 12, fontFamily: 'Outfit, sans-serif', fontWeight: 500,
            }}
          >
            <a.icon size={13} />
            {a.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '0 20px 32px', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <div
          className="glass"
          style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: 20, gap: 10 }}
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Message..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'white', fontSize: 15, fontFamily: 'Outfit, sans-serif',
            }}
          />
          <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
            <Smile size={19} />
          </button>
        </div>
        <button
          onClick={sendMessage}
          className={input.trim() ? 'tiffany-glow-sm' : ''}
          style={{
            width: 48, height: 48, borderRadius: '50%', border: 'none',
            background: input.trim() ? '#0ABAB5' : 'rgba(255,255,255,0.08)',
            color: input.trim() ? '#080808' : 'rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', flexShrink: 0,
          }}
        >
          <Send size={19} />
        </button>
      </div>

    </div>
  )
}

export default function ChatScreen({ specialists, conversations, conversationId, onRefreshConversations, onNavigate, onBack }: Props) {
  if (conversationId) {
    return (
      <ChatThread
        specialists={specialists}
        conversations={conversations}
        conversationId={conversationId}
        onRefreshConversations={onRefreshConversations}
        onBack={onBack}
      />
    )
  }
  return <ConversationList specialists={specialists} conversations={conversations} onNavigate={onNavigate} />
}
