-- ============================================================
-- FreeGeny — Script d'import écoles primaires Algérie
-- Gestion traduction AR → FR avec statut de vérification
-- ============================================================

-- ============================================================
-- 1. TABLE STAGING (temporaire pour l'import)
-- ============================================================
CREATE TABLE IF NOT EXISTS schools_staging (
    row_id          SERIAL PRIMARY KEY,
    wilaya_code     VARCHAR(5),
    wilaya_name     VARCHAR(200),
    commune_code    VARCHAR(10),
    commune_name    VARCHAR(200),
    ecole_code      VARCHAR(20),
    nom_ar          VARCHAR(400),
    type_ecole      SMALLINT DEFAULT 1   -- 1=public, 2=privé
);

-- Vider avant import
TRUNCATE schools_staging;

-- ============================================================
-- 2. IMPORT CSV PUBLIC
-- (adapter le chemin selon ton serveur)
-- ============================================================
\COPY schools_staging(wilaya_code, wilaya_name, commune_code, commune_name, ecole_code, nom_ar, type_ecole)
FROM 'ecoles_primaires_algerie.csv'
DELIMITER ',' CSV HEADER ENCODING 'UTF8';

-- Marquer comme public
UPDATE schools_staging SET type_ecole = 1;

-- ============================================================
-- 3. IMPORT CSV PRIVÉ (ajouter à la suite)
-- ============================================================
\COPY schools_staging(wilaya_code, wilaya_name, commune_code, commune_name, ecole_code, nom_ar, type_ecole)
FROM 'ecoles_privees_algerie.csv'
DELIMITER ',' CSV HEADER ENCODING 'UTF8';

-- Marquer les dernières lignes comme privé
UPDATE schools_staging
SET type_ecole = 2
WHERE type_ecole IS NULL OR type_ecole = 0;


-- ============================================================
-- 4. AJOUTER COLONNE TRADUCTION + STATUT
-- ============================================================
ALTER TABLE schools_staging
    ADD COLUMN IF NOT EXISTS nom_fr              VARCHAR(400),
    ADD COLUMN IF NOT EXISTS translation_status  VARCHAR(20) DEFAULT 'needs_review',
    ADD COLUMN IF NOT EXISTS translation_note    VARCHAR(200);


-- ============================================================
-- 5. RÈGLES DE TRADUCTION AUTOMATIQUE
-- (du plus simple au plus complexe)
-- ============================================================

-- 5.1 Préfixe standard "إبتدائية" → "École primaire"
-- (sera retiré et remplacé systématiquement)

-- 5.2 DATES — traduction fiable à 100%
UPDATE schools_staging SET
    nom_fr = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
        REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
        nom_ar,
        'إبتدائية', 'École'),
        '١ نوفمبر ١٩٥٤', '1er Novembre 1954'),
        '1 نوفمبر 1954', '1er Novembre 1954'),
        'نوفمبر', 'Novembre'),
        '19 مارس 1962', '19 Mars 1962'),
        'مارس', 'Mars'),
        '24 فيفري', '24 Février'),
        'فيفري', 'Février'),
        'جويلية', 'Juillet'),
        '5 جويلية 1962', '5 Juillet 1962'),
        'جانفي', 'Janvier'),
        'أكتوبر', 'Octobre'),
    translation_status = 'auto',
    translation_note   = 'date historique'
WHERE nom_ar ~ '(نوفمبر|مارس|فيفري|جويلية|جانفي|أكتوبر)'
  AND nom_ar ~ '[0-9]';


-- 5.3 NOMS COMMUNS — traduction fiable
UPDATE schools_staging SET
    nom_fr = CASE
        WHEN nom_ar LIKE '%السلام%'         THEN 'École de la Paix'
        WHEN nom_ar LIKE '%النصر%'          THEN 'École de la Victoire'
        WHEN nom_ar LIKE '%الأمل%'          THEN 'École de l''Espoir'
        WHEN nom_ar LIKE '%النور%'          THEN 'École de la Lumière'
        WHEN nom_ar LIKE '%الفجر%'          THEN 'École de l''Aube'
        WHEN nom_ar LIKE '%الوحدة%'         THEN 'École de l''Unité'
        WHEN nom_ar LIKE '%الاستقلال%'      THEN 'École de l''Indépendance'
        WHEN nom_ar LIKE '%التحرير%'        THEN 'École de la Libération'
        WHEN nom_ar LIKE '%العلم%'          THEN 'École du Savoir'
        WHEN nom_ar LIKE '%المعرفة%'        THEN 'École de la Connaissance'
        WHEN nom_ar LIKE '%الثورة%'         THEN 'École de la Révolution'
        WHEN nom_ar LIKE '%الشباب%'         THEN 'École de la Jeunesse'
        WHEN nom_ar LIKE '%الوطن%'          THEN 'École de la Patrie'
        WHEN nom_ar LIKE '%التضامن%'        THEN 'École de la Solidarité'
        WHEN nom_ar LIKE '%المنصور%'        THEN 'École Al-Mansour'
        WHEN nom_ar LIKE '%الخلدونية%'      THEN 'École Ibn Khaldoun'
        WHEN nom_ar LIKE '%ابن رشد%'        THEN 'École Ibn Rochd'
        WHEN nom_ar LIKE '%ابن سينا%'       THEN 'École Ibn Sina'
        WHEN nom_ar LIKE '%ابن باديس%'      THEN 'École Ibn Badis'
        WHEN nom_ar LIKE '%ابن خلدون%'      THEN 'École Ibn Khaldoun'
        WHEN nom_ar LIKE '%سيدي تواتي%'     THEN 'École Sidi Touati'
        WHEN nom_ar LIKE '%المقراني%'       THEN 'École El-Mokrani'
        WHEN nom_ar LIKE '%7361 مسكن%'      THEN 'École Cité 7361 Logements'
    END,
    translation_status = 'auto',
    translation_note   = 'nom commun identifié'
WHERE nom_ar NOT LIKE '%الشهيد%'
  AND nom_ar NOT LIKE '%الشهداء%'
  AND nom_ar NOT LIKE '%لالة%'
  AND (
    nom_ar LIKE '%السلام%' OR nom_ar LIKE '%النصر%' OR
    nom_ar LIKE '%الأمل%'  OR nom_ar LIKE '%النور%' OR
    nom_ar LIKE '%الفجر%'  OR nom_ar LIKE '%الوحدة%' OR
    nom_ar LIKE '%الاستقلال%' OR nom_ar LIKE '%التحرير%' OR
    nom_ar LIKE '%العلم%'  OR nom_ar LIKE '%المعرفة%' OR
    nom_ar LIKE '%الثورة%' OR nom_ar LIKE '%الشباب%' OR
    nom_ar LIKE '%الوطن%'  OR nom_ar LIKE '%التضامن%' OR
    nom_ar LIKE '%المنصور%' OR nom_ar LIKE '%الخلدونية%' OR
    nom_ar LIKE '%ابن رشد%' OR nom_ar LIKE '%ابن سينا%' OR
    nom_ar LIKE '%ابن باديس%' OR nom_ar LIKE '%ابن خلدون%' OR
    nom_ar LIKE '%سيدي تواتي%' OR nom_ar LIKE '%المقراني%' OR
    nom_ar LIKE '%7361 مسكن%'
  );


-- 5.4 MARTYRS — flaguer pour vérification humaine
UPDATE schools_staging SET
    translation_status = 'needs_review',
    translation_note   = 'nom de martyr — vérification orthographe requise'
WHERE nom_ar LIKE '%الشهيد%'
   OR nom_ar LIKE '%الشهداء%'
   OR nom_ar LIKE '%الشهيدين%';


-- 5.5 NOMS BERBÈRES / LOCAUX — flaguer
UPDATE schools_staging SET
    translation_status = 'needs_review',
    translation_note   = 'nom berbère ou local — translittération officielle requise'
WHERE nom_ar LIKE '%لالة%'
   OR nom_ar LIKE '%تيزي%'
   OR nom_ar LIKE '%أيت%'
   OR nom_ar LIKE '%إغيل%'
   OR nom_ar LIKE '%تاوريرت%'
   OR nom_ar LIKE '%أمالو%'
   OR nom_ar LIKE '%إغرم%'
   OR nom_ar LIKE '%أكفادو%'
   OR nom_ar LIKE '%تينبدار%';


-- 5.6 NOMS PRIVÉS — souvent déjà en français
UPDATE schools_staging SET
    translation_status = 'auto',
    translation_note   = 'école privée — nom souvent déjà latinisé',
    nom_fr = REPLACE(nom_ar, 'إبتدائية', 'École')
WHERE type_ecole = 2
  AND translation_status = 'needs_review';


-- 5.7 Tout ce qui reste sans traduction → needs_review
UPDATE schools_staging SET
    translation_status = 'needs_review',
    translation_note   = 'traduction manuelle requise'
WHERE nom_fr IS NULL;


-- ============================================================
-- 6. VÉRIFICATION AVANT IMPORT FINAL
-- ============================================================

-- Bilan global
SELECT
    translation_status,
    translation_note,
    COUNT(*) as nb_ecoles,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as pct
FROM schools_staging
GROUP BY translation_status, translation_note
ORDER BY nb_ecoles DESC;

-- Liste des écoles à vérifier manuellement
-- (exporter pour validation humaine)
SELECT
    ecole_code,
    wilaya_name,
    commune_name,
    nom_ar,
    COALESCE(nom_fr, '⚠️ À TRADUIRE') as nom_fr,
    translation_note
FROM schools_staging
WHERE translation_status = 'needs_review'
ORDER BY wilaya_code, commune_code, ecole_code;


-- ============================================================
-- 7. IMPORT COMMUNES → TABLE districts
-- ============================================================
INSERT INTO districts (region_id, code, name_local, name_fr)
SELECT DISTINCT
    r.id,
    s.commune_code,
    s.commune_name,
    s.commune_name   -- nom_fr à compléter (communes = noms latins déjà présents)
FROM schools_staging s
JOIN regions r ON r.code = s.wilaya_code AND r.country_code = 'DZ'
ON CONFLICT (region_id, code) DO NOTHING;


-- ============================================================
-- 8. IMPORT FINAL → TABLE schools
-- (seulement après validation des traductions)
-- ============================================================
INSERT INTO schools (
    district_id,
    code,
    name_local,
    name_fr,
    type,
    source,
    translation_status
)
SELECT
    d.id,
    s.ecole_code,
    s.nom_ar,
    s.nom_fr,
    s.type_ecole,
    'awlyaa.education.dz',
    s.translation_status
FROM schools_staging  s
JOIN districts        d ON d.code = s.commune_code
JOIN regions          r ON r.id   = d.region_id AND r.country_code = 'DZ'
ON CONFLICT (code) DO UPDATE SET
    name_local         = EXCLUDED.name_local,
    name_fr            = EXCLUDED.name_fr,
    type               = EXCLUDED.type,
    translation_status = EXCLUDED.translation_status,
    updated_at         = NOW();


-- ============================================================
-- 9. EXPORT LISTE À VALIDER (pour l'équipe de traduction)
-- ============================================================
\COPY (
    SELECT
        ecole_code      AS "Code École",
        wilaya_name     AS "Wilaya",
        commune_name    AS "Commune",
        nom_ar          AS "Nom Arabe",
        nom_fr          AS "Traduction Proposée",
        translation_status AS "Statut",
        translation_note   AS "Note"
    FROM schools_staging
    ORDER BY translation_status DESC, wilaya_code, commune_code
)
TO 'ecoles_a_valider.csv'
DELIMITER ',' CSV HEADER ENCODING 'UTF8';


-- ============================================================
-- NETTOYAGE
-- ============================================================
-- DROP TABLE schools_staging;  -- décommenter après validation finale


-- ============================================================
-- STATS FINALES
-- ============================================================
SELECT
    r.name_fr                                    AS wilaya,
    COUNT(*)                                     AS total_ecoles,
    SUM(CASE WHEN s.type = 1 THEN 1 ELSE 0 END) AS publiques,
    SUM(CASE WHEN s.type = 2 THEN 1 ELSE 0 END) AS privees,
    SUM(CASE WHEN s.translation_status = 'auto'         THEN 1 ELSE 0 END) AS traduites_auto,
    SUM(CASE WHEN s.translation_status = 'needs_review' THEN 1 ELSE 0 END) AS a_verifier
FROM schools       s
JOIN districts     d ON s.district_id = d.id
JOIN regions       r ON d.region_id   = r.id
WHERE r.country_code = 'DZ'
GROUP BY r.name_fr
ORDER BY total_ecoles DESC;
