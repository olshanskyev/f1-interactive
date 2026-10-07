import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-donate-button',
  template: `
    <mat-menu #menu="matMenu">
        <div class="p-x-8">
            <a href="https://boosty.to/f1interactive/donate" class="image-link" target="_blank">
                <img src="/images/boosty_color.svg" alt="Boosty" class="circled-image small-icon boosty-image"/>
                <span class="link-text text-nowrap">Boosty</span>
            </a>
            <a href="https://buymeacoffee.com/olshanskyev" class="image-link" target="_blank">
                <img src="/images/bmc-logo.svg" alt="Buy me a coffee" class="circled-image small-icon"/>
                <span class="link-text text-nowrap">Buy me a coffee</span>
            </a>
        </div>
    </mat-menu>

    <button matButton [matMenuTriggerFor]="menu">
        <mat-icon>paid</mat-icon>Support
    </button>

  `,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule
],
  styles: `
    button {
        color: inherit !important;
    }

    .image-link {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        line-height: 2rem;
        text-decoration:double ;
        color: var(--mat-sys-on-surface-variant);
    }

    .circled-image {
        padding: 2px;
        background-color: white;
        border-radius: 50%;
    }

    .boosty-image {
        object-fit: cover;
    }


  `
})
export class DonateButton {

}
