-- ============================================================
-- FreeGeny — Script complet d'import des écoles algériennes
-- À exécuter UNE SEULE FOIS sur ta base de données PostgreSQL
-- 
-- INSTRUCTIONS :
-- 1. Copie ce fichier et les 2 CSV dans le même dossier
-- 2. Connecte-toi à ta DB : psql -U <user> -d <database>
-- 3. Exécute : \i import_schools_dz.sql
-- ============================================================


-- ============================================================
-- ÉTAPE 0 : Créer les tables de référence si elles n'existent pas
-- (déjà gérées par Drizzle, mais au cas où)
-- ============================================================

-- ============================================================
-- ÉTAPE 1 : Insérer le pays Algérie
-- ============================================================
INSERT INTO countries (code, name_fr, name_ar, name_en, name_local, flag_emoji, langs, is_active)
VALUES ('DZ', 'Algérie', 'الجزائر', 'Algeria', 'الجزائر', '🇩🇿', 'ar,fr', TRUE)
ON CONFLICT (code) DO UPDATE SET is_active = TRUE;


-- ============================================================
-- ÉTAPE 2 : Insérer les 58 wilayas
-- ============================================================
INSERT INTO regions (country_code, code, name_local, name_fr, name_en) VALUES
('DZ','01','أدرار','Adrar','Adrar'),
('DZ','02','الشلف','Chlef','Chlef'),
('DZ','03','الأغواط','Laghouat','Laghouat'),
('DZ','04','أم البواقي','Oum El Bouaghi','Oum El Bouaghi'),
('DZ','05','باتنة','Batna','Batna'),
('DZ','06','بجاية','Béjaïa','Bejaia'),
('DZ','07','بسكرة','Biskra','Biskra'),
('DZ','08','بشار','Béchar','Bechar'),
('DZ','09','البليدة','Blida','Blida'),
('DZ','10','البويرة','Bouira','Bouira'),
('DZ','11','تمنراست','Tamanrasset','Tamanrasset'),
('DZ','12','تبسة','Tébessa','Tebessa'),
('DZ','13','تلمسان','Tlemcen','Tlemcen'),
('DZ','14','تيارت','Tiaret','Tiaret'),
('DZ','15','تيزي وزو','Tizi Ouzou','Tizi Ouzou'),
('DZ','16','الجزائر','Alger','Algiers'),
('DZ','17','الجلفة','Djelfa','Djelfa'),
('DZ','18','جيجل','Jijel','Jijel'),
('DZ','19','سطيف','Sétif','Setif'),
('DZ','20','سعيدة','Saïda','Saida'),
('DZ','21','سكيكدة','Skikda','Skikda'),
('DZ','22','سيدي بلعباس','Sidi Bel Abbès','Sidi Bel Abbes'),
('DZ','23','عنابة','Annaba','Annaba'),
('DZ','24','قالمة','Guelma','Guelma'),
('DZ','25','قسنطينة','Constantine','Constantine'),
('DZ','26','المدية','Médéa','Medea'),
('DZ','27','مستغانم','Mostaganem','Mostaganem'),
('DZ','28','المسيلة','M''Sila','M''Sila'),
('DZ','29','معسكر','Mascara','Mascara'),
('DZ','30','ورقلة','Ouargla','Ouargla'),
('DZ','31','وهران','Oran','Oran'),
('DZ','32','البيض','El Bayadh','El Bayadh'),
('DZ','33','إليزي','Illizi','Illizi'),
('DZ','34','برج بوعريريج','Bordj Bou Arréridj','Bordj Bou Arreridj'),
('DZ','35','بومرداس','Boumerdès','Boumerdes'),
('DZ','36','الطارف','El Tarf','El Tarf'),
('DZ','37','تندوف','Tindouf','Tindouf'),
('DZ','38','تيسمسيلت','Tissemsilt','Tissemsilt'),
('DZ','39','الوادي','El Oued','El Oued'),
('DZ','40','خنشلة','Khenchela','Khenchela'),
('DZ','41','سوق أهراس','Souk Ahras','Souk Ahras'),
('DZ','42','تيبازة','Tipaza','Tipaza'),
('DZ','43','ميلة','Mila','Mila'),
('DZ','44','عين الدفلى','Aïn Defla','Ain Defla'),
('DZ','45','النعامة','Naâma','Naama'),
('DZ','46','عين تموشنت','Aïn Témouchent','Ain Temouchent'),
('DZ','47','غرداية','Ghardaïa','Ghardaia'),
('DZ','48','غليزان','Relizane','Relizane'),
('DZ','49','تيميمون','Timimoun','Timimoun'),
('DZ','50','برج باجي مختار','Bordj Badji Mokhtar','Bordj Badji Mokhtar'),
('DZ','51','أولاد جلال','Ouled Djellal','Ouled Djellal'),
('DZ','52','بني عباس','Beni Abbès','Beni Abbes'),
('DZ','53','إن صالح','In Salah','In Salah'),
('DZ','54','إن قزام','In Guezzam','In Guezzam'),
('DZ','55','تقرت','Touggourt','Touggourt'),
('DZ','56','جانت','Djanet','Djanet'),
('DZ','57','المغير','El M''Ghair','El M''Ghair'),
('DZ','58','المنيعة','El Meniaa','El Meniaa')
ON CONFLICT DO NOTHING;


-- ============================================================
-- ÉTAPE 3 : Table de staging temporaire
-- ============================================================
CREATE TABLE IF NOT EXISTS schools_staging (
    row_id          SERIAL PRIMARY KEY,
    wilaya_code     VARCHAR(5),
    wilaya_name     VARCHAR(200),
    commune_code    VARCHAR(10),
    commune_name    VARCHAR(200),
    ecole_code      VARCHAR(20),
    nom_ar          VARCHAR(400),
    nom_fr          VARCHAR(400),
    type_ecole      SMALLINT DEFAULT 1,
    translation_status VARCHAR(20) DEFAULT 'needs_review'
);

TRUNCATE schools_staging;


-- ============================================================
-- ÉTAPE 4 : Importer les CSV
-- (Adapter le chemin absolu de tes fichiers CSV)
-- ============================================================

-- Écoles PUBLIQUES
\COPY schools_staging(wilaya_code, wilaya_name, commune_code, commune_name, ecole_code, nom_ar)
FROM 'C:\Users\Yousr\freegonya\base\ecoles_primaires_algerie.csv'
DELIMITER ',' CSV HEADER ENCODING 'UTF8';

UPDATE schools_staging SET type_ecole = 1 WHERE type_ecole IS NULL;

-- Écoles PRIVÉES
\COPY schools_staging(wilaya_code, wilaya_name, commune_code, commune_name, ecole_code, nom_ar, type_ecole)
FROM 'C:\Users\Yousr\freegonya\base\ecoles_privees_algerie.csv'
DELIMITER ',' CSV HEADER ENCODING 'UTF8';

UPDATE schools_staging SET type_ecole = 2
WHERE type_ecole = 0 OR (type_ecole IS NULL AND row_id > (SELECT MAX(row_id) FROM schools_staging WHERE type_ecole = 1));


-- ============================================================
-- ÉTAPE 5 : Traductions automatiques AR → FR
-- ============================================================

-- Dates historiques (très fiable)
UPDATE schools_staging SET
    nom_fr = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
        REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
        nom_ar,
        'إبتدائية', 'École primaire'),
        '١ نوفمبر ١٩٥٤', '1er Novembre 1954'),
        '1 نوفمبر 1954', '1er Novembre 1954'),
        'نوفمبر', 'Novembre'),
        '19 مارس 1962', '19 Mars 1962'),
        '5 جويلية 1962', '5 Juillet 1962'),
        'مارس', 'Mars'), 'جويلية', 'Juillet'),
        'فيفري', 'Février'), 'جانفي', 'Janvier'),
    translation_status = 'auto'
WHERE nom_ar ~ '(نوفمبر|مارس|فيفري|جويلية|جانفي|أكتوبر)';

-- Noms communs connus
UPDATE schools_staging SET nom_fr = CASE
    WHEN nom_ar LIKE '%السلام%'       THEN 'École de la Paix'
    WHEN nom_ar LIKE '%النصر%'        THEN 'École de la Victoire'
    WHEN nom_ar LIKE '%الأمل%'        THEN 'École de l''Espoir'
    WHEN nom_ar LIKE '%النور%'        THEN 'École de la Lumière'
    WHEN nom_ar LIKE '%الفجر%'        THEN 'École de l''Aube'
    WHEN nom_ar LIKE '%الوحدة%'       THEN 'École de l''Unité'
    WHEN nom_ar LIKE '%الاستقلال%'    THEN 'École de l''Indépendance'
    WHEN nom_ar LIKE '%التحرير%'      THEN 'École de la Libération'
    WHEN nom_ar LIKE '%العلم%'        THEN 'École du Savoir'
    WHEN nom_ar LIKE '%المعرفة%'      THEN 'École de la Connaissance'
    WHEN nom_ar LIKE '%الشباب%'       THEN 'École de la Jeunesse'
    WHEN nom_ar LIKE '%الوطن%'        THEN 'École de la Patrie'
    WHEN nom_ar LIKE '%التضامن%'      THEN 'École de la Solidarité'
    WHEN nom_ar LIKE '%ابن رشد%'      THEN 'École Ibn Rochd'
    WHEN nom_ar LIKE '%ابن سينا%'     THEN 'École Ibn Sina'
    WHEN nom_ar LIKE '%ابن باديس%'    THEN 'École Ibn Badis'
    WHEN nom_ar LIKE '%ابن خلدون%'    THEN 'École Ibn Khaldoun'
    WHEN nom_ar LIKE '%الثورة%'       THEN 'École de la Révolution'
END,
translation_status = 'auto'
WHERE nom_fr IS NULL AND (
    nom_ar LIKE '%السلام%' OR nom_ar LIKE '%النصر%' OR nom_ar LIKE '%الأمل%' OR
    nom_ar LIKE '%النور%'  OR nom_ar LIKE '%الفجر%' OR nom_ar LIKE '%الوحدة%' OR
    nom_ar LIKE '%الاستقلال%' OR nom_ar LIKE '%التحرير%' OR nom_ar LIKE '%العلم%' OR
    nom_ar LIKE '%المعرفة%' OR nom_ar LIKE '%الشباب%' OR nom_ar LIKE '%الوطن%' OR
    nom_ar LIKE '%التضامن%' OR nom_ar LIKE '%ابن رشد%' OR nom_ar LIKE '%ابن سينا%' OR
    nom_ar LIKE '%ابن باديس%' OR nom_ar LIKE '%ابن خلدون%' OR nom_ar LIKE '%الثورة%'
);

-- Tout le reste → needs_review
UPDATE schools_staging SET
    nom_fr = REPLACE(nom_ar, 'إبتدائية', 'École'),
    translation_status = 'needs_review'
WHERE nom_fr IS NULL;


-- ============================================================
-- ÉTAPE 6 : Insérer les communes dans districts
-- ============================================================
INSERT INTO districts (region_id, code, name_local, name_fr)
SELECT DISTINCT r.id, s.commune_code, s.commune_name, s.commune_name
FROM schools_staging s
JOIN regions r ON CAST(r.code AS VARCHAR) = LPAD(s.wilaya_code, 2, '0')
    AND r.country_code = 'DZ'
ON CONFLICT DO NOTHING;


-- ============================================================
-- ÉTAPE 7 : Import final dans la table schools
-- ============================================================
INSERT INTO schools (district_id, code, name_local, name_fr, type, translation_status, source)
SELECT
    d.id,
    s.ecole_code,
    s.nom_ar,
    s.nom_fr,
    s.type_ecole,
    s.translation_status,
    'awlyaa.education.dz'
FROM schools_staging s
JOIN districts d ON d.code = s.commune_code
JOIN regions r ON r.id = d.region_id
    AND r.country_code = 'DZ'
    AND CAST(r.code AS VARCHAR) = LPAD(s.wilaya_code, 2, '0')
ON CONFLICT (code) DO UPDATE SET
    name_local = EXCLUDED.name_local,
    name_fr = EXCLUDED.name_fr,
    type = EXCLUDED.type,
    translation_status = EXCLUDED.translation_status,
    updated_at = NOW();


-- ============================================================
-- ÉTAPE 8 : Vérification finale
-- ============================================================
SELECT
    r.name_fr AS wilaya,
    COUNT(*) AS total_ecoles,
    SUM(CASE WHEN s.type = 1 THEN 1 ELSE 0 END) AS publiques,
    SUM(CASE WHEN s.type = 2 THEN 1 ELSE 0 END) AS privees,
    SUM(CASE WHEN s.translation_status = 'auto' THEN 1 ELSE 0 END) AS traduites_auto
FROM schools s
JOIN districts d ON s.district_id = d.id
JOIN regions r ON d.region_id = r.id
WHERE r.country_code = 'DZ'
GROUP BY r.name_fr
ORDER BY total_ecoles DESC;

-- ============================================================
-- NETTOYAGE (décommenter après validation)
-- ============================================================
-- DROP TABLE schools_staging;
