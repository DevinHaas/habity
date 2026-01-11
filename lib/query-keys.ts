export const queryKeys = {
  habits: {
    all: ['habits'] as const,
    completions: (date: string) => ['completions', date] as const,
    history: (days: number) => ['completions', 'history', days] as const,
    allCompletions: ['completions', 'all'] as const,
  },
  goals: { all: ['goals'] as const },
  stats: { all: ['stats'] as const },
};
