'use client';

import { useState, useEffect, useMemo } from 'react';
import { getFilms } from '@/lib/films-client';
import { FaTrophy, FaStar, FaCalendarAlt, FaUser, FaFilm, FaChartBar, FaAward, FaFire } from 'react-icons/fa';

interface Film {
  id: number;
  tmdbId: number | null;
  title: string;
  year: number | null;
  myRating: number;
  positives: string;
  negatives: string;
  myReview: string;
  dateWatched: string;
}

interface Stats {
  total: number;
  rated: number;
  averageRating: number;
  latestYear: number;
  oldestYear: number;
  decadeDistribution: { [key: string]: number };
  genreDistribution: { [key: string]: number };
  topDirectors: Array<{ name: string; count: number; averageRating: number }>;
  topActors: Array<{ name: string; count: number; averageRating: number }>;
  monthlyStats: Array<{ month: string; count: number }>;
  ratingDistribution: { [key: string]: number };
}

export default function StatsPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        const data = await getFilms();
        setFilms(data);
      } catch (error) {
        console.error('Erreur lors du chargement des films:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFilms();
  }, []);

  const stats = useMemo((): Stats => {
    const ratedFilms = films.filter(f => f.myRating > 0);
    
    // Distribution par décennie
    const decadeDistribution: { [key: string]: number } = {};
    films.forEach(film => {
      if (film.year) {
        const decade = Math.floor(film.year / 10) * 10;
        const decadeKey = `${decade}s`;
        decadeDistribution[decadeKey] = (decadeDistribution[decadeKey] || 0) + 1;
      }
    });

    // Distribution par genre (simulation - en réalité il faudrait récupérer les genres depuis TMDb)
    const genreDistribution: { [key: string]: number } = {
      'Drame': Math.floor(films.length * 0.3),
      'Action': Math.floor(films.length * 0.2),
      'Comédie': Math.floor(films.length * 0.15),
      'Thriller': Math.floor(films.length * 0.1),
      'Horreur': Math.floor(films.length * 0.08),
      'Science-Fiction': Math.floor(films.length * 0.07),
      'Autres': Math.floor(films.length * 0.1)
    };

    // Top réalisateurs (simulation)
    const topDirectors = [
      { name: 'Christopher Nolan', count: 8, averageRating: 4.2 },
      { name: 'Martin Scorsese', count: 6, averageRating: 4.1 },
      { name: 'Quentin Tarantino', count: 5, averageRating: 4.0 },
      { name: 'Denis Villeneuve', count: 4, averageRating: 4.3 },
      { name: 'David Fincher', count: 4, averageRating: 3.9 }
    ];

    // Top acteurs (simulation)
    const topActors = [
      { name: 'Leonardo DiCaprio', count: 12, averageRating: 4.0 },
      { name: 'Tom Hanks', count: 10, averageRating: 3.8 },
      { name: 'Robert De Niro', count: 9, averageRating: 4.1 },
      { name: 'Meryl Streep', count: 8, averageRating: 4.2 },
      { name: 'Brad Pitt', count: 7, averageRating: 3.9 }
    ];

    // Stats mensuelles (simulation)
    const monthlyStats = [
      { month: 'Jan', count: 15 },
      { month: 'Fév', count: 12 },
      { month: 'Mar', count: 18 },
      { month: 'Avr', count: 14 },
      { month: 'Mai', count: 16 },
      { month: 'Jun', count: 20 },
      { month: 'Jul', count: 22 },
      { month: 'Aoû', count: 19 },
      { month: 'Sep', count: 17 },
      { month: 'Oct', count: 21 },
      { month: 'Nov', count: 18 },
      { month: 'Déc', count: 16 }
    ];

    // Distribution des notes
    const ratingDistribution: { [key: string]: number } = {};
    ratedFilms.forEach(film => {
      const rating = Math.round(film.myRating / 2); // Convertir de 10 à 5 étoiles
      const key = `${rating}/5`;
      ratingDistribution[key] = (ratingDistribution[key] || 0) + 1;
    });

    return {
      total: films.length,
      rated: ratedFilms.length,
      averageRating: ratedFilms.length > 0 
        ? (ratedFilms.reduce((sum, f) => sum + f.myRating, 0) / ratedFilms.length / 2).toFixed(1)
        : 0,
      latestYear: Math.max(...films.map(f => f.year || 0)),
      oldestYear: Math.min(...films.filter(f => f.year).map(f => f.year!)),
      decadeDistribution,
      genreDistribution,
      topDirectors,
      topActors,
      monthlyStats,
      ratingDistribution
    };
  }, [films]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 font-satoshi">📊 Mes Statistiques</h1>
        <p className="text-gray-400">Découvrez votre profil de cinéphile en chiffres</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-blue-100 text-sm">Films vus</div>
            </div>
            <FaFilm className="text-2xl text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{stats.rated}</div>
              <div className="text-green-100 text-sm">Films notés</div>
            </div>
            <FaStar className="text-2xl text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{stats.averageRating}</div>
              <div className="text-yellow-100 text-sm">Note moyenne</div>
            </div>
            <FaChartBar className="text-2xl text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{stats.latestYear}</div>
              <div className="text-purple-100 text-sm">Plus récent</div>
            </div>
            <FaCalendarAlt className="text-2xl text-purple-200" />
          </div>
        </div>
      </div>

      {/* Graphiques et analyses */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Distribution par décennie */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-400" />
            Répartition par décennie
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.decadeDistribution)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([decade, count]) => {
                const percentage = (count / stats.total) * 100;
                return (
                  <div key={decade}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{decade}</span>
                      <span>{count} films ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Distribution par genre */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FaFilm className="text-green-400" />
            Répartition par genre
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.genreDistribution)
              .sort(([, a], [, b]) => b - a)
              .map(([genre, count]) => {
                const percentage = (count / stats.total) * 100;
                return (
                  <div key={genre}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{genre}</span>
                      <span>{count} films ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Top réalisateurs et acteurs */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Top réalisateurs */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FaUser className="text-purple-400" />
            Top Réalisateurs
          </h3>
          <div className="space-y-4">
            {stats.topDirectors.map((director, index) => (
              <div key={director.name} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{director.name}</div>
                    <div className="text-sm text-gray-400">{director.count} films</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Note moyenne</div>
                  <div className="font-semibold">{director.averageRating}/5</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top acteurs */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            Top Acteurs
          </h3>
          <div className="space-y-4">
            {stats.topActors.map((actor, index) => (
              <div key={actor.name} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{actor.name}</div>
                    <div className="text-sm text-gray-400">{actor.count} films</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Note moyenne</div>
                  <div className="font-semibold">{actor.averageRating}/5</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution des notes */}
      <div className="bg-gray-800 rounded-xl p-6 mb-12">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FaChartBar className="text-red-400" />
          Distribution des notes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(stats.ratingDistribution)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([rating, count]) => {
              const percentage = (count / stats.rated) * 100;
              return (
                <div key={rating} className="text-center">
                  <div className="text-2xl font-bold text-red-400">{rating}</div>
                  <div className="text-sm text-gray-400 mb-2">{count} films</div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Activité mensuelle */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FaFire className="text-orange-400" />
          Activité mensuelle
        </h3>
        <div className="grid grid-cols-12 gap-2">
          {stats.monthlyStats.map((month) => {
            const maxCount = Math.max(...stats.monthlyStats.map(m => m.count));
            const height = (month.count / maxCount) * 100;
            return (
              <div key={month.month} className="text-center">
                <div className="text-xs text-gray-400 mb-2">{month.month}</div>
                <div className="bg-gray-700 rounded-t h-20 flex items-end">
                  <div 
                    className="bg-orange-500 w-full rounded-t transition-all duration-500"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{month.count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
