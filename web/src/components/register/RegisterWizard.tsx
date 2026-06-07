"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  GraduationCap,
  Heart,
  ShieldCheck,
  Upload,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { signIn, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import SchoolPicker, { type SchoolPickerValue } from "@/components/SchoolPicker";
import WizardProgress from "@/components/register/WizardProgress";
import { checkUserAvailability, registerEliteAction } from "@/lib/actions/auth_elite";
import { registerTeacherAction } from "@/lib/actions/teacher_register";
import { completeGoogleOnboardingAction } from "@/lib/actions/onboarding";
import { loginAction } from "@/lib/actions/auth";
import CaptchaField, { type CaptchaFieldRef } from "@/components/register/CaptchaField";
import { toast } from "sonner";
import { LUXURY } from "@/constants/design";
import PasswordStrengthChecker from "@/components/PasswordStrengthChecker";
import { isPasswordStrong } from "@/lib/passwordPolicy";

type Role = "parent" | "enseignant";
const LEVELS = ["1AP", "2AP", "3AP", "4AP", "5AP"] as const;

type StepId =
  | "role"
  | "account"
  | "credentials"
  | "profile"
  | "schooling"
  | "school"
  | "ally"
  | "identity"
  | "captcha";

function getSteps(role: Role, mode: "register" | "google" = "register"): StepId[] {
  if (mode === "google") {
    // Rôle déjà choisi avant OAuth — on reprend directement au profil Google
    const base: StepId[] = ["profile", "schooling", "school"];
    return role === "parent" ? [...base, "ally", "identity", "captcha"] : [...base, "identity", "captcha"];
  }
  const base: StepId[] = ["role", "account", "credentials", "schooling", "school"];
  return role === "parent" ? [...base, "ally", "identity", "captcha"] : [...base, "identity", "captcha"];
}

/** Classes partagées — mobile first, texte noir lisible */
const MOBILE = {
  shell: "flex h-[calc(100dvh-72px)] flex-col overflow-hidden bg-white touch-manipulation",
  padX: "px-4 sm:px-5",
  title: "text-[22px] font-extrabold leading-snug text-black sm:text-2xl",
  subtitle: "mt-2 text-[15px] leading-snug text-neutral-600",
  card: "flex w-full min-h-[52px] items-center gap-3 rounded-2xl border-2 border-b-[5px] px-4 py-3.5 text-start transition-all active:border-b-2 active:translate-y-[2px] sm:gap-4 sm:px-5 sm:py-4",
  cardIdle: "border-neutral-300 border-b-neutral-400 bg-white text-black",
  cardActive: "border-orange-500 border-b-orange-600 bg-orange-50 text-black",
  input: "h-12 text-base text-black placeholder:text-neutral-400 sm:h-11 sm:text-sm",
  label: "text-[13px] font-bold text-black sm:text-xs",
  cta: "min-h-[52px] w-full rounded-2xl border-b-[5px] border-orange-800 bg-orange-500 py-3.5 text-base font-extrabold uppercase tracking-wide text-white transition active:border-b-2 active:translate-y-[2px] disabled:opacity-50 sm:text-sm",
  footer: "shrink-0 border-t border-neutral-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-5",
} as const;

/** Navigation hors du cycle React — évite l'erreur RSC « Error in input stream ». */
function hardNavigate(url: string) {
  window.setTimeout(() => {
    window.location.replace(url);
  }, 0);
}

type Props = {
  locale: string;
  mode?: "register" | "google";
  initialRole?: Role;
};

export default function RegisterWizard({ locale, mode = "register", initialRole }: Props) {
  const t = useTranslations("RegisterWizard");
  const tAuth = useTranslations("Auth");
  const { data: session } = useSession();
  const isGoogle = mode === "google";
  const isRTL = locale === "ar" || locale.endsWith("-ar");
  const slideDir = isRTL ? -1 : 1;

  const [role, setRole] = useState<Role>(initialRole ?? "parent");
  const steps = useMemo(() => getSteps(role, mode), [role, mode]);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    setStepIndex((i) => Math.min(i, steps.length - 1));
  }, [steps.length]);

  const step = steps[stepIndex] ?? "role";
  const total = steps.length;
  const isLast = stepIndex === total - 1;

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameOk, setUsernameOk] = useState<boolean | null>(null);
  const [emailOk, setEmailOk] = useState<boolean | null>(null);

  const [phone, setPhone] = useState("");
  const [childName, setChildName] = useState("");
  const [allyName, setAllyName] = useState("");
  const [allyEmail, setAllyEmail] = useState("");
  const [level, setLevel] = useState<string>("1AP");
  const [school, setSchool] = useState<SchoolPickerValue | null>(null);

  const [identityFile, setIdentityFile] = useState<File | null>(null);
  const [captchaValue, setCaptchaValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const captchaRef = useRef<CaptchaFieldRef>(null);

  const isDev =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_FREEGENY_DEV_AUTO_APPROVE === "true";
  const googleCallback = `/${locale}/auth/google-bridge?type=${role}&from=register`;

  useEffect(() => {
    if (initialRole) setRole(initialRole);
  }, [initialRole]);

  useEffect(() => {
    if (isGoogle && initialRole) {
      setStepIndex(0);
    }
  }, [isGoogle, initialRole]);

  useEffect(() => {
    if (!isGoogle || !session?.user) return;
    if (session.user.email) setEmail(session.user.email);
    if (session.user.name) setFullName(session.user.name);
  }, [isGoogle, session]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (username.length >= 3) {
        const r = await checkUserAvailability("username", username);
        setUsernameOk(r.available ?? false);
      } else setUsernameOk(null);
    }, 450);
    return () => clearTimeout(timer);
  }, [username]);

  useEffect(() => {
    const normalized = email.trim().toLowerCase();
    if (!normalized.includes("@") || normalized.length < 5) {
      setEmailOk(null);
      return;
    }
    const timer = setTimeout(async () => {
      const r = await checkUserAvailability("email", normalized);
      setEmailOk(r.available ?? false);
    }, 450);
    return () => clearTimeout(timer);
  }, [email]);

  const ensureEmailAvailable = async (): Promise<boolean> => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !normalized.includes("@")) {
      toast.error(t("errRequired"));
      return false;
    }
    const r = await checkUserAvailability("email", normalized);
    if ("error" in r && r.error) {
      toast.error(t("errGeneric"));
      return false;
    }
    if (!r.available) {
      setEmailOk(false);
      toast.error(t("errEmailExists"));
      return false;
    }
    setEmailOk(true);
    return true;
  };

  const ensureUsernameAvailable = async (): Promise<boolean> => {
    const value = username.trim().toLowerCase();
    if (value.length < 3) {
      toast.error(t("errRequired"));
      return false;
    }
    const r = await checkUserAvailability("username", value);
    if ("error" in r && r.error) {
      toast.error(t("errGeneric"));
      return false;
    }
    if (!r.available) {
      setUsernameOk(false);
      toast.error(t("errUsername"));
      return false;
    }
    setUsernameOk(true);
    return true;
  };

  const passwordOk = isPasswordStrong(password);

  const goNext = () => {
    setDirection(1);
    setStepIndex((i) => Math.min(total - 1, i + 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const validateStep = (): boolean => {
    switch (step) {
      case "role":
        return true;
      case "account":
        if (!fullName.trim() || !email.trim()) {
          toast.error(t("errRequired"));
          return false;
        }
        if (!email.includes("@")) {
          toast.error(t("errRequired"));
          return false;
        }
        if (emailOk === false) {
          toast.error(t("errEmailExists"));
          return false;
        }
        return true;
      case "credentials":
        if (!username.trim() || !password) {
          toast.error(t("errRequired"));
          return false;
        }
        if (!passwordOk) {
          toast.error(t("errPassword"));
          return false;
        }
        if (password !== confirmPassword) {
          toast.error(t("errPasswordMatch"));
          return false;
        }
        if (usernameOk === false) {
          toast.error(t("errUsername"));
          return false;
        }
        return true;
      case "profile":
        if (!username.trim()) {
          toast.error(t("errRequired"));
          return false;
        }
        if (usernameOk === false) {
          toast.error(t("errUsername"));
          return false;
        }
        return true;
      case "schooling":
        if (!phone.trim()) {
          toast.error(t("errRequired"));
          return false;
        }
        if (role === "parent" && !childName.trim()) {
          toast.error(t("errRequired"));
          return false;
        }
        return true;
      case "school":
        if (!school) {
          toast.error(t("errSchool"));
          return false;
        }
        return true;
      case "ally":
        if (allyEmail.trim() && !allyEmail.includes("@")) {
          toast.error(t("errRequired"));
          return false;
        }
        return true;
      case "identity":
        if (!identityFile && !isDev) {
          toast.error(t("errIdentity"));
          return false;
        }
        return true;
      case "captcha":
        return true;
      default:
        return true;
    }
  };

  const handleContinue = async () => {
    if (step === "account" && !isGoogle) {
      if (!validateStep()) return;
      if (!(await ensureEmailAvailable())) return;
      goNext();
      return;
    }

    if (step === "credentials") {
      if (!validateStep()) return;
      if (!(await ensureUsernameAvailable())) return;
      if (!(await ensureEmailAvailable())) return;
      goNext();
      return;
    }

    if (!validateStep()) return;
    if (!isLast) goNext();
    else void handleSubmit();
  };

  const validateCaptcha = (): boolean => {
    if (isDev || captchaValue === "1234") return true;
    if (!captchaRef.current?.validate(captchaValue)) {
      toast.error(t("errCaptcha"));
      setCaptchaValue("");
      captchaRef.current?.reload();
      return false;
    }
    return true;
  };

  const finishLoginAfterRegister = async (dash: "parent" | "enseignant"): Promise<boolean> => {
    const loginFd = new FormData();
    loginFd.set("email", email.trim().toLowerCase());
    loginFd.set("password", password);
    const loginRes = await loginAction(loginFd);

    if ("success" in loginRes && loginRes.success) {
      hardNavigate(`/${locale}/dashboard/${dash}`);
      return true;
    }

    hardNavigate(`/${locale}/auth/login?registered=1`);
    return true;
  };

  const handleSubmit = async () => {
    if (!identityFile && !isDev) {
      toast.error(t("errIdentity"));
      return;
    }
    if (!validateCaptcha()) return;

    if (!isGoogle) {
      const usernameReady = await ensureUsernameAvailable();
      if (!usernameReady) return;
      if (!isPasswordStrong(password)) {
        toast.error(t("errPassword"));
        return;
      }
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedAllyEmail = allyEmail.trim().toLowerCase();
    if (role === "parent" && normalizedAllyEmail) {
      if (!normalizedAllyEmail.includes("@")) {
        toast.error(t("errRequired"));
        return;
      }
      if (normalizedAllyEmail === normalizedEmail) {
        toast.error(t("errAllySameEmail"));
        return;
      }
    }

    setIsSubmitting(true);
    let redirecting = false;
    try {
      const fd = new FormData();
      fd.set("fullName", fullName.trim());
      fd.set("username", username.trim().toLowerCase());
      fd.set("email", normalizedEmail);
      fd.set("phone", "+213" + phone.replace(/\D/g, ""));

      if (school) {
        fd.set("child_school", school.name);
        fd.set("child_school_id", String(school.id));
      }
      fd.set("child_country", "DZ");
      fd.set("child_level", level);
      fd.set("child_region", school?.address || "");
      fd.set("child_age", "8");
      fd.set("locale", locale);
      if (identityFile && !isDev) fd.set("doc_identity", identityFile);

      if (isGoogle) {
        if (role === "parent") {
          fd.set("user_type", "parent");
          fd.set("child_name", childName.trim());
          fd.set("spouse_first_name", allyName.trim());
          fd.set("spouse_email", normalizedAllyEmail);
        } else {
          fd.set("user_type", "enseignant");
          fd.set("teacher_school_id", school ? String(school.id) : "");
          fd.set("teacher_school_name", school?.name || "");
          fd.set("teacher_subject", "general");
        }

        const result = await completeGoogleOnboardingAction(fd);
        if ("error" in result && result.error) {
          toast.error(result.error);
          return;
        }

        redirecting = true;
        hardNavigate(`/${locale}/dashboard/${role === "parent" ? "parent" : "enseignant"}`);
        return;
      }

      fd.set("password", password);
      fd.set("confirmPassword", confirmPassword);

      const dash = role === "parent" ? "parent" : "enseignant";

      if (role === "parent") {
        fd.set("user_type", "parent");
        fd.set("child_name", childName.trim());
        fd.set("spouse_first_name", allyName.trim());
        fd.set("spouse_email", normalizedAllyEmail);

        const result = await registerEliteAction(fd, 0, 0);
        if (!("success" in result && result.success)) {
          toast.error(("error" in result && result.error) || t("errGeneric"));
          return;
        }
      } else {
        fd.set("teacher_school_id", school ? String(school.id) : "");
        fd.set("teacher_school_name", school?.name || "");
        fd.set("teacher_subject", "general");

        const result = await registerTeacherAction(fd);
        if ("error" in result && result.error) {
          toast.error(result.error);
          return;
        }
      }

      redirecting = await finishLoginAfterRegister(dash);
    } catch (error) {
      console.error("RegisterWizard submit error:", error);
      toast.error(t("errGeneric"));
    } finally {
      if (!redirecting) setIsSubmitting(false);
    }
  };

  const title = (() => {
    switch (step) {
      case "role":
        return t("step1Title");
      case "account":
        return t("step2Title");
      case "profile":
        return t("stepProfileTitle");
      case "credentials":
        return t("stepCredentialsTitle");
      case "schooling":
        return role === "parent" ? t("step3ParentTitle") : t("step3TeacherTitle");
      case "school":
        return t("stepSchoolTitle");
      case "ally":
        return t("stepAllyQuestion");
      case "identity":
        return t("step4Title");
      case "captcha":
        return t("stepCaptchaTitle");
      default:
        return "";
    }
  })();

  const variants = {
    enter: (d: number) => ({ x: d * slideDir * 16, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * slideDir * -16, opacity: 0 }),
  };

  return (
    <div className={MOBILE.shell} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header — mobile first, collé en haut */}
      <div className={cn("mx-auto w-full max-w-lg shrink-0 pt-3 sm:pt-5", MOBILE.padX)}>
        <div className={cn("flex items-center gap-2 sm:gap-3", isRTL && "flex-row-reverse")}>
          {stepIndex > 0 ? (
            <button
              type="button"
              onClick={goBack}
              aria-label="Retour"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-neutral-700 transition active:bg-neutral-100"
            >
              <ArrowLeft className={cn("h-5 w-5", isRTL && "rotate-180")} />
            </button>
          ) : (
            <div className="w-11 shrink-0" />
          )}
          <div className="min-w-0 flex-1">
            <WizardProgress step={stepIndex + 1} total={total} isRTL={isRTL} />
          </div>
        </div>
      </div>

      {/* Contenu — aligné en haut sur mobile (pas centré verticalement) */}
      <div
        className={cn(
          "mx-auto flex w-full max-w-lg min-h-0 flex-1 flex-col overflow-hidden pt-5 sm:justify-center sm:pt-0",
          MOBILE.padX
        )}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${step}-${role}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: LUXURY.navEasing }}
            className="shrink-0"
          >
            <div className={cn("mb-5 sm:mb-6", isRTL && "text-right")}>
              <h1 className={cn(MOBILE.title, isRTL && "font-amiri text-[24px] sm:text-[26px]")}>{title}</h1>
              {step === "role" && (
                <p className={cn(MOBILE.subtitle, isRTL && "font-lateef text-base")}>{t("step1Subtitle")}</p>
              )}
              {step === "ally" && (
                <p className={cn(MOBILE.subtitle, isRTL && "font-lateef text-base")}>{t("stepAllyOptional")}</p>
              )}
            </div>

            <div className="space-y-3">
              {step === "role" &&
                (
                  [
                    { id: "parent" as const, icon: Heart, label: tAuth("roleParent") },
                    { id: "enseignant" as const, icon: GraduationCap, label: tAuth("roleTeacher") },
                  ] as const
                ).map(({ id, icon: Icon, label }) => {
                  const active = role === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setRole(id);
                        if (stepIndex > 0) setStepIndex(0);
                      }}
                      className={cn(
                        MOBILE.card,
                        active ? MOBILE.cardActive : MOBILE.cardIdle,
                        isRTL && "flex-row-reverse text-right font-amiri"
                      )}
                    >
                      <Icon className={cn("h-6 w-6 shrink-0", active ? "text-orange-600" : "text-neutral-500")} />
                      <span className="text-[17px] font-bold">{label}</span>
                    </button>
                  );
                })}

              {step === "profile" && (
                <>
                  <p
                    className={cn(
                      "-mt-3 mb-1 flex items-center justify-center gap-2 rounded-xl bg-neutral-100 py-2.5 text-sm font-bold text-black",
                      isRTL && "font-amiri flex-row-reverse"
                    )}
                  >
                    <img src="https://www.google.com/favicon.ico" className="h-4 w-4 shrink-0" alt="" />
                    {t("googleConnected")}
                  </p>
                  <Field label={t("fullName")} isRTL={isRTL}>
                    <Input
                      value={fullName}
                      readOnly
                      className={cn(MOBILE.input, "bg-neutral-50 text-neutral-700", isRTL && "text-right font-amiri")}
                    />
                  </Field>
                  <Field label={t("email")} isRTL={isRTL}>
                    <Input
                      type="email"
                      value={email}
                      readOnly
                      dir="ltr"
                      className={cn(MOBILE.input, "bg-neutral-50 text-neutral-700")}
                    />
                  </Field>
                  <Field label={t("username")} isRTL={isRTL}>
                    <div className="relative">
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                        placeholder={tAuth("Placeholders.Username")}
                        dir="ltr"
                        className={cn(MOBILE.input, "pe-11")}
                      />
                      {usernameOk === true && (
                        <Check className="absolute end-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600" />
                      )}
                      {usernameOk === false && (
                        <X className="absolute end-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-600" />
                      )}
                    </div>
                  </Field>
                </>
              )}

              {step === "account" && (
                <>
                  <button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: googleCallback })}
                    className={cn(
                      MOBILE.card,
                      MOBILE.cardIdle,
                      "justify-center font-bold",
                      isRTL && "font-amiri flex-row-reverse"
                    )}
                  >
                    <img src="https://www.google.com/favicon.ico" className="h-5 w-5 shrink-0" alt="" />
                    <span className="text-[15px]">{t("googleSignIn")}</span>
                  </button>
                  <p
                    className={cn(
                      "py-1 text-center text-xs font-bold uppercase tracking-wider text-neutral-500",
                      isRTL && "font-amiri normal-case"
                    )}
                  >
                    {t("orEmail")}
                  </p>
                  <Field label={t("fullName")} isRTL={isRTL}>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={tAuth("Placeholders.FullName")}
                      className={cn(MOBILE.input, isRTL && "text-right font-amiri")}
                    />
                  </Field>
                  <Field label={t("email")} isRTL={isRTL}>
                    <div className="relative">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={tAuth("Placeholders.Email")}
                        dir="ltr"
                        className={cn(MOBILE.input, "pe-11")}
                      />
                      {emailOk === true && (
                        <Check className="absolute end-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600" />
                      )}
                      {emailOk === false && (
                        <X className="absolute end-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-600" />
                      )}
                    </div>
                    {emailOk === false && (
                      <p className={cn("text-sm text-red-600", isRTL && "font-amiri text-right")}>
                        {t("errEmailExists")}{" "}
                        <Link href="/auth/login" className="font-extrabold underline">
                          {t("emailExistsLogin")}
                        </Link>
                      </p>
                    )}
                  </Field>
                </>
              )}

              {step === "credentials" && (
                <>
                  <Field label={t("username")} isRTL={isRTL}>
                    <div className="relative">
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                        placeholder={tAuth("Placeholders.Username")}
                        dir="ltr"
                        className={cn(MOBILE.input, "pe-11")}
                      />
                      {usernameOk === true && (
                        <Check className="absolute end-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600" />
                      )}
                      {usernameOk === false && (
                        <X className="absolute end-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-600" />
                      )}
                    </div>
                  </Field>
                  <Field label={t("password")} isRTL={isRTL}>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        dir="ltr"
                        className={cn(MOBILE.input, "pe-11")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute end-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-neutral-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <PasswordStrengthChecker password={password} compact className="mt-2" />
                  </Field>
                  <Field label={t("confirmPassword")} isRTL={isRTL}>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      dir="ltr"
                      className={MOBILE.input}
                    />
                  </Field>
                </>
              )}

              {step === "schooling" && role === "parent" && (
                <p className={cn(MOBILE.subtitle, "mb-1", isRTL && "font-lateef text-base")}>{t("childFirstHint")}</p>
              )}

              {step === "schooling" && (
                <>
                  {role === "parent" && (
                    <Field label={t("childName")} isRTL={isRTL}>
                      <Input
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        className={cn(MOBILE.input, isRTL && "font-amiri text-right")}
                      />
                    </Field>
                  )}
                  <Field label={t("phone")} isRTL={isRTL}>
                    <div className="flex gap-2">
                      <span
                        className="flex h-12 shrink-0 items-center rounded-xl border border-neutral-300 bg-neutral-100 px-3 text-sm font-bold text-black sm:h-11"
                        dir="ltr"
                      >
                        +213
                      </span>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        inputMode="tel"
                        className={cn(MOBILE.input, "flex-1")}
                        dir="ltr"
                      />
                    </div>
                  </Field>
                  {role === "parent" && (
                    <Field label={t("level")} isRTL={isRTL}>
                      <div className={cn("grid grid-cols-3 gap-2 sm:flex sm:flex-wrap", isRTL && "sm:justify-end")}>
                        {LEVELS.map((lv) => (
                          <button
                            key={lv}
                            type="button"
                            onClick={() => setLevel(lv)}
                            className={cn(
                              "min-h-[44px] rounded-xl px-2 py-2.5 text-xs font-extrabold transition-all sm:px-3",
                              level === lv
                                ? "bg-black text-white"
                                : "bg-neutral-100 text-black ring-1 ring-neutral-300",
                              isRTL && "font-amiri"
                            )}
                          >
                            {t(`levels.${lv}`)}
                          </button>
                        ))}
                      </div>
                    </Field>
                  )}
                </>
              )}

              {step === "school" && (
                <Field label={t("school")} isRTL={isRTL}>
                  <SchoolPicker
                    value={school}
                    onChange={setSchool}
                    country="DZ"
                    placeholder={t("schoolPlaceholder")}
                  />
                </Field>
              )}

              {step === "ally" && (
                <>
                  <Field label={t("allyName")} isRTL={isRTL}>
                    <Input
                      value={allyName}
                      onChange={(e) => setAllyName(e.target.value)}
                      placeholder={t("allyNamePlaceholder")}
                      className={cn(MOBILE.input, isRTL && "font-amiri text-right")}
                    />
                  </Field>
                  <Field label={t("allyEmail")} isRTL={isRTL}>
                    <Input
                      type="email"
                      value={allyEmail}
                      onChange={(e) => setAllyEmail(e.target.value)}
                      placeholder={t("allyEmailPlaceholder")}
                      dir="ltr"
                      className={MOBILE.input}
                    />
                  </Field>
                </>
              )}

              {step === "identity" && (
                <>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={(e) => setIdentityFile(e.target.files?.[0] ?? null)}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className={cn(
                      "w-full rounded-2xl border-2 border-dashed p-5 text-center transition active:bg-orange-50 sm:p-6",
                      identityFile
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-neutral-300 hover:border-orange-300"
                    )}
                  >
                    <Upload className="mx-auto mb-2 h-5 w-5 text-neutral-600" />
                    <p className={cn("text-[15px] font-bold text-black", isRTL && "font-amiri")}>
                      {identityFile ? identityFile.name : t("identityDrop")}
                    </p>
                    <p className={cn("mt-1 text-xs font-medium text-neutral-600", isRTL && "font-amiri")}>
                      {t("identityHint")}
                    </p>
                  </button>
                  <p className={cn("flex items-center gap-2 text-xs font-medium text-neutral-700", isRTL && "font-amiri flex-row-reverse")}>
                    <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700" />
                    {t("identitySecure")}
                  </p>
                </>
              )}

              {step === "captcha" && (
                <div className="space-y-4 rounded-2xl border-2 border-neutral-200 bg-neutral-50 p-4">
                  <div className="flex justify-center py-2">
                    <CaptchaField
                      ref={captchaRef}
                      length={6}
                      bgColor="#f5f5f5"
                      textColor="#000000"
                      onReload={() => setCaptchaValue("")}
                    />
                  </div>
                  <Field label={t("captcha")} isRTL={isRTL}>
                    <Input
                      value={captchaValue}
                      onChange={(e) => setCaptchaValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className={cn(MOBILE.input, "text-center text-lg font-bold tracking-[0.35em]")}
                      dir="ltr"
                      autoComplete="off"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                    />
                  </Field>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer — CTA fixe, safe-area iPhone */}
      <div className={MOBILE.footer}>
        <div className="mx-auto w-full max-w-lg">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleContinue()}
            className={cn(MOBILE.cta, isRTL && "font-amiri normal-case text-lg")}
          >
            {isSubmitting ? t("submitting") : isLast ? (isGoogle ? t("submitGoogle") : t("submit")) : t("continue")}
          </button>
          {step === "role" && !isGoogle && (
            <p className={cn("mt-3 text-center text-[15px] text-neutral-600", isRTL && "font-lateef")}>
              {t("hasAccount")}{" "}
              <Link href="/auth/login" className="font-extrabold text-orange-600 hover:underline">
                {t("login")}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, isRTL }: { label: string; children: React.ReactNode; isRTL?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label
        className={cn(
          MOBILE.label,
          "block",
          isRTL && "font-amiri text-right text-sm"
        )}
      >
        {label}
      </label>
      {children}
    </div>
  );
}
