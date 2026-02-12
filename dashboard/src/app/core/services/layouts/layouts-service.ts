import { computed, inject, Injectable, signal } from '@angular/core';

import { Layout, LayoutGrids, WidgetType } from '@core/types/widgets';
import { LocalStorageService } from '@shared';

@Injectable({
    providedIn: 'root'
})
export class LayoutsService {

    private readonly layoutsKey = 'layouts';

    private readonly store = inject(LocalStorageService);
    private selectedLayoutId = signal<string | undefined>(undefined);

    private generateId() {
        return Math.random().toString(36).substring(2, 9);
    }

    public createDefaultLayout(): Layout {
        return {
            id: this.generateId(),
            layoutName: 'My Layout',
            gridSize: LayoutGrids.landscape,
            widgets: []
        };
    }

    public getCustomLayouts(): Layout[] {
        return (Object.values(this.store.get(this.layoutsKey)) || []);
    }

    public getLayoutById(id: string): Layout | undefined {
        const layouts = this.getCustomLayouts();
        return layouts.find(layout => layout.id === id);
     }

    public selectLayout(id: string) {
        this.selectedLayoutId.set(id);
    }

    public selectDefaultLayout() {
        this.selectedLayoutId.set(undefined);
    }

    public getSelectedLayout() {
        return computed(() => {
            return (this.selectedLayoutId())
            ? this.getLayoutById(this.selectedLayoutId()!)
            : undefined;
        });
    }

    public saveLayout(layout: Layout) {
        const customLayouts = this.getCustomLayouts();
        const existingIndex = customLayouts.findIndex(l => l.id === layout.id);
        if (existingIndex !== -1) {
            customLayouts[existingIndex] = layout;
        } else {
            customLayouts.push(layout);
        }
        this.store.set(this.layoutsKey, customLayouts);
    }

    public deleteLayout(id: string) {
        const customLayouts = this.getCustomLayouts().filter(l => l.id !== id);
        this.store.set(this.layoutsKey, customLayouts);
    }
}