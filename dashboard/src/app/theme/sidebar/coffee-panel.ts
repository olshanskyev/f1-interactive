import { Component } from '@angular/core';

@Component({
  selector: 'coffee-panel',
  template: `
    <a href="https://buymeacoffee.com/olshanskyev"
        class="w-full d-flex align-items-center gap-8 text-none f-s-14 p-b-4"
        style="color: var(--mat-sys-on-surface-variant)">
        <div class="text-center"
          style="border-radius: 50%;
          width: 24px;
          height: 24px;
          background-color: white">
          <img class="h-full p-2" src="images/bmc-logo.svg" alt="by me a coffee"/>
        </div>
        <span>Buy me a coffee</span>
    </a>
  `,
  imports: [],
})
export class CoffeePanel {
}
