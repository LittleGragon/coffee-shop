'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function NameClient() {
  const [name, setName] = useState<string>('User');

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      setName(u?.name || 'User');
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className={styles.name} suppressHydrationWarning>
      {name}
    </div>
  );
}