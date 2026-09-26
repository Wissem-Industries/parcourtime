import type { Campaign } from '~/types/parcoursup'
import rawCampaigns from './campaigns.json'

export const campaigns = rawCampaigns as Campaign[]

export const defaultCampaignId = '2026-2027'

export const getCampaignById = (id: string) => campaigns.find((campaign) => campaign.id === id)
