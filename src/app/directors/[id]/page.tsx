import PersonDetailPage from '@/components/PersonDetailPage';

interface DirectorDetailPageProps {
  params: {
    id: string;
  };
}

export default function DirectorDetailPage({ params }: DirectorDetailPageProps) {
  return <PersonDetailPage params={params} personType="directors" />;
}