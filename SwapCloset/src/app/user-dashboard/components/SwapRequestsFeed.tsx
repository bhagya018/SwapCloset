'use client';
import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  MessageSquare,
  Check,
  X,
  ChevronRight,
  Clock,
  Eye,
  MapPin,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { SWAP_REQUESTS, SwapRequest } from './dashboardData';
import { useRouter } from 'next/navigation';

const STATUS_VARIANT_MAP: Record<string, string> = {
  pending: 'pending',
  accepted: 'active',
  rejected: 'rejected',
  completed: 'completed',
  negotiating: 'negotiating',
};

interface LocalSwapRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  ownerName: string;
  message: string;
  status: string;
  createdAt: string;
  offeringValue?: number;
  theirValue?: number;
}

export default function SwapRequestsFeed() {
  const router = useRouter();
  const [requests, setRequests] = useState<SwapRequest[]>(SWAP_REQUESTS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
  const [meetupModalOpen, setMeetupModalOpen] = useState(false);
  const [selectedMeetup, setSelectedMeetup] = useState<SwapRequest | null>(null);

  const handleViewListing = (listingId: string) => {
    router.push(`/listings/${listingId}`);
  };

  const handleViewMeetupDetails = (req: SwapRequest) => {
    setSelectedMeetup(req);
    setMeetupModalOpen(true);
  };

  // Load swap requests from localStorage
  useEffect(() => {
    const loadSwapRequests = () => {
      try {
        const savedRequests = JSON.parse(localStorage.getItem('swapRequests') || '[]');

        if (savedRequests.length > 0) {
          // Convert localStorage requests to SwapRequest format
          const convertedRequests: SwapRequest[] = savedRequests.map((req: LocalSwapRequest) => ({
            id: req.id,
            type: 'outgoing',
            otherUserName: req.ownerName,
            otherUserAvatar: req.ownerName.substring(0, 2).toUpperCase(),
            otherUserCity: 'Unknown',
            theirItem: req.listingTitle,
            theirItemValue: req.theirValue || 50,
            myItem: 'Your item',
            myItemValue: req.offeringValue || 50,
            status: req.status as SwapRequest['status'],
            statusLabel: req.status === 'pending' ? 'Pending' : req.status,
            sentDaysAgo: Math.floor(
              (Date.now() - new Date(req.createdAt).getTime()) / (1000 * 60 * 60 * 24)
            ),
            lastMessage: req.message,
            listingId: req.listingId,
          }));

          // Sort by creation date (newest first)
          convertedRequests.sort((a, b) => {
            const aTime = new Date(a.id.replace('swap-', '')).getTime();
            const bTime = new Date(b.id.replace('swap-', '')).getTime();
            return bTime - aTime;
          });

          setRequests([...convertedRequests, ...SWAP_REQUESTS]);
        }
      } catch (error) {
        console.error('Error loading swap requests:', error);
      }
    };

    loadSwapRequests();
    const handleStorageChange = () => loadSwapRequests();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('swapRequestsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('swapRequestsUpdated', handleStorageChange);
    };
  }, []);

  const filtered = requests.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.type === activeFilter;
  });

  const handleAccept = (req: SwapRequest) => {
    // BACKEND INTEGRATION: PATCH /api/swap-requests/:id with { status: 'accepted' }
    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id ? { ...r, status: 'accepted', statusLabel: 'Accepted — confirm meetup' } : r
      )
    );
    toast.success(
      `Swap accepted with ${req.otherUserName}! Send them a message to arrange the exchange.`
    );
  };

  const handleDecline = (req: SwapRequest) => {
    // BACKEND INTEGRATION: PATCH /api/swap-requests/:id with { status: 'rejected' }
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'rejected', statusLabel: 'Declined' } : r))
    );
    toast.info(`Swap request from ${req.otherUserName} declined`);
  };

  const handleConfirmMeetup = (req: SwapRequest) => {
    // BACKEND INTEGRATION: PATCH /api/swap-requests/:id with { status: 'completed' }
    setRequests((prev) =>
      prev.map((r) =>
        r.id === req.id ? { ...r, status: 'completed', statusLabel: 'Completed' } : r
      )
    );
    toast.success(`Meetup confirmed with ${req.otherUserName}!`);
  };

  const incomingPending = requests.filter(
    (r) => r.type === 'incoming' && r.status === 'pending'
  ).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-600 text-foreground">Swap Requests</h3>
          {incomingPending > 0 && (
            <span className="bg-accent text-accent-foreground text-[10px] font-700 px-2 py-0.5 rounded-full tabular-nums">
              {incomingPending} pending
            </span>
          )}
        </div>
        <div className="flex bg-muted rounded-lg p-0.5">
          {(['all', 'incoming', 'outgoing'] as const).map((tab) => (
            <button
              key={`req-tab-${tab}`}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-500 transition-all duration-150 capitalize ${
                activeFilter === tab
                  ? 'bg-card text-foreground shadow-card'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-card rounded-2xl border border-border p-8 text-center">
            <ArrowLeftRight size={24} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No {activeFilter !== 'all' ? activeFilter : ''} swap requests yet
            </p>
          </div>
        )}

        {filtered.map((req) => (
          <div
            key={req.id}
            className={`bg-card rounded-2xl border p-4 transition-all duration-150 hover:shadow-card ${
              req.status === 'pending' && req.type === 'incoming'
                ? 'border-warning/40 bg-warning/5'
                : 'border-border'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-primary text-xs font-700">{req.otherUserAvatar}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-600 text-foreground">{req.otherUserName}</span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full capitalize">
                      {req.type}
                    </span>
                    <Badge variant={STATUS_VARIANT_MAP[req.status]}>{req.statusLabel}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                    <Clock size={11} />
                    <span className="text-[11px]">{req.sentDaysAgo}d ago</span>
                  </div>
                </div>

                {/* Swap items */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {req.listingId ? (
                    <button
                      onClick={() => req.listingId && handleViewListing(req.listingId)}
                      className="text-xs bg-muted px-2.5 py-1 rounded-lg text-foreground font-500 truncate max-w-[160px] hover:bg-muted/80 transition-colors cursor-pointer"
                    >
                      {req.type === 'incoming' ? req.theirItem : req.myItem}
                    </button>
                  ) : (
                    <span className="text-xs bg-muted px-2.5 py-1 rounded-lg text-foreground font-500 truncate max-w-[160px]">
                      {req.type === 'incoming' ? req.theirItem : req.myItem}
                    </span>
                  )}
                  <ArrowLeftRight size={12} className="text-muted-foreground shrink-0" />
                  <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-lg font-500 truncate max-w-[160px]">
                    {req.type === 'incoming' ? req.myItem : req.theirItem}
                  </span>
                  {/* Value comparison */}
                  <span
                    className={`text-[11px] font-500 px-2 py-0.5 rounded-full tabular-nums ${
                      Math.abs(req.theirItemValue - req.myItemValue) > 25
                        ? 'bg-warning/15 text-warning'
                        : 'bg-positive/10 text-positive'
                    }`}
                  >
                    ${req.theirItemValue} ↔ ${req.myItemValue}
                  </span>
                </div>

                {/* Last message */}
                <p className="text-xs text-muted-foreground line-clamp-1 mb-3">
                  &ldquo;{req.lastMessage}&rdquo;
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <a
                    href="/messages"
                    className="flex items-center gap-1.5 text-xs font-500 text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted"
                  >
                    <MessageSquare size={13} />
                    Message
                  </a>
                  {req.status === 'pending' && req.type === 'incoming' && (
                    <>
                      <button
                        onClick={() => handleDecline(req)}
                        className="flex items-center gap-1.5 text-xs font-500 text-negative px-3 py-1.5 rounded-lg bg-negative/10 hover:bg-negative/20 transition-colors"
                      >
                        <X size={13} />
                        Decline
                      </button>
                      <button
                        onClick={() => handleAccept(req)}
                        className="flex items-center gap-1.5 text-xs font-600 btn-primary px-3 py-1.5 rounded-lg"
                      >
                        <Check size={13} />
                        Accept
                      </button>
                    </>
                  )}
                  {req.status === 'accepted' && (
                    <button
                      onClick={() => handleConfirmMeetup(req)}
                      className="flex items-center gap-1.5 text-xs font-600 text-info px-3 py-1.5 rounded-lg bg-info/10 hover:bg-info/20 transition-colors"
                    >
                      <ChevronRight size={13} />
                      Confirm Meetup
                    </button>
                  )}
                  {req.status === 'completed' && (
                    <button
                      onClick={() => handleViewMeetupDetails(req)}
                      className="flex items-center gap-1.5 text-xs font-600 text-positive px-3 py-1.5 rounded-lg bg-positive/10 hover:bg-positive/20 transition-colors"
                    >
                      <Eye size={13} />
                      View Meetup
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Meetup Details Modal */}
      <Modal
        open={meetupModalOpen}
        onClose={() => setMeetupModalOpen(false)}
        title="Meetup Details"
        maxWidth="max-w-md"
      >
        {selectedMeetup && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-sm font-700">
                  {selectedMeetup.otherUserAvatar}
                </span>
              </div>
              <div>
                <p className="text-sm font-600 text-foreground">{selectedMeetup.otherUserName}</p>
                <p className="text-xs text-muted-foreground">{selectedMeetup.otherUserCity}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border">
                <MapPin size={18} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Meetup Location</p>
                  <p className="text-sm font-600 text-foreground">Portland, OR - Downtown Area</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border">
                <Calendar size={18} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Scheduled Date</p>
                  <p className="text-sm font-600 text-foreground">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-2">Items to Exchange</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-muted px-2.5 py-1 rounded-lg text-foreground font-500">
                    {selectedMeetup.theirItem}
                  </span>
                  <ArrowLeftRight size={12} className="text-muted-foreground" />
                  <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-lg font-500">
                    {selectedMeetup.myItem}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href="/messages"
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-600 text-foreground hover:bg-muted transition-colors flex items-center justify-center"
              >
                <MessageSquare size={16} className="mr-2" />
                Message
              </a>
              <button
                onClick={() => setMeetupModalOpen(false)}
                className="flex-1 btn-primary py-2.5 rounded-xl text-sm font-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
