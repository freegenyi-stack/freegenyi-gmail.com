import { QCMBuilder } from "./components/QCMBuilder"
import { TextGapBuilder } from "./components/TextGapBuilder"
import { DragDropBuilder } from "./components/DragDropBuilder"
import { DrawingBuilder } from "./components/DrawingBuilder"

export interface ExerciseTypeInfo {
    id: string
    label: string
    description: string
    icon: string
    component: React.ComponentType<any>
    defaultData: any
}

export const exerciseTypes: ExerciseTypeInfo[] = [
    {
        id: "qcm",
        label: "QCM",
        description: "Question  choix multiples, une ou plusieurs bonnes rponses.",
        icon: "🔘",
        component: QCMBuilder,
        defaultData: {
            question: "",
            options: ["", "", "", ""],
            correctAnswers: [],
            multipleCorrect: false
        }
    },
    {
        id: "text",
        label: "Texte  trous",
        description: "Phrase avec des mots manquants  complter.",
        icon: "📝",
        component: TextGapBuilder,
        defaultData: {
            text: "",
            gaps: []
        }
    },
    {
        id: "dragdrop",
        label: "Glisser-dposer",
        description: "Associer des lments entre deux colonnes.",
        icon: "🔄",
        component: DragDropBuilder,
        defaultData: {
            leftItems: [],
            rightItems: [],
            pairs: []
        }
    },
    {
        id: "drawing",
        label: "Dessin",
        description: "Espace de dessin libre ou guid.",
        icon: "🎨",
        component: DrawingBuilder,
        defaultData: {
            background: null,
            tools: ["pen", "eraser"],
            colors: ["#000000", "#FF0000", "#00FF00", "#0000FF"]
        }
    }
]
