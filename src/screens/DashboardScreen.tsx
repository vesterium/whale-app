import { useState, useEffect } from 'react'
import {
  Settings, User, Clapperboard, ClipboardList, Wallet, CheckCircle2, Star,
  Users, BarChart3, Heart, Calendar, TrendingUp, Check, type LucideIcon,
} from 'lucide-react'
import { fetchOrders } from '../lib/api'
import type { Screen, Specialist, Order } from '../types'

interface Props {
  specialists: Specialist[]
  onNavigate: (screen: Screen) => void
}

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#F5A623', bg: 'rgba(245,166,35,0.12)' },
  confirmed: { label: 'Confirmed', color: '#0ABAB5', bg: 'rgba(10,186,181,0.12)' },
  completed: { label: 'Done',      color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
  cancelled: { label: 'Cancelled', color: '#ff4d6d', bg: 'rgba(255,77,109,0.12)' },
}

function StatCard({ icon: Icon, label, value, sub, accent }: { icon: LucideIcon; label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div
      className="glass"
      style={{
        borderRadius: 18, padding: '18px 16px',
        border: accent ? '1px solid rgba(10,186,181,0.3)' : '1px solid rgba(255,255,255,0.08)',
        background: accent ? 'linear-gradient(135deg, rgba(10,186,181,0.1) 0%, rgba(10,186,181,0.03) 100%)' : undefined,
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <Icon size={22} color={accent ? '#0ABAB5' : 'rgba(255,255,255,0.7)'} strokeWidth={1.9} />
      </div>
      <p style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 900, color: accent ? '#0ABAB5' : 'white' }}>{value}</p>
      <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{label}</p>
      {sub && <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{sub}</p>}
    </div>
  )
}

export default function DashboardScreen({ specialists, onNavigate }: Props) {
  const [mode, setMode] = useState<'client' | 'specialist'>('client')
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetchOrders().then(setOrders).catch(err => console.error(err))
  }, [])

  return (
    <div style={{ background: '#080808', minHeight: '100%', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ padding: '56px 20px 20px', background: 'linear-gradient(180deg, #0f1410 0%, #080808 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format"
              alt="Profile"
              style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid #0ABAB5', background: '#111' }}
            />
            <span style={{ position: 'absolute', bottom: 2, right: 2, width: 14, height: 14, borderRadius: '50%', background: '#4ade80', border: '2px solid #080808' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: '0 0 2px', fontSize: 22, fontWeight: 800 }}>Sherzod Mirzayev</h1>
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Business Owner · Tashkent</p>
          </div>
          <button style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 12, padding: '8px 12px', color: 'rgba(255,255,255,0.7)', display: 'flex' }}>
            <Settings size={19} />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="glass" style={{ borderRadius: 14, padding: 4, display: 'flex' }}>
          {(['client', 'specialist'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontSize: 13, fontWeight: 700, fontFamily: 'Outfit, sans-serif',
                background: mode === m ? '#0ABAB5' : 'transparent',
                color: mode === m ? '#080808' : 'rgba(255,255,255,0.45)',
                transition: 'all 0.2s',
              }}
            >
              {m === 'client' ? <User size={15} /> : <Clapperboard size={15} />}
              {m === 'client' ? 'Client' : 'Specialist'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'client' && (
        <div className="fade-in" style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            <StatCard icon={ClipboardList} label="Total Orders" value="4" accent />
            <StatCard icon={Wallet} label="Total Spent" value="1.38M" sub="UZS" />
            <StatCard icon={CheckCircle2} label="Completed" value="3" />
            <StatCard icon={Star} label="Avg Rating Given" value="4.7" />
          </div>

          {/* Active subscription */}
          <div>
            <h2 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700 }}>Active Subscription</h2>
            <div
              style={{
                borderRadius: 18, padding: '18px',
                background: 'linear-gradient(135deg, #0a2a29 0%, #0d3d3c 50%, #0a2a29 100%)',
                border: '1px solid rgba(10,186,181,0.3)', position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(10,186,181,0.1)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>STANDARD PLAN</p>
                  <p style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 900, color: 'white' }}>10 Videos/mo</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }}>
                      <div style={{ width: '70%', height: '100%', borderRadius: 2, background: '#0ABAB5' }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>7/10 used</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Renews</p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0ABAB5' }}>Sep 1</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent orders */}
          <div>
            <h2 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700 }}>Recent Orders</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {orders.map(order => {
                const sp = specialists.find(s => s.id === order.specialistId)
                if (!sp) return null
                const status = STATUS_CONFIG[order.status]
                return (
                  <button
                    key={order.id}
                    onClick={() => onNavigate({ name: 'specialist', id: sp.id })}
                    className="glass"
                    style={{
                      borderRadius: 18, padding: '14px 16px',
                      display: 'flex', gap: 12, alignItems: 'center',
                      border: '1px solid rgba(255,255,255,0.08)',
                      textAlign: 'left', cursor: 'pointer',
                      transition: 'transform 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.01)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <img src={sp.avatar} alt={sp.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, background: '#111' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700, color: 'white' }}>{sp.name}</p>
                      <p style={{ margin: '0 0 4px', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{order.service}</p>
                      <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{order.date}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 700, color: 'white' }}>
                        {new Intl.NumberFormat().format(order.amount)}
                      </p>
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                        background: status.bg, color: status.color,
                      }}>
                        {status.label}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Analytics */}
          <div>
            <h2 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, fontWeight: 700 }}>
              <BarChart3 size={17} /> Analytics
            </h2>
            <div className="glass" style={{ borderRadius: 18, padding: 18 }}>
              <p style={{ margin: '0 0 16px', fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Spend by month
              </p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
                {[
                  { month: 'Apr', amount: 150000, max: 1380000 },
                  { month: 'May', amount: 300000, max: 1380000 },
                  { month: 'Jun', amount: 600000, max: 1380000 },
                  { month: 'Jul', amount: 430000, max: 1380000 },
                  { month: 'Aug', amount: 350000, max: 1380000 },
                ].map(m => (
                  <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div
                      style={{
                        width: '100%', borderRadius: 6,
                        height: `${(m.amount / m.max) * 72}px`,
                        background: m.month === 'Aug' ? '#0ABAB5' : 'rgba(10,186,181,0.25)',
                        transition: 'height 0.5s ease',
                      }}
                    />
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{m.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Favorites */}
          <div style={{ paddingBottom: 20 }}>
            <h2 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, fontWeight: 700 }}>
              <Heart size={16} fill="#ff4d6d" stroke="#ff4d6d" /> Favorites
            </h2>
            <div className="hide-scrollbar" style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
              {specialists.slice(0, 4).map(sp => (
                <button
                  key={sp.id}
                  onClick={() => onNavigate({ name: 'specialist', id: sp.id })}
                  style={{
                    flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    padding: '14px 16px', borderRadius: 18, border: 'none',
                    background: 'rgba(255,255,255,0.05)', cursor: 'pointer', minWidth: 88,
                    transition: 'transform 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <img src={sp.avatar} alt={sp.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', background: '#111' }} />
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: 'white', textAlign: 'center' }}>
                    {sp.name.split(' ')[0]}
                  </p>
                  <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{sp.category.split(' ')[0]}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === 'specialist' && (
        <div className="fade-in" style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            <StatCard icon={Wallet} label="Total Income" value="4.2M" sub="UZS this month" accent />
            <StatCard icon={ClipboardList} label="Active Orders" value="3" />
            <StatCard icon={Star} label="My Rating" value="4.9" />
            <StatCard icon={Users} label="Clients" value="28" sub="this month" />
          </div>

          {/* Calendar preview */}
          <div>
            <h2 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, fontWeight: 700 }}>
              <Calendar size={17} /> Upcoming Sessions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { date: 'Aug 15', time: '10:00', client: 'Sherzod M.', type: 'Brand Film', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format' },
                { date: 'Aug 17', time: '14:00', client: 'Kamola U.', type: 'Product Shoot', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format' },
                { date: 'Aug 20', time: '11:00', client: 'Nodir K.', type: 'Reels Content', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&h=80&fit=crop&auto=format' },
              ].map((session, i) => (
                <div key={i} className="glass" style={{ borderRadius: 18, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{
                    flexShrink: 0, textAlign: 'center', padding: '8px 12px', borderRadius: 12,
                    background: 'rgba(10,186,181,0.1)', border: '1px solid rgba(10,186,181,0.2)', minWidth: 56,
                  }}>
                    <p style={{ margin: '0 0 1px', fontSize: 11, color: '#0ABAB5', fontWeight: 700 }}>{session.date.split(' ')[0]}</p>
                    <p style={{ margin: '0 0 1px', fontSize: 18, fontWeight: 900, color: 'white' }}>{session.date.split(' ')[1]}</p>
                    <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{session.time}</p>
                  </div>
                  <img src={session.avatar} alt={session.client} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', background: '#111', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700 }}>{session.client}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{session.type}</p>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: 'rgba(10,186,181,0.15)', color: '#0ABAB5' }}>
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Income chart */}
          <div>
            <h2 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, fontWeight: 700 }}>
              <TrendingUp size={17} /> Income
            </h2>
            <div className="glass" style={{ borderRadius: 18, padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>This Month</p>
                  <p style={{ margin: '2px 0 0', fontSize: 24, fontWeight: 900, color: '#0ABAB5' }}>4,200,000 UZS</p>
                </div>
                <span style={{ padding: '6px 12px', borderRadius: 20, background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontSize: 12, fontWeight: 700 }}>+24%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 72 }}>
                {[2.1, 3.5, 2.8, 4.2, 3.8, 4.2].map((v, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div
                      style={{
                        width: '100%', borderRadius: 5,
                        height: `${(v / 4.2) * 60}px`,
                        background: i === 5 ? '#0ABAB5' : 'rgba(10,186,181,0.2)',
                      }}
                    />
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>
                      {['M', 'T', 'W', 'T', 'F', 'S'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile completeness */}
          <div style={{ paddingBottom: 20 }}>
            <h2 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 16, fontWeight: 700 }}>
              <User size={17} /> Profile
            </h2>
            <div className="glass" style={{ borderRadius: 18, padding: 18, border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Profile Completeness</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#0ABAB5' }}>85%</p>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)', marginBottom: 14 }}>
                <div style={{ width: '85%', height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #0ABAB5, #08918d)' }} />
              </div>
              {[
                { label: 'Portfolio photos', done: true },
                { label: 'Portfolio video', done: true },
                { label: 'Bio description', done: true },
                { label: 'Price list', done: true },
                { label: 'ID verification', done: false },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: item.done ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.done && <Check size={12} color="#4ade80" strokeWidth={3} />}
                  </span>
                  <span style={{ fontSize: 13, color: item.done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                  {!item.done && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#0ABAB5', fontWeight: 600 }}>Add →</span>}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
