import PersonDetailPage from '@/components/PersonDetailPage';

interface ActorDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ActorDetailPage({ params }: ActorDetailPageProps) {
  const resolvedParams = await params;
  return <PersonDetailPage params={resolvedParams} personType="actors" />;
}