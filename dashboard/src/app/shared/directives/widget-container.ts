import { CdkDragMove, CdkDragStart, Point } from '@angular/cdk/drag-drop';
import { Directive, effect, ElementRef, Host, inject, input, output, Renderer2 } from '@angular/core';
import { WidgetContainer, WidgetPosition } from '@core/types/widgets';
import { GridContainerComponent } from '@shared/components';


@Directive({
    selector: 'div[widgetContainer]',
    host: {
        '(cdkDragMoved)': 'onDragging($event)',
        '(cdkDragStarted)': 'onDragStart($event)',
        '(cdkDragEnded)': 'onDragEnd()',
    }
})
export class WidgetContainerDirective {

    private el = inject(ElementRef);
    private renderer = inject(Renderer2);
    @Host() parentGrid = inject(GridContainerComponent);

    readonly widgetContainer = input.required<WidgetContainer>();
    readonly widgetIndex = input.required<number>();
    widgetViewChanged = output<{widgetIndex: number, container: WidgetContainer}>();

    constructor() {
        effect(() => { // effect to dynamically track input changes
            this.render(this.widgetContainer());
        });
    }


    render(container: WidgetContainer) {
        this.renderer.setStyle(this.el.nativeElement, 'grid-column',
                `${container.position.colStart} / span ${container.size.colSpan}`);
        this.renderer.setStyle(this.el.nativeElement, 'grid-row',
                `${container.position.rowStart} / span ${container.size.rowSpan}`);
    }

    private containerOffset = { x: 0, y: 0};
    private calcParentContainerOffset() {
        // Get the container's position on the screen
        const containerRect = this.parentGrid.backgroundGrid.nativeElement.getBoundingClientRect();

        const parentGrid = this.parentGrid;
        // Calculate the centering "whitespace"
        const totalGridWidth = parentGrid.gridColumns()
            * parentGrid.gridCellSize();
        const totalGridHeight = parentGrid.gridRows()
            * parentGrid.gridCellSize();
        const containerOffsetX = (containerRect.width - totalGridWidth) / 2;
        const containerOffsetY = (containerRect.height - totalGridHeight) / 2;

        // Find the EXACT start of the first cell on the screen
        this.containerOffset = {
            x: containerRect.left + containerOffsetX,
            y: containerRect.top + containerOffsetY
        };
    }

    private dragOffset = { x: 0, y: 0 };
    private calcDragOffset(nativeEvent: MouseEvent | TouchEvent, rect: any) {
        let clientX: number;
        let clientY: number;
        if (nativeEvent instanceof MouseEvent) {
            clientX = nativeEvent.clientX;
            clientY = nativeEvent.clientY;
        } else {
        // For TouchEvent, get coordinates from the first touch point
            const touch = nativeEvent.touches[0]; clientX = touch.clientX; clientY = touch.clientY;
        }
        this.dragOffset = {x: clientX - rect.left, y: clientY - rect.top};
    }

    // to save mause position related to container and container offset
    onDragStart(event: CdkDragStart) {
        this.calcDragOffset(event.event,
            event.source.element.nativeElement.getBoundingClientRect());
        this.calcParentContainerOffset();
    }

    private computeSnap(event: CdkDragMove): Point {
        const { x, y } = event.pointerPosition;

        // Relative position
        const relativeX = x - this.containerOffset.x - this.dragOffset.x;
        const relativeY = y - this.containerOffset.y - this.dragOffset.y;

        // Snap based on the relative position
        const cellSize = this.parentGrid.gridCellSize();
        return {
            x: Math.round(relativeX / cellSize) * cellSize,
            y: Math.round(relativeY / cellSize) * cellSize
        };
    }

    private boundePosition(snapped: Point): WidgetPosition {
        const cellSize = this.parentGrid.gridCellSize();
        const floorX = snapped.x / cellSize;
        const floorY = snapped.y / cellSize;
        const position = {
            colStart: Math.floor(floorX) + 1,
            rowStart: Math.floor(floorY) + 1
        };

        // Bounding (ensure it stays within grid limits)
        const maxCol = this.parentGrid.gridColumns() - (this.widgetContainer().size.colSpan - 1);
        const maxRow = this.parentGrid.gridRows() - (this.widgetContainer().size.rowSpan - 1);

        position.colStart = Math.min(Math.max(1, position.colStart), maxCol);
        position.rowStart = Math.min(Math.max(1, position.rowStart), maxRow);
        return position;
    }

    private newPosition: WidgetPosition = {
        colStart: -1,
        rowStart: -1
    };
    onDragging(event: CdkDragMove) {
        const snapped = this.computeSnap(event);
        this.newPosition = this.boundePosition(snapped);

        event.source.reset(); // to stop default cdkDrag event
        this.render({...this.widgetContainer(), position: this.newPosition});
    }

    onDragEnd() {
       this.widgetViewChanged.emit(
        {
            widgetIndex: this.widgetIndex(),
            container: {...this.widgetContainer(), position: this.newPosition}
        });
    }
}