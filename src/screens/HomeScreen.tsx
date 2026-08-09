import { useState } from 'react'
import { Star, Bell, Search, Sparkles, Check } from 'lucide-react'
import { CATEGORIES, getLevelConfig } from '../data'
import type { Screen, Specialist } from '../types'

interface Props {
  specialists: Specialist[]
  onNavigate: (screen: Screen) => void
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      <span style={{ display: 'inline-flex', gap: 1 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} size={11} fill={i < full ? '#FFD700' : 'none'} stroke="#FFD700" strokeWidth={1.5} />
        ))}
      </span>
      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{rating}</span>
    </span>
  )
}

function LevelBadge({ level }: { level: string }) {
  const cfg = getLevelConfig(level)
  return <cfg.icon size={15} color={cfg.color} strokeWidth={2.2} />
}

export default function HomeScreen({ specialists, onNavigate }: Props) {
  const [searchValue, setSearchValue] = useState('')

  const featured = specialists.filter(s => s.level === 'gold' || s.level === 'platinum').slice(0, 5)
  const newOnes  = specialists.filter(s => s.isNew).slice(0, 4)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    onNavigate({ name: 'search' })
  }

  return (
    <div style={{ background: '#080808', minHeight: '100%', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ padding: '56px 20px 24px', background: 'linear-gradient(180deg, #0f1410 0%, #080808 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: '0 0 4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Good morning
            </p>
            <h1 className="gradient-text" style={{ margin: 0, fontSize: 26, fontWeight: 800, lineHeight: 1.2 }}>
              Sherzod
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              style={{
                width: 44, height: 44, borderRadius: '50%', border: 'none',
                background: 'rgba(255,255,255,0.07)', color: 'white', fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
              }}
            >
              <Bell size={18} />
              <span style={{
                position: 'absolute', top: 8, right: 8, width: 8, height: 8,
                borderRadius: '50%', background: '#0ABAB5', border: '2px solid #080808',
              }} />
            </button>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format"
              alt="User avatar"
              style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #0ABAB5' }}
            />
          </div>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch}>
          <div
            className="glass"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '14px 18px', borderRadius: 16,
            }}
          >
            <Search size={18} style={{ opacity: 0.5, flexShrink: 0 }} />
            <input
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="Search specialists, skills..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: 'white', fontSize: 15, fontFamily: 'Outfit, sans-serif',
              }}
            />
            <button
              type="submit"
              style={{
                background: '#0ABAB5', border: 'none', borderRadius: 10,
                padding: '6px 14px', color: '#080808', fontWeight: 700, fontSize: 13,
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              Find
            </button>
          </div>
        </form>
      </div>

      {/* Promo banner */}
      <div style={{ padding: '0 20px', marginBottom: 28 }}>
        <div
          className="fade-up"
          style={{
            borderRadius: 20, overflow: 'hidden', position: 'relative',
            background: 'linear-gradient(135deg, #0a2a29 0%, #0ABAB5 100%)',
            padding: '24px 20px', minHeight: 130,
          }}
        >
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', bottom: -20, right: 30, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
              Limited offer
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, lineHeight: 1.2 }}>
              First booking —<br />20% discount
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 16 }}>
              Use code: <strong>WHALE20</strong>
            </div>
            <button
              onClick={() => onNavigate({ name: 'search' })}
              style={{
                background: 'white', border: 'none', borderRadius: 10,
                padding: '9px 18px', color: '#080808', fontWeight: 700, fontSize: 13,
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              Browse Specialists →
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Categories</h2>
          <button
            onClick={() => onNavigate({ name: 'search' })}
            style={{ background: 'none', border: 'none', color: '#0ABAB5', fontSize: 13, fontWeight: 600 }}
          >
            See all
          </button>
        </div>
        <div className="hide-scrollbar" style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '0 20px' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => onNavigate({ name: 'search', category: cat.key as any })}
              style={{
                flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 8, padding: '14px 18px', borderRadius: 16,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                color: 'white', cursor: 'pointer', minWidth: 78,
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <cat.icon size={22} color={cat.color} strokeWidth={1.8} />
              <span style={{ fontSize: 10, fontWeight: 600, opacity: 0.8, textAlign: 'center', lineHeight: 1.3, maxWidth: 60 }}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Top Specialists */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 14 }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6, fontSize: 18, fontWeight: 700 }}>
            <Star size={16} fill="#FFD700" stroke="#FFD700" /> Top Specialists
          </h2>
          <button
            onClick={() => onNavigate({ name: 'search' })}
            style={{ background: 'none', border: 'none', color: '#0ABAB5', fontSize: 13, fontWeight: 600 }}
          >
            See all
          </button>
        </div>
        <div className="hide-scrollbar" style={{ display: 'flex', gap: 14, overflowX: 'auto', padding: '0 20px' }}>
          {featured.map(sp => (
            <button
              key={sp.id}
              onClick={() => onNavigate({ name: 'specialist', id: sp.id })}
              style={{
                flexShrink: 0, width: 180, borderRadius: 20, overflow: 'hidden',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer', padding: 0, textAlign: 'left',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div style={{ position: 'relative' }}>
                <img
                  src={sp.cover}
                  alt={sp.name}
                  style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block', background: '#111' }}
                />
                {sp.verified && (
                  <span
                    className="verified-pulse"
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      background: '#0ABAB5', borderRadius: '50%',
                      width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Check size={12} color="#080808" strokeWidth={3.5} />
                  </span>
                )}
                <img
                  src={sp.avatar}
                  alt=""
                  style={{
                    position: 'absolute', bottom: -16, left: 12,
                    width: 36, height: 36, borderRadius: '50%', objectFit: 'cover',
                    border: '2px solid #0ABAB5', background: '#111',
                  }}
                />
              </div>
              <div style={{ padding: '22px 12px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 700, color: 'white' }}>{sp.name}</p>
                    <p style={{ margin: '0 0 6px', fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{sp.category}</p>
                  </div>
                  <LevelBadge level={sp.level} />
                </div>
                <StarRating rating={sp.rating} />
                <p style={{ margin: '6px 0 0', fontSize: 11, color: '#0ABAB5', fontWeight: 600 }}>
                  from {new Intl.NumberFormat().format(sp.price)} UZS
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* New Specialists */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>New on Whale</h2>
        </div>
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {newOnes.map(sp => (
            <button
              key={sp.id}
              onClick={() => onNavigate({ name: 'specialist', id: sp.id })}
              className="glass"
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', borderRadius: 18, cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.08)', textAlign: 'left',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.01)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img
                  src={sp.avatar}
                  alt={sp.name}
                  style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover', background: '#111' }}
                />
                {sp.available && (
                  <span style={{
                    position: 'absolute', bottom: 1, right: 1,
                    width: 13, height: 13, borderRadius: '50%',
                    background: '#4ade80', border: '2px solid #080808',
                  }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'white' }}>{sp.name}</p>
                  {sp.verified && <Check size={13} color="#0ABAB5" strokeWidth={3} />}
                </div>
                <p style={{ margin: '0 0 4px', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{sp.category} · {sp.city}</p>
                <StarRating rating={sp.rating} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#0ABAB5' }}>
                  {new Intl.NumberFormat().format(sp.price)}
                </p>
                <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>UZS</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* AI Match Banner */}
      <div style={{ padding: '0 20px' }}>
        <div
          className="glass"
          style={{
            borderRadius: 20, padding: '20px',
            border: '1px solid rgba(10,186,181,0.25)',
            background: 'linear-gradient(135deg, rgba(10,186,181,0.08) 0%, rgba(10,186,181,0.03) 100%)',
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <Sparkles size={26} color="#0ABAB5" />
          </div>
          <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700 }}>AI Specialist Match</h3>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
            Answer 4 quick questions — get the perfect specialist for your brand in seconds.
          </p>
          <button
            onClick={() => onNavigate({ name: 'search' })}
            style={{
              background: '#0ABAB5', border: 'none', borderRadius: 12,
              padding: '11px 20px', color: '#080808', fontWeight: 700, fontSize: 14,
              fontFamily: 'Outfit, sans-serif', width: '100%',
            }}
            className="tiffany-glow"
          >
            Start AI Match →
          </button>
        </div>
      </div>

    </div>
  )
}
