import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Game {
  id: string;
  title: string;
  players: string;
  icon: string;
  color: string;
}

interface Gift {
  id: number;
  name: string;
  emoji: string;
  price: number;
  category: string;
  rarity: string;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
}

interface GameTabsProps {
  games: Game[];
  gifts: Gift[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  handleBuyGift: (gift: Gift) => void;
  messages: Message[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  currentPlayerUsername: string;
}

const GameTabs = ({
  games,
  gifts,
  selectedCategory,
  setSelectedCategory,
  handleBuyGift,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  currentPlayerUsername,
}: GameTabsProps) => {
  const filteredGifts = selectedCategory === 'all' 
    ? gifts 
    : gifts.filter(g => g.category === selectedCategory);

  const categories = ['all', 'common', 'food', 'animals', 'luxury', 'legendary'];

  return (
    <Tabs defaultValue="games" className="animate-fade-in">
      <TabsList className="grid w-full grid-cols-3 bg-purple-950/50 border border-purple-500/30">
        <TabsTrigger value="games" className="text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
          🎮 Игры
        </TabsTrigger>
        <TabsTrigger value="gifts" className="text-base font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
          🎁 Подарки
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

      <TabsContent value="gifts" className="mt-4">
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className={selectedCategory === cat 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'border-purple-500 text-white hover:bg-purple-500/20'
                }
              >
                {cat === 'all' ? 'Все' : cat}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pr-4">
              {filteredGifts.slice(0, 30).map((gift) => (
                <Card
                  key={gift.id}
                  className="p-4 bg-purple-950/50 border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer hover:scale-105"
                  onClick={() => handleBuyGift(gift)}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{gift.emoji}</div>
                    <div className="text-white font-semibold text-sm mb-1">{gift.name}</div>
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold">
                      {gift.price}₽
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
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
                    msg.sender === currentPlayerUsername
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
  );
};

export default GameTabs;
