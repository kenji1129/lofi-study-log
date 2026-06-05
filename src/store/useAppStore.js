import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { uid } from '../lib/id'
import { dayKey } from '../lib/date'
import { getLevelInfo, XP } from '../lib/level'
import { TRACKS } from '../data/tracks'

// All lines Kikyou can say. Split by context for weighted auto-pick.
export const LINES = {
  // triggered on specific actions — NOT used for random auto-speak
  start:    ['せーのっ スタート！', 'よし、はじめよっ！', 'いっしょにやろ！'],
  break:    ['ひと休みしよ？', 'おつかれ、少し伸びしようか', 'うん、えらい。休憩しよっ'],
  done:     ['全部終わった！すごいじゃん', 'おつかれさまっ！', 'よくがんばったね'],
  // greetings on entering the home screen (by time of day)
  greetMorning: [
    'おはよ！来てくれてうれしい',
    'おはよう。いっしょにいい一日にしよ？',
    'ふぁ……おはよ。よし、やろっか',
  ],
  greetDay: [
    'やっほ、来たね。いっしょにやろ！',
    'おかえり！待ってたよ',
    'よし、つながった。今日もがんばろっ',
  ],
  greetEvening: [
    'おつかれさま。夜もいっしょにがんばろ',
    'こんばんは。ちょっとだけ、やろっか',
    '来てくれたんだ。うれしいな',
  ],
  greetNight: [
    'こんな時間まで…無理しないでね。でも来てくれて嬉しい',
    '夜ふかしさん、いらっしゃい。ほどほどにね',
    'しずかな夜だね。いっしょにいよ',
  ],
  // general auto-speak pool
  auto: [
    // 励まし
    'いっしょにがんばろっ',
    'えらいえらい、その調子！',
    'もうちょっとだけ、やってみよ',
    'ちゃんと進んでるよ、大丈夫',
    'わたしも書いてるから、ね',
    '焦らなくていいよ。じっくりで大丈夫',
    '今日もいい感じじゃん',
    '…うん、いい集中力してる',
    'きっとうまくいくよ',
    '一歩ずつでいいんだよ',
    'ねえ、ちょっと褒めさせて。えらいよ',
    'そのペース、好きだよ',
    // 気づかい
    'ちょっと水分とろ？',
    '肩、凝ってない？',
    '背筋、伸ばしてみて？',
    '目、休ませてる？ たまには遠くを見てね',
    '深呼吸、してみよ',
    'ご飯、ちゃんと食べた？',
    'ちょっと伸びしよ？わたしもする',
    // 状況コメント
    'いい音だね、これ',
    'この曲、好きだな',
    '外、どんな天気かな',
    'なんか書きたくなってきた……',
    '静かだね。いい夜だ',
    'コーヒーの匂いが恋しくなる曲だ',
    '……ふふ、なんでもない',
    'ここ好きなんだよね、この時間',
    '一緒に作業するの、楽しいな',
    '窓の外、星出てるかな',
    '今日の空ってどんな色だろ',
    'なんか、いい感じの夜だ',
    // キャラらしさ（小説家志望）
    'さっきいいセリフ思いついちゃった',
    'わたしもちょっと詰まってるんだよね……',
    'この章、なかなか終わらないんだよなあ',
    '締め切り……あ、なんでもない',
    '小説って、書いてみる？',
    '登場人物に話しかけてみるといいよ、なんか教えてくれるから',
    'プロットって難しいよね',
    '好きなことに没頭できる時間って、宝だよね',
    // 時間・夜更かし
    '夜遅い？ あまり無理しないでね',
    'もう少ししたら休もうか',
    '今何時？ …ちゃんと寝てね',
    '朝まで一緒にいるよ、でも眠くなったら寝てね',
    '夜が一番集中できるよね、わかる',
    '朝型になりたいけど、無理なんだよね……わたしも',
    // ユーモア
    'お互い、頑張りましょう……！',
    '…ちょっとだけ、漫画読んでいい？ ダメ？ だよね',
    'おやつ食べたい……がまん',
    'ちょっと眠い……でも頑張る',
    '集中してるとき、顔こわくなってるよ（かわいいけど）',
    'ねえ、天才かもしれないよ、あなた',
    'わたし今日3回同じとこ読んだ……',
    '…ぼーっとしてた。ごめん',
    // 完了・節目
    'ひとつ終わった！えらい！',
    '積み重ねってすごいよね',
    '今日やったこと、ちゃんと記録しておこうね',
    'また明日も一緒にやろうね',
    '今日の自分、ちゃんと褒めて',
  ],
}

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

const LEVELUP_LINES = [
  'レベルアップ！Lv.%d だよ✨',
  'やったね、Lv.%d に上がった！',
  'すごい、もう Lv.%d だ！',
  'Lv.%d おめでとう🎉 いっしょに成長してるね',
]
function levelUpLine(level) {
  return pickRandom(LEVELUP_LINES).replace('%d', level)
}

// Returns the state patch for awarding XP, including a level-up subtitle override.
function withXp(prevXp, gain, basePatch = {}) {
  const xp = prevXp + gain
  const before = getLevelInfo(prevXp).level
  const after = getLevelInfo(xp).level
  const patch = { ...basePatch, xp }
  if (after > before) {
    patch.subtitle = levelUpLine(after)
    patch.subtitleTs = Date.now()
  }
  return patch
}

function defaultState() {
  const today = dayKey()
  return {
    /* ---- UI ---- */
    activePanel: null, // 'notes' | 'todo' | 'habits' | 'calendar' | 'settings'
    uiHidden: false,
    ending: false,       // true while the shutdown animation plays
    subtitle: null,      // null = hidden; string = visible
    subtitleTs: 0,       // timestamp for key-based animation reset

    /* ---- Level / XP ---- */
    xp: 0,               // cumulative experience points

    /* ---- Pomodoro ---- */
    pomodoro: {
      workMin: 25,
      breakMin: 5,
      rounds: 4,
      // runtime (reset on load)
      phase: 'idle', // 'idle' | 'work' | 'break'
      round: 1,
      remaining: 25 * 60,
      running: false,
    },

    /* ---- Notes ---- */
    notes: [{ id: uid('note'), title: '新しいページ', body: '', updatedAt: Date.now() }],

    /* ---- Todo ---- */
    todoLists: [{ id: uid('list'), name: 'ToDoリスト', tasks: [] }],
    activeListId: null, // resolved at runtime

    /* ---- Habits ---- */
    habits: [
      { id: uid('habit'), name: '新しい習慣', color: '#46e6ff', records: {} },
    ],

    /* ---- Calendar / per-day log ---- */
    days: {
      // key -> { workSeconds, diary }
      [today]: { workSeconds: 0, diary: '' },
    },

    /* ---- Player ---- */
    player: {
      trackIndex: 0,
      playing: false,
      shuffle: false,
      repeat: false,
    },

    /* ---- Settings ---- */
    settings: {
      volume: 0.7,
      bgmEnabled: true,
      ambient: false, // built-in synth ambience
      ambientType: 'rain',
      subtitlesOn: true,
      backgroundId: 'bg-00',   // selected preset id
      backgroundUrl: '',        // user-uploaded data URL (overrides preset)
      crt: true,
      showCharacter: true,
    },
  }
}

export const useAppStore = create(
  persist(
    (set, get) => ({
      ...defaultState(),

      /* =================== UI =================== */
      openPanel: (panel) =>
        set((s) => ({ activePanel: s.activePanel === panel ? null : panel })),
      closePanel: () => set({ activePanel: null }),
      toggleUI: () => set((s) => ({ uiHidden: !s.uiHidden })),
      endCall: () => set({ ending: true, activePanel: null }),
      sayRandom: () =>
        set({ subtitle: pickRandom(LINES.auto), subtitleTs: Date.now() }),
      say: (line) => set({ subtitle: line, subtitleTs: Date.now() }),
      clearSubtitle: () => set({ subtitle: null }),
      // greeting shown when the home screen first appears (time-of-day aware)
      sayGreeting: () => {
        const h = new Date().getHours()
        let pool
        if (h < 5) pool = LINES.greetNight
        else if (h < 11) pool = LINES.greetMorning
        else if (h < 17) pool = LINES.greetDay
        else if (h < 22) pool = LINES.greetEvening
        else pool = LINES.greetNight
        set({ subtitle: pickRandom(pool), subtitleTs: Date.now() })
      },

      /* =================== Pomodoro =================== */
      setPomodoroConfig: (patch) =>
        set((s) => {
          const p = { ...s.pomodoro, ...patch }
          if (p.phase === 'idle') p.remaining = p.workMin * 60
          return { pomodoro: p }
        }),
      startPomodoro: () =>
        set((s) => {
          const p = { ...s.pomodoro }
          if (p.phase === 'idle') {
            p.phase = 'work'
            p.round = 1
            p.remaining = p.workMin * 60
          }
          p.running = true
          return { pomodoro: p, subtitle: pickRandom(LINES.start), subtitleTs: Date.now() }
        }),
      pausePomodoro: () =>
        set((s) => ({ pomodoro: { ...s.pomodoro, running: false } })),
      stopPomodoro: () =>
        set((s) => ({
          pomodoro: {
            ...s.pomodoro,
            phase: 'idle',
            running: false,
            round: 1,
            remaining: s.pomodoro.workMin * 60,
          },
        })),
      tickPomodoro: () =>
        set((s) => {
          const p = { ...s.pomodoro }
          if (!p.running) return {}
          // accumulate work time on the calendar for work phase
          let days = s.days
          if (p.phase === 'work') {
            const k = dayKey()
            const cur = days[k] || { workSeconds: 0, diary: '' }
            days = { ...days, [k]: { ...cur, workSeconds: cur.workSeconds + 1 } }
          }
          if (p.remaining > 1) {
            p.remaining -= 1
            return { pomodoro: p, days }
          }
          // phase transition (+ XP / possible level-up)
          const res = advancePhase(p)
          const { xpGain = 0, ...rest } = res
          return withXp(s.xp, xpGain, { ...rest, days })
        }),
      skipPhase: () =>
        set((s) => {
          // manual skip advances the phase but grants NO xp
          const { xpGain, ...rest } = advancePhase({ ...s.pomodoro })
          return rest
        }),
      addXp: (amount) => set((s) => withXp(s.xp, amount)),

      /* =================== Notes =================== */
      addNote: () =>
        set((s) => ({
          notes: [
            { id: uid('note'), title: '新しいページ', body: '', updatedAt: Date.now() },
            ...s.notes,
          ],
        })),
      updateNote: (id, patch) =>
        set((s) => ({
          notes: s.notes.map((n) =>
            n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n,
          ),
        })),
      removeNote: (id) =>
        set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
      reorderNotes: (activeId, overId) =>
        set((s) => ({ notes: moveById(s.notes, activeId, overId) })),

      /* =================== Todo =================== */
      addList: () =>
        set((s) => {
          const list = { id: uid('list'), name: '新しいリスト', tasks: [] }
          return { todoLists: [...s.todoLists, list], activeListId: list.id }
        }),
      renameList: (id, name) =>
        set((s) => ({
          todoLists: s.todoLists.map((l) => (l.id === id ? { ...l, name } : l)),
        })),
      removeList: (id) =>
        set((s) => {
          const todoLists = s.todoLists.filter((l) => l.id !== id)
          return {
            todoLists,
            activeListId: todoLists[0]?.id ?? null,
          }
        }),
      setActiveList: (id) => set({ activeListId: id }),
      addTask: (listId, text) =>
        set((s) => ({
          todoLists: s.todoLists.map((l) =>
            l.id === listId
              ? { ...l, tasks: [...l.tasks, { id: uid('task'), text, done: false }] }
              : l,
          ),
        })),
      toggleTask: (listId, taskId) =>
        set((s) => {
          const list = s.todoLists.find((l) => l.id === listId)
          const task = list?.tasks.find((t) => t.id === taskId)
          const becameDone = task && !task.done
          const todoLists = s.todoLists.map((l) =>
            l.id === listId
              ? {
                  ...l,
                  tasks: l.tasks.map((t) =>
                    t.id === taskId ? { ...t, done: !t.done } : t,
                  ),
                }
              : l,
          )
          // award XP only when checking a task ON (not when unchecking)
          if (becameDone) return withXp(s.xp, XP.taskDone, { todoLists })
          return { todoLists }
        }),
      editTask: (listId, taskId, text) =>
        set((s) => ({
          todoLists: s.todoLists.map((l) =>
            l.id === listId
              ? {
                  ...l,
                  tasks: l.tasks.map((t) =>
                    t.id === taskId ? { ...t, text } : t,
                  ),
                }
              : l,
          ),
        })),
      removeTask: (listId, taskId) =>
        set((s) => ({
          todoLists: s.todoLists.map((l) =>
            l.id === listId
              ? { ...l, tasks: l.tasks.filter((t) => t.id !== taskId) }
              : l,
          ),
        })),
      reorderTasks: (listId, activeId, overId) =>
        set((s) => ({
          todoLists: s.todoLists.map((l) =>
            l.id === listId ? { ...l, tasks: moveById(l.tasks, activeId, overId) } : l,
          ),
        })),

      /* =================== Habits =================== */
      addHabit: () =>
        set((s) => ({
          habits: [
            ...s.habits,
            {
              id: uid('habit'),
              name: '新しい習慣',
              color: HABIT_COLORS[s.habits.length % HABIT_COLORS.length],
              records: {},
            },
          ],
        })),
      renameHabit: (id, name) =>
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, name } : h)),
        })),
      setHabitColor: (id, color) =>
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, color } : h)),
        })),
      toggleHabit: (id, key) =>
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== id) return h
            const records = { ...h.records }
            if (records[key]) delete records[key]
            else records[key] = true
            return { ...h, records }
          }),
        })),
      removeHabit: (id) =>
        set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),
      reorderHabits: (activeId, overId) =>
        set((s) => ({ habits: moveById(s.habits, activeId, overId) })),

      /* =================== Calendar / day log =================== */
      setDiary: (key, diary) =>
        set((s) => ({
          days: { ...s.days, [key]: { ...(s.days[key] || { workSeconds: 0 }), diary } },
        })),
      setWorkSeconds: (key, workSeconds) =>
        set((s) => ({
          days: { ...s.days, [key]: { ...(s.days[key] || { diary: '' }), workSeconds } },
        })),

      /* =================== Player =================== */
      setPlayer: (patch) => set((s) => ({ player: { ...s.player, ...patch } })),
      togglePlay: () =>
        set((s) => ({ player: { ...s.player, playing: !s.player.playing } })),
      nextTrack: () =>
        set((s) => {
          const { shuffle, trackIndex } = s.player
          let i = shuffle
            ? Math.floor(Math.random() * TRACKS.length)
            : (trackIndex + 1) % TRACKS.length
          return { player: { ...s.player, trackIndex: i, playing: true } }
        }),
      prevTrack: () =>
        set((s) => ({
          player: {
            ...s.player,
            trackIndex: (s.player.trackIndex - 1 + TRACKS.length) % TRACKS.length,
            playing: true,
          },
        })),
      selectTrack: (i) =>
        set((s) => ({ player: { ...s.player, trackIndex: i, playing: true } })),

      /* =================== Settings =================== */
      setSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),
    }),
    {
      name: 'lofi-study-log',
      version: 1,
      partialize: (s) => ({
        notes: s.notes,
        todoLists: s.todoLists,
        activeListId: s.activeListId,
        habits: s.habits,
        days: s.days,
        xp: s.xp,
        settings: s.settings,
        player: { ...s.player, playing: false },
        pomodoro: {
          workMin: s.pomodoro.workMin,
          breakMin: s.pomodoro.breakMin,
          rounds: s.pomodoro.rounds,
        },
      }),
      merge: (persisted, current) => {
        const p = persisted || {}
        const merged = { ...current, ...p }
        // rebuild transient pomodoro runtime
        merged.pomodoro = {
          ...current.pomodoro,
          ...(p.pomodoro || {}),
          phase: 'idle',
          running: false,
          round: 1,
          remaining: (p.pomodoro?.workMin ?? current.pomodoro.workMin) * 60,
        }
        merged.player = { ...current.player, ...(p.player || {}), playing: false }
        merged.settings = { ...current.settings, ...(p.settings || {}) }
        merged.activePanel = null
        merged.uiHidden = false
        if (!merged.activeListId && merged.todoLists?.length)
          merged.activeListId = merged.todoLists[0].id
        return merged
      },
    },
  ),
)

// dev-only: expose the store for debugging in the browser console
if (import.meta.env?.DEV && typeof window !== 'undefined') {
  window.__store = useAppStore
}

/* ---------- helpers ---------- */
const HABIT_COLORS = ['#46e6ff', '#ff63d6', '#ffd479', '#2ed07d', '#a78bff', '#ff8a3d']

function advancePhase(p) {
  const ts = Date.now()
  if (p.phase === 'work') {
    if (p.round >= p.rounds) {
      return {
        pomodoro: { ...p, phase: 'idle', running: false, round: 1, remaining: p.workMin * 60 },
        subtitle: pickRandom(LINES.done), subtitleTs: ts,
        xpGain: XP.focusBlock + XP.allRoundsBonus,
      }
    }
    return {
      pomodoro: { ...p, phase: 'break', remaining: p.breakMin * 60 },
      subtitle: pickRandom(LINES.break), subtitleTs: ts,
      xpGain: XP.focusBlock,
    }
  }
  if (p.phase === 'break') {
    return {
      pomodoro: { ...p, phase: 'work', round: p.round + 1, remaining: p.workMin * 60 },
      subtitle: pickRandom(LINES.start), subtitleTs: ts,
      xpGain: XP.restBlock,
    }
  }
  return { pomodoro: p, xpGain: 0 }
}

function move(arr, from, to) {
  const copy = arr.slice()
  const [item] = copy.splice(from, 1)
  copy.splice(to, 0, item)
  return copy
}

// reorder by item id (works even when items are shown in filtered groups)
function moveById(arr, activeId, overId) {
  const from = arr.findIndex((x) => x.id === activeId)
  const to = arr.findIndex((x) => x.id === overId)
  if (from === -1 || to === -1) return arr
  return move(arr, from, to)
}

/* convenience selector hook for the active todo list */
export function useActiveList() {
  return useAppStore((s) => {
    const id = s.activeListId ?? s.todoLists[0]?.id
    return s.todoLists.find((l) => l.id === id) ?? s.todoLists[0] ?? null
  })
}
