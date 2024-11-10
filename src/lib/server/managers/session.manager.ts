import db from '$lib/server/db'
import { sessions } from '$lib/server/db/schema'
import { eq } from 'drizzle-orm'

export type SessionType = 'practice' | 'tournament'

export default class SessionManager {
  private static readonly typeString: Record<SessionType, string> = {
    practice: 'Practice',
    tournament: 'Turnering',
  }

  static async getAll() {
    console.debug('Getting sessions')
    const items = await db.select().from(sessions).orderBy(sessions.date).limit(10)
    return items.map(item => ({
      ...item,
      typeString: SessionManager.typeString[item.type],
    }))
  }

  static async get(id: string) {
    console.debug('Getting session:', id)
    const results = await db.select().from(sessions).where(eq(sessions.id, id)).limit(1)
    if (results.length === 0) throw new Error(`Session not found: ${id}`)
    return results.at(0)!
  }

  static async create(session: typeof sessions.$inferInsert) {
    console.debug('Creating session')
    const items = await db.insert(sessions).values(session).returning()
    const item = items.at(0)
    if (!item) throw new Error('Failed to create session')
    return item
  }
}
