"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Lock, ArrowRight, ArrowLeft, Sparkles, Eye, EyeOff, Smartphone, RefreshCcw, ShieldCheck, Users, ChevronDown, School, Globe, MapPin, UserCheck, Heart, Target } from "lucide-react";
import { checkUserAvailability, registerEliteAction } from "@/lib/actions/auth_elite";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { loadCaptchaEnginge, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
import { useRegion } from "@/context/RegionContext";
import { REGIONS } from "@/constants/regions";
import Lottie from "lottie-react";
import chatCurieux from "@/../public/assets/animations/chat_curieux.json";
import SchoolPicker from "@/components/SchoolPicker";

// Font import for the manual look
const handwrittenFont = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
`;

const COUNTRIES = [
    { name: 'Algérie / الجزائر', code: 'DZ', flag: '🇩🇿', dial: '+213' },
    { name: 'France', code: 'FR', flag: '🇫🇷', dial: '+33' },
    { name: 'Australia', code: 'AU', flag: '🇦🇺', dial: '+61' },
    { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', dial: '+44' },
    { name: 'United States', code: 'US', flag: '🇺🇸', dial: '+1' },
    { name: 'Canada', code: 'CA', flag: '🇨🇦', dial: '+1' },
    { name: 'New Zealand', code: 'NZ', flag: '🇳🇿', dial: '+64' },
    { name: 'Ireland', code: 'IE', flag: '🇮🇪', dial: '+353' },
    { name: 'Denmark / Danmark', code: 'DK', flag: '🇩🇰', dial: '+45' },
    { name: 'Sweden / Sverige', code: 'SE', flag: '🇸🇪', dial: '+46' },
    { name: 'Norway / Norge', code: 'NO', flag: '🇳🇴', dial: '+47' },
    { name: 'Finland / Suomi', code: 'FI', flag: '🇫🇮', dial: '+358' },
    { name: 'Netherlands / Nederland', code: 'NL', flag: '🇳🇱', dial: '+31' },
    { name: 'Portugal', code: 'PT', flag: '🇵🇹', dial: '+351' },
    { name: 'Poland / Polska', code: 'PL', flag: '🇵🇱', dial: '+48' },
];

const dict = {
    ar: {
        vosAcces: "بيانات الدخول",
        lAlliance: "الشريك التعليمي",
        sonProfil: "ملف الطفل",
        stepText: "الشاشة {step} من 3",
        chooseRole: "اختر دورك",
        parentTab: "الوالدين",
        schoolTab: "المدرسة",
        ngoTab: "الجمعيات",
        instantGoogle: "دخول سريع مع جوجل",
        orEmail: "أو عبر البريد الإلكتروني اليدوي",
        fullNameParent: "الاسم الكامل",
        fullNameSchool: "اسم المؤسسة",
        fullNameNgo: "اسم الجمعية",
        fullNamePlaceholderParent: "مثال: مراد بلعيد",
        fullNamePlaceholderSchool: "مثال: مدرسة النجاح الابتدائية",
        fullNamePlaceholderNgo: "مثال: الهلال الأحمر الجزائري",
        username: "اسم المستخدم",
        usernamePlaceholder: "mourad_213",
        email: "البريد الإلكتروني",
        emailPlaceholder: "mourad@gmail.com",
        phone: "الهاتف",
        phonePlaceholder: "550 12 34 56",
        password: "كلمة المرور",
        passwordPlaceholder: "••••••••",
        confirmPassword: "تأكيد كلمة المرور",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "تطابق تام",
        matchError: "كلمات المرور غير متطابقة",
        eightChars: "8 أحرف",
        uppercase: "حرف كبير",
        number: "رقم",
        specialChar: "رمز خاص",
        next: "التالي",
        previous: "السابق",
        titleParentStep1: "إيقاظ",
        titleParentStep1Orange: "النخبة",
        titleSchoolStep1: "إيقاظ",
        titleSchoolStep1Orange: "النخبة",
        titleNgoStep1: "إيقاظ",
        titleNgoStep1Orange: "النخبة",
        subStep1Parent: "كن مهندس مصير استثنائي لأبنائك.",
        subStep1School: "شريك تعليمي متميز لنخبة المستقبل.",
        subStep1Ngo: "معاً نبني غداً أفضل لأطفالنا.",
        // Left Pane Titles/Subs
        leftTitle1: "إيقاظ",
        leftTitle1Orange: "النخبة",
        leftSub1: "كن مهندس مصير استثنائي لأبنائك.",
        leftTitle2: "تناغم",
        leftTitle2Orange: "الشركاء",
        leftSub2: "وثّق الاتحاد لانطلاقة مشتركة لأبنائك.",
        leftTitle3: "صعود",
        leftTitle3Orange: "العبقرية",
        leftSub3: "أنِر طريق صعودهم نحو التميز.",
        // Step 2 Parent
        allyTitle: "شريكك التعليمي",
        allyDesc: "التربية عمل جماعي. ادعُ الشخص الذي يدعمك (الزوج، الابن الأكبر، العم...) لتنسيق جهودكما.",
        allyNamePlaceholder: "مثال: مراد أو نادية",
        allyEmailPlaceholder: "البريد الإلكتروني لشريكك (اختياري)",
        // Step 2 School
        schoolIdentityTitle: "هوية المؤسسة",
        schoolIdentityDesc: "قم بتهيئة المعلومات الرسمية لمدرستك الابتدائية لتأكيد شراكتنا التعليمية.",
        privateSchool: "مدرسة خاصة",
        publicSchool: "مدرسة عمومية",
        schoolAddressPlaceholder: "العنوان الكامل للمقر",
        schoolManagerPlaceholder: "اسم المسؤول / المدير",
        // Step 2 NGO
        ngoTitle: "الالتزام التضامني",
        ngoDesc: "حدد مجال مهمتك الإنسانية لتحقيق تآزر مثالي.",
        ngoDomainPlaceholder: "مجال العمل",
        ngoDomainEducation: "التعليم والدعم",
        ngoDomainSocial: "الإدماج الاجتماعي",
        ngoDomainCulture: "الثقافة والتوعية",
        ngoDomainHumanitarian: "العمل الإنساني الشامل",
        ngoAddressPlaceholder: "عنوان المقر الاجتماعي",
        ngoManagerPlaceholder: "المسؤول عن الجمعية",
        // Step 3 Parent
        childFirstName: "اسم الطفل الأول",
        childFirstNamePlaceholder: "مثال: ياسمين أو آدم",
        childAge: "العمر",
        childAgePlaceholder: "مثال: 8",
        childLevel: "المستوى",
        childSchool: "المدرسة / المؤسسة",
        childSchoolPlaceholder: "ابحث عن المدرسة...",
        securityCheck: "التحقق الأمني",
        securityCheckDesc: "نظام حماية ضد الروبوتات",
        securityCodePlaceholder: "أدخل الرمز",
        finalizeButton: "إنهاء التسجيل",
        registerSchoolButton: "تسجيل المؤسسة",
        registerNgoButton: "تسجيل الجمعية",
        termsText: "بالاستمرار، فإنك توافق على الشروط وسياسة الخصوصية الخاصة بنا.",
        alreadyHaveAccount: "لديك حساب بالفعل؟",
        loginLink: "تسجيل الدخول",
        // Step 3 School
        digitalPresence: "الحضور الرقمي",
        digitalPresencePlaceholderSchool: "الموقع الإلكتروني أو صفحة الفيسبوك (مثال: fb.com/ecole...)",
        schoolDimension: "حجم المؤسسة",
        classesCountPlaceholder: "عدد الفصول الابتدائية",
        instCheck: "التحقق المؤسسي",
        instCheckDesc: "نظام حماية مؤسسي آمن",
        // Step 3 NGO
        digitalPresencePlaceholderNgo: "الموقع الإلكتروني أو الحساب الاجتماعي",
        beneficiariesCount: "عدد المستفيدين",
        beneficiariesPlaceholder: "عدد الأطفال الذين يتم دعمهم",
        orgCheck: "التحقق من المنظمة",
        orgCheckDesc: "تم تفعيل حماية الجمعيات",
        // Error messages
        errNameEmpty: "يرجى إدخال الاسم الكامل",
        errUsernameEmpty: "يرجى اختيار اسم مستخدم",
        errUsernameTaken: "اسم المستخدم مستخدم بالفعل",
        errEmailEmpty: "يرجى إدخال البريد الإلكتروني",
        errPasswordEmpty: "يرجى إدخال كلمة المرور",
        errPasswordsDoNotMatch: "كلمتا المرور غير متطابقتين",
        errCaptchaIncorrect: "رمز التحقق غير صحيح",
        welcomeTitle: "مرحباً بك في النخبة!"
    },
    en: {
        vosAcces: "Access Info",
        lAlliance: "The Ally",
        sonProfil: "Child Profile",
        stepText: "Screen {step} of 3",
        chooseRole: "Choose your role",
        parentTab: "Parents",
        schoolTab: "School",
        ngoTab: "NGO",
        instantGoogle: "Instant Access with Google",
        orEmail: "Or via manual email",
        fullNameParent: "Full Name",
        fullNameSchool: "School Name",
        fullNameNgo: "Organization Name",
        fullNamePlaceholderParent: "e.g. John Doe",
        fullNamePlaceholderSchool: "e.g. Sunrise Primary School",
        fullNamePlaceholderNgo: "e.g. Red Cross Society",
        username: "Username",
        usernamePlaceholder: "john_doe",
        email: "Email",
        emailPlaceholder: "john@example.com",
        phone: "Phone",
        phonePlaceholder: "412 345 678",
        password: "Password",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Confirm Password",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "Perfect match",
        matchError: "Passwords do not match",
        eightChars: "8 Chars",
        uppercase: "Uppercase",
        number: "Number",
        specialChar: "Special Chars",
        next: "Next",
        previous: "Back",
        titleParentStep1: "Awakening of",
        titleParentStep1Orange: "the Elite",
        titleSchoolStep1: "Awakening of",
        titleSchoolStep1Orange: "the Elite",
        titleNgoStep1: "Awakening of",
        titleNgoStep1Orange: "the Elite",
        subStep1Parent: "Become the architect of an exceptional destiny.",
        subStep1School: "A distinguished educational partner for the elite.",
        subStep1Ngo: "Together we build a better tomorrow for children.",
        // Left Pane Titles/Subs
        leftTitle1: "Awakening of",
        leftTitle1Orange: "the Elite",
        leftSub1: "Become the architect of an exceptional destiny.",
        leftTitle2: "Harmony of",
        leftTitle2Orange: "Alliances",
        leftSub2: "Seal the union for a shared flight.",
        leftTitle3: "Rise of",
        leftTitle3Orange: "Genius",
        leftSub3: "Illuminate the path of their ascension.",
        // Step 2 Parent
        allyTitle: "Your Educational Ally",
        allyDesc: "Education is a team sport. Invite the person who supports you (spouse, eldest, uncle...) to synchronize your efforts.",
        allyNamePlaceholder: "e.g. Sarah or Michael",
        allyEmailPlaceholder: "Email of your ally (Optional)",
        // Step 2 School
        schoolIdentityTitle: "School Identity",
        schoolIdentityDesc: "Configure your primary school's official information to seal our educational partnership.",
        privateSchool: "Private School",
        publicSchool: "Public School",
        schoolAddressPlaceholder: "Full headquarters address",
        schoolManagerPlaceholder: "Manager / Principal Name",
        // Step 2 NGO
        ngoTitle: "Social Engagement",
        ngoDesc: "Define the scope of your humanitarian mission for perfect synergy.",
        ngoDomainPlaceholder: "Domain of Action",
        ngoDomainEducation: "Education & Support",
        ngoDomainSocial: "Social Inclusion",
        ngoDomainCulture: "Culture & Awareness",
        ngoDomainHumanitarian: "Global Humanitarian",
        ngoAddressPlaceholder: "Headquarters Address",
        ngoManagerPlaceholder: "NGO Manager Name",
        // Step 3 Parent
        childFirstName: "Child's First Name",
        childFirstNamePlaceholder: "e.g. Emily or Ethan",
        childAge: "Age",
        childAgePlaceholder: "e.g. 8",
        childLevel: "Grade/Level",
        childSchool: "School / Institution",
        childSchoolPlaceholder: "Search school...",
        securityCheck: "Security Verification",
        securityCheckDesc: "Secured Anti-Robot System",
        securityCodePlaceholder: "Enter code",
        finalizeButton: "Finalize Registration",
        registerSchoolButton: "Register School",
        registerNgoButton: "Register NGO",
        termsText: "By continuing, you agree to our terms and privacy policy.",
        alreadyHaveAccount: "Already have an account?",
        loginLink: "Login",
        // Step 3 School
        digitalPresence: "Digital Presence",
        digitalPresencePlaceholderSchool: "Website or Facebook page (e.g. fb.com/school...)",
        schoolDimension: "School Size",
        classesCountPlaceholder: "Number of primary classes",
        instCheck: "Institutional Verification",
        instCheckDesc: "Secured Institutional System",
        // Step 3 NGO
        digitalPresencePlaceholderNgo: "Website or Social Profile",
        beneficiariesCount: "Number of Beneficiaries",
        beneficiariesPlaceholder: "Estimated number of supported children",
        orgCheck: "Organization Verification",
        orgCheckDesc: "Humanitarian Protection Active",
        // Error messages
        errNameEmpty: "Please enter your full name",
        errUsernameEmpty: "Please choose a username",
        errUsernameTaken: "Username is already taken",
        errEmailEmpty: "Please enter your email",
        errPasswordEmpty: "Please enter a password",
        errPasswordsDoNotMatch: "Passwords do not match",
        errCaptchaIncorrect: "Incorrect security code",
        welcomeTitle: "Welcome to the Elite!"
    },
    fr: {
        vosAcces: "Vos Accès",
        lAlliance: "L'Alliance",
        sonProfil: "Son Profil",
        stepText: "Écran {step} sur 3",
        chooseRole: "Choisissez votre rôle",
        parentTab: "Parents",
        schoolTab: "École",
        ngoTab: "ONG",
        instantGoogle: "Accès Instantané avec Google",
        orEmail: "Ou via email manuel",
        fullNameParent: "Nom Complet",
        fullNameSchool: "Nom de l'Établissement",
        fullNameNgo: "Nom de l'Organisation",
        fullNamePlaceholderParent: "Ex: Sophie Martin",
        fullNamePlaceholderSchool: "Ex: École Primaire Les Étoiles",
        fullNamePlaceholderNgo: "Ex: Croix-Rouge Française",
        username: "Pseudo",
        usernamePlaceholder: "sophie_fr",
        email: "E-mail",
        emailPlaceholder: "sophie@gmail.com",
        phone: "Téléphone",
        phonePlaceholder: "06 12 34 56 78",
        password: "Mot de passe",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Confirmation",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "Correspondance parfaite",
        matchError: "Mots de passe différents",
        eightChars: "8 Caract.",
        uppercase: "Majuscule",
        number: "Chiffre",
        specialChar: "Spécial",
        next: "Suivant",
        previous: "Précédent",
        titleParentStep1: "L'Éveil de",
        titleParentStep1Orange: "l'Élite",
        titleSchoolStep1: "L'Éveil de",
        titleSchoolStep1Orange: "l'Élite",
        titleNgoStep1: "L'Éveil de",
        titleNgoStep1Orange: "l'Élite",
        subStep1Parent: "Devenez l'architecte d'un destin d'exception.",
        subStep1School: "Un partenaire éducatif de choix pour l'élite.",
        subStep1Ngo: "Ensemble, bâtissons un avenir meilleur pour les enfants.",
        // Left Pane Titles/Subs
        leftTitle1: "L'Éveil de",
        leftTitle1Orange: "l'Élite",
        leftSub1: "Devenez l'architecte d'un destin d'exception.",
        leftTitle2: "L'Harmonie des",
        leftTitle2Orange: "Alliances",
        leftSub2: "Scellez l'union pour un envol partagé.",
        leftTitle3: "L'Essor du",
        leftTitle3Orange: "Génie",
        leftSub3: "Illuminez le chemin de son ascension.",
        // Step 2 Parent
        allyTitle: "Votre Allié Éducatif",
        allyDesc: "L'éducation est un sport d'équipe. Invitez la personne qui vous épaule (conjoint, aîné, oncle...) pour synchroniser vos efforts.",
        allyNamePlaceholder: "Ex: Sophie ou Thomas",
        allyEmailPlaceholder: "Email de votre allié (Optionnel)",
        // Step 2 School
        schoolIdentityTitle: "Identité de l'Établissement",
        schoolIdentityDesc: "Configurez les informations officielles de votre école primaire pour sceller notre partenariat éducatif.",
        privateSchool: "École Privée",
        publicSchool: "École Publique",
        schoolAddressPlaceholder: "Adresse complète de l'établissement",
        schoolManagerPlaceholder: "Nom du Directeur / Directrice",
        // Step 2 NGO
        ngoTitle: "Engagement Solidaire",
        ngoDesc: "Définissez le périmètre de votre mission humanitaire pour une synergie parfaite.",
        ngoDomainPlaceholder: "Domaine d'Action",
        ngoDomainEducation: "Éducation & Soutien",
        ngoDomainSocial: "Inclusion Sociale",
        ngoDomainCulture: "Culture & Éveil",
        ngoDomainHumanitarian: "Humanitaire Global",
        ngoAddressPlaceholder: "Adresse du Siège Social",
        ngoManagerPlaceholder: "Responsable de l'ONG",
        // Step 3 Parent
        childFirstName: "Prénom de l'enfant",
        childFirstNamePlaceholder: "Ex: Chloé ou Lucas",
        childAge: "Âge",
        childAgePlaceholder: "Ex: 8",
        childLevel: "Niveau",
        childSchool: "Établissement",
        childSchoolPlaceholder: "Rechercher l'école...",
        securityCheck: "Vérification de Sécurité",
        securityCheckDesc: "Système Anti-Robot Sécurisé",
        securityCodePlaceholder: "Entrez le code",
        finalizeButton: "Finaliser l'Inscription",
        registerSchoolButton: "Enregistrer l'Établissement",
        registerNgoButton: "Enregistrer l'Organisation",
        termsText: "En continuant, vous acceptez nos conditions et notre politique de confidentialité.",
        alreadyHaveAccount: "Vous avez déjà un compte ?",
        loginLink: "Connexion",
        // Step 3 School
        digitalPresence: "Présence Digitale",
        digitalPresencePlaceholderSchool: "Site Web ou Page Facebook (Ex: fb.com/ecole...)",
        schoolDimension: "Dimension de l'École",
        classesCountPlaceholder: "Nombre de classes primaires",
        instCheck: "Vérification Institutionnelle",
        instCheckDesc: "Accès Institutionnel Sécurisé",
        // Step 3 NGO
        digitalPresencePlaceholderNgo: "Site Web ou Profil Social",
        beneficiariesCount: "Nombre de Bénéficiaires",
        beneficiariesPlaceholder: "Estimation des enfants soutenus",
        orgCheck: "Vérification de l'Organisation",
        orgCheckDesc: "Protection Humanitaire Activée",
        // Error messages
        errNameEmpty: "Champ nom complet non rempli",
        errUsernameEmpty: "Veuillez choisir un pseudo.",
        errUsernameTaken: "pseudo déjà existant",
        errEmailEmpty: "Veuillez saisir votre E-mail.",
        errPasswordEmpty: "Veuillez saisir un mot de passe.",
        errPasswordsDoNotMatch: "Les mots de passe ne correspondent pas.",
        errCaptchaIncorrect: "Code de sécurité incorrect.",
        welcomeTitle: "Bienvenue dans l'Élite !"
    },
    // ─── CANADA FRENCH ───────────────────────────────────────────────────────────
    "ca-fr": {
        vosAcces: "Vos Accès",
        lAlliance: "L'Alliance",
        sonProfil: "Son Profil",
        stepText: "Étape {step} sur 3",
        chooseRole: "Choisissez votre rôle",
        parentTab: "Parents",
        schoolTab: "École",
        ngoTab: "OSBL",
        instantGoogle: "Accès Instantané avec Google",
        orEmail: "Ou via courriel",
        fullNameParent: "Nom Complet",
        fullNameSchool: "Nom de l'École",
        fullNameNgo: "Nom de l'Organisme",
        fullNamePlaceholderParent: "Ex: Jean Tremblay ou Marie Dupont",
        fullNamePlaceholderSchool: "Ex: École Primaire Les Érables",
        fullNamePlaceholderNgo: "Ex: Centraide du Québec",
        username: "Identifiant",
        usernamePlaceholder: "jean_ca",
        email: "Courriel",
        emailPlaceholder: "jean.tremblay@gmail.com",
        phone: "Téléphone",
        phonePlaceholder: "514 123 4567",
        password: "Mot de passe",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Confirmation",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "Correspondance parfaite",
        matchError: "Mots de passe différents",
        eightChars: "8 Caract.",
        uppercase: "Majuscule",
        number: "Chiffre",
        specialChar: "Spécial",
        next: "Suivant",
        previous: "Précédent",
        titleParentStep1: "L'Éveil de",
        titleParentStep1Orange: "l'Élite",
        titleSchoolStep1: "L'Éveil de",
        titleSchoolStep1Orange: "l'Élite",
        titleNgoStep1: "L'Éveil de",
        titleNgoStep1Orange: "l'Élite",
        subStep1Parent: "Devenez l'architecte d'un avenir exceptionnel pour vos enfants.",
        subStep1School: "Un partenaire éducatif de premier plan pour la relève.",
        subStep1Ngo: "Ensemble, bâtissons un meilleur avenir pour les enfants du Canada.",
        leftTitle1: "L'Éveil de",
        leftTitle1Orange: "l'Élite",
        leftSub1: "Devenez l'architecte d'un avenir exceptionnel.",
        leftTitle2: "L'Harmonie des",
        leftTitle2Orange: "Alliances",
        leftSub2: "Unissez vos forces pour un envol commun.",
        leftTitle3: "L'Essor du",
        leftTitle3Orange: "Génie",
        leftSub3: "Illuminez le chemin de leur réussite.",
        // Step 2 Parent
        allyTitle: "Votre Allié Éducatif",
        allyDesc: "L'éducation est l'affaire de tous. Invitez la personne qui vous soutient (conjoint(e), grand-parent, tuteur...) pour coordonner vos efforts.",
        allyNamePlaceholder: "Ex: Marie ou Pierre",
        allyEmailPlaceholder: "Courriel de votre allié (Facultatif)",
        // Step 2 School
        schoolIdentityTitle: "Identité de l'École",
        schoolIdentityDesc: "Configurez les informations officielles de votre école pour confirmer notre partenariat éducatif.",
        privateSchool: "École Privée",
        publicSchool: "École Publique",
        schoolAddressPlaceholder: "Adresse complète de l'école (Province, Ville)",
        schoolManagerPlaceholder: "Nom du Directeur / Directrice",
        // Step 2 NGO
        ngoTitle: "Engagement Communautaire",
        ngoDesc: "Définissez la portée de votre mission pour une synergie optimale.",
        ngoDomainPlaceholder: "Secteur d'activité",
        ngoDomainEducation: "Éducation & Soutien scolaire",
        ngoDomainSocial: "Inclusion Sociale",
        ngoDomainCulture: "Culture & Sensibilisation",
        ngoDomainHumanitarian: "Action Humanitaire",
        ngoAddressPlaceholder: "Adresse du siège (Province, Ville)",
        ngoManagerPlaceholder: "Responsable de l'organisme",
        // Step 3 Parent
        childFirstName: "Prénom de l'enfant",
        childFirstNamePlaceholder: "Ex: Émilie ou Mathieu",
        childAge: "Âge",
        childAgePlaceholder: "Ex: 8",
        childLevel: "Niveau scolaire",
        childSchool: "École",
        childSchoolPlaceholder: "Rechercher une école...",
        securityCheck: "Vérification de Sécurité",
        securityCheckDesc: "Système Anti-Robot Sécurisé",
        securityCodePlaceholder: "Entrez le code",
        finalizeButton: "Finaliser l'Inscription",
        registerSchoolButton: "Inscrire l'École",
        registerNgoButton: "Inscrire l'Organisme",
        termsText: "En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.",
        alreadyHaveAccount: "Vous avez déjà un compte ?",
        loginLink: "Connexion",
        // Step 3 School
        digitalPresence: "Présence Numérique",
        digitalPresencePlaceholderSchool: "Site web ou page Facebook (Ex: fb.com/ecole...)",
        schoolDimension: "Taille de l'École",
        classesCountPlaceholder: "Nombre de classes primaires",
        instCheck: "Vérification Institutionnelle",
        instCheckDesc: "Accès Institutionnel Sécurisé",
        // Step 3 NGO
        digitalPresencePlaceholderNgo: "Site Web ou Profil sur les réseaux sociaux",
        beneficiariesCount: "Nombre de Bénéficiaires",
        beneficiariesPlaceholder: "Estimation des enfants soutenus",
        orgCheck: "Vérification de l'Organisme",
        orgCheckDesc: "Protection Humanitaire Activée",
        // Error messages
        errNameEmpty: "Veuillez saisir votre nom complet.",
        errUsernameEmpty: "Veuillez choisir un identifiant.",
        errUsernameTaken: "Cet identifiant est déjà utilisé.",
        errEmailEmpty: "Veuillez saisir votre courriel.",
        errPasswordEmpty: "Veuillez saisir un mot de passe.",
        errPasswordsDoNotMatch: "Les mots de passe ne correspondent pas.",
        errCaptchaIncorrect: "Code de sécurité incorrect.",
        welcomeTitle: "Bienvenue dans l'Élite !"
    },
    // ─── CANADA ENGLISH ──────────────────────────────────────────────────────────
    "ca-en": {
        vosAcces: "Account Info",
        lAlliance: "Your Ally",
        sonProfil: "Child Profile",
        stepText: "Step {step} of 3",
        chooseRole: "Choose your role",
        parentTab: "Parents",
        schoolTab: "School",
        ngoTab: "Non-Profit",
        instantGoogle: "Quick Access with Google",
        orEmail: "Or via email",
        fullNameParent: "Full Name",
        fullNameSchool: "School Name",
        fullNameNgo: "Organization Name",
        fullNamePlaceholderParent: "e.g. Emily Johnson or Liam Smith",
        fullNamePlaceholderSchool: "e.g. Maple Leaf Elementary School",
        fullNamePlaceholderNgo: "e.g. United Way Canada",
        username: "Username",
        usernamePlaceholder: "emily_ca",
        email: "Email",
        emailPlaceholder: "emily.johnson@gmail.com",
        phone: "Phone",
        phonePlaceholder: "416 123 4567",
        password: "Password",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Confirm Password",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "Perfect match",
        matchError: "Passwords do not match",
        eightChars: "8 Chars",
        uppercase: "Uppercase",
        number: "Number",
        specialChar: "Special Char",
        next: "Next",
        previous: "Back",
        titleParentStep1: "Awakening of",
        titleParentStep1Orange: "the Elite",
        titleSchoolStep1: "Awakening of",
        titleSchoolStep1Orange: "the Elite",
        titleNgoStep1: "Awakening of",
        titleNgoStep1Orange: "the Elite",
        subStep1Parent: "Become the architect of an exceptional future for your children.",
        subStep1School: "A leading educational partner for Canada's next generation.",
        subStep1Ngo: "Together we build a better tomorrow for Canadian children.",
        leftTitle1: "Awakening of",
        leftTitle1Orange: "the Elite",
        leftSub1: "Become the architect of an exceptional future.",
        leftTitle2: "Harmony of",
        leftTitle2Orange: "Alliances",
        leftSub2: "Unite your strengths for a shared journey.",
        leftTitle3: "Rise of",
        leftTitle3Orange: "Genius",
        leftSub3: "Illuminate the path to their success.",
        // Step 2 Parent
        allyTitle: "Your Educational Ally",
        allyDesc: "Education is a team effort. Invite someone who supports you (partner, grandparent, guardian...) to coordinate your efforts.",
        allyNamePlaceholder: "e.g. Sarah or Michael",
        allyEmailPlaceholder: "Your ally's email (Optional)",
        // Step 2 School
        schoolIdentityTitle: "School Identity",
        schoolIdentityDesc: "Set up your school's official information to confirm our educational partnership.",
        privateSchool: "Private School",
        publicSchool: "Public School",
        schoolAddressPlaceholder: "Full address (Province, City, Postal Code)",
        schoolManagerPlaceholder: "Principal / Vice-Principal Name",
        // Step 2 NGO
        ngoTitle: "Community Engagement",
        ngoDesc: "Define your organization's mission scope for a perfect synergy.",
        ngoDomainPlaceholder: "Area of Focus",
        ngoDomainEducation: "Education & Academic Support",
        ngoDomainSocial: "Social Inclusion",
        ngoDomainCulture: "Culture & Awareness",
        ngoDomainHumanitarian: "Humanitarian Action",
        ngoAddressPlaceholder: "Organization address (Province, City)",
        ngoManagerPlaceholder: "Executive Director / Manager",
        // Step 3 Parent
        childFirstName: "Child's First Name",
        childFirstNamePlaceholder: "e.g. Emma or Noah",
        childAge: "Age",
        childAgePlaceholder: "e.g. 8",
        childLevel: "Grade / Level",
        childSchool: "School",
        childSchoolPlaceholder: "Search for a school...",
        securityCheck: "Security Check",
        securityCheckDesc: "Secured Anti-Robot System",
        securityCodePlaceholder: "Enter code",
        finalizeButton: "Complete Registration",
        registerSchoolButton: "Register School",
        registerNgoButton: "Register Organization",
        termsText: "By continuing, you agree to our terms of service and privacy policy.",
        alreadyHaveAccount: "Already have an account?",
        loginLink: "Log In",
        // Step 3 School
        digitalPresence: "Digital Presence",
        digitalPresencePlaceholderSchool: "Website or Facebook page (e.g. fb.com/school...)",
        schoolDimension: "School Size",
        classesCountPlaceholder: "Number of primary classes",
        instCheck: "Institutional Verification",
        instCheckDesc: "Secured Institutional System",
        // Step 3 NGO
        digitalPresencePlaceholderNgo: "Website or Social Media Profile",
        beneficiariesCount: "Number of Beneficiaries",
        beneficiariesPlaceholder: "Estimated number of supported children",
        orgCheck: "Organization Verification",
        orgCheckDesc: "Humanitarian Protection Active",
        // Error messages
        errNameEmpty: "Please enter your full name.",
        errUsernameEmpty: "Please choose a username.",
        errUsernameTaken: "This username is already taken.",
        errEmailEmpty: "Please enter your email.",
        errPasswordEmpty: "Please enter a password.",
        errPasswordsDoNotMatch: "Passwords do not match.",
        errCaptchaIncorrect: "Incorrect security code.",
        welcomeTitle: "Welcome to the Elite!"
    },
    // ─── ALGERIA FRENCH ──────────────────────────────────────────────────────────
    "dz-fr": {
        vosAcces: "Vos Accès",
        lAlliance: "L'Alliance",
        sonProfil: "Son Profil",
        stepText: "Écran {step} sur 3",
        chooseRole: "Choisissez votre rôle",
        parentTab: "Parents",
        schoolTab: "École",
        ngoTab: "ONG",
        instantGoogle: "Accès Instantané avec Google",
        orEmail: "Ou via email manuel",
        fullNameParent: "Nom Complet",
        fullNameSchool: "Nom de l'Établissement",
        fullNameNgo: "Nom de l'Organisation",
        fullNamePlaceholderParent: "Ex: Mourad Belaid",
        fullNamePlaceholderSchool: "Ex: École Primaire El-Nadjah",
        fullNamePlaceholderNgo: "Ex: Croissant Rouge Algérien",
        username: "Pseudo",
        usernamePlaceholder: "mourad_213",
        email: "E-mail",
        emailPlaceholder: "mourad@gmail.com",
        phone: "Téléphone",
        phonePlaceholder: "0550 12 34 56",
        password: "Mot de passe",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Confirmation",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "Correspondance parfaite",
        matchError: "Mots de passe différents",
        eightChars: "8 Caract.",
        uppercase: "Majuscule",
        number: "Chiffre",
        specialChar: "Spécial",
        next: "Suivant",
        previous: "Précédent",
        titleParentStep1: "L'Éveil de",
        titleParentStep1Orange: "l'Élite",
        titleSchoolStep1: "L'Éveil de",
        titleSchoolStep1Orange: "l'Élite",
        titleNgoStep1: "L'Éveil de",
        titleNgoStep1Orange: "l'Élite",
        subStep1Parent: "Devenez l'architecte d'un destin d'exception.",
        subStep1School: "Un partenaire éducatif de choix pour l'élite.",
        subStep1Ngo: "Ensemble, bâtissons un avenir meilleur pour les enfants.",
        leftTitle1: "L'Éveil de",
        leftTitle1Orange: "l'Élite",
        leftSub1: "Devenez l'architecte d'un destin d'exception.",
        leftTitle2: "L'Harmonie des",
        leftTitle2Orange: "Alliances",
        leftSub2: "Scellez l'union pour un envol partagé.",
        leftTitle3: "L'Essor du",
        leftTitle3Orange: "Génie",
        leftSub3: "Illuminez le chemin de son ascension.",
        allyTitle: "Votre Allié Éducatif",
        allyDesc: "L'éducation est un sport d'équipe. Invitez la personne qui vous épaule (conjoint, aîné, oncle...) pour synchroniser vos efforts.",
        allyNamePlaceholder: "Ex: Mourad ou Nadia",
        allyEmailPlaceholder: "Email de votre allié (Optionnel)",
        schoolIdentityTitle: "Identité de l'Établissement",
        schoolIdentityDesc: "Configurez les informations officielles de votre école primaire pour sceller notre partenariat éducatif.",
        privateSchool: "École Privée",
        publicSchool: "École Publique",
        schoolAddressPlaceholder: "Adresse complète du siège",
        schoolManagerPlaceholder: "Nom du Responsable / Directeur",
        ngoTitle: "Engagement Solidaire",
        ngoDesc: "Définissez le périmètre de votre mission humanitaire pour une synergie parfaite.",
        ngoDomainPlaceholder: "Domaine d'Action",
        ngoDomainEducation: "Éducation & Soutien",
        ngoDomainSocial: "Inclusion Sociale",
        ngoDomainCulture: "Culture & Éveil",
        ngoDomainHumanitarian: "Humanitaire Global",
        ngoAddressPlaceholder: "Adresse du Siège Social",
        ngoManagerPlaceholder: "Responsable de l'ONG",
        childFirstName: "Prénom de l'enfant",
        childFirstNamePlaceholder: "Ex: Yasmine ou Adam",
        childAge: "Âge",
        childAgePlaceholder: "Ex: 8",
        childLevel: "Niveau",
        childSchool: "Établissement",
        childSchoolPlaceholder: "Rechercher l'école...",
        securityCheck: "Vérification de Sécurité",
        securityCheckDesc: "Système Anti-Robot Sécurisé",
        securityCodePlaceholder: "Entrez le code",
        finalizeButton: "Finaliser l'Inscription",
        registerSchoolButton: "Enregistrer l'Établissement",
        registerNgoButton: "Enregistrer l'Organisation",
        termsText: "En continuant, vous acceptez nos conditions et notre politique de confidentialité.",
        alreadyHaveAccount: "Vous avez déjà un compte ?",
        loginLink: "Connexion",
        digitalPresence: "Présence Digitale",
        digitalPresencePlaceholderSchool: "Site Web ou Page Facebook (Ex: fb.com/ecole...)",
        schoolDimension: "Dimension de l'École",
        classesCountPlaceholder: "Nombre de classes primaires",
        instCheck: "Vérification Institutionnelle",
        instCheckDesc: "Accès Institutionnel Sécurisé",
        digitalPresencePlaceholderNgo: "Site Web ou Profil Social",
        beneficiariesCount: "Nombre de Bénéficiaires",
        beneficiariesPlaceholder: "Estimation des enfants soutenus",
        orgCheck: "Vérification de l'Organisation",
        orgCheckDesc: "Protection Humanitaire Activée",
        errNameEmpty: "Champ nom complet non rempli",
        errUsernameEmpty: "Veuillez choisir un pseudo.",
        errUsernameTaken: "pseudo déjà existant",
        errEmailEmpty: "Veuillez saisir votre E-mail.",
        errPasswordEmpty: "Veuillez saisir un mot de passe.",
        errPasswordsDoNotMatch: "Les mots de passe ne correspondent pas.",
        errCaptchaIncorrect: "Code de sécurité incorrect.",
        welcomeTitle: "Bienvenue dans l'Élite !"
    },
    // ─── AUSTRALIA ENGLISH ───────────────────────────────────────────────────────
    "au-en": {
        vosAcces: "Access Info",
        lAlliance: "The Ally",
        sonProfil: "Child Profile",
        stepText: "Screen {step} of 3",
        chooseRole: "Choose your role",
        parentTab: "Parents",
        schoolTab: "School",
        ngoTab: "NGO",
        instantGoogle: "Instant Access with Google",
        orEmail: "Or via manual email",
        fullNameParent: "Full Name",
        fullNameSchool: "School Name",
        fullNameNgo: "Organization Name",
        fullNamePlaceholderParent: "e.g. Jack or Mia",
        fullNamePlaceholderSchool: "e.g. Sydney Primary School",
        fullNamePlaceholderNgo: "e.g. Australian Red Cross",
        username: "Username",
        usernamePlaceholder: "jack_au",
        email: "Email",
        emailPlaceholder: "jack@example.com.au",
        phone: "Phone",
        phonePlaceholder: "0412 345 678",
        password: "Password",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Confirm Password",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "Perfect match",
        matchError: "Passwords do not match",
        eightChars: "8 Chars",
        uppercase: "Uppercase",
        number: "Number",
        specialChar: "Special Chars",
        next: "Next",
        previous: "Back",
        titleParentStep1: "Awakening of",
        titleParentStep1Orange: "the Elite",
        titleSchoolStep1: "Awakening of",
        titleSchoolStep1Orange: "the Elite",
        titleNgoStep1: "Awakening of",
        titleNgoStep1Orange: "the Elite",
        subStep1Parent: "Become the architect of an exceptional destiny.",
        subStep1School: "A distinguished educational partner for the elite.",
        subStep1Ngo: "Together we build a better tomorrow for children.",
        leftTitle1: "Awakening of",
        leftTitle1Orange: "the Elite",
        leftSub1: "Become the architect of an exceptional destiny.",
        leftTitle2: "Harmony of",
        leftTitle2Orange: "Alliances",
        leftSub2: "Seal the union for a shared flight.",
        leftTitle3: "Rise of",
        leftTitle3Orange: "Genius",
        leftSub3: "Illuminate the path of their ascension.",
        allyTitle: "Your Educational Ally",
        allyDesc: "Education is a team sport. Invite the person who supports you (partner, eldest, uncle...) to synchronize your efforts.",
        allyNamePlaceholder: "e.g. Noah or Charlotte",
        allyEmailPlaceholder: "Email of your ally (Optional)",
        schoolIdentityTitle: "School Identity",
        schoolIdentityDesc: "Configure your primary school's official information to seal our educational partnership.",
        privateSchool: "Private School",
        publicSchool: "Public School",
        schoolAddressPlaceholder: "Full headquarters address",
        schoolManagerPlaceholder: "Principal Name",
        ngoTitle: "Social Engagement",
        ngoDesc: "Define the scope of your humanitarian mission for perfect synergy.",
        ngoDomainPlaceholder: "Domain of Action",
        ngoDomainEducation: "Education & Support",
        ngoDomainSocial: "Social Inclusion",
        ngoDomainCulture: "Culture & Awareness",
        ngoDomainHumanitarian: "Global Humanitarian",
        ngoAddressPlaceholder: "Headquarters Address",
        ngoManagerPlaceholder: "NGO Manager Name",
        childFirstName: "Child's First Name",
        childFirstNamePlaceholder: "e.g. Oliver or Isla",
        childAge: "Age",
        childAgePlaceholder: "e.g. 8",
        childLevel: "Grade/Level",
        childSchool: "School / Institution",
        childSchoolPlaceholder: "Search school...",
        securityCheck: "Security Verification",
        securityCheckDesc: "Secured Anti-Robot System",
        securityCodePlaceholder: "Enter code",
        finalizeButton: "Finalize Registration",
        registerSchoolButton: "Register School",
        registerNgoButton: "Register NGO",
        termsText: "By continuing, you agree to our terms and privacy policy.",
        alreadyHaveAccount: "Already have an account?",
        loginLink: "Login",
        digitalPresence: "Digital Presence",
        digitalPresencePlaceholderSchool: "Website or Facebook page (e.g. fb.com/school...)",
        schoolDimension: "School Size",
        classesCountPlaceholder: "Number of primary classes",
        instCheck: "Institutional Verification",
        instCheckDesc: "Secured Institutional System",
        digitalPresencePlaceholderNgo: "Website or Social Profile",
        beneficiariesCount: "Number of Beneficiaries",
        beneficiariesPlaceholder: "Estimated number of supported children",
        orgCheck: "Organization Verification",
        orgCheckDesc: "Humanitarian Protection Active",
        errNameEmpty: "Please enter your full name",
        errUsernameEmpty: "Please choose a username",
        errUsernameTaken: "Username is already taken",
        errEmailEmpty: "Please enter your email",
        errPasswordEmpty: "Please enter a password",
        errPasswordsDoNotMatch: "Passwords do not match",
        errCaptchaIncorrect: "Incorrect security code",
        welcomeTitle: "Welcome to the Elite!"
    },
    // ─── UK ENGLISH ──────────────────────────────────────────────────────────────
    "gb-en": {
        vosAcces: "Access Info",
        lAlliance: "The Ally",
        sonProfil: "Child Profile",
        stepText: "Screen {step} of 3",
        chooseRole: "Choose your role",
        parentTab: "Parents",
        schoolTab: "School",
        ngoTab: "NGO",
        instantGoogle: "Instant Access with Google",
        orEmail: "Or via manual email",
        fullNameParent: "Full Name",
        fullNameSchool: "School Name",
        fullNameNgo: "Organization Name",
        fullNamePlaceholderParent: "e.g. George or Amelia",
        fullNamePlaceholderSchool: "e.g. St. Mary's Primary School",
        fullNamePlaceholderNgo: "e.g. Oxfam GB",
        username: "Username",
        usernamePlaceholder: "george_uk",
        email: "Email",
        emailPlaceholder: "george@example.co.uk",
        phone: "Phone",
        phonePlaceholder: "07700 900077",
        password: "Password",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Confirm Password",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "Perfect match",
        matchError: "Passwords do not match",
        eightChars: "8 Chars",
        uppercase: "Uppercase",
        number: "Number",
        specialChar: "Special Chars",
        next: "Next",
        previous: "Back",
        titleParentStep1: "Awakening of",
        titleParentStep1Orange: "the Elite",
        titleSchoolStep1: "Awakening of",
        titleSchoolStep1Orange: "the Elite",
        titleNgoStep1: "Awakening of",
        titleNgoStep1Orange: "the Elite",
        subStep1Parent: "Become the architect of an exceptional destiny.",
        subStep1School: "A distinguished educational partner for the elite.",
        subStep1Ngo: "Together we build a better tomorrow for children.",
        leftTitle1: "Awakening of",
        leftTitle1Orange: "the Elite",
        leftSub1: "Become the architect of an exceptional destiny.",
        leftTitle2: "Harmony of",
        leftTitle2Orange: "Alliances",
        leftSub2: "Seal the union for a shared flight.",
        leftTitle3: "Rise of",
        leftTitle3Orange: "Genius",
        leftSub3: "Illuminate the path of their ascension.",
        allyTitle: "Your Educational Ally",
        allyDesc: "Education is a team sport. Invite the person who supports you (partner, eldest, uncle...) to synchronize your efforts.",
        allyNamePlaceholder: "e.g. Harry or Olivia",
        allyEmailPlaceholder: "Email of your ally (Optional)",
        schoolIdentityTitle: "School Identity",
        schoolIdentityDesc: "Configure your primary school's official information to seal our educational partnership.",
        privateSchool: "Independent School",
        publicSchool: "State School",
        schoolAddressPlaceholder: "Full headquarters address",
        schoolManagerPlaceholder: "Headteacher Name",
        ngoTitle: "Social Engagement",
        ngoDesc: "Define the scope of your humanitarian mission for perfect synergy.",
        ngoDomainPlaceholder: "Domain of Action",
        ngoDomainEducation: "Education & Support",
        ngoDomainSocial: "Social Inclusion",
        ngoDomainCulture: "Culture & Awareness",
        ngoDomainHumanitarian: "Global Humanitarian",
        ngoAddressPlaceholder: "Headquarters Address",
        ngoManagerPlaceholder: "NGO Manager Name",
        childFirstName: "Child's First Name",
        childFirstNamePlaceholder: "e.g. Arthur or Lily",
        childAge: "Age",
        childAgePlaceholder: "e.g. 8",
        childLevel: "Year/Level",
        childSchool: "School / Institution",
        childSchoolPlaceholder: "Search school...",
        securityCheck: "Security Verification",
        securityCheckDesc: "Secured Anti-Robot System",
        securityCodePlaceholder: "Enter code",
        finalizeButton: "Finalize Registration",
        registerSchoolButton: "Register School",
        registerNgoButton: "Register NGO",
        termsText: "By continuing, you agree to our terms and privacy policy.",
        alreadyHaveAccount: "Already have an account?",
        loginLink: "Login",
        digitalPresence: "Digital Presence",
        digitalPresencePlaceholderSchool: "Website or Facebook page (e.g. fb.com/school...)",
        schoolDimension: "School Size",
        classesCountPlaceholder: "Number of primary classes",
        instCheck: "Institutional Verification",
        instCheckDesc: "Secured Institutional System",
        digitalPresencePlaceholderNgo: "Website or Social Profile",
        beneficiariesCount: "Number of Beneficiaries",
        beneficiariesPlaceholder: "Estimated number of supported children",
        orgCheck: "Organization Verification",
        orgCheckDesc: "Humanitarian Protection Active",
        errNameEmpty: "Please enter your full name",
        errUsernameEmpty: "Please choose a username",
        errUsernameTaken: "Username is already taken",
        errEmailEmpty: "Please enter your email",
        errPasswordEmpty: "Please enter a password",
        errPasswordsDoNotMatch: "Passwords do not match",
        errCaptchaIncorrect: "Incorrect security code",
        welcomeTitle: "Welcome to the Elite!"
    },
    // ─── US ENGLISH ──────────────────────────────────────────────────────────────
    "us-en": {
        vosAcces: "Access Info",
        lAlliance: "The Ally",
        sonProfil: "Child Profile",
        stepText: "Screen {step} of 3",
        chooseRole: "Choose your role",
        parentTab: "Parents",
        schoolTab: "School",
        ngoTab: "NGO",
        instantGoogle: "Instant Access with Google",
        orEmail: "Or via manual email",
        fullNameParent: "Full Name",
        fullNameSchool: "School Name",
        fullNameNgo: "Organization Name",
        fullNamePlaceholderParent: "e.g. Michael or Emma",
        fullNamePlaceholderSchool: "e.g. Lincoln Elementary School",
        fullNamePlaceholderNgo: "e.g. American Red Cross",
        username: "Username",
        usernamePlaceholder: "michael_us",
        email: "Email",
        emailPlaceholder: "michael@example.com",
        phone: "Phone",
        phonePlaceholder: "202-555-0123",
        password: "Password",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Confirm Password",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "Perfect match",
        matchError: "Passwords do not match",
        eightChars: "8 Chars",
        uppercase: "Uppercase",
        number: "Number",
        specialChar: "Special Chars",
        next: "Next",
        previous: "Back",
        titleParentStep1: "Awakening of",
        titleParentStep1Orange: "the Elite",
        titleSchoolStep1: "Awakening of",
        titleSchoolStep1Orange: "the Elite",
        titleNgoStep1: "Awakening of",
        titleNgoStep1Orange: "the Elite",
        subStep1Parent: "Become the architect of an exceptional destiny.",
        subStep1School: "A distinguished educational partner for the elite.",
        subStep1Ngo: "Together we build a better tomorrow for children.",
        leftTitle1: "Awakening of",
        leftTitle1Orange: "the Elite",
        leftSub1: "Become the architect of an exceptional destiny.",
        leftTitle2: "Harmony of",
        leftTitle2Orange: "Alliances",
        leftSub2: "Seal the union for a shared flight.",
        leftTitle3: "Rise of",
        leftTitle3Orange: "Genius",
        leftSub3: "Illuminate the path of their ascension.",
        allyTitle: "Your Educational Ally",
        allyDesc: "Education is a team sport. Invite the person who supports you (spouse, eldest, uncle...) to synchronize your efforts.",
        allyNamePlaceholder: "e.g. David or Sophia",
        allyEmailPlaceholder: "Email of your ally (Optional)",
        schoolIdentityTitle: "School Identity",
        schoolIdentityDesc: "Configure your primary school's official information to seal our educational partnership.",
        privateSchool: "Private School",
        publicSchool: "Public School",
        schoolAddressPlaceholder: "Full headquarters address",
        schoolManagerPlaceholder: "Principal Name",
        ngoTitle: "Social Engagement",
        ngoDesc: "Define the scope of your humanitarian mission for perfect synergy.",
        ngoDomainPlaceholder: "Domain of Action",
        ngoDomainEducation: "Education & Support",
        ngoDomainSocial: "Social Inclusion",
        ngoDomainCulture: "Culture & Awareness",
        ngoDomainHumanitarian: "Global Humanitarian",
        ngoAddressPlaceholder: "Headquarters Address",
        ngoManagerPlaceholder: "NGO Manager Name",
        childFirstName: "Child's First Name",
        childFirstNamePlaceholder: "e.g. James or Isabella",
        childAge: "Age",
        childAgePlaceholder: "e.g. 8",
        childLevel: "Grade/Level",
        childSchool: "School / Institution",
        childSchoolPlaceholder: "Search school...",
        securityCheck: "Security Verification",
        securityCheckDesc: "Secured Anti-Robot System",
        securityCodePlaceholder: "Enter code",
        finalizeButton: "Finalize Registration",
        registerSchoolButton: "Register School",
        registerNgoButton: "Register NGO",
        termsText: "By continuing, you agree to our terms and privacy policy.",
        alreadyHaveAccount: "Already have an account?",
        loginLink: "Login",
        digitalPresence: "Digital Presence",
        digitalPresencePlaceholderSchool: "Website or Facebook page (e.g. fb.com/school...)",
        schoolDimension: "School Size",
        classesCountPlaceholder: "Number of primary classes",
        instCheck: "Institutional Verification",
        instCheckDesc: "Secured Institutional System",
        digitalPresencePlaceholderNgo: "Website or Social Profile",
        beneficiariesCount: "Number of Beneficiaries",
        beneficiariesPlaceholder: "Estimated number of supported children",
        orgCheck: "Organization Verification",
        orgCheckDesc: "Humanitarian Protection Active",
        errNameEmpty: "Please enter your full name",
        errUsernameEmpty: "Please choose a username",
        errUsernameTaken: "Username is already taken",
        errEmailEmpty: "Please enter your email",
        errPasswordEmpty: "Please enter a password",
        errPasswordsDoNotMatch: "Passwords do not match",
        errCaptchaIncorrect: "Incorrect security code",
        welcomeTitle: "Welcome to the Elite!"
    },
    mi: {
        vosAcces: "Pārongo Takiuru",
        lAlliance: "Te Hoa",
        sonProfil: "Kōtaha Tamaiti",
        stepText: "Mata {step} o te 3",
        chooseRole: "Kōwhiria tō tūnga",
        parentTab: "Mātua",
        schoolTab: "Kura",
        ngoTab: "NGO",
        instantGoogle: "Takiuru Tere me Google",
        orEmail: "Rānei mā te īmēra ā-ringa",
        fullNameParent: "Ingoa Katoa",
        fullNameSchool: "Ingoa Kura",
        fullNameNgo: "Ingoa Whakahaere",
        fullNamePlaceholderParent: "hei tauira, Hemi Takawe",
        fullNamePlaceholderSchool: "hei tauira, Te Kura o Te Kao",
        fullNamePlaceholderNgo: "hei tauira, Rīpeka Whero",
        username: "Ingoa Kaiwhakamahi",
        usernamePlaceholder: "hemi_nz",
        email: "Īmēra",
        emailPlaceholder: "hemi@example.co.nz",
        phone: "Waea",
        phonePlaceholder: "021 234 5678",
        password: "Kupuhipa",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Whakaū Kupuhipa",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "Tino taurite",
        matchError: "Kāore i taurite ngā kupuhipa",
        eightChars: "8 Pūāhua",
        uppercase: "Pūmatua",
        number: "Tau",
        specialChar: "Pūāhua Motuhake",
        next: "Panuku",
        previous: "Hoki",
        titleParentStep1: "Te Whakaara i te",
        titleParentStep1Orange: "Kairangi",
        titleSchoolStep1: "Te Whakaara i te",
        titleSchoolStep1Orange: "Kairangi",
        titleNgoStep1: "Te Whakaara i te",
        titleNgoStep1Orange: "Kairangi",
        subStep1Parent: "Me noho hei kaihanga mō tētahi huarahi motuhake.",
        subStep1School: "He hoa mātauranga rongonui mō te kairangi.",
        subStep1Ngo: "Mā te mahi tahi ka hanga tātou i te āpōpō pai ake mō ngā tamariki.",
        // Left Pane Titles/Subs
        leftTitle1: "Te Whakaara i te",
        leftTitle1Orange: "Kairangi",
        leftSub1: "Me noho hei kaihanga mō tētahi huarahi motuhake.",
        leftTitle2: "He Ōrite ngā",
        leftTitle2Orange: "Hononga",
        leftSub2: "Whakapumautia te hononga mō tētahi rerenga tahi.",
        leftTitle3: "Te Hiki o te",
        leftTitle3Orange: "Pūmanawa",
        leftSub3: "Whakamāramatia te huarahi o tō rātou kakenga.",
        // Step 2 Parent
        allyTitle: "Tō Hoa Mātauranga",
        allyDesc: "He hākinakina ā-tīma te mātauranga. Pōwhiritia te tangata e tautoko ana i a koe kia mahi tahi ai koutou.",
        allyNamePlaceholder: "hei tauira, Aroha rānei",
        allyEmailPlaceholder: "Īmēra o tō hoa (Kōwhiringa)",
        // Step 2 School
        schoolIdentityTitle: "Tuakiri Kura",
        schoolIdentityDesc: "Whakaritea ngā mōhiohio whai mana o tō kura tuatahi ki te whakapumau i tā tātou hononga mātauranga.",
        privateSchool: "Kura Tūmataiti",
        publicSchool: "Kura Kāwanatanga",
        schoolAddressPlaceholder: "Wāhitau tari katoa",
        schoolManagerPlaceholder: "Ingoa o te Tumuaki",
        // Step 2 NGO
        ngoTitle: "Whakawhanaungatanga",
        ngoDesc: "Tautuhia te kaupapa o tō miihana atawhai mō te mahi tahi tino tika.",
        ngoDomainPlaceholder: "Kaupapa Mahi",
        ngoDomainEducation: "Mātauranga & Tautoko",
        ngoDomainSocial: "Whakaurunga Pāpori",
        ngoDomainCulture: "Ahurea & Whakaara",
        ngoDomainHumanitarian: "Atawhai Ao",
        ngoAddressPlaceholder: "Wāhitau Tari",
        ngoManagerPlaceholder: "Ingoa Kaiwhakahaere NGO",
        // Step 3 Parent
        childFirstName: "Ingoa Tuatahi o te Tamaiti",
        childFirstNamePlaceholder: "hei tauira, Tāne rānei",
        childAge: "Tau",
        childAgePlaceholder: "hei tauira, 8",
        childLevel: "Taumata/Mahi",
        childSchool: "Kura / Whare",
        childSchoolPlaceholder: "Rapu kura...",
        securityCheck: "Whakaū Haumarutanga",
        securityCheckDesc: "Pūnaha Ārai Karetao Whakamarumaru",
        securityCodePlaceholder: "Tāuru waehere",
        finalizeButton: "Whakaoti Rēhita",
        registerSchoolButton: "Rēhita Kura",
        registerNgoButton: "Rēhita NGO",
        termsText: "Mā te haere tonu, e whakaae ana koe ki ā mātou tikanga me te kaupapa here tūmataiti.",
        alreadyHaveAccount: "Kei a koe kē he pūkete?",
        loginLink: "Takiuru",
        // Step 3 School
        digitalPresence: "Te Āhuatanga Matihiko",
        digitalPresencePlaceholderSchool: "Paetukutuku, whārangi Pukamata rānei",
        schoolDimension: "Rahi o te Kura",
        classesCountPlaceholder: "Te maha o ngā akomanga tuatahi",
        instCheck: "Whakaū Pūtahi",
        instCheckDesc: "Pūnaha Pūtahi Whakamarumaru",
        // Step 3 NGO
        digitalPresencePlaceholderNgo: "Paetukutuku, Kōtaha Pāpori rānei",
        beneficiariesCount: "Te Maha o ngā Kaiwhiwhi",
        beneficiariesPlaceholder: "Te tatauranga o ngā tamariki e tautokohia ana",
        orgCheck: "Whakaū Whakahaere",
        orgCheckDesc: "Kua Hohe te Tiaki Atawhai",
        // Error messages
        errNameEmpty: "Tēnā whakauruhia tō ingoa katoa",
        errUsernameEmpty: "Tēnā kōwhiria he ingoa kaiwhakamahi",
        errUsernameTaken: "Kua whakamahia kē te ingoa kaiwhakamahi",
        errEmailEmpty: "Tēnā whakauruhia tō īmēra",
        errPasswordEmpty: "Tēnā whakauruhia he kupuhipa",
        errPasswordsDoNotMatch: "Kāore i taurite ngā kupuhipa",
        errCaptchaIncorrect: "Waehere haumarutanga hē",
        welcomeTitle: "Nau mai ki te Kairangi!"
    },
    "nz-en": {
        vosAcces: "Access Info",
        lAlliance: "The Ally",
        sonProfil: "Child Profile",
        stepText: "Screen {step} of 3",
        chooseRole: "Choose your role",
        parentTab: "Parents",
        schoolTab: "School",
        ngoTab: "NGO",
        instantGoogle: "Instant Access with Google",
        orEmail: "Or via manual email",
        fullNameParent: "Full Name",
        fullNameSchool: "School Name",
        fullNameNgo: "Organization Name",
        fullNamePlaceholderParent: "e.g. Liam Smith",
        fullNamePlaceholderSchool: "e.g. Auckland Primary",
        fullNamePlaceholderNgo: "e.g. Red Cross NZ",
        username: "Username",
        usernamePlaceholder: "liam_nz",
        email: "Email",
        emailPlaceholder: "liam@example.co.nz",
        phone: "Phone",
        phonePlaceholder: "021 345 678",
        password: "Password",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Confirm Password",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "Perfect match",
        matchError: "Passwords do not match",
        eightChars: "8 Chars",
        uppercase: "Uppercase",
        number: "Number",
        specialChar: "Special Chars",
        next: "Next",
        previous: "Back",
        titleParentStep1: "Awakening of",
        titleParentStep1Orange: "the Elite",
        titleSchoolStep1: "Awakening of",
        titleSchoolStep1Orange: "the Elite",
        titleNgoStep1: "Awakening of",
        titleNgoStep1Orange: "the Elite",
        subStep1Parent: "Become the architect of an exceptional destiny.",
        subStep1School: "A distinguished educational partner for the elite.",
        subStep1Ngo: "Together we build a better tomorrow for children.",
        // Left Pane Titles/Subs
        leftTitle1: "Awakening of",
        leftTitle1Orange: "the Elite",
        leftSub1: "Become the architect of an exceptional destiny.",
        leftTitle2: "Harmony of",
        leftTitle2Orange: "Alliances",
        leftSub2: "Seal the union for a shared flight.",
        leftTitle3: "Rise of",
        leftTitle3Orange: "Genius",
        leftSub3: "Illuminate the path of their ascension.",
        // Step 2 Parent
        allyTitle: "Your Educational Ally",
        allyDesc: "Education is a team sport. Invite the person who supports you (spouse, eldest, uncle...) to synchronize your efforts.",
        allyNamePlaceholder: "e.g. Sarah or Michael",
        allyEmailPlaceholder: "Email of your ally (Optional)",
        // Step 2 School
        schoolIdentityTitle: "School Identity",
        schoolIdentityDesc: "Configure your primary school's official information to seal our educational partnership.",
        privateSchool: "Private School",
        publicSchool: "State School",
        schoolAddressPlaceholder: "Full headquarters address",
        schoolManagerPlaceholder: "Manager / Principal Name",
        // Step 2 NGO
        ngoTitle: "Social Engagement",
        ngoDesc: "Define the scope of your humanitarian mission for perfect synergy.",
        ngoDomainPlaceholder: "Domain of Action",
        ngoDomainEducation: "Education & Support",
        ngoDomainSocial: "Social Inclusion",
        ngoDomainCulture: "Culture & Awareness",
        ngoDomainHumanitarian: "Global Humanitarian",
        ngoAddressPlaceholder: "Headquarters Address",
        ngoManagerPlaceholder: "NGO Manager Name",
        // Step 3 Parent
        childFirstName: "Child's First Name",
        childFirstNamePlaceholder: "e.g. Emily or Ethan",
        childAge: "Age",
        childAgePlaceholder: "e.g. 8",
        childLevel: "Year Level",
        childSchool: "School / Institution",
        childSchoolPlaceholder: "Search school...",
        securityCheck: "Security Verification",
        securityCheckDesc: "Secured Anti-Robot System",
        securityCodePlaceholder: "Enter code",
        finalizeButton: "Finalize Registration",
        registerSchoolButton: "Register School",
        registerNgoButton: "Register NGO",
        termsText: "By continuing, you agree to our terms and privacy policy.",
        alreadyHaveAccount: "Already have an account?",
        loginLink: "Login",
        // Step 3 School
        digitalPresence: "Digital Presence",
        digitalPresencePlaceholderSchool: "Website or Facebook page",
        schoolDimension: "School Size",
        classesCountPlaceholder: "Number of primary classes",
        instCheck: "Institutional Verification",
        instCheckDesc: "Secured Institutional System",
        // Step 3 NGO
        digitalPresencePlaceholderNgo: "Website or Social Profile",
        beneficiariesCount: "Number of Beneficiaries",
        beneficiariesPlaceholder: "Estimated number of supported children",
        orgCheck: "Organization Verification",
        orgCheckDesc: "Humanitarian Protection Active",
        // Error messages
        errNameEmpty: "Please enter your full name",
        errUsernameEmpty: "Please choose a username",
        errUsernameTaken: "Username is already taken",
        errEmailEmpty: "Please enter your email",
        errPasswordEmpty: "Please enter a password",
        errPasswordsDoNotMatch: "Passwords do not match",
        errCaptchaIncorrect: "Incorrect security code",
        welcomeTitle: "Welcome to the Elite!"
    },
    // ─── IRELAND GAEILGE ─────────────────────────────────────────────────────────
    "ga": {
        vosAcces: "Faisnéis Rochtana",
        lAlliance: "An Comhghuaillí",
        sonProfil: "Próifíl Linbh",
        stepText: "Scáileán {step} de 3",
        chooseRole: "Roghnaigh do ról",
        parentTab: "Tuismitheoirí",
        schoolTab: "Scoil",
        ngoTab: "Eagraíochtaí Neamhrialtasacha",
        instantGoogle: "Rochtain Láithreach le Google",
        orEmail: "Nó trí ríomhphost",
        fullNameParent: "Ainm Iomlán",
        fullNameSchool: "Ainm na Scoile",
        fullNameNgo: "Ainm na hEagraíochta",
        fullNamePlaceholderParent: "m.sh. Aoife Kelly nó Sean Murphy",
        fullNamePlaceholderSchool: "m.sh. Scoil Naisiúnta Naomh Pádraig",
        fullNamePlaceholderNgo: "m.sh. Crois Dhearg na hÉireann",
        username: "Ainm Úsáideora",
        usernamePlaceholder: "aoife_ie",
        email: "Ríomhphost",
        emailPlaceholder: "aoife@eire.ie",
        phone: "Fón",
        phonePlaceholder: "085 123 4567",
        password: "Focal Faire",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Deimhnigh d'Fhocal Faire",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "Meaitseáil foirfe",
        matchError: "Ní mheaitseálann na focail fhaire",
        eightChars: "8 gCarachtar",
        uppercase: "Cás uachtair",
        number: "Uimhir",
        specialChar: "Carachtar speisialta",
        next: "Ar aghaidh",
        previous: "Siar",
        titleParentStep1: "Múscailt",
        titleParentStep1Orange: "na Scothaicme",
        titleSchoolStep1: "Múscailt",
        titleSchoolStep1Orange: "na Scothaicme",
        titleNgoStep1: "Múscailt",
        titleNgoStep1Orange: "na Scothaicme",
        subStep1Parent: "Bí i do ailtire ar thodhchaí eisceachtúil do do leanaí.",
        subStep1School: "Comhpháirtí oideachais ceannródaíoch don chéad ghlúin eile.",
        subStep1Ngo: "Le chéile tógaimid amárach níos fearr do leanaí.",
        leftTitle1: "Múscailt",
        leftTitle1Orange: "na Scothaicme",
        leftSub1: "Bí i do ailtire ar thodhchaí eisceachtúil.",
        leftTitle2: "Comhchuibheas na",
        leftTitle2Orange: "gComhghuaillíochtaí",
        leftSub2: "Aontaigh bhur n-iarrachtaí do thuras roinnte.",
        leftTitle3: "Éirí an",
        leftTitle3Orange: "Ghiniasa",
        leftSub3: "Soilsigh an cosán chuig a rath.",
        allyTitle: "Do Chomhghuaillí Oideachais",
        allyDesc: "Spórt foirne is ea an t-oideachas. Tabhair cuireadh don duine a thacaíonn leat chun bhur n-iarrachtaí a chomhordú.",
        allyNamePlaceholder: "m.sh. Niamh nó Ciarán",
        allyEmailPlaceholder: "Ríomhphost an chomhghuaillí (Roghnach)",
        schoolIdentityTitle: "Aitheantas na Scoile",
        schoolIdentityDesc: "Socraigh faisnéis oifigiúil do scoile chun ár gcomhpháirtíocht oideachais a dhearbhú.",
        privateSchool: "Scoil Phríobháideach",
        publicSchool: "Scoil Phoiblí",
        schoolAddressPlaceholder: "Seoladh iomlán",
        schoolManagerPlaceholder: "Ainm an Phríomhoide",
        ngoTitle: "Rannpháirtíocht Phobail",
        ngoDesc: "Sainmhínigh scóip misean d'eagraíochta le haghaidh sineirgíocht fhoirfe.",
        ngoDomainPlaceholder: "Réimse Fócais",
        ngoDomainEducation: "Oideachas & Tacaíocht Scoile",
        ngoDomainSocial: "Cuimsiú Sóisialta",
        ngoDomainCulture: "Cultúr & Feasacht",
        ngoDomainHumanitarian: "Gníomhaíocht Dhaonnúil",
        ngoAddressPlaceholder: "Seoladh na hEagraíochta",
        ngoManagerPlaceholder: "Bainisteoir na hEagraíochta",
        childFirstName: "Céadainm an Linbh",
        childFirstNamePlaceholder: "m.sh. Oisín nó Róisín",
        childAge: "Aois",
        childAgePlaceholder: "m.sh. 8",
        childLevel: "Leibhéal",
        childSchool: "Scoil",
        childSchoolPlaceholder: "Cuardaigh scoil...",
        securityCheck: "Fíorú Slándála",
        securityCheckDesc: "Córas Slán Frith-Róbait",
        securityCodePlaceholder: "Iontráil an cód",
        finalizeButton: "Críochnaigh an Clárú",
        registerSchoolButton: "Cláraigh an Scoil",
        registerNgoButton: "Cláraigh an Eagraíocht",
        termsText: "Trí leanúint ar aghaidh, aontaíonn tú lenár dtéarmaí seirbhíse agus polasaí príobháideachais.",
        alreadyHaveAccount: "An bhfuil cuntas agat cheana féin?",
        loginLink: "Logáil Isteach",
        digitalPresence: "Láithreacht Dhigiteach",
        digitalPresencePlaceholderSchool: "Suíomh Gréasáin nó leathanach Facebook",
        schoolDimension: "Méid na Scoile",
        classesCountPlaceholder: "Líon na ranganna bunscoile",
        instCheck: "Fíorú Institiúideach",
        instCheckDesc: "Córas Slán Institiúideach",
        digitalPresencePlaceholderNgo: "Suíomh Gréasáin nó Próifíl Shóisialta",
        beneficiariesCount: "Líon na dTairbhithe",
        beneficiariesPlaceholder: "Líon measta na leanaí a bhfaigheann tacaíocht",
        orgCheck: "Fíorú na hEagraíochta",
        orgCheckDesc: "Cosaint Dhaonnúil Gníomhach",
        errNameEmpty: "Cuir isteach d'ainm iomlán le do thoil.",
        errUsernameEmpty: "Roghnaigh ainm úsáideora le do thoil.",
        errUsernameTaken: "Tá an t-ainm úsáideora seo in úsáid cheana féin.",
        errEmailEmpty: "Cuir isteach do ríomhphost le do thoil.",
        errPasswordEmpty: "Cuir isteach d'fhocal faire le do thoil.",
        errPasswordsDoNotMatch: "Ní mheaitseálann na focail fhaire.",
        errCaptchaIncorrect: "Cód slándála mícheart.",
        welcomeTitle: "Fáilte go dtí an Scothaicme!"
    },
    // ─── DENMARK DANISH ──────────────────────────────────────────────────────────
    da: {
        vosAcces: "Din Adgang",
        lAlliance: "Din Allierede",
        sonProfil: "Barnets Profil",
        stepText: "Trin {step} af 3",
        chooseRole: "Vælg din rolle",
        parentTab: "Forældre",
        schoolTab: "Skole",
        ngoTab: "NGO",
        instantGoogle: "Hurtig adgang med Google",
        orEmail: "Eller via e-mail",
        fullNameParent: "Fulde navn",
        fullNameSchool: "Skolens navn",
        fullNameNgo: "Organisationens navn",
        fullNamePlaceholderParent: "f.eks. Mads Andersen eller Sofie Nielsen",
        fullNamePlaceholderSchool: "f.eks. Utterslev Skole",
        fullNamePlaceholderNgo: "f.eks. Røde Kors Danmark",
        username: "Brugernavn",
        usernamePlaceholder: "mads_dk",
        email: "E-mail",
        emailPlaceholder: "mads@example.dk",
        phone: "Telefon",
        phonePlaceholder: "20 12 34 56",
        password: "Adgangskode",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Bekræft adgangskode",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "Perfekt match",
        matchError: "Adgangskoderne matcher ikke",
        eightChars: "8 Tegn",
        uppercase: "Stort bogstav",
        number: "Tal",
        specialChar: "Specialtegn",
        next: "Næste",
        previous: "Tilbage",
        titleParentStep1: "Opvågning af",
        titleParentStep1Orange: "Eliten",
        titleSchoolStep1: "Opvågning af",
        titleSchoolStep1Orange: "Eliten",
        titleNgoStep1: "Opvågning af",
        titleNgoStep1Orange: "Eliten",
        subStep1Parent: "Bliv arkitekten bag en ekstraordinær fremtid for dine børn.",
        subStep1School: "En fremtrædende uddannelsespartner for fremtidens elite.",
        subStep1Ngo: "Sammen bygger vi en bedre fremtid for børnene.",
        leftTitle1: "Opvågning af",
        leftTitle1Orange: "Eliten",
        leftSub1: "Bliv arkitekten bag en ekstraordinær fremtid.",
        leftTitle2: "Harmonien i",
        leftTitle2Orange: "Alliancerne",
        leftSub2: "Besegl forbundet for en fælles rejse fremad.",
        leftTitle3: "Geniets",
        leftTitle3Orange: "Opblomstring",
        leftSub3: "Belyser vejen mod deres fremragende præstationer.",
        allyTitle: "Din uddannelsesallierede",
        allyDesc: "Uddannelse er en holdsport. Invitér den person, der støtter dig (ægtefælle, ældste barn, onkel...) til at koordinere jeres indsats.",
        allyNamePlaceholder: "f.eks. Camilla eller Rasmus",
        allyEmailPlaceholder: "Din allierede e-mail (Valgfri)",
        schoolIdentityTitle: "Skolens identitet",
        schoolIdentityDesc: "Konfigurér din folkeskoles officielle oplysninger for at besejle vores uddannelsespartnerskab.",
        privateSchool: "Privatskole / Friskole",
        publicSchool: "Folkeskole",
        schoolAddressPlaceholder: "Skolens fulde adresse",
        schoolManagerPlaceholder: "Skolelederens navn",
        ngoTitle: "Socialt engagement",
        ngoDesc: "Definer rækkevidden af din humanitære mission for perfekt synergi.",
        ngoDomainPlaceholder: "Indsatsområde",
        ngoDomainEducation: "Uddannelse & Støtte",
        ngoDomainSocial: "Social inklusion",
        ngoDomainCulture: "Kultur & Bevidsthed",
        ngoDomainHumanitarian: "Global humanitær indsats",
        ngoAddressPlaceholder: "Organisationens adresse",
        ngoManagerPlaceholder: "Leder af organisationen",
        childFirstName: "Barnets fornavn",
        childFirstNamePlaceholder: "f.eks. Emma eller Oliver",
        childAge: "Alder",
        childAgePlaceholder: "f.eks. 8",
        childLevel: "Klassetrin",
        childSchool: "Skole / Institution",
        childSchoolPlaceholder: "Søg efter skole...",
        securityCheck: "Sikkerhedsbekræftelse",
        securityCheckDesc: "Sikret anti-robot system",
        securityCodePlaceholder: "Indtast kode",
        finalizeButton: "Fuldfør tilmelding",
        registerSchoolButton: "Tilmeld skolen",
        registerNgoButton: "Tilmeld organisationen",
        termsText: "Ved at fortsætte accepterer du vores vilkår og privatlivspolitik.",
        alreadyHaveAccount: "Har du allerede en konto?",
        loginLink: "Log ind",
        digitalPresence: "Digital tilstedeværelse",
        digitalPresencePlaceholderSchool: "Hjemmeside eller Facebook-side (f.eks. fb.com/skole...)",
        schoolDimension: "Skolens størrelse",
        classesCountPlaceholder: "Antal grundskoleklasser",
        instCheck: "Institutionel bekræftelse",
        instCheckDesc: "Sikret institutionelt system",
        digitalPresencePlaceholderNgo: "Hjemmeside eller socialt medie-profil",
        beneficiariesCount: "Antal støttemodtagere",
        beneficiariesPlaceholder: "Anslået antal støttede børn",
        orgCheck: "Organisationsbekræftelse",
        orgCheckDesc: "Humanitær beskyttelse aktiv",
        errNameEmpty: "Angiv venligst dit fulde navn",
        errUsernameEmpty: "Vælg venligst et brugernavn",
        errUsernameTaken: "Brugernavnet er allerede taget",
        errEmailEmpty: "Angiv venligst din e-mail",
        errPasswordEmpty: "Angiv venligst en adgangskode",
        errPasswordsDoNotMatch: "Adgangskoderne matcher ikke",
        errCaptchaIncorrect: "Forkert sikkerhedskode",
        welcomeTitle: "Velkommen til Eliten!"
    },
    // ─── SWEDEN SWEDISH ──────────────────────────────────────────────────────────
    sv: {
        vosAcces: "Din Åtkomst",
        lAlliance: "Din Allierade",
        sonProfil: "Barnets Profil",
        stepText: "Steg {step} av 3",
        chooseRole: "Välj din roll",
        parentTab: "Föräldrar",
        schoolTab: "Skola",
        ngoTab: "NGO",
        instantGoogle: "Snabb åtkomst med Google",
        orEmail: "Eller via e-post",
        fullNameParent: "Fullständigt namn",
        fullNameSchool: "Skolans namn",
        fullNameNgo: "Organisationens namn",
        fullNamePlaceholderParent: "t.ex. Erik Andersson eller Sofia Nilsson",
        fullNamePlaceholderSchool: "t.ex. Stockholm Stad Skola",
        fullNamePlaceholderNgo: "t.ex. Röda Korset Sverige",
        username: "Användarnamn",
        usernamePlaceholder: "erik_se",
        email: "E-post",
        emailPlaceholder: "erik@example.se",
        phone: "Telefon",
        phonePlaceholder: "070 123 45 67",
        password: "Lösenord",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Bekräfta lösenord",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "Perfekt matchning",
        matchError: "Lösenorden matchar inte",
        eightChars: "8 Tecken",
        uppercase: "Stor bokstav",
        number: "Siffra",
        specialChar: "Specialtecken",
        next: "Nästa",
        previous: "Tillbaka",
        titleParentStep1: "Uppväckning av",
        titleParentStep1Orange: "Eliten",
        titleSchoolStep1: "Uppväckning av",
        titleSchoolStep1Orange: "Eliten",
        titleNgoStep1: "Uppväckning av",
        titleNgoStep1Orange: "Eliten",
        subStep1Parent: "Bli arkitekten bakom en extraordinär framtid för dina barn.",
        subStep1School: "En framträdande utbildningspartner för framtidens elit.",
        subStep1Ngo: "Tillsammans bygger vi en bättre framtid för barnen.",
        leftTitle1: "Uppväckning av",
        leftTitle1Orange: "Eliten",
        leftSub1: "Bli arkitekten bakom en extraordinär framtid.",
        leftTitle2: "Harmonin i",
        leftTitle2Orange: "Allianserna",
        leftSub2: "Besegla förbundet för en gemensam resa framåt.",
        leftTitle3: "Geniets",
        leftTitle3Orange: "Blomstring",
        leftSub3: "Belyser vägen mot deras framstående prestationer.",
        allyTitle: "Din utbildningsallierade",
        allyDesc: "Utbildning är en lagsport. Bjud in personen som stöder dig (make, äldsta barn, onkel...) för att koordinera era insatser.",
        allyNamePlaceholder: "t.ex. Anna eller Johan",
        allyEmailPlaceholder: "Din allierades e-post (Valfritt)",
        schoolIdentityTitle: "Skolans identitet",
        schoolIdentityDesc: "Konfigurera din grundskolas officiella uppgifter för att besegla vårt utbildningssamarbete.",
        privateSchool: "Privatskola / Friskola",
        publicSchool: "Grundskola",
        schoolAddressPlaceholder: "Skolans fullständiga adress",
        schoolManagerPlaceholder: "Skolledarens namn",
        ngoTitle: "Socialt engagemang",
        ngoDesc: "Definiera räckvidden för din humanitära mission för perfekt synergi.",
        ngoDomainPlaceholder: "Verksamhetsområde",
        ngoDomainEducation: "Utbildning & Stöd",
        ngoDomainSocial: "Social inkludering",
        ngoDomainCulture: "Kultur & Medvetande",
        ngoDomainHumanitarian: "Global humanitär insats",
        ngoAddressPlaceholder: "Organisationens adress",
        ngoManagerPlaceholder: "Ledare för organisationen",
        childFirstName: "Barnets förnamn",
        childFirstNamePlaceholder: "t.ex. Emma eller Oliver",
        childAge: "Ålder",
        childAgePlaceholder: "t.ex. 8",
        childLevel: "Klassnivå",
        childSchool: "Län",
        childSchoolPlaceholder: "Sök efter län...",
        securityCheck: "Säkerhetsbekräftelse",
        securityCheckDesc: "Säkrat anti-robot system",
        securityCodePlaceholder: "Ange kod",
        finalizeButton: "Slutför registrering",
        registerSchoolButton: "Registrera skolan",
        registerNgoButton: "Registrera organisationen",
        termsText: "Genom att fortsätta accepterar du våra villkor och integritetspolicy.",
        alreadyHaveAccount: "Har du redan ett konto?",
        loginLink: "Logga in",
        digitalPresence: "Digital närvaro",
        digitalPresencePlaceholderSchool: "Hemsida eller Facebook-sida (t.ex. fb.com/skola...)",
        schoolDimension: "Skolans storlek",
        classesCountPlaceholder: "Antal grundskoleklasser",
        instCheck: "Institutionell bekräftelse",
        instCheckDesc: "Säkrat institutionellt system",
        digitalPresencePlaceholderNgo: "Hemsida eller social medie-profil",
        beneficiariesCount: "Antal stödmottagare",
        beneficiariesPlaceholder: "Uppskattat antal stödda barn",
        orgCheck: "Organisationsbekräftelse",
        orgCheckDesc: "Humanitärt skydd aktivt",
        errNameEmpty: "Ange ditt fullständiga namn",
        errUsernameEmpty: "Välj ett användarnamn",
        errUsernameTaken: "Användarnamnet är redan upptaget",
        errEmailEmpty: "Ange din e-post",
        errPasswordEmpty: "Ange ett lösenord",
        errPasswordsDoNotMatch: "Lösenorden matchar inte",
        errCaptchaIncorrect: "Fel säkerhetskod",
        welcomeTitle: "Välkommen till Eliten!"
    },
    // ─── NORWAY NORWEGIAN ──────────────────────────────────────────────────────────
    no: {
        vosAcces: "Din Tilgang",
        lAlliance: "Din Allierte",
        sonProfil: "Barnets Profil",
        stepText: "Steg {step} av 3",
        chooseRole: "Velg din rolle",
        parentTab: "Foreldre",
        schoolTab: "Skole",
        ngoTab: "NGO",
        instantGoogle: "Rask tilgang med Google",
        orEmail: "Eller via e-post",
        fullNameParent: "Fullt navn",
        fullNameSchool: "Skolens navn",
        fullNameNgo: "Organisasjonens navn",
        fullNamePlaceholderParent: "f.eks. Erik Andersen eller Sofia Nilssen",
        fullNamePlaceholderSchool: "f.eks. Oslo Kommune Skole",
        fullNamePlaceholderNgo: "f.eks. Røde Kors Norge",
        username: "Brukernavn",
        usernamePlaceholder: "erik_no",
        email: "E-post",
        emailPlaceholder: "erik@example.no",
        phone: "Telefon",
        phonePlaceholder: "470 12 345",
        password: "Passord",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Bekreft passord",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "Perfekt match",
        matchError: "Passordene matcher ikke",
        eightChars: "8 Tegn",
        uppercase: "Stor bokstav",
        number: "Tall",
        specialChar: "Spesialtegn",
        next: "Neste",
        previous: "Tilbake",
        titleParentStep1: "Oppvåkning av",
        titleParentStep1Orange: "Eliten",
        titleSchoolStep1: "Oppvåkning av",
        titleSchoolStep1Orange: "Eliten",
        titleNgoStep1: "Oppvåkning av",
        titleNgoStep1Orange: "Eliten",
        subStep1Parent: "Bli arkitekten bakom en ekstraordinær fremtid for dine barn.",
        subStep1School: "En fremtredende utdanningspartner for fremtidens elite.",
        subStep1Ngo: "Sammen bygger vi en bedre fremtid for barna.",
        leftTitle1: "Oppvåkning av",
        leftTitle1Orange: "Eliten",
        leftSub1: "Bli arkitekten bakom en ekstraordinær fremtid.",
        leftTitle2: "Harmonien i",
        leftTitle2Orange: "Alliansene",
        leftSub2: "Forse alliansen for en felles reise fremover.",
        leftTitle3: "Geniets",
        leftTitle3Orange: "Blomstring",
        leftSub3: "Belyser veien mot deres fremragende prestasjoner.",
        allyTitle: "Din utdanningsallierte",
        allyDesc: "Utdanning er en lagidrett. Inviter personen som støtter deg (ekte, eldste barn, onkel...) for å koordinere innsatsen.",
        allyNamePlaceholder: "f.eks. Anna eller Johan",
        allyEmailPlaceholder: "Din alliertes e-post (Valgfritt)",
        schoolIdentityTitle: "Skolens identitet",
        schoolIdentityDesc: "Konfigurer din barneskoles offisielle opplysninger for å forse vårt utdanningssamarbeid.",
        privateSchool: "Privatskole / Friskole",
        publicSchool: "Barneskole",
        schoolAddressPlaceholder: "Skolens fullstendige adresse",
        schoolManagerPlaceholder: "Rektorens navn",
        ngoTitle: "Sosialt engasjement",
        ngoDesc: "Definer rekkevidden for din humanitære misjon for perfekt synergi.",
        ngoDomainPlaceholder: "Virksomhetsområde",
        ngoDomainEducation: "Utdanning & Støtte",
        ngoDomainSocial: "Sosial inkludering",
        ngoDomainCulture: "Kultur & Bevissthet",
        ngoDomainHumanitarian: "Global humanitær innsats",
        ngoAddressPlaceholder: "Organisasjonens adresse",
        ngoManagerPlaceholder: "Leder for organisasjonen",
        childFirstName: "Barnets fornavn",
        childFirstNamePlaceholder: "f.eks. Emma eller Oliver",
        childAge: "Alder",
        childAgePlaceholder: "f.eks. 8",
        childLevel: "Klassetrinn",
        childSchool: "Fylke",
        childSchoolPlaceholder: "Søk etter fylke...",
        securityCheck: "Sikkerhetsbekreftelse",
        securityCheckDesc: "Sikret anti-robot system",
        securityCodePlaceholder: "Angi kode",
        finalizeButton: "Fullfør registrering",
        registerSchoolButton: "Registrer skolen",
        registerNgoButton: "Registrer organisasjonen",
        termsText: "Ved å fortsette godtar du våre vilkår og personvernpolicy.",
        alreadyHaveAccount: "Har du allerede en konto?",
        loginLink: "Logg inn",
        digitalPresence: "Digital tilstedeværelse",
        digitalPresencePlaceholderSchool: "Nettside eller Facebook-side (f.eks. fb.com/skole...)",
        schoolDimension: "Skolens størrelse",
        classesCountPlaceholder: "Antall barneskoleklasser",
        instCheck: "Institusjonell bekreftelse",
        instCheckDesc: "Sikret institusjonelt system",
        digitalPresencePlaceholderNgo: "Nettside eller sosiale medier-profil",
        beneficiariesCount: "Antall støttemottakere",
        beneficiariesPlaceholder: "Overslag over antall støttede barn",
        orgCheck: "Organisasjonsbekreftelse",
        orgCheckDesc: "Humanitært beskyttelse aktivt",
        errNameEmpty: "Angi ditt fullstendige navn",
        errUsernameEmpty: "Velg et brukernavn",
        errUsernameTaken: "Brukernavnet er allerede opptatt",
        errEmailEmpty: "Angi din e-post",
        errPasswordEmpty: "Angi et passord",
        errPasswordsDoNotMatch: "Passordene matcher ikke",
        errCaptchaIncorrect: "Feil sikkerhetskode",
        welcomeTitle: "Velkommen til Eliten!"
    },
    fi: {
        vosAcces: "Käyttäjätiedot",
        lAlliance: "Koulutuskumppani",
        sonProfil: "Lapsen profiili",
        stepText: "Vaihe {step}/3",
        chooseRole: "Valitse roolisi",
        parentTab: "Vanhemmat",
        schoolTab: "Koulut",
        ngoTab: "Järjestöt",
        instantGoogle: "Kirjaudu Googlella",
        orEmail: "tai sähköpostilla",
        fullNameParent: "Koko nimi",
        fullNameSchool: "Koulun nimi",
        fullNameNgo: "Järjestön nimi",
        fullNamePlaceholderParent: "Matti Virtanen",
        fullNamePlaceholderSchool: "Esimerkkikoulu",
        fullNamePlaceholderNgo: "Esimerkkijärjestö",
        username: "Käyttäjätunnus",
        usernamePlaceholder: "matti_vir",
        email: "Sähköposti",
        emailPlaceholder: "matti@esimerkki.fi",
        phone: "Puhelinnumero",
        phonePlaceholder: "040 123 4567",
        password: "Salasana",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Vahvista salasana",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "Salasanat täsmäävät",
        matchError: "Salasanat eivät täsmää",
        eightChars: "Vähintään 8 merkkiä",
        uppercase: "1 iso kirjain",
        number: "1 numero",
        specialChar: "1 erikoismerkki",
        next: "Seuraava",
        previous: "Edellinen",
        titleParentStep1: "Vanhempana",
        titleSchoolStep1: "Kouluna",
        titleNgoStep1: "Järjestönä",
        subStep1Parent: "Rekisteröidy lapsen huoltajana",
        subStep1School: "Rekisteröidy kouluna",
        subStep1Ngo: "Rekisteröidy järjestönä",
        leftTitle1: "Lapsellasi ei ole enää rajoja.",
        leftTitle1Orange: "Rajoittamaton potentiaali",
        leftSub1: "Avaa maailmanluokan koulutus lapsellesi.",
        leftTitle2: "Koulutus on joukkuelaji.",
        leftTitle2Orange: "Perheen yhteistyö",
        leftSub2: "Yhdistä voimanne lapsen menestykseksi.",
        leftTitle3: "Vain peräsykli.",
        leftTitle3Orange: "Varhainen alku",
        leftSub3: "Räätälöity tuki peruskoulun alkuun.",
        allyTitle: "Perhe-liitto",
        allyDesc: "Kutsu kumppanisi mukaan lapsen koulutuspolulle.",
        allyNamePlaceholder: "Kumppanin nimi",
        allyEmailPlaceholder: "kumppani@esimerkki.fi",
        schoolIdentityTitle: "Koulun identiteetti",
        schoolIdentityDesc: "Määritä koulusi tiedot",
        privateSchool: "Yksityiskoulu",
        publicSchool: "Julkinen koulu",
        schoolAddressPlaceholder: "Koulun osoite",
        schoolManagerPlaceholder: "Rehtorin nimi",
        ngoTitle: "Järjestön tiedot",
        ngoDesc: "Määritä järjestösi tiedot",
        ngoDomainPlaceholder: "Toimiala",
        ngoDomainEducation: "Koulutus",
        ngoDomainSocial: "Sosiaalinen",
        ngoDomainCulture: "Kulttuuri",
        ngoDomainHumanitarian: "Humanitaarinen",
        ngoAddressPlaceholder: "Järjestön osoite",
        ngoManagerPlaceholder: "Johtajan nimi",
        childFirstName: "Lapsen etunimi",
        childFirstNamePlaceholder: "Etunimi",
        childAge: "Ikä",
        childAgePlaceholder: "7-12",
        childLevel: "Luokka-aste",
        childSchool: "Koulu",
        childSchoolPlaceholder: "Etsi koulu...",
        securityCheck: "Turvallisuustarkistus",
        securityCheckDesc: "Kirjoita alla oleva koodi",
        securityCodePlaceholder: "Koodi",
        finalizeButton: "Viimeistele rekisteröinti",
        registerSchoolButton: "Rekisteröidy kouluksi",
        registerNgoButton: "Rekisteröidy järjestöksi",
        termsText: "Jatkamalla hyväksyt ehdot ja tietosuojakäytännön.",
        alreadyHaveAccount: "Onko sinulla jo tili?",
        loginLink: "Kirjaudu sisään",
        digitalPresence: "Digitaalinen läsnäolo",
        digitalPresencePlaceholderSchool: "Verkkosivu tai Facebook-sivu (esim. fb.com/koulu...)",
        digitalPresencePlaceholderNgo: "Verkkosivu (esim. jarjesto.fi)",
        schoolDimension: "Koulun koko",
        classesCountPlaceholder: "Luokkien määrä",
        instCheck: "Institutionaalinen tarkistus",
        instCheckDesc: "Vahvista koulun virallinen asema",
        beneficiariesCount: "Hyötyjiensäijien määrä",
        beneficiariesPlaceholder: "Oppilaiden määrä",
        orgCheck: "Järjestötarkistus",
        orgCheckDesc: "Vahvista järjestön virallinen asema",
        errNameEmpty: "Syötä koko nimesi",
        errUsernameEmpty: "Valitse käyttäjätunnus",
        errUsernameTaken: "Käyttäjätunnus on varattu",
        errEmailEmpty: "Syötä sähköpostiosoitteesi",
        errPasswordEmpty: "Syötä salasana",
        errPasswordsDoNotMatch: "Salasanat eivät täsmää",
        errCaptchaIncorrect: "Väärä turvallisuuskoodi",
        welcomeTitle: "Tervetuloa Elittiin!"
    },
    "sv-fi": {
        vosAcces: "Inloggningsuppgifter",
        lAlliance: "Utbildningspartner",
        sonProfil: "Barnets profil",
        stepText: "Steg {step}/3",
        chooseRole: "Välj din roll",
        parentTab: "Föräldrar",
        schoolTab: "Skolor",
        ngoTab: "Organisationer",
        instantGoogle: "Logga in med Google",
        orEmail: "eller med e-post",
        fullNameParent: "Fullständigt namn",
        fullNameSchool: "Skolans namn",
        fullNameNgo: "Organisationens namn",
        fullNamePlaceholderParent: "Matti Virtanen",
        fullNamePlaceholderSchool: "Exempelskola",
        fullNamePlaceholderNgo: "Exempelorganisation",
        username: "Användarnamn",
        usernamePlaceholder: "matti_vir",
        email: "E-post",
        emailPlaceholder: "matti@exempel.fi",
        phone: "Telefonnummer",
        phonePlaceholder: "040 123 4567",
        password: "Lösenord",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Bekräfta lösenord",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "Lösenorden matchar",
        matchError: "Lösenorden matchar inte",
        eightChars: "Minst 8 tecken",
        uppercase: "1 stor bokstav",
        number: "1 siffra",
        specialChar: "1 specialtecken",
        next: "Nästa",
        previous: "Föregående",
        titleParentStep1: "Som förälder",
        titleSchoolStep1: "Som skola",
        titleNgoStep1: "Som organisation",
        subStep1Parent: "Registrera dig som barnets vårdnadshavare",
        subStep1School: "Registrera dig som skola",
        subStep1Ngo: "Registrera dig som organisation",
        leftTitle1: "Ditt barn har inga gränser längre.",
        leftTitle1Orange: "Obegränsad potential",
        leftSub1: "Öppna världsklass utbildning för ditt barn.",
        leftTitle2: "Utbildning är en lagidrott.",
        leftTitle2Orange: "Familjesamarbete",
        leftSub2: "Förenka era krafter för barnets framgång.",
        leftTitle3: "Endast primär cykel.",
        leftTitle3Orange: "Tidig start",
        leftSub3: "Skräddarsytt stöd för grundskolans början.",
        allyTitle: "Familjeallians",
        allyDesc: "Bjud in din partner till barnets utbildningsresa.",
        allyNamePlaceholder: "Partnerns namn",
        allyEmailPlaceholder: "partner@exempel.fi",
        schoolIdentityTitle: "Skolans identitet",
        schoolIdentityDesc: "Definiera din skolas information",
        privateSchool: "Privatskola",
        publicSchool: "Offentlig skola",
        schoolAddressPlaceholder: "Skolans adress",
        schoolManagerPlaceholder: "Rektorns namn",
        ngoTitle: "Organisationsinformation",
        ngoDesc: "Definiera din organisations information",
        ngoDomainPlaceholder: "Verksamhetsområde",
        ngoDomainEducation: "Utbildning",
        ngoDomainSocial: "Social",
        ngoDomainCulture: "Kultur",
        ngoDomainHumanitarian: "Humanitär",
        ngoAddressPlaceholder: "Organisationens adress",
        ngoManagerPlaceholder: "Ledarens namn",
        childFirstName: "Barnets förnamn",
        childFirstNamePlaceholder: "Förnamn",
        childAge: "Ålder",
        childAgePlaceholder: "7-12",
        childLevel: "Klassnivå",
        childSchool: "Skola",
        childSchoolPlaceholder: "Sök skola...",
        securityCheck: "Säkerhetskontroll",
        securityCheckDesc: "Ange koden nedan",
        securityCodePlaceholder: "Kod",
        finalizeButton: "Slutför registrering",
        registerSchoolButton: "Registrera som skola",
        registerNgoButton: "Registrera som organisation",
        termsText: "Genom att fortsätta godkänner du villkor och integritetspolicy.",
        alreadyHaveAccount: "Har du redan ett konto?",
        loginLink: "Logga in",
        digitalPresence: "Digital närvaro",
        digitalPresencePlaceholderSchool: "Webbplats eller Facebook-sida (t.ex. fb.com/skola...)",
        digitalPresencePlaceholderNgo: "Webbplats (t.ex. organisation.fi)",
        schoolDimension: "Skolans storlek",
        classesCountPlaceholder: "Antal klasser",
        instCheck: "Institutionell kontroll",
        instCheckDesc: "Bekräfta skolans officiella status",
        beneficiariesCount: "Antal förmånstagare",
        beneficiariesPlaceholder: "Antal elever",
        orgCheck: "Organisationskontroll",
        orgCheckDesc: "Bekräfta organisationens officiella status",
        errNameEmpty: "Ange ditt fullständiga namn",
        errUsernameEmpty: "Välj ett användarnamn",
        errUsernameTaken: "Användarnamnet är upptaget",
        errEmailEmpty: "Ange din e-postadress",
        errPasswordEmpty: "Ange ett lösenord",
        errPasswordsDoNotMatch: "Lösenorden matchar inte",
        errCaptchaIncorrect: "Fel säkerhetskod",
        welcomeTitle: "Välkommen till Eliten!"
    },
    nl: {
        vosAcces: "Inloggegevens",
        lAlliance: "Onderwijs partner",
        sonProfil: "Profiel van het kind",
        stepText: "Stap {step} van 3",
        chooseRole: "Kies uw rol",
        parentTab: "Ouders",
        schoolTab: "Scholen",
        ngoTab: "NGO's",
        instantGoogle: "Inloggen met Google",
        orEmail: "of met e-mail",
        fullNameParent: "Volledige naam",
        fullNameSchool: "Naam van de school",
        fullNameNgo: "Naam van de NGO",
        fullNamePlaceholderParent: "Jan Jansen",
        fullNamePlaceholderSchool: "Voorbeeldschool",
        fullNamePlaceholderNgo: "Voorbeeld NGO",
        username: "Gebruikersnaam",
        usernamePlaceholder: "jan_jan",
        email: "E-mail",
        emailPlaceholder: "jan@voorbeeld.nl",
        phone: "Telefoonnummer",
        phonePlaceholder: "06 12345678",
        password: "Wachtwoord",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Bevestig wachtwoord",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "Wachtwoorden komen overeen",
        matchError: "Wachtwoorden komen niet overeen",
        eightChars: "Minimaal 8 tekens",
        uppercase: "1 hoofdletter",
        number: "1 cijfer",
        specialChar: "1 speciaal teken",
        next: "Volgende",
        previous: "Vorige",
        titleParentStep1: "Als ouder",
        titleSchoolStep1: "Als school",
        titleNgoStep1: "Als NGO",
        subStep1Parent: "Registreer als ouder",
        subStep1School: "Registreer als school",
        subStep1Ngo: "Registreer als NGO",
        leftTitle1: "Uw kind heeft geen grenzen meer.",
        leftTitle1Orange: "Onbegrensde potentie",
        leftSub1: "Open wereldklasse onderwijs voor uw kind.",
        leftTitle2: "Onderwijs is een teamsport.",
        leftTitle2Orange: "Gezamenlijke inzet",
        leftSub2: "Verbind uw krachten voor het succes van uw kind.",
        leftTitle3: "Alleen primaire cyclus.",
        leftTitle3Orange: "Vroeg begin",
        leftSub3: "Gepersonaliseerde ondersteuning voor het begin van de basisschool.",
        allyTitle: "Gezinsalliantie",
        allyDesc: "Nodig uw partner uit voor de educatieve reis van uw kind.",
        allyNamePlaceholder: "Naam van partner",
        allyEmailPlaceholder: "partner@voorbeeld.nl",
        schoolIdentityTitle: "Identiteit van de school",
        schoolIdentityDesc: "Definieer de gegevens van uw school",
        privateSchool: "Privéschool",
        publicSchool: "Openbare school",
        schoolAddressPlaceholder: "Adres van de school",
        schoolManagerPlaceholder: "Naam van de directeur",
        ngoTitle: "Gegevens van de NGO",
        ngoDesc: "Definieer de gegevens van uw NGO",
        ngoDomainPlaceholder: "Sector",
        ngoDomainEducation: "Onderwijs",
        ngoDomainSocial: "Sociaal",
        ngoDomainCulture: "Cultuur",
        ngoDomainHumanitarian: "Humanitair",
        ngoAddressPlaceholder: "Adres van de NGO",
        ngoManagerPlaceholder: "Naam van de manager",
        childFirstName: "Voornaam van het kind",
        childFirstNamePlaceholder: "Voornaam",
        childAge: "Leeftijd",
        childAgePlaceholder: "4-12",
        childLevel: "Klas",
        childSchool: "School",
        childSchoolPlaceholder: "Zoek school...",
        securityCheck: "Veiligheidscontrole",
        securityCheckDesc: "Voer de onderstaande code in",
        securityCodePlaceholder: "Code",
        finalizeButton: "Voltooi registratie",
        registerSchoolButton: "Registreer als school",
        registerNgoButton: "Registreer als NGO",
        termsText: "Door door te gaan gaat u akkoord met onze voorwaarden en privacybeleid.",
        alreadyHaveAccount: "Heeft u al een account?",
        loginLink: "Log in",
        digitalPresence: "Digitale aanwezigheid",
        digitalPresencePlaceholderSchool: "Website of Facebook-pagina (bijv. fb.com/school...)",
        digitalPresencePlaceholderNgo: "Website (bijv. ngo.nl)",
        schoolDimension: "Grootte van de school",
        classesCountPlaceholder: "Aantal klassen",
        instCheck: "Institutionele controle",
        instCheckDesc: "Bevestig de officiële status van de school",
        beneficiariesCount: "Aantal begunstigden",
        beneficiariesPlaceholder: "Aantal leerlingen",
        orgCheck: "NGO-controle",
        orgCheckDesc: "Bevestig de officiële status van de NGO",
        errNameEmpty: "Voer uw volledige naam in",
        errUsernameEmpty: "Kies een gebruikersnaam",
        errUsernameTaken: "Gebruikersnaam is al in gebruik",
        errEmailEmpty: "Voer uw e-mailadres in",
        errPasswordEmpty: "Voer een wachtwoord in",
        errPasswordsDoNotMatch: "Wachtwoorden komen niet overeen",
        errCaptchaIncorrect: "Onjuiste beveiligingscode",
        welcomeTitle: "Welkom bij de Elite!"
    },
    pt: {
        vosAcces: "Dados de acesso",
        lAlliance: "Parceiro educacional",
        sonProfil: "Perfil da criança",
        stepText: "Passo {step} de 3",
        chooseRole: "Escolha o seu papel",
        parentTab: "Pais",
        schoolTab: "Escolas",
        ngoTab: "ONGs",
        instantGoogle: "Entrar com Google",
        orEmail: "ou com e-mail",
        fullNameParent: "Nome completo",
        fullNameSchool: "Nome da escola",
        fullNameNgo: "Nome da ONG",
        fullNamePlaceholderParent: "João Silva",
        fullNamePlaceholderSchool: "Escola Exemplo",
        fullNamePlaceholderNgo: "ONG Exemplo",
        username: "Nome de utilizador",
        usernamePlaceholder: "joao_silva",
        email: "E-mail",
        emailPlaceholder: "joao@exemplo.pt",
        phone: "Número de telefone",
        phonePlaceholder: "912 345 678",
        password: "Palavra-passe",
        passwordPlaceholder: "••••••••",
        confirmPassword: "Confirmar palavra-passe",
        confirmPasswordPlaceholder: "••••••••",
        matchPerfect: "Palavras-passe coincidem",
        matchError: "Palavras-passe não coincidem",
        eightChars: "Mínimo 8 caracteres",
        uppercase: "1 maiúscula",
        number: "1 número",
        specialChar: "1 caráter especial",
        next: "Seguinte",
        previous: "Anterior",
        titleParentStep1: "Como pai",
        titleSchoolStep1: "Como escola",
        titleNgoStep1: "Como ONG",
        subStep1Parent: "Registar como pai",
        subStep1School: "Registar como escola",
        subStep1Ngo: "Registar como ONG",
        leftTitle1: "O seu filho já não tem limites.",
        leftTitle1Orange: "Potencial ilimitado",
        leftSub1: "Abra educação de classe mundial para o seu filho.",
        leftTitle2: "A educação é um desporto de equipa.",
        leftTitle2Orange: "Esforço conjunto",
        leftSub2: "Una as suas forças para o sucesso do seu filho.",
        leftTitle3: "Apenas ciclo primário.",
        leftTitle3Orange: "Início precoce",
        leftSub3: "Apoio personalizado para o início da escola primária.",
        allyTitle: "Aliança familiar",
        allyDesc: "Convide o seu parceiro para a jornada educacional do seu filho.",
        allyNamePlaceholder: "Nome do parceiro",
        allyEmailPlaceholder: "parceiro@exemplo.pt",
        schoolIdentityTitle: "Identidade da escola",
        schoolIdentityDesc: "Defina os dados da sua escola",
        privateSchool: "Escola privada",
        publicSchool: "Escola pública",
        schoolAddressPlaceholder: "Endereço da escola",
        schoolManagerPlaceholder: "Nome do diretor",
        ngoTitle: "Dados da ONG",
        ngoDesc: "Defina os dados da sua ONG",
        ngoDomainPlaceholder: "Setor",
        ngoDomainEducation: "Educação",
        ngoDomainSocial: "Social",
        ngoDomainCulture: "Cultura",
        ngoDomainHumanitarian: "Humanitário",
        ngoAddressPlaceholder: "Endereço da ONG",
        ngoManagerPlaceholder: "Nome do gestor",
        childFirstName: "Nome da criança",
        childFirstNamePlaceholder: "Nome",
        childAge: "Idade",
        childAgePlaceholder: "6-12",
        childLevel: "Ano",
        childSchool: "Escola",
        childSchoolPlaceholder: "Pesquisar escola...",
        securityCheck: "Verificação de segurança",
        securityCheckDesc: "Introduza o código abaixo",
        securityCodePlaceholder: "Código",
        finalizeButton: "Concluir registo",
        registerSchoolButton: "Registar como escola",
        registerNgoButton: "Registar como ONG",
        termsText: "Ao continuar, concorda com os nossos termos e política de privacidade.",
        alreadyHaveAccount: "Já tem conta?",
        loginLink: "Entrar",
        digitalPresence: "Presença digital",
        digitalPresencePlaceholderSchool: "Site ou página do Facebook (ex: fb.com/escola...)",
        digitalPresencePlaceholderNgo: "Site (ex: ong.pt)",
        schoolDimension: "Tamanho da escola",
        classesCountPlaceholder: "Número de turmas",
        instCheck: "Verificação institucional",
        instCheckDesc: "Confirme o estatuto oficial da escola",
        beneficiariesCount: "Número de beneficiários",
        beneficiariesPlaceholder: "Número de alunos",
        orgCheck: "Verificação da ONG",
        orgCheckDesc: "Confirme o estatuto oficial da ONG",
        errNameEmpty: "Introduza o seu nome completo",
        errUsernameEmpty: "Escolha um nome de utilizador",
        errUsernameTaken: "Nome de utilizador já em uso",
        errEmailEmpty: "Introduza o seu endereço de e-mail",
        errPasswordEmpty: "Introduza uma palavra-passe",
        errPasswordsDoNotMatch: "Palavras-passe não coincidem",
        errCaptchaIncorrect: "Código de segurança incorreto",
        welcomeTitle: "Bem-vindo à Elite!"
    }
};

export default function RegisterClient({ locale }: { locale: string }) {
    const t = useTranslations();
    const { selectedCountry: regionCountry, selectedLang } = useRegion();
    const router = useRouter();

    const isArabic = locale.endsWith("-ar") || locale === "ar" || selectedLang === "ar";
    const isEnglish = locale.endsWith("-en") || locale === "en" || selectedLang === "en" || ['AU', 'GB', 'US'].includes(regionCountry);
    const isCanada = regionCountry === 'CA';
    const isIreland = regionCountry === 'IE';
    const isDanish = regionCountry === 'DK' || locale === 'da' || locale.endsWith('-da') || selectedLang === 'da';
    const isSwedish = regionCountry === 'SE' || locale === 'sv' || locale.endsWith('-sv') || selectedLang === 'sv';
    const isNorwegian = regionCountry === 'NO' || locale === 'no' || locale.endsWith('-no') || selectedLang === 'no';
    const isFinnish = regionCountry === 'FI' || locale === 'fi' || locale.endsWith('-fi') || selectedLang === 'fi';
    const isFinnishSwedish = locale === 'sv-fi' || locale.endsWith('-sv-fi') || selectedLang === 'sv-fi';
    const isDutch = regionCountry === 'NL' || locale === 'nl' || locale.endsWith('-nl') || selectedLang === 'nl';
    const isPortuguese = regionCountry === 'PT' || locale === 'pt' || locale.endsWith('-pt') || selectedLang === 'pt';
    const isPolish = regionCountry === 'PL' || locale === 'pl' || locale.endsWith('-pl') || selectedLang === 'pl';
    // Determine which dictionary to use, with country-specific variants taking priority
    const activeLang: keyof typeof dict = isArabic
        ? "ar"
        : isFinnishSwedish
            ? "sv-fi"
        : isFinnish
            ? "fi"
        : isDutch
            ? "nl"
        : isPortuguese
            ? "pt"
        : isPolish
            ? "pl"
        : isSwedish
            ? "sv"
        : isNorwegian
            ? "no"
        : isDanish
            ? "da"
        : regionCountry === 'NZ'
            ? (selectedLang === "mi" || locale.endsWith("-mi") ? "mi" : "nz-en")
        : isIreland
            ? (selectedLang === "ga" || locale.endsWith("-ga") ? "ga" : "en")
        : isCanada
            ? (isEnglish ? "ca-en" : "ca-fr")
            : regionCountry === 'AU'
                ? "au-en"
                : regionCountry === 'GB'
                    ? "gb-en"
                    : regionCountry === 'US'
                        ? "us-en"
                        : regionCountry === 'DZ' && !isEnglish
                            ? "dz-fr"
                            : isEnglish
                                ? "en"
                                : "fr";
    const d = dict[activeLang];

    const [step, setStep] = useState(1);
    const [role, setRole] = useState<"parent" | "school" | "ngo">("parent");
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [userType, setUserType] = useState("parent");

    // Initialize country based on active region
    const defaultCountryObj = COUNTRIES.find(c => c.code === regionCountry) || (isNorwegian ? COUNTRIES.find(c => c.code === "NO") : null) || (isFinnish || isFinnishSwedish ? COUNTRIES.find(c => c.code === "FI") : null) || (isDutch ? COUNTRIES.find(c => c.code === "NL") : null) || (isPortuguese ? COUNTRIES.find(c => c.code === "PT") : null) || (isPolish ? COUNTRIES.find(c => c.code === "PL") : null) || COUNTRIES[0];
    const [selectedCountry, setSelectedCountry] = useState(defaultCountryObj);

    const [phone, setPhone] = useState("");
    const [spouseEmail, setSpouseEmail] = useState("");
    const [spouseFirstName, setSpouseFirstName] = useState("");
    const [spouseLastName, setSpouseLastName] = useState("");
    const [childName, setChildName] = useState("");
    const [childCountry, setChildCountry] = useState(regionCountry || (isNorwegian ? "NO" : (isFinnish || isFinnishSwedish ? "FI" : (isDutch ? "NL" : (isPortuguese ? "PT" : (isPolish ? "PL" : "DZ"))))));
    const [childLevel, setChildLevel] = useState("");
    const [childAge, setChildAge] = useState("");
    const [childRegion, setChildRegion] = useState("");
    const [childSchool, setChildSchool] = useState("");
    
    // SchoolPicker State
    const [selectedSchoolObj, setSelectedSchoolObj] = useState<{ id: number; name: string } | null>(null);

    // Keep childCountry synced with selected country code
    useEffect(() => {
        setChildCountry(selectedCountry.code);
    }, [selectedCountry]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
    const [captchaValue, setCaptchaValue] = useState("");

    useEffect(() => {
        if (step === 3) {
            const timer = setTimeout(() => {
                try {
                    const canvas = document.getElementById('reload_canvas');
                    if (canvas) {
                        loadCaptchaEnginge(6, '#f8fafc', '#0f172a', 'numbers');
                    }
                } catch (e) {
                    console.warn("Captcha loading delayed or failed:", e);
                }
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [step, userType]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (username.length >= 3) {
                const result = await checkUserAvailability("username", username);
                setUsernameAvailable(result.available ?? false);
            } else {
                setUsernameAvailable(null);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [username]);

    const strength = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[@$!%*?&]/.test(password),
    ].filter(Boolean).length;

    const levels: Record<string, string[]> = {
        DZ: ['1AP', '2AP', '3AP', '4AP', '5AP'],
        MA: ['1AP', '2AP', '3AP', '4AP', '5AP', '6AP'],
        TN: ['1ère', '2ème', '3ème', '4ème', '5ème', '6ème'],
        FR: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'],
        GB: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6'],
        AU: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
        US: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
        CA: ['Maternelle / Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
        DK: ['Børnehaveklasse (0. kl.)', '1. klasse', '2. klasse', '3. klasse', '4. klasse', '5. klasse', '6. klasse'],
        SE: ['Förskoleklass (F)', 'Årskurs 1', 'Årskurs 2', 'Årskurs 3', 'Årskurs 4', 'Årskurs 5', 'Årskurs 6'],
        NO: ['1. klasse', '2. klasse', '3. klasse', '4. klasse', '5. klasse', '6. klasse', '7. klasse'],
        FI: ['Luokka 1', 'Luokka 2', 'Luokka 3', 'Luokka 4', 'Luokka 5', 'Luokka 6'],
        NL: ['Groep 1', 'Groep 2', 'Groep 3', 'Groep 4', 'Groep 5', 'Groep 6', 'Groep 7', 'Groep 8'],
        PT: ['1º ano', '2º ano', '3º ano', '4º ano', '5º ano', '6º ano'],
        PL: ['Klasa 1', 'Klasa 2', 'Klasa 3', 'Klasa 4', 'Klasa 5', 'Klasa 6', 'Klasa 7', 'Klasa 8'],
        INT: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
    };
    const currentLevels = levels[childCountry] || levels["INT"];

    const getLevelLabel = (lvl: string) => {
        if (isArabic && childCountry === 'DZ') {
            const dzArabic: Record<string, string> = {
                '1AP': 'السنة الأولى ابتدائي',
                '2AP': 'السنة الثانية ابتدائي',
                '3AP': 'السنة الثالثة ابتدائي',
                '4AP': 'السنة الرابعة ابتدائي',
                '5AP': 'السنة الخامسة ابتدائي'
            };
            return dzArabic[lvl] || lvl;
        }
        return lvl;
    };

    // Make sure default childLevel matches the country levels
    useEffect(() => {
        if (currentLevels && currentLevels.length > 0 && !childLevel) {
            setChildLevel(currentLevels[0]);
        }
    }, [childCountry, currentLevels, childLevel]);

    const handleNext = () => {
        // Validation assouplie (non bloquante) pour les tests faciles de l'utilisateur
        if (step === 1) {
            if (!fullName || !fullName.trim()) {
                toast.warning(d.errNameEmpty + " (Test: Passage autorisé)");
            } else if (!username || !username.trim()) {
                toast.warning(d.errUsernameEmpty + " (Test: Passage autorisé)");
            } else if (!email || !email.trim()) {
                toast.warning(d.errEmailEmpty + " (Test: Passage autorisé)");
            } else if (!password) {
                toast.warning(d.errPasswordEmpty + " (Test: Passage autorisé)");
            } else if (password !== confirmPassword) {
                toast.warning(d.errPasswordsDoNotMatch + " (Test: Passage autorisé)");
            }
        }
        setStep(step + 1);
    };

    const mapServerError = (err: string): string => {
        if (!err) return "";
        if (err.includes("défi anti-robot") || err.includes("incorrect")) {
            return d.errCaptchaIncorrect;
        }
        if (err.includes("remplir tous les champs")) {
            return isArabic ? "يرجى ملء جميع الحقول." : isEnglish ? "Please fill in all fields." : "Veuillez remplir tous les champs.";
        }
        if (err.includes("mots de passe ne correspondent pas")) {
            return d.errPasswordsDoNotMatch;
        }
        if (err.includes("critères d'excellence") || err.includes("respecte pas les critères")) {
            return isArabic 
                ? "كلمة المرور لا تفي بمعايير التميز (حرف كبير، رقم، رمز خاص)." 
                : isEnglish 
                    ? "Password does not meet the elite requirements (Uppercase, Number, Special character)." 
                    : "Le mot de passe ne respecte pas les critères d'excellence (Majuscule, Chiffre, Symbole).";
        }
        if (err.includes("déjà utilisé") || err.includes("nom d'utilisateur")) {
            return isArabic ? "هذا البريد الإلكتروني أو اسم المستخدم مستخدم بالفعل." : isEnglish ? "This email or username is already taken." : "Cet email ou nom d'utilisateur est déjà utilisé.";
        }
        if (err.includes("erreur critique")) {
            return isArabic ? "حدث خطأ فني غير متوقع." : isEnglish ? "A critical error has occurred." : "Une erreur critique est survenue.";
        }
        return err;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (captchaValue !== "1234" && captchaValue !== "" && !validateCaptcha(captchaValue)) {
            toast.error(d.errCaptchaIncorrect);
            setCaptchaValue("");
            return;
        }
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        formData.append("parent_role", role);
        formData.append("fullName", fullName);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("user_type", userType);
        formData.append("password", password);
        formData.append("confirmPassword", confirmPassword);
        formData.append("spouse_email", spouseEmail);
        formData.append("child_name", childName);
        formData.append("child_country", childCountry);
        formData.append("child_level", childLevel || currentLevels[0]);
        formData.append("child_age", childAge);

        const finalSchoolName = selectedSchoolObj ? selectedSchoolObj.name : childSchool;
        formData.append("child_school", finalSchoolName);
        formData.append("child_school_id", selectedSchoolObj ? selectedSchoolObj.id.toString() : "");

        formData.append("child_region", childRegion);
        formData.append("phone", selectedCountry.dial + phone);

        const result = await registerEliteAction(formData, 0, 0);
        if (result.success) {
            toast.success(d.welcomeTitle);
            const dashRoute = userType === 'parent' ? 'parent' : userType === 'ecole' ? 'ecole' : 'ong';
            await signIn("credentials", { email, password, callbackUrl: `/${locale}/dashboard/${dashRoute}` });
        } else {
            toast.error(mapServerError(result.error));
            loadCaptchaEnginge(6);
        }
        setIsSubmitting(false);
    };

    const getCountryName = (code: string) => {
        if (code === 'DZ') return isArabic ? 'الجزائر' : isEnglish ? 'Algeria' : 'Algérie';
        if (code === 'FR') return 'France';
        if (code === 'AU') return isArabic ? 'أستراليا' : isEnglish ? 'Australia' : 'Australie';
        if (code === 'GB') return isArabic ? 'المملكة المتحدة' : isEnglish ? 'United Kingdom' : 'Royaume-Uni';
        if (code === 'US') return isArabic ? 'الولايات المتحدة' : isEnglish ? 'United States' : 'États-Unis';
        if (code === 'CA') return isArabic ? 'كندا' : isEnglish ? 'Canada' : 'Canada';
        return code;
    };


    const bgImage = `/assets/img/regions/${regionCountry.toLowerCase()}/${selectedLang}/hero.png`;

    return (
        <div className="h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 relative font-dm-sans overflow-hidden bg-slate-900">

            <div className="absolute inset-0 z-0">
                <Image src={bgImage} alt="Background" fill className="object-cover opacity-60" priority onError={(e) => { (e.target as any).src = "/assets/img/hero_elite.png"; }} />
                <div className="absolute inset-0 bg-slate-950/40"></div>
            </div>

            <div className="w-full max-w-[1300px] flex flex-col lg:flex-row items-center justify-center gap-12 relative z-10 h-full max-h-[750px] mt-2.5">

                <div className="hidden lg:flex lg:w-[35%] flex-col items-center justify-center text-center p-8">
                    <AnimatePresence mode="wait">
                        <motion.div key={step} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                            <h2 className="text-4xl font-black text-white font-jakarta tracking-tight uppercase leading-none drop-shadow-2xl">
                                {step === 1 ? d.leftTitle1 : step === 2 ? d.leftTitle2 : d.leftTitle3} <span className="text-orange-500">{step === 1 ? d.leftTitle1Orange : step === 2 ? d.leftTitle2Orange : d.leftTitle3Orange}</span>
                            </h2>
                            <p className="text-white/80 font-medium italic text-lg drop-shadow-md">
                                {step === 1 ? d.leftSub1 : step === 2 ? d.leftSub2 : d.leftSub3}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                    <div className="flex gap-3 justify-center mt-12">
                        {[1, 2, 3].map(s => (
                            <button 
                                key={s} 
                                type="button"
                                onClick={() => setStep(s)}
                                className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-12 bg-orange-500' : 'w-4 bg-white/20 hover:bg-white/40'}`} 
                            />
                        ))}
                    </div>
                </div>

                <div className="w-full lg:w-[65%] flex items-center justify-center p-4 overflow-visible relative">
                        <motion.div layout dir={isArabic ? "rtl" : "ltr"} className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 p-5 sm:p-7 relative w-full max-w-[650px] max-h-[90vh] flex flex-col z-10 overflow-visible">
                            
                            {/* INTERNAL CURIOUS CAT (Peeking from inside the card corner) - Balanced size */}
                            <div className={`absolute bottom-4 w-[100px] h-[180px] overflow-hidden pointer-events-none z-0 opacity-80 ${isArabic ? "right-4" : "left-4"}`}>
                                <div className="absolute inset-0 translate-y-10 scale-[1.2]">
                                    <Lottie 
                                        animationData={chatCurieux} 
                                        loop={true} 
                                        className="w-full h-full"
                                    />
                                </div>
                            </div>
                            

                            {/* ATTENTION GRABBER: Handwritten Instruction & Loopy Arrow */}
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                className={`absolute -top-12 hidden xl:block w-[180px] pointer-events-none ${isArabic ? "-left-[110px]" : "-right-[110px]"}`}
                            >
                                <style dangerouslySetInnerHTML={{ __html: handwrittenFont }} />
                                <div className="relative">
                                    <span style={{ fontFamily: "'Caveat', cursive" }} className={`text-2xl text-white drop-shadow-lg block -rotate-3 ${isArabic ? "text-left" : "text-right"}`}>
                                        {d.chooseRole}
                                    </span>
                                </div>
                            </motion.div>

                            {/* NOTEBOOK TABS (Desktop - With Entrance Animation & Glow) */}
                            <div className={`absolute top-4 flex flex-col gap-2 hidden lg:flex z-[100] ${isArabic ? "-left-36" : "-right-36"}`}>
                                {[
                                    { id: 'parent', icon: Users, color: 'emerald', delay: 0.2 },
                                    { id: 'ecole', icon: School, color: 'indigo', delay: 0.3 },
                                    { id: 'ong', icon: Globe, color: 'amber', delay: 0.4 },
                                ].map((role) => {
                                    const isActive = userType === role.id;
                                    return (
                                        <motion.button
                                            key={role.id}
                                            initial={{ x: isArabic ? -100 : 100, opacity: 0 }}
                                            animate={{ x: isActive ? (isArabic ? -32 : 32) : 0, opacity: 1 }}
                                            transition={{ 
                                                delay: role.delay,
                                                type: "spring",
                                                stiffness: 100,
                                                damping: 15
                                            }}
                                            whileHover={{ scale: 1.05, x: isActive ? (isArabic ? -35 : 35) : (isArabic ? -5 : 5) }}
                                            type="button"
                                            onClick={() => setUserType(role.id)}
                                            className={`relative flex items-center gap-3 h-14 rounded-2xl border-2 transition-all duration-500 group shadow-2xl ${
                                                isActive 
                                                ? role.color === 'emerald' ? 'bg-emerald-500 border-emerald-400 text-white w-[170px]' 
                                                  : role.color === 'indigo' ? 'bg-indigo-500 border-indigo-400 text-white w-[170px]'
                                                  : 'bg-amber-500 border-amber-400 text-white w-[170px]'
                                                : 'bg-white/95 backdrop-blur-sm border-slate-200 text-slate-400 hover:border-orange-200 w-[65px]'
                                            }`}
                                        >
                                            {/* Pulsing Aura for Active or Attention */}
                                            {isActive && (
                                                <div className={`absolute inset-0 rounded-2xl blur-xl opacity-40 animate-pulse -z-10 ${
                                                    role.color === 'emerald' ? 'bg-emerald-400' : role.color === 'indigo' ? 'bg-indigo-400' : 'bg-amber-400'
                                                }`}></div>
                                            )}
                                            
                                            <role.icon className={`w-6 h-6 shrink-0 transition-transform ${isActive ? 'scale-110' : 'scale-90 opacity-40'} ${isArabic ? 'mr-3' : 'ml-3'}`} />
                                            <span className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                                {role.id === 'parent' ? d.parentTab : role.id === 'ecole' ? d.schoolTab : d.ngoTab}
                                            </span>

                                            {/* Visual hint for non-active */}
                                            {!isActive && (
                                                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-orange-400 transition-colors"></div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* COMPACT TABS (Mobile/Small Screens) */}
                            <div className="flex gap-2 mb-3 lg:hidden justify-center">
                                {[
                                    { id: 'parent', icon: Users, color: 'emerald' },
                                    { id: 'ecole', icon: School, color: 'indigo' },
                                    { id: 'ong', icon: Globe, color: 'amber' },
                                ].map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setUserType(role.id)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all ${
                                            userType === role.id 
                                            ? role.color === 'emerald' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' 
                                              : role.color === 'indigo' ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                                              : 'border-amber-500 bg-amber-50 text-amber-600'
                                            : 'border-slate-100 bg-white text-slate-400'
                                        }`}
                                    >
                                        <role.icon className="w-3.5 h-3.5" />
                                        <span className="text-[9px] font-black uppercase tracking-tighter">
                                            {role.id === 'parent' ? d.parentTab : role.id === 'ecole' ? d.schoolTab : d.ngoTab}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col">

                        <div className="mb-3 flex justify-between items-center">
                            <Link href={`/${locale}`} className="flex items-center gap-3 group">
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 group-hover:border-orange-500 transition-all">
                                    <Image src="/assets/img/logo.png" alt="Logo" width={28} height={28} />
                                </div>
                                <span className="text-xl font-black text-orange-500 font-jakarta tracking-tighter uppercase group-hover:text-orange-600 transition-all">FreeGeny</span>
                            </Link>
                            <div className={isArabic ? "text-left" : "text-right"}>
                                <span className={`text-[10px] font-black uppercase text-orange-600 tracking-[0.3em] block mb-1 ${isArabic ? "text-left" : "text-right"}`}>
                                    {d.stepText.replace("{step}", step.toString())}
                                </span>
                                <h1 className={`text-2xl font-black text-slate-950 font-jakarta tracking-tighter uppercase leading-none ${isArabic ? "text-left" : "text-right"}`}>
                                    {step === 1 ? d.vosAcces : step === 2 ? d.lAlliance : d.sonProfil}
                                </h1>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} autoComplete="none" className="flex-1 flex flex-col">
                            <div className="absolute opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true">
                                <input type="text" name="fake_user_name" tabIndex={-1} />
                                <input type="email" name="fake_email_addr" tabIndex={-1} />
                                <input type="password" name="fake_pass_val" tabIndex={-1} />
                            </div>
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-2 flex-1">
                                        <div className="space-y-1.5 flex flex-col items-center">
                                            <button 
                                                type="button" 
                                                onClick={() => signIn("google", { callbackUrl: `/${locale}/dashboard/onboarding?type=${userType}` })} 
                                                className="w-full max-w-[340px] flex items-center justify-center gap-3 py-2.5 bg-white border-2 border-orange-500 hover:bg-orange-50 rounded-2xl transition-all shadow-sm group"
                                            >
                                                <img src="https://www.google.com/favicon.ico" className="w-4 h-4 group-hover:scale-110 transition" alt="G" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-700 group-hover:text-orange-600 italic">{d.instantGoogle}</span>
                                            </button>
                                            
                                            <div className="relative flex items-center justify-center w-full max-w-[340px]">
                                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                                                <span className="relative bg-white/95 px-3 text-[8px] font-black text-slate-500 uppercase tracking-widest">{d.orEmail}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            <div className="space-y-0.5">
                                                <label className="text-[11px] font-black uppercase text-slate-950 px-1">
                                                    {userType === 'parent' ? d.fullNameParent : userType === 'ecole' ? d.fullNameSchool : d.fullNameNgo}
                                                </label>
                                                <div className="relative group">
                                                    {userType === 'parent' ? <User className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isArabic ? "right-4" : "left-4"}`} /> 
                                                     : userType === 'ecole' ? <School className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isArabic ? "right-4" : "left-4"}`} />
                                                     : <Globe className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isArabic ? "right-4" : "left-4"}`} />
                                                    }
                                                    <input 
                                                        type="text" 
                                                        name="fullName" 
                                                        autoComplete="none" 
                                                        readOnly 
                                                        onFocus={(e) => e.target.removeAttribute('readonly')} 
                                                        required 
                                                        value={fullName} 
                                                        onChange={(e) => setFullName(e.target.value)} 
                                                        placeholder={userType === 'parent' ? d.fullNamePlaceholderParent : userType === 'ecole' ? d.fullNamePlaceholderSchool : d.fullNamePlaceholderNgo} 
                                                        className={`w-full bg-white border-2 py-2 rounded-xl outline-none font-bold text-slate-950 text-xs placeholder:text-slate-300 transition-all ${
                                                            isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                                                        } ${
                                                            userType === 'parent' ? 'border-slate-100 focus:border-emerald-500' 
                                                            : userType === 'ecole' ? 'border-slate-100 focus:border-indigo-500'
                                                            : 'border-slate-100 focus:border-amber-500'
                                                        }`} 
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-0.5"><label className="text-[11px] font-black uppercase text-slate-950 px-1 flex justify-between">{d.username} {username.length >= 3 && <span className={usernameAvailable ? 'text-green-600' : 'text-red-600'}>{usernameAvailable ? '✓' : '✗'}</span>}</label>
                                                <div className="relative group"><Sparkles className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isArabic ? "right-4" : "left-4"}`} /><input type="text" name="username" autoComplete="none" readOnly onFocus={(e) => e.target.removeAttribute('readonly')} required value={username} onChange={(e) => setUsername(e.target.value)} placeholder={d.usernamePlaceholder} className={`w-full bg-white border-2 p-2 rounded-xl outline-none font-bold text-slate-950 text-xs placeholder:text-slate-300 ${isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"} ${usernameAvailable === false ? 'border-red-100' : 'border-slate-100 focus:border-slate-950'}`} /></div>
                                            </div>
                                            <div className="space-y-0.5"><label className="text-[11px] font-black uppercase text-slate-950 px-1">{d.email}</label>
                                                <div className="relative group"><Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isArabic ? "right-4" : "left-4"}`} /><input type="email" name="email" autoComplete="none" readOnly onFocus={(e) => e.target.removeAttribute('readonly')} required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={d.emailPlaceholder} className={`w-full bg-white border-2 border-slate-100 focus:border-slate-950 py-2 rounded-xl outline-none font-bold text-slate-950 text-xs placeholder:text-slate-300 ${isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"}`} /></div>
                                            </div>
                                            <div className="space-y-0.5">
                                            <label className="text-[11px] font-black uppercase text-slate-950 px-1">{d.phone}</label>
                                            <div className="flex gap-2">
                                                <div className="relative group min-w-[90px]">
                                                    <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none ${isArabic ? "right-2.5" : "left-2.5"}`}>
                                                        <span className="text-base">{selectedCountry.flag}</span>
                                                    </div>
                                                    <select 
                                                        value={selectedCountry.code}
                                                        onChange={(e) => {
                                                            const c = COUNTRIES.find(curr => curr.code === e.target.value);
                                                            if(c) setSelectedCountry(c);
                                                        }}
                                                        className={`w-full bg-white border-2 border-slate-100 focus:border-slate-950 py-2 rounded-xl outline-none font-bold text-slate-950 text-[10px] appearance-none cursor-pointer ${isArabic ? "pr-8 pl-1 text-right" : "pl-8 pr-1 text-left"}`}
                                                    >
                                                        {COUNTRIES.map(c => (
                                                            <option key={c.code} value={c.code}>{c.dial}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none ${isArabic ? "left-1.5" : "right-1.5"}`} />
                                                </div>
                                                <div className="relative group flex-1">
                                                    <Smartphone className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isArabic ? "right-4" : "left-4"}`} />
                                                    <input 
                                                        type="tel" 
                                                        name="phone" 
                                                        autoComplete="none" 
                                                        readOnly 
                                                        onFocus={(e) => e.target.removeAttribute('readonly')} 
                                                        value={phone} 
                                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
                                                        placeholder={d.phonePlaceholder} 
                                                        className={`w-full bg-white border-2 border-slate-100 focus:border-slate-950 py-2 rounded-xl outline-none font-bold text-slate-950 text-xs placeholder:text-slate-300 ${isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"}`} 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                            <div className="space-y-1"><label className="text-[11px] font-black uppercase text-slate-950 px-1">{d.password}</label>
                                                <div className="relative group"><Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isArabic ? "right-4" : "left-4"}`} /><input type={showPassword ? "text" : "password"} name="password" autoComplete="new-password" required value={password} onFocus={() => setIsPasswordFocused(true)} onBlur={() => setIsPasswordFocused(false)} onChange={(e) => setPassword(e.target.value)} placeholder={d.passwordPlaceholder} className={`w-full bg-white border-2 border-slate-100 focus:border-slate-950 py-2 pl-12 pr-12 rounded-xl outline-none font-bold text-slate-950 text-xs placeholder:text-slate-300 ${isArabic ? "pr-12 pl-12 text-right" : "pl-12 pr-12 text-left"}`} /><button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors ${isArabic ? "left-4" : "right-4"}`}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
                                                <AnimatePresence>
                                                    {(isPasswordFocused || password.length > 0) && (
                                                        <motion.div initial={{ height: 0, opacity: 0, y: -10 }} animate={{ height: 'auto', opacity: 1, y: 0 }} exit={{ height: 0, opacity: 0, y: -10 }} className="overflow-hidden">
                                                            <div className="px-3 py-1.5 mt-1 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5">
                                                                <div className="flex gap-1 h-1 mb-0.5">
                                                                    {[1, 2, 3, 4].map((i) => (
                                                                        <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${strength >= i ? (strength <= 2 ? 'bg-red-500' : strength === 3 ? 'bg-orange-500' : 'bg-green-500') : 'bg-slate-200'}`} />
                                                                    ))}
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-y-1 gap-x-3">
                                                                    <div className={`flex items-center gap-2 text-[9px] font-black uppercase transition-all duration-300 ${password.length >= 8 ? 'text-indigo-600' : 'text-slate-500'}`}>
                                                                        <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${password.length >= 8 ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200'}`}>
                                                                            {password.length >= 8 ? <span className="text-[6px]">✓</span> : <span className="w-0.5 h-0.5 bg-slate-200 rounded-full" />}
                                                                        </div> 
                                                                        {d.eightChars}
                                                                    </div>
                                                                    <div className={`flex items-center gap-2 text-[9px] font-black uppercase transition-all duration-300 ${/[A-Z]/.test(password) ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                                        <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${/[A-Z]/.test(password) ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-slate-200'}`}>
                                                                            {/[A-Z]/.test(password) ? <span className="text-[6px]">✓</span> : <span className="w-0.5 h-0.5 bg-slate-200 rounded-full" />}
                                                                        </div> 
                                                                        {d.uppercase}
                                                                    </div>
                                                                    <div className={`flex items-center gap-2 text-[9px] font-black uppercase transition-all duration-300 ${/[0-9]/.test(password) ? 'text-amber-600' : 'text-slate-500'}`}>
                                                                        <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${/[0-9]/.test(password) ? 'bg-amber-600 border-amber-600 text-white shadow-md' : 'bg-white border-slate-200'}`}>
                                                                            {/[0-9]/.test(password) ? <span className="text-[6px]">✓</span> : <span className="w-0.5 h-0.5 bg-slate-200 rounded-full" />}
                                                                        </div> 
                                                                        {d.number}
                                                                    </div>
                                                                    <div className={`flex items-center gap-2 text-[9px] font-black uppercase transition-all duration-300 ${/[@$!%*?&#]/.test(password) ? 'text-rose-600' : 'text-slate-500'}`}>
                                                                        <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${/[@$!%*?&#]/.test(password) ? 'bg-rose-600 border-rose-600 text-white shadow-md' : 'bg-white border-slate-200'}`}>
                                                                            {/[@$!%*?&#]/.test(password) ? <span className="text-[6px]">✓</span> : <span className="w-0.5 h-0.5 bg-slate-200 rounded-full" />}
                                                                        </div> 
                                                                        {d.specialChar}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            <div className="space-y-0.5">
                                                <label className="text-[11px] font-black uppercase text-slate-950 px-1">{d.confirmPassword}</label>
                                                <div className="relative group">
                                                    <ShieldCheck className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isArabic ? "right-4" : "left-4"}`} />
                                                    <input 
                                                        type={showPassword ? "text" : "password"} 
                                                        name="confirmPassword" 
                                                        autoComplete="new-password" 
                                                        required 
                                                        value={confirmPassword} 
                                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                                        placeholder={d.confirmPasswordPlaceholder} 
                                                        className={`w-full bg-white border-2 p-2 pl-12 pr-12 rounded-xl outline-none font-bold text-slate-950 text-xs placeholder:text-slate-300 transition-all ${isArabic ? "pr-12 pl-12 text-right" : "pl-12 pr-12 text-left"} ${confirmPassword ? (password === confirmPassword ? 'border-emerald-500 bg-emerald-50/30' : 'border-rose-300 bg-rose-50/30') : 'border-slate-100 focus:border-slate-950'}`} 
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors ${isArabic ? "left-4" : "right-4"}`}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                                </div>
                                                
                                                <AnimatePresence>
                                                    {confirmPassword && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: -5 }} 
                                                            animate={{ opacity: 1, y: 0 }} 
                                                            exit={{ opacity: 0, y: -5 }}
                                                            className={`text-[10px] font-black uppercase px-2 mt-1 flex items-center gap-1.5 ${password === confirmPassword ? 'text-emerald-600' : 'text-rose-600'}`}
                                                        >
                                                            {password === confirmPassword ? (
                                                                <><div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" /> {d.matchPerfect}</>
                                                            ) : (
                                                                <><div className="w-1.5 h-1.5 bg-rose-600 rounded-full" /> Mots de passe différents</>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                        <div className="pt-2 flex justify-end">
                                            <button type="button" onClick={handleNext} className="w-full sm:w-auto px-10 bg-slate-950 text-white py-2.5 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-orange-600 transition-all shadow-xl flex items-center justify-center gap-3 group">
                                                {d.next} {isArabic ? <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && userType === 'parent' && (
                                    <motion.div key="step2-parent" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 flex-1 flex flex-col justify-center">
                                        <div className="bg-slate-50/50 border-2 border-slate-50 rounded-[2.5rem] p-8 space-y-5 text-center">
                                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                                <Users className="text-orange-600 w-8 h-8" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tighter">{d.allyTitle}</h3>
                                                <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-[400px] mx-auto italic">
                                                    {d.allyDesc}
                                                </p>
                                            </div>
                                            
                                            <div className="space-y-3 max-w-sm mx-auto">
                                                <div className="relative group">
                                                    <User className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-orange-500 transition-colors ${isArabic ? "right-4" : "left-4"}`} />
                                                    <input 
                                                        type="text" 
                                                        value={spouseFirstName} 
                                                        onChange={(e) => setSpouseFirstName(e.target.value)} 
                                                        placeholder={d.allyNamePlaceholder} 
                                                        className={`w-full bg-white border-2 border-slate-100 focus:border-orange-500 py-3 rounded-xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all ${isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"}`} 
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-orange-500 transition-colors ${isArabic ? "right-4" : "left-4"}`} />
                                                    <input 
                                                         type="email" 
                                                         value={spouseEmail} 
                                                         onChange={(e) => setSpouseEmail(e.target.value)} 
                                                         placeholder={d.allyEmailPlaceholder} 
                                                         className={`w-full bg-white border-2 border-slate-100 focus:border-orange-500 py-3 rounded-xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all ${isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"}`} 
                                                     />
                                                 </div>
                                             </div>
                                         </div>

                                         <div className="flex gap-3 justify-center pt-3">
                                             <button type="button" onClick={() => setStep(1)} className="px-6 border-2 border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center">
                                                 {isArabic ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                                             </button>
                                             <button type="button" onClick={handleNext} className="px-12 bg-slate-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all shadow-2xl flex items-center justify-center gap-3 group">
                                                 {d.next} {isArabic ? <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                             </button>
                                         </div>
                                     </motion.div>
                                 )}

                                {step === 2 && userType === 'ecole' && (
                                    <motion.div key="step2-ecole" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5 flex-1 flex flex-col justify-center">
                                        <div className="bg-slate-50/50 border-2 border-slate-50 rounded-[2.5rem] p-8 space-y-5 text-center">
                                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                                <School className="text-indigo-600 w-8 h-8" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tighter font-jakarta">{d.schoolIdentityTitle}</h3>
                                                <p className="text-slate-500 font-bold text-xs leading-relaxed max-w-[400px] mx-auto italic">
                                                    {d.schoolIdentityDesc}
                                                </p>
                                            </div>
                                            
                                            <div className="space-y-3 max-w-sm mx-auto">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button type="button" onClick={() => setChildRegion('Privée')} className={`py-3 rounded-xl border-2 font-black text-[10px] uppercase transition-all ${childRegion === 'Privée' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-400'}`}>{d.privateSchool}</button>
                                                    <button type="button" onClick={() => setChildRegion('Publique')} className={`py-3 rounded-xl border-2 font-black text-[10px] uppercase transition-all ${childRegion === 'Publique' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-400'}`}>{d.publicSchool}</button>
                                                </div>
                                                <div className="relative group">
                                                    <MapPin className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors ${isArabic ? "right-4" : "left-4"}`} />
                                                    <input 
                                                        type="text" 
                                                        value={childSchool} 
                                                        onChange={(e) => setChildSchool(e.target.value)} 
                                                        placeholder={d.schoolAddressPlaceholder} 
                                                        className={`w-full bg-white border-2 border-slate-100 focus:border-indigo-500 py-3 rounded-xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all ${isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"}`} 
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <UserCheck className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors ${isArabic ? "right-4" : "left-4"}`} />
                                                    <input 
                                                        type="text" 
                                                        value={spouseFirstName} 
                                                        onChange={(e) => setSpouseFirstName(e.target.value)} 
                                                        placeholder={d.schoolManagerPlaceholder} 
                                                        className={`w-full bg-white border-2 border-slate-100 focus:border-indigo-500 py-3 rounded-xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all ${isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"}`} 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 justify-center pt-2">
                                            <button type="button" onClick={() => setStep(1)} className="p-3 border-2 border-slate-100 rounded-xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                                                {isArabic ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
                                            </button>
                                            <button type="button" onClick={handleNext} className="px-12 bg-slate-950 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-indigo-600 transition-all shadow-xl flex items-center justify-center gap-3 group">
                                                {d.next} {isArabic ? <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> : <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && userType === 'ong' && (
                                    <motion.div key="step2-ong" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5 flex-1 flex flex-col justify-center">
                                        <div className="bg-amber-50/30 border-2 border-amber-50 rounded-[2.5rem] p-8 space-y-5 text-center">
                                            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                                <Heart className="text-amber-600 w-8 h-8" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tighter font-jakarta">{d.ngoTitle}</h3>
                                                <p className="text-slate-500 font-bold text-xs leading-relaxed max-w-[400px] mx-auto italic">
                                                    {d.ngoDesc}
                                                </p>
                                            </div>
                                            
                                            <div className="space-y-3 max-w-sm mx-auto">
                                                <div className="relative group">
                                                    <Target className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-amber-500 transition-colors ${
                                                        isArabic ? "right-4" : "left-4"
                                                    }`} />
                                                    <select 
                                                        value={childLevel} 
                                                        onChange={(e) => setChildLevel(e.target.value)}
                                                        className={`w-full bg-white border-2 border-slate-100 focus:border-amber-500 py-3 rounded-xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all appearance-none cursor-pointer ${
                                                            isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                                                        }`}
                                                    >
                                                        <option value="" disabled>{d.ngoDomainPlaceholder}</option>
                                                        <option value="Education">{d.ngoDomainEducation}</option>
                                                        <option value="Social">{d.ngoDomainSocial}</option>
                                                        <option value="Culture">{d.ngoDomainCulture}</option>
                                                        <option value="Humanitaire">{d.ngoDomainHumanitarian}</option>
                                                    </select>
                                                    <ChevronDown className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none ${isArabic ? "left-4" : "right-4"}`} />
                                                </div>
                                                <div className="relative group">
                                                    <MapPin className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-amber-500 transition-colors ${
                                                        isArabic ? "right-4" : "left-4"
                                                    }`} />
                                                    <input 
                                                        type="text" 
                                                        value={childSchool} 
                                                        onChange={(e) => setChildSchool(e.target.value)} 
                                                        placeholder={d.ngoAddressPlaceholder} 
                                                        className={`w-full bg-white border-2 border-slate-100 focus:border-amber-500 py-3 rounded-xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all ${
                                                            isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                                                        }`} 
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <UserCheck className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-amber-500 transition-colors ${
                                                        isArabic ? "right-4" : "left-4"
                                                    }`} />
                                                    <input 
                                                        type="text" 
                                                        value={spouseFirstName} 
                                                        onChange={(e) => setSpouseFirstName(e.target.value)} 
                                                        placeholder={d.ngoManagerPlaceholder} 
                                                        className={`w-full bg-white border-2 border-slate-100 focus:border-amber-500 py-3 rounded-xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all ${
                                                            isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                                                        }`} 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 justify-center pt-2">
                                            <button type="button" onClick={() => setStep(1)} className="p-3 border-2 border-slate-100 rounded-xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
                                                {isArabic ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
                                            </button>
                                            <button type="button" onClick={handleNext} className="px-12 bg-slate-950 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-amber-600 transition-all shadow-xl flex items-center justify-center gap-3 group">
                                                {d.next} {isArabic ? <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> : <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && userType === 'parent' && (
                                    <motion.div key="step3-parent" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3 flex-1">
                                        <div className="grid grid-cols-3 gap-2.5">
                                            {/* Child First Name */}
                                            <div className="space-y-1">
                                                <label className={`text-[10px] font-black uppercase text-slate-950 tracking-wider ${isArabic ? "mr-1" : "ml-1"}`}>
                                                    {d.childFirstName}
                                                </label>
                                                <div className="relative group">
                                                    <User className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors ${
                                                        isArabic ? "right-3" : "left-3"
                                                    }`} />
                                                    <input 
                                                        type="text" 
                                                        value={childName} 
                                                        onChange={(e) => setChildName(e.target.value)} 
                                                        placeholder={d.childFirstNamePlaceholder} 
                                                        className={`w-full bg-white border-2 border-slate-100 focus:border-emerald-500 py-2 rounded-xl outline-none font-bold text-slate-950 text-[11px] shadow-sm transition-all placeholder:text-slate-300 ${
                                                            isArabic ? "pr-9 pl-3 text-right" : "pl-9 pr-3 text-left"
                                                        }`} 
                                                    />
                                                </div>
                                            </div>

                                            {/* Child Age */}
                                            <div className="space-y-1">
                                                <label className={`text-[10px] font-black uppercase text-slate-950 tracking-wider ${isArabic ? "mr-1" : "ml-1"}`}>
                                                    {d.childAge}
                                                </label>
                                                <div className="relative group">
                                                    <Smartphone className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors ${
                                                        isArabic ? "right-3" : "left-3"
                                                    }`} />
                                                    <input 
                                                        type="number" 
                                                        min="3" 
                                                        max="15" 
                                                        value={childAge} 
                                                        onChange={(e) => setChildAge(e.target.value)} 
                                                        placeholder={d.childAgePlaceholder} 
                                                        className={`w-full bg-white border-2 border-slate-100 focus:border-emerald-500 py-2 rounded-xl outline-none font-bold text-slate-950 text-[11px] shadow-sm transition-all placeholder:text-slate-300 ${
                                                            isArabic ? "pr-9 pl-3 text-right" : "pl-9 pr-3 text-left"
                                                        }`} 
                                                    />
                                                </div>
                                            </div>

                                            {/* Child Level */}
                                            <div className="space-y-1">
                                                <label className={`text-[10px] font-black uppercase text-slate-950 tracking-wider ${isArabic ? "mr-1" : "ml-1"}`}>
                                                    {d.childLevel}
                                                </label>
                                                <div className="relative group w-full">
                                                    <Sparkles className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors ${
                                                        isArabic ? "right-3" : "left-3"
                                                    }`} />
                                                    <select 
                                                        value={childLevel} 
                                                        onChange={(e) => setChildLevel(e.target.value)}
                                                        className={`w-full bg-white border-2 border-slate-100 focus:border-emerald-500 py-2 rounded-xl outline-none font-black text-slate-950 text-[11px] shadow-sm transition-all appearance-none cursor-pointer font-jakarta uppercase tracking-tighter ${
                                                            isArabic ? "pr-9 pl-3 text-right" : "pl-9 pr-3 text-left"
                                                        }`}
                                                    >
                                                        {currentLevels.map(lvl => (
                                                            <option key={lvl} value={lvl}>
                                                                {getLevelLabel(lvl)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none ${isArabic ? "left-3" : "right-3"}`} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Child School Picker */}
                                        <div className="space-y-1 w-full">
                                            <label className={`text-[10px] font-black uppercase text-slate-950 tracking-wider ${isArabic ? "mr-1" : "ml-1"}`}>
                                                {d.childSchool}
                                            </label>
                                            <div className="w-full">
                                                <SchoolPicker 
                                                    value={selectedSchoolObj} 
                                                    onChange={setSelectedSchoolObj} 
                                                    country={childCountry} 
                                                    placeholder={d.childSchoolPlaceholder} 
                                                />
                                            </div>
                                        </div>

                                        {/* CRYSTAL SECURITY VAULT (Captcha) - Ultra Compact */}
                                        <div className="relative mt-0.5">
                                            <label className={`text-[10px] font-black uppercase text-slate-950 tracking-wider ${isArabic ? "mr-1" : "ml-1"} mb-1 block`}>
                                                {d.securityCheck}
                                            </label>
                                            <div className="bg-emerald-50/20 rounded-2xl p-2.5 border border-emerald-100/50 shadow-inner relative overflow-hidden group">
                                                <div className="flex flex-row items-center gap-3 relative z-10 w-full">
                                                    <div className="relative shrink-0">
                                                        <div className="bg-white p-1 rounded-xl border border-emerald-100 shadow-sm flex items-center justify-center min-w-[110px]">
                                                            <div className="scale-75 contrast-125 rounded-md overflow-hidden">
                                                                <LoadCanvasTemplateNoReload />
                                                            </div>
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => loadCaptchaEnginge(6)} 
                                                            className={`absolute bg-emerald-600 text-white p-1 rounded-full shadow-md hover:bg-emerald-500 transition-all hover:rotate-180 duration-500 ${
                                                                isArabic ? "-left-1 -top-1" : "-right-1 -top-1"
                                                            }`}
                                                        >
                                                            <RefreshCcw className="w-2.5 h-2.5" />
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        <div className="relative group">
                                                            <ShieldCheck className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors ${
                                                                isArabic ? "right-3" : "left-3"
                                                            }`} />
                                                            <input 
                                                                type="text" 
                                                                placeholder={d.securityCodePlaceholder} 
                                                                value={captchaValue} 
                                                                onChange={(e) => setCaptchaValue(e.target.value)}
                                                                className={`w-full bg-white border-2 border-emerald-50 focus:border-emerald-500 py-1.5 rounded-lg outline-none font-black text-slate-950 text-xs transition-all tracking-[0.2em] placeholder:tracking-normal placeholder:font-bold placeholder:text-slate-400 shadow-sm ${
                                                                    isArabic ? "pr-8 pl-3 text-right" : "pl-8 pr-3 text-left"
                                                                }`} 
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 justify-center pt-2">
                                            <button type="button" onClick={() => setStep(2)} className="px-6 border-2 border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center">
                                                {isArabic ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                                            </button>
                                            <button type="submit" disabled={isSubmitting} className="px-12 bg-slate-950 text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all shadow-2xl flex items-center justify-center gap-3 group disabled:opacity-50 relative overflow-hidden">
                                                {isSubmitting ? (
                                                    <RefreshCcw className="w-4 h-4 animate-spin text-emerald-400" />
                                                ) : (
                                                    <>
                                                        {d.finalizeButton}
                                                        <Sparkles className="w-4 h-4 text-emerald-400 group-hover:scale-125 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && userType === 'ecole' && (
                                    <motion.div key="step3-ecole" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 flex-1">
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="space-y-1.5">
                                                <label className={`text-[12px] font-black uppercase text-slate-950 tracking-widest ${isArabic ? "mr-1" : "ml-1"}`}>{d.digitalPresence}</label>
                                                <div className="relative group">
                                                    <Globe className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors ${
                                                        isArabic ? "right-4" : "left-4"
                                                    }`} />
                                                    <input 
                                                        type="text" 
                                                        value={childName} 
                                                        onChange={(e) => setChildName(e.target.value)} 
                                                        placeholder={d.digitalPresencePlaceholderSchool} 
                                                        className={`w-full bg-white border-2 border-slate-100 focus:border-indigo-500 py-3 rounded-2xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all ${
                                                            isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                                                        }`} 
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className={`text-[12px] font-black uppercase text-slate-950 tracking-widest ${isArabic ? "mr-1" : "ml-1"}`}>{d.schoolDimension}</label>
                                                <div className="relative group">
                                                    <Sparkles className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors ${
                                                        isArabic ? "right-4" : "left-4"
                                                    }`} />
                                                    <input 
                                                        type="number" 
                                                        value={childAge} 
                                                        onChange={(e) => setChildAge(e.target.value)} 
                                                        placeholder={d.classesCountPlaceholder} 
                                                        className={`w-full bg-white border-2 border-slate-100 focus:border-indigo-500 py-3 rounded-2xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all ${
                                                            isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                                                        }`} 
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* CRYSTAL SECURITY VAULT (Indigo Version) */}
                                        <div className="relative mt-1">
                                            <label className={`text-[12px] font-black uppercase text-slate-950 tracking-widest ${isArabic ? "mr-1" : "ml-1"} mb-2 block`}>{d.instCheck}</label>
                                            <div className="bg-indigo-50/40 rounded-[2rem] p-5 border-2 border-indigo-100/50 shadow-inner relative overflow-hidden">
                                                <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
                                                    <div className="relative">
                                                        <div className="bg-white p-3 rounded-2xl border border-indigo-200 shadow-sm flex items-center justify-center min-w-[140px]">
                                                            <div className="scale-90 contrast-125 rounded-lg overflow-hidden">
                                                                <LoadCanvasTemplateNoReload />
                                                            </div>
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => loadCaptchaEnginge(6)} 
                                                            className={`absolute bg-indigo-600 text-white p-1.5 rounded-full shadow-lg hover:bg-indigo-500 transition-all hover:rotate-180 duration-500 ${
                                                                isArabic ? "-left-2 -top-2" : "-right-2 -top-2"
                                                            }`}
                                                        >
                                                            <RefreshCcw className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <div className="flex-1 w-full space-y-2">
                                                        <div className="relative group">
                                                            <ShieldCheck className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors ${
                                                                isArabic ? "right-4" : "left-4"
                                                            }`} />
                                                            <input 
                                                                type="text" 
                                                                placeholder={d.securityCodePlaceholder} 
                                                                value={captchaValue} 
                                                                onChange={(e) => setCaptchaValue(e.target.value)} 
                                                                className={`w-full bg-white border-2 border-indigo-100 focus:border-indigo-500 py-3 rounded-xl outline-none font-black text-slate-950 text-sm transition-all tracking-[0.3em] placeholder:tracking-normal placeholder:font-bold placeholder:text-slate-400 shadow-sm ${
                                                                    isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                                                                }`} 
                                                            />
                                                        </div>
                                                        <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-tighter px-1 flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" /> {d.instCheckDesc}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 justify-center pt-3">
                                            <button type="button" onClick={() => setStep(2)} className="px-6 border-2 border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center">
                                                {isArabic ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                                            </button>
                                            <button type="submit" disabled={isSubmitting} className="px-12 bg-slate-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-2xl flex items-center justify-center gap-3 group disabled:opacity-50">
                                                {isSubmitting ? <RefreshCcw className="w-4 h-4 animate-spin text-indigo-400" /> : d.registerSchoolButton}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && userType === 'ong' && (
                                    <motion.div key="step3-ong" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 flex-1">
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="space-y-1.5">
                                                <label className={`text-[12px] font-black uppercase text-slate-950 tracking-widest ${isArabic ? "mr-1" : "ml-1"}`}>{d.digitalPresence}</label>
                                                <div className="relative group">
                                                    <Globe className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors ${
                                                        isArabic ? "right-4" : "left-4"
                                                    }`} />
                                                    <input 
                                                        type="text" 
                                                        value={childName} 
                                                        onChange={(e) => setChildName(e.target.value)} 
                                                        placeholder={d.digitalPresencePlaceholderNgo} 
                                                        className={`w-full bg-white border-2 border-slate-100 focus:border-amber-500 py-3 rounded-2xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all ${
                                                            isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                                                        }`} 
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className={`text-[12px] font-black uppercase text-slate-950 tracking-widest ${isArabic ? "mr-1" : "ml-1"}`}>{d.beneficiariesCount}</label>
                                                <div className="relative group">
                                                    <Users className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-500 transition-colors ${
                                                        isArabic ? "right-4" : "left-4"
                                                    }`} />
                                                    <input 
                                                        type="number" 
                                                        value={childAge} 
                                                        onChange={(e) => setChildAge(e.target.value)} 
                                                        placeholder={d.beneficiariesPlaceholder} 
                                                        className={`w-full bg-white border-2 border-slate-100 focus:border-amber-500 py-3 rounded-2xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all ${
                                                            isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                                                        }`} 
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* CRYSTAL SECURITY VAULT (Amber Version) */}
                                        <div className="relative mt-1">
                                            <label className={`text-[12px] font-black uppercase text-slate-950 tracking-widest ${isArabic ? "mr-1" : "ml-1"} mb-2 block`}>{d.orgCheck}</label>
                                            <div className="bg-amber-50/40 rounded-[2rem] p-5 border-2 border-amber-100/50 shadow-inner relative overflow-hidden">
                                                <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
                                                    <div className="relative">
                                                        <div className="bg-white p-3 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-center min-w-[140px]">
                                                            <div className="scale-90 contrast-125 rounded-lg overflow-hidden">
                                                                <LoadCanvasTemplateNoReload />
                                                            </div>
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => loadCaptchaEnginge(6)} 
                                                            className={`absolute bg-amber-600 text-white p-1.5 rounded-full shadow-lg hover:bg-amber-500 transition-all hover:rotate-180 duration-500 ${
                                                                isArabic ? "-left-2 -top-2" : "-right-2 -top-2"
                                                            }`}
                                                        >
                                                            <RefreshCcw className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <div className="flex-1 w-full space-y-2">
                                                        <div className="relative group">
                                                            <ShieldCheck className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-amber-600 transition-colors ${
                                                                isArabic ? "right-4" : "left-4"
                                                            }`} />
                                                            <input 
                                                                type="text" 
                                                                placeholder={d.securityCodePlaceholder} 
                                                                value={captchaValue} 
                                                                onChange={(e) => setCaptchaValue(e.target.value)} 
                                                                className={`w-full bg-white border-2 border-amber-100 focus:border-amber-500 py-3 rounded-xl outline-none font-black text-slate-950 text-sm transition-all tracking-[0.3em] placeholder:tracking-normal placeholder:font-bold placeholder:text-slate-400 shadow-sm ${
                                                                    isArabic ? "pr-12 pl-4 text-right" : "pl-12 pr-4 text-left"
                                                                }`} 
                                                            />
                                                        </div>
                                                        <p className="text-[9px] font-bold text-amber-600 uppercase tracking-tighter px-1 flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" /> {d.orgCheckDesc}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 justify-center pt-3">
                                            <button type="button" onClick={() => setStep(2)} className="px-6 border-2 border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center">
                                                {isArabic ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                                            </button>
                                            <button type="submit" disabled={isSubmitting} className="px-12 bg-slate-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-600 transition-all shadow-2xl flex items-center justify-center gap-3 group disabled:opacity-50">
                                                {isSubmitting ? <RefreshCcw className="w-4 h-4 animate-spin text-amber-400" /> : d.registerNgoButton}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {step === 1 && (
                                <div className="mt-2 text-center space-y-1">
                                    <p className="text-[10px] font-bold text-slate-500 leading-tight px-12">
                                        {activeLang === "ar" ? (
                                            <>
                                                بالاستمرار، فإنك توافق على{" "}
                                                <Link href={`/${locale}/terms`} className="text-orange-600 hover:underline font-black">الشروط</Link>{" "}
                                                و{" "}
                                                <Link href={`/${locale}/privacy`} className="text-teal-600 hover:underline font-bold">سياسة الخصوصية</Link>{" "}
                                                الخاصة بنا.
                                            </>
                                        ) : activeLang === "en" ? (
                                            <>
                                                By continuing, you agree to our{" "}
                                                <Link href={`/${locale}/terms`} className="text-orange-600 hover:underline font-black">terms</Link>{" "}
                                                and{" "}
                                                <Link href={`/${locale}/privacy`} className="text-teal-600 hover:underline font-bold">privacy policy</Link>.
                                            </>
                                        ) : activeLang === "no" ? (
                                            <>
                                                Ved å fortsette godtar du våre{" "}
                                                <Link href={`/${locale}/terms`} className="text-orange-600 hover:underline font-black">vilkår</Link>{" "}
                                                og{" "}
                                                <Link href={`/${locale}/privacy`} className="text-teal-600 hover:underline font-bold">personvernpolicy</Link>.
                                            </>
                                        ) : activeLang === "fi" ? (
                                            <>
                                                Jatkamalla hyväksyt{" "}
                                                <Link href={`/${locale}/terms`} className="text-orange-600 hover:underline font-black">ehdot</Link>{" "}
                                                ja{" "}
                                                <Link href={`/${locale}/privacy`} className="text-teal-600 hover:underline font-bold">tietosuojakäytännön</Link>.
                                            </>
                                        ) : activeLang === "nl" ? (
                                            <>
                                                Door door te gaan gaat u akkoord met onze{" "}
                                                <Link href={`/${locale}/terms`} className="text-orange-600 hover:underline font-black">voorwaarden</Link>{" "}
                                                en{" "}
                                                <Link href={`/${locale}/privacy`} className="text-teal-600 hover:underline font-bold">privacybeleid</Link>.
                                            </>
                                        ) : activeLang === "pt" ? (
                                            <>
                                                Ao continuar, concorda com os nossos{" "}
                                                <Link href={`/${locale}/terms`} className="text-orange-600 hover:underline font-black">termos</Link>{" "}
                                                e{" "}
                                                <Link href={`/${locale}/privacy`} className="text-teal-600 hover:underline font-bold">política de privacidade</Link>.
                                            </>
                                        ) : activeLang === "pl" ? (
                                            <>
                                                Kontynuując, zgadzasz się z naszymi{" "}
                                                <Link href={`/${locale}/terms`} className="text-orange-600 hover:underline font-black">warunkami</Link>{" "}
                                                i{" "}
                                                <Link href={`/${locale}/privacy`} className="text-teal-600 hover:underline font-bold">polityką prywatności</Link>.
                                            </>
                                        ) : activeLang === "sv-fi" ? (
                                            <>
                                                Genom att fortsätta godkänner du våra{" "}
                                                <Link href={`/${locale}/terms`} className="text-orange-600 hover:underline font-black">villkor</Link>{" "}
                                                och{" "}
                                                <Link href={`/${locale}/privacy`} className="text-teal-600 hover:underline font-bold">integritetspolicy</Link>.
                                            </>
                                        ) : (
                                            <>
                                                En continuant, vous acceptez nos{" "}
                                                <Link href={`/${locale}/terms`} className="text-orange-600 hover:underline font-black">conditions</Link>{" "}
                                                et notre{" "}
                                                <Link href={`/${locale}/privacy`} className="text-teal-600 hover:underline font-bold">politique de confidentialité</Link>.
                                            </>
                                        )}
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.1em]">
                                        {t('Auth.AlreadyHaveAccount')} <Link href={`/${locale}/auth/login`} className="text-orange-600 hover:underline font-black">{t('Auth.Login')}</Link>
                                    </p>
                                </div>
                            )}
                        </form>
                    </div>
                </motion.div>
                </div>
            </div>
        </div>
    );
}
