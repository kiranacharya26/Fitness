import { useEffect, useState } from 'react'
import { todayKey, workouts } from './workouts'

const read = (key, fallback) => JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback))
const dateKey = (date = new Date()) => date.toISOString().slice(0, 10)
const dayForDate = (date) => ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()]
const optimizedImage = (src) => src.replace(/\.png$/, '.jpg')

const exerciseReferences = {
  'MON-0': {
    images: ['/exercises/push-up-reference.png', '/exercises/push-up-top.png'],
    cue: 'Keep your body in one straight line. Lower with control, then press back up without letting your hips drop.',
  },
  'MON-1': {
    images: ['/exercises/pull-up-top.png', '/exercises/pull-up-high.png'],
    cue: 'Start from a controlled hang. Keep your body still and pull your elbows down toward your ribs.',
  },
  'MON-2': {
    images: ['/exercises/shoulder-press-top.png', '/exercises/shoulder-press-bottom.png'],
    cue: 'Brace your core and keep your ribs down as you press. Lower the weights slowly to shoulder height.',
  },
  'MON-3': {
    images: ['/exercises/one-arm-row-pull.png', '/exercises/one-arm-row-start.png'],
    cue: 'Support yourself on the bench. Keep a flat back and pull the dumbbell toward your hip without twisting.',
  },
  'MON-4': {
    images: ['/exercises/biceps-curl-up.png', '/exercises/biceps-curl-start.png'],
    cue: 'Stand tall with elbows close to your sides. Curl smoothly and control the full lowering phase.',
  },
  'MON-5': {
    images: ['/exercises/triceps-extension-lower.png', '/exercises/triceps-extension-top.png'],
    cue: 'Keep your upper arms steady and your core braced. Move only at the elbows as you lower and extend.',
  },
  'TUE-0': {
    images: ['/exercises/tuesday-master-goblet-squat.png', '/exercises/tue-goblet-squat-top.png'],
    cue: 'Keep the dumbbell close to your chest. Sit down between your hips with heels grounded and knees tracking naturally.',
  },
  'TUE-1': {
    images: ['/exercises/tue-bulgarian-squat-low.png', '/exercises/tue-bulgarian-squat-top.png'],
    cue: 'Use a stable stance and keep most of your weight in the front foot. Lower under control, then drive up.',
  },
  'TUE-2': {
    images: ['/exercises/tue-rdl-low.png', '/exercises/tue-rdl-top.png'],
    cue: 'Push your hips back while keeping the dumbbells close. Feel the hamstrings and return by squeezing your glutes.',
  },
  'TUE-3': {
    images: ['/exercises/tue-calf-raise-top.png', '/exercises/tue-calf-raise-bottom.png'],
    cue: 'Rise smoothly onto the balls of your feet, pause at the top, then lower your heels through the full range.',
  },
  'TUE-4': {
    images: ['/exercises/tue-leg-raise-top.png', '/exercises/tue-leg-raise-low.png'],
    cue: 'Keep your lower back controlled against the mat. Lower your legs only as far as you can without arching.',
  },
  'TUE-5': {
    images: ['/exercises/tue-plank-forearm.png', '/exercises/tue-plank-high.png'],
    cue: 'Keep a straight line from shoulders to heels. Brace your abs and glutes while breathing steadily.',
  },
  'WED-0': {
    images: ['/exercises/wed-walk-promenade.png', '/exercises/wed-walk-promenade-stride.png'],
    cue: 'Walk at a comfortable, steady pace. Stand tall, relax your shoulders, and let your arms swing naturally.',
  },
  'WED-1': {
    images: ['/exercises/wed-skipping-jump.png', '/exercises/wed-skipping-ready.png'],
    cue: 'Stay light on your feet with soft knees. Turn the rope from your wrists and keep the pace controlled.',
  },
  'THU-0': {
    images: ['/exercises/thu-master-pullup.png', '/exercises/thu-pullup-bottom.png'],
    cue: 'Begin from a controlled hang with your shoulders engaged. Pull smoothly without swinging your legs.',
  },
  'THU-1': {
    images: ['/exercises/thu-elevated-pushup-low.png', '/exercises/thu-elevated-pushup-top.png'],
    cue: 'Keep your body rigid as you lower toward the floor. Press up without letting the hips sag.',
  },
  'THU-2': {
    images: ['/exercises/thu-row-pull.png', '/exercises/thu-row-start.png'],
    cue: 'Brace yourself on the bench, keep a neutral back, and pull the dumbbell toward your hip without twisting.',
  },
  'THU-3': {
    images: ['/exercises/thu-lateral-raise-top.png', '/exercises/thu-lateral-raise-start.png'],
    cue: 'Raise the weights with control to shoulder height. Keep your shoulders down and avoid shrugging.',
  },
  'THU-4': {
    images: ['/exercises/thu-bench-press-top.png', '/exercises/thu-bench-press-low.png'],
    cue: 'Keep your feet planted and shoulders stable. Lower the dumbbells with control, then press smoothly.',
  },
  'THU-5': {
    images: ['/exercises/thu-hammer-curl-mid.png', '/exercises/thu-hammer-curl-start.png'],
    cue: 'Keep your palms facing inward and elbows near your ribs. Avoid swinging as you curl and lower.',
  },
  'FRI-0': {
    images: ['/exercises/fri-master-bulgarian.png', '/exercises/fri-bulgarian-top.png'],
    cue: 'Use a stable stance with most of your weight through the front foot. Lower smoothly, then drive back up.',
  },
  'FRI-1': {
    images: ['/exercises/fri-goblet-low.png', '/exercises/fri-goblet-top.png'],
    cue: 'Hold the dumbbell close to your chest, keep heels down, and let your knees track naturally as you squat.',
  },
  'FRI-2': {
    images: ['/exercises/fri-rdl-low.png', '/exercises/fri-rdl-top.png'],
    cue: 'Hinge from the hips and keep the dumbbells close. Return to standing by squeezing your glutes.',
  },
  'FRI-3': {
    images: ['/exercises/fri-reverse-lunge-low.png', '/exercises/fri-reverse-lunge-top.png'],
    cue: 'Step back softly and keep the front foot planted. Keep your torso tall as you lower and rise.',
  },
  'FRI-4': {
    images: ['/exercises/fri-bicycle-crunch-left.png', '/exercises/fri-bicycle-crunch-right.png'],
    cue: 'Rotate through your torso while keeping the neck relaxed. Move slowly and alternate sides with control.',
  },
  'FRI-5': {
    images: ['/exercises/fri-plank-forearm.png', '/exercises/fri-plank-high.png'],
    cue: 'Brace your abs and glutes to maintain one straight line from shoulders through heels.',
  },
  'SAT-0': {
    images: ['/exercises/sat-master-pushup-pink.png', '/exercises/sat-pushup-top.png'],
    cue: 'Keep your body in one straight line. Lower under control and press back up without dropping your hips.',
  },
  'SAT-1': {
    images: ['/exercises/sat-goblet-low.png', '/exercises/sat-goblet-top.png'],
    cue: 'Keep the dumbbell close to your chest, heels grounded, and knees tracking naturally through the squat.',
  },
  'SAT-2': {
    images: ['/exercises/sat-pullup-top.png', '/exercises/sat-pullup-bottom.png'],
    cue: 'Use a controlled hang and pull without swinging. Keep your shoulders engaged at the bottom.',
  },
  'SAT-3': {
    images: ['/exercises/sat-rdl-low.png', '/exercises/sat-rdl-top.png'],
    cue: 'Hinge at the hips with dumbbells close to your legs. Stand up by squeezing your glutes.',
  },
  'SAT-4': {
    images: ['/exercises/sat-shoulder-press-top.png', '/exercises/sat-shoulder-press-low.png'],
    cue: 'Brace your core and keep ribs controlled. Press overhead smoothly and lower to shoulder height.',
  },
  'SAT-5': {
    images: ['/exercises/sat-plank-forearm.png', '/exercises/sat-plank-high.png'],
    cue: 'Squeeze your abs and glutes to hold a straight body line while breathing steadily.',
  },
  'SAT-6': {
    images: ['/exercises/sat-skipping-jump.png', '/exercises/sat-skipping-ready.png'],
    cue: 'Keep the jumps light and low. Turn the rope from your wrists with relaxed shoulders.',
  },
  'SUN-0': {
    images: ['/exercises/sun-master-walk.png', '/exercises/sun-walk-stride.png'],
    cue: 'Keep the walk relaxed and comfortable. Stand tall, soften your shoulders, and let your arms swing naturally.',
  },
  'SUN-1': {
    images: ['/exercises/sun-mobility-hip-flexor.png', '/exercises/sun-mobility-shoulder.png'],
    cue: 'Move gently through the range that feels good. This is recovery work—keep it calm and never force a stretch.',
  },
}

export default function App() {
  const today = todayKey()
  const [selected, setSelected] = useState(today)
  const [complete, setComplete] = useState(() => read('fitness-complete', {}))
  const [history, setHistory] = useState(() => read('fitness-history-v1', {}))
  const [logs, setLogs] = useState(() => read('fitness-logs', []))
  const [openReference, setOpenReference] = useState(null)
  const workout = workouts.find(({ key }) => key === selected)

  useEffect(() => localStorage.setItem('fitness-complete', JSON.stringify(complete)), [complete])
  useEffect(() => localStorage.setItem('fitness-history-v1', JSON.stringify(history)), [history])
  useEffect(() => localStorage.setItem('fitness-logs', JSON.stringify(logs)), [logs])
  useEffect(() => {
    // Fetch only the selected day's lightweight photos after the interface is ready.
    // They will already be in the browser cache when a form panel is opened.
    const prefetch = () => workout.items.flatMap((_, index) =>
      exerciseReferences[`${selected}-${index}`]?.images || [],
    ).forEach(src => {
      const image = new Image()
      image.src = optimizedImage(src)
    })
    const idleId = window.requestIdleCallback?.(prefetch, { timeout: 1200 })
    const timerId = idleId === undefined ? window.setTimeout(prefetch, 250) : undefined
    return () => {
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId)
      if (timerId !== undefined) window.clearTimeout(timerId)
    }
  }, [selected, workout])

  const average = (index) => {
    const values = logs.slice(0, index + 1).reverse().map(x => Number(x.weight)).filter(Boolean).slice(0, 7)
    return values.length === 7 ? `${(values.reduce((sum, n) => sum + n, 0) / 7).toFixed(1)} kg` : '—'
  }
  const toggle = (id) => {
    const checked = !complete[id]
    const todayDate = dateKey()

    setComplete(current => ({ ...current, [id]: checked }))
    setHistory(current => {
      const entry = current[todayDate] || { day: selected, completed: [] }
      const completed = checked
        ? [...new Set([...entry.completed, id])]
        : entry.completed.filter(item => item !== id)

      return { ...current, [todayDate]: { day: selected, completed } }
    })
  }
  const updateLog = (index, field, value) => setLogs(current => current.map((row, i) => i === index ? { ...row, [field]: value } : row))
  const addLog = () => setLogs(current => [...current, { date: new Date().toISOString().slice(0, 10), weight: '', waist: '' }])
  const recentHistory = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setHours(12, 0, 0, 0)
    date.setDate(date.getDate() - index)
    const key = dateKey(date)
    const plannedDay = dayForDate(date)
    const planned = workouts.find(workoutItem => workoutItem.key === plannedDay)
    const entry = history[key]
    const completed = entry?.completed.length || 0
    const total = planned.items.length
    const isToday = index === 0
    const status = completed === total ? 'Complete' : completed > 0 ? 'Partial' : isToday ? 'Not started' : 'Missed'

    return { key, date, planned, completed, total, status, isToday }
  })

  return <main className="app">
    <header>
      <div><p className="eyebrow">YOUR PLAN</p><h1>Fitness dashboard</h1></div>
      <time>{new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date())}</time>
    </header>

    <section className="hero"><span>Today · {today}</span><h2>{workouts.find(x => x.key === today).title}</h2><p>Small, consistent sessions. Aim for 10,000+ steps.</p></section>

    <nav aria-label="Workout days">{workouts.map(({ key }) => <button key={key} className={selected === key ? 'active' : ''} onClick={() => { setSelected(key); setOpenReference(null) }}>{key}</button>)}</nav>

    <section className="card">
      <div className="card-title"><div><p className="eyebrow">WORKOUT</p><h2>{workout.title}</h2></div><span>{workout.items.length} exercises</span></div>
      <div className="exercise-list">{workout.items.map(([name, reps, rest], index) => {
        const id = `${selected}-${index}`
        const reference = exerciseReferences[id]
        return <div className="exercise-item" key={id}>
          <label className={complete[id] ? 'exercise done' : 'exercise'}>
            <input type="checkbox" checked={Boolean(complete[id])} onChange={() => toggle(id)} />
            <span><b>{name}</b><small>{rest ? `${rest} rest` : 'Move with control'}</small></span><strong>{reps}</strong>
          </label>
          {reference && <details className="form-reference" open={openReference === id} onToggle={event => setOpenReference(event.currentTarget.open ? id : null)}>
            <summary>View form photos</summary>
            {openReference === id && <><div className="reference-gallery">
              {reference.images.map((src, imageIndex) => <img key={src} src={optimizedImage(src)} alt={`${name}: correct form reference ${imageIndex + 1}`} fetchPriority="high" />)}
            </div><p>{reference.cue}</p></>}
          </details>}
        </div>
      })}</div>
    </section>

    <section className="metrics">
      {[['Starting weight', '71.8 kg'], ['Target', '56–58 kg'], ['Starting waist', '38.5 in'], ['Protein', '100–120 g']].map(([label, value]) => <div className="metric" key={label}><small>{label}</small><b>{value}</b></div>)}
    </section>

    <section className="card history-card">
      <div className="card-title"><div><p className="eyebrow">CONSISTENCY</p><h2>Workout history</h2></div><span>Last 7 days</span></div>
      <p className="history-note">Every checked exercise is saved on this device. Review your completed, partial, and missed days here.</p>
      <div className="history-list">{recentHistory.map(({ key, date, planned, completed, total, status, isToday }) => <div className="history-row" key={key}>
        <div><b>{isToday ? 'Today' : new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(date)}</b><small>{new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short' }).format(date)} · {planned.title}</small></div>
        <div className="history-result"><b>{completed}/{total}</b><span className={`status ${status.toLowerCase().replace(' ', '-')}`}>{status}</span></div>
      </div>)}</div>
    </section>

    <section className="card">
      <div className="card-title"><div><p className="eyebrow">PROGRESS</p><h2>Weight tracker</h2></div><button className="button" onClick={addLog}>Add entry</button></div>
      {logs.length === 0 ? <p className="empty">No entries yet. Record morning weight under consistent conditions.</p> : <div className="table-wrap"><table><thead><tr><th>Date</th><th>Weight</th><th>7-day avg</th><th>Waist</th><th /></tr></thead><tbody>{logs.map((log, i) => <tr key={i}><td><input type="date" value={log.date} onChange={e => updateLog(i, 'date', e.target.value)} /></td><td><input type="number" step="0.1" placeholder="kg" value={log.weight} onChange={e => updateLog(i, 'weight', e.target.value)} /></td><td>{average(i)}</td><td><input type="number" step="0.1" placeholder="in" value={log.waist} onChange={e => updateLog(i, 'waist', e.target.value)} /></td><td><button className="delete" aria-label="Delete entry" onClick={() => setLogs(current => current.filter((_, index) => index !== i))}>×</button></td></tr>)}</tbody></table></div>}
    </section>

    <section className="tips"><div><h2>Simple nutrition</h2><p>1,650–1,750 kcal/day · 2–3 proper meals · protein at every dinner. Keep rice and fruit; manage portions.</p></div><div><h2>Equipment</h2><p>Bench, 5 kg & 10 kg dumbbells, pull-up bar and skipping rope. Add reps or slow the lowering when weight is limited.</p></div></section>
  </main>
}
