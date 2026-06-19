"use client";

import { useRegion } from "@/context/RegionContext";
import { getVariant } from "@/constants/variants";
import { useRouter } from "@/i18n/routing";
import {
  Box,
  Button,
  ButtonText,
  Card,
  Center,
  Divider,
  Heading,
  HStack,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Globe,
  GraduationCap,
  Heart,
  Library,
  MessageCircle,
  Mic,
  Monitor,
  Sparkles,
  Users,
  Wand2,
  Compass,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { LucideIcon } from "lucide-react";

const CREAM = "#FFFBF7";
const SAND = "#FFF7ED";
const INK = "#0F172A";
const MUTED = "#475569";
const ACCENT = "#F97316";

type SectionHeaderProps = {
  label: string;
  title: string;
  description?: string;
  centered?: boolean;
  isRTL?: boolean;
};

function SectionHeader({ label, title, description, centered, isRTL }: SectionHeaderProps) {
  return (
    <VStack space="sm" alignItems={centered ? "center" : "flex-start"} maxWidth={720} alignSelf={centered ? "center" : "auto"}>
      <Text
        size="xs"
        fontWeight="$bold"
        textTransform="uppercase"
        letterSpacing={3}
        color={ACCENT}
        textAlign={centered ? "center" : isRTL ? "right" : "left"}
      >
        {label}
      </Text>
      <Heading
        size="2xl"
        color={INK}
        fontWeight="$bold"
        textAlign={centered ? "center" : isRTL ? "right" : "left"}
        sx={{ _web: { lineHeight: 1.15 } }}
      >
        {title}
      </Heading>
      {description ? (
        <Text size="md" color={MUTED} textAlign={centered ? "center" : isRTL ? "right" : "left"} lineHeight="$xl">
          {description}
        </Text>
      ) : null}
    </VStack>
  );
}

function NavButton({
  label,
  href,
  variant = "solid",
  icon,
  isRTL,
}: {
  label: string;
  href: string;
  variant?: "solid" | "outline" | "dark";
  icon?: React.ReactNode;
  isRTL?: boolean;
}) {
  const router = useRouter();

  const solidProps = {
    bg: ACCENT,
    borderColor: ACCENT,
    _text: { color: "$white" },
  };
  const outlineProps = {
    bg: "$white",
    borderColor: "#FED7AA",
    _text: { color: INK },
  };
  const darkProps = {
    bg: INK,
    borderColor: INK,
    _text: { color: "$white" },
  };

  const variantProps = variant === "solid" ? solidProps : variant === "dark" ? darkProps : outlineProps;

  return (
    <Button
      size="lg"
      borderRadius="$full"
      px="$8"
      minWidth={200}
      onPress={() => router.push(href)}
      {...variantProps}
      sx={{ _web: { cursor: "pointer" } }}
    >
      <HStack space="sm" alignItems="center" flexDirection={isRTL ? "row-reverse" : "row"}>
        <ButtonText fontWeight="$semibold">{label}</ButtonText>
        {icon}
      </HStack>
    </Button>
  );
}

function PortalCard({
  title,
  description,
  cta,
  href,
  icon: Icon,
  coverColor,
  isRTL,
}: {
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: LucideIcon;
  coverColor: string;
  isRTL?: boolean;
}) {
  const router = useRouter();

  return (
    <Card
      size="lg"
      variant="elevated"
      bg="$white"
      borderRadius={28}
      overflow="hidden"
      flex={1}
      minWidth={280}
      sx={{ _web: { boxShadow: "0 12px 48px -20px rgba(15,23,42,0.12)" } }}
    >
      <Center bg={coverColor} h={192}>
        <Box bg="$white" p="$5" borderRadius={20} sx={{ _web: { boxShadow: "0 8px 30px -8px rgba(15,23,42,0.15)" } }}>
          <Icon color={ACCENT} size={36} strokeWidth={1.5} />
        </Box>
      </Center>
      <VStack p="$6" space="sm" flex={1} alignItems={isRTL ? "flex-end" : "flex-start"}>
        <Heading size="lg" color={INK}>
          {title}
        </Heading>
        <Text size="sm" color={MUTED} lineHeight="$lg" textAlign={isRTL ? "right" : "left"}>
          {description}
        </Text>
        <Pressable
          mt="$4"
          onPress={() => router.push(href)}
          bg="#FFF7ED"
          px="$4"
          py="$2"
          borderRadius="$full"
          sx={{ _web: { cursor: "pointer" } }}
        >
          <Text size="sm" fontWeight="$semibold" color={ACCENT}>
            {cta} →
          </Text>
        </Pressable>
      </VStack>
    </Card>
  );
}

function FeatureCard({
  title,
  description,
  icon: Icon,
  isRTL,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  isRTL?: boolean;
}) {
  return (
    <Card size="md" variant="outline" bg="$white" borderColor="#FFE4CC" borderRadius={20} p="$5">
      <VStack space="sm" alignItems={isRTL ? "flex-end" : "flex-start"}>
        <Box bg="#FFF7ED" p="$3" borderRadius={12}>
          <Icon color={ACCENT} size={20} />
        </Box>
        <Heading size="sm" color={INK}>
          {title}
        </Heading>
        <Text size="sm" color={MUTED} textAlign={isRTL ? "right" : "left"}>
          {description}
        </Text>
      </VStack>
    </Card>
  );
}

export default function LandingPageContent() {
  const t = useTranslations("Hero");
  const tL = useTranslations("Landing");
  const tNav = useTranslations("Nav");
  const ti = useTranslations("Impact");
  const tp = useTranslations("Portals");
  const te = useTranslations("Ecosystem");
  const tin = useTranslations("Innovation");

  const locale = useLocale();
  const { selectedCountry, selectedLang } = useRegion();
  const variant = getVariant(selectedCountry, selectedLang);
  const isRTL = locale === "ar" || locale.endsWith("-ar");

  const portals = [
    { key: "Local" as const, icon: BookOpen, href: "/portal-local", cover: "#CCFBF1" },
    { key: "World" as const, icon: Globe, href: "/portal-world", cover: "#FFEDD5" },
    { key: "Magic" as const, icon: Wand2, href: "/portal-magic", cover: "#EDE9FE" },
  ];

  const features = [
    { key: "geny" as const, icon: Sparkles },
    { key: "workshop" as const, icon: BookOpen },
    { key: "library" as const, icon: Library },
    { key: "messaging" as const, icon: MessageCircle },
    { key: "screenTime" as const, icon: Monitor },
    { key: "explore" as const, icon: Compass },
  ];

  const stats = [
    { value: "15K+", label: ti("Geniuses") },
    { value: "60+", label: ti("Countries") },
    { value: "300+", label: ti("Schools") },
    { value: "16+", label: ti("Languages") },
    { value: "55K+", label: ti("Courses") },
  ];

  const testimonials = (["t1", "t2", "t3", "t4"] as const).map((k) => ({
    name: tL(`testimonials.${k}.name`),
    quote: tL(`testimonials.${k}.quote`),
  }));

  const gallery = (
    [
      { key: "g1", icon: BookOpen, color: "#FDBA74" },
      { key: "g2", icon: Library, color: "#5EEAD4" },
      { key: "g3", icon: BookOpen, color: "#67E8F9" },
      { key: "g4", icon: Globe, color: "#FCD34D" },
      { key: "g5", icon: Wand2, color: "#C4B5FD" },
      { key: "g6", icon: Heart, color: "#FDA4AF" },
    ] as const
  ).map(({ key, icon, color }) => ({
    label: tL(`gallery.${key}`),
    icon,
    color,
  }));

  const events = (["e1", "e2"] as const).map((k) => ({
    day: tL(`events.${k}.day`),
    month: tL(`events.${k}.month`),
    title: tL(`events.${k}.title`),
    location: tL(`events.${k}.location`),
    href: k === "e1" ? "/blog" : "/contact",
    cta: tL("eventsSeeDetails"),
  }));

  const bullets = [tL("aboutBullet1"), tL("aboutBullet2"), tL("aboutBullet3")];
  const router = useRouter();

  return (
    <Box bg={CREAM} sx={{ _web: { direction: isRTL ? "rtl" : "ltr" } }}>
      <Box
        pt={120}
        pb="$16"
        px="$4"
        sx={{
          _web: {
            marginTop: "calc(-1 * var(--header-height, 72px))",
            paddingTop: "calc(var(--header-height, 72px) + 3rem)",
          },
        }}
      >
        <Center maxWidth={896} alignSelf="center">
          <VStack space="lg" alignItems="center">
            <Text size="xs" fontWeight="$bold" textTransform="uppercase" letterSpacing={4} color={ACCENT}>
              {t("status")}
            </Text>
            <Heading size="3xl" color={INK} textAlign="center" fontWeight="$bold" sx={{ _web: { maxWidth: 800, lineHeight: 1.12 } }}>
              {t.rich("title", {
                orange: (chunks) => (
                  <Text color={ACCENT} fontWeight="$bold">
                    {chunks}
                  </Text>
                ),
              })}
            </Heading>
            <Text size="lg" color={MUTED} textAlign="center" maxWidth={640} lineHeight="$xl">
              {t("subtitle")}
            </Text>
            <HStack space="md" flexWrap="wrap" justifyContent="center" mt="$2">
              <NavButton
                label={t("cta")}
                href="/auth/register"
                icon={<ArrowRight color="white" size={16} style={isRTL ? { transform: "rotate(180deg)" } : undefined} />}
                isRTL={isRTL}
              />
              <NavButton label={t("approach")} href="/approach" variant="outline" />
            </HStack>
          </VStack>
        </Center>
      </Box>

      <Box pb="$16" px="$4">
        <VStack space="xl" maxWidth={1152} alignSelf="center" width="100%">
          <SectionHeader label={tL("classroomLabel")} title={tL("classroomTitle")} description={tp("Subtitle")} centered isRTL={isRTL} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} sx={{ _web: { overflowX: "auto" } }}>
            <HStack space="lg" pb="$2" sx={{ _web: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 20, overflow: "visible" } }}>
              {portals.map(({ key, icon, href, cover }) => (
                <PortalCard
                  key={key}
                  title={tp(`${key}.Title`)}
                  description={tp(`${key}.Desc`)}
                  cta={tp(`${key}.CTA`)}
                  href={href}
                  icon={icon}
                  coverColor={cover}
                  isRTL={isRTL}
                />
              ))}
            </HStack>
          </ScrollView>
        </VStack>
      </Box>

      <Box bg={SAND} py="$16" px="$4">
        <HStack
          maxWidth={1152}
          alignSelf="center"
          width="100%"
          flexWrap="wrap"
          space="2xl"
          sx={{ _web: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 48 } }}
        >
          <VStack space="md" sx={{ _web: { order: isRTL ? 2 : 1 } }}>
            <SectionHeader label={tL("aboutLabel")} title={tL("aboutTitle")} isRTL={isRTL} />
            <Text color={MUTED} lineHeight="$xl" textAlign={isRTL ? "right" : "left"}>
              {tL("aboutText")}
            </Text>
            <VStack space="sm" mt="$2">
              {bullets.map((item) => (
                <HStack key={item} space="sm" alignItems="flex-start" flexDirection={isRTL ? "row-reverse" : "row"}>
                  <CheckCircle2 color="#0D9488" size={20} style={{ marginTop: 2, flexShrink: 0 }} />
                  <Text size="sm" color={INK} textAlign={isRTL ? "right" : "left"}>
                    {item}
                  </Text>
                </HStack>
              ))}
            </VStack>
            <Box mt="$4">
              <NavButton label={tL("readStory")} href="/approach" variant="outline" />
            </Box>
          </VStack>
          <Box sx={{ _web: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 } }}>
            {features.map(({ key, icon }) => (
              <FeatureCard
                key={key}
                icon={icon}
                title={tL(`features.${key}.title`)}
                description={tL(`features.${key}.desc`)}
                isRTL={isRTL}
              />
            ))}
          </Box>
        </HStack>
      </Box>

      <Box bg={SAND} borderTopWidth={1} borderBottomWidth={1} borderColor="#FFEDD5" py="$12" px="$4">
        <HStack
          maxWidth={1152}
          alignSelf="center"
          width="100%"
          flexWrap="wrap"
          justifyContent="space-between"
          sx={{ _web: { display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 24 } }}
        >
          {stats.map((s) => (
            <VStack key={s.label} alignItems="center" space="xs">
              <Text size="4xl" fontWeight="$bold" color={ACCENT}>
                {s.value}
              </Text>
              <Text size="xs" fontWeight="$semibold" textTransform="uppercase" letterSpacing={2} color={MUTED} textAlign="center">
                {s.label}
              </Text>
            </VStack>
          ))}
        </HStack>
      </Box>

      <Box py="$16" px="$4">
        <VStack space="xl" maxWidth={1152} alignSelf="center" width="100%">
          <SectionHeader label={tL("testimonialsLabel")} title={tL("testimonialsTitle")} centered isRTL={isRTL} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HStack space="md" pb="$2">
              {testimonials.map((item) => (
                <Card key={item.name} size="lg" variant="elevated" bg="$white" borderRadius={24} minWidth={300} maxWidth={360} p="$6">
                  <VStack space="md">
                    <Text size="md" color={MUTED} fontStyle="italic" lineHeight="$xl">
                      “{item.quote}”
                    </Text>
                    <Text size="sm" fontWeight="$bold" color={INK}>
                      {item.name}
                    </Text>
                  </VStack>
                </Card>
              ))}
            </HStack>
          </ScrollView>
        </VStack>
      </Box>

      <Box bg={SAND} py="$16" px="$4">
        <VStack space="xl" maxWidth={1152} alignSelf="center" width="100%">
          <SectionHeader label={tL("eventsLabel")} title={tL("eventsTitle")} centered isRTL={isRTL} />
          <VStack space="md">
            {events.map((event) => (
              <Card key={event.title} size="lg" variant="elevated" bg="$white" borderRadius={20} p="$5">
                <HStack space="lg" alignItems="center" flexDirection={isRTL ? "row-reverse" : "row"} flexWrap="wrap">
                  <VStack alignItems="center" minWidth={72}>
                    <Text size="2xl" fontWeight="$bold" color={ACCENT}>
                      {event.day}
                    </Text>
                    <Text size="xs" fontWeight="$semibold" textTransform="uppercase" color={MUTED}>
                      {event.month}
                    </Text>
                  </VStack>
                  <Divider orientation="vertical" bg="#FFE4CC" sx={{ _web: { height: 48 } }} />
                  <VStack flex={1} space="xs" alignItems={isRTL ? "flex-end" : "flex-start"}>
                    <Heading size="sm" color={INK}>
                      {event.title}
                    </Heading>
                    <Text size="sm" color={MUTED}>
                      {event.location}
                    </Text>
                  </VStack>
                  <Pressable onPress={() => router.push(event.href)} sx={{ _web: { cursor: "pointer" } }}>
                    <Text size="sm" fontWeight="$semibold" color={ACCENT}>
                      {event.cta}
                    </Text>
                  </Pressable>
                </HStack>
              </Card>
            ))}
          </VStack>
        </VStack>
      </Box>

      <Box py="$16" px="$4">
        <VStack space="xl" maxWidth={1152} alignSelf="center" width="100%">
          <SectionHeader label={tL("galleryLabel")} title={tL("galleryTitle")} centered isRTL={isRTL} />
          <Box sx={{ _web: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 } }}>
            {gallery.map(({ label, icon: Icon, color }) => (
              <Card key={label} size="md" variant="elevated" bg="$white" borderRadius={20} overflow="hidden" p="$0">
                <Center h={120} bg={color}>
                  <Icon color={INK} size={32} />
                </Center>
                <Box p="$4">
                  <Text size="sm" fontWeight="$semibold" color={INK} textAlign="center">
                    {label}
                  </Text>
                </Box>
              </Card>
            ))}
          </Box>
        </VStack>
      </Box>

      <Box bg={SAND} py="$16" px="$4">
        <VStack space="xl" maxWidth={1152} alignSelf="center" width="100%">
          <SectionHeader label={te("Tag")} title={te("Title")} description={te("Subtitle")} centered isRTL={isRTL} />
          <HStack space="lg" flexWrap="wrap" sx={{ _web: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 24 } }}>
            {(
              [
                { key: "Parents" as const, icon: Heart, href: "/parents", tint: "#FFF7ED" },
                { key: "Teachers" as const, icon: GraduationCap, href: "/teachers", tint: "#ECFDF5" },
              ] as const
            ).map(({ key, icon: Icon, href, tint }) => (
              <Card key={key} size="lg" variant="elevated" bg="$white" borderRadius={28} overflow="hidden" p="$0">
                <Center h={144} bg={tint}>
                  <Box bg="$white" p="$4" borderRadius={16}>
                    <Icon color={ACCENT} size={32} />
                  </Box>
                </Center>
                <VStack p="$7" space="sm" alignItems={isRTL ? "flex-end" : "flex-start"}>
                  <Heading size="lg" color={INK}>
                    {te(`${key}.Title`)}
                  </Heading>
                  <Text color={MUTED} textAlign={isRTL ? "right" : "left"}>
                    {te(`${key}.Desc`)}
                  </Text>
                  <Box mt="$4">
                    <NavButton label={te(`${key}.CTA`)} href={href} variant="dark" />
                  </Box>
                </VStack>
              </Card>
            ))}
          </HStack>
        </VStack>
      </Box>

      <Box py="$16" px="$4">
        <HStack
          maxWidth={1152}
          alignSelf="center"
          width="100%"
          flexWrap="wrap"
          space="2xl"
          sx={{ _web: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 40 } }}
        >
          <VStack space="md">
            <SectionHeader label={tin("Tag")} title={tin("Title")} isRTL={isRTL} />
            <VStack space="md">
              {(
                [{ key: "Boost" as const, icon: Mic }, { key: "AI" as const, icon: Sparkles }] as const
              ).map(({ key, icon: Icon }) => (
                <Card key={key} size="md" variant="outline" borderColor="#FFE4CC" bg="$white" borderRadius={16} p="$5">
                  <HStack space="md" alignItems="flex-start" flexDirection={isRTL ? "row-reverse" : "row"}>
                    <Box bg="#FFF7ED" p="$3" borderRadius={12}>
                      <Icon color={ACCENT} size={20} />
                    </Box>
                    <VStack flex={1} space="xs" alignItems={isRTL ? "flex-end" : "flex-start"}>
                      <Heading size="sm" color={INK}>
                        {tin(`${key}.Title`)}
                      </Heading>
                      <Text size="sm" color={MUTED} textAlign={isRTL ? "right" : "left"}>
                        {tin(`${key}.Desc`)}
                      </Text>
                    </VStack>
                  </HStack>
                </Card>
              ))}
            </VStack>
          </VStack>
          <Card size="lg" variant="elevated" bg="$white" borderRadius={28} borderColor="#FFE4CC" p="$8">
            <HStack space="md" alignItems="flex-start" flexDirection={isRTL ? "row-reverse" : "row"}>
              <Center bg="#FFEDD5" w={44} h={44} borderRadius="$full">
                <Users color={ACCENT} size={20} />
              </Center>
              <Text flex={1} color={INK} lineHeight="$xl" textAlign={isRTL ? "right" : "left"}>
                {variant.scienceQuote}
              </Text>
            </HStack>
            <Box mt="$8" h={6} bg="#FFEDD5" borderRadius="$full" overflow="hidden">
              <Box w="78%" h="100%" bg={ACCENT} borderRadius="$full" />
            </Box>
            <Text mt="$4" size="xs" fontWeight="$semibold" textTransform="uppercase" letterSpacing={2} color={MUTED} textAlign={isRTL ? "right" : "left"}>
              FreeGeny · {selectedCountry}-{selectedLang}
            </Text>
          </Card>
        </HStack>
      </Box>

      <Box pb="$16" px="$4">
        <Box
          maxWidth={1152}
          alignSelf="center"
          width="100%"
          borderRadius={32}
          px="$8"
          py="$12"
          bg={ACCENT}
          sx={{ _web: { backgroundImage: "linear-gradient(135deg, #F97316 0%, #F59E0B 100%)" } }}
        >
          <VStack space="md" alignItems="center">
            <Text size="xs" fontWeight="$bold" textTransform="uppercase" letterSpacing={3} color="#FFEDD5">
              {tL("registerLabel")}
            </Text>
            <Heading size="2xl" color="$white" textAlign="center">
              {tL("registerTitle")}
            </Heading>
            <Text color="#FFEDD5" textAlign="center" maxWidth={560} size="md">
              {tL("registerDesc")}
            </Text>
            <HStack space="md" flexWrap="wrap" justifyContent="center" mt="$2">
              <Button
                size="lg"
                borderRadius="$full"
                bg="$white"
                minWidth={200}
                onPress={() => router.push("/auth/register")}
                sx={{ _web: { cursor: "pointer" } }}
              >
                <ButtonText color={ACCENT} fontWeight="$semibold">
                  {tL("registerCta")}
                </ButtonText>
              </Button>
              <Button
                size="lg"
                variant="outline"
                borderRadius="$full"
                borderColor="rgba(255,255,255,0.4)"
                bg="transparent"
                minWidth={200}
                onPress={() => router.push("/dashboard/explore")}
                sx={{ _web: { cursor: "pointer" } }}
              >
                <ButtonText color="$white" fontWeight="$semibold">
                  {tNav("FreeExplore")}
                </ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
