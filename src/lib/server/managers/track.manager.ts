import db from '$lib/server/db'
import { timeEntries, tracks } from '$lib/server/db/schema'
import { getEnumValues, type LookupEntity } from '@/components/types.server'
import { getFormString, getFormValue } from '@/utils'
import { and, eq, isNull } from 'drizzle-orm'

type InsertTrack = typeof tracks.$inferInsert
type SelectTrack = typeof tracks.$inferSelect

export enum TrackType {
  DRIFT = 'drift',
  VALLEY = 'valley',
  LAGOON = 'lagoon',
  STADIUM = 'stadium',
}

export enum TrackLevel {
  WHITE = 'white',
  GREEN = 'green',
  BLUE = 'blue',
  RED = 'red',
  BLACK = 'black',
  CUSTOM = 'custom',
}

export type Track = ReturnType<(typeof TrackManager)['getDetails']>

export type SessionTrack = SelectTrack & {
  duration: number
  rank: number
}

export default class TrackManager {
  static readonly table = tracks

  static readonly TrackLevelColors: Record<TrackLevel, string> = {
    white: 'bg-white text-black',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    black: 'bg-stone-900 text-white',
    custom: 'bg-orange-500',
  }

  static readonly TrackTypeColors: Record<TrackType, string> = {
    drift: 'bg-orange-900 text-white',
    valley: 'bg-orange-500',
    lagoon: 'bg-teal-300',
    stadium: 'bg-blue-800 text-white',
  }

  static async init() {
    const result = await this.getAll()
    if (result.length > 0) return
    console.log('Initializing tracks')
    await db.insert(tracks).values(this.generateTracks())
    console.info('Tracks added successfully')
  }

  private static generateTracks(): InsertTrack[] {
    const trackCount = 200
    const items = []

    const levels: TrackLevel[] = getEnumValues(TrackLevel) as TrackLevel[]
    const types: TrackType[] = getEnumValues(TrackType) as TrackType[]

    for (let i = 0; i < trackCount; i++) {
      items.push({
        number: i + 1,
        level: levels[Math.floor(i / 40) % levels.length],
        type: types[Math.floor(i / 10) % types.length],
      })
    }

    return items
  }

  static async getAll(isChuggable?: boolean): Promise<Track[]> {
    console.debug('Getting tracks')
    const items = await db
      .select()
      .from(tracks)
      .where(
        and(
          isNull(tracks.deletedAt),
          isChuggable === undefined ? undefined : eq(tracks.isChuggable, isChuggable)
        )
      )
      .orderBy(tracks.number)
    return items.map(item => this.getDetails(item))
  }

  static async getAllLookup(): Promise<LookupEntity[]> {
    return (await this.getAll()).map(track => ({
      ...track,
      type: track.type.id,
      featured: track.isChuggable,
      label: track.name,
    }))
  }

  static async getBySession(session: string): Promise<Track[]> {
    console.debug('Getting tracks from session:', session)
    const result = await db
      .select()
      .from(tracks)
      .innerJoin(timeEntries, eq(tracks.id, timeEntries.track))
      .where(and(isNull(timeEntries.deletedAt), eq(timeEntries.session, session)))

    return result.map(item => this.getDetails(item.tracks))
  }

  static async get(id: string): Promise<Track> {
    console.debug('Getting track:', id)
    const result = await db.select().from(tracks).where(eq(tracks.id, id)).limit(1)
    const track = result.at(0)
    if (!track) throw new Error(`Track not found: ${id}`)
    return this.getDetails(track)
  }

  static getDetails(track: SelectTrack) {
    return {
      ...track,
      name: this.getNameOf(track),
      level: {
        id: track.level,
        class: this.TrackLevelColors[track.level],
      },
      type: {
        id: track.type,
        class: this.TrackTypeColors[track.type],
      },
    }
  }

  private static getNameOf(track: SelectTrack) {
    return `#${track.number.toString().padStart(2, '0')}`
  }

  static async create(form: FormData): Promise<Track> {
    const insert: InsertTrack = {
      number: getFormValue(tracks.number.name, form)!,
      level: getFormValue(tracks.level.name, form)!,
      type: getFormValue(tracks.type.name, form)!,
      isChuggable: getFormValue(tracks.isChuggable.name, form) === 'true',
    }
    console.debug('Creating track:', insert.number)

    const result = await db.insert(tracks).values(insert).returning()
    const track = result.at(0)
    if (!track) throw new Error(`Failed to create track ${insert.number}`)
    return this.getDetails(track)
  }

  static async update(form: FormData): Promise<Track> {
    const id = getFormString(tracks.id.name, form)
    if (!id) throw new Error('Track ID is required')

    const insert: Partial<SelectTrack> = {
      number: getFormValue(tracks.number.name, form),
      level: getFormValue(tracks.level.name, form),
      type: getFormValue(tracks.type.name, form),
      isChuggable: getFormValue(tracks.isChuggable.name, form) === 'true',
    }

    console.debug('Updating track:', id)

    const track = (await db.update(tracks).set(insert).where(eq(tracks.id, id)).returning()).at(0)

    if (!track) throw new Error(`Failed to update track ${id}`)
    return this.getDetails(track)
  }

  static async delete(id: string): Promise<Track> {
    console.debug('Deleting track:', id)
    const track = (
      await db.update(tracks).set({ deletedAt: new Date() }).where(eq(tracks.id, id)).returning()
    ).at(0)
    if (!track) throw new Error(`Failed to delete track ${id}`)
    return this.getDetails(track)
  }
}
