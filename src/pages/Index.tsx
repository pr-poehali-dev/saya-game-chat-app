import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  wins: number;
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

const Index = () => {
  const [currentPlayer] = useState<Player>({
    id: '1',
    name: 'Игрок_007',
    avatar: '🎮',
    score: 1250,
    wins: 12,
  });

  const [roomCode, setRoomCode] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'Макс', text: 'Го следующий раунд!', time: '14:32' },
    { id: '2', sender: 'Аня', text: 'Я готова 🔥', time: '14:33' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const games: Game[] = [
    { id: '1', title: 'Правда или Действие', players: '2-8', icon: '🎭', color: 'from-pink-500 to-purple-500' },
    { id: '2', title: 'Угадай мелодию', players: '2-10', icon: '🎵', color: 'from-yellow-400 to-orange-500' },
    { id: '3', title: 'Крокодил', players: '3-12', icon: '🦎', color: 'from-green-400 to-teal-500' },
    { id: '4', title: 'Кто Я?', players: '3-8', icon: '❓', color: 'from-blue-400 to-cyan-500' },
  ];

  const leaderboard: Player[] = [
    { id: '1', name: 'ПроГеймер', avatar: '👑', score: 2500, wins: 25 },
    { id: '2', name: 'Чемпион2024', avatar: '🏆', score: 2100, wins: 20 },
    { id: '3', name: 'Игрок_007', avatar: '🎮', score: 1250, wins: 12 },
    { id: '4', name: 'ВесельчакМакс', avatar: '😄', score: 980, wins: 8 },
  ];

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
        sender: currentPlayer.name,
        text: newMessage,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
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
            <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30 backdrop-blur-sm animate-scale-in">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16 text-3xl border-2 border-purple-400 animate-pulse-glow">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500">
                    {currentPlayer.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">{currentPlayer.name}</h2>
                  <div className="flex gap-3 mt-1">
                    <Badge className="bg-yellow-500 text-black font-semibold">
                      ⭐ {currentPlayer.score}
                    </Badge>
                    <Badge className="bg-green-500 text-black font-semibold">
                      🏆 {currentPlayer.wins} побед
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={handleCreateRoom}
                  className="h-14 text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover:scale-105"
                >
                  <Icon name="Plus" className="mr-2" size={24} />
                  Создать комнату
                </Button>

                <div className="flex gap-2">
                  <Input
                    placeholder="Код комнаты"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="h-14 text-lg bg-purple-950/50 border-purple-500/50 text-white placeholder:text-purple-300"
                  />
                  <Button
                    onClick={handleJoinRoom}
                    className="h-14 px-6 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all duration-300 hover:scale-105"
                  >
                    <Icon name="LogIn" size={24} />
                  </Button>
                </div>
              </div>
            </Card>

            <Tabs defaultValue="games" className="animate-fade-in">
              <TabsList className="grid w-full grid-cols-2 bg-purple-950/50 border border-purple-500/30">
                <TabsTrigger value="games" className="text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
                  🎮 Игры
                </TabsTrigger>
                <TabsTrigger value="chat" className="text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
                  💬 Чат
                </TabsTrigger>
              </TabsList>

              <TabsContent value="games" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {games.map((game, index) => (
                    <Card
                      key={game.id}
                      className={`p-6 bg-gradient-to-br ${game.color} border-0 cursor-pointer hover:scale-105 transition-all duration-300 animate-scale-in`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => toast.info(`Запускаем игру: ${game.title}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{game.icon}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-1">
                            {game.title}
                          </h3>
                          <p className="text-white/80 font-medium">
                            <Icon name="Users" size={16} className="inline mr-1" />
                            {game.players} игроков
                          </p>
                        </div>
                        <Icon name="Play" size={32} className="text-white" />
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="chat" className="mt-4">
                <Card className="p-4 bg-purple-950/50 border-purple-500/30 backdrop-blur-sm">
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-2xl ${
                            msg.sender === currentPlayer.name
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 ml-8'
                              : 'bg-purple-900/50 mr-8'
                          } animate-fade-in`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-white text-sm">
                              {msg.sender}
                            </span>
                            <span className="text-xs text-white/60">{msg.time}</span>
                          </div>
                          <p className="text-white">{msg.text}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="flex gap-2 mt-4">
                    <Input
                      placeholder="Напиши сообщение..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="bg-purple-950/50 border-purple-500/50 text-white placeholder:text-purple-300"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Icon name="Send" size={20} />
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500/30 backdrop-blur-sm animate-scale-in">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Trophy" size={28} className="text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">Топ игроков</h2>
              </div>

              <div className="space-y-3">
                {leaderboard.map((player, index) => (
                  <div
                    key={player.id}
                    className={`p-4 rounded-xl ${
                      player.id === currentPlayer.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse-glow'
                        : 'bg-purple-950/30'
                    } transition-all duration-300 hover:scale-105`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-white w-8">
                        #{index + 1}
                      </div>
                      <Avatar className="h-12 w-12 text-2xl border-2 border-white/30">
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600">
                          {player.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-bold text-white">{player.name}</div>
                        <div className="text-sm text-white/70">
                          ⭐ {player.score} · 🏆 {player.wins}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30 backdrop-blur-sm animate-scale-in">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Mic" size={28} className="text-blue-400" />
                <h2 className="text-xl font-bold text-white">Голосовой чат</h2>
              </div>

              <Button
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                onClick={() => toast.info('Голосовой чат будет доступен в следующем обновлении!')}
              >
                <Icon name="Mic" className="mr-2" size={24} />
                Подключиться
              </Button>

              <p className="text-sm text-blue-200 mt-3 text-center">
                Общайся с друзьями во время игры 🎤
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
