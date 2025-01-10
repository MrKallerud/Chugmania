import { type Group as G } from '@/server/managers/group.manager'
import { type Match as M } from '@/server/managers/match.manager'
import { type Session as S } from '@/server/managers/session.manager'
import { type TimeEntry as TE } from '@/server/managers/timeEntry.manager'
import { type Track as T } from '@/server/managers/track.manager'
import { type PublicUser as U } from '@/server/managers/user.manager'

export type Session = S
export type TimeEntry = TE
export type Track = T
export type PublicUser = U
export type Match = M
export type Group = G

export type FormMode = 'login' | 'register'
export type ResponseMessage = { success: boolean; message?: string }
