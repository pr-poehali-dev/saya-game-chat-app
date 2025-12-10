import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface Player {
  user_id: string;
  username: string;
  avatar: string;
  balance: number;
  score: number;
  wins: number;
}

interface PlayerProfileProps {
  currentPlayer: Player;
  roomCode: string;
  setRoomCode: (code: string) => void;
  depositAmount: string;
  setDepositAmount: (amount: string) => void;
  handleCreateRoom: () => void;
  handleJoinRoom: () => void;
  handleDeposit: () => void;
}

const PlayerProfile = ({
  currentPlayer,
  roomCode,
  setRoomCode,
  depositAmount,
  setDepositAmount,
  handleCreateRoom,
  handleJoinRoom,
  handleDeposit,
}: PlayerProfileProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30 backdrop-blur-sm animate-scale-in">
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-16 w-16 text-3xl border-2 border-purple-400 animate-pulse-glow">
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500">
            {currentPlayer.avatar}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">{currentPlayer.username}</h2>
          <div className="flex gap-3 mt-1 flex-wrap">
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold">
              💰 {currentPlayer.balance}₽
            </Badge>
            <Badge className="bg-yellow-500 text-black font-semibold">
              ⭐ {currentPlayer.score}
            </Badge>
            <Badge className="bg-green-500 text-black font-semibold">
              🏆 {currentPlayer.wins} побед
            </Badge>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
              <Icon name="Wallet" className="mr-2" size={20} />
              Пополнить
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-br from-purple-900 to-pink-900 border-purple-500">
            <DialogHeader>
              <DialogTitle className="text-2xl text-white">Пополнение баланса через СБП</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-white mb-2 block">Сумма (₽)</label>
                <Input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="h-12 text-lg bg-purple-950/50 border-purple-500/50 text-white"
                  min="10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {[100, 500, 1000, 5000].map(amount => (
                  <Button
                    key={amount}
                    onClick={() => setDepositAmount(String(amount))}
                    variant="outline"
                    className="border-purple-500 text-white hover:bg-purple-500/20"
                  >
                    {amount}₽
                  </Button>
                ))}
              </div>
              <Button
                onClick={handleDeposit}
                className="w-full h-12 text-lg bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              >
                Оплатить через СБП
              </Button>
              <p className="text-sm text-purple-200 text-center">
                ИНН: 526098573404 • Безопасная оплата
              </p>
            </div>
          </DialogContent>
        </Dialog>
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
  );
};

export default PlayerProfile;
