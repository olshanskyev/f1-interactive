import { Component, EventEmitter, inject, input, output, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { WidgetType } from '@core/types/widgets';
import { SelectWidgetDialog } from '@shared/components/widgets/select-widget-dialog/select-widget-dialog';

@Component({
    selector: 'tools-panel',
    templateUrl: './tools-panel.html',
    styleUrls: ['./tools-panel.scss'],
    imports: [
        MatIconModule,
        MatCardModule,
        MatButtonModule
    ]
})
export class ToolsPanelComponent {

    cellSize = input<number>();
    widgetAdded = output<{widgetType: WidgetType, position: {x: number, y: number}}>();
    private dialog = inject(MatDialog);

    openSelectWidgetDialog() {
        const dialogRef = this.dialog.open(SelectWidgetDialog, {
            panelClass: 'bordered-dialog',
            backdropClass: 'transparent-backdrop-dialog',
            width: '500px',
            data: { cellSize: this.cellSize }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.widgetAdded.emit(result);
            }
        });
    }
}