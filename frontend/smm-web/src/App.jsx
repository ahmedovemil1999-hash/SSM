import AppRoutes from './routes/AppRoutes';

import useNotificationSignalR from './features/notifications/hooks/useNotificationSignalR';

export default function App() {
  useNotificationSignalR();

  return <AppRoutes />;
}