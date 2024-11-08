
'use client';
import { AiFillHome, AiOutlineSetting } from "react-icons/ai";
import { useRouter, usePathname } from 'next/navigation';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navigateToHome = () => {
    router.push('/home_lessor'); // Replace '/home' with the actual path of your home page
  };

  const navigateToSettings = () => {
    router.push('/setting'); // Replace '/settings' with the actual path of your settings page
  };

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-around bg-white py-2 border-t">
      <button
        onClick={navigateToHome}
        className={pathname === '/home_lessor' ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}
      >
        <AiFillHome size={24} />
      </button>

      <button
        onClick={navigateToSettings}
        className={(pathname === '/setting' || pathname === '/editPark' || pathname === '/editLessorProfile') ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}
      >
        <AiOutlineSetting size={24} />
      </button>
    </div>
  );
}
