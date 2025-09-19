'use client';

import { useState, useEffect, useMemo } from 'react';
import { getFilms } from '@/lib/films-client';
import { FaTrophy, FaStar, FaFire, FaCalendarAlt, FaUser, FaFilm, FaMedal, FaCrown, FaGem } from 'react-icons/fa';

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

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function BadgesPage() {
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

  const badges = useMemo((): Badge[] => {
    const ratedFilms = films.filter(f => f.myRating > 0);
    const highRatedFilms = films.filter(f => f.myRating >= 8); // 4/5 étoiles
    const recentFilms = films.filter(f => f.year && f.year >= 2020);
    const oldFilms = films.filter(f => f.year && f.year < 1980);
    
    // Simulation de données pour les réalisateurs et acteurs
    const nolanFilms = films.filter(f => f.title.toLowerCase().includes('nolan') || f.title.toLowerCase().includes('inception') || f.title.toLowerCase().includes('interstellar')).length;
    const scorseseFilms = films.filter(f => f.title.toLowerCase().includes('scorsese') || f.title.toLowerCase().includes('goodfellas') || f.title.toLowerCase().includes('taxi')).length;
    const tarantinoFilms = films.filter(f => f.title.toLowerCase().includes('tarantino') || f.title.toLowerCase().includes('pulp') || f.title.toLowerCase().includes('kill')).length;

    return [
      {
        id: 'first-film',
        name: 'Premier Pas',
        description: 'Regarder votre premier film',
        icon: <FaFilm className="text-lg" />,
        color: 'bg-blue-500',
        unlocked: films.length >= 1,
        progress: Math.min(films.length, 1),
        maxProgress: 1,
        rarity: 'common'
      },
      {
        id: 'film-collector',
        name: 'Collectionneur',
        description: 'Regarder 50 films',
        icon: <FaFilm className="text-lg" />,
        color: 'bg-green-500',
        unlocked: films.length >= 50,
        progress: Math.min(films.length, 50),
        maxProgress: 50,
        rarity: 'common'
      },
      {
        id: 'cinephile',
        name: 'Cinéphile',
        description: 'Regarder 100 films',
        icon: <FaTrophy className="text-lg" />,
        color: 'bg-purple-500',
        unlocked: films.length >= 100,
        progress: Math.min(films.length, 100),
        maxProgress: 100,
        rarity: 'rare'
      },
      {
        id: 'movie-master',
        name: 'Maître du Cinéma',
        description: 'Regarder 500 films',
        icon: <FaCrown className="text-lg" />,
        color: 'bg-yellow-500',
        unlocked: films.length >= 500,
        progress: Math.min(films.length, 500),
        maxProgress: 500,
        rarity: 'epic'
      },
      {
        id: 'critic',
        name: 'Critique',
        description: 'Noter 25 films',
        icon: <FaStar className="text-lg" />,
        color: 'bg-orange-500',
        unlocked: ratedFilms.length >= 25,
        progress: Math.min(ratedFilms.length, 25),
        maxProgress: 25,
        rarity: 'common'
      },
      {
        id: 'expert-critic',
        name: 'Critique Expert',
        description: 'Noter 100 films',
        icon: <FaMedal className="text-lg" />,
        color: 'bg-red-500',
        unlocked: ratedFilms.length >= 100,
        progress: Math.min(ratedFilms.length, 100),
        maxProgress: 100,
        rarity: 'rare'
      },
      {
        id: 'quality-seeker',
        name: 'Chercheur de Qualité',
        description: 'Donner 4+ étoiles à 20 films',
        icon: <FaGem className="text-lg" />,
        color: 'bg-pink-500',
        unlocked: highRatedFilms.length >= 20,
        progress: Math.min(highRatedFilms.length, 20),
        maxProgress: 20,
        rarity: 'rare'
      },
      {
        id: 'modern-cinema',
        name: 'Cinéma Moderne',
        description: 'Regarder 10 films récents (2020+)',
        icon: <FaFire className="text-lg" />,
        color: 'bg-cyan-500',
        unlocked: recentFilms.length >= 10,
        progress: Math.min(recentFilms.length, 10),
        maxProgress: 10,
        rarity: 'common'
      },
      {
        id: 'vintage-lover',
        name: 'Amateur de Vintage',
        description: 'Regarder 5 films d\'avant 1980',
        icon: <FaCalendarAlt className="text-lg" />,
        color: 'bg-amber-500',
        unlocked: oldFilms.length >= 5,
        progress: Math.min(oldFilms.length, 5),
        maxProgress: 5,
        rarity: 'common'
      },
      {
        id: 'nolan-fan',
        name: 'Fan de Nolan',
        description: 'Regarder 5 films de Christopher Nolan',
        icon: <FaUser className="text-lg" />,
        color: 'bg-indigo-500',
        unlocked: nolanFilms >= 5,
        progress: Math.min(nolanFilms, 5),
        maxProgress: 5,
        rarity: 'rare'
      },
      {
        id: 'scorsese-fan',
        name: 'Fan de Scorsese',
        description: 'Regarder 5 films de Martin Scorsese',
        icon: <FaUser className="text-lg" />,
        color: 'bg-teal-500',
        unlocked: scorseseFilms >= 5,
        progress: Math.min(scorseseFilms, 5),
        maxProgress: 5,
        rarity: 'rare'
      },
      {
        id: 'tarantino-fan',
        name: 'Fan de Tarantino',
        description: 'Regarder 5 films de Quentin Tarantino',
        icon: <FaUser className="text-lg" />,
        color: 'bg-rose-500',
        unlocked: tarantinoFilms >= 5,
        progress: Math.min(tarantinoFilms, 5),
        maxProgress: 5,
        rarity: 'rare'
      }
    ];
  }, [films]);

  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);
  const totalBadges = badges.length;
  const unlockedCount = unlockedBadges.length;
  const completionPercentage = (unlockedCount / totalBadges) * 100;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400';
      case 'rare': return 'border-blue-400';
      case 'epic': return 'border-purple-400';
      case 'legendary': return 'border-yellow-400';
      default: return 'border-gray-400';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return '';
      case 'rare': return 'shadow-blue-500/50 shadow-lg';
      case 'epic': return 'shadow-purple-500/50 shadow-lg';
      case 'legendary': return 'shadow-yellow-500/50 shadow-xl';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement des badges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 font-satoshi">🏆 Mes Badges</h1>
        <p className="text-gray-400">Débloquez des succès en explorant le cinéma</p>
      </div>

      {/* Progression globale */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Progression des Badges</h2>
            <p className="text-blue-100">{unlockedCount}/{totalBadges} badges débloqués</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{completionPercentage.toFixed(0)}%</div>
            <div className="text-blue-100 text-sm">Complétion</div>
          </div>
        </div>
        <div className="w-full bg-blue-800/30 rounded-full h-3">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Badges débloqués */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaTrophy className="text-yellow-400" />
          Badges Débloqués ({unlockedCount})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unlockedBadges.map((badge) => (
            <div 
              key={badge.id} 
              className={`bg-gray-800 rounded-xl p-6 border-2 ${getRarityColor(badge.rarity)} ${getRarityGlow(badge.rarity)} transition-all hover:scale-105`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`${badge.color} p-3 rounded-full`}>
                  {badge.icon}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{badge.name}</h4>
                  <p className="text-gray-400 text-sm capitalize">{badge.rarity}</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-3">{badge.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>✅ Débloqué</span>
                <span className="ml-auto">{badge.progress}/{badge.maxProgress}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges verrouillés */}
      <div>
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaMedal className="text-gray-400" />
          Badges à Débloquer ({lockedBadges.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lockedBadges.map((badge) => (
            <div 
              key={badge.id} 
              className="bg-gray-800 rounded-xl p-6 border-2 border-gray-600 opacity-60"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gray-600 p-3 rounded-full">
                  {badge.icon}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-400">{badge.name}</h4>
                  <p className="text-gray-500 text-sm capitalize">{badge.rarity}</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-3">{badge.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>🔒 Verrouillé</span>
                <span className="ml-auto">{badge.progress}/{badge.maxProgress}</span>
              </div>
              <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gray-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
