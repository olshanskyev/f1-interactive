import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { LayoutsService } from '@core';
import { MatSelectModule } from '@angular/material/select';
import { ConfirmDialog, ConfirmDialogData } from '../../../shared/dialogs';

@Component({
  selector: 'app-layout-buttons',
  templateUrl: './layout-buttons.html',
  styleUrl: './layout-buttons.scss',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    TranslateModule,
    MatDividerModule,
    MatSelectModule],
})
export class LayoutButtons {
  private readonly layoutsService = inject(LayoutsService);
  private readonly dialog = inject(MatDialog);

  selectedLayout = this.layoutsService.getSelectedLayout();
  customLayouts = this.layoutsService.getCustomLayouts();
  isEditing = this.layoutsService.getIsEditing();

  activateDefault() {
    this.layoutsService.selectDefaultLayout();
  }

  onDeleteCustomLayout() {
    const layout = this.selectedLayout();
    if (!layout) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: { message: 'confirm_delete' } as ConfirmDialogData,
      panelClass: 'bordered-dialog',
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.layoutsService.deleteLayout(layout.id);
        this.activateDefault();
      }
    });
  }

  onEditConfirmLayout() {
    this.layoutsService.setEditing(!this.isEditing());
  }

  onCreateNewLayout(){
      const layout = this.layoutsService.createDefaultLayout();
      this.layoutsService.saveLayout(layout);
      this.layoutsService.selectLayout(layout.id);
      this.layoutsService.setEditing(true);
  }


  activateLayout(id: string) {
    if (id === 'Default') {
      this.activateDefault();
      return;
    }
    this.layoutsService.selectLayout(id);
  }

}
