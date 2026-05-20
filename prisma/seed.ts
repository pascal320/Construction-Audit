import { PrismaClient, EntityRole, IssueStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const site = await prisma.constructionSite.upsert({
    where: { code: 'ES_AMADORA' },
    update: {},
    create: {
      code: 'ES_AMADORA',
      name: 'ES Amadora – Ampliação da Biblioteca e Reabilitação',
      location: 'Amadora, Portugal',
    },
  })

  const minutesData = [
    { code: 'AR_CO_017', number: 17, date: new Date('2026-01-15') },
    { code: 'AR_CO_022', number: 22, date: new Date('2026-02-19') },
    { code: 'AR_CO_025', number: 25, date: new Date('2026-03-12') },
    { code: 'AR_CO_026', number: 26, date: new Date('2026-03-19') },
  ]

  const minuteMap: Record<number, string> = {}
  for (const m of minutesData) {
    const minute = await prisma.minute.upsert({
      where: { siteId_number: { siteId: site.id, number: m.number } },
      update: {},
      create: { ...m, siteId: site.id },
    })
    minuteMap[m.number] = minute.id
  }

  const entitiesData = [
    { role: EntityRole.DONO_DE_OBRA,       name: 'Câmara Municipal da Amadora' },
    { role: EntityRole.FISCALIZACAO,        name: 'VHM – Coordenação e Gestão de Projetos, SA' },
    { role: EntityRole.PROJETISTA,          name: 'Saraiva + Associados' },
    { role: EntityRole.ENTIDADE_EXECUTANTE, name: 'RESSA S.A.' },
  ]

  const entityMap: Record<EntityRole, string> = {} as Record<EntityRole, string>
  for (const e of entitiesData) {
    const entity = await prisma.entity.upsert({
      where: { siteId_role: { siteId: site.id, role: e.role } },
      update: {},
      create: { ...e, siteId: site.id },
    })
    entityMap[e.role] = entity.id
  }

  const issuesData = [
    // DONO DE OBRA
    {
      entityRole: EntityRole.DONO_DE_OBRA,
      sequenceNumber: 1,
      title: 'Fechaduras / Sistema de Mestragem',
      description: 'Decisão sobre a utilização de canhão europeu nas fechaduras das carpintarias (em substituição da chave normal), possibilitando mestragem. Necessário definir o nível de mestragem pretendido e saber o montante da maior valia associada.',
      minuteNumber: 26,
      date: new Date('2026-03-19'),
      observations: 'O Dono de Obra ficou de analisar juntamente com a direcção da escola. O empreiteiro aguarda decisão urgente para poder adjudicar as carpintarias.',
      status: IssueStatus.PENDING,
    },
    // FISCALIZAÇÃO
    {
      entityRole: EntityRole.FISCALIZACAO,
      sequenceNumber: 1,
      title: 'Formalização das Respostas aos Pedidos de Esclarecimento (PDEs)',
      description: 'Comunicação formal por escrito das respostas já acordadas em reunião/obra aos pedidos de esclarecimento do Empreiteiro. Muitas questões foram discutidas e consolidadas, mas ainda sem comunicação formal por parte da Fiscalização.',
      minuteNumber: 26,
      date: new Date('2026-03-19'),
      observations: 'VHM comprometeu-se: "...situação que, à partida, na próxima semana ficará completamente resolvida."',
      status: IssueStatus.IN_PROGRESS,
    },
    {
      entityRole: EntityRole.FISCALIZACAO,
      sequenceNumber: 2,
      title: 'Análise do Enquadramento Legal das Alterações das Caixilharias / Vidros',
      description: 'Análise da questão das alterações dos vidros/caixilharias propostas pelo empreiteiro e o seu enquadramento legal (legislação de contratos públicos). A conclusão deverá ser apresentada ao Dono de Obra para decisão em sede de trabalhos complementares.',
      minuteNumber: 25,
      date: new Date('2026-03-12'),
      observations: 'Na Acta 26 o DO aceitou já a solução do projetista. A VHM deverá formalizar a avaliação legal/contratual das eventuais maiores valias.',
      status: IssueStatus.IN_PROGRESS,
    },
    // PROJETISTA
    {
      entityRole: EntityRole.PROJETISTA,
      sequenceNumber: 1,
      title: 'Peça Desenhada (Draft) do "Muro" junto ao Edifício Existente',
      description: 'Entrega da peça desenhada formal do muro de reabilitação junto ao edifício escolar existente. A solução conceptual (varões aço + malha electrossoldada AQ50) foi enviada por mail, mas a peça desenhada formal (projecto de execução) não foi ainda entregue.',
      minuteNumber: 17,
      date: new Date('2026-01-15'),
      observations: 'Na Acta 22 (19/02) o projetista comprometeu-se a entregar até final de Fevereiro. Nas Actas 25 e 26 ainda sem resolução. VHM refere que não é impeditivo de alguns trabalhos.',
      status: IssueStatus.PENDING,
    },
    {
      entityRole: EntityRole.PROJETISTA,
      sequenceNumber: 2,
      title: 'Enquadramento das Alterações dos Vidros / Caixilharia – Peça Desenhada (Draft) Fachada Principal',
      description: 'Envio de: (1) documento de enquadramento relativo às alterações pretendidas para os vidros/caixilharias; (2) peça desenhada (draft) da caixilharia na fachada principal do edifício, para consolidar o que foi referido em reunião.',
      minuteNumber: 25,
      date: new Date('2026-03-12'),
      observations: 'Solicitado formalmente na Acta 26. DO já aprovou a solução. Empreiteiro aguarda urgentemente para poder adjudicar as caixilharias.',
      status: IssueStatus.PENDING,
    },
    {
      entityRole: EntityRole.PROJETISTA,
      sequenceNumber: 3,
      title: 'Resposta sobre Cor (RAL) da Pintura dos Vidros das Caixilharias',
      description: 'Definição da cor RAL a utilizar na pintura dos vidros/caixilharias nas zonas onde o projecto prevê chapa lacada. O empreiteiro enviou o conjunto de questões por email em 18/03/2026.',
      minuteNumber: 26,
      date: new Date('2026-03-19'),
      observations: 'O projetista de arquitectura ficou de analisar e enviar a resposta. Necessário para avançar com a adjudicação das caixilharias.',
      status: IssueStatus.PENDING,
    },
    {
      entityRole: EntityRole.PROJETISTA,
      sequenceNumber: 4,
      title: 'Procedimento Operativo – "Corpo a Acrescentar" à Laje (Microbetão)',
      description: 'Envio de Procedimento Operativo com draft de armadura do "corpo a acrescentar" à laje, cuja secção deverá ser preenchida com microbetão. A VHM não aceita a solução GROUT proposta pelo empreiteiro.',
      minuteNumber: 26,
      date: new Date('2026-03-19'),
      observations: 'Solicitado na Acta 26. A fiscalização indicou microbetão como o material correcto para este elemento construtivo.',
      status: IssueStatus.PENDING,
    },
    {
      entityRole: EntityRole.PROJETISTA,
      sequenceNumber: 5,
      title: 'Análise da Quantidade de Manta Acústica Prevista em Projecto',
      description: 'Verificar se a quantidade de manta acústica prevista em projecto (referenciada apenas para um piso, segundo o empreiteiro) está correcta ou se deve abranger outros pisos do edifício.',
      minuteNumber: 25,
      date: new Date('2026-03-12'),
      observations: 'O projetista ficou de analisar e posteriormente informar. Relevante para aprovação do material (FAME) e planeamento de obra.',
      status: IssueStatus.PENDING,
    },
  ]

  for (const issue of issuesData) {
    const { entityRole, minuteNumber, ...rest } = issue
    const entityId = entityMap[entityRole]
    const minuteId = minuteMap[minuteNumber]
    await prisma.issue.upsert({
      where: { entityId_sequenceNumber: { entityId, sequenceNumber: rest.sequenceNumber } },
      update: {},
      create: { ...rest, siteId: site.id, entityId, minuteId },
    })
  }

  console.log('Seed complete: 1 site, 4 minutes, 4 entities, 8 issues.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
