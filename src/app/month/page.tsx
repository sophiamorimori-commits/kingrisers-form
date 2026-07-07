import MonthView from '@/components/calendar/MonthView';
import AppShell from '@/components/layout/AppShell';

export default function MonthPage() {
  return (
    <AppShell title="Month">
      <MonthView />
    </AppShell>
  );
}
