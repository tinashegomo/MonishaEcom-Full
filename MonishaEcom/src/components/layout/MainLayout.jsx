import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import BottomNav from './BottomNav';

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-dvh w-full bg-bg-subtle">
      <TopNav />
      <main className="flex-1 overflow-y-auto scroll-smooth pb-28 lg:pb-10">
        <div className="container-grid pt-10 lg:pt-14 pb-12">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
