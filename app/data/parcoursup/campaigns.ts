import type {Campaign} from "~/types/parcoursup";
import rawCampaigns from "./campaigns.json";

export const campaigns = rawCampaigns as Campaign[];

export const defaultCampaignId = "2025-2026";

export const getCampaignById = (id: string) =>
    campaigns.find((campaign) => campaign.id === id);
