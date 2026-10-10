'use client';

import { createContext, useContext } from 'react';

// Permet aux onglets de rafraîchir les compteurs de la barre latérale après une action (lecture, archivage…)
export const AdminCountsContext = createContext<() => void>(() => {});
export const useRefreshAdminCounts = () => useContext(AdminCountsContext);
