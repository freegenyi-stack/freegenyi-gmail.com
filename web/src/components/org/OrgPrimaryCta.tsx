"use client";



import React from "react";

import { Link } from "@/i18n/routing";

import { useSession } from "next-auth/react";

import { useTranslations } from "next-intl";

import { ArrowRight } from "lucide-react";

import { getOrgDashboardPath } from "@/lib/orgVerification.shared";



type Variant = "schools" | "ngos";



type Props = {

  variant: Variant;

  className: string;

};



export default function OrgPrimaryCta({ variant, className }: Props) {

  const orgType = variant === "schools" ? "ecole" : "ong";

  const ns = variant === "schools" ? "OrgSchools" : "OrgNgos";

  const t = useTranslations(ns);

  const { data: session, status } = useSession();



  const isOrgMember =

    status === "authenticated" &&

    (session?.user as { role?: string } | undefined)?.role === orgType;



  const label = isOrgMember ? t("ctaAccess") : t("ctaPrimary");



  if (isOrgMember) {

    return (

      <Link href={getOrgDashboardPath(orgType)} className={className}>

        {label} <ArrowRight className="w-4 h-4" />

      </Link>

    );

  }



  return (

    <Link href={`/auth/register?type=${orgType}`} className={className}>

      {label} <ArrowRight className="w-4 h-4" />

    </Link>

  );

}


