'use client';

import { useEffect } from 'react';
import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

export default function WebVitals() {
  useEffect(() => {
    // Mesurer les Core Web Vitals
    onCLS((metric) => {
      console.log('CLS:', metric);
      // Envoyer à votre service d'analytics
    });

    onINP((metric) => {
      console.log('INP:', metric);
    });

    onFCP((metric) => {
      console.log('FCP:', metric);
    });

    onLCP((metric) => {
      console.log('LCP:', metric);
    });

    onTTFB((metric) => {
      console.log('TTFB:', metric);
    });
  }, []);

  return null;
}
