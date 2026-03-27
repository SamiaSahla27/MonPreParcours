import { CareerAiService } from './career-ai.service';

describe(CareerAiService.name, () => {
    const service = new CareerAiService();

    it('returns a structured analysis for a known job', () => {
        const result = service.analyzeCareer({ jobTitle: 'Infirmier' });

        expect(result.jobTitle).toBe('Infirmier');
        expect(result.aiCompatibilityScore).toBeGreaterThanOrEqual(18);
        expect(result.aiCompatibilityScore).toBeLessThanOrEqual(95);
        expect(['faible', 'modéré', 'élevé']).toContain(result.transformationImpact);
        expect(['0-3 ans', '3-7 ans', '7+ ans']).toContain(result.timeHorizon);
        expect(result.skillsToDevelop.length).toBeGreaterThan(0);
        expect(result.adviceForYoungPeople.length).toBeGreaterThan(0);
    });

    it('handles unknown jobs with safe defaults', () => {
        const result = service.analyzeCareer({ jobTitle: 'Explorateur de constellations' });

        expect(result.resilienceDrivers.length).toBeGreaterThan(0);
        expect(result.automationRisks.length).toBeGreaterThan(0);
        expect(result.emergingAdjacentRoles.length).toBeGreaterThan(0);
        expect(result.confidence).toBe(0.55);
    });

    it('rejects empty job title', () => {
        expect(() => service.analyzeCareer({ jobTitle: '   ' })).toThrow(
            'JOB_TITLE_REQUIRED',
        );
    });
});
