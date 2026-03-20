import { AfterViewInit, Component, ElementRef, inject, input, OnDestroy, signal, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FullScreenService } from '@core';


@Component({
    selector: 'grid-container',
    styleUrl:'./grid-container.scss',
    templateUrl: 'grid-container.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [

    ],
    host: {
        '[style.--grid-columns]': 'gridColumns()',
        '[style.--grid-rows]': 'gridRows()',
        '[style.--cell-size.px]': 'gridCellSize()'
    }
})
export class GridContainerComponent implements AfterViewInit, OnDestroy {

    @ViewChild('backgroundGrid') backgroundGrid!: ElementRef;

    readonly gridColumns = input(32);
    readonly gridRows = input(18);
    readonly displayGrid = input(false);

    private gridCellSize = signal(0);

    cellSize() {
        return this.gridCellSize.asReadonly();
    }

    private resizeObserver!: ResizeObserver;
    private readonly fullScreenService = inject(FullScreenService);
    isFullScreen = this.fullScreenService.isFullScreen();
    isPortrait = signal<boolean>(false);

    ngAfterViewInit(): void {

        this.resizeObserver = new ResizeObserver(entries => {
            // 80 = --mat-toolbar-standard-height + 1rem padding
            const headerHeight = (this.isFullScreen())? 0: 80;

            const availableWidth = entries[0].contentRect.width;
            const availableHeight = window.innerHeight - headerHeight;

            let cellSize: number;
            this.isPortrait.set(window.innerHeight > window.innerWidth);
            if (this.isPortrait()) { //portrait
                cellSize = availableWidth / this.gridColumns();
            } else {
                cellSize = Math.min(
                    availableWidth / this.gridColumns(),
                    availableHeight / this.gridRows()
                );
            }
            setTimeout(() => this.gridCellSize.set(cellSize));
        });
        this.resizeObserver.observe(this.backgroundGrid.nativeElement);
    }

    ngOnDestroy(): void {
        this.resizeObserver.unobserve(this.backgroundGrid.nativeElement);
    }

}