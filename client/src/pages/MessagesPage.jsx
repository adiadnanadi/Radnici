import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Send, ArrowLeft, User, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { messageService } from '../services/api';

const MessagesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const inbox = await messageService.getInbox();
      const sent = await messageService.getSent();
      
      const allMessages = [...inbox, ...sent];
      const uniqueUsers = [];
      const seen = new Set();
      
      allMessages.forEach(msg => {
        const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
        if (!seen.has(otherUserId)) {
          seen.add(otherUserId);
          uniqueUsers.push({
            userId: otherUserId,
            lastMessage: msg,
            email: msg.senderEmail || msg.receiverEmail || 'Radnik',
            name: msg.firstName ? `${msg.firstName} ${msg.lastName}` : 'Radnik'
          });
        }
      });
      
      uniqueUsers.sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));
      setConversations(uniqueUsers);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (userId) => {
    try {
      const sent = await messageService.getSent();
      const received = await messageService.getInbox();
      
      const allMsgs = [...sent, ...received].filter(
        m => (m.senderId === user.id && m.receiverId === userId) || 
             (m.receiverId === user.id && m.senderId === userId)
      );
      
      setMessages(allMsgs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;
    
    setSending(true);
    try {
      await messageService.send({
        receiverId: activeConversation.userId,
        workerId: activeConversation.lastMessage?.workerId || null,
        content: newMessage
      });
      setNewMessage('');
      fetchConversation(activeConversation.userId);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const openConversation = async (conv) => {
    setActiveConversation(conv);
    await fetchConversation(conv.userId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-3xl font-bold text-white">Poruke</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-4">
            <h2 className="text-lg font-semibold text-white mb-4">Razgovori</h2>
            {conversations.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Nemate razgovora</p>
            ) : (
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <button
                    key={conv.userId}
                    onClick={() => openConversation(conv)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      activeConversation?.userId === conv.userId 
                        ? 'bg-primary-500/20 border border-primary-500/30' 
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{conv.name}</p>
                        <p className="text-gray-400 text-sm truncate">{conv.lastMessage.content}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2 card p-4">
            {activeConversation ? (
              <>
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{activeConversation.name}</p>
                    <p className="text-gray-400 text-sm">{activeConversation.email}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${
                        msg.senderId === user.id 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-white/10 text-gray-200'
                      }`}>
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.senderId === user.id ? 'text-primary-200' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleString('bs-BA')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Napiši poruku..."
                    className="input-field flex-1"
                  />
                  <button 
                    type="submit" 
                    disabled={sending || !newMessage.trim()}
                    className="btn-primary px-4"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <MessageSquare className="w-12 h-12 mb-4" />
                <p>Izaberi razgovor da vidiš poruke</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;