import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
    widgetHeight = signal<number>(0);
    widgetWidth = signal<number>(0);
    isMobile = signal(isMobile);
    widgetsMap = new Map<WidgetType, WidgetComponent>();

    constructor() {
        this.widgetsMap = this.widgetFactory.getWidgets();
    }

    onDragStarted(widget: WidgetComponent) {
        this.widgetHeight.set(widget.meta.defaultSizes[0].height);
        this.widgetWidth.set(widget.meta.defaultSizes[0].width);
        this.dialogRef.addPanelClass('invisible-dialog');
    }

    onDragEnded(event: CdkDragEnd, widget: WidgetType) {
        this.dialogRef.close({
            widgetType: widget,
            position: event.dropPoint
        });
    }
}