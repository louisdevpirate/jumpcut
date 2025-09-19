import PersonDetailPage from '@/components/PersonDetailPage';

interface ActorDetailPageProps {
  params: {
    id: string;
  };
}

export default function ActorDetailPage({ params }: ActorDetailPageProps) {
  return <PersonDetailPage params={params} personType="actors" />;
}