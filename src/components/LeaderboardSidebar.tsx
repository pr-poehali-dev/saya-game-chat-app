import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface Player {
  user_id: string;
  username: string;
  avatar: string;
  balance: number;
  score: number;
  wins: number;
}

interface LeaderboardSidebarProps {
  leaderboard: Player[];
  currentPlayerId: string;
}

const LeaderboardSidebar = ({ leaderboard, currentPlayerId }: LeaderboardSidebarProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500/30 backdrop-blur-sm animate-scale-in">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Trophy" size={28} className="text-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Топ игроков</h2>
      </div>

      <div className="space-y-3">
        {leaderboard.map((player, index) => (
          <div
            key={player.user_id}
            className={`p-4 rounded-xl ${
              player.user_id === currentPlayerId
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
                <div className="font-bold text-white">{player.username}</div>
                <div className="text-sm text-white/70">
                  ⭐ {player.score} · 🏆 {player.wins}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default LeaderboardSidebar;
