'use client';
import React, { useState } from 'react';
import {
  Bell,
  ArrowLeftRight,
  MessageSquare,
  Heart,
  Check,
  X,
  Clock,
  CheckCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  type:
    | 'swap_request'
    | 'swap_accepted'
    | 'swap_rejected'
    | 'new_message'
    | 'item_favorited'
    | 'swap_completed';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
  listingId?: string;
}

export default function NotificationsClient() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'swap_request',
      title: 'New swap request',
      message: "Sarah Chen wants to swap her Zara Floral Dress for your Vintage Levi's Jeans",
      time: '2 hours ago',
      read: false,
      actionUrl: '/swap-requests',
      listingId: 'mylisting-001',
    },
    {
      id: '2',
      type: 'swap_accepted',
      title: 'Swap request accepted!',
      message: 'James Wilson accepted your swap request for Nike Air Max 90',
      time: '5 hours ago',
      read: false,
      actionUrl: '/swap-requests',
      listingId: 'mylisting-003',
    },
    {
      id: '3',
      type: 'new_message',
      title: 'New message from Maya Alvarez',
      message: 'Hey! I can meet you downtown this Saturday if that works for you?',
      time: '1 day ago',
      read: true,
      actionUrl: '/messages',
    },
    {
      id: '4',
      type: 'item_favorited',
      title: 'Your item was favorited',
      message: 'Emily Roberts saved your Vintage Denim Jacket to her favorites',
      time: '2 days ago',
      read: true,
      listingId: 'mylisting-002',
    },
    {
      id: '5',
      type: 'swap_completed',
      title: 'Swap completed!',
      message:
        "You successfully completed a swap with Alex Thompson. Don't forget to leave a review!",
      time: '3 days ago',
      read: true,
      actionUrl: '/swap-requests',
      listingId: 'mylisting-005',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    if (notification.listingId) {
      router.push(`/listings/${notification.listingId}`);
    } else if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'swap_request':
        return <ArrowLeftRight size={18} className="text-primary" />;
      case 'swap_accepted':
        return <Check size={18} className="text-positive" />;
      case 'swap_rejected':
        return <X size={18} className="text-negative" />;
      case 'new_message':
        return <MessageSquare size={18} className="text-info" />;
      case 'item_favorited':
        return <Heart size={18} className="text-accent" />;
      case 'swap_completed':
        return <CheckCheck size={18} className="text-positive" />;
      default:
        return <Bell size={18} className="text-muted-foreground" />;
    }
  };

  const getNotificationVariant = (type: Notification['type']): string => {
    switch (type) {
      case 'swap_request':
        return 'pending';
      case 'swap_accepted':
        return 'active';
      case 'swap_rejected':
        return 'rejected';
      case 'swap_completed':
        return 'completed';
      default:
        return 'default';
    }
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-700 text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-accent text-accent-foreground text-[10px] font-700 px-2 py-0.5 rounded-full tabular-nums">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-sm font-500 text-primary hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="You'll see updates about swap requests, messages, and activity here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`bg-card rounded-2xl border p-4 transition-all duration-150 hover:shadow-card cursor-pointer ${
                !notification.read ? 'border-primary/30 bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-600 text-foreground">{notification.title}</span>
                      <Badge variant={getNotificationVariant(notification.type)}>
                        {notification.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                      <Clock size={11} />
                      <span className="text-[11px]">{notification.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  {notification.actionUrl && (
                    <button className="mt-2 text-xs font-500 text-primary hover:underline">
                      View details →
                    </button>
                  )}
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
