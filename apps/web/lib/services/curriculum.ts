/**
 * Service pour la gestion des programmes scolaires (Backend Statique v3.0)
 */

export interface Lesson {
    id: string;
    title: string;
    description: string;
    objectives: string[];
    duration?: string;
    prerequisites?: string[];
    keywords?: string[];
}

export interface Theme {
    title: string;
    introduction?: string;
    lessons: Lesson[];
}

export interface Curriculum {
    country: string;
    level: string;
    subject: string;
    themes: Theme[];
}

// Simule un appel API vers le backend statique
export async function fetchCurriculum(country: string, level: string, subject: string): Promise<Curriculum> {
    // Try to fetch real data from our new API route
    try {
        const response = await fetch(`/api/curriculum/${country}/${level}/${subject}`);
        if (response.ok) {
            return await response.json();
        }
    } catch (e) {
        console.warn("Failed to fetch from API, falling back to mock", e);
    }

    // Fallback Mock (Backend Statique v3.0)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                country,
                level,
                subject,
                themes: [
                    {
                        title: "Nombres et calculs",
                        introduction: "Ce thème permet à l'enfant de maîtriser les bases du calcul et de la numération.",
                        lessons: [
                            {
                                id: "l01",
                                title: "Les nombres entiers jusqu'au million",
                                description: "Découverte des nombres au-delà de 1000, lecture, écriture et décomposition.",
                                objectives: ["Lire et écrire les nombres jusqu'au million", "Décomposer un nombre", "Comparer des nombres"],
                                duration: "2 semaines",
                                prerequisites: ["Connaître les nombres jusqu'à 1000"],
                                keywords: ["million", "décomposition", "comparaison"]
                            },
                            {
                                id: "l02",
                                title: "Addition et soustraction des grands nombres",
                                description: "Maîtriser les techniques opératoires pour les grands nombres.",
                                objectives: ["Poser une addition", "Poser une soustraction", "Calcul mental avec les grands nombres"],
                                duration: "1 semaine"
                            }
                        ]
                    },
                    {
                        title: "Géométrie",
                        lessons: [
                            {
                                id: "l10",
                                title: "Les polygones",
                                description: "Identifier et tracer différents types de polygones.",
                                objectives: ["Définition d'un polygone", "Triangles et quadrilatères", "Tracer avec précision"]
                            }
                        ]
                    }
                ]
            });
        }, 500);
    });
}
