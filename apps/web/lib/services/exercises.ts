/**
 * Service pour la gestion de la banque d'exercices (Backend Statique v3.0)
 */

export interface Exercise {
    id: string;
    statement: string;
    type: 'qcm' | 'truefalse' | 'fill' | 'open';
    difficulty: 1 | 2 | 3;
    correction: string;
}

export interface ExerciseFilters {
    subject?: string;
    lessonId?: string;
    difficulty?: number[];
}

export async function fetchExercises(filters: ExerciseFilters): Promise<Exercise[]> {
    // Simule la lecture du JSON pré-généré
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: "fr_cm1_maths_l01_ex001",
                    statement: "Quel est le chiffre des centaines dans 5 432 ?",
                    type: "qcm",
                    difficulty: 1,
                    correction: "Le chiffre des centaines est 4."
                },
                {
                    id: "fr_cm1_maths_l01_ex002",
                    statement: "Écris en chiffres : Douze mille cinq cents.",
                    type: "fill",
                    difficulty: 1,
                    correction: "12 500"
                },
                {
                    id: "fr_cm1_maths_l01_ex003",
                    statement: "Compare 45 600 et 45 060.",
                    type: "open",
                    difficulty: 2,
                    correction: "45 600 > 45 060"
                }
            ]);
        }, 500);
    });
}
