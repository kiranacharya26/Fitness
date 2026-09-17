export const workouts = [
  { key: 'MON', title: 'Upper A', items: [['Push-ups', '4 × 10–15', '60 sec'], ['Pull-ups', '4 × 2–5', '90 sec'], ['DB Shoulder Press', '3 × 10–12', '60 sec'], ['One-arm DB Row', '3 × 10–15 / side', '60 sec'], ['DB Biceps Curl', '2 × 12–15', '45 sec'], ['DB Triceps Extension', '2 × 12–15', '45 sec']] },
  { key: 'TUE', title: 'Lower A + Core', items: [['Goblet Squat — 10 kg', '3 × 12–15', '60 sec'], ['Bulgarian Split Squat', '3 × 8–12 / leg', '60 sec'], ['DB Romanian Deadlift', '3 × 10–15', '60 sec'], ['Standing Calf Raise', '2 × 15–20', '45 sec'], ['Lying Leg Raise', '3 × 10–15', '45 sec'], ['Plank', '2 × 30–45 sec', '45 sec']] },
  { key: 'WED', title: 'Walk + Skipping', items: [['10k steps', '10,000+ steps', ''], ['Skipping', '10 min · 45s on / 30s rest', '']] },
  { key: 'THU', title: 'Upper B', items: [['Pull-ups', '4 × 2–5', '90 sec'], ['Feet-elevated Push-ups', '3 × 8–12', '60 sec'], ['One-arm DB Row', '3 × 12–15 / side', '60 sec'], ['DB Lateral Raise', '3 × 12–20', '45 sec'], ['DB Floor/Bench Press', '3 × 10–15', '60 sec'], ['DB Hammer Curl', '2 × 12–15', '45 sec']] },
  { key: 'FRI', title: 'Lower B + Core', items: [['Bulgarian Split Squat', '3 × 10–12 / leg', '60 sec'], ['Goblet Squat', '3 × 12–15', '60 sec'], ['DB Romanian Deadlift', '3 × 12–15', '60 sec'], ['Reverse Lunges', '2 × 10 / leg', '60 sec'], ['Bicycle Crunch', '3 × 15 / side', '45 sec'], ['Plank', '2 × 45 sec', '45 sec']] },
  { key: 'SAT', title: 'Full Body + Skipping', items: [['Push-ups', '3 × 12–15', ''], ['Goblet Squat', '3 × 15', ''], ['Pull-ups', '3 × 2–5', ''], ['DB Romanian Deadlift', '3 × 12', ''], ['DB Shoulder Press', '2 × 12', ''], ['Plank', '2 × 45 sec', ''], ['Skipping', '8–10 min · 30s on / 30s off', '']] },
  { key: 'SUN', title: 'Recovery', items: [['10k steps', '10,000+ steps', ''], ['Optional light mobility', 'Optional', '']] },
]

export const todayKey = () => ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][new Date().getDay()]
