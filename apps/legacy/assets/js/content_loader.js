/**
 * FreeGeny Content Loader
 * Charge le contenu éducatif depuis l'API
 */

async function loadEducationalContent(contentKey, language) {
    try {
        const response = await fetch(
            `/api/get_content.php?key=${contentKey}&lang=${language}`
        );

        const result = await response.json();

        if (result.success) {
            return result.data;
        } else {
            console.error('Content not found:', result.error);
            return null;
        }
    } catch (error) {
        console.error('Error loading content:', error);
        return null;
    }
}

// Fonction pour afficher le contenu dans la page
async function displayLesson(contentKey) {
    const currentLang = getLang(); // Depuis i18n.js
    const content = await loadEducationalContent(contentKey, currentLang);

    if (content) {
        // Afficher le titre
        const titleEl = document.getElementById('lesson-title');
        if (titleEl) titleEl.innerHTML = content.title;

        // Afficher la description
        const descEl = document.getElementById('lesson-description');
        if (descEl) descEl.innerHTML = content.description;

        // Afficher le contenu principal
        const bodyEl = document.getElementById('lesson-body');
        if (bodyEl) bodyEl.innerHTML = content.body;

        // Charger la vidéo si présente
        if (content.media_url) {
            const videoEl = document.getElementById('lesson-video');
            if (videoEl) videoEl.src = content.media_url;
        }

        console.log('Lesson loaded successfully:', content.title);
    } else {
        console.error('Failed to load lesson');
    }
}

// Fonction pour charger une liste de contenus (ex: tous les exercices d'un niveau)
async function loadContentList(filters) {
    const params = new URLSearchParams({
        lang: filters.language || getLang(),
        type: filters.type || '',
        subject: filters.subject || '',
        age_group: filters.age_group || '',
        grade_level: filters.grade_level || ''
    });

    try {
        const response = await fetch(`/api/list_content.php?${params}`);
        const result = await response.json();

        if (result.success) {
            return result.data;
        } else {
            console.error('Failed to load content list:', result.error);
            return [];
        }
    } catch (error) {
        console.error('Error loading content list:', error);
        return [];
    }
}

// Exemple d'utilisation :
// displayLesson('math_addition_basic');
//
// const exercises = await loadContentList({
//     type: 'exercise',
//     subject: 'math',
//     grade_level: '1AP'
// });
