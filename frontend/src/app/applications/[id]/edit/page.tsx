import { ApplicationEditForm } from '@/presentation/components/ApplicationEditForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditApplicationPage({ params }: PageProps) {
  const { id } = await params;
  return <ApplicationEditForm id={id} />;
}
