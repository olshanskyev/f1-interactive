import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { PageHeader } from '@shared';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  imports: [PageHeader],
})
export class Dashboard implements OnDestroy {

  constructor(client: HttpClient) {
    /*client.get('http://localhost:8081/f1interactive/simulator/live').subscribe(res => {
      console.log(res);
    })*/
    const evtSource = new EventSource('http://localhost:8081/f1interactive/simulator/live');

    const parseMyEvent = (evt: Event) => {
      const messageEvent = (evt as MessageEvent);  // <== This line is Important!!
      console.log(messageEvent.data);
    }

    evtSource.addEventListener('init', parseMyEvent);
    evtSource.addEventListener('update', parseMyEvent);
  }

  ngOnDestroy(): void {
    console.log('OnDestroy');

  }

}
