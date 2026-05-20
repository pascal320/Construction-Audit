export type Locale = 'en' | 'pt'

const strings = {
  en: {
    appSubtitle: 'Construction Site Audit Interface',
    home: 'Home',
    backToSites: '← Back to sites',
    constructionSites: 'Construction Sites',
    noSites: 'No construction sites found.',
    issues: 'issues',
    pendingIssuesList: 'List of Pending Issues',
    situation: 'Situation as of',
    minuteRef: 'Minutes nº',
    filterByEntity: 'Filter by entity',
    filterByStatus: 'Filter by status',
    filterByMinute: 'Filter by minutes nº',
    searchPlaceholder: 'Search issues…',
    allEntities: 'All entities',
    allStatuses: 'All statuses',
    allMinutes: 'All minutes',
    noIssuesFound: 'No issues match your filters.',
    clearFilters: 'Clear filters',
    colNumber: 'Nº',
    colSubject: 'Subject / Description',
    colMinute: 'Minutes nº',
    colDate: 'Date',
    colObservations: 'Observations / Status',
    roleDnoDeObra: 'Project Owner',
    roleFiscalizacao: 'Supervision',
    roleProjetista: 'Designer',
    roleEntidadeExecutante: 'Contractor',
    statusPending: 'Pending',
    statusInProgress: 'In Progress',
    statusResolved: 'Resolved',
    byMinutes: 'By Minutes',
    byEntity: 'By Entity',
    uploadMinutes: 'Upload Minutes',
    uploading: 'Extracting…',
    uploadSuccess: 'extracted successfully',
    uploadError: 'Extraction failed',
    noIssuesInMinute: 'No issues recorded in this minute.',
  },
  pt: {
    appSubtitle: 'Interface de Acompanhamento de Obra',
    home: 'Início',
    backToSites: '← Voltar às obras',
    constructionSites: 'Obras',
    noSites: 'Nenhuma obra encontrada.',
    issues: 'assuntos',
    pendingIssuesList: 'Lista de Assuntos Pendentes',
    situation: 'Situação em',
    minuteRef: 'Acta nº',
    filterByEntity: 'Filtrar por entidade',
    filterByStatus: 'Filtrar por estado',
    filterByMinute: 'Filtrar por acta nº',
    searchPlaceholder: 'Pesquisar assuntos…',
    allEntities: 'Todas as entidades',
    allStatuses: 'Todos os estados',
    allMinutes: 'Todas as actas',
    noIssuesFound: 'Nenhum assunto corresponde aos filtros.',
    clearFilters: 'Limpar filtros',
    colNumber: 'Nº',
    colSubject: 'Assunto / Descrição',
    colMinute: 'Acta nº',
    colDate: 'Data',
    colObservations: 'Observações / Estado',
    roleDnoDeObra: 'Dono de Obra',
    roleFiscalizacao: 'Fiscalização',
    roleProjetista: 'Projetista',
    roleEntidadeExecutante: 'Entidade Executante',
    statusPending: 'Pendente',
    statusInProgress: 'Em Curso',
    statusResolved: 'Resolvido',
    byMinutes: 'Por Acta',
    byEntity: 'Por Entidade',
    uploadMinutes: 'Carregar Acta',
    uploading: 'A extrair…',
    uploadSuccess: 'extraído com sucesso',
    uploadError: 'Falha na extracção',
    noIssuesInMinute: 'Sem assuntos registados nesta acta.',
  },
} as const

export type StringKey = keyof (typeof strings)['en']

export function t(locale: Locale, key: StringKey): string {
  return strings[locale][key]
}

export function roleLabel(locale: Locale, role: string): string {
  const map: Record<string, StringKey> = {
    DONO_DE_OBRA: 'roleDnoDeObra',
    FISCALIZACAO: 'roleFiscalizacao',
    PROJETISTA: 'roleProjetista',
    ENTIDADE_EXECUTANTE: 'roleEntidadeExecutante',
  }
  return t(locale, map[role] ?? 'roleDnoDeObra')
}

export function statusLabel(locale: Locale, status: string): string {
  const map: Record<string, StringKey> = {
    PENDING: 'statusPending',
    IN_PROGRESS: 'statusInProgress',
    RESOLVED: 'statusResolved',
  }
  return t(locale, map[status] ?? 'statusPending')
}
