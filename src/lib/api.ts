import { supabase } from './supabase'
import type { Specialist, Review, Conversation, Message, Order } from '../types'

function mapSpecialist(row: any): Specialist {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    categoryKey: row.category_key,
    city: row.city,
    age: row.age,
    experience: row.experience,
    projects: row.projects,
    reviews: row.reviews_count,
    rating: Number(row.rating),
    price: row.price,
    verified: row.verified,
    level: row.level,
    bio: row.bio,
    avatar: row.avatar,
    cover: row.cover,
    portfolio: row.portfolio ?? [],
    tags: row.tags ?? [],
    available: row.available,
    isNew: row.is_new,
  }
}

function mapReview(row: any): Review {
  return {
    id: row.id,
    author: row.author,
    avatar: row.avatar,
    rating: row.rating,
    date: row.date,
    text: row.text,
    quality: row.quality,
    timing: row.timing,
    communication: row.communication,
  }
}

function mapConversation(row: any): Conversation {
  return {
    id: row.id,
    specialistId: row.specialist_id,
    lastMessage: row.last_message,
    lastTime: row.last_time,
    unread: row.unread,
  }
}

function mapMessage(row: any): Message {
  return {
    id: row.id,
    from: row.from_who,
    text: row.text,
    time: row.time,
    type: row.type ?? undefined,
    image: row.image ?? undefined,
  }
}

function mapOrder(row: any): Order {
  return {
    id: row.id,
    specialistId: row.specialist_id,
    date: row.date,
    service: row.service,
    status: row.status,
    amount: row.amount,
  }
}

export async function fetchSpecialists(): Promise<Specialist[]> {
  const { data, error } = await supabase.from('specialists').select('*')
  if (error) throw error
  return (data ?? []).map(mapSpecialist)
}

export async function fetchReviews(specialistId: string): Promise<Review[]> {
  const { data, error } = await supabase.from('reviews').select('*').eq('specialist_id', specialistId)
  if (error) throw error
  return (data ?? []).map(mapReview)
}

export async function fetchConversations(): Promise<Conversation[]> {
  const { data, error } = await supabase.from('conversations').select('*').order('id')
  if (error) throw error
  return (data ?? []).map(mapConversation)
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at')
  if (error) throw error
  return (data ?? []).map(mapMessage)
}

export async function sendMessage(conversationId: string, from: 'me' | 'them', text: string): Promise<Message> {
  const time = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
  const id = `m${Date.now()}${from === 'them' ? '-r' : ''}`
  const { error } = await supabase
    .from('messages')
    .insert({ id, conversation_id: conversationId, from_who: from, text, time })
  if (error) throw error
  await supabase.from('conversations').update({ last_message: text, last_time: time }).eq('id', conversationId)
  return { id, from, text, time }
}

export function subscribeToMessages(conversationId: string, onInsert: (message: Message) => void) {
  const channel = supabase
    .channel(`messages-${conversationId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
      payload => onInsert(mapMessage(payload.new))
    )
    .subscribe()
  return () => {
    supabase.removeChannel(channel)
  }
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase.from('orders').select('*').order('date', { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapOrder)
}

export async function createOrder(order: Omit<Order, 'id'>): Promise<Order> {
  const id = `o${Date.now()}`
  const { error } = await supabase.from('orders').insert({
    id,
    specialist_id: order.specialistId,
    date: order.date,
    service: order.service,
    status: order.status,
    amount: order.amount,
  })
  if (error) throw error
  return { ...order, id }
}

export async function getOrCreateConversation(specialistId: string): Promise<string> {
  const { data } = await supabase
    .from('conversations')
    .select('id')
    .eq('specialist_id', specialistId)
    .maybeSingle()
  if (data) return data.id

  const id = `c${Date.now()}`
  const { error } = await supabase
    .from('conversations')
    .insert({ id, specialist_id: specialistId, last_message: '', last_time: 'now', unread: 0 })
  if (error) throw error
  return id
}
