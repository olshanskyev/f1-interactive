
import { CdkDragEnd, CdkDragMove, CdkDragStart, Point } from '@angular/cdk/drag-drop';
import { computed, Directive, effect, ElementRef, Host, inject, input, output, Renderer2, Signal } from '@angular/core';
import { WidgetContainer, WidgetPosition } from '@core/types/widgets';
import { GridContainerComponent } from '@shared/components';


@Directive({
    selector: 'div[widgetContainer]',
    host: {
        '(cdkDragMoved)': 'onDragging($event)',
        '(cdkDragStarted)': 'onDragStart($event)',
        '(cdkDragEnded)': 'onDragEnd($event)',
    }
})
export class WidgetContainerDirective {

    @Host() private parentGrid = inject(GridContainerComponent);
    private el = inject(ElementRef);
    private renderer = inject(Renderer2);

    readonly widgetContainer = input.required<WidgetContainer>();
    readonly widgetIndex = input.required<number>();
    widgetViewChanged = output<{widgetIndex: number, container: WidgetContainer}>();

    cellSize = this.parentGrid.cellSize();
    gridRows = this.parentGrid.gridRows;
    gridColumns = this.parentGrid.gridColumns;

    private newPositionSet = false;

    constructor() {
        effect(() => { // effect to dynamically track input changes
            this.render(this.widgetContainer());
        });
    }

    removeShadow() {
        const shadow = (this as any)._shadowPreview;
        if (shadow && shadow.parentElement) {
            shadow.parentElement.removeChild(shadow);
            (this as any)._shadowPreview = null;
        }
    }

    displayShadow(container?: WidgetContainer) {
        this.removeShadow();

        const parent = this.el.nativeElement.parentElement;
        const shadow = document.createElement('div');
        shadow.className = 'widget-shadow-preview';
        const containerToDisplay = container ?? this.widgetContainer();
        shadow.style.gridColumn = `${containerToDisplay.position.colStart} / span ${containerToDisplay.size.colSpan}`;
        shadow.style.gridRow = `${containerToDisplay.position.rowStart} / span ${containerToDisplay.size.rowSpan}`;

        // Place shadow in the same grid container
        parent.appendChild(shadow);
        // Store reference for later removal
        (this as any)._shadowPreview = shadow;
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
            * this.cellSize();
        const totalGridHeight = parentGrid.gridRows()
            * this.cellSize();
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
        const containerToDisplay = this.newPositionSet ?
            { ...this.widgetContainer(), position: this.newPosition } :
            this.widgetContainer();
        this.displayShadow(containerToDisplay);
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
        const cellSize = this.cellSize();
        return {
            x: Math.round(relativeX / cellSize) * cellSize,
            y: Math.round(relativeY / cellSize) * cellSize
        };
    }

    private snappedPosition(snapped: Point): WidgetPosition {
        const cellSize = this.cellSize();
        return {
            colStart: Math.round(snapped.x / cellSize) + 1,
            rowStart: Math.round(snapped.y / cellSize) + 1
        };
    }

    private boundedPosition(position: WidgetPosition): WidgetPosition {

        // Bounding (ensure it stays within grid limits)
        const maxCol = this.parentGrid.gridColumns() - (this.widgetContainer().size.colSpan - 1);
        const maxRow = this.parentGrid.gridRows() - (this.widgetContainer().size.rowSpan - 1);

        position.colStart = Math.min(Math.max(1, position.colStart), maxCol);
        position.rowStart = Math.min(Math.max(1, position.rowStart), maxRow);
        return position;
    }

    private newPosition: WidgetPosition = {
        colStart: 0,
        rowStart: 0
    };

    onDragging(event: CdkDragMove) {
        const snapped = this.computeSnap(event);

        const newSnappedPosition = this.snappedPosition(snapped);

        if (newSnappedPosition.colStart !== this.newPosition.colStart
            || newSnappedPosition.rowStart !== this.newPosition.rowStart) {
            this.newPositionSet = true;
            this.newPosition = this.boundedPosition(newSnappedPosition);
            this.displayShadow({...this.widgetContainer(), position: this.newPosition});
            return;
        }
    }

    onDragEnd(event: CdkDragEnd) {
        event.source.reset();
        this.removeShadow();
        const newContainer = {...this.widgetContainer(), position: this.newPosition};
        this.widgetViewChanged.emit(
        {
            widgetIndex: this.widgetIndex(),
            container: newContainer
        });
    }

    height(): Signal<number> {
            return computed(() => this.cellSize() * this.widgetContainer().size.rowSpan
        )
    }
}