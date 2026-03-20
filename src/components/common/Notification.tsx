import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Notification() {
  const { notification, clearNotification } = useStore();

  if (!notification) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
  };

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${colors[notification.type]}`}>
        <span className={iconColors[notification.type]}>
          {icons[notification.type]}
        </span>
        <p className="text-sm font-medium">{notification.message}</p>
        <button
          onClick={clearNotification}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
