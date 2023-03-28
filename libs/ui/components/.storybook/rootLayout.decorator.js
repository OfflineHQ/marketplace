import { cn } from '@ui/shared';
// Custom decorator to apply the same className as in the root layout of the app
export const rootLayoutClasses =
  'min-h-screen bg-white font-sans text-slate-900 antialiased dark:bg-slate-900 dark:text-slate-50';
export const rootLayout = (Story) => (
  <div className={cn(rootLayoutClasses)}>
    <Story />
  </div>
);
