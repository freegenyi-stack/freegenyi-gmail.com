-- ============================================================
-- FreeGeny — Schéma PostgreSQL
-- Base de données : Établissements Primaires
-- Version : 1.0 | Niveau : Primaire uniquement
-- ============================================================

-- Extensions utiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ============================================================
-- 1. PAYS
-- ============================================================
CREATE TABLE countries (
    id              SERIAL PRIMARY KEY,
    code            CHAR(2)      NOT NULL UNIQUE,  -- ISO 3166 : 'DZ', 'MA', 'FR'
    name_fr         VARCHAR(100) NOT NULL,
    name_ar         VARCHAR(100),
    name_en         VARCHAR(100) NOT NULL,
    name_local      VARCHAR(100),                  -- nom dans la langue locale du pays
    flag_emoji      CHAR(10),                      -- '🇩🇿'
    langs           VARCHAR(20)  NOT NULL,          -- 'ar,fr' | 'fr' | 'en'
    is_active       BOOLEAN      DEFAULT FALSE,     -- TRUE quand les données sont prêtes
    created_at      TIMESTAMP    DEFAULT NOW()
);

-- Algérie en premier
INSERT INTO countries (code, name_fr, name_ar, name_en, name_local, flag_emoji, langs, is_active)
VALUES ('DZ', 'Algérie', 'الجزائر', 'Algeria', 'الجزائر', '🇩🇿', 'ar,fr', TRUE);


-- ============================================================
-- 2. RÉGIONS / WILAYAS
-- ============================================================
CREATE TABLE regions (
    id              SERIAL PRIMARY KEY,
    country_code    CHAR(2)      NOT NULL REFERENCES countries(code) ON DELETE CASCADE,
    code            VARCHAR(10)  NOT NULL,          -- '06'
    name_local      VARCHAR(200) NOT NULL,          -- 'بجاية'
    name_fr         VARCHAR(200),                   -- 'Béjaïa'
    name_en         VARCHAR(200),
    UNIQUE (country_code, code)
);

CREATE INDEX idx_regions_country ON regions(country_code);

-- Wilayas algériennes (58)
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
('DZ','58','المنيعة','El Meniaa','El Meniaa');


-- ============================================================
-- 3. COMMUNES / DISTRICTS
-- ============================================================
CREATE TABLE districts (
    id              SERIAL PRIMARY KEY,
    region_id       INTEGER      NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    code            VARCHAR(10)  NOT NULL,          -- '0601'
    name_local      VARCHAR(200) NOT NULL,          -- 'بجاية'
    name_fr         VARCHAR(200),                   -- 'Béjaïa'
    name_en         VARCHAR(200),
    UNIQUE (region_id, code)
);

CREATE INDEX idx_districts_region ON districts(region_id);

-- Note : les communes seront importées depuis le CSV extrait d'awlyaa
-- Script d'import fourni séparément (import_communes_dz.sql)


-- ============================================================
-- 4. ÉTABLISSEMENTS PRIMAIRES
-- ============================================================
CREATE TABLE schools (
    id              SERIAL PRIMARY KEY,
    uuid            UUID         DEFAULT uuid_generate_v4() UNIQUE,  -- ID public sécurisé
    district_id     INTEGER      NOT NULL REFERENCES districts(id) ON DELETE CASCADE,

    -- Identification
    code            VARCHAR(20)  UNIQUE,            -- '06011001' (code officiel)
    name_local      VARCHAR(400) NOT NULL,          -- nom en langue locale (arabe pour DZ)
    name_fr         VARCHAR(400),                   -- traduction française
    name_en         VARCHAR(400),                   -- traduction anglaise

    -- Classification
    type            SMALLINT     NOT NULL DEFAULT 1, -- 1=public, 2=privé
    is_active       BOOLEAN      DEFAULT TRUE,

    -- Géolocalisation (à enrichir progressivement)
    lat             DECIMAL(10,7),
    lng             DECIMAL(10,7),

    -- Métadonnées
    source          VARCHAR(100) DEFAULT 'awlyaa.education.dz',
    created_at      TIMESTAMP    DEFAULT NOW(),
    updated_at      TIMESTAMP    DEFAULT NOW()
);

-- Index de recherche
CREATE INDEX idx_schools_district    ON schools(district_id);
CREATE INDEX idx_schools_type        ON schools(type);
CREATE INDEX idx_schools_active      ON schools(is_active);
CREATE INDEX idx_schools_geo         ON schools(lat, lng) WHERE lat IS NOT NULL;

-- Index full-text pour recherche par nom
CREATE INDEX idx_schools_name_fts    ON schools
    USING gin(to_tsvector('arabic', name_local));

-- Trigger mise à jour automatique updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_schools_updated_at
    BEFORE UPDATE ON schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- 5. VUE PRATIQUE — schools_full
-- (pour les requêtes API sans jointures manuelles)
-- ============================================================
CREATE VIEW schools_full AS
SELECT
    s.uuid,
    s.code,
    s.name_local,
    s.name_fr,
    s.name_en,
    s.type,
    CASE s.type WHEN 1 THEN 'public' WHEN 2 THEN 'privé' ELSE 'autre' END AS type_label,
    s.lat,
    s.lng,
    s.is_active,
    d.code        AS district_code,
    d.name_local  AS district_name_local,
    d.name_fr     AS district_name_fr,
    r.code        AS region_code,
    r.name_local  AS region_name_local,
    r.name_fr     AS region_name_fr,
    c.code        AS country_code,
    c.name_fr     AS country_name_fr,
    c.flag_emoji
FROM schools       s
JOIN districts     d ON s.district_id = d.id
JOIN regions       r ON d.region_id   = r.id
JOIN countries     c ON r.country_code = c.code;


-- ============================================================
-- 6. REQUÊTES API TYPES
-- (exemples pour ton backend Next.js / Node)
-- ============================================================

-- Recherche écoles par commune (pour le dropdown parent)
-- GET /api/schools?district=0601&country=DZ
/*
SELECT uuid, name_local, name_fr, type, type_label
FROM schools_full
WHERE district_code = '0601'
  AND country_code  = 'DZ'
  AND is_active     = TRUE
ORDER BY name_local;
*/

-- Recherche par nom (autocomplete)
-- GET /api/schools/search?q=ابن&country=DZ
/*
SELECT uuid, name_local, name_fr, district_name_fr, region_name_fr
FROM schools_full
WHERE country_code = 'DZ'
  AND is_active    = TRUE
  AND (
    name_local ILIKE '%ابن%'
    OR unaccent(name_fr) ILIKE unaccent('%ibn%')
  )
LIMIT 20;
*/

-- Stats par wilaya
/*
SELECT region_name_fr, COUNT(*) as nb_ecoles,
       SUM(CASE WHEN type=1 THEN 1 ELSE 0 END) as publiques,
       SUM(CASE WHEN type=2 THEN 1 ELSE 0 END) as privees
FROM schools_full
WHERE country_code = 'DZ'
GROUP BY region_name_fr
ORDER BY nb_ecoles DESC;
*/


-- ============================================================
-- 7. IMPORT CSV — commande prête
-- ============================================================
-- Après avoir importé les districts depuis le CSV awlyaa :
/*
\COPY schools_staging(code, name_local, district_code, type)
FROM 'ecoles_primaires_algerie.csv'
DELIMITER ',' CSV HEADER ENCODING 'UTF8';

INSERT INTO schools (district_id, code, name_local, type, source)
SELECT d.id, s.code, s.name_local, s.type, 'awlyaa.education.dz'
FROM schools_staging s
JOIN districts d ON d.code = s.district_code
ON CONFLICT (code) DO UPDATE
  SET name_local = EXCLUDED.name_local,
      updated_at = NOW();
*/
