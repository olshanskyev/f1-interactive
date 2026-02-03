import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { WidgetFactory } from '@core';
import { WidgetComponent, WidgetType } from '@core/types/widgets';

@Component({
    selector: 'select-widget-dialog',
    styleUrl:'./select-widget-dialog.scss',
    templateUrl: './select-widget-dialog.html',
    imports: [
        CommonModule,
        MatCardModule,
        MatDialogModule
    ]
})
export class SelectWidgetDialog {
    private readonly widgetFactory = inject(WidgetFactory);
    readonly dialogRef = inject(MatDialogRef);
    widgetsMap = new Map<WidgetType, WidgetComponent>();

    constructor() {
        this.widgetsMap = this.widgetFactory.getWidgets();
    }
}