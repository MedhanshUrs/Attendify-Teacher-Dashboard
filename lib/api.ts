import QRCode from 'qrcode';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

// Feature flag: enable mock mode when backend is unavailable
export const USE_MOCK_FALLBACK = true;

export type SessionPayload = {
  subject?: string;
  code?: string;
  room?: string;
  professor?: string;
  start_time?: string;
  end_time?: string;
  total_strength?: number;
};

// Helper to attempt API call with timeout and fallback
async function fetchWithFallback<T>(
  fetcher: () => Promise<Response>,
  mockResponse: T,
  timeoutMs = 3000
): Promise<T> {
  if (USE_MOCK_FALLBACK) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      
      const fetcherWithAbort = async () => {
        const response = await fetcher();
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error('API request failed');
        return response.json() as Promise<T>;
      };
      
      return await Promise.race([
        fetcherWithAbort(),
        new Promise<T>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), timeoutMs)
        )
      ]);
    } catch {
      // Return mock response on any failure
      console.log('[v0] Backend unavailable, using mock response');
      return mockResponse;
    }
  }
  
  const response = await fetcher();
  if (!response.ok) throw new Error('API request failed');
  return response.json() as Promise<T>;
}

export async function fetchCurrentSession() {
  return fetchWithFallback(
    () => fetch(`${API_URL}/api/sessions/current`, { cache: 'no-store' }),
    { current_session: null }
  );
}

export async function startAttendanceSession(payload: SessionPayload = {}) {
  return fetchWithFallback(
    () => fetch(`${API_URL}/api/sessions/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    { 
      success: true, 
      session_id: `mock-${Date.now()}`,
      message: 'Session started (mock)',
      ...payload 
    }
  );
}

export async function endAttendanceSession() {
  return fetchWithFallback(
    () => fetch(`${API_URL}/api/sessions/end`, { method: 'POST' }),
    { success: true, message: 'Session ended (mock)' }
  );
}

export async function createQrSession() {
  return fetchWithFallback(
    () => fetch(`${API_URL}/api/qr/session`, { method: 'POST' }),
    { 
      verify_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/verify?session=mock-${Date.now()}`,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    }
  );
}

export async function getQrImageDataUrl(verifyUrl: string) {
  return QRCode.toDataURL(verifyUrl, {
    width: 220,
    margin: 1,
  });
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private messageListeners: ((data: any) => void)[] = [];
  private reconnectTimer: number | null = null;
  private closedByUser = false;

  constructor(private clientId: string, private role: string) {}

  connect() {
    if (this.ws && [WebSocket.OPEN, WebSocket.CONNECTING].includes(this.ws.readyState)) return;

    this.closedByUser = false;
    this.ws = new WebSocket(`${WS_URL}/ws/${this.clientId}/${this.role}`);

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.messageListeners.forEach(listener => listener(data));
      } catch (e) {
        console.error('Error parsing WS message', e);
      }
    };

    this.ws.onclose = () => {
      if (this.closedByUser) return;
      this.reconnectTimer = window.setTimeout(() => this.connect(), 3000);
    };
  }

  disconnect() {
    this.closedByUser = true;
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  addMessageListener(listener: (data: any) => void) {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener);
    };
  }
}
