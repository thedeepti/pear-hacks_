'use client';

import { useParams } from 'next/navigation';
import HackathonDetails from './HackathonDetails';

export default function HackathonPage() {
  const params = useParams();
  const id = params.id as string;

  return <HackathonDetails id={id} />;
} 