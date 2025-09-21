'use client';

import OptimizedImage from '@/components/OptimizedImage';

export default function DebugImages() {
  const testCases = [
    { src: '/pEoqbqtLc4CcwDUDqxmEDSWpWTZ.jpg', name: 'Matrix poster' },
    { src: null, name: 'Null src' },
    { src: undefined, name: 'Undefined src' },
    { src: '', name: 'Empty string' },
    { src: 'https://image.tmdb.org/t/p/w500/pEoqbqtLc4CcwDUDqxmEDSWpWTZ.jpg', name: 'Full URL' }
  ];

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Debug des images</h1>
      
      <div className="grid grid-cols-2 gap-8">
        {testCases.map((testCase, index) => (
          <div key={index} className="border border-gray-600 p-4 rounded">
            <h3 className="mb-4">{testCase.name}</h3>
            <p className="text-sm text-gray-400 mb-2">src: {JSON.stringify(testCase.src)}</p>
            <div className="relative w-48 h-72 bg-gray-800 rounded">
              <OptimizedImage
                src={testCase.src}
                alt={testCase.name}
                fill
                className="object-cover rounded"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
