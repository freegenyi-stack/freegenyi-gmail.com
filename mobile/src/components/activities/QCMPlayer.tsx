import { FgType } from "@/ui/theme";
import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import type { ActivityAnswerEntry, ActivityLang, QcmQuestion } from "@/types/activity";
import { pickLang } from "@/lib/activities/scoring";
import { FgButton } from "@/components/FgButton";

type Props = {
  questions: QcmQuestion[];
  langue: ActivityLang;
  onComplete: (entries: ActivityAnswerEntry[]) => void;
};

export function QCMPlayer({ questions, langue, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [entries, setEntries] = useState<ActivityAnswerEntry[]>([]);

  const question = questions[index]!;
  const isLast = index >= questions.length - 1;
  const correctChoice = question.choix.find((c) => c.correct);
  const isCorrect = selectedId === correctChoice?.id;

  const validate = () => {
    if (!selectedId || validated) return;
    setValidated(true);
    setEntries((prev) => [
      ...prev,
      {
        index,
        label: pickLang(question.question_fr, question.question_ar, langue),
        answer: selectedId,
        correct: isCorrect,
      },
    ]);
  };

  const next = () => {
    if (isLast) {
      onComplete(entries);
      return;
    }
    setIndex((i) => i + 1);
    setSelectedId(null);
    setValidated(false);
  };

  return (
    <View style={styles.root}>
      <Text style={styles.progress}>
        {index + 1} / {questions.length}
      </Text>
      <Text style={styles.question}>{pickLang(question.question_fr, question.question_ar, langue)}</Text>
      {question.question_image_url ? (
        <Image source={{ uri: question.question_image_url }} style={styles.image} resizeMode="contain" />
      ) : null}
      <View style={styles.choices}>
        {question.choix.map((choice, i) => {
          const selected = selectedId === choice.id;
          const showResult = validated;
          let style = styles.choice;
          if (showResult && choice.correct) style = { ...style, ...styles.choiceOk };
          else if (showResult && selected && !choice.correct) style = { ...style, ...styles.choiceBad };
          else if (selected) style = { ...style, ...styles.choiceSelected };

          return (
            <Pressable
              key={choice.id}
              style={style}
              disabled={validated}
              onPress={() => setSelectedId(choice.id)}
            >
              <Text style={styles.choiceLetter}>{String.fromCharCode(65 + i)}</Text>
              <Text style={styles.choiceText}>{pickLang(choice.texte_fr, choice.texte_ar, langue)}</Text>
            </Pressable>
          );
        })}
      </View>
      {!validated ? (
        <FgButton label={langue === "ar" ? "تحقق" : "Valider"} onPress={validate} disabled={!selectedId} />
      ) : (
        <FgButton label={isLast ? (langue === "ar" ? "إنهاء" : "Terminer") : (langue === "ar" ? "التالي" : "Suivant")} onPress={next} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 16 },
  progress: { ...FgType.regular, fontSize: 12, fontWeight: "800", color: "#F97316", textTransform: "uppercase" },
  question: { ...FgType.regular, fontSize: 22, fontWeight: "800", color: "#0F172A", lineHeight: 30 },
  image: { width: "100%", height: 180, borderRadius: 16, backgroundColor: "#F5F5F4" },
  choices: { gap: 10 },
  choice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E7E5E4",
    backgroundColor: "#fff",
    padding: 14,
  },
  choiceSelected: { borderColor: "#F97316", backgroundColor: "#FFF7ED" },
  choiceOk: { borderColor: "#10B981", backgroundColor: "#D1FAE5" },
  choiceBad: { borderColor: "#EF4444", backgroundColor: "#FEE2E2" },
  choiceLetter: { fontWeight: "900", color: "#64748B", width: 20 },
  choiceText: { ...FgType.regular, flex: 1, fontSize: 15, fontWeight: "600", color: "#0F172A" },
});
