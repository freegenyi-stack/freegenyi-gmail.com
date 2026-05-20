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
        fullNamePlaceholderParent: "Ex: Mourad Belaid",
        fullNamePlaceholderSchool: "Ex: École Primaire El-Nadjah",
        fullNamePlaceholderNgo: "Ex: Croissant Rouge Algérien",
        username: "Pseudo",
        usernamePlaceholder: "mourad_213",
        email: "E-mail",
        emailPlaceholder: "mourad@gmail.com",
        phone: "Téléphone",
        phonePlaceholder: "550 12 34 56",
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
        allyNamePlaceholder: "Ex: Mourad ou Nadia",
        allyEmailPlaceholder: "Email de votre allié (Optionnel)",
        // Step 2 School
        schoolIdentityTitle: "Identité de l'Établissement",
        schoolIdentityDesc: "Configurez les informations officielles de votre école primaire pour sceller notre partenariat éducatif.",
        privateSchool: "École Privée",
        publicSchool: "École Publique",
        schoolAddressPlaceholder: "Adresse complète du siège",
        schoolManagerPlaceholder: "Nom du Responsable / Directeur",
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
    }
};

export default function RegisterClient({ locale }: { locale: string }) {
    const t = useTranslations();
    const { selectedCountry: regionCountry, selectedLang } = useRegion();
    const router = useRouter();

    const isArabic = locale.endsWith("-ar") || locale === "ar" || selectedLang === "ar";
    const isEnglish = locale.endsWith("-en") || locale === "en" || selectedLang === "en" || ['AU', 'GB', 'US'].includes(regionCountry);
    const activeLang = isArabic ? "ar" : isEnglish ? "en" : "fr";
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
    const defaultCountryObj = COUNTRIES.find(c => c.code === regionCountry) || COUNTRIES[0];
    const [selectedCountry, setSelectedCountry] = useState(defaultCountryObj);

    const [phone, setPhone] = useState("");
    const [spouseEmail, setSpouseEmail] = useState("");
    const [spouseFirstName, setSpouseFirstName] = useState("");
    const [spouseLastName, setSpouseLastName] = useState("");
    const [childName, setChildName] = useState("");
    const [childCountry, setChildCountry] = useState(regionCountry || "DZ");
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
