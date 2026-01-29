import { CommonModule } from "@angular/common";
import { Component, inject, signal, Type } from "@angular/core";
import { WidgetFactory,  } from "@core/services/widget-factory";
import { GridContainerComponent, SelectWidgetDialog, WidgetContainerDirective } from "@shared";
import { MatDialog } from '@angular/material/dialog';
import { CdkDrag } from '@angular/cdk/drag-drop'
import { DisplayWidget, Layout, LayoutGrids } from "@core/types/widgets";
import { LayoutsService } from "@core";

@Component({
    selector: 'app-build-layout',
    styleUrl: 'build-layout.scss',
    templateUrl: 'build-layout.html',
    imports: [
        CommonModule,
        GridContainerComponent,
        WidgetContainerDirective,
        CdkDrag
    ]
})
export class BuildLayoutComponent {

    private readonly widgetFactory = inject(WidgetFactory);
    private readonly layoutsService = inject(LayoutsService);
    private dialog = inject(MatDialog);
    displayWidgets = signal<DisplayWidget[] | undefined>(undefined);
    selectedLayout = signal<Layout>({
        layoutName: 'myLayout1',
        gridSize: LayoutGrids.landscape,
        widgets: []
    });

    openSelectWidgetDialog() {
        const dialogRef = this.dialog.open(SelectWidgetDialog, {
            width: '500px',
        });
    }

    private loadWidgets(layout: Layout) {
        const toDisplay: DisplayWidget[] = layout.widgets.map(item => {
            const widget = this.widgetFactory.getWidgetByType(item.type);
            return {...item, el: widget!.widgetPreview};
        });
        this.displayWidgets.set(toDisplay);
    }

    constructor() {
        const preSelectedLayout = this.layoutsService.getSelectedLayout()();
        if (preSelectedLayout) {
            this.selectedLayout.set(preSelectedLayout);
            this.loadWidgets(preSelectedLayout);
        }


    }
}