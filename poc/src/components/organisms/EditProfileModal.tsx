import { Button, Group, Modal, MultiSelect, NumberInput, Select, SimpleGrid, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';
import type { Patient } from '../../data/mock';

type Props = { opened: boolean; patient: Patient; onClose: () => void; onSave: (p: Patient) => void };

export function EditProfileModal({ opened, patient, onClose, onSave }: Props) {
  return (
    <Modal opened={opened} onClose={onClose} title="Edit patient profile" centered>
      {/* remount on open so the form starts from the saved profile */}
      {opened && <ProfileForm patient={patient} onClose={onClose} onSave={onSave} />}
    </Modal>
  );
}

function ProfileForm({ patient, onClose, onSave }: Omit<Props, 'opened'>) {
  const [form, setForm] = useState(patient);
  const set = (patch: Partial<Patient>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <Stack>
      <SimpleGrid cols={2}>
        <NumberInput label="Age" min={0} value={form.age} onChange={(v) => set({ age: Number(v) || 0 })} />
        <Select
          label="Gender"
          data={['Female', 'Male', 'Other', 'Prefer not to say']}
          value={form.gender}
          onChange={(v) => v && set({ gender: v })}
          allowDeselect={false}
        />
      </SimpleGrid>
      <MultiSelect
        label="Language"
        data={['Mandarin', 'English', 'Cantonese', 'French']}
        value={form.languages}
        onChange={(v) => set({ languages: v })}
      />
      <TextInput label="Location" value={form.location} onChange={(e) => set({ location: e.currentTarget.value })} />
      <TextInput label="Contact" value={form.email} onChange={(e) => set({ email: e.currentTarget.value })} />
      <Group justify="flex-end">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={() => onSave(form)}>Save profile</Button>
      </Group>
    </Stack>
  );
}
