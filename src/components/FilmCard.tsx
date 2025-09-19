import Image from "next/image";
import Link from "next/link";
import StarRatingModern from "./StarRatingModern";
import QuickReviewButton from "./QuickReviewButton";

interface FilmCardProps {
  id: number;
  title: string;
  year: number;
  poster: string;
  rating: number; // Note sur 5 (0-5)
  tmdbId?: number;
  onReviewSubmit?: (data: { rating: number; review: string }) => Promise<void>;
  showQuickReview?: boolean;
}

export default function FilmCard({ 
  id, 
  title, 
  year, 
  poster, 
  rating, 
  tmdbId,
  onReviewSubmit,
  showQuickReview = false
}: FilmCardProps) {
  return (
    <div className="group block">
      <Link href={`/films/${id}`} className="block">
        <div className="film-card rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition duration-300 animate-fade-in">
          <div className="relative aspect-[2/3]">
            <Image
              src={poster}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              loading="lazy"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg text-neutral-900 truncate">{title}</h3>
            <p className="text-sm text-neutral-500">{year}</p>
            <div className="mt-2">
              <StarRatingModern 
                rating={rating} 
                interactive={false} 
                size="sm" 
                showValue={true}
              />
            </div>
          </div>
        </div>
      </Link>
      
      {/* Bouton critique rapide */}
      {showQuickReview && onReviewSubmit && (
        <div className="mt-3 flex justify-center">
          <QuickReviewButton
            movieId={id}
            movieTitle={title}
            onReviewSubmit={onReviewSubmit}
            variant="minimal"
            size="sm"
          />
        </div>
      )}
    </div>
  );
}
