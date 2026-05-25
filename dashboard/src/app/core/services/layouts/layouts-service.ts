import { computed, inject, Injectable, signal } from '@angular/core';
import { SettingsService } from '@core/bootstrap';
import { isMobile } from '@core/lib/device';

import { Layout, LayoutGrids } from '@core/types/widgets';
import { LocalStorageService } from '@shared';

@Injectable({
    providedIn: 'root'
})
export class LayoutsService {

    private readonly layoutsKey = 'layouts';

    private readonly store = inject(LocalStorageService);
    private settings = inject(SettingsService);
    private selectedLayoutId = signal<string | undefined>(this.settings.getSelectedLayoutId());

    private generateId() {
        return Math.random().toString(36).substring(2, 9);
    }

    private customLayouts = signal<Layout[]>(this.readCustomLayouts());
    private isEditing = signal(false);

    public createDefaultLayout(): Layout {
        return {
            id: this.generateId(),
            layoutName: 'My Layout',
            grid: (isMobile) ? LayoutGrids.portrait : LayoutGrids.landscape,
            widgets: []
        };
    }

    public getCustomLayouts() {
        return this.customLayouts.asReadonly();
    }

    public setEditing(value: boolean) {
        this.isEditing.set(value);
    }

    public getIsEditing() {
        return this.isEditing.asReadonly();
    }

    private readCustomLayouts(): Layout[] {
        return (Object.values(this.store.get(this.layoutsKey)) || []);
    }

    public getLayoutById(id: string): Layout | undefined {
        const layouts = this.customLayouts();
        return layouts.find(layout => layout.id === id);
     }

    public selectLayout(id: string | undefined) {
        this.selectedLayoutId.set(id);
        this.settings.setOptions({ selectedLayoutId: id });
    }

    public selectDefaultLayout() {
        this.selectLayout(undefined);
    }

    public getSelectedLayout() {
        return computed(() => {
            return (this.selectedLayoutId())
            ? this.getLayoutById(this.selectedLayoutId()!)
            : undefined;
        });
    }

    public saveLayout(layout: Layout) {
        const customLayouts = this.customLayouts();
        const existingIndex = customLayouts.findIndex(l => l.id === layout.id);
        if (existingIndex !== -1) {
            customLayouts[existingIndex] = layout;
        } else {
            customLayouts.push(layout);
        }
        this.store.set(this.layoutsKey, customLayouts);
        this.customLayouts.set([...customLayouts]);
    }

    public deleteLayout(id: string) {
        const customLayouts = this.customLayouts().filter(l => l.id !== id);
        this.store.set(this.layoutsKey, customLayouts);
        this.customLayouts.set([...customLayouts]);
    }
}