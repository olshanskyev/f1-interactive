import { Component, computed, ChangeDetectionStrategy, inject, ElementRef, viewChild, Signal, effect, signal } from '@angular/core';
import { ContaineredWidget } from '../containered-widget';
import { SafeUrlPipe } from '@shared/pipes';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService, VKService } from '@core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, of, switchMap, combineLatest, startWith } from 'rxjs';
import { VideoSource } from '@core/types/widgets';

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
    private translate = inject(TranslateService);
    readonly authService = inject(AuthService);

    private vkButtonContainer = viewChild<ElementRef>('vkButtonContainer');
    VideoSource = VideoSource;
    sourceSetting: Signal<VideoSource> = computed(() => this.settings()?.['source']?.toString());
    error = signal<string>('');

    private videoParams = computed(() => {
        const link = this.settings()?.['link']?.toString();
        const source = this.sourceSetting();

        if (link && source === VideoSource.VK) {
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
        combineLatest([
            toObservable(this.videoParams),
            this.authService.change().pipe(startWith(null))
        ]).pipe(
            switchMap(([params]) => {
                if (!params) return of(undefined);
                if (this.sourceSetting() !== VideoSource.VK) return of(undefined);

                this.error.set('');
                return this.vkService.getVideo(params.ownerId, params.videoId).pipe(
                    map(res => {
                        if (res.error) {
                            this.error.set(this.translate.instant('widget.loading_video_error') + '. ' + res.error.error_msg);
                            return undefined;
                        }
                        return res.response.items[0]?.player;
                    })
                );
            })
        ),
        { initialValue: undefined }
    );

    constructor() {
        super();
        effect(() => {
            if (this.sourceSetting() === VideoSource.VK &&
                !this.authService.isVkLoggedIn() &&
                this.vkButtonContainer()
            ) {
                    this.vkService.renderOneTap(this.vkButtonContainer()!);
            }
        });
    }
}