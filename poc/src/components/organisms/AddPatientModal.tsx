import { Button, Group, Modal, MultiSelect, NumberInput, Select, SimpleGrid, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';
import type { Patient } from '../../data/mock';

type Props = { opened: boolean; nextId: string; onClose: () => void; onAdd: (p: Patient) => void };

// rough add form, only adds to the list in memory
export function AddPatientModal({ opened, nextId, onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | string>('');
  const [gender, setGender] = useState<string | null>(null);
  const [languages, setLanguages] = useState<string[]>(['Mandarin', 'English']);
  const [email, setEmail] = useState('');

  const add = () => {
    onAdd({
      id: nextId,
      name,
      age: Number(age) || 0,
      gender: gender ?? '',
      languages,
      location: '',
      email,
      assessments: [],
      reports: [],
    });
    setName('');
    setAge('');
    setEmail('');
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add patient" centered>
      <Stack>
        <TextInput label="Name" value={name} onChange={(e) => setName(e.currentTarget.value)} required />
        <SimpleGrid cols={2}>
          <NumberInput label="Age" min={0} value={age} onChange={setAge} />
          <Select label="Gender" data={['Female', 'Male', 'Other']} value={gender} onChange={setGender} />
        </SimpleGrid>
        <MultiSelect label="Language" data={['Mandarin', 'English', 'Cantonese', 'French']} value={languages} onChange={setLanguages} />
        <TextInput label="Contact" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={add} disabled={!name.trim()}>
            Add patient
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
