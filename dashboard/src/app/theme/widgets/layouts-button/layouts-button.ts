import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';
import { LayoutsService } from '@core';
import { Layout } from '@core/types/widgets';

@Component({
  selector: 'app-layouts-button',
  templateUrl: './layouts-button.html',
  styleUrl: './layouts-button.scss',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, TranslateModule, MatDividerModule],
})
export class LayoutsButton {
  private readonly layoutsService = inject(LayoutsService);
  private readonly router = inject(Router);

  customLayouts = signal<Layout[]>([]);

  constructor() {
    this.customLayouts.set(this.layoutsService.getCustomLayouts());
  }

  activateDefault() {
    this.layoutsService.selectDefaultLayout();
  }

  onDeleteCustomLayout(layout: Layout) {
    this.layoutsService.deleteLayout(layout.id);
    this.customLayouts.set(this.layoutsService.getCustomLayouts());
    this.activateDefault();
  }

  onEditCustomLayout(layout: Layout) {
    this.layoutsService.selectLayout(layout.id);
    this.router.navigateByUrl('/layouts');
  }

  onCreateNewLayout(){
      const layout = this.layoutsService.createDefaultLayout();
      this.layoutsService.saveLayout(layout);
      this.layoutsService.selectLayout(layout.id);
      this.router.navigateByUrl('/layouts');
  }


  activateLayout(layout: Layout) {
    this.layoutsService.selectLayout(layout.id);
  }

}
