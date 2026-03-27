export type TransformationImpact = "faible" | "modéré" | "élevé";
export type TimeHorizon = "0-3 ans" | "3-7 ans" | "7+ ans";

export type SkillRecommendation = {
    skill: string;
    priority: "haute" | "moyenne" | "basse";
    reason: string;
    concreteExample?: string;
};

export type ScoreBreakdownItem = {
    label: string;
    value: number;
    helper: string;
};

export type TaskAutomationStatus =
    | "difficilement remplaçable"
    | "assistée par l’IA"
    | "partiellement automatisable";

export type TaskAutomationItem = {
    task: string;
    status: TaskAutomationStatus;
    details: string;
};

export type UseCaseItem = {
    title: string;
    details: string;
};

export type TimelineItem = {
    period: "0-2 ans" | "3-5 ans" | "5-10 ans";
    evolution: string;
};

export type ImpactItem = {
    label: "missions" | "compétences" | "outils" | "volume d’emploi";
    level: TransformationImpact;
    details: string;
};

export type ComparableCareerItem = {
    title: string;
    score: number;
    impact: TransformationImpact;
};

export type MethodologyInfo = {
    criteria: string[];
    updatedAt: string;
    confidenceLabel: "faible" | "modérée" | "élevée";
};

export type CareerAiAnalysis = {
    jobTitle: string;
    aiCompatibilityScore: number;
    transformationImpact: TransformationImpact;
    timeHorizon: TimeHorizon;
    resilienceDrivers: string[];
    automationRisks: string[];
    skillsToDevelop: SkillRecommendation[];
    emergingAdjacentRoles: string[];
    adviceForYoungPeople: string[];
    confidence: number;
    disclaimer: string;
    scoreBreakdown: ScoreBreakdownItem[];
    taskAutomation: TaskAutomationItem[];
    pedagogyAssistVsReplace: string[];
    concreteUseCases: UseCaseItem[];
    deeplyHumanCore: string[];
    timeline: TimelineItem[];
    impactIndicators: ImpactItem[];
    comparableCareers: ComparableCareerItem[];
    methodology: MethodologyInfo;
};

function getBaseUrl() {
    return (import.meta as any).env?.VITE_BACKEND_URL ?? "http://localhost:3000";
}

function shouldUseMockData() {
    return ((import.meta as any).env?.VITE_USE_MOCK_CAREER_AI ?? "false") === "true";
}

function normalize(value: string) {
    return value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function includesAny(value: string, terms: string[]) {
    return terms.some((term) => value.includes(normalize(term)));
}

function getDefaultExtendedAnalysis(): Pick<
    CareerAiAnalysis,
    | "scoreBreakdown"
    | "taskAutomation"
    | "pedagogyAssistVsReplace"
    | "concreteUseCases"
    | "deeplyHumanCore"
    | "timeline"
    | "impactIndicators"
    | "comparableCareers"
    | "methodology"
> {
    return {
        scoreBreakdown: [
            { label: "Tâches répétitives", value: 45, helper: "Plus ce score est haut, plus l’automatisation est probable." },
            { label: "Besoin de jugement humain", value: 72, helper: "Décisions nuancées et contextuelles." },
            { label: "Environnement imprévisible", value: 68, helper: "L’IA fonctionne moins bien sur des situations non standardisées." },
            { label: "Responsabilité humaine/légale", value: 70, helper: "La responsabilité finale reste humaine." },
            { label: "Relation humaine", value: 74, helper: "Interaction, confiance et empathie." },
            { label: "Usage d’outils numériques", value: 57, helper: "Le métier peut être fortement assisté par les outils IA." },
        ],
        taskAutomation: [
            {
                task: "Intervention terrain",
                status: "difficilement remplaçable",
                details: "Nécessite adaptation physique et prise d’initiative en temps réel.",
            },
            {
                task: "Prise de décision en situation réelle",
                status: "assistée par l’IA",
                details: "L’IA peut proposer des scénarios, mais la décision finale reste humaine.",
            },
            {
                task: "Reporting / administratif",
                status: "partiellement automatisable",
                details: "Saisie et synthèse peuvent être accélérées par des outils IA.",
            },
            {
                task: "Prévention",
                status: "assistée par l’IA",
                details: "Détection précoce des zones de risque grâce à l’analyse de données.",
            },
            {
                task: "Formation / simulation",
                status: "assistée par l’IA",
                details: "Les simulateurs intelligents améliorent l’entraînement.",
            },
            {
                task: "Coordination opérationnelle",
                status: "assistée par l’IA",
                details: "Aide à prioriser les ressources selon la gravité et la localisation.",
            },
        ],
        pedagogyAssistVsReplace: [
            "Assistée : l’IA t’aide à aller plus vite et à mieux préparer tes actions.",
            "Automatisée : l’IA prend en charge certaines tâches répétitives (ex: comptes rendus).",
            "Remplacée : cela ne veut pas dire que le métier disparaît, mais qu’il évolue vers plus de décision et de coordination humaine.",
        ],
        concreteUseCases: [
            { title: "Analyse prédictive des risques", details: "Identifier des zones et périodes à risque pour mieux anticiper les interventions." },
            { title: "Aide au dispatch", details: "Aider la répartition des équipes en fonction de la gravité, de la distance et des moyens disponibles." },
            { title: "Simulation d’entraînement", details: "Créer des scénarios réalistes pour améliorer la préparation opérationnelle." },
            { title: "Génération de comptes rendus", details: "Produire une première version du rapport post-intervention." },
            { title: "Maintenance prédictive du matériel", details: "Détecter les signes d’usure avant la panne pour sécuriser les opérations." },
        ],
        deeplyHumanCore: [
            "Gestion du stress",
            "Intervention physique",
            "Empathie avec les victimes",
            "Prise de décision en urgence",
            "Coordination humaine sur le terrain",
            "Responsabilité morale",
        ],
        timeline: [
            {
                period: "0-2 ans",
                evolution: "Automatisation légère de l’administratif et diffusion d’outils d’aide à la décision.",
            },
            {
                period: "3-5 ans",
                evolution: "Montée des systèmes prédictifs pour la prévention et optimisation des opérations.",
            },
            {
                period: "5-10 ans",
                evolution: "Profession plus augmentée technologiquement, avec un fort besoin de pilotage humain.",
            },
        ],
        impactIndicators: [
            { label: "missions", level: "modéré", details: "Les missions évoluent dans leur préparation, pas dans leur finalité humaine." },
            { label: "compétences", level: "élevé", details: "Les compétences numériques et l’analyse de données deviennent clés." },
            { label: "outils", level: "élevé", details: "Les outils IA et les plateformes temps réel prennent plus de place." },
            { label: "volume d’emploi", level: "faible", details: "Le besoin terrain reste fort, avec évolution des profils recherchés." },
        ],
        comparableCareers: [
            { title: "Ambulancier", score: 76, impact: "modéré" },
            { title: "Policier", score: 71, impact: "modéré" },
            { title: "Agent de sécurité civile", score: 81, impact: "modéré" },
            { title: "Infirmier urgentiste", score: 79, impact: "modéré" },
        ],
        methodology: {
            criteria: [
                "Part de tâches répétitives",
                "Niveau de jugement humain requis",
                "Niveau d’imprévisibilité du contexte",
                "Niveau de responsabilité humaine/légale",
                "Place de la relation humaine",
                "Maturité des outils IA du secteur",
            ],
            updatedAt: "2026-03-27",
            confidenceLabel: "modérée",
        },
    };
}

function withExtendedDefaults(analysis: CareerAiAnalysis): CareerAiAnalysis {
    const fallback = getDefaultExtendedAnalysis();

    return {
        ...analysis,
        scoreBreakdown: analysis.scoreBreakdown?.length ? analysis.scoreBreakdown : fallback.scoreBreakdown,
        taskAutomation: analysis.taskAutomation?.length ? analysis.taskAutomation : fallback.taskAutomation,
        pedagogyAssistVsReplace: analysis.pedagogyAssistVsReplace?.length
            ? analysis.pedagogyAssistVsReplace
            : fallback.pedagogyAssistVsReplace,
        concreteUseCases: analysis.concreteUseCases?.length ? analysis.concreteUseCases : fallback.concreteUseCases,
        deeplyHumanCore: analysis.deeplyHumanCore?.length ? analysis.deeplyHumanCore : fallback.deeplyHumanCore,
        timeline: analysis.timeline?.length ? analysis.timeline : fallback.timeline,
        impactIndicators: analysis.impactIndicators?.length ? analysis.impactIndicators : fallback.impactIndicators,
        comparableCareers: analysis.comparableCareers?.length ? analysis.comparableCareers : fallback.comparableCareers,
        methodology: analysis.methodology ?? fallback.methodology,
    };
}

function mockAnalyzeCareer(params: {
    jobTitle: string;
    sector?: string;
    country?: string;
    educationLevel?: string;
}): CareerAiAnalysis {
    const jobTitle = params.jobTitle.trim();
    const normalized = normalize(jobTitle);

    const extended = getDefaultExtendedAnalysis();

    let aiCompatibilityScore = 58;
    let transformationImpact: TransformationImpact = "modéré";
    let timeHorizon: TimeHorizon = "3-7 ans";

    let resilienceDrivers: string[] = [
        "La composante humaine du métier reste importante.",
        "Le jugement en contexte réel garde une forte valeur.",
    ];

    let automationRisks: string[] = [
        "Certaines tâches répétitives peuvent être automatisées.",
        "Les activités de reporting standard seront de plus en plus assistées.",
    ];

    let skillsToDevelop: SkillRecommendation[] = [
        {
            skill: "Sang-froid",
            priority: "haute",
            reason: "Rester lucide quand la situation devient tendue.",
            concreteExample: "Garder la maîtrise pendant une intervention imprévue.",
        },
        {
            skill: "Prise de décision rapide",
            priority: "moyenne",
            reason: "Trancher vite avec des informations incomplètes.",
            concreteExample: "Choisir une priorité d’action en quelques secondes.",
        },
        {
            skill: "Communication claire",
            priority: "moyenne",
            reason: "Mieux coordonner l’équipe et réduire les erreurs.",
            concreteExample: "Transmettre une consigne simple en situation de stress.",
        },
        {
            skill: "Empathie",
            priority: "moyenne",
            reason: "Accompagner les personnes en détresse avec justesse.",
            concreteExample: "Rassurer une victime tout en restant opérationnel.",
        },
    ];

    let emergingAdjacentRoles: string[] = [
        "Référent outils numériques métier",
        "Coordinateur amélioration continue",
    ];

    const adviceForYoungPeople: string[] = [
        "Développe un profil hybride: compétences métier + maîtrise d’outils IA.",
        "Fais des mises en situation concrètes (stages, simulation, projets).",
        "Mise sur les compétences humaines différenciantes: sang-froid, communication, leadership.",
    ];

    if (includesAny(normalized, ["pompier", "sapeur", "firefighter"])) {
        aiCompatibilityScore = 81;
        transformationImpact = "modéré";
        timeHorizon = "3-7 ans";
        resilienceDrivers = [
            "Intervention physique en environnement imprévisible.",
            "Décisions immédiates sous forte pression humaine et morale.",
            "Coordination d’équipes en temps réel.",
        ];
        automationRisks = [
            "Préparation de rapports et formulaires post-intervention.",
            "Optimisation logistique et dispatch assistés par IA.",
        ];
        skillsToDevelop = [
            {
                skill: "Sang-froid",
                priority: "haute",
                reason: "Rester efficace sous pression en situation d’urgence.",
                concreteExample: "Garder le cap malgré la panique autour de toi.",
            },
            {
                skill: "Prise de décision en urgence",
                priority: "haute",
                reason: "Prendre la bonne décision rapidement sur le terrain.",
                concreteExample: "Adapter immédiatement le plan quand la situation change.",
            },
            {
                skill: "Coordination d’équipe",
                priority: "haute",
                reason: "Bien se synchroniser avec plusieurs acteurs en même temps.",
                concreteExample: "Coordonner pompiers, SAMU et forces de l’ordre.",
            },
            {
                skill: "Communication avec les victimes",
                priority: "moyenne",
                reason: "Donner des consignes rassurantes et compréhensibles.",
                concreteExample: "Expliquer calmement les gestes à faire pendant l’intervention.",
            },
            {
                skill: "Adaptabilité",
                priority: "moyenne",
                reason: "Réagir efficacement aux imprévus de chaque mission.",
                concreteExample: "Changer d’approche immédiatement face à un nouveau risque.",
            },
        ];
        emergingAdjacentRoles = [
            "Référent IA opérationnelle en caserne",
            "Coordinateur prévention augmentée par données",
            "Formateur simulation intelligente",
        ];
    } else if (includesAny(normalized, ["infirmier", "infirmiere", "medecin", "aide soignant", "psychologue"])) {
        aiCompatibilityScore = 78;
        transformationImpact = "modéré";
        timeHorizon = "3-7 ans";
    } else if (includesAny(normalized, ["comptable", "assistant administratif", "paie", "saisie"])) {
        aiCompatibilityScore = 46;
        transformationImpact = "élevé";
        timeHorizon = "0-3 ans";
    } else if (includesAny(normalized, ["developpeur", "developer", "ingenieur logiciel", "data analyst"])) {
        aiCompatibilityScore = 74;
        transformationImpact = "élevé";
        timeHorizon = "0-3 ans";
    } else if (includesAny(normalized, ["plombier", "electricien", "mecanicien", "artisan", "technicien terrain"])) {
        aiCompatibilityScore = 86;
        transformationImpact = "faible";
        timeHorizon = "7+ ans";
    }

    return withExtendedDefaults({
        jobTitle,
        aiCompatibilityScore,
        transformationImpact,
        timeHorizon,
        resilienceDrivers,
        automationRisks,
        skillsToDevelop,
        emergingAdjacentRoles,
        adviceForYoungPeople,
        confidence: 0.74,
        disclaimer: "Mode démo: cette analyse est mockée pour tester l’expérience produit sans backend/BDD.",
        ...extended,
    });
}

export async function analyzeCareer(params: {
    jobTitle: string;
    sector?: string;
    country?: string;
    educationLevel?: string;
}): Promise<CareerAiAnalysis> {
    if (!params.jobTitle?.trim()) {
        throw new Error("JOB_TITLE_REQUIRED");
    }

    if (shouldUseMockData()) {
        await new Promise((resolve) => setTimeout(resolve, 450));
        return mockAnalyzeCareer(params);
    }

    try {
        const res = await fetch(`${getBaseUrl()}/career-ai/analyze`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(text || `HTTP_${res.status}`);
        }

        const payload = (await res.json()) as CareerAiAnalysis;
        return withExtendedDefaults(payload);
    } catch {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return mockAnalyzeCareer(params);
    }
}
