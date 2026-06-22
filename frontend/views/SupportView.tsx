import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User as UserIcon, Sparkles, Loader2, Ticket as TicketIcon, PhoneCall, Mail, ChevronRight, Plus, X } from 'lucide-react';
import { ChatMessage, Ticket, TicketMessage } from '../types';
import { generateChatResponse } from '../services/geminiService';

interface SupportViewProps {
  onBack: () => void;
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}

const FAQ_SUGGESTIONS = [
  { q: "Where is my refund?", a: "Refunds for cancelled orders or rides are processed immediately from our end. It usually takes 3-5 business days to reflect in your original payment method depending on your bank." },
  { q: "How to cancel a ride?", a: "You can cancel a ride by going to the 'Activity' tab, selecting your ongoing ride, and tapping the 'Cancel Ride' button at the bottom. Note that cancellation fees may apply if the driver has already arrived." },
  { q: "Report an issue with food order", a: "To report an issue with your food order, go to the 'Activity' tab, select the specific order, and tap 'Report Issue'. You can then select the exact problem (e.g., missing item, cold food) and we will assist you immediately." }
];

export const SupportView: React.FC<SupportViewProps> = ({ onBack, tickets, setTickets }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'tickets' | 'contact'>('chat');
  
  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hi! I'm Chalo Support AI. How can I help you today? You can ask me about your recent orders, refunds, or app features.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Ticket State
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicketCategory, setNewTicketCategory] = useState('Rides');
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketDesc, setNewTicketDesc] = useState('');
  const [ticketReply, setTicketReply] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === 'chat' || selectedTicket) {
      scrollToBottom();
    }
  }, [messages, isLoading, activeTab, selectedTicket]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textOverride) setInput('');
    setIsLoading(true);

    // Check if it's a predefined FAQ
    const faqMatch = FAQ_SUGGESTIONS.find(faq => faq.q.toLowerCase() === textToSend.toLowerCase());
    
    if (faqMatch) {
      setTimeout(() => {
        const modelMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: faqMatch.a,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, modelMsg]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    // Otherwise, use Gemini API
    try {
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const supportPrompt = `User is asking a support question: ${textToSend}. Provide a helpful, concise answer as Chalo Support AI.`;
      const responseText = await generateChatResponse(supportPrompt, history);

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm currently experiencing high traffic and cannot process your request. Please try again later or raise a ticket in the 'My Tickets' tab.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle.trim() || !newTicketDesc.trim()) return;

    const newTicket: Ticket = {
      id: `TKT-${Math.floor(Math.random() * 9000 + 1000)}`,
      title: newTicketTitle,
      category: newTicketCategory,
      status: 'Open',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'user',
          text: newTicketDesc,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setTickets([newTicket, ...tickets]);
    setShowNewTicketModal(false);
    setNewTicketTitle('');
    setNewTicketDesc('');
    setNewTicketCategory('Rides');
    alert('Ticket raised successfully!');
  };

  const handleReplyTicket = () => {
    if (!ticketReply.trim() || !selectedTicket) return;

    const newMessage: TicketMessage = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: ticketReply.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage]
    };

    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
    setTicketReply('');
  };

  return (
    <div className="flex flex-col h-screen bg-white relative font-sans">
      {/* Header */}
      <div className="bg-slate-950 pt-12 pb-4 px-4 shadow-sm sticky top-0 z-20 border-b border-slate-900 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-800 active:bg-slate-700 transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="font-bold text-xl text-white">Help & Support</h1>
            <p className="text-xs font-medium text-slate-400">We are here to help you 24/7</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => { setActiveTab('chat'); setSelectedTicket(null); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'chat' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Support Chat
          </button>
          <button 
            onClick={() => { setActiveTab('tickets'); setSelectedTicket(null); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'tickets' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            My Tickets
          </button>
          <button 
            onClick={() => { setActiveTab('contact'); setSelectedTicket(null); }}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'contact' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative bg-slate-50">
        
        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-brand-600 text-white rounded-tr-sm' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    <span className={`text-[10px] mt-1.5 block font-medium ${msg.role === 'user' ? 'text-brand-200' : 'text-slate-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-5 h-5 text-brand-600 animate-spin" />
                    <span className="text-sm font-medium text-slate-500">AI is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-safe z-20">
              {/* Suggestions */}
              {messages.length < 3 && (
                <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-3 pb-1">
                  {FAQ_SUGGESTIONS.map((sug, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleSend(sug.q)}
                      className="bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap hover:bg-slate-100 transition-colors"
                    >
                      {sug.q}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your issue here..."
                  className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[40px] py-2.5 px-3 text-sm outline-none text-slate-800 font-medium"
                  rows={1}
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className={`p-3 rounded-xl flex-shrink-0 transition-colors ${
                    input.trim() && !isLoading ? 'bg-brand-600 text-white shadow-md hover:bg-brand-700' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && !selectedTicket && (
          <div className="p-4 h-full overflow-y-auto pb-24">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-slate-900">Recent Tickets</h2>
              <button 
                onClick={() => setShowNewTicketModal(true)}
                className="text-brand-600 text-sm font-bold flex items-center gap-1 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100"
              >
                <Plus className="w-4 h-4" /> Raise New
              </button>
            </div>

            <div className="space-y-4">
              {tickets.map(ticket => (
                <div key={ticket.id} className={`bg-white rounded-2xl p-4 border border-slate-200 shadow-sm ${ticket.status === 'Resolved' ? 'opacity-70' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                      ticket.status === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {ticket.status}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">#{ticket.id}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1">{ticket.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">Raised on {ticket.date} • {ticket.category}</p>
                  <button 
                    onClick={() => setSelectedTicket(ticket)}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors border border-slate-200"
                  >
                    View Details
                  </button>
                </div>
              ))}
              {tickets.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-500 font-medium">No tickets raised yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ticket Conversation View */}
        {activeTab === 'tickets' && selectedTicket && (
          <div className="flex flex-col h-full">
            <div className="bg-white p-4 border-b border-slate-200 flex items-center gap-3 shadow-sm z-10">
              <button onClick={() => setSelectedTicket(null)} className="p-1.5 rounded-full hover:bg-slate-100">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h2 className="font-bold text-slate-900 text-sm">#{selectedTicket.id}</h2>
                <p className="text-xs text-slate-500">{selectedTicket.title}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-4">
              {selectedTicket.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-slate-800 text-white rounded-tr-sm' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    <span className={`text-[10px] mt-1.5 block font-medium ${msg.sender === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {selectedTicket.status !== 'Resolved' && (
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-safe z-20">
                <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                  <textarea
                    value={ticketReply}
                    onChange={(e) => setTicketReply(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[40px] py-2.5 px-3 text-sm outline-none text-slate-800 font-medium"
                    rows={1}
                  />
                  <button 
                    onClick={handleReplyTicket}
                    disabled={!ticketReply.trim()}
                    className={`p-3 rounded-xl flex-shrink-0 transition-colors ${
                      ticketReply.trim() ? 'bg-slate-800 text-white shadow-md hover:bg-slate-900' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="p-4 h-full overflow-y-auto pb-24">
            <h2 className="font-bold text-lg text-slate-900 mb-4">Contact Us</h2>
            
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-sm">Call Support</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Available 24/7 for urgent issues</p>
                </div>
                <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold">Call</button>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-sm">Email Us</h3>
                  <p className="text-xs text-slate-500 mt-0.5">support@chaloapp.com</p>
                </div>
                <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold">Email</button>
              </div>
            </div>

            <h2 className="font-bold text-lg text-slate-900 mt-8 mb-4">Frequently Asked Questions</h2>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
              {FAQ_SUGGESTIONS.map((faq, i) => (
                <button 
                  key={i} 
                  onClick={() => { setActiveTab('chat'); handleSend(faq.q); }}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="font-semibold text-slate-700 text-sm">{faq.q}</span>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Raise New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowNewTicketModal(false)}></div>
          <div className="bg-white rounded-t-[2.5rem] p-6 relative z-10 border-t border-slate-100 max-h-[90vh] w-full overflow-y-auto hide-scrollbar animate-[slideUp_0.3s_ease-out] text-slate-800 pb-12">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 cursor-grab"></div>
            <button 
              onClick={() => setShowNewTicketModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-2 mb-6">
              <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-4 border border-brand-100 shadow-sm">
                <TicketIcon className="w-8 h-8 text-brand-600" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Raise a Ticket</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">Describe your issue and we'll help you out.</p>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {['Rides', 'Food', 'Mart', 'Stays', 'Payments', 'Account', 'Other'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewTicketCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        newTicketCategory === cat 
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Issue Title</label>
                <input 
                  type="text" 
                  required
                  value={newTicketTitle}
                  onChange={(e) => setNewTicketTitle(e.target.value)}
                  placeholder="e.g. Driver charged extra" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea 
                  required
                  value={newTicketDesc}
                  onChange={(e) => setNewTicketDesc(e.target.value)}
                  placeholder="Please provide details about your issue..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 focus:ring-2 focus:ring-brand-500 outline-none font-medium min-h-[120px] resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 mt-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-lg shadow-md transition-colors"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
