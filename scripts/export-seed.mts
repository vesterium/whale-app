import { SPECIALISTS, REVIEWS, CONVERSATIONS, MESSAGES, ORDERS } from '../src/data'

function sql(v: unknown): string {
  if (v === null || v === undefined) return 'null'
  if (typeof v === 'number') return String(v)
  if (typeof v === 'boolean') return String(v)
  if (Array.isArray(v)) {
    const items = v.map(x => `"${String(x).replace(/"/g, '\\"')}"`).join(',')
    return `'{${items}}'`
  }
  return `'${String(v).replace(/'/g, "''")}'`
}

const lines: string[] = []

lines.push('-- Specialists')
for (const sp of SPECIALISTS) {
  lines.push(
    `insert into specialists (id, name, category, category_key, city, age, experience, projects, reviews_count, rating, price, verified, level, bio, avatar, cover, portfolio, tags, available, is_new) values (${[
      sql(sp.id), sql(sp.name), sql(sp.category), sql(sp.categoryKey), sql(sp.city), sql(sp.age),
      sql(sp.experience), sql(sp.projects), sql(sp.reviews), sql(sp.rating), sql(sp.price),
      sql(sp.verified), sql(sp.level), sql(sp.bio), sql(sp.avatar), sql(sp.cover),
      sql(sp.portfolio), sql(sp.tags), sql(sp.available), sql(sp.isNew ?? false),
    ].join(', ')});`
  )
}

lines.push('\n-- Reviews')
for (const specialistId of Object.keys(REVIEWS)) {
  for (const r of REVIEWS[specialistId]) {
    lines.push(
      `insert into reviews (id, specialist_id, author, avatar, rating, date, text, quality, timing, communication) values (${[
        sql(r.id), sql(specialistId), sql(r.author), sql(r.avatar), sql(r.rating), sql(r.date),
        sql(r.text), sql(r.quality), sql(r.timing), sql(r.communication),
      ].join(', ')});`
    )
  }
}

lines.push('\n-- Conversations')
for (const c of CONVERSATIONS) {
  lines.push(
    `insert into conversations (id, specialist_id, last_message, last_time, unread) values (${[
      sql(c.id), sql(c.specialistId), sql(c.lastMessage), sql(c.lastTime), sql(c.unread),
    ].join(', ')});`
  )
}

lines.push('\n-- Messages (seeded onto conversation c1, matching the original mock thread)')
for (const m of MESSAGES) {
  lines.push(
    `insert into messages (id, conversation_id, from_who, text, time) values (${[
      sql(m.id), sql('c1'), sql(m.from), sql(m.text), sql(m.time),
    ].join(', ')});`
  )
}

lines.push('\n-- Orders')
for (const o of ORDERS) {
  lines.push(
    `insert into orders (id, specialist_id, date, service, status, amount) values (${[
      sql(o.id), sql(o.specialistId), sql(o.date), sql(o.service), sql(o.status), sql(o.amount),
    ].join(', ')});`
  )
}

console.log(lines.join('\n'))
