import { AfterViewInit, Component, ElementRef, inject, input, OnDestroy, signal, ViewChild, ChangeDetectionStrategy, effect } from '@angular/core';
import { FullScreenService } from '@core';
import { DEFAULT_CELL_SIZE, LayoutGrid } from '@core/types/widgets';


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

    gridColumns = signal<number>(32);
    gridRows = signal<number>(18);
    readonly savedLayoutGrid = input.required<LayoutGrid>();
    readonly displayGrid = input(false);

    private gridCellSize = signal(0);

    cellSize() {
        return this.gridCellSize.asReadonly();
    }

    rows() {
        return this.gridRows.asReadonly();
    }

    columns() {
        return this.gridColumns.asReadonly();
    }

    private resizeObserver!: ResizeObserver;
    private readonly fullScreenService = inject(FullScreenService);
    isFullScreen = this.fullScreenService.isFullScreen();
    isPortrait = signal<boolean>(false);

    private currentWidth = 0;
    private currentHeight = 0;

    constructor() {
        effect(() => {
            this.savedLayoutGrid();
            // Trigger recalculation if dimensions are already available
            if (this.currentWidth > 0 && this.currentHeight > 0) {
                this.calculateLayout(this.currentWidth, this.currentHeight);
            }
        });
    }

    ngAfterViewInit(): void {
        this.resizeObserver = new ResizeObserver(entries => {
            // 80 = --mat-toolbar-standard-height + 1rem padding
            const headerHeight = (this.isFullScreen())? 0: 80;
            this.currentWidth = entries[0].contentRect.width;
            this.currentHeight = window.innerHeight - headerHeight;

            this.calculateLayout(this.currentWidth, this.currentHeight);
        });
        this.resizeObserver.observe(this.backgroundGrid.nativeElement);
    }

    private calculateLayout(availableWidth: number, availableHeight: number): void {
        let cellSize = 0;

        if (this.savedLayoutGrid().fixedWidth) {
            this.isPortrait.set(true);
            let columns;
            if (this.savedLayoutGrid().columns) {
                columns = this.savedLayoutGrid().columns!;
            } else {
                columns = Math.floor(availableWidth / DEFAULT_CELL_SIZE);
            }
            // adjust cell size to fit whole width
            cellSize = (availableWidth / columns);
            this.gridColumns.set(columns);
            if (this.savedLayoutGrid().rows) {
                this.gridRows.set(this.savedLayoutGrid().rows!);
            } else {
                this.gridRows.set(Math.floor(availableHeight / cellSize));
            }

        }
        if (this.savedLayoutGrid().fixedRatio) {
            if (this.savedLayoutGrid().ratio === '16x9') {
                this.isPortrait.set(false);
                if (this.savedLayoutGrid().rows && this.savedLayoutGrid().columns) {
                    this.gridRows.set(this.savedLayoutGrid().rows!);
                    this.gridColumns.set(this.savedLayoutGrid().columns!);
                    cellSize = Math.min(
                        availableWidth / this.gridColumns(),
                        availableHeight / this.gridRows());
                } else {
                    // get max cell based on width and height and preserve 16:9 ratio
                    let cellSizeBasedOnWidth = DEFAULT_CELL_SIZE;
                    let cellSizeBasedOnHeight = DEFAULT_CELL_SIZE;

                    cellSize = DEFAULT_CELL_SIZE + 1; // start with a size larger than default to enter the loop
                    let i = 1;
                    while (cellSize > DEFAULT_CELL_SIZE) {
                        cellSizeBasedOnWidth = availableWidth / (16 * i);
                        cellSizeBasedOnHeight = availableHeight / (9 * i);
                        cellSize = Math.min(cellSizeBasedOnWidth, cellSizeBasedOnHeight);
                        i++;
                    }

                    if (cellSize === cellSizeBasedOnHeight) {
                        this.gridRows.set(Math.floor(availableHeight / cellSize));
                        // preserve 16:9 ratio
                        this.gridColumns.set(Math.floor(this.gridRows() * (16/9)));
                    } else {
                        this.gridColumns.set(Math.floor(availableWidth / cellSize));
                        // preserve 16:9 ratio
                        this.gridRows.set(Math.floor(this.gridColumns() * (9/16)));
                    }
                }

            }
        }
        setTimeout(() => this.gridCellSize.set(cellSize));
    }

    ngOnDestroy(): void {
        this.resizeObserver.unobserve(this.backgroundGrid.nativeElement);
    }

}