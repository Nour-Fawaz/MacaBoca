// fake data until there's a backend

export type Result = 'correct' | 'incorrect' | 'manual';
export type Role = 'Experimenter' | 'Child' | 'Parent' | 'System' | 'Multiple speakers' | 'Others';
export const roles: Role[] = ['System', 'Child', 'Parent', 'Experimenter', 'Multiple speakers', 'Others'];

export type Question = {
  num: number;
  task: string;
  domain: string;
  start: number; // seconds into the recording
  prompt: string;
  target: string;
  answer: string;
  result: Result;
  manual: boolean; // result was set by the clinician
  verified: boolean;
  flag?: string; // reason it was flagged
  note: string;
};

export type Assessment = {
  id: string;
  date: string;
  time: string;
  name: string;
  language: 'English' | 'Mandarin';
  score: number;
  maxScore: number;
  reviewed: boolean;
  duration: number; // seconds
  transcribed: boolean;
  notes: string;
  questions: Question[];
};

export type Report = {
  id: string;
  assessmentId: string;
  date: string;
  title: string;
  status: 'Draft' | 'Final';
  fluency: string;
  recommendations: string;
};

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  languages: string[];
  location: string;
  email: string;
  assessments: Assessment[];
  reports: Report[];
};

export type Chunk = {
  id: number;
  start: number;
  end: number;
  language: string;
  tasks: string[];
  questions: Question[];
};

export type Segment = {
  id: string;
  chunk: number;
  start: number;
  speaker: string; // detected speaker id
  role?: Role;
  text: string;
  original: string;
  language: string;
  lowConfidence: boolean;
  verified: boolean;
};

export const clinician = 'Dr. Irene Yuan';

// question templates, cycled through for every assessment
const tasks = [
  { task: 'Picture naming', domain: 'Receptive vocabulary', prompt: 'What is this? (picture of an apple)', target: 'apple', answer: 'apple' },
  { task: 'Sentence repetition', domain: 'Sentence repetition', prompt: 'Can you say "the dog is running fast"?', target: 'the dog is running fast', answer: 'dog running fast' },
  { task: 'Point to the picture', domain: 'Receptive vocabulary', prompt: 'Point to the picture of the bird.', target: '(points to the bird)', answer: 'this one' },
  { task: 'Answer the question', domain: 'Semantics', prompt: 'What do you use to brush your teeth?', target: 'a toothbrush', answer: 'a brush' },
  { task: 'Story retell', domain: 'Narrative', prompt: 'Can you tell me the story again?', target: '(retells the story)', answer: 'the boy lost his dog and then he find it' },
];

export const domains = ['Receptive vocabulary', 'Sentence repetition', 'Narrative', 'Semantics', 'Grammar', 'Phonology'];

// keyed by index; 1 and 6 are sentence repetition, 2 is point to the picture
const flags: Record<number, string> = {
  1: 'potential parent prompting',
  2: 'potential background interference',
  6: 'potential parent prompting',
};

// questions that get marked incorrect, in order
const incorrectOrder = [3, 5, 8, 11, 14, 17, 19, 21, 23, 7, 13, 16, 10, 20, 22, 4, 6, 9, 12, 15, 18, 0];

function makeQuestions(score: number, reviewed: boolean): Question[] {
  // q2 and q3 need manual evaluation until the assessment is reviewed
  const pending = reviewed ? [] : [1, 2];
  const incorrectCount = Math.max(0, 24 - score - pending.length - (reviewed ? 1 : 0));
  const incorrect = new Set(incorrectOrder.slice(0, incorrectCount));
  if (reviewed) incorrect.add(2);

  return Array.from({ length: 24 }, (_, i) => {
    const t = tasks[i % tasks.length];
    const manual = reviewed && (i === 1 || i === 2);
    const result: Result = pending.includes(i) ? 'manual' : incorrect.has(i) ? 'incorrect' : 'correct';
    return {
      num: i + 1,
      ...t,
      start: 42 + i * 95,
      result,
      manual,
      verified: reviewed || ![1, 2, 7, 9].includes(i),
      flag: flags[i],
      note: i === 1 ? 'Parent repeated part of the sentence before the child answered. Omitted "is", possible grammar error.' : '',
    };
  });
}

function assessment(
  id: string,
  date: string,
  name: string,
  language: Assessment['language'],
  score: number,
  reviewed: boolean,
): Assessment {
  return {
    id,
    date,
    time: '10:30 AM',
    name,
    language,
    score,
    maxScore: 24,
    reviewed,
    duration: 2340,
    transcribed: reviewed,
    notes: '',
    questions: makeQuestions(score, reviewed),
  };
}

function report(id: string, assessmentId: string, date: string, title: string, status: Report['status']): Report {
  return { id, assessmentId, date, title, status, fluency: '', recommendations: '' };
}

export const patients: Patient[] = [
  {
    id: 'P-0123',
    name: 'Lily Chen',
    age: 6,
    gender: 'Female',
    languages: ['Mandarin', 'English'],
    location: 'Hamilton, ON',
    email: 'parent.chen@example.com',
    assessments: [
      assessment('A-1005', '2026-03-12', 'Language assessment A', 'English', 18, false),
      assessment('A-1004', '2026-01-20', 'Language assessment B', 'Mandarin', 15, false),
      assessment('A-1003', '2025-11-03', 'Language assessment E', 'English', 14, true),
      assessment('A-1002', '2025-09-15', 'Language assessment D', 'Mandarin', 12, true),
      assessment('A-1001', '2025-06-02', 'Language assessment C', 'English', 11, true),
    ],
    reports: [
      report('R-201', 'A-1003', '2025-11-05', 'Language assessment E report', 'Final'),
      report('R-200', 'A-1002', '2025-09-18', 'Language assessment D report', 'Final'),
      report('R-199', 'A-1001', '2025-06-04', 'Language assessment C report', 'Draft'),
    ],
  },
  {
    id: 'P-0124',
    name: 'Ethan Wang',
    age: 5,
    gender: 'Male',
    languages: ['Mandarin', 'English'],
    location: 'Toronto, ON',
    email: 'parent.wang@example.com',
    assessments: [
      assessment('A-2002', '2026-02-08', 'Language assessment A', 'English', 16, false),
      assessment('A-2001', '2025-10-14', 'Language assessment B', 'Mandarin', 13, true),
    ],
    reports: [report('R-210', 'A-2001', '2025-10-16', 'Language assessment B report', 'Final')],
  },
  {
    id: 'P-0125',
    name: 'Mia Liu',
    age: 7,
    gender: 'Female',
    languages: ['Mandarin', 'English'],
    location: 'Burlington, ON',
    email: 'parent.liu@example.com',
    assessments: [assessment('A-3001', '2025-12-01', 'Language assessment A', 'English', 20, true)],
    reports: [],
  },
];

export const findPatient = (id?: string) => patients.find((p) => p.id === id);

// assessment plus the patient it belongs to
export function findAssessment(id?: string) {
  for (const patient of patients) {
    const a = patient.assessments.find((x) => x.id === id);
    if (a) return { patient, assessment: a };
  }
  return undefined;
}

// existing report, or a new draft if there isn't one yet
export function reportFor(patient: Patient, a: Assessment): Report {
  return (
    patient.reports.find((r) => r.assessmentId === a.id) ??
    report(`R-${a.id}`, a.id, new Date().toISOString().slice(0, 10), `${a.name} report`, 'Draft')
  );
}

// ~20 min chunks, per supervisor feedback
export function chunksFor(a: Assessment): Chunk[] {
  const size = 1170;
  const count = Math.ceil(a.duration / size);
  return Array.from({ length: count }, (_, i) => {
    const start = i * size;
    const end = Math.min(a.duration, start + size);
    const questions = a.questions.filter((q) => q.start >= start && q.start < end);
    return {
      id: i + 1,
      start,
      end,
      language: a.language,
      tasks: [...new Set(questions.map((q) => q.task))],
      questions,
    };
  });
}

export const speakers = [
  { id: 'SPEAKER_01', role: 'Experimenter' as Role, sample: 'Can you say "the dog is running fast"?' },
  { id: 'SPEAKER_02', role: 'Child' as Role, sample: 'dog running fast' },
  { id: 'SPEAKER_03', role: 'Parent' as Role, sample: 'good job, try again' },
  { id: 'SPEAKER_04', role: undefined, sample: '[background speech]' },
];

// fake whisper output: prompt, optional parent line, child answer
export function segmentsFor(a: Assessment): Segment[] {
  const out: Segment[] = [];
  for (const q of a.questions) {
    const chunk = Math.floor(q.start / 1170) + 1;
    const base = { chunk, language: a.language, verified: true, lowConfidence: false };
    out.push({ ...base, id: `${q.num}-a`, start: q.start, speaker: 'SPEAKER_01', text: q.prompt, original: q.prompt });
    if (q.flag === 'potential parent prompting') {
      const text = 'the dog... is running';
      out.push({ ...base, id: `${q.num}-b`, start: q.start + 2, speaker: 'SPEAKER_03', text, original: text, verified: false, lowConfidence: true });
    }
    if (q.flag === 'potential background interference') {
      const text = '[background speech]';
      out.push({ ...base, id: `${q.num}-b`, start: q.start + 2, speaker: 'SPEAKER_04', text, original: text, verified: false, lowConfidence: true });
    }
    out.push({
      ...base,
      id: `${q.num}-c`,
      start: q.start + 4,
      speaker: 'SPEAKER_02',
      text: q.answer,
      original: q.answer,
      verified: q.verified,
      lowConfidence: !q.verified,
    });
  }
  return out;
}

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// seconds -> mm:ss
export const formatTime = (sec: number) => {
  const s = Math.max(0, Math.round(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

export const resultLabel = (q: Question) =>
  q.result === 'manual' ? 'Needs manual evaluation' : `${q.result === 'correct' ? 'Correct' : 'Incorrect'}${q.manual ? ' (manual)' : ''}`;

export const resultColor = (r: Result) => (r === 'correct' ? 'green' : r === 'incorrect' ? 'red' : 'yellow');
