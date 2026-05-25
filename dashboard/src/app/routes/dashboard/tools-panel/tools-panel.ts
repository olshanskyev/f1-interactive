import { Component, computed, inject, input, model, output, ChangeDetectionStrategy, linkedSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LayoutsService } from '@core';
import { Layout, LayoutGrid, LayoutGrids, WidgetType } from '@core/types/widgets';
import { TranslateModule } from '@ngx-translate/core';
import { DebounceTime } from '@shared';
import { SelectWidgetDialog } from '@shared/components/widgets/select-widget-dialog/select-widget-dialog';
import {MatExpansionModule} from '@angular/material/expansion';

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
        MatAutocompleteModule,
        MatExpansionModule,
    ]
})
export class ToolsPanelComponent {

    private readonly dialog = inject(MatDialog);
    private readonly layoutService = inject(LayoutsService);

    // auto calculated rows/columns based on container height/width and cell size
    // if no rows/columns still saved (empty layout) these values will be used for adjustment of rows/cell size and number of rows
    readonly calculatedRows = input<number | undefined>(undefined);
    readonly calculatedColumns = input<number | undefined>(undefined);

    selectedLayout = model.required<Layout | undefined>();
    widgetAdded = output<{widgetType: WidgetType, position: {x: number, y: number}}>();
    layoutSelected = output<string | undefined>();

    private readonly MAX_COLUMNS = 160;
    private readonly MIN_COLUMNS = 16;
    maxColumnsReached = linkedSignal(() =>
        this.selectedLayout()?.grid.columns ?
            this.selectedLayout()!.grid.columns! >= this.MAX_COLUMNS :
            false
        );

    minColumnsReached = linkedSignal(() =>
        this.selectedLayout()?.grid.columns ?
            this.selectedLayout()!.grid.columns! <= this.MIN_COLUMNS :
            false
        );

    //maxColumnsReached = signal(false);
    layoutName = computed(() => this.selectedLayout()?.layoutName);

    layoutGridSizes = [
        { label: 'layout.grid_size.landscape', value: LayoutGrids.landscape },
        { label: 'layout.grid_size.portrait', value: LayoutGrids.portrait }
    ];

    openSelectWidgetDialog() {
        const dialogRef = this.dialog.open(SelectWidgetDialog, {
            panelClass: 'bordered-dialog',
            backdropClass: 'transparent-backdrop-dialog',
            width: '500px'
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
            return {...current, grid: value};
        });
        const layout = this.selectedLayout();
        if (layout) {
            this.layoutService.saveLayout(layout);
        }
    }

    compareGrids(a: LayoutGrid, b: LayoutGrid): boolean {
        return a && b && a.fixedRatio === b.fixedRatio
        && a.ratio === b.ratio
        && a.fixedWidth === b.fixedWidth;
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

    adjustRows(diff: number) {
        const selectedLayout = this.selectedLayout();
        if (selectedLayout && !selectedLayout.grid.fixedRatio) {
            const currentRows = selectedLayout.grid.rows || this.calculatedRows();
            if (!currentRows) return;
            if (diff < 0 && currentRows <= 1)  return;
            selectedLayout.grid = {...selectedLayout.grid, rows: currentRows + diff};
            this.updateLayoutGrid(selectedLayout.grid);
        }
    }

    adjustCellSize(diff: number) {
        const selectedLayout = this.selectedLayout();
        if (!selectedLayout) return;
        let currentColumns = selectedLayout.grid.columns || this.calculatedColumns();
        if (selectedLayout.grid.fixedWidth) {
            // change number of columns so cell size will be adjusted to fit the width
            if (!currentColumns) return;
            if (diff < 0 && currentColumns <= 1)  return;
            currentColumns += diff;
            selectedLayout.grid = {...selectedLayout.grid, columns: currentColumns};
        } else {
            const currentRows = selectedLayout.grid.rows || this.calculatedRows();
            const ratio = selectedLayout.grid.ratio;
            if (ratio === '16x9' && currentRows && currentColumns) {
                // change number of rows/columns to keep the 16:9 ratio
                let multiplier = currentRows / 9;
                if (diff < 0 && multiplier <= 1) return;
                multiplier += diff;
                selectedLayout.grid = {...selectedLayout.grid,
                    rows: 9 * multiplier, columns: 16 * multiplier
                };
            }
        }
        this.updateLayoutGrid(selectedLayout.grid);
    }
}