import {describe, expect, it} from "vitest";
import {campaigns} from "../../app/data/parcoursup/campaigns";
import {
    getCurrentPhase,
    getNextDeadline,
    getPhaseStatus,
    hasUnconfirmedDates,
    sortPhases,
} from "../../app/utils/calendar";

const campaign2026 = campaigns.find((campaign) => campaign.id === "2025-2026")!;
const campaign2027 = campaigns.find((campaign) => campaign.id === "2026-2027")!;

describe("calendar utilities", () => {
    it("sorts phases chronologically by order", () => {
        const phases = sortPhases([...campaign2026.phases].reverse());

        expect(phases[0]?.id).toBe("information");
        expect(phases.at(-1)?.id).toBe("phase-complementaire");
    });

    it("detects the active phase from an injected date", () => {
        const now = new Date("2026-05-22T12:00:00+02:00");
        const currentPhase = getCurrentPhase(campaign2026, now);

        expect(currentPhase?.id).toBe("examen");
    });

    it("returns the next official deadline", () => {
        const now = new Date("2026-05-22T12:00:00+02:00");
        const deadline = getNextDeadline(campaign2026, now);

        expect(deadline?.id).toBe("debut-admission");
        expect(deadline?.date.toISOString()).toBe("2026-06-01T22:00:00.000Z");
    });

    it("marks future campaigns without published dates as unconfirmed", () => {
        const now = new Date("2026-05-22T12:00:00+02:00");
        const phase = campaign2027.phases[0]!;

        expect(hasUnconfirmedDates(campaign2027)).toBe(true);
        expect(getPhaseStatus(phase, now)).toBe("date_unconfirmed");
        expect(getCurrentPhase(campaign2027, now)).toBeNull();
    });

    it("handles dates before and after a phase", () => {
        const phase = campaign2026.phases.find((item) => item.id === "voeux")!;

        expect(getPhaseStatus(phase, new Date("2026-01-01T12:00:00+01:00"))).toBe(
            "upcoming",
        );
        expect(getPhaseStatus(phase, new Date("2026-02-01T12:00:00+01:00"))).toBe(
            "active",
        );
        expect(getPhaseStatus(phase, new Date("2026-03-13T12:00:00+01:00"))).toBe(
            "finished",
        );
    });
});
