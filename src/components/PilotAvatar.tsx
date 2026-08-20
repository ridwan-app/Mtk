import React from 'react';

interface PilotAvatarProps {
  avatarPhoto?: string;
  avatarIcon?: string;
  altName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PilotAvatar: React.FC<PilotAvatarProps> = ({
  avatarPhoto,
  avatarIcon = '🧑‍✈️',
  altName = 'Pilot Cilik',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-7 h-7 text-sm rounded-lg',
    sm: 'w-9 h-9 sm:w-10 sm:h-10 text-xl sm:text-2xl rounded-xl',
    md: 'w-12 h-12 text-2xl rounded-2xl',
    lg: 'w-16 h-16 sm:w-20 sm:h-20 text-3xl sm:text-4xl rounded-2xl',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 text-4xl sm:text-5xl rounded-3xl',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden bg-amber-100 border-2 border-amber-300 shadow-xs select-none ${sizeClasses[size]} ${className}`}
    >
      {avatarPhoto ? (
        <img
          src={avatarPhoto}
          alt={altName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="leading-none">{avatarIcon}</span>
      )}
    </div>
  );
};
