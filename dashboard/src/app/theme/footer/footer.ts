import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <div class="f-s-12 text-color-second text-justify m-4">
      <div>
        <h4 class="m-y-4">Get in Touch</h4>
        Have an idea? Drop me an email anytime: <a href="mailto:olshanskyev@gmail.com" class="email-btn">olshanskyev@gmail.com</a>
        <br/>
        You can <a href="https://buymeacoffee.com/olshanskyev">buy me a coffee</a> to support me

      </div>
      <span class="tooltip p-t-2">
        About
        <span class="tooltiptext">This project/website is unofficial and is not associated in any way with the Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trademarks of Formula One Licensing B.V.</span>
      </span>
    </div>
  `,
  imports: [
  ],
  styles: `
    .tooltip {
      position: relative;
      display: inline-block;
      border-bottom: 1px dotted var(--mat-divider-color);
      cursor: help;
    }

    .tooltip .tooltiptext {
      visibility: hidden;
      width: 200px;
      background-color: var(--mat-sys-secondary-container);
      color: var(--mat-sys-on-secondary-container);
      text-align: center;
      border-radius: 0.5rem;
      padding: 0.5rem;

      position: absolute;
      z-index: 1;
      bottom: 125%;
      left: 50%;

      opacity: 0;
      transition: opacity 0.3s;
    }

    .tooltip:hover .tooltiptext {
      visibility: visible;
      opacity: 1;
    }
  `
})
export class Footer {

}
