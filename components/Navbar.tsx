import React, { useState, useEffect } from 'react';
import { ViewState, User, Notification } from '../types';
import { Home, MessageCircle, Calendar, Bell, User as UserIcon, LogOut, LogIn, X } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isEnglish: boolean;
  isLoggedIn: boolean;
  user: User;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, isEnglish, isLoggedIn, user, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Function to load notifications for the current user
  const loadNotifications = () => {
    if (!user) return;
    const allNotifs: Notification[] = JSON.parse(localStorage.getItem('pku_lens_notifications') || '[]');
    // Filter notifications meant for this user
    const myNotifs = allNotifs.filter(n => n.receiver === user.name);
    setNotifications(myNotifs);
  };

  useEffect(() => {
    loadNotifications();

    // Set up a listener for storage events (cross-tab) and custom events (same tab)
    const handleStorageChange = () => loadNotifications();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage-update', handleStorageChange);

    // Also poll occasionally to ensure freshness if events miss
    const interval = setInterval(loadNotifications, 3000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage-update', handleStorageChange);
      clearInterval(interval);
    };
  }, [user.name]);

  const markAsRead = () => {
    const allNotifs: Notification[] = JSON.parse(localStorage.getItem('pku_lens_notifications') || '[]');
    const updatedNotifs = allNotifs.map(n => {
      if (n.receiver === user.name) {
        return { ...n, isRead: true };
      }
      return n;
    });
    localStorage.setItem('pku_lens_notifications', JSON.stringify(updatedNotifs));
    loadNotifications();
  };

  const handleNotifClick = () => {
    if (!showNotifMenu) {
      markAsRead();
    }
    setShowNotifMenu(!showNotifMenu);
    setShowProfileMenu(false);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems = [
    { id: ViewState.HOME, label: isEnglish ? 'Home' : '首页', icon: Home },
    { id: ViewState.INTERACTION, label: isEnglish ? 'Community' : '社群', icon: MessageCircle },
    { id: ViewState.MY_ACTIVITIES, label: isEnglish ? 'Mine' : '我的', icon: Calendar },
  ];

  return (
    <>
      {/* Desktop Fixed Navbar */}
      <div className="hidden md:flex fixed top-0 w-full bg-pku-red text-white z-50 h-16 items-center justify-between px-6 shadow-md">
        {/* Left: Logo Area */}
        <div className="flex items-center gap-3 w-48 cursor-pointer" onClick={() => setView(ViewState.HOME)}>
          <img 
            src="/logo.png" 
            alt="PKU Lens Logo" 
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-xl font-bold tracking-tight font-serif">PKU Lens</h1>
        </div>

        {/* Center: Navigation Items */}
        <div className="flex gap-6 flex-1 justify-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium ${
                currentView === item.id 
                  ? 'bg-white text-pku-red shadow-sm' 
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right: User Profile Area */}
        <div className="flex items-center gap-4 w-48 justify-end relative">
          {isLoggedIn ? (
            <>
              {/* Notification Bell */}
              <button 
                className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
                onClick={handleNotifClick}
              >
                 <Bell className="w-5 h-5" />
                 {unreadCount > 0 && (
                   <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-pku-red"></span>
                 )}
              </button>

              {/* Notification Dropdown */}
              {showNotifMenu && (
                <>
                  <div className="fixed inset-0 z-40 cursor-default" onClick={() => setShowNotifMenu(false)}></div>
                  <div className="absolute top-14 right-10 bg-white text-gray-800 rounded-xl shadow-xl w-80 z-50 animate-fade-in border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <p className="text-sm font-bold text-gray-900">{isEnglish ? 'Notifications' : '消息通知'}</p>
                      <button onClick={() => setShowNotifMenu(false)}><X className="w-4 h-4 text-gray-400" /></button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => {
                              setView(ViewState.INTERACTION);
                              setShowNotifMenu(false);
                            }}
                          >
                            <p className="text-sm text-gray-700 leading-snug">{notif.content}</p>
                            <p className="text-xs text-gray-400 mt-1">{notif.timestamp}</p>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-gray-400 text-sm">
                          {isEnglish ? 'No notifications' : '暂无新消息'}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              {/* Profile Dropdown Trigger */}
              <div 
                className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-2 py-1 rounded-full transition-colors"
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifMenu(false); }}
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                   <span className="font-bold text-sm">{user.name.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium truncate max-w-[80px]">{user.name}</span>
              </div>

              {/* Profile Menu Dropdown */}
              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                  <div className="absolute top-12 right-0 bg-white text-gray-800 rounded-xl shadow-xl py-2 w-48 z-50 animate-fade-in border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-bold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <button 
                      onClick={() => { setView(ViewState.MY_ACTIVITIES); setShowProfileMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4" />
                      {isEnglish ? 'My Profile' : '个人中心'}
                    </button>
                    <button 
                      onClick={() => { onLogout(); setShowProfileMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      {isEnglish ? 'Logout' : '退出登录'}
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <button 
              onClick={() => setView(ViewState.LOGIN)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-pku-red rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all"
            >
              <LogIn className="w-4 h-4" />
              {isEnglish ? 'Sign In' : '登录'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                currentView === item.id ? 'text-pku-red' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon className={`w-5 h-5 ${currentView === item.id ? 'fill-current opacity-20' : ''}`} strokeWidth={currentView === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Mobile Top Logo Bar */}
      <div className="md:hidden fixed top-0 w-full bg-pku-red text-white z-50 h-14 flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center gap-2">
           <img 
            src="/logo.png" 
            alt="PKU Lens Logo" 
            className="h-8 w-8 object-contain"
          />
           <span className="font-bold font-serif text-lg">PKU Lens</span>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <button onClick={handleNotifClick} className="relative p-1">
                 <Bell className="w-5 h-5" />
                 {unreadCount > 0 && (
                   <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full border border-pku-red"></span>
                 )}
              </button>
              <div 
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
                onClick={() => setView(ViewState.MY_ACTIVITIES)}
              >
                 <UserIcon className="w-4 h-4" />
              </div>
            </>
          ) : (
            <button 
              onClick={() => setView(ViewState.LOGIN)}
              className="bg-white/20 p-1.5 rounded-full"
            >
              <LogIn className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Notification Drawer (Simplified as alert/modal style for now if open) */}
      {showNotifMenu && (
        <div className="md:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-16">
           <div className="bg-white w-[90%] rounded-xl shadow-2xl overflow-hidden max-h-[60vh] flex flex-col">
             <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-900">{isEnglish ? 'Notifications' : '消息通知'}</h3>
                <button onClick={() => setShowNotifMenu(false)}><X className="w-5 h-5 text-gray-500" /></button>
             </div>
             <div className="overflow-y-auto p-2">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className="p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg active:bg-gray-100"
                      onClick={() => {
                        setView(ViewState.INTERACTION);
                        setShowNotifMenu(false);
                      }}
                    >
                      <p className="text-sm text-gray-800">{notif.content}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.timestamp}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-400 text-sm">
                    {isEnglish ? 'No notifications' : '暂无新消息'}
                  </div>
                )}
             </div>
           </div>
        </div>
      )}
    </>
  );
};