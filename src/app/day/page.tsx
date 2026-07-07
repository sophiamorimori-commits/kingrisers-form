import DayView from '@/components/calendar/DayView';
import AppShell from '@/components/layout/AppShell';

export default function DayPage() {
  return (
    <AppShell title="Today">
      <DayView />
    </AppShell>
  );
}
