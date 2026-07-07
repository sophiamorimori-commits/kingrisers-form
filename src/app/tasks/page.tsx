import AppShell from '@/components/layout/AppShell';
import TasksView from '@/components/tasks/TasksView';

export default function TasksPage() {
  return (
    <AppShell title="Tasks">
      <TasksView />
    </AppShell>
  );
}
