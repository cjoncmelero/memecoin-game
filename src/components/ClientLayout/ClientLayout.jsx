"use client";

import dynamic from 'next/dynamic';

const SmoothScroll = dynamic(() => import('../SmoothScroll/SmoothScroll'), {
  ssr: false
});

export default function ClientLayout({ children }) {
  return (
    <SmoothScroll>
      {children}
    </SmoothScroll>
  );
} 