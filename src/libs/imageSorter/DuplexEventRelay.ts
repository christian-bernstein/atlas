export class DuplexEventRelay {

    private readonly handlers: Map<string, (event: Event) => void> = new Map<string, (event: Event) => void>();

    public readonly interceptors: Array<(event: Event) => void> = new Array<(event: Event) => void>();

    public fire(event: Event) {
        this.interceptors.forEach(i => i(event));
        Array.from(this.handlers.entries()).filter(h => h[0] === event.channel).forEach(handler => {
            try {
                handler[1](event);
            } catch (e) {
                console.error(`Error while firing event on channel '${event.channel}'.`, e);
            }
        });
    }

    public fireChannel(channel: string) {
        this.fire({
            channel: channel,
            data: undefined
        });
    }

    public registerInterceptor(interceptor: (event: Event) => void): DuplexEventRelay {
        this.interceptors.push(interceptor);
        return this;
    }

    public registerEventHandler(channel: string, handler: (event: Event) => void): DuplexEventRelay {
        this.handlers.set(channel, handler);
        return this;
    }

}

export type Event = {
    channel: string,
    data: any
}
