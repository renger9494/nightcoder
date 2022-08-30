import { FileDto } from '../utils/api';

export type SocketType = {
  listen: (listenerName: string) => {};
  on: (listenerName: string, func: Function) => {};
  invoke: (hubActionName: string) => {};
  start: () => {};
  stop: () => {};
};

export type CreateNewPagePreviewInfo = {
  projectId: number;
  pageId: number;
  previewImage: FileDto;
};

export enum SocketNotificationType {
  CreateNewPagePreview = 'CreateNewPagePreview'
}

class SocketLogger {
  startListen(notificationType: SocketNotificationType) {
    console.log('[SocketManager startListen]:new listener type', notificationType);
  }

  receivedNewMessage(notificationType: SocketNotificationType, messageJson: string) {
    console.log(`[SocketManager startListen]:data from socket for type: ${notificationType}`, messageJson);
  }

  subscribe() {
    console.log('[SocketManager subscribe]');
  }

  unsubscribe() {
    console.log('[SocketManager destroy]');
  }
}

class SocketManager {
  private _logger: SocketLogger | null;
  constructor(private $socket: SocketType) {
    this._logger = process.env.NODE_ENV != 'production' ? new SocketLogger() : null;
  }

  static __instance: SocketManager;
  /**
   * Get socket manager inastance
   * @param {SocketType} socket - signalr vue socket: required to init
   * @param {any} store -  vuex store: required to init
   * @returns {SocketManager}
   */
  static getInstance(socket: SocketType): SocketManager {
    return this.__instance ?? (this.__instance = new SocketManager(socket));
  }

  startListen<T>(
    notificationType: SocketNotificationType,
    handler: (message: T) => void,
    isDestroyAfterReceivedMessage = true
  ) {
    this._logger?.startListen(notificationType);
    this.$socket.listen(notificationType);
    this.$socket.on(notificationType, (messageJson: string) => {
      const message = JSON.parse(messageJson);

      handler(message);
      if (isDestroyAfterReceivedMessage) this.destroy();
      this._logger?.receivedNewMessage(notificationType, messageJson);
    });
    this.subscribe();
  }

  subscribe() {
    this.$socket.start();
    this.$socket.invoke('Subscribe');
    this._logger?.subscribe();
  }

  destroy() {
    this.$socket.invoke('UnSubscribe');
    this.$socket.stop();
    this._logger?.unsubscribe();
  }
}

export default SocketManager;
