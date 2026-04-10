// ============================================================
// FreeGeny — Moteur d'Exercices Universel (exercise-player.js)
// 5 types Phase 1 : qcm, vrai_faux, association, completude, audio
// ============================================================

function exercisePlayer(config) {
  return {
    // Config injectée depuis PHP
    exercises: config.exercises || [],
    childId:   config.childId   || null,
    lessonId:  config.lessonId  || '',
    subject:   config.subject   || 'arabe',
    baseUrl:   config.baseUrl   || '',

    // État courant
    current:   0,
    selected:  null,     // réponse choisie
    feedback:  null,     // 'correct' | 'wrong' | null
    answered:  false,
    score:     0,
    finished:  false,
    startTime: Date.now(),
    xpEarned:  0,

    // Association (drag & drop)
    dragSrc:   null,
    pairs:     [],
    matched:   [],

    // Audio
    audioPlaying: false,
    audioEl:      null,

    get exercise() {
      return this.exercises[this.current] || null;
    },

    get progress() {
      return Math.round((this.current / this.exercises.length) * 100);
    },

    get finalScore() {
      return Math.round((this.score / this.exercises.length) * 10);
    },

    init() {
      this.initCurrentExercise();
    },

    initCurrentExercise() {
      this.selected  = null;
      this.feedback  = null;
      this.answered  = false;
      this.dragSrc   = null;
      this.matched   = [];

      const ex = this.exercise;
      if (!ex) return;

      if (ex.type === 'association') {
        // Mélanger les paires
        this.pairs = this.shuffle([...(ex.options || [])]);
      }

      if (ex.type === 'audio' && ex.audio_url) {
        this.audioEl = new Audio(ex.audio_url);
      }
    },

    // ---- Sélection réponse (QCM / vrai_faux) ----
    selectOption(option) {
      if (this.answered) return;
      this.selected = option;
    },

    // ---- Validation ----
    validate() {
      if (!this.exercise || this.answered) return;

      const ex = this.exercise;
      let isCorrect = false;

      switch (ex.type) {
        case 'qcm':
        case 'vrai_faux':
          isCorrect = this.selected === ex.answer ||
                      String(this.selected).toLowerCase() === String(ex.answer).toLowerCase();
          break;

        case 'completude':
          isCorrect = String(this.selected || '').trim().toLowerCase() ===
                      String(ex.answer).trim().toLowerCase();
          break;

        case 'association':
          // Vérifier que toutes les associations sont correctes
          isCorrect = this.matched.length === (ex.pairs?.length || 0) &&
                      this.matched.every(m => m.correct);
          break;

        case 'audio':
          isCorrect = String(this.selected || '').trim().toLowerCase() ===
                      String(ex.answer).trim().toLowerCase();
          break;
      }

      this.feedback = isCorrect ? 'correct' : 'wrong';
      this.answered = true;
      if (isCorrect) this.score++;

      // Feedback visuel
      if (isCorrect) {
        this.xpEarned += 10;
        triggerConfetti();
        this.playSound('correct');
      } else {
        this.playSound('wrong');
      }

      // Sauvegarder en BDD
      this.saveAttempt(ex.id, isCorrect);
    },

    // ---- Exercice suivant ----
    next() {
      if (this.current < this.exercises.length - 1) {
        this.current++;
        this.initCurrentExercise();
      } else {
        this.finish();
      }
    },

    // ---- Fin de session ----
    async finish() {
      this.finished = true;
      const timeSec = Math.round((Date.now() - this.startTime) / 1000);
      const score   = this.finalScore;

      // Sauvegarder progression de la leçon
      if (this.childId && this.lessonId) {
        await apiFetch(this.baseUrl + '/api/progress/save', {
          method: 'POST',
          body: JSON.stringify({
            child_id:  this.childId,
            lesson_id: this.lessonId,
            subject:   this.subject,
            status:    'completed',
            score:     score,
            time_sec:  timeSec,
          }),
        });
      }

      // Confetti de fin
      setTimeout(() => triggerConfetti(), 300);
    },

    // ---- Recommencer ----
    restart() {
      this.current   = 0;
      this.score     = 0;
      this.finished  = false;
      this.xpEarned  = 0;
      this.startTime = Date.now();
      this.exercises = this.shuffle([...this.exercises]);
      this.initCurrentExercise();
    },

    // ---- Sauvegarde tentative ----
    async saveAttempt(exerciseId, isCorrect) {
      if (!this.childId) return;
      await apiFetch(this.baseUrl + '/api/progress/save', {
        method: 'POST',
        body: JSON.stringify({
          child_id:     this.childId,
          exercise_id:  exerciseId,
          lesson_id:    this.lessonId,
          subject:      this.subject,
          status:       'in_progress',
          is_correct:   isCorrect,
        }),
      });
    },

    // ---- Drag & Drop (association) ----
    onDragStart(item) {
      this.dragSrc = item;
    },
    onDrop(target) {
      if (!this.dragSrc || this.answered) return;
      const correct = this.dragSrc.pair === target.id;
      if (!this.matched.find(m => m.left === this.dragSrc.id)) {
        this.matched.push({ left: this.dragSrc.id, right: target.id, correct });
      }
      this.dragSrc = null;
      // Vérifier si toutes paires complètes
      const ex = this.exercise;
      if (this.matched.length === (ex?.pairs?.length || 0)) {
        setTimeout(() => this.validate(), 400);
      }
    },

    // ---- Audio player ----
    playAudio() {
      if (!this.audioEl) return;
      if (this.audioPlaying) {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
        this.audioPlaying = false;
      } else {
        this.audioEl.play();
        this.audioPlaying = true;
        this.audioEl.onended = () => { this.audioPlaying = false; };
      }
    },

    // ---- Sons de feedback ----
    playSound(type) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === 'correct') {
        osc.frequency.setValueAtTime(523, ctx.currentTime);      // Do
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1); // Mi
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2); // Sol
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      } else {
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      }
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    },

    // ---- Utilitaires ----
    shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },

    isOptionCorrect(option) {
      return this.answered && option === this.exercise?.answer;
    },
    isOptionWrong(option) {
      return this.answered && option === this.selected && option !== this.exercise?.answer;
    },
  };
}
