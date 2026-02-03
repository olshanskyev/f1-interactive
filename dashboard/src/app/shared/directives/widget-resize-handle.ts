import { Directive, Host, inject, Renderer2 } from '@angular/core';
import { WidgetSize } from '@core/types/widgets';
import { WidgetContainerDirective } from './widget-container';
import { Point } from '@angular/cdk/drag-drop';

@Directive({
    selector: 'div[widgetResizeHandle]',
    host: {
        '(mousedown)': 'onResizeStart($event)',
        '(touchstart)': 'onResizeStart($event)'
    }
})
export class WidgetResizeHandleDirective {

    @Host() private widgetDirective = inject(WidgetContainerDirective);
    cellSize = this.widgetDirective.cellSize;

    private renderer = inject(Renderer2);
    private initialMousePosition: Point = { x: 0, y: 0 };
    private initialSize: WidgetSize = {colSpan: 0, rowSpan: 0};
    private isResizing = false;

    private mouseMoveListener: (() => void) | undefined;
    private mouseUpListener: (() => void) | undefined;
    private touchMoveListener: (() => void) | undefined;
    private touchEndListener: (() => void) | undefined;

    private getMousePosition(event: MouseEvent | TouchEvent): Point {
        let clientX: number;
        let clientY: number;
        if (event instanceof MouseEvent) {
            clientX = event.clientX;
            clientY = event.clientY;
        } else {
        // For TouchEvent, get coordinates from the first touch point
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        }
        return {x: clientX, y: clientY};
    }

    private onResizeStart(event: MouseEvent | TouchEvent) {
        this.isResizing = true;
        this.initialSize = {...this.widgetDirective.widgetContainer().size};
        this.initialMousePosition = this.getMousePosition(event);

        // Add global listeners for mousemove and mouseup
        this.mouseMoveListener = this.renderer.listen('document', 'mousemove', this.onResizing.bind(this));
        this.mouseUpListener = this.renderer.listen('document', 'mouseup', this.onResizeEnd.bind(this));

        // Add global listeners for touchmove and touchend
        this.touchMoveListener = this.renderer.listen('document', 'touchmove', this.onResizing.bind(this));
        this.touchEndListener = this.renderer.listen('document', 'touchend', this.onResizeEnd.bind(this));

        event.stopPropagation(); // Prevent drag from starting
        event.preventDefault(); // Prevent text selection
        this.widgetDirective.displayShadow();
    }


    private newSize: WidgetSize = { colSpan: -1, rowSpan: -1};
    private onResizing(event: MouseEvent | TouchEvent) {

        if (!this.isResizing) {
            return;
        }
        const client = this.getMousePosition(event);
        const dx = client.x - this.initialMousePosition.x;
        const dy = client.y - this.initialMousePosition.y;

        const colDelta = Math.round(dx / this.cellSize());
        const rowDelta = Math.round(dy / this.cellSize());

        //const parentGrid = this.widgetDirective.parentGrid;
        const widgetContainer = this.widgetDirective.widgetContainer();
        let newColSpan = Math.max(1, this.initialSize.colSpan + colDelta);
        let newRowSpan = Math.max(1, this.initialSize.rowSpan + rowDelta);
        const maxColSpan = this.widgetDirective.gridColumns() -
            widgetContainer.position.colStart + 1;
        const maxRowSpan = this.widgetDirective.gridRows() -
            widgetContainer.position.rowStart + 1;
        newColSpan = Math.min(newColSpan, maxColSpan);
        newRowSpan = Math.min(newRowSpan, maxRowSpan);

        this.newSize = { colSpan: newColSpan, rowSpan: newRowSpan };
        const container = {...this.widgetDirective.widgetContainer(), size: this.newSize };
        this.widgetDirective.render(container);
    }


    private onResizeEnd() {
        this.widgetDirective.removeShadow();
        if (this.isResizing) {
            this.isResizing = false;
            // Clean up global listeners
            this.mouseMoveListener?.();
            this.mouseUpListener?.();
            this.touchMoveListener?.();
            this.touchEndListener?.();

            this.widgetDirective.widgetViewChanged.emit({
                 widgetIndex: this.widgetDirective.widgetIndex(),
                 container: {
                    ...this.widgetDirective.widgetContainer(),
                    size: this.newSize
                }
            });
        }
    }



}