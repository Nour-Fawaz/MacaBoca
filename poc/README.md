# TeLaC POC

Front-end demo for TeLaC. It has no backend.

Stack: React + TypeScript + Vite + [Mantine](https://mantine.dev).

```bash
cd poc
npm install
npm run dev      # http://localhost:5173
```

- `src/App.tsx`: root component
- `src/theme.ts`: Mantine theme (primary color, radius)
- `src/pages/`: full screens, built from organisms
- `src/components/`: atomic design
  - `atoms/`: smallest pieces (e.g. a styled button, a status badge)
  - `molecules/`: a few atoms together (e.g. a search field with a button)
  - `organisms/`: page sections (e.g. a header or a patient table)

Each folder has an `index.ts` that re-exports its components. Import through the aliases, not relative paths:

```tsx
import { PatientTable } from '@organisms';
import { StatusBadge } from '@atoms';
```

To add a component, create `src/components/<level>/MyThing.tsx` and add `export { MyThing } from './MyThing';` to that folder's `index.ts`.
