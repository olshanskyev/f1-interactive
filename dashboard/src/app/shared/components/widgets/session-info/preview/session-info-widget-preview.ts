import { Component, Injectable, signal } from '@angular/core';
import { ContaineredWidget } from '../../containered-widget';
import { LiveService } from '@core/services/live/live.service';
import { SessionInfoWidget } from '../session-info-widget';


@Injectable()
class MockLiveService {

    clock = signal<any | undefined>(JSON.parse(`{
        "Utc": "2024-11-03T14:00:00Z",
        "Remaining": "00:15:30",
        "Extrapolating": true
    }`));
    sessionInfo = signal<any | undefined>(JSON.parse(`{
        "Meeting": {
            "Name": "Abu Dhabi Grand Prix",
            "Country": {
                "Code": "UAE",
                "Name": "United Arab Emirates"
            },
            "Circuit": {
                "ShortName": "Yas Marina Circuit"
            }
        },
        "Name": "Qualifying"
    }`));

    trackStatus = signal<any | undefined>(JSON.parse(`{
		"Message": "AllClear"
	}`));
    sessionStatus = signal<any | undefined>(JSON.parse(`{
        "Status": "Started"
    }`));

    getExtrapolatedClockSignal() {
        return this.clock.asReadonly();
    }
    getSessionInfoSignal() {
        return this.sessionInfo.asReadonly();
    }
    getTrackStatusSignal() {
        return this.trackStatus.asReadonly();
    }
    getSessionStatusSignal() {
        return this.sessionStatus.asReadonly();
    }
}

@Component({
    selector: 'session-info-widget-preview',
    imports: [
        SessionInfoWidget
    ],
    providers: [
            { provide: LiveService, useClass: MockLiveService }
    ],
    template: `
        <div class="widget-preview-container">
                <session-info-widget [settings]="settings()"/>
        </div>
    `
})
export class SessionInfoWidgetPreview extends ContaineredWidget {

}