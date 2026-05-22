export type CampaignId = `${number}-${number}`;

export type DateCertainty =
    | "official"
    | "to_confirm"
    | "estimated"
    | "past_official";

export type PhaseStatus =
    | "upcoming"
    | "active"
    | "finished"
    | "date_unconfirmed"
    | "outside_calendar";

export type Source = {
    id: string;
    title: string;
    url: string;
    retrievedAt: string;
};

export type Milestone = {
    id: string;
    title: string;
    date?: string;
    displayDate?: string;
    shortDescription?: string;
    certainty: DateCertainty;
    sourceIds: string[];
    importance?: "primary" | "secondary";
};

export type ParcoursupPhase = {
    id: string;
    order: number;
    title: string;
    shortDescription: string;
    start?: string;
    end?: string;
    displayDate?: string;
    certainty: DateCertainty;
    sourceIds: string[];
    milestones?: Milestone[];
};

export type Campaign = {
    id: CampaignId;
    label: string;
    timezone: "Europe/Paris";
    lastUpdated: string;
    sources: Source[];
    phases: ParcoursupPhase[];
};

export type Deadline = {
    id: string;
    title: string;
    date: Date;
    displayDate: string;
    phaseId: string;
    phaseTitle: string;
    sourceIds: string[];
    importance: "primary" | "secondary";
};
