
import React from 'react';
import { Activity, UserRole } from '../types';
import { MapPin, Calendar, Heart, Hourglass } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  userRole: UserRole;
  isEnglish: boolean;
  onViewDetail: (id: string) => void;
  isJoined: boolean;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  userRole, 
  isEnglish, 
  onViewDetail,
  isJoined,
  isSaved,
  onToggleSave
}) => {
  const displayTitle = (isEnglish && activity.titleEn) ? activity.titleEn : activity.title;
  const isRegistrationOpen = activity.status === 'registering';
  const isWalkIn = activity.registrationDeadline === '无需报名';

  const getDeadlineText = () => {
      if (isWalkIn) {
          return isEnglish ? 'Walk-in' : '无需报名';
      }
      return (isEnglish ? 'Deadline: ' : '截止: ') + activity.registrationDeadline;
  };
  
  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 relative h-32 group cursor-pointer"
      onClick={() => onViewDetail(activity.id)}
    >
      <div className="flex h-full">
        {/* Left: Image - Fixed Size */}
        <div className="w-32 h-full flex-shrink-0 bg-gray-100 relative">
          <img 
            src={activity.image} 
            alt={displayTitle} 
            className={`w-full h-full object-cover ${!isRegistrationOpen ? 'grayscale' : ''}`}
          />
          {!isRegistrationOpen && (
             <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
               <span className="text-white text-xs font-bold uppercase border border-white px-2 py-0.5 rounded">
                  {isEnglish ? 'Closed' : '已截止'}
               </span>
             </div>
          )}
        </div>
        
        {/* Right: Content */}
        <div className="flex-grow p-3 flex flex-col min-w-0 relative">
          
          {/* Title Area */}
          <div className="pr-8"> 
            <h3 className={`font-bold text-sm md:text-base line-clamp-2 leading-snug group-hover:text-pku-red transition-colors ${!isRegistrationOpen ? 'text-gray-500' : 'text-gray-900'}`}>
              {displayTitle}
            </h3>
          </div>

          {/* Metadata Row */}
          <div className="mt-2 flex flex-col gap-1 text-xs text-gray-500">
             <div className="flex items-center gap-2">
                <span className="bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 text-pku-red/80 font-medium truncate max-w-[80px]">
                  {activity.category}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{activity.date}</span>
                </div>
             </div>
             
             {/* Registration Deadline Info */}
             <div className="flex items-center gap-1 text-xs">
                <Hourglass className={`w-3.5 h-3.5 ${isRegistrationOpen ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={isRegistrationOpen ? 'text-green-700 font-medium' : 'text-gray-400'}>
                   {getDeadlineText()}
                </span>
             </div>
          </div>

          {/* Absolute Positioned Actions */}
          
          {/* Top Right: Save Heart */}
          {onToggleSave && (
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleSave(activity.id); }}
              className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors z-10 ${
                isSaved 
                  ? 'text-pku-red bg-red-50' 
                  : 'text-gray-400 hover:text-pku-red hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}

          {/* Bottom Right: Status Button */}
          <div className="absolute bottom-3 right-3">
             <button 
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                isJoined 
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : isRegistrationOpen
                    ? 'bg-pku-red text-white shadow-sm hover:shadow'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isJoined 
                ? (isEnglish ? 'Joined' : '已报名') 
                : !isRegistrationOpen
                   ? (isEnglish ? 'Closed' : '已截止')
                   : (isEnglish ? 'Details' : '去报名')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
