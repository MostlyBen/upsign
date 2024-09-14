import { ReactNode } from 'react';
import { Index } from '~/components';

export default function AnonLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Index />
      {children}
    </>
  );
}
