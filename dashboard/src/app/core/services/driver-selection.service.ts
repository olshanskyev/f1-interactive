import { computed, Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DriverSelectionService {
    private driver1 = signal<string | undefined>(undefined);
    private driver2 = signal<string | undefined>(undefined);

    private selectedDrivers = computed(() => {
    const sd1 = this.driver1();
    const sd2 = this.driver2();

    const s = new Set<string>();
    if (sd1) s.add(sd1);
    if (sd2) s.add(sd2);
    return s;
  });
    public getDriver1() {
        return this.driver1.asReadonly();
    }

    public getDriver2() {
        return this.driver2.asReadonly();
    }

    public getSelectedDrivers() {
        return this.selectedDrivers;
    }

    select(driverId: string) {
        if (this.driver1() === driverId) {
            return;
        }
        if (this.driver2() === driverId) {
            return;
        }
        if (!this.driver1()) {
            this.driver1.set(driverId);
            return;
        }
        if (!this.driver2()) {
            this.driver2.set(driverId);
            return;
        }
        this.driver1.set(driverId);
    }

    deselect(driverId: string) {
        if (this.driver1() === driverId) {
            this.driver1.set(undefined);
            return;
        }
        if (this.driver2() === driverId) {
            this.driver2.set(undefined);
            return;
        }
    }

}