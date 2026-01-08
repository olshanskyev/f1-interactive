import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { tap } from "rxjs";
import { SseClient } from "ngx-sse-client"

export interface UpdateEventRecord {
  className: string;
  updateEvent: any;
  utc: string;
}

@Injectable({
  providedIn: 'root',
})
export class LiveService {
  protected readonly sseClient = inject(SseClient);  
  protected readonly http = inject(HttpClient);

  live(
        onInit: ((event: any) => void) | undefined,
        onUpdate: ((event: UpdateEventRecord) => void) | undefined,
  ) {
    return this.sseClient.stream('/live').pipe(tap((event) => {
      const data = JSON.parse((event as MessageEvent<any>).data);
      if (event.type === 'init' && onInit)
        onInit(data);
      if (event.type === 'update' && onUpdate) {
        onUpdate(data);
      }
    }
    ));
  }
  
}