import { Point } from '@angular/cdk/drag-drop';
import { GridContainerComponent } from '@shared';

export function calcGridOffset(parentGrid: GridContainerComponent): Point {
    // Get the container's position on the screen
    const containerRect = parentGrid.backgroundGrid.nativeElement.getBoundingClientRect();
    const cellSize = parentGrid.cellSize()();
    // Calculate the centering "whitespace"
    const totalGridWidth = parentGrid.gridColumns() * cellSize;
    const totalGridHeight = parentGrid.gridRows() * cellSize;
    const containerOffsetX = (containerRect.width - totalGridWidth) / 2;
    const containerOffsetY = (containerRect.height - totalGridHeight) / 2;

    // Find the EXACT start of the first cell on the screen
    return {
        x: containerRect.left + containerOffsetX,
        y: containerRect.top + containerOffsetY
    };
}