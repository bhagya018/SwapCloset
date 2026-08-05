'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Smile, ArrowLeftRight, Search } from 'lucide-react';

interface SwapRequest {
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

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: {
    id: string;
    text: string;
    fromMe?: boolean;
    time?: string;
    isSwapRequest?: boolean;
    listingTitle?: string;
  }[];
}

export default function ChatWindow() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      name: 'Maya Alvarez',
      avatar: 'MA',
      lastMessage: 'Yes — it is! Where are you located?',
      time: '10:06',
      unread: 0,
      messages: [
        { id: 'm1', text: 'Hi! Is this still available?', fromMe: false, time: '10:04' },
        { id: 'm2', text: 'Yes — it is! Where are you located?', fromMe: true, time: '10:06' },
      ],
    },
  ]);
  const [activeConversation, setActiveConversation] = useState<string>('conv-1');
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const ref = useRef<HTMLDivElement | null>(null);

  // Load swap requests from localStorage and create conversations
  useEffect(() => {
    const loadSwapRequests = () => {
      try {
        const savedRequests = JSON.parse(localStorage.getItem('swapRequests') || '[]');

        if (savedRequests.length > 0) {
          // Group swap requests by owner
          const requestsByOwner: Record<string, SwapRequest[]> = {};
          savedRequests.forEach((req: SwapRequest) => {
            if (!requestsByOwner[req.ownerName]) {
              requestsByOwner[req.ownerName] = [];
            }
            requestsByOwner[req.ownerName].push(req);
          });

          // Create conversations from grouped requests
          const newConversations: Conversation[] = Object.entries(requestsByOwner).map(
            ([ownerName, requests]) => {
              const latestRequest = requests[requests.length - 1];
              const messages = requests.map((req: SwapRequest) => ({
                id: req.id,
                text: req.message,
                fromMe: true,
                time: new Date(req.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                isSwapRequest: true,
                listingTitle: req.listingTitle,
              }));

              return {
                id: `conv-${ownerName}`,
                name: ownerName,
                avatar: ownerName.substring(0, 2).toUpperCase(),
                lastMessage: latestRequest.message,
                time: new Date(latestRequest.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                unread: 0,
                messages,
              };
            }
          );

          // Sort conversations by latest message time (newest first)
          newConversations.sort((a, b) => {
            const aTime = new Date(a.time).getTime();
            const bTime = new Date(b.time).getTime();
            return bTime - aTime;
          });

          setConversations((prev) => {
            const existingIds = new Set(prev.map((c) => c.id));
            const newConvs = newConversations.filter((c) => !existingIds.has(c.id));
            return [...newConvs, ...prev];
          });

          // Set active conversation to first new one if none selected
          if (newConversations.length > 0 && !activeConversation) {
            setActiveConversation(newConversations[0].id);
          }
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
  }, [activeConversation]);

  const activeConv = conversations.find((c) => c.id === activeConversation);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' });
  }, [activeConv?.messages]);

  const send = () => {
    if (!input.trim() || !activeConv) return;
    const m = {
      id: Date.now().toString(),
      text: input.trim(),
      fromMe: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversation
          ? {
              ...conv,
              messages: [...conv.messages, m],
              lastMessage: input.trim(),
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : conv
      )
    );
    setInput('');
    setTyping(false);
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden max-w-4xl flex h-[500px]">
      {/* Conversations sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-600 text-foreground mb-3">Messages</h2>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-8">
              No conversations found
            </div>
          )}

          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-muted transition-colors border-l-2 ${
                activeConversation === conv.id
                  ? 'bg-primary/5 border-primary'
                  : 'border-transparent'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-primary text-xs font-700">{conv.avatar}</span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-600 text-foreground truncate">{conv.name}</span>
                  <span className="text-xs text-muted-foreground">{conv.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-600">{conv.unread}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {activeConv ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-xs font-700">{activeConv.avatar}</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-600 text-foreground">{activeConv.name}</div>
              <div className="text-xs text-muted-foreground">Active • Portland, OR</div>
            </div>
          </div>

          <div ref={ref} className="flex-1 p-4 overflow-y-auto space-y-3 bg-background">
            {activeConv.messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                No messages yet. Start a conversation!
              </div>
            )}

            {activeConv.messages.map((m) => (
              <div key={m.id} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`${m.fromMe ? 'bg-primary text-background' : 'bg-muted text-foreground'} rounded-lg px-3 py-2 text-sm max-w-[78%]`}
                >
                  {m.isSwapRequest && (
                    <div className="flex items-center gap-2 mb-1 text-xs font-600">
                      <ArrowLeftRight size={12} />
                      <span>Swap Request</span>
                    </div>
                  )}
                  {m.listingTitle && (
                    <div className="text-xs font-500 mb-1 opacity-90">Re: {m.listingTitle}</div>
                  )}
                  {m.text}
                  <div className="text-[10px] text-muted-foreground mt-1 text-right">{m.time}</div>
                </div>
              </div>
            ))}

            {typing && <div className="text-xs text-muted-foreground">Typing…</div>}
          </div>

          <div className="p-3 border-t border-border flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-muted transition-colors">
              <Smile size={18} />
            </button>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors">
              <Image size={18} alt="" />
            </button>
            <input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setTyping(Boolean(e.target.value));
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send();
              }}
              placeholder="Write a message…"
              className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none"
            />
            <button
              onClick={send}
              className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Send size={14} />
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Select a conversation to start messaging
        </div>
      )}
    </div>
  );
}
