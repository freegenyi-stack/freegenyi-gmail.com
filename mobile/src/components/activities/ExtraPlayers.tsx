import { FgType } from "@/ui/theme";
import { useMemo, useState } from "react";
import { View, Text, Pressable, StyleSheet, TextInput, Image, ScrollView } from "react-native";
import type { ActivityAnswerEntry, ActivityLang } from "@/types/activity";
import { pickLang } from "@/lib/activities/scoring";
import { shuffleArray } from "@/lib/activities/utils";
import { FgButton } from "@/components/FgButton";

type Finish = (entries: ActivityAnswerEntry[]) => void;

export function FlashcardsPlayer({
  cartes,
  langue,
  onComplete,
}: {
  cartes: { id: string; recto_texte_fr: string; recto_texte_ar: string; verso_texte_fr: string; verso_texte_ar: string }[];
  langue: ActivityLang;
  onComplete: Finish;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [entries, setEntries] = useState<ActivityAnswerEntry[]>([]);
  const carte = cartes[index];
  const isLast = index >= cartes.length - 1;

  const next = () => {
    const entry: ActivityAnswerEntry = {
      index,
      questionId: carte.id,
      label: pickLang(carte.recto_texte_fr, carte.recto_texte_ar, langue),
      answer: pickLang(carte.verso_texte_fr, carte.verso_texte_ar, langue),
      correct: true,
    };
    const nextEntries = [...entries, entry];
    if (isLast) onComplete(nextEntries);
    else {
      setEntries(nextEntries);
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  };

  if (!carte) return null;

  return (
    <View style={styles.block}>
      <Text style={styles.meta}>{index + 1} / {cartes.length}</Text>
      <Pressable style={styles.flashCard} onPress={() => setFlipped((f) => !f)}>
        <Text style={styles.flashText}>
          {flipped
            ? pickLang(carte.verso_texte_fr, carte.verso_texte_ar, langue)
            : pickLang(carte.recto_texte_fr, carte.recto_texte_ar, langue)}
        </Text>
        <Text style={styles.tapHint}>{flipped ? "" : langue === "ar" ? "اضغط للقلب" : "Appuie pour retourner"}</Text>
      </Pressable>
      {flipped ? <FgButton label={isLast ? (langue === "ar" ? "إنهاء" : "Terminer") : (langue === "ar" ? "التالي" : "Suivant")} onPress={next} /> : null}
    </View>
  );
}

export function CalculPlayer({
  items,
  langue,
  onComplete,
}: {
  items: {
    operation: string;
    nombre_a: number;
    nombre_b: number;
    reponse_correcte: number;
    question_fr?: string;
    question_ar?: string;
  }[];
  langue: ActivityLang;
  onComplete: Finish;
}) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<ActivityAnswerEntry[]>([]);
  const item = items[index]!;
  const sym = item.operation === "multiplication" ? "×" : item.operation === "soustraction" ? "−" : item.operation === "division" ? "÷" : "+";
  const isLast = index >= items.length - 1;

  const validate = () => {
    const correct = parseInt(input, 10) === item.reponse_correcte;
    const entry: ActivityAnswerEntry = { index, answer: input, correct, label: `${item.nombre_a} ${sym} ${item.nombre_b}` };
    const nextEntries = [...entries, entry];
    if (isLast) onComplete(nextEntries);
    else {
      setEntries(nextEntries);
      setIndex((i) => i + 1);
      setInput("");
    }
  };

  return (
    <View style={styles.block}>
      <Text style={styles.question}>{item.nombre_a} {sym} {item.nombre_b} = ?</Text>
      <TextInput style={styles.calcInput} keyboardType="number-pad" value={input} onChangeText={setInput} />
      <FgButton label={langue === "ar" ? "تحقق" : "Valider"} onPress={validate} disabled={!input} />
    </View>
  );
}

export function SequencingPlayer({
  elements,
  langue,
  onComplete,
}: {
  elements: { id: string; texte_fr: string; texte_ar: string; ordre_correct: number }[];
  langue: ActivityLang;
  onComplete: Finish;
}) {
  const initial = useMemo(() => shuffleArray(elements), [elements]);
  const [items, setItems] = useState(initial);
  const correctOrder = [...elements].sort((a, b) => a.ordre_correct - b.ordre_correct);

  const move = (from: number, dir: -1 | 1) => {
    const to = from + dir;
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    [next[from], next[to]] = [next[to]!, next[from]!];
    setItems(next);
  };

  const validate = () => {
    const entries = items.map((item, index) => ({
      index,
      label: pickLang(item.texte_fr, item.texte_ar, langue),
      answer: item.id,
      correct: correctOrder[index]?.id === item.id,
    }));
    onComplete(entries);
  };

  return (
    <View style={styles.block}>
      {items.map((item, i) => (
        <View key={item.id} style={styles.seqRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.seqText}>{pickLang(item.texte_fr, item.texte_ar, langue)}</Text>
          </View>
          <Pressable onPress={() => move(i, -1)} style={styles.seqBtn}><Text>↑</Text></Pressable>
          <Pressable onPress={() => move(i, 1)} style={styles.seqBtn}><Text>↓</Text></Pressable>
        </View>
      ))}
      <FgButton label={langue === "ar" ? "تحقق" : "Valider l'ordre"} onPress={validate} />
    </View>
  );
}

export function MatchingPlayer({
  paires,
  langue,
  onComplete,
}: {
  paires: { id: string; colonne_a: { type: string; valeur_fr?: string; valeur_ar?: string; valeur?: string }; colonne_b: { type: string; valeur_fr?: string; valeur_ar?: string; valeur?: string } }[];
  langue: ActivityLang;
  onComplete: Finish;
}) {
  const colB = useMemo(() => shuffleArray(paires), [paires]);
  const [selectedA, setSelectedA] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});

  const label = (col: { type: string; valeur_fr?: string; valeur_ar?: string; valeur?: string }) =>
    col.type === "image" ? col.valeur ?? "" : pickLang(col.valeur_fr ?? "", col.valeur_ar ?? "", langue);

  const pickB = (pairId: string) => {
    if (!selectedA) return;
    setMatches((m) => ({ ...m, [selectedA]: pairId }));
    setSelectedA(null);
  };

  const validate = () => {
    const entries = paires.map((p, index) => ({
      index,
      label: label(p.colonne_a),
      answer: matches[p.id] ?? "",
      correct: matches[p.id] === p.id,
    }));
    onComplete(entries);
  };

  const done = Object.keys(matches).length >= paires.length;

  return (
    <ScrollView style={styles.block}>
      <Text style={styles.section}>A</Text>
      {paires.map((p) => (
        <Pressable key={p.id} style={[styles.matchCell, selectedA === p.id && styles.matchSelected, matches[p.id] && styles.matchOk]} onPress={() => setSelectedA(p.id)}>
          <Text>{label(p.colonne_a)}</Text>
        </Pressable>
      ))}
      <Text style={styles.section}>B</Text>
      {colB.map((p) => (
        <Pressable key={`b-${p.id}`} style={styles.matchCell} onPress={() => pickB(p.id)}>
          <Text>{label(p.colonne_b)}</Text>
        </Pressable>
      ))}
      {done ? <FgButton label={langue === "ar" ? "تحقق" : "Valider"} onPress={validate} /> : null}
    </ScrollView>
  );
}

export function TexteATrousPlayer({
  content,
  langue,
  onComplete,
}: {
  content: { mode: "choix" | "clavier"; texte_fr: string; texte_ar: string; trous: { id: string; reponse_correcte: string; reponse_correcte_ar?: string; position: number }[]; word_bank_fr?: string[]; word_bank_ar?: string[] };
  langue: ActivityLang;
  onComplete: Finish;
}) {
  const text = pickLang(content.texte_fr, content.texte_ar, langue);
  const trous = [...content.trous].sort((a, b) => a.position - b.position);
  const [answers, setAnswers] = useState<Record<string, string>>(() => Object.fromEntries(trous.map((t) => [t.id, ""])));

  const validate = () => {
    const entries = trous.map((t, index) => {
      const expected = langue === "ar" && t.reponse_correcte_ar ? t.reponse_correcte_ar : t.reponse_correcte;
      return {
        index,
        questionId: t.id,
        answer: answers[t.id] ?? "",
        correct: (answers[t.id] ?? "").trim().toLowerCase() === expected.trim().toLowerCase(),
      };
    });
    onComplete(entries);
  };

  return (
    <View style={styles.block}>
      <Text style={styles.paragraph}>{text.replace(/___/g, "____")}</Text>
      {trous.map((t, i) => (
        <TextInput
          key={t.id}
          style={styles.blankInput}
          placeholder={`${langue === "ar" ? "فراغ" : "Trou"} ${i + 1}`}
          value={answers[t.id]}
          onChangeText={(v) => setAnswers((a) => ({ ...a, [t.id]: v }))}
        />
      ))}
      <FgButton label={langue === "ar" ? "تحقق" : "Valider"} onPress={validate} />
    </View>
  );
}

export function MemoryPlayer({
  paires,
  langue,
  onComplete,
}: {
  paires: { id: string; carte_a: { type: string; valeur: string }; carte_b: { type: string; valeur: string } }[];
  langue: ActivityLang;
  onComplete: Finish;
}) {
  type Card = { uid: string; pairId: string; valeur: string };
  const cards = useMemo(() => {
    const flat: Card[] = [];
    paires.forEach((p) => {
      flat.push({ uid: `${p.id}-a`, pairId: p.id, valeur: p.carte_a.valeur });
      flat.push({ uid: `${p.id}-b`, pairId: p.id, valeur: p.carte_b.valeur });
    });
    return shuffleArray(flat);
  }, [paires]);

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);

  const flip = (uid: string, pairId: string) => {
    if (flipped.includes(uid) || matched.includes(pairId) || flipped.length >= 2) return;
    const next = [...flipped, uid];
    setFlipped(next);
    if (next.length === 2) {
      const [a, b] = next;
      const ca = cards.find((c) => c.uid === a);
      const cb = cards.find((c) => c.uid === b);
      if (ca && cb && ca.pairId === cb.pairId && ca.uid !== cb.uid) {
        const newMatched = [...matched, ca.pairId];
        setMatched(newMatched);
        setFlipped([]);
        if (newMatched.length >= paires.length) {
          onComplete([{ index: 0, label: "memory", answer: `${newMatched.length}/${paires.length}`, correct: true }]);
        }
      } else {
        setTimeout(() => setFlipped([]), 700);
      }
    }
  };

  return (
    <View style={styles.memoryGrid}>
      {cards.map((c) => {
        const show = flipped.includes(c.uid) || matched.includes(c.pairId);
        return (
          <Pressable key={c.uid} style={styles.memoryCard} onPress={() => flip(c.uid, c.pairId)}>
            <Text style={styles.memoryText}>{show ? c.valeur : "?"}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function LettresPlayer({
  content,
  langue,
  onComplete,
}: {
  content: { mot_fr: string; mot_ar: string; lettres_masquees_fr: number[]; lettres_masquees_ar: number[]; lettres_disponibles_fr: string[]; lettres_disponibles_ar: string[] };
  langue: ActivityLang;
  onComplete: Finish;
}) {
  const word = pickLang(content.mot_fr, content.mot_ar, langue);
  const masked = langue === "ar" ? content.lettres_masquees_ar : content.lettres_masquees_fr;
  const bank = langue === "ar" ? content.lettres_disponibles_ar : content.lettres_disponibles_fr;
  const letters = Array.from(word);
  const [filled, setFilled] = useState<Record<number, string>>({});

  const pick = (letter: string) => {
    const nextSlot = masked.find((i) => filled[i] === undefined);
    if (nextSlot === undefined) return;
    setFilled((f) => ({ ...f, [nextSlot]: letter }));
  };

  const validate = () => {
    const entries = masked.map((index, i) => ({
      index: i,
      answer: filled[index] ?? "",
      correct: (filled[index] ?? "") === (letters[index] ?? ""),
    }));
    onComplete(entries);
  };

  return (
    <View style={styles.block}>
      <Text style={styles.wordRow}>
        {letters.map((l, i) => (
          <Text key={i} style={styles.wordLetter}>{masked.includes(i) ? filled[i] ?? "_" : l}</Text>
        ))}
      </Text>
      <View style={styles.chips}>
        {bank.map((l, i) => (
          <Pressable key={`${l}-${i}`} style={styles.chip} onPress={() => pick(l)}><Text>{l}</Text></Pressable>
        ))}
      </View>
      <FgButton label={langue === "ar" ? "تحقق" : "Valider"} onPress={validate} />
    </View>
  );
}

export function DragDropPlayer({
  content,
  langue,
  onComplete,
}: {
  content: { elements: { id: string; texte_fr: string; texte_ar: string; zone_correcte: string }[]; zones: { id: string; label_fr: string; label_ar: string }[] };
  langue: ActivityLang;
  onComplete: Finish;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Record<string, string>>({});

  const placeInZone = (zoneId: string) => {
    if (!selected) return;
    setPlacements((p) => ({ ...p, [selected]: zoneId }));
    setSelected(null);
  };

  const validate = () => {
    const entries = content.elements.map((el, index) => ({
      index,
      label: pickLang(el.texte_fr, el.texte_ar, langue),
      answer: placements[el.id] ?? "",
      correct: placements[el.id] === el.zone_correcte,
    }));
    onComplete(entries);
  };

  return (
    <View style={styles.block}>
      <View style={styles.chips}>
        {content.elements.filter((e) => !placements[e.id]).map((el) => (
          <Pressable key={el.id} style={[styles.chip, selected === el.id && styles.chipActive]} onPress={() => setSelected(el.id)}>
            <Text>{pickLang(el.texte_fr, el.texte_ar, langue)}</Text>
          </Pressable>
        ))}
      </View>
      {content.zones.map((z) => (
        <Pressable key={z.id} style={styles.dropZone} onPress={() => placeInZone(z.id)}>
          <Text style={styles.zoneLabel}>{pickLang(z.label_fr, z.label_ar, langue)}</Text>
          <Text>{content.elements.filter((e) => placements[e.id] === z.id).map((e) => pickLang(e.texte_fr, e.texte_ar, langue)).join(", ")}</Text>
        </Pressable>
      ))}
      <FgButton label={langue === "ar" ? "تحقق" : "Valider"} onPress={validate} />
    </View>
  );
}

export function HotspotPlayer({
  content,
  langue,
  onComplete,
}: {
  content: { image_url: string; zones: { id: string; label_fr: string; label_ar: string; x_percent: number; y_percent: number; rayon_percent: number; correct: boolean }[] };
  langue: ActivityLang;
  onComplete: Finish;
}) {
  const [tapped, setTapped] = useState<string[]>([]);
  const correctZones = content.zones.filter((z) => z.correct);

  const tapZone = (id: string) => {
    if (tapped.includes(id)) return;
    const next = [...tapped, id];
    setTapped(next);
    if (next.filter((zid) => content.zones.find((z) => z.id === zid)?.correct).length >= correctZones.length) {
      const entries = content.zones.map((z, index) => ({
        index,
        label: pickLang(z.label_fr, z.label_ar, langue),
        answer: next.includes(z.id),
        correct: z.correct ? next.includes(z.id) : !next.includes(z.id),
      }));
      onComplete(entries);
    }
  };

  return (
    <View style={styles.block}>
      <View style={styles.hotspotImageWrap}>
        <Image source={{ uri: content.image_url }} style={styles.hotspotImage} resizeMode="contain" />
        {content.zones.map((z) => (
          <Pressable
            key={z.id}
            style={[styles.hotspot, { left: `${z.x_percent}%`, top: `${z.y_percent}%`, width: `${z.rayon_percent * 2}%`, height: `${z.rayon_percent * 2}%` }, tapped.includes(z.id) && styles.hotspotTapped]}
            onPress={() => tapZone(z.id)}
          />
        ))}
      </View>
      <Text style={styles.hint}>{langue === "ar" ? "اضغط على المناطق الصحيحة" : "Touche les bonnes zones"}</Text>
    </View>
  );
}

export function ColoriagePlayer({
  content,
  langue,
  onComplete,
}: {
  content: { zones_guidees?: { zone_id: string; couleur_correcte: string; label_fr: string; label_ar: string }[]; palette?: string[] };
  langue: ActivityLang;
  onComplete: Finish;
}) {
  const zones = content.zones_guidees ?? [];
  const palette = content.palette ?? ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#3B82F6"];
  const [selectedColor, setSelectedColor] = useState(palette[0]!);
  const [colored, setColored] = useState<Record<string, string>>({});

  const colorZone = (zoneId: string) => {
    setColored((c) => ({ ...c, [zoneId]: selectedColor }));
  };

  const validate = () => {
    const entries = zones.map((z, index) => ({
      index,
      label: pickLang(z.label_fr, z.label_ar, langue),
      answer: colored[z.zone_id] ?? "",
      correct: colored[z.zone_id]?.toLowerCase() === z.couleur_correcte.toLowerCase(),
    }));
    onComplete(entries.length ? entries : [{ index: 0, answer: "done", correct: true }]);
  };

  return (
    <View style={styles.block}>
      <View style={styles.chips}>
        {palette.map((c) => (
          <Pressable key={c} style={[styles.colorSwatch, { backgroundColor: c }, selectedColor === c && styles.colorSelected]} onPress={() => setSelectedColor(c)} />
        ))}
      </View>
      {zones.map((z) => (
        <Pressable key={z.zone_id} style={[styles.colorZone, { backgroundColor: colored[z.zone_id] ?? "#fff" }]} onPress={() => colorZone(z.zone_id)}>
          <Text>{pickLang(z.label_fr, z.label_ar, langue)}</Text>
        </Pressable>
      ))}
      <FgButton label={langue === "ar" ? "إنهاء" : "Terminer"} onPress={validate} />
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 12 },
  meta: { ...FgType.regular, fontSize: 12, fontWeight: "800", color: "#F97316" },
  flashCard: { minHeight: 180, borderRadius: 20, backgroundColor: "#fff", borderWidth: 2, borderColor: "#E7E5E4", padding: 20, justifyContent: "center" },
  flashText: { ...FgType.regular, fontSize: 20, fontWeight: "800", textAlign: "center", color: "#0F172A" },
  tapHint: { ...FgType.regular, marginTop: 12, textAlign: "center", color: "#94A3B8", fontSize: 12 },
  question: { ...FgType.regular, fontSize: 28, fontWeight: "900", textAlign: "center", color: "#0F172A" },
  calcInput: { ...FgType.regular, height: 56, borderRadius: 14, borderWidth: 2, borderColor: "#E7E5E4", textAlign: "center", fontSize: 24, fontWeight: "800", backgroundColor: "#fff" },
  seqRow: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#fff", borderRadius: 14, padding: 12, borderWidth: 1, borderColor: "#E7E5E4" },
  seqText: { ...FgType.regular, fontSize: 15, fontWeight: "600" },
  seqBtn: { padding: 8, backgroundColor: "#F5F5F4", borderRadius: 8 },
  section: { fontWeight: "800", color: "#64748B", marginTop: 8 },
  matchCell: { padding: 14, borderRadius: 14, backgroundColor: "#fff", borderWidth: 2, borderColor: "#E7E5E4", marginBottom: 8 },
  matchSelected: { borderColor: "#F97316", backgroundColor: "#FFF7ED" },
  matchOk: { borderColor: "#10B981", backgroundColor: "#ECFDF5" },
  paragraph: { ...FgType.regular, fontSize: 16, lineHeight: 26, color: "#0F172A" },
  blankInput: { height: 44, borderRadius: 12, borderWidth: 2, borderColor: "#F97316", paddingHorizontal: 12, backgroundColor: "#FFF7ED" },
  memoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  memoryCard: { width: "30%", aspectRatio: 1, backgroundColor: "#0F172A", borderRadius: 12, alignItems: "center", justifyContent: "center" },
  memoryText: { ...FgType.regular, color: "#fff", fontWeight: "800", fontSize: 12, textAlign: "center", padding: 4 },
  wordRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 4 },
  wordLetter: { ...FgType.regular, fontSize: 28, fontWeight: "900", color: "#0F172A" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: "#fff", borderWidth: 2, borderColor: "#E7E5E4" },
  chipActive: { borderColor: "#F97316", backgroundColor: "#FFF7ED" },
  dropZone: { minHeight: 64, borderRadius: 16, borderWidth: 2, borderStyle: "dashed", borderColor: "#CBD5E1", padding: 12, marginBottom: 8, backgroundColor: "#F8FAFC" },
  zoneLabel: { ...FgType.regular, fontWeight: "800", marginBottom: 4, color: "#64748B", fontSize: 12 },
  hotspotImageWrap: { width: "100%", aspectRatio: 1.2, backgroundColor: "#F5F5F4", borderRadius: 16, overflow: "hidden", position: "relative" },
  hotspotImage: { width: "100%", height: "100%" },
  hotspot: { position: "absolute", borderRadius: 999, borderWidth: 2, borderColor: "rgba(249,115,22,0.6)", backgroundColor: "rgba(249,115,22,0.15)" },
  hotspotTapped: { backgroundColor: "rgba(16,185,129,0.35)", borderColor: "#10B981" },
  hint: { ...FgType.regular, textAlign: "center", color: "#64748B", fontSize: 13 },
  colorSwatch: { width: 36, height: 36, borderRadius: 999, borderWidth: 2, borderColor: "#E7E5E4" },
  colorSelected: { borderColor: "#0F172A", borderWidth: 3 },
  colorZone: { padding: 16, borderRadius: 14, borderWidth: 1, borderColor: "#E7E5E4", marginBottom: 8 },
});
