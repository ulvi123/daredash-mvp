export const Collections = {
    USERS: 'users',
    CHALLENGES: 'challenges',
    COMPLETIONS: 'completions',
    TRANSACTIONS: 'transactions',
    NOTIFICATIONS: 'notifications',
    REPORTS: 'reports',
  } as const;
  
  export const SubCollections = {
    USER_TRANSACTIONS: 'transactions',
    CHALLENGE_COMPLETIONS: 'completions',
    CHALLENGE_COMMENTS: 'comments',
  } as const;