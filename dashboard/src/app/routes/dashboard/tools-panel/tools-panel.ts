import { Component, computed, inject, input, model, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LayoutsService } from '@core';
import { Layout, LayoutGrids, WidgetType } from '@core/types/widgets';
import { TranslateModule } from '@ngx-translate/core';
import { DebounceTime } from '@shared';
import { SelectWidgetDialog } from '@shared/components/widgets/select-widget-dialog/select-widget-dialog';

@Component({
    selector: 'tools-panel',
    templateUrl: './tools-panel.html',
    styleUrls: ['./tools-panel.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        FormsModule,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        TranslateModule,
        DebounceTime,
        MatSelectModule,
        MatAutocompleteModule
    ]
})
export class ToolsPanelComponent {

    private readonly dialog = inject(MatDialog);
    private readonly layoutService = inject(LayoutsService);

    cellSize = input.required<number>();
    selectedLayout = model.required<Layout | undefined>();
    widgetAdded = output<{widgetType: WidgetType, position: {x: number, y: number}}>();
    layoutSelected = output<string | undefined>();

    layoutName = computed(() => this.selectedLayout()?.layoutName);


    layoutGridSizes = [
        { label: 'layout.grid_size.landscape', value: LayoutGrids.landscape },
        { label: 'layout.grid_size.mobile_portrait', value: LayoutGrids.mobile_portrait }
    ];

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

    updateLayoutName(name: string | undefined) {
        if (name && this.selectedLayout()) {
            this.selectedLayout.update(current => {
                if (!current) return current;
                return {...current, layoutName: name};
            });
            this.layoutService.saveLayout(this.selectedLayout()!);
        }
    }

    updateLayoutGrid(value: any){
        this.selectedLayout.update(current => {
            if (!current) return current;
            return {...current, gridSize: value};
        });
        const layout = this.selectedLayout();
        if (layout) {
            this.layoutService.saveLayout(layout);
        }
    }

    compareGridSizes(a: any, b: any): boolean {
        return a && b && a.gridColumns === b.gridColumns && a.gridRows === b.gridRows;
    }

    onSelectLayout(layout: Layout) {
        if (this.selectedLayout()?.id !== layout.id) {
            this.layoutSelected.emit(layout.id);
            this.layoutService.selectLayout(layout.id);
        }
    }

    displayLayout(layout: Layout | string | null): string {
        if (!layout) return '';
            return typeof layout === 'string' ? layout : layout.layoutName;
    }
}