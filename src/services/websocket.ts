interface GameUpdate {
  type: 'gameUpdate';
  data: {
    gameId: string;
    frames: Array<{
      rolls: number[];
      score: number;
    }>;
    score: number;
    isComplete: boolean;
  };
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private gameId: string | null = null;
  private onUpdateCallback: ((data: GameUpdate) => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;

  connect(gameId: string, onUpdate: (data: GameUpdate) => void) {
    this.gameId = gameId;
    this.onUpdateCallback = onUpdate;
    this.reconnectAttempts = 0;
    
    this.establishConnection();
  }

  private establishConnection() {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    this.ws = new WebSocket(wsUrl);
    console.log('WebSocket URL:', wsUrl);
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.joinGame();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'gameUpdate' && this.onUpdateCallback) {
          this.onUpdateCallback(data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed');
      this.handleReconnect();
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => {
        this.establishConnection();
      }, 1000 * this.reconnectAttempts); // Exponential backoff
    }
  }

  private joinGame() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.gameId) {
      const joinMessage = {
        type: 'join',
        gameId: this.gameId
      };
      this.ws.send(JSON.stringify(joinMessage));
    }
  }

  sendRoll(pins: number) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.gameId) {
      const rollMessage = {
        gameId: this.gameId,
        pins
      };
      this.ws.send(JSON.stringify(rollMessage));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.gameId = null;
      this.onUpdateCallback = null;
      this.reconnectAttempts = 0;
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export const wsService = new WebSocketService(); 