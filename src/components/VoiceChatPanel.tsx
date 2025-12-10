import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface VoiceBot {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'muted' | 'talking';
}

interface VoiceChatPanelProps {
  voiceConnected: boolean;
  voiceBots: VoiceBot[];
  toggleVoiceChat: () => void;
  toggleBotMute: (botId: string) => void;
}

const VoiceChatPanel = ({
  voiceConnected,
  voiceBots,
  toggleVoiceChat,
  toggleBotMute,
}: VoiceChatPanelProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30 backdrop-blur-sm animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="Mic" size={28} className="text-blue-400" />
          <h2 className="text-xl font-bold text-white">Голосовой чат</h2>
        </div>
        {voiceConnected && (
          <Badge className="bg-green-500 text-black animate-pulse">
            🔴 В эфире
          </Badge>
        )}
      </div>

      <Button
        className={`w-full h-14 text-lg font-bold transition-all duration-300 ${
          voiceConnected 
            ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
            : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
        }`}
        onClick={toggleVoiceChat}
      >
        <Icon name={voiceConnected ? 'MicOff' : 'Mic'} className="mr-2" size={24} />
        {voiceConnected ? 'Отключиться' : 'Подключиться'}
      </Button>

      {voiceConnected && (
        <div className="mt-4 space-y-2 animate-fade-in">
          <p className="text-sm text-blue-200 font-semibold">Боты в чате:</p>
          {voiceBots.map((bot) => (
            <div
              key={bot.id}
              className="flex items-center justify-between p-3 bg-blue-950/30 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{bot.avatar}</span>
                <span className="text-white font-medium">{bot.name}</span>
                {bot.status === 'talking' && (
                  <Badge className="bg-green-500 text-black text-xs">
                    🗣️ Говорит
                  </Badge>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleBotMute(bot.id)}
                className="text-white hover:bg-blue-500/20"
              >
                <Icon name={bot.status === 'muted' ? 'VolumeX' : 'Volume2'} size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-blue-200 mt-3 text-center">
        Общайся с друзьями и ботами голосом 🎤
      </p>
    </Card>
  );
};

export default VoiceChatPanel;
