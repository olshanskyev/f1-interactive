import { Component, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { ContaineredWidget } from '../containered-widget';
import { SafeUrlPipe } from '@shared/pipes';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { VKService } from '@core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, of, switchMap } from 'rxjs';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
    selector: 'video-player-widget',
    styleUrl:'./video-player-widget.scss',
    templateUrl: './video-player-widget.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        SafeUrlPipe,
        MatIconModule,
        TranslateModule
    ]
})
export class VideoPlayerWidget extends ContaineredWidget {

    private readonly vkService = inject(VKService);
    private readonly toastr = inject(HotToastService);

    private videoParams = computed(() => {
        const link = this.settings()?.['link']?.toString();
        const source = this.settings()?.['source']?.toString();

        if (link && source === 'VK') {
            const match = link.match(/video(?<ownerId>[-\d]+)_(?<videoId>\d+)/);
            if (match?.groups) {
            return {
                ownerId: match.groups['ownerId'],
                videoId: match.groups['videoId']
            };
            }
        }
        return null;
    });

    public src = toSignal(
        toObservable(this.videoParams).pipe(
            switchMap(params => {
                if (!params) return of(undefined);

                return this.vkService.getVideo(params.ownerId, params.videoId).pipe(
                    map(res => {
                        if (res.error) {
                            this.toastr.error('Video Error: ' + res.error.error_msg);
                            return undefined;
                        }
                        return res.response.items[0]?.player
                    })
                );
            })
        ),
        { initialValue: undefined }
    );
}