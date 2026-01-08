import { Component } from '@angular/core';
import { PageHeader } from '@shared';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  imports: [
    PageHeader,
  ],
})
export class Dashboard {

  constructor() {
    
    /*const evtSource = new EventSource('http://localhost:8081/f1interactive/simulator/live');

    const parseMyEvent = (evt: Event) => {
      const messageEvent = (evt as MessageEvent);  // <== This line is Important!!
      console.log(messageEvent.data);
    }

    evtSource.addEventListener('init', parseMyEvent);
    evtSource.addEventListener('update', parseMyEvent);
    evtSource.addEventListener('heartbeat', parseMyEvent);
  */


    
  }

}
