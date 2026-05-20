import type { EntityRole, IssueStatus } from '@prisma/client'

export { EntityRole, IssueStatus }

export interface SiteListItem {
  id: string
  code: string
  name: string
  location: string | null
  _count: { issues: number }
  pendingCount: number
  inProgressCount: number
  resolvedCount: number
}

export interface MinuteSummary {
  id: string
  code: string
  number: number
  date: string
}

export interface IssueFull {
  id: string
  sequenceNumber: number
  title: string
  description: string
  date: string
  observations: string | null
  status: IssueStatus
  minute: MinuteSummary
  entity: {
    id: string
    role: EntityRole
    name: string
  }
}

export interface EntityWithIssues {
  id: string
  role: EntityRole
  name: string
  issues: IssueFull[]
}

export interface SiteDetail {
  id: string
  code: string
  name: string
  location: string | null
  entities: EntityWithIssues[]
  latestMinute: MinuteSummary | null
  allMinutes: MinuteSummary[]
}

export interface IssueFilters {
  entityId?: string
  status?: IssueStatus
  minuteNumber?: number
  q?: string
}

export interface ExtractionResult {
  siteCode: string
  siteName: string
  minuteCode: string
  minuteNumber: number
  minuteDate: string
  entities: Array<{
    role: string
    name: string
    issues: Array<{
      sequenceNumber: number
      title: string
      description: string
      observations: string
      status: string
    }>
  }>
}
