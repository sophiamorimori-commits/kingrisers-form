import AppShell from '@/components/layout/AppShell';
import AnalyticsView from '@/components/analytics/AnalyticsView';

export default function AnalyticsPage() {
  return (
    <AppShell title="Stats">
      <AnalyticsView />
    </AppShell>
  );
}
