import { FgType } from "@/ui/theme";
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { ActivityAnswerEntry, ActivityLang, VraiFauxItem } from "@/types/activity";
import { pickLang } from "@/lib/activities/scoring";
import { FgButton } from "@/components/FgButton";

type Props = {
  items: VraiFauxItem[];
  langue: ActivityLang;
  onComplete: (entries: ActivityAnswerEntry[]) => void;
};

export function VraiFauxPlayer({ items, langue, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [entries, setEntries] = useState<ActivityAnswerEntry[]>([]);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const item = items[index]!;
  const isLast = index >= items.length - 1;
  const isCorrect = answered === item.reponse_correcte;

  const handleAnswer = (value: boolean) => {
    if (answered !== null) return;
    setAnswered(value);
    setShowFeedback(true);
    setEntries((prev) => [
      ...prev,
      {
        index,
        label: pickLang(item.affirmation_fr, item.affirmation_ar, langue),
        answer: value,
        correct: value === item.reponse_correcte,
      },
    ]);
  };

  const next = () => {
    if (isLast) {
      onComplete(entries);
      return;
    }
    setIndex((i) => i + 1);
    setAnswered(null);
    setShowFeedback(false);
  };

  return (
    <View style={styles.root}>
      <Text style={styles.progress}>
        {index + 1} / {items.length}
      </Text>
      <Text style={styles.statement}>{pickLang(item.affirmation_fr, item.affirmation_ar, langue)}</Text>
      <View style={styles.row}>
        <Pressable
          style={[styles.btn, styles.trueBtn, answered === true && styles.selected]}
          disabled={answered !== null}
          onPress={() => handleAnswer(true)}
        >
          <Text style={styles.btnText}>{langue === "ar" ? "صحيح" : "Vrai"}</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.falseBtn, answered === false && styles.selected]}
          disabled={answered !== null}
          onPress={() => handleAnswer(false)}
        >
          <Text style={styles.btnText}>{langue === "ar" ? "خطأ" : "Faux"}</Text>
        </Pressable>
      </View>
      {showFeedback ? (
        <Text style={[styles.feedback, isCorrect ? styles.feedbackOk : styles.feedbackBad]}>
          {isCorrect
            ? langue === "ar"
              ? "أحسنت!"
              : "Bravo !"
            : pickLang(item.explication_fr || "Incorrect", item.explication_ar || "خطأ", langue)}
        </Text>
      ) : null}
      {showFeedback ? (
        <FgButton label={isLast ? (langue === "ar" ? "إنهاء" : "Terminer") : (langue === "ar" ? "التالي" : "Suivant")} onPress={next} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 16 },
  progress: { ...FgType.regular, fontSize: 12, fontWeight: "800", color: "#F97316", textTransform: "uppercase" },
  statement: { ...FgType.regular, fontSize: 22, fontWeight: "800", color: "#0F172A", lineHeight: 30 },
  row: { flexDirection: "row", gap: 12 },
  btn: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 2,
  },
  trueBtn: { borderColor: "#10B981", backgroundColor: "#ECFDF5" },
  falseBtn: { borderColor: "#EF4444", backgroundColor: "#FEF2F2" },
  selected: { borderWidth: 3 },
  btnText: { ...FgType.regular, fontWeight: "900", fontSize: 16, color: "#0F172A" },
  feedback: { ...FgType.regular, fontSize: 15, fontWeight: "700", textAlign: "center" },
  feedbackOk: { color: "#059669" },
  feedbackBad: { color: "#DC2626" },
});
