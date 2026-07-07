import WeekView from '@/components/calendar/WeekView';
import AppShell from '@/components/layout/AppShell';

export default function WeekPage() {
  return (
    <AppShell title="Week">
      <WeekView />
    </AppShell>
  );
}
