import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// ANNOTATION: The directory path is currently hardcoded to Algeria 1AP Arabic.
// For a fully dynamic multi-country system, this should be built dynamically from params.
const ARABIC_1AP_DIR = path.join(
    process.cwd(),
    '..', '..',
    'programs', 'ar', 'algeria', '4_1ap', 'Matière_1_ اللغة العربية'
);

function readJson(fileName: string) {
    const filePath = path.join(ARABIC_1AP_DIR, fileName);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export async function GET(
    request: NextRequest,
    { params }: { params: { country: string; level: string; subject: string } }
) {
    const { country, level, subject } = await params;
    const { searchParams } = new URL(request.url);
    const dataType = searchParams.get('dataType') || 'curriculum';

    // ANNOTATION: The 'domaine' parameter is central to the new architecture. 
    // It filters the massive 'arabe' JSON file into its logical sub-subjects: arabe, islamique, civique.
    const domaine = searchParams.get('domaine') || 'arabe';

    if (country === 'dz' && level === '1ap' && ['ar', 'arabe', 'Arabe'].includes(subject)) {
        try {
            // ─── CURRICULUM ──────────────────────────────────────────────────────────
            if (dataType === 'curriculum') {
                const data = readJson('algerie_1ap_arabe_curriculum.json');
                if (!data) return NextResponse.json({ error: "File not found" }, { status: 404 });

                const themes = (data.maqaate || []).map((maqta: any) => {
                    let lessons = [];

                    // Filter content based on requested domaine
                    if (domaine === 'arabe') {
                        lessons = (maqta.unites || []).map((unite: string, idx: number) => ({
                            id: `${maqta.maqta_id}_ar_${idx}`,
                            title: unite,
                            title_fr: maqta.unites_fr?.[idx] || "",
                            objectives: maqta.competences_visees || []
                        }));
                    } else if (domaine === 'islamique' && maqta.education_islamique) {
                        lessons = maqta.education_islamique.map((islm: any, idx: number) => ({
                            id: `${maqta.maqta_id}_islm_${idx}`,
                            title: islm.titre,
                            title_fr: islm.titre_fr || "",
                            objectives: islm.learning_objectives || [],
                            bloom: islm.bloom_level
                        }));
                    } else if (domaine === 'civique' && maqta.education_civique) {
                        lessons = maqta.education_civique.map((civ: any, idx: number) => ({
                            id: `${maqta.maqta_id}_civ_${idx}`,
                            title: civ.titre,
                            title_fr: civ.titre_fr || "",
                            objectives: civ.learning_objectives || [],
                            bloom: civ.bloom_level
                        }));
                    }

                    return {
                        id: maqta.maqta_id,
                        title: maqta.titre,
                        title_fr: maqta.titre_fr,
                        letters: domaine === 'arabe' ? (maqta.lettres_introduites || []) : [],
                        lessons
                    };
                });
                return NextResponse.json({ country, level, subject, domaine, themes, metadata: data.metadata || {} });
            }

            // ─── EXERCISES ───────────────────────────────────────────────────────────
            if (dataType === 'exercises') {
                const data = readJson('algerie_1ap_arabe_exercises.json');
                if (!data) return NextResponse.json({ error: "File not found" }, { status: 404 });

                const lessons = (data.lessons || []).map((lesson: any) => ({
                    lesson_id: lesson.lesson_id,
                    title: lesson.lesson_title,
                    title_fr: lesson.lesson_title_fr,
                    theme: lesson.lesson_theme,
                    letters: lesson.letters_introduced || [],
                    semester: lesson.semester,
                    // Filter exercises by domaine
                    exercises: (lesson.exercises || [])
                        .filter((ex: any) => !domaine || ex.domaine === domaine)
                        .map((ex: any) => ({
                            id: ex.id,
                            type: ex.type,
                            difficulty: ex.difficulty,
                            points: ex.points,
                            statement: ex.statement,
                            options: ex.options || [],
                            correct: ex.correct_answer || ex.correct_option_id,
                            explanation: ex.explanation,
                            feedback: ex.feedback,
                            parent_help: ex.parent_tip_fr || ex.parent_help
                        }))
                }));
                return NextResponse.json({ lessons, metadata: data.metadata || {} });
            }

            // ─── EXAMS ───────────────────────────────────────────────────────────────
            if (dataType === 'exams') {
                const data = readJson('algerie_1ap_arabe_exams.json');
                if (!data) return NextResponse.json({ error: "File not found" }, { status: 404 });
                const curriculum = data.curriculum || {};
                const allExams: any[] = [];
                ['semestre1', 'semestre2', 'semestre3'].forEach(sem => {
                    const semester = curriculum[sem];
                    if (!semester) return;
                    (semester.maqata || []).forEach((maqta: any) => {
                        (maqta.exams || []).forEach((exam: any) => {
                            // Basic domaine filtering for exams if specified
                            if (!domaine || exam.domaine === domaine || exam.type_evaluation?.includes(domaine)) {
                                allExams.push({
                                    id: exam.exam_id || exam.id,
                                    title: exam.titre_ar || exam.title_ar || exam.titre,
                                    title_fr: exam.titre_fr || exam.title_fr,
                                    type: exam.type_evaluation || exam.type,
                                    trimester: sem,
                                    maqta_id: maqta.id,
                                    duration: exam.duree_minutes,
                                    total_score: exam.bareme_total || 20,
                                    questions: (exam.exercices || exam.questions || []).map((q: any) => ({
                                        id: q.id,
                                        points: q.bareme,
                                        statement: q.consigne_ar || q.enonce || q.statement,
                                        type: q.type
                                    }))
                                });
                            }
                        });
                    });
                });
                return NextResponse.json({ exams: allExams, metadata: data.metadata || {} });
            }

            // ─── EVALUATIONS ─────────────────────────────────────────────────────────
            if (dataType === 'evaluations') {
                let data = readJson('algerie_1ap_arabe_evaluations.json');
                if (!data) return NextResponse.json({ error: "File not found" }, { status: 404 });

                // Evaluations are wrapped in an object containing metadata and the evaluations array
                let evaluationsArray = Array.isArray(data) ? data : (data.evaluations || []);

                const evaluations = evaluationsArray.map((evalItem: any) => {
                    // Filter questions inside the evaluation by domaine
                    const filteredQuestions = (evalItem.questions || []).filter((q: any) => !domaine || q.domaine === domaine);
                    return {
                        ...evalItem,
                        questions: filteredQuestions
                    };
                }).filter((e: any) => e.questions.length > 0); // Remove evals that ending up empty

                return NextResponse.json({ evaluations, total: evaluations.length });
            }

            // ─── COMPETENCES ─────────────────────────────────────────────────────────
            if (dataType === 'competences') {
                const data = readJson('algerie_1ap_arabe_competences.json');
                if (!data) return NextResponse.json({ error: "File not found" }, { status: 404 });

                // Fetch the domaine-specific arrays created during phase 1 enrichment
                const globalSkillsKey = `global_skills_${domaine}`;
                const themeSkillsKey = `skills_by_theme_${domaine}`;

                const globalSkills = data[globalSkillsKey] || data.global_skills || [];
                const skillsByTheme = data[themeSkillsKey] || data.skills_by_theme || [];

                const transformed = {
                    metadata: data.metadata,
                    globalSkills: globalSkills.map((gs: any) => ({
                        id: gs.skill_id,
                        name: gs.name_ar,
                        name_fr: gs.name_fr,
                        description: gs.description_ar,
                        description_fr: gs.description_fr,
                        indicators: (gs.indicators || []).map((ind: any) => ({
                            id: ind.indicator_id,
                            text: ind.text_ar,
                            text_fr: ind.text_fr,
                            bloom: ind.bloom_level
                        }))
                    })),
                    bloomSummary: data.bloom_mapping?.summary || {},
                    skillsByTheme: skillsByTheme.map((theme: any) => ({
                        id: theme.theme_id,
                        title: theme.theme_title_ar,
                        title_fr: theme.theme_title_fr,
                        icon: theme.theme_icon,
                        color: theme.theme_color,
                        skills: (theme.skills || []).map((s: any) => ({
                            id: s.skill_id,
                            name: s.name_ar,
                            name_fr: s.name_fr,
                            description: s.description_ar,
                            description_fr: s.description_fr,
                            outcomes: s.expected_outcomes_ar,
                            difficulty: s.difficulty_level,
                            bloom: s.bloom_level,
                            indicators: (s.indicators || []).map((ind: any) => ({
                                id: ind.indicator_id,
                                text: ind.text_ar,
                                text_fr: ind.text_fr,
                                bloom: ind.bloom_level
                            }))
                        }))
                    }))
                };
                return NextResponse.json(transformed);
            }

        } catch (error) {
            console.error("API Error:", error);
            return NextResponse.json({ error: "Failed to load education data" }, { status: 500 });
        }
    }

    // Default fallback
    return NextResponse.json({ country, level, subject, themes: [], message: "No data for this combination yet." });
}
