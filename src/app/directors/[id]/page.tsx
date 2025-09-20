import PersonDetailPage from '@/components/PersonDetailPage';

interface DirectorDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DirectorDetailPage({ params }: DirectorDetailPageProps) {
  const resolvedParams = await params;
  return <PersonDetailPage params={resolvedParams} personType="directors" />;
}