export type ParcoursupStep = {
    id: string
    step: number
    title: string
    subtitle: string
    color: string
    start: Date
    end: Date
}

const steps: ParcoursupStep[] = [
    {
        id: 'info',
        step: 1,
        title: 'Je m’informe et découvre les formations',
        subtitle: 'Octobre 2025 à janvier 2026',
        color: '#E85A4F',
        start: new Date('2025-10-01T00:00:00+02:00'),
        end: new Date('2026-01-18T23:59:59+01:00')
    },
    {
        id: 'voeux',
        step: 2,
        title: 'Je m’inscris pour formuler mes vœux',
        subtitle: 'Lundi 19 janvier au jeudi 12 mars 2026',
        color: '#00A35A',
        start: new Date('2026-01-19T00:00:00+01:00'),
        end: new Date('2026-03-12T23:59:59+01:00')
    },
    {
        id: 'dossier',
        step: 3,
        title: 'Je finalise mon dossier et je confirme mes vœux',
        subtitle: 'Jusqu’au mercredi 1er avril 2026',
        color: '#00A35A',
        start: new Date('2026-03-13T00:00:00+01:00'),
        end: new Date('2026-04-01T23:59:59+02:00')
    },
    {
        id: 'admission',
        step: 4,
        title: 'Je reçois les réponses des formations et je décide',
        subtitle: 'Mardi 2 juin au samedi 11 juillet 2026',
        color: '#D1A300',
        start: new Date('2026-06-02T18:00:00+02:00'),
        end: new Date('2026-07-11T23:59:59+02:00')
    },
    {
        id: 'complementaire',
        step: 5,
        title: 'Phase complémentaire',
        subtitle: 'Jusqu’au jeudi 10 septembre 2026',
        color: '#D1A300',
        start: new Date('2026-06-11T00:00:00+02:00'),
        end: new Date('2026-09-10T23:59:59+02:00')
    }
]

export const year_start: Date = steps[0]!.start
export const results_date: Date = steps.find(s => s.id === 'admission')!.start

export default steps
