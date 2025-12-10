import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PlayerProfile from '@/components/PlayerProfile';
import GameTabs from '@/components/GameTabs';
import LeaderboardSidebar from '@/components/LeaderboardSidebar';
import VoiceChatPanel from '@/components/VoiceChatPanel';

interface Player {
  user_id: string;
  username: string;
  avatar: string;
  balance: number;
  score: number;
  wins: number;
}

interface Gift {
  id: number;
  name: string;
  emoji: string;
  price: number;
  category: string;
  rarity: string;
}

interface Game {
  id: string;
  title: string;
  players: string;
  icon: string;
  color: string;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
}

interface VoiceBot {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'muted' | 'talking';
}

const API_BASE = 'https://functions.poehali.dev';

const Index = () => {
  const [currentPlayer, setCurrentPlayer] = useState<Player>({
    user_id: 'demo_user_1',
    username: 'Игрок_007',
    avatar: '🎮',
    balance: 0,
    score: 1250,
    wins: 12,
  });

  const [gifts, setGifts] = useState<Gift[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [roomCode, setRoomCode] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'Макс', text: 'Го следующий раунд!', time: '14:32' },
    { id: '2', sender: 'Аня', text: 'Я готова 🔥', time: '14:33' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [depositAmount, setDepositAmount] = useState('100');
  const [voiceBots, setVoiceBots] = useState<VoiceBot[]>([
    { id: '1', name: 'БотВася', avatar: '🤖', status: 'active' },
    { id: '2', name: 'БотМаша', avatar: '🎭', status: 'muted' },
    { id: '3', name: 'БотДжони', avatar: '🎸', status: 'talking' },
  ]);
  const [voiceConnected, setVoiceConnected] = useState(false);

  const games: Game[] = [
    { id: '1', title: 'Правда или Действие', players: '2-8', icon: '🎭', color: 'from-pink-500 to-purple-500' },
    { id: '2', title: 'Угадай мелодию', players: '2-10', icon: '🎵', color: 'from-yellow-400 to-orange-500' },
    { id: '3', title: 'Крокодил', players: '3-12', icon: '🦎', color: 'from-green-400 to-teal-500' },
    { id: '4', title: 'Кто Я?', players: '3-8', icon: '❓', color: 'from-blue-400 to-cyan-500' },
  ];

  const leaderboard: Player[] = [
    { user_id: '1', username: 'ПроГеймер', avatar: '👑', balance: 5000, score: 2500, wins: 25 },
    { user_id: '2', username: 'Чемпион2024', avatar: '🏆', balance: 3000, score: 2100, wins: 20 },
    currentPlayer,
    { user_id: '4', username: 'ВесельчакМакс', avatar: '😄', balance: 800, score: 980, wins: 8 },
  ];

  useEffect(() => {
    initUser();
    loadGifts();
  }, []);

  const initUser = async () => {
    try {
      const response = await fetch(`${API_BASE}/1e9c9684-23cd-40cc-9d02-a38d77da8527`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentPlayer.user_id,
          username: currentPlayer.username,
          avatar: currentPlayer.avatar,
        }),
      });
      const data = await response.json();
      if (data.user) {
        setCurrentPlayer({ ...currentPlayer, balance: data.user.balance });
      }
    } catch (error) {
      console.error('Failed to init user:', error);
    }
  };

  const loadGifts = async () => {
    try {
      const response = await fetch(`${API_BASE}/ff3478fc-4be9-415d-a8cf-134bed42a410?page=1&limit=50`);
      const data = await response.json();
      if (data.gifts) {
        setGifts(data.gifts);
      }
    } catch (error) {
      console.error('Failed to load gifts:', error);
    }
  };

  const handleDeposit = async () => {
    const amount = parseInt(depositAmount);
    if (amount < 10) {
      toast.error('Минимальная сумма 10₽');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/e4504ea1-2ef2-4ebf-8374-b3b59353cc65`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentPlayer.user_id,
          amount: amount,
          description: `Пополнение ${amount}₽`,
        }),
      });
      const data = await response.json();
      
      if (data.success && data.demo_mode) {
        setCurrentPlayer({ ...currentPlayer, balance: currentPlayer.balance + amount });
        toast.success(`Демо: баланс пополнен на ${amount}₽`);
      } else if (data.payment_url) {
        window.open(data.payment_url, '_blank');
        toast.info('Перенаправляем на оплату...');
      }
    } catch (error) {
      toast.error('Ошибка создания платежа');
    }
  };

  const handleBuyGift = (gift: Gift) => {
    if (currentPlayer.balance < gift.price) {
      toast.error('Недостаточно средств! Пополните баланс');
      return;
    }
    
    setCurrentPlayer({ ...currentPlayer, balance: currentPlayer.balance - gift.price });
    toast.success(`Куплен подарок: ${gift.emoji} ${gift.name} за ${gift.price}₽`);
  };

  const handleCreateRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    toast.success(`Комната создана! Код: ${code}`);
  };

  const handleJoinRoom = () => {
    if (roomCode.length > 0) {
      toast.success(`Подключаюсь к комнате ${roomCode}...`);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: String(messages.length + 1),
        sender: currentPlayer.username,
        text: newMessage,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  const toggleVoiceChat = () => {
    setVoiceConnected(!voiceConnected);
    toast.success(voiceConnected ? 'Отключились от голосового чата' : 'Подключились к голосовому чату');
  };

  const toggleBotMute = (botId: string) => {
    setVoiceBots(voiceBots.map(bot => 
      bot.id === botId 
        ? { ...bot, status: bot.status === 'muted' ? 'active' : 'muted' as 'active' | 'muted' | 'talking' }
        : bot
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0f2e] via-[#2d1b4e] to-[#1a0f2e] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
            Party Chat 🎉
          </h1>
          <p className="text-xl text-purple-300">Игры для крутых вечеринок</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PlayerProfile
              currentPlayer={currentPlayer}
              roomCode={roomCode}
              setRoomCode={setRoomCode}
              depositAmount={depositAmount}
              setDepositAmount={setDepositAmount}
              handleCreateRoom={handleCreateRoom}
              handleJoinRoom={handleJoinRoom}
              handleDeposit={handleDeposit}
            />

            <GameTabs
              games={games}
              gifts={gifts}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              handleBuyGift={handleBuyGift}
              messages={messages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              currentPlayerUsername={currentPlayer.username}
            />
          </div>

          <div className="space-y-6">
            <LeaderboardSidebar
              leaderboard={leaderboard}
              currentPlayerId={currentPlayer.user_id}
            />

            <VoiceChatPanel
              voiceConnected={voiceConnected}
              voiceBots={voiceBots}
              toggleVoiceChat={toggleVoiceChat}
              toggleBotMute={toggleBotMute}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
