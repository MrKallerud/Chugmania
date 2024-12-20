import db from '$lib/server/db'
import { eq } from 'drizzle-orm'
import { timeEntries } from '../db/schema'
import TrackManager, { type Track } from './track.manager'
import UserManager, { type PublicUser } from './user.manager'

type TimeEntrySelect = typeof timeEntries.$inferSelect
export type TimeEntry = Omit<TimeEntrySelect, 'track' | 'user'> & {
  track: Track
  user: PublicUser
}

export default class TimeEntryManager {
  static readonly table = timeEntries

  static async getBySession(sessionId: string): Promise<TimeEntry[]> {
    console.debug('Getting time entries for session:', sessionId)
    const items = await db
      .select()
      .from(timeEntries)
      .where(eq(timeEntries.session, sessionId))
      .innerJoin(TrackManager.table, eq(timeEntries.track, TrackManager.table.id))
      .innerJoin(UserManager.table, eq(timeEntries.track, UserManager.table.id))
      .orderBy(timeEntries.duration)
      .groupBy(timeEntries.track)

    return items.map(item => ({
      ...item.time_entries,
      track: TrackManager.getDetails(item.tracks),
      user: UserManager.getDetails(item.users),
    }))
  }

  static async create(timeEntry: typeof timeEntries.$inferInsert) {
    console.debug('Creating time entry')
    return await db.insert(timeEntries).values(timeEntry).returning()
  }

  static toMs(minutes: number, seconds: number, houndreds: number) {
    return minutes * 60000 + seconds * 1000 + houndreds * 10
  }

  static toString(ms: number) {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const houndreds = Math.floor((ms % 1000) / 10)
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${houndreds.toString().padStart(2, '0')}`
  }
}
