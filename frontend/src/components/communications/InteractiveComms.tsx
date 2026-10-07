import React, { useState, useEffect } from 'react';
import {
  Mail,
  MessageSquare,
  Smartphone,
  PhoneCall,
  Send,
  Plus,
  CheckCheck,
  Clock,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  Paperclip,
  Sparkles,
  Search,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export function InteractiveComms() {
  const {
    emailThreads,
    sendEmailMessage,
    createEmailThread,
    whatsAppThreads,
    sendWhatsAppMessage,
    smsThreads,
    sendSmsMessage,
    callLogs,
    addCallLog,
    addToast,
  } = useCrm();

  const [channel, setChannel] = useState<'Email' | 'WhatsApp' | 'SMS' | 'Calls'>('Email');
  const [selectedEmailId, setSelectedEmailId] = useState(emailThreads[0]?.id || '');
  const [selectedWhatsAppId, setSelectedWhatsAppId] = useState(whatsAppThreads[0]?.id || '');
  const [selectedSmsId, setSelectedSmsId] = useState(smsThreads[0]?.id || '');

  // Message input states
  const [emailReplyText, setEmailReplyText] = useState('');
  const [whatsAppText, setWhatsAppText] = useState('');
  const [smsText, setSmsText] = useState('');

  // Compose new email modal/toggle
  const [isComposing, setIsComposing] = useState(false);
  const [newEmailForm, setNewEmailForm] = useState({ recipient: '', email: '', subject: '', body: '' });

  // Call simulator state
  const [activeCall, setActiveCall] = useState<{ customer: string; phone: string; seconds: number; isMuted: boolean } | null>(null);

  // Active call timer
  useEffect(() => {
    let interval: any;
    if (activeCall) {
      interval = setInterval(() => {
        setActiveCall((prev) => (prev ? { ...prev, seconds: prev.seconds + 1 } : null));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const activeEmailThread = emailThreads.find((t) => t.id === selectedEmailId) || emailThreads[0];
  const activeWhatsAppThread = whatsAppThreads.find((t) => t.id === selectedWhatsAppId) || whatsAppThreads[0];
  const activeSmsThread = smsThreads.find((t) => t.id === selectedSmsId) || smsThreads[0];

  const handleSendEmailReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailReplyText.trim() || !activeEmailThread) return;
    sendEmailMessage(activeEmailThread.id, emailReplyText);
    setEmailReplyText('');
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsAppText.trim() || !activeWhatsAppThread) return;
    sendWhatsAppMessage(activeWhatsAppThread.id, whatsAppText);
    setWhatsAppText('');
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsText.trim() || !activeSmsThread) return;
    sendSmsMessage(activeSmsThread.id, smsText);
    setSmsText('');
  };

  const handleStartCall = (customer: string, phone: string) => {
    setActiveCall({ customer, phone, seconds: 0, isMuted: false });
    addToast({ title: 'Call Connected', description: `Live audio channel with ${customer}`, variant: 'info' });
  };

  const handleEndCall = () => {
    if (!activeCall) return;
    const mins = Math.floor(activeCall.seconds / 60);
    const secs = activeCall.seconds % 60;
    const duration = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    addCallLog({
      customer: activeCall.customer,
      phone: activeCall.phone,
      direction: 'Outgoing',
      status: 'Completed',
      duration,
      recording: 'Saved',
      date: 'Just now',
    });
    setActiveCall(null);
    addToast({ title: 'Call Logged', description: `Completed in ${duration}. Audio snippet saved.`, variant: 'success' });
  };

  const applyEmailTemplate = (template: string) => {
    setEmailReplyText(template);
  };

  return (
    <div className="space-y-6">
      {/* Top Channels Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-white/[0.06]">
          {[
            { id: 'Email', label: 'Email Threads', icon: Mail, badge: emailThreads.length },
            { id: 'WhatsApp', label: 'WhatsApp', icon: MessageSquare, badge: whatsAppThreads.length },
            { id: 'SMS', label: 'SMS Carrier', icon: Smartphone, badge: smsThreads.length },
            { id: 'Calls', label: 'VoIP & Calls', icon: PhoneCall, badge: callLogs.length },
          ].map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setChannel(id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                channel === id
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 font-mono">
                {badge}
              </span>
            </button>
          ))}
        </div>

        {channel === 'Email' && (
          <button
            onClick={() => setIsComposing((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> {isComposing ? 'Close Composer' : 'Compose Email'}
          </button>
        )}
      </div>

      {/* Active Call Floating Banner */}
      {activeCall && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center animate-pulse">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">Active Live Call</p>
              <p className="text-sm font-semibold">{activeCall.customer} ({activeCall.phone})</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right font-mono font-bold text-sm bg-black/20 px-3 py-1 rounded-lg">
              {String(Math.floor(activeCall.seconds / 60)).padStart(2, '0')}:
              {String(activeCall.seconds % 60).padStart(2, '0')}
            </div>

            <button
              onClick={() => setActiveCall({ ...activeCall, isMuted: !activeCall.isMuted })}
              className={`p-2 rounded-xl text-white transition ${
                activeCall.isMuted ? 'bg-amber-500' : 'bg-white/20 hover:bg-white/30'
              }`}
              title={activeCall.isMuted ? 'Unmute' : 'Mute'}
            >
              {activeCall.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={handleEndCall}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition shadow-sm"
            >
              <PhoneOff className="w-4 h-4" /> End Call
            </button>
          </div>
        </div>
      )}

      {/* CHANNEL 1: EMAIL */}
      {channel === 'Email' && (
        <div>
          {isComposing && (
            <div className="mb-6 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/[0.08] shadow-sm animate-scale-up space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/[0.06]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  New Outbound Email Draft
                </h4>
                <button onClick={() => setIsComposing(false)} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={newEmailForm.recipient}
                  onChange={(e) => setNewEmailForm({ ...newEmailForm, recipient: e.target.value })}
                  placeholder="Recipient Name (e.g. Sophia Nguyen)"
                  className="text-xs rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                />
                <input
                  value={newEmailForm.email}
                  onChange={(e) => setNewEmailForm({ ...newEmailForm, email: e.target.value })}
                  placeholder="Email Address (e.g. sophia@northstarlabs.ai)"
                  className="text-xs rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                />
              </div>

              <input
                value={newEmailForm.subject}
                onChange={(e) => setNewEmailForm({ ...newEmailForm, subject: e.target.value })}
                placeholder="Subject Line"
                className="w-full text-xs rounded-xl px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
              />

              <textarea
                rows={4}
                value={newEmailForm.body}
                onChange={(e) => setNewEmailForm({ ...newEmailForm, body: e.target.value })}
                placeholder="Write your email body or select a template..."
                className="w-full text-xs rounded-xl p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
              />

              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2 text-[11px] text-slate-400">
                  <button
                    type="button"
                    onClick={() => setNewEmailForm((prev) => ({ ...prev, body: 'Hi,\n\nFollowing up on our recent demonstration. Attached is the revised enterprise proposal for your team to review.\n\nBest regards,\nSales Operations' }))}
                    className="hover:text-blue-500 underline"
                  >
                    Template: Proposal Follow-up
                  </button>
                </div>
                <button
                  onClick={() => {
                    if (newEmailForm.recipient && newEmailForm.subject && newEmailForm.body) {
                      createEmailThread(newEmailForm.recipient, newEmailForm.email, newEmailForm.subject, newEmailForm.body);
                      setIsComposing(false);
                      setNewEmailForm({ recipient: '', email: '', subject: '', body: '' });
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Send Email
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.9fr] gap-4">
            {/* Thread list */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col h-[560px]">
              <div className="p-3.5 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-slate-950/40">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Inbox Conversations</p>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-white/[0.05] overflow-y-auto flex-1">
                {emailThreads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedEmailId(thread.id)}
                    className={`w-full p-4 text-left transition flex flex-col gap-1.5 ${
                      selectedEmailId === thread.id
                        ? 'bg-blue-50/70 dark:bg-blue-950/30 border-l-4 border-blue-500'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900 dark:text-white truncate">{thread.customer}</span>
                      <span className="text-[10px] text-slate-400">{thread.time}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{thread.subject}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{thread.preview}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Email Reader & Reply Composer */}
            {activeEmailThread && (
              <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900 shadow-sm flex flex-col h-[560px]">
                {/* Header */}
                <div className="p-4 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-slate-950/40 flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{activeEmailThread.subject}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Between you and <span className="font-semibold text-slate-800 dark:text-slate-200">{activeEmailThread.customer}</span> ({activeEmailThread.email})
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20">
                    {activeEmailThread.status}
                  </span>
                </div>

                {/* Message Bubble Feed */}
                <div className="p-4 overflow-y-auto flex-1 space-y-3.5 bg-slate-50/20 dark:bg-slate-950/20">
                  {activeEmailThread.messages.map((msg) => {
                    const isMe = msg.sender === 'me';
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/70 dark:border-white/[0.08] rounded-bl-none shadow-sm'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Composer */}
                <form onSubmit={handleSendEmailReply} className="p-3.5 border-t border-slate-100 dark:border-white/[0.06] bg-white dark:bg-slate-900 space-y-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => applyEmailTemplate('Thank you for confirming! I have locked in this pricing structure for your team.')}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-500"
                    >
                      + Quick Acceptance
                    </button>
                    <button
                      type="button"
                      onClick={() => applyEmailTemplate('Would tomorrow at 3:00 PM EST work for a brief 15-minute walkthrough?')}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-500"
                    >
                      + Propose Meeting
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      value={emailReplyText}
                      onChange={(e) => setEmailReplyText(e.target.value)}
                      placeholder="Type a reply to this thread..."
                      className="flex-1 text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition flex items-center gap-1.5 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" /> Send Reply
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHANNEL 2: WHATSAPP */}
      {channel === 'WhatsApp' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.9fr] gap-4">
          <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900 overflow-hidden shadow-sm h-[540px] flex flex-col">
            <div className="p-3.5 border-b border-slate-100 dark:border-white/[0.06] bg-emerald-500/10">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">WhatsApp Business Accounts</p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/[0.05] overflow-y-auto flex-1">
              {whatsAppThreads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedWhatsAppId(thread.id)}
                  className={`w-full p-4 text-left transition flex flex-col gap-1 ${
                    selectedWhatsAppId === thread.id
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-l-4 border-emerald-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{thread.customer}</span>
                    <span className="text-[10px] text-slate-400">{thread.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{thread.phone}</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-1">{thread.lastMessage}</p>
                </button>
              ))}
            </div>
          </div>

          {activeWhatsAppThread && (
            <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900 shadow-sm flex flex-col h-[540px]">
              <div className="p-3.5 border-b border-slate-100 dark:border-white/[0.06] bg-emerald-600 text-white flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold">{activeWhatsAppThread.customer}</h4>
                  <p className="text-[10px] text-emerald-100">{activeWhatsAppThread.phone} • Online</p>
                </div>
                <button
                  onClick={() => handleStartCall(activeWhatsAppThread.customer, activeWhatsAppThread.phone)}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition text-xs flex items-center gap-1 font-semibold"
                >
                  <Phone className="w-3.5 h-3.5" /> Call via WhatsApp
                </button>
              </div>

              {/* Chat Canvas */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#e5ddd5]/30 dark:bg-slate-950/50">
                {activeWhatsAppThread.messages.map((msg) => {
                  const isMe = msg.sender === 'me';
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`max-w-[75%] p-3 rounded-xl text-xs shadow-sm ${
                          isMe
                            ? 'bg-[#d9fdd3] dark:bg-emerald-900 text-slate-900 dark:text-emerald-100 rounded-br-none'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                          <span>{msg.time}</span>
                          {isMe && <CheckCheck className="w-3 h-3 text-blue-500" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* WhatsApp Input */}
              <form onSubmit={handleSendWhatsApp} className="p-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-2">
                <input
                  value={whatsAppText}
                  onChange={(e) => setWhatsAppText(e.target.value)}
                  placeholder="Type a WhatsApp message..."
                  className="flex-1 text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* CHANNEL 3: SMS */}
      {channel === 'SMS' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.9fr] gap-4">
          <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900 overflow-hidden shadow-sm h-[500px]">
            <div className="p-3.5 border-b border-slate-100 dark:border-white/[0.06] bg-amber-500/10">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">SMS Outbound Gateway</p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {smsThreads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedSmsId(thread.id)}
                  className={`w-full p-4 text-left transition flex flex-col gap-1 ${
                    selectedSmsId === thread.id
                      ? 'bg-amber-50/60 dark:bg-amber-950/30 border-l-4 border-amber-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{thread.customer}</span>
                    <span className="text-[10px] text-slate-400">{thread.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{thread.lastMessage}</p>
                </button>
              ))}
            </div>
          </div>

          {activeSmsThread && (
            <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900 shadow-sm flex flex-col h-[500px]">
              <div className="p-3.5 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{activeSmsThread.customer}</h4>
                  <p className="text-[10px] text-slate-400">{activeSmsThread.phone} • Carrier: Verizon/Twilio</p>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/20 dark:bg-slate-950/20">
                {activeSmsThread.messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                        msg.sender === 'me'
                          ? 'bg-amber-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08] rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendSms} className="p-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-2">
                <input
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  placeholder="Type an SMS text message..."
                  className="flex-1 text-xs rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Send SMS
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* CHANNEL 4: PHONE CALL LOGS & VOIP SIMULATOR */}
      {channel === 'Calls' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  VoIP Call History & Session Logs
                </h3>
                <p className="text-[11px] text-slate-400">Click any customer to simulate an active real-time VoIP connection.</p>
              </div>
            </div>

            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-white/[0.06] text-slate-500 font-semibold">
                <tr>
                  <th className="px-4 py-3">Customer Contact</th>
                  <th className="px-4 py-3">Phone Line</th>
                  <th className="px-4 py-3">Direction</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Call Status</th>
                  <th className="px-4 py-3">Recording</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                {callLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{log.customer}</td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{log.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        log.direction === 'Incoming'
                          ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300'
                          : 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-300'
                      }`}>
                        {log.direction}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-700 dark:text-slate-300">{log.duration}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        log.status === 'Completed'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
                          : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-300'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-[11px]">{log.recording}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleStartCall(log.customer, log.phone)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
                      >
                        <Phone className="w-3 h-3" /> Dial Customer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
