import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { LiveService } from './live.service';

import { UpdateEventRecord } from './live.service';

@Injectable({
  providedIn: 'root',
})
export class F1InteractiveService extends LiveService {

  private liveConnection = signal<{time: number} | undefined>(undefined);

  live(
        onInit: ((event: any) => void) | undefined,
        onUpdate: ((event: UpdateEventRecord) => void) | undefined,
  ) {
    return this.createKeepAliveStream('/live', this.liveConnection).pipe(
        tap((event) => {
          const messageEvent = (event as MessageEvent<any>);
          if (messageEvent.data) {
            const data = JSON.parse(messageEvent.data);
            if (event.type === 'init') {
                this.stateHandler.init(data);
                if (onInit)
                  onInit(data);
            }

            if (event.type === 'update') {
                this.updateStateWithDelay(data);
                if (onUpdate)
                  onUpdate(data);
            }
          }

        })
    );
  }

  getLiveConnectionSignal() {
    return this.liveConnection.asReadonly();
  }



}