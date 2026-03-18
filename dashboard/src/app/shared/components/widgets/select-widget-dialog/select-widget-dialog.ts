import { CommonModule } from '@angular/common';
import { Component, inject, signal, Signal, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { WidgetFactory } from '@core';
import { WidgetComponent, WidgetType } from '@core/types/widgets';
import { TranslateModule } from '@ngx-translate/core';
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { isMobile } from '@core/lib/device';

@Component({
    selector: 'select-widget-dialog',
    styleUrl:'./select-widget-dialog.scss',
    templateUrl: './select-widget-dialog.html',
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatCardModule,
        MatDialogModule,
        TranslateModule,
        DragDropModule,
        MatIconModule
    ]
})
export class SelectWidgetDialog {
    private readonly widgetFactory = inject(WidgetFactory);
    readonly dialogRef = inject(MatDialogRef);
    data = inject<{ cellSize: Signal<number> }>(MAT_DIALOG_DATA);
    widgetHeight = signal<number>(0);
    widgetWidth = signal<number>(0);
    isMobile = signal(isMobile);
    widgetsMap = new Map<WidgetType, WidgetComponent>();

    constructor() {
        this.widgetsMap = this.widgetFactory.getWidgets();
    }

    onDragStarted(widget: WidgetComponent) {
        this.widgetHeight.set(this.data.cellSize() * widget.meta.defaultSizes[0].rowSpan);
        this.widgetWidth.set(this.data.cellSize() * widget.meta.defaultSizes[0].colSpan);
        this.dialogRef.addPanelClass('invisible-dialog');
    }

    onDragEnded(event: CdkDragEnd, widget: WidgetType) {
        this.dialogRef.close({
            widgetType: widget,
            position: event.dropPoint
        });
    }
}