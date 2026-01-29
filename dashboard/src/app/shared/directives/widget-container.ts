import { CdkDragMove, CdkDragStart, Point } from "@angular/cdk/drag-drop";
import { Directive, effect, ElementRef, Host, inject, input, output, Renderer2 } from "@angular/core";
import { WidgetPosition, WidgetSize } from "@core/types/widgets";
import { GridContainerComponent } from "@shared/components";

export type WidgetContainer = {
    position: WidgetPosition
    size: WidgetSize
};

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
    @Host() private parentGrid = inject(GridContainerComponent);

    readonly widgetContainer = input.required<WidgetContainer>();
    readonly widgetId = input.required<string>();
    positionChanged = output<{widgetId: string, position: WidgetPosition}>();

    constructor() {
        effect(() => { // effect to dynamically track input changes
            this.render(this.widgetContainer());
        })
    }

    private render(container: WidgetContainer) {
        if (container.position) {
            this.renderer.setStyle(this.el.nativeElement, 'grid-column', `${container.position.colStart} / span ${container.size.colSpan}`);
            this.renderer.setStyle(this.el.nativeElement, 'grid-row', `${container.position.rowStart} / span ${container.size.rowSpan}`);
        }
    }

    private containerOffset = { x: 0, y: 0};
    private calcParentContainerOffset() {
        // Get the container's position on the screen
        const containerRect = this.parentGrid.backgroundGrid.nativeElement.getBoundingClientRect();

        // Calculate the centering "whitespace"
        const totalGridWidth = this.parentGrid.gridColumns() * this.parentGrid.gridCellSize();
        const totalGridHeight = this.parentGrid.gridRows() * this.parentGrid.gridCellSize();
        const containerOffsetX = (containerRect.width - totalGridWidth) / 2;
        const containerOffsetY = (containerRect.height - totalGridHeight) / 2;

        // Find the EXACT start of the first cell on the screen
        this.containerOffset = {x: containerRect.left + containerOffsetX, y: containerRect.top + containerOffsetY};
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
            clientX = nativeEvent.touches[0].clientX;
            clientY = nativeEvent.touches[0].clientY;
        }
        this.dragOffset = {x: clientX - rect.left, y: clientY - rect.top};
    }

    // to save mause position related to container and container offset
    onDragStart(event: CdkDragStart) {
        this.calcDragOffset(event.event, event.source.element.nativeElement.getBoundingClientRect());
        this.calcParentContainerOffset();
    }

    private computeSnap(event: CdkDragMove): Point {
        const { x, y } = event.pointerPosition;

        // Relative position
        const relativeX = x - this.containerOffset.x - this.dragOffset.x;
        const relativeY = y - this.containerOffset.y - this.dragOffset.y;

        // Snap based on the relative position
        return {
            x: Math.round(relativeX / this.parentGrid.gridCellSize()) * this.parentGrid.gridCellSize(),
            y: Math.round(relativeY / this.parentGrid.gridCellSize()) * this.parentGrid.gridCellSize()
        }
    }

    private boundePosition(snapped: Point): WidgetPosition {
        const position = {
            colStart: Math.floor(snapped.x / this.parentGrid.gridCellSize()) + 1,
            rowStart: Math.floor(snapped.y / this.parentGrid.gridCellSize()) + 1
        }

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
    }
    onDragging(event: CdkDragMove) {
        const snapped = this.computeSnap(event);
        this.newPosition = this.boundePosition(snapped);

        event.source.reset(); // to stop default cdkDrag event
        this.render({...this.widgetContainer(), position: this.newPosition});

    }

    onDragEnd() {
        this.positionChanged.emit({
            widgetId: this.widgetId(),
            position: this.newPosition
        })
    }
}