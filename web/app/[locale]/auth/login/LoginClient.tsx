"use client";
 
import { Link } from "@/i18n/routing";
import React, { useState } from "react";
import { sgHeroImagePath } from "@/lib/sgGeoLabels";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRegion } from "@/context/RegionContext";

export default function LoginClient({ locale }: { locale: string }) {
  const t = useTranslations();
  const { selectedCountry, selectedLang } = useRegion();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEnglish = selectedLang === "en" || locale === "en" || locale.endsWith("-en");
  const isArabic = selectedLang === "ar" || locale === "ar" || locale.endsWith("-ar");
  const isMaori = selectedLang === "mi" || locale === "mi" || locale.endsWith("-mi");
  const isIrish = selectedLang === "ga" || locale === "ga" || locale.endsWith("-ga");
  const isDanish = selectedLang === "da" || locale === "da" || locale.endsWith("-da");
  const isSwedish = selectedLang === "sv" || locale === "sv" || locale.endsWith("-sv");
  const isNorwegian = selectedLang === "no" || locale === "no" || locale.endsWith("-no");
  const isFinnish = selectedLang === "fi" || locale === "fi" || locale.endsWith("-fi");
  const isFinnishSwedish = selectedLang === "sv-fi" || locale === "sv-fi" || locale.endsWith("-sv-fi");
  const isDutch = selectedLang === "nl" || locale === "nl" || locale.endsWith("-nl");
  const isPortuguese = selectedLang === "pt" || locale === "pt" || locale.endsWith("-pt");
  const isPolish = selectedLang === "pl" || locale === "pl" || locale.endsWith("-pl");
  const isCzech = selectedLang === "cs" || locale === "cs" || locale.endsWith("-cs");
  const isKorean = selectedLang === "ko" || locale === "ko" || locale.endsWith("-ko");
  const isChinese = selectedLang === "zh" || locale === "zh" || locale.endsWith("-zh");
  const isMalay = selectedLang === "ms" || locale === "ms" || locale.endsWith("-ms");
  const isTamil = selectedLang === "ta" || locale === "ta" || locale.endsWith("-ta");
  const isJapanese = selectedLang === "ja" || locale === "ja" || locale.endsWith("-ja");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error(
        isMaori
          ? "Hē te īmēra, te kupuhipa rānei."
          : isIrish
            ? "Ríomhphost nó focal faire mícheart."
            : isNorwegian
              ? "Feil e-postadresse eller passord."
              : isSwedish
                ? "Fel e-postadress eller lösenord."
                : isDanish
                  ? "Forkert e-mailadresse eller adgangskode."
                  : isFinnish || isFinnishSwedish
                    ? "Väärä sähköpostiosoite tai salasana."
                    : isDutch
                      ? "Onjuist e-mailadres of wachtwoord."
                      : isPortuguese
                        ? "E-mail ou palavra-passe incorretos."
                        : isPolish
                          ? "Nieprawidłowy e-mail lub hasło"
                          : isCzech
                            ? "Nesprávný e-mail nebo heslo"
                            : isChinese
                              ? "邮箱或密码不正确。"
                              : isKorean
                                ? "이메일 또는 비밀번호가 올바르지 않습니다."
                              : isJapanese
                                ? "メールアドレスまたはパスワードが正しくありません。"
                              : isMalay
                                ? "E-mel atau kata laluan tidak betul."
                                : isTamil
                                  ? "மின்னஞ்சல் அல்லது கடவுச்சொல் தவறாக உள்ளது."
                            : isEnglish
                      ? "Incorrect email or password."
                      : isArabic
                        ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
                        : "Email ou mot de passe incorrect."
      );
    } else {
      toast.success(
        isMaori
          ? "Nau mai hoki mai!"
          : isIrish
            ? "Fáilte romhat ar ais!"
            : isNorwegian
              ? "Velkommen tilbake!"
              : isSwedish
                ? "Välkommen tillbaka!"
                : isDanish
                  ? "Velkommen tilbage!"
                  : isFinnish || isFinnishSwedish
                    ? "Tervetuloa takaisin!"
                    : isDutch
                      ? "Welkom terug!"
                      : isPortuguese
                        ? "Bem-vindo de volta!"
                        : isPolish
                          ? "Witaj ponownie!"
                          : isCzech
                            ? "Vítejte zpět!"
                            : isChinese
                              ? "欢迎回来！"
                              : isKorean
                                ? "다시 오신 것을 환영합니다!"
                              : isJapanese
                                ? "おかえりなさい！"
                              : isMalay
                                ? "Selamat kembali!"
                                : isTamil
                                  ? "மீண்டும் வரவேற்கிறோம்!"
                            : isEnglish
                      ? "Welcome back!"
                      : isArabic
                        ? "أهلاً بك من جديد!"
                        : "Bon retour !"
      );
      router.push(`/${locale}/dashboard/parent`);
    }
    setIsSubmitting(false);
  };

  // Real region + lang homepage background
  const bgImage =
    selectedCountry === "SG"
      ? sgHeroImagePath(
          isChinese ? "zh" : isMalay ? "ms" : isTamil ? "ta" : isEnglish ? "en" : selectedLang || "en"
        )
      : selectedCountry === "JP"
        ? `/assets/img/regions/JP/${selectedLang || "ja"}/hero.png`
        : `/assets/img/regions/${selectedCountry.toLowerCase()}/${selectedLang}/hero.png`;

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 lg:p-12 relative font-dm-sans overflow-hidden bg-slate-900" dir={isArabic ? "rtl" : "ltr"}>
      
      {/* Real Regional Homepage Background (Sharp) */}
      <div className="absolute inset-0 z-0">
         <Image 
           src={bgImage}
           alt={`Background ${selectedCountry}`} 
           fill 
           className="object-cover opacity-60"
           priority
           onError={(e) => {
             const target = e.target as HTMLImageElement;
             target.src = "/assets/img/hero_elite.png";
           }}
         />
         <div className="absolute inset-0 bg-slate-950/30"></div>
      </div>

      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 relative z-10 h-full max-h-[700px]">
        
        {/* Left Side: Poetic side quotes banner */}
        <div className="hidden lg:flex lg:w-[35%] flex-col items-center justify-center text-center p-6 shrink-0">
             <h2 className="text-4xl font-black text-white font-jakarta tracking-tight mb-4 uppercase leading-tight drop-shadow-2xl whitespace-nowrap font-jakarta">
                {isMaori ? (
                   <>Te Whakaara <span className="text-orange-500">Hinengaro</span></>
                ) : isIrish ? (
                   <>Fáiltiú <span className="text-orange-500">Intinne</span></>
                ) : isNorwegian ? (
                   <>Oppvåkning av <span className="text-orange-500">Sinnen</span></>
                ) : isSwedish ? (
                   <>Uppväckning av <span className="text-orange-500">Sinnen</span></>
                ) : isDanish ? (
                   <>Vækst af <span className="text-orange-500">sindet</span></>
                ) : isFinnish || isFinnishSwedish ? (
                   <>Mielen <span className="text-orange-500">Herättäminen</span></>
                ) : isDutch ? (
                   <>Het Ontwaken van <span className="text-orange-500">Geesten</span></>
                ) : isPortuguese ? (
                   <>O Despertar de <span className="text-orange-500">Mentes</span></>
                ) : isPolish ? (
                   <>Budzenie <span className="text-orange-500">Umysłów</span></>
                ) : isCzech ? (
                   <>Probuzení <span className="text-orange-500">myslí</span></>
                ) : isChinese ? (
                   <>唤醒 <span className="text-orange-500">心灵</span></>
                ) : isKorean ? (
                   <>천재성의 <span className="text-orange-500">깨어남</span></>
                ) : isJapanese ? (
                   <>才能の<span className="text-orange-500">覚醒</span></>
                ) : isMalay ? (
                   <>Kebangkitan <span className="text-orange-500">Minda</span></>
                ) : isTamil ? (
                   <>மனங்களின் <span className="text-orange-500">விழிப்பு</span></>
                ) : isEnglish ? (
                   <>Awakening <span className="text-orange-500">Minds</span></>
                ) : isArabic ? (
                   <>صحوة <span className="text-orange-500">العقول</span></>
                ) : (
                   <>L'Éveil des <span className="text-orange-500">Esprits</span></>
                )}
             </h2>
             <p className="text-white/80 text-base font-light italic drop-shadow-lg tracking-tight whitespace-nowrap">
                {isMaori
                  ? "Ko ia kaupae ki te kairangi he hanga i tētahi ahunga whakamua motuhake."
                  : isIrish
                    ? "Cruthaíonn gach céim i dtreo sármhaitheasa todhchaí eisceachtúil."
                    : isNorwegian
                      ? "Hvert steg mot ekspertise skaper en enestående skjebne."
                      : isSwedish
                        ? "Varje steg mot excellens formar en exceptionell ödet."
                        : isDanish
                          ? "Hvert skridt mod ekspertise skaber en enestående skæbne."
                          : isFinnish || isFinnishSwedish
                            ? "Jokainen askel kohti huippuosaamista muokkaa poikkeuksellista kohtaloa."
                            : isDutch
                              ? "Elke stap naar excellentie vormt een buitengewoon bestemming."
                              : isPortuguese
                                ? "Cada passo em direção à excelência molda um destino excepcional."
                                : isPolish
                                  ? "Każdy krok w stronę doskonałości kształtuje wyjątkowe przeznaczenie."
                                  : isCzech
                                    ? "Každý krok k dokonalosti formuje výjimečný osud."
                                    : isChinese
                                      ? "迈向卓越的每一步，都在塑造非凡的命运。"
                                      : isKorean
                                        ? "탁월함을 향한 모든 발걸음이 비범한 운명을 만듭니다."
                                      : isJapanese
                                        ? "卓越への一歩一歩が、非凡な運命を形作ります。"
                                      : isMalay
                                        ? "Setiap langkah ke arah kecemerlangan membentuk takdir yang luar biasa."
                                        : isTamil
                                          ? "சிறப்பை நோக்கிய ஒவ்வொரு படியும் அசாதாரண விதியை வடிவமைக்கிறது."
                                          : isEnglish
                              ? "Every step towards excellence shapes an exceptional destiny."
                              : isArabic
                                ? "كل خطوة نحو التميز ترسم قدرًا استثنائيًا."
                                : "Chaque pas vers l'excellence dessine un destin d'exception."}
             </p>
         </div>
 
         {/* Right Side:Snug Form Card */}
         <div className="w-full lg:w-[65%] relative flex items-center justify-center">
             {/* Ambient Background Glow */}
             <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/20 to-emerald-500/20 rounded-[3.5rem] blur-2xl opacity-40 pointer-events-none" />
 
             <motion.div 
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_50px_150px_rgba(0,0,0,0.25)] border border-white/50 p-6 sm:p-8 lg:p-10 relative w-full max-w-[500px] z-10"
             >
                 
                 {/* Floating Logo */}
                 <Link href="/" className={`absolute -top-6 ${isArabic ? "right-12" : "left-12"} bg-white px-8 py-3.5 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-3 whitespace-nowrap hover:shadow-2xl transition-all z-[100] group`}>
                     <Image src="/assets/img/logo.png" alt="FreeGeny" width={32} height={32} />
                     <span className="text-xl font-black text-slate-900 uppercase font-jakarta tracking-tighter">Free<span className="text-orange-600">Geny</span></span>
                 </Link>
 
                 <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 pt-2">
                     <div className={isArabic ? "pr-2 text-right" : "pl-2 text-left"}>
                         <h1 className="text-2xl font-black text-slate-950 font-jakarta tracking-tight mb-1 uppercase">
                             {isMaori ? "Nau mai" : isIrish ? "Fáilte" : isNorwegian ? "Velkommen" : isSwedish ? "Välkommen" : isDanish ? "Velkommen" : isFinnish || isFinnishSwedish ? "Tervetuloa" : isDutch ? "Welkom" : isPortuguese ? "Bem-vindo" : isPolish ? "Witaj" : isCzech ? "Vítejte" : isChinese ? "欢迎" : isKorean ? "환영합니다" : isJapanese ? "ようこそ" : isMalay ? "Selamat datang" : isTamil ? "வரவேற்கிறோம்" : isEnglish ? "Welcome" : isArabic ? "مرحبًا" : "Bienvenue"}
                         </h1>
                         <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.1em]">
                             {isMaori ? "Pārongo Takiuru" : isIrish ? "D'Fhaisnéis Rochtana" : isNorwegian ? "Dine innloggingsopplysninger" : isSwedish ? "Dina inloggningsuppgifter" : isDanish ? "Dine adgangsoplysninger" : isFinnish || isFinnishSwedish ? "Kirjautumistietietosi" : isDutch ? "Uw inloggegevens" : isPortuguese ? "Suas credenciais" : isPolish ? "Twoje dane logowania" : isCzech ? "Vaše přihlašovací údaje" : isChinese ? "登录信息" : isKorean ? "로그인 정보" : isJapanese ? "ログイン情報" : isMalay ? "Maklumat log masuk" : isTamil ? "உள்நுழைவு விவரங்கள்" : isEnglish ? "Your Credentials" : isArabic ? "بيانات الاتصال" : "Vos identifiants de Connexion"}
                         </p>
                     </div>
                     <div className={isArabic ? "text-right pr-2 sm:pr-0 sm:text-left" : "text-left pl-2 sm:pl-0 sm:text-right"}>
                         <Link href="/auth/register" className="text-[11px] font-black text-orange-600 hover:underline uppercase tracking-wider block">
                             {isMaori ? "Kāore he pūkete? Tīmata i te haerenga" : isIrish ? "Níl cuntas agat? Tosaigh an eachtra" : isNorwegian ? "Ingen konto? Start eventyret" : isSwedish ? "Inget konto? Börja äventyret" : isDanish ? "Ingen konto? Start eventyret" : isFinnish || isFinnishSwedish ? "Ei tiliä? Aloita seikkailu" : isDutch ? "Geen account? Start het avontuur" : isPortuguese ? "Não tem conta? Comece a aventura" : isPolish ? "Nie masz konta? Rozpocznij przygodę" : isCzech ? "Nemáte účet? Začněte dobrodružství" : isChinese ? "没有账号？开始冒险" : isKorean ? "계정이 없으신가요? 모험 시작하기" : isJapanese ? "アカウントをお持ちでない方は、冒険を始めましょう" : isMalay ? "Tiada akaun? Mulakan pengembaraan" : isTamil ? "கணக்கு இல்லையா? பயணத்தை தொடங்குங்கள்" : isEnglish ? "No account? Start the adventure" : isArabic ? "ليس لديك حساب؟ ابدأ المغامرة" : "Vous n'avez pas de compte ? Commencez l'aventure"}
                         </Link>
                     </div>
                 </div>
 
                 <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="space-y-4">
                         <div className="space-y-1.5">
                             <label className={`block text-[11px] font-black uppercase tracking-wider text-slate-700 px-1 ${isArabic ? "text-right" : "text-left"}`}>
                                 {isMaori ? "Īmēra" : isIrish ? "Ríomhphost" : isNorwegian ? "E-post" : isSwedish ? "E-post" : isDanish ? "E-mail" : isFinnish || isFinnishSwedish ? "Sähköposti" : isDutch ? "E-mail" : isPortuguese ? "E-mail" : isEnglish ? "E-mail" : isArabic ? "البريد الإلكتروني" : "E-mail"}
                             </label>
                             <div className="relative">
                                 <Mail className={`absolute ${isArabic ? "right-5" : "left-5"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300`} />
                                 <input 
                                     type="email" 
                                     name="email" 
                                     required 
                                     placeholder={isMaori ? "hemi@example.co.nz" : isIrish ? "aoife@eire.ie" : isNorwegian ? "ole@example.no" : isSwedish ? "erik@example.se" : isDanish ? "mads@example.dk" : isEnglish ? "email@example.com" : isArabic ? "mail@example.com" : "nom@exemple.com"} 
                                     className={`w-full bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white px-6 py-4 ${isArabic ? "pr-14 pl-6 text-right" : "pl-14 pr-6 text-left"} rounded-2xl outline-none transition-all font-bold text-slate-950 text-sm shadow-inner`} 
                                 />
                             </div>
                         </div>
 
                         <div className="space-y-1.5">
                             <div className={`flex justify-between px-1 ${isArabic ? "flex-row-reverse" : ""}`}>
                                 <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
                                     {isMaori ? "Kupuhipa" : isIrish ? "Focal Faire" : isNorwegian ? "Passord" : isSwedish ? "Lösenord" : isDanish ? "Adgangskode" : isFinnish || isFinnishSwedish ? "Salasana" : isDutch ? "Wachtwoord" : isPortuguese ? "Palavra-passe" : isPolish ? "Hasło" : isCzech ? "Heslo" : isChinese ? "密码" : isKorean ? "비밀번호" : isJapanese ? "パスワード" : isMalay ? "Kata laluan" : isTamil ? "கடவுச்சொல்" : isEnglish ? "Password" : isArabic ? "كلمة المرور" : "Mot de passe"}
                                 </label>
                                 <Link href="/auth/forgot" className="text-[10px] font-bold text-orange-600 hover:underline uppercase tracking-wider">
                                     {isMaori ? "Kua wareware?" : isIrish ? "Dearmad déanta?" : isNorwegian ? "Glemt?" : isSwedish ? "Glömt?" : isDanish ? "Glemt?" : isFinnish || isFinnishSwedish ? "Unohdut?" : isDutch ? "Wachtwoord vergeten?" : isPortuguese ? "Esqueceu a palavra-passe?" : isPolish ? "Zapomniałeś?" : isCzech ? "Zapomněli jste?" : isChinese ? "忘记了？" : isKorean ? "비밀번호 찾기" : isJapanese ? "お忘れですか？" : isMalay ? "Lupa?" : isTamil ? "மறந்துவிட்டீர்களா?" : isEnglish ? "Forgot?" : isArabic ? "نسيت كلمة المرور؟" : "Oublié ?"}
                                 </Link>
                             </div>
                             <div className="relative">
                                 <Lock className={`absolute ${isArabic ? "right-5" : "left-5"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300`} />
                                 <input 
                                     type={showPassword ? "text" : "password"} 
                                     name="password" 
                                     required 
                                     placeholder="••••••••" 
                                     className={`w-full bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white px-6 py-4 ${isArabic ? "pr-14 pl-6 text-right" : "pl-14 pr-6 text-left"} rounded-2xl outline-none transition-all font-bold text-slate-950 text-sm shadow-inner`} 
                                 />
                                 <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute ${isArabic ? "left-5" : "right-5"} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-950 transition-colors`}>
                                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                 </button>
                             </div>
                         </div>
                     </div>
 
                     <div className="flex flex-col sm:flex-row items-center gap-4 pt-3">
                         {/* Google Login */}
                         <button 
                             type="button" 
                             onClick={() => signIn("google", { callbackUrl: `/${locale}/dashboard/parent` })} 
                             className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-6 py-4 border-2 border-slate-100 hover:border-orange-400 bg-white hover:bg-orange-50 text-slate-700 font-bold rounded-2xl transition-all duration-300 shadow-sm group whitespace-nowrap"
                         >
                             <img src="https://www.google.com/favicon.ico" className="w-4.5 h-4.5 group-hover:scale-110 transition" alt="G" />
                             <span className="text-[10px] font-black uppercase tracking-wider group-hover:text-orange-600">
                                 {isMaori ? "Takiuru Google" : isIrish ? "Logáil isteach Google" : isNorwegian ? "Google Logg inn" : isSwedish ? "Google Logga in" : isDanish ? "Google Log ind" : isFinnish || isFinnishSwedish ? "Google Kirjaudu sisään" : isDutch ? "Google Inloggen" : isPortuguese ? "Entrar com Google" : isPolish ? "Zaloguj przez Google" : isCzech ? "Přihlásit se přes Google" : isChinese ? "使用 Google 登录" : isKorean ? "Google 로그인" : isJapanese ? "Googleでログイン" : isMalay ? "Log masuk dengan Google" : isTamil ? "Google மூலம் உள்நுழைக" : isEnglish ? "Google Sign In" : isArabic ? "اتصال بجوجل" : "Connexion Google"}
                             </span>
                         </button>
 
                         {/* Submit Button */}
                         <button 
                             type="submit" 
                             disabled={isSubmitting} 
                             className="w-full sm:w-auto px-8 py-4 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-wider text-[11px] hover:bg-orange-600 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50 shrink-0"
                         >
                             {isSubmitting 
                                ? (isMaori ? "E hono ana..." : isIrish ? "Ag ceangal..." : isNorwegian ? "Kobler til..." : isSwedish ? "Ansluter..." : isDanish ? "Forbinder..." : isFinnish || isFinnishSwedish ? "Yhdistetään..." : isDutch ? "Verbinden..." : isPortuguese ? "A ligar..." : isPolish ? "Łączenie..." : isCzech ? "Připojování..." : isChinese ? "连接中..." : isKorean ? "연결 중..." : isJapanese ? "接続中..." : isMalay ? "Menyambung..." : isTamil ? "இணைக்கிறது..." : isEnglish ? "Connecting..." : isArabic ? "جاري الاتصال..." : "Accès...") 
                                : (isMaori ? "Takiuru" : isIrish ? "Logáil Isteach" : isNorwegian ? "Logg inn" : isSwedish ? "Logga in" : isDanish ? "Log ind" : isFinnish || isFinnishSwedish ? "Kirjaudu sisään" : isDutch ? "Inloggen" : isPortuguese ? "Entrar" : isPolish ? "Zaloguj się" : isCzech ? "Přihlásit se" : isChinese ? "登录" : isKorean ? "로그인" : isJapanese ? "ログイン" : isMalay ? "Log Masuk" : isTamil ? "உள்நுழை" : isEnglish ? "Sign In" : isArabic ? "تسجيل الدخول" : "Se connecter")}
                             <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isArabic ? "rotate-180" : ""}`} />
                         </button>
                     </div>
                 </form>
 
             </motion.div>
         </div>
      </div>
    </div>
  );
}
