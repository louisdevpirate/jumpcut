import Image from "next/image";
import Link from "next/link";
import StarRating from "./StarRating";

interface FilmCardProps {
  id: number;
  title: string;
  year: number;
  poster: string;
  rating: number;
}

export default function FilmCard({ id, title, year, poster, rating }: FilmCardProps) {
  return (
    <Link href={`/films/${id}`} className="group block">
      <div className="film-card rounded-xl overflow-hidden shadow-md bg-white hover:shadow-xl transition duration-300 animate-fade-in">
        <div className="relative aspect-[2/3]">
          <Image
            src={poster}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-neutral-900 truncate">{title}</h3>
          <p className="text-sm text-neutral-500">{year}</p>
          <div className="mt-2">
            <StarRating rating={rating} interactive={false} size="sm" />
          </div>
        </div>
      </div>
    </Link>
  );
}
