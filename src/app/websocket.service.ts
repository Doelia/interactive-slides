import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {

    private webSocket: WebSocket = null;
    public handShakeIsDone = false;
    public subscriptions: Map<string, EventEmitter<any>> = new Map<string, EventEmitter<any>>();

    constructor() {
        this.webSocket = new WebSocket('wss://eu1.prisma.sh/stephane-wouters-5362a4/slides/dev/', ['graphql-subscriptions']);
        this.init();
    }

    private init(): Promise<string> {

        return new Promise((resolve, reject) => {
            this.webSocket.onopen = (event) => {
                const message = {
                    type: 'init',
                };
                this.webSocket.send(JSON.stringify(message));
            };

            this.webSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);

                switch (data.type) {
                    case 'init_success': {
                        this.handShakeIsDone = true;
                        resolve();
                        break;
                    }
                    case 'init_fail': {
                        reject();
                        throw {
                            message: 'init_fail returned from WebSocket server',
                            data
                        };
                    }
                    case 'subscription_data': {
                        if (!!data.payload) {
                            this.handleResponse(data);
                        }
                        break;
                    }
                    case 'subscription_fail': {
                        console.error('socket subscription fail', data);
                        break;
                    }
                    case 'keepalive' : {
                        break;
                    }
                    default : {
                    }
                }
            };
        });
    }

    private handleResponse(socketResponse): void {
        const emiter = this.subscriptions.get(socketResponse.id);
        if (emiter) {
            emiter.next(socketResponse.payload.data);
        } else {
            console.error('subscription not found ', socketResponse.id);
        }
    }

    private subscribeEvent(event) {
        if (this.handShakeIsDone) {
            this.webSocket.send(JSON.stringify(event));
        } else {
            setTimeout(() => {
                this.subscribeEvent(event);
            }, 500);
        }
    }

    public subscribeTo(query: string): EventEmitter<any> {
        const idEvent = '123';

        const event = {
            id: idEvent,
            type: 'subscription_start',
            query
        };

        this.subscribeEvent(event);

        return this.subscriptions
            .set(event.id, new EventEmitter())
            .get(event.id);
    }


}
