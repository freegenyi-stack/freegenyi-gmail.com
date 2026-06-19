import { FgType } from "@/ui/theme";
import { useMemo, useRef, type ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import type {
  ActivityAnswerEntry,
  ActivityContentEnvelope,
  ActivityLang,
  ActivityResult,
  ActivityType,
  QcmContent,
  QcmQuestion,
  VraiFauxContent,
  VraiFauxItem,
} from "@/types/activity";
import { buildActivityResult, pickLang } from "@/lib/activities/scoring";
import { QCMPlayer } from "./QCMPlayer";
import { VraiFauxPlayer } from "./VraiFauxPlayer";
import {
  FlashcardsPlayer,
  CalculPlayer,
  SequencingPlayer,
  MatchingPlayer,
  TexteATrousPlayer,
  MemoryPlayer,
  LettresPlayer,
  DragDropPlayer,
  HotspotPlayer,
  ColoriagePlayer,
} from "./ExtraPlayers";

type Props = {
  envelope: ActivityContentEnvelope;
  activityType: ActivityType;
  resourceId: number;
  langue: ActivityLang;
  onComplete: (result: ActivityResult) => void;
};

function qcmQuestions(content: QcmContent): QcmQuestion[] {
  if (content.questions?.length) return content.questions;
  return [
    {
      question_fr: content.question_fr,
      question_ar: content.question_ar,
      question_image_url: content.question_image_url,
      choix: content.choix,
      explication_fr: content.explication_fr,
      explication_ar: content.explication_ar,
    },
  ];
}

function vraiFauxItems(content: VraiFauxContent): VraiFauxItem[] {
  if (content.items?.length) return content.items;
  return [
    {
      affirmation_fr: content.affirmation_fr,
      affirmation_ar: content.affirmation_ar,
      reponse_correcte: content.reponse_correcte,
      explication_fr: content.explication_fr,
      explication_ar: content.explication_ar,
    },
  ];
}

export function ActivityPlayer({ envelope, activityType, resourceId, langue, onComplete }: Props) {
  const startedAt = useRef(Date.now()).current;
  const title = useMemo(
    () => pickLang(envelope.titre_fr || "", envelope.titre_ar || "", langue),
    [envelope, langue]
  );

  const finish = (entries: ActivityAnswerEntry[]) => {
    onComplete(
      buildActivityResult({
        activityId: resourceId,
        activityType,
        envelope,
        answers: { activityType, entries },
        startedAt,
      })
    );
  };

  const wrap = (child: ReactNode) => (
    <View style={styles.root}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {child}
    </View>
  );

  const c = envelope.contenu as Record<string, unknown>;

  if (activityType === "QCM") {
    return wrap(<QCMPlayer questions={qcmQuestions(envelope.contenu as QcmContent)} langue={langue} onComplete={finish} />);
  }
  if (activityType === "VRAI_FAUX") {
    return wrap(<VraiFauxPlayer items={vraiFauxItems(envelope.contenu as VraiFauxContent)} langue={langue} onComplete={finish} />);
  }
  if (activityType === "FLASHCARDS" && Array.isArray(c.cartes)) {
    return wrap(<FlashcardsPlayer cartes={c.cartes as never} langue={langue} onComplete={finish} />);
  }
  if (activityType === "CALCUL_INTERACTIF") {
    const items = (c.items as never[]) ?? [c];
    return wrap(<CalculPlayer items={items as never} langue={langue} onComplete={finish} />);
  }
  if (activityType === "SEQUENCING" && Array.isArray(c.elements)) {
    return wrap(<SequencingPlayer elements={c.elements as never} langue={langue} onComplete={finish} />);
  }
  if (activityType === "MATCHING" && Array.isArray(c.paires)) {
    return wrap(<MatchingPlayer paires={c.paires as never} langue={langue} onComplete={finish} />);
  }
  if (activityType === "TEXTE_A_TROUS") {
    return wrap(<TexteATrousPlayer content={c as never} langue={langue} onComplete={finish} />);
  }
  if (activityType === "MEMORY_GAME" && Array.isArray(c.paires)) {
    return wrap(<MemoryPlayer paires={c.paires as never} langue={langue} onComplete={finish} />);
  }
  if (activityType === "LETTRES_MANQUANTES") {
    return wrap(<LettresPlayer content={c as never} langue={langue} onComplete={finish} />);
  }
  if (activityType === "DRAG_DROP" && Array.isArray(c.elements)) {
    return wrap(<DragDropPlayer content={c as never} langue={langue} onComplete={finish} />);
  }
  if (activityType === "IMAGE_HOTSPOT" && c.image_url) {
    return wrap(<HotspotPlayer content={c as never} langue={langue} onComplete={finish} />);
  }
  if (activityType === "COLORIAGE") {
    return wrap(<ColoriagePlayer content={c as never} langue={langue} onComplete={finish} />);
  }

  return (
    <View style={styles.unsupported}>
      <Text style={styles.unsupportedTitle}>{title || activityType}</Text>
      <Text style={styles.unsupportedText}>
        {langue === "ar" ? "نوع النشاط غير مدعوم." : "Type d'activité non reconnu."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 12 },
  title: { ...FgType.regular, fontSize: 18, fontWeight: "800", color: "#0F172A" },
  unsupported: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FDBA74",
    gap: 8,
  },
  unsupportedTitle: { ...FgType.regular, fontSize: 18, fontWeight: "800", color: "#C2410C" },
  unsupportedText: { ...FgType.regular, fontSize: 14, color: "#7C2D12", lineHeight: 20 },
});
