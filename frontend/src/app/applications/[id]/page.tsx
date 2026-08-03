import { ApplicationDetail } from '@/presentation/components/applications/ApplicationDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationPage({ params }: PageProps) {
  const { id } = await params;
  return <ApplicationDetail id={id} />;
}
