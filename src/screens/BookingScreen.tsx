import { useState } from 'react'
import { ChevronLeft, ChevronRight, CreditCard, Wallet, Landmark, CheckCircle2, Lock } from 'lucide-react'
import { SUBSCRIPTIONS, BUSY_DAYS, AVAILABLE_SLOTS, formatPrice } from '../data'
import { createOrder, getOrCreateConversation } from '../lib/api'
import type { Screen, Specialist } from '../types'

interface Props {
  specialists: Specialist[]
  specialistId: string
  onBookingConfirmed: () => void
  onNavigate: (screen: Screen) => void
  onBack: () => void
}

const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTH_NAME = 'August 2025'
const FIRST_DOW = 4 // Friday

const PAYMENT_METHODS = [
  { id: 'click',   label: 'Click',     icon: CreditCard, color: '#1B9CF0' },
  { id: 'payme',   label: 'Payme',     icon: Wallet,     color: '#1877F2' },
  { id: 'uzum',    label: 'Uzum Bank', icon: Landmark,   color: '#F5A623' },
  { id: 'visa',    label: 'Visa',      icon: CreditCard, color: '#1A1F71' },
]

export default function BookingScreen({ specialists, specialistId, onBookingConfirmed, onNavigate, onBack }: Props) {
  const sp = specialists.find(s => s.id === specialistId)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedSub, setSelectedSub] = useState(SUBSCRIPTIONS[0].id)
  const [selectedPayment, setSelectedPayment] = useState(PAYMENT_METHODS[0].id)
  const [booked, setBooked] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [step, setStep] = useState<'date' | 'sub' | 'pay'>('date')

  if (!sp) return null

  const totalDays = 31
  const cells: (number | null)[] = [
    ...Array(FIRST_DOW).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null)

  const isBusy = (day: number) => BUSY_DAYS.includes(day)
  const isToday = (day: number) => day === 3

  const sub = SUBSCRIPTIONS.find(s => s.id === selectedSub) ?? SUBSCRIPTIONS[0]

  async function handleConfirm() {
    setConfirming(true)
    try {
      await createOrder({
        specialistId: sp!.id,
        date: `${selectedDay} Aug 2025`,
        service: sub.name,
        status: 'confirmed',
        amount: sub.price,
      })
      const conversationId = await getOrCreateConversation(sp!.id)
      onBookingConfirmed()
      setBooked(true)
      setTimeout(() => onNavigate({ name: 'chat', conversationId }), 2200)
    } catch (err) {
      console.error(err)
      setConfirming(false)
    }
  }

  if (booked) {
    return (
      <div style={{
        background: '#080808', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16, padding: 32, textAlign: 'center',
      }}>
        <div className="slide-up tiffany-glow" style={{ marginBottom: 8, width: 88, height: 88, borderRadius: '50%', background: 'rgba(10,186,181,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle2 size={48} color="#0ABAB5" strokeWidth={1.75} />
        </div>
        <h2 className="slide-up gradient-text" style={{ margin: 0, fontSize: 28, fontWeight: 900, animationDelay: '0.1s' }}>
          Booking Confirmed!
        </h2>
        <p className="slide-up" style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, animationDelay: '0.2s' }}>
          Your session with <strong style={{ color: 'white' }}>{sp.name}</strong> is booked for<br />
          <strong style={{ color: '#0ABAB5' }}>August {selectedDay}, {selectedSlot}</strong>
        </p>
        <p className="slide-up" style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.4)', animationDelay: '0.3s' }}>
          Opening chat...
        </p>
      </div>
    )
  }

  return (
    <div style={{ background: '#080808', minHeight: '100%', paddingBottom: 120 }}>

      {/* Header */}
      <div style={{ padding: '52px 20px 20px', background: 'linear-gradient(180deg, #0f1410 0%, #080808 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%',
              width: 40, height: 40, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ChevronLeft size={19} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Book a Session</h1>
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>with {sp.name}</p>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {(['date', 'sub', 'pay'] as const).map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                onClick={() => {
                  if (s === 'sub' && !selectedDay) return
                  if (s === 'pay' && !selectedSlot) return
                  setStep(s)
                }}
                style={{
                  width: 28, height: 28, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  background: step === s ? '#0ABAB5' : (
                    (s === 'sub' && (step === 'pay' || (step === 'sub'))) ||
                    (s === 'date')
                      ? 'rgba(10,186,181,0.2)'
                      : 'rgba(255,255,255,0.1)'
                  ),
                  color: step === s ? '#080808' : '#0ABAB5',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {i + 1}
              </div>
              <span style={{ fontSize: 12, color: step === s ? 'white' : 'rgba(255,255,255,0.4)', fontWeight: step === s ? 600 : 400 }}>
                {s === 'date' ? 'Date & Time' : s === 'sub' ? 'Service' : 'Payment'}
              </span>
              {i < 2 && <ChevronRight size={14} color="rgba(255,255,255,0.2)" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step: Date */}
      {step === 'date' && (
        <div style={{ padding: '0 20px' }} className="fade-in">
          <div className="glass" style={{ borderRadius: 20, padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', display: 'flex' }}><ChevronLeft size={18} /></button>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{MONTH_NAME}</h3>
              <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', display: 'flex' }}><ChevronRight size={18} /></button>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
              {DAYS.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', padding: '4px 0' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {cells.map((day, idx) => {
                if (!day) return <div key={idx} />
                const busy = isBusy(day)
                const today = isToday(day)
                const sel = selectedDay === day
                return (
                  <button
                    key={idx}
                    disabled={busy}
                    onClick={() => { setSelectedDay(day); setSelectedSlot(null) }}
                    style={{
                      aspectRatio: '1', borderRadius: 10, border: sel ? '2px solid #0ABAB5' : today ? '2px solid rgba(10,186,181,0.4)' : '2px solid transparent',
                      background: sel ? '#0ABAB5' : busy ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
                      color: sel ? '#080808' : busy ? 'rgba(255,255,255,0.2)' : 'white',
                      fontSize: 13, fontWeight: sel ? 800 : 500,
                      cursor: busy ? 'not-allowed' : 'pointer',
                      textDecoration: busy ? 'line-through' : 'none',
                      fontFamily: 'Outfit, sans-serif',
                      transition: 'all 0.15s',
                    }}
                  >
                    {day}
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: 14, marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { color: '#0ABAB5', label: 'Available' },
                { color: 'rgba(255,255,255,0.15)', label: 'Busy' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time slots */}
          {selectedDay && (
            <div className="slide-up">
              <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700 }}>
                Available times — Aug {selectedDay}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {AVAILABLE_SLOTS.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      padding: '14px 0', borderRadius: 14, border: 'none', fontSize: 15, fontWeight: 700,
                      fontFamily: 'Outfit, sans-serif',
                      background: selectedSlot === slot ? '#0ABAB5' : 'rgba(255,255,255,0.07)',
                      color: selectedSlot === slot ? '#080808' : 'white',
                      transition: 'all 0.15s',
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step: Service */}
      {step === 'sub' && (
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }} className="fade-in">
          <p style={{ margin: '0 0 4px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Choose your plan</p>
          {SUBSCRIPTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSub(s.id)}
              style={{
                borderRadius: 18, padding: '16px 18px', border: 'none',
                background: selectedSub === s.id
                  ? 'linear-gradient(135deg, rgba(10,186,181,0.2) 0%, rgba(10,186,181,0.05) 100%)'
                  : 'rgba(255,255,255,0.05)',
                borderColor: selectedSub === s.id ? '#0ABAB5' : 'rgba(255,255,255,0.08)',
                borderStyle: 'solid', borderWidth: 1,
                textAlign: 'left', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'all 0.15s',
                position: 'relative',
              }}
            >
              {(s as any).popular && (
                <div style={{
                  position: 'absolute', top: -1, right: 14,
                  background: '#0ABAB5', color: '#080808',
                  fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: '0 0 8px 8px',
                }}>
                  POPULAR
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <s.icon size={24} color={selectedSub === s.id ? '#0ABAB5' : 'white'} strokeWidth={1.75} />
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 700, color: 'white' }}>{s.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{s.description}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: selectedSub === s.id ? '#0ABAB5' : 'white' }}>
                  {new Intl.NumberFormat().format(s.price)}
                </p>
                <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>UZS</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step: Payment */}
      {step === 'pay' && (
        <div style={{ padding: '0 20px' }} className="fade-in">
          <p style={{ margin: '0 0 14px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Payment method</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
            {PAYMENT_METHODS.map(pm => (
              <button
                key={pm.id}
                onClick={() => setSelectedPayment(pm.id)}
                style={{
                  padding: '16px 12px', borderRadius: 16, border: 'none',
                  background: selectedPayment === pm.id ? 'rgba(10,186,181,0.15)' : 'rgba(255,255,255,0.05)',
                  borderColor: selectedPayment === pm.id ? '#0ABAB5' : 'rgba(255,255,255,0.08)',
                  borderStyle: 'solid', borderWidth: 1,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <pm.icon size={22} color={pm.color} strokeWidth={1.75} />
                <span style={{ fontSize: 13, fontWeight: 700, color: selectedPayment === pm.id ? '#0ABAB5' : 'white' }}>{pm.label}</span>
              </button>
            ))}
          </div>

          {/* Order summary */}
          <div className="glass" style={{ borderRadius: 18, padding: 18, marginBottom: 16 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700 }}>Order Summary</h3>
            {[
              { label: 'Specialist', value: sp.name },
              { label: 'Date', value: `Aug ${selectedDay}` },
              { label: 'Time', value: selectedSlot ?? '—' },
              { label: 'Service', value: sub.name },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{row.value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', marginTop: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#0ABAB5' }}>{formatPrice(sub.price)}</span>
            </div>
          </div>

          <p style={{ margin: '0 0 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 5, fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 1.5 }}>
            <Lock size={12} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Payment is held by Whale until the session is completed.<br />Guarantee of deal applies.</span>
          </p>
        </div>
      )}

      {/* Bottom nav buttons */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        padding: '16px 20px 32px',
        background: 'linear-gradient(to top, #080808 60%, transparent)',
        zIndex: 50,
      }}>
        {step === 'date' && (
          <button
            onClick={() => setStep('sub')}
            disabled={!selectedDay || !selectedSlot}
            className={selectedDay && selectedSlot ? 'tiffany-glow' : ''}
            style={{
              width: '100%', padding: '16px', borderRadius: 18, border: 'none',
              background: selectedDay && selectedSlot ? '#0ABAB5' : 'rgba(255,255,255,0.1)',
              color: selectedDay && selectedSlot ? '#080808' : 'rgba(255,255,255,0.3)',
              fontSize: 16, fontWeight: 800, fontFamily: 'Outfit, sans-serif',
              cursor: selectedDay && selectedSlot ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}
          >
            {selectedDay && selectedSlot ? `Continue — Aug ${selectedDay}, ${selectedSlot}` : 'Select a date & time'}
          </button>
        )}
        {step === 'sub' && (
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setStep('date')} className="glass" style={{ padding: '16px 18px', borderRadius: 18, border: '1px solid rgba(255,255,255,0.15)', color: 'white', display: 'flex', alignItems: 'center' }}><ChevronLeft size={19} /></button>
            <button
              onClick={() => setStep('pay')}
              className="tiffany-glow"
              style={{ flex: 1, padding: '16px', borderRadius: 18, border: 'none', background: '#0ABAB5', color: '#080808', fontSize: 16, fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}
            >
              Continue — {formatPrice(sub.price)}
            </button>
          </div>
        )}
        {step === 'pay' && (
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setStep('sub')} className="glass" style={{ padding: '16px 18px', borderRadius: 18, border: '1px solid rgba(255,255,255,0.15)', color: 'white', display: 'flex', alignItems: 'center' }}><ChevronLeft size={19} /></button>
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="tiffany-glow"
              style={{ flex: 1, padding: '16px', borderRadius: 18, border: 'none', background: '#0ABAB5', color: '#080808', fontSize: 16, fontWeight: 800, fontFamily: 'Outfit, sans-serif', opacity: confirming ? 0.6 : 1 }}
            >
              {confirming ? 'Processing...' : `Pay ${formatPrice(sub.price)} →`}
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
