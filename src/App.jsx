import { useEffect, useState } from 'react'
import { todayKey, workouts } from './workouts'

const read = (key, fallback) => JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback))

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
}

export default function App() {
  const today = todayKey()
  const [selected, setSelected] = useState(today)
  const [complete, setComplete] = useState(() => read('fitness-complete', {}))
  const [logs, setLogs] = useState(() => read('fitness-logs', []))
  const workout = workouts.find(({ key }) => key === selected)

  useEffect(() => localStorage.setItem('fitness-complete', JSON.stringify(complete)), [complete])
  useEffect(() => localStorage.setItem('fitness-logs', JSON.stringify(logs)), [logs])

  const average = (index) => {
    const values = logs.slice(0, index + 1).reverse().map(x => Number(x.weight)).filter(Boolean).slice(0, 7)
    return values.length === 7 ? `${(values.reduce((sum, n) => sum + n, 0) / 7).toFixed(1)} kg` : '—'
  }
  const toggle = (id) => setComplete(current => ({ ...current, [id]: !current[id] }))
  const updateLog = (index, field, value) => setLogs(current => current.map((row, i) => i === index ? { ...row, [field]: value } : row))
  const addLog = () => setLogs(current => [...current, { date: new Date().toISOString().slice(0, 10), weight: '', waist: '' }])

  return <main className="app">
    <header>
      <div><p className="eyebrow">YOUR PLAN</p><h1>Fitness dashboard</h1></div>
      <time>{new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date())}</time>
    </header>

    <section className="hero"><span>Today · {today}</span><h2>{workouts.find(x => x.key === today).title}</h2><p>Small, consistent sessions. Aim for 10,000+ steps.</p></section>

    <nav aria-label="Workout days">{workouts.map(({ key }) => <button key={key} className={selected === key ? 'active' : ''} onClick={() => setSelected(key)}>{key}</button>)}</nav>

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
          {reference && <details className="form-reference">
            <summary>View form photos</summary>
            <div className="reference-gallery">
              {reference.images.map((src, imageIndex) => <img key={src} src={src} alt={`${name}: correct form reference ${imageIndex + 1}`} />)}
            </div>
            <p>{reference.cue}</p>
          </details>}
        </div>
      })}</div>
    </section>

    <section className="metrics">
      {[['Starting weight', '71.8 kg'], ['Target', '56–58 kg'], ['Starting waist', '38.5 in'], ['Protein', '100–120 g']].map(([label, value]) => <div className="metric" key={label}><small>{label}</small><b>{value}</b></div>)}
    </section>

    <section className="card">
      <div className="card-title"><div><p className="eyebrow">PROGRESS</p><h2>Weight tracker</h2></div><button className="button" onClick={addLog}>Add entry</button></div>
      {logs.length === 0 ? <p className="empty">No entries yet. Record morning weight under consistent conditions.</p> : <div className="table-wrap"><table><thead><tr><th>Date</th><th>Weight</th><th>7-day avg</th><th>Waist</th><th /></tr></thead><tbody>{logs.map((log, i) => <tr key={i}><td><input type="date" value={log.date} onChange={e => updateLog(i, 'date', e.target.value)} /></td><td><input type="number" step="0.1" placeholder="kg" value={log.weight} onChange={e => updateLog(i, 'weight', e.target.value)} /></td><td>{average(i)}</td><td><input type="number" step="0.1" placeholder="in" value={log.waist} onChange={e => updateLog(i, 'waist', e.target.value)} /></td><td><button className="delete" aria-label="Delete entry" onClick={() => setLogs(current => current.filter((_, index) => index !== i))}>×</button></td></tr>)}</tbody></table></div>}
    </section>

    <section className="tips"><div><h2>Simple nutrition</h2><p>1,650–1,750 kcal/day · 2–3 proper meals · protein at every dinner. Keep rice and fruit; manage portions.</p></div><div><h2>Equipment</h2><p>Bench, 5 kg & 10 kg dumbbells, pull-up bar and skipping rope. Add reps or slow the lowering when weight is limited.</p></div></section>
  </main>
}
