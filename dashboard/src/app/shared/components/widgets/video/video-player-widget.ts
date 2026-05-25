import { Component, computed, ChangeDetectionStrategy, inject, ElementRef, viewChild, Signal, effect, signal } from '@angular/core';
import { ContaineredWidget } from '../containered-widget';
import { SafeUrlPipe } from '@shared/pipes';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService, VKService } from '@core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, of, switchMap, combineLatest, startWith, distinctUntilChanged, shareReplay, Observable, catchError, defer, finalize } from 'rxjs';
import { VideoSource } from '@core/types/widgets';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'video-player-widget',
    styleUrl:'./video-player-widget.scss',
    templateUrl: './video-player-widget.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        SafeUrlPipe,
        MatIconModule,
        TranslateModule,
        MatProgressSpinnerModule
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
    isLoading = signal(false);

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

    private playerUrl: Observable<string | undefined> = combineLatest([
        toObservable(this.videoParams),
        this.authService.change().pipe(startWith(null))
    ]).pipe(
        switchMap(([params]) => {
            if (!params || this.sourceSetting() !== VideoSource.VK) {
                return of(undefined);
            }
            this.error.set('');
            return defer(() =>  {
                this.isLoading.set(true);
                return this.vkService.getVideo(params.ownerId, params.videoId);
            }).pipe(
                catchError(err => {
                    console.error(err);
                    this.error.set(this.translate.instant('widget.loading_video_error'));
                    return of(undefined);
                }),
                map(res => {
                    if (res.error) {
                        this.error.set(this.translate.instant('widget.loading_video_error') + '. ' + res.error.error_msg);
                        return undefined;
                    }
                    if (!res.response?.items?.length) {
                        this.error.set(this.translate.instant('widget.video_not_found_error'));
                        return undefined;
                    }
                    if (res.response.items[0].content_restricted) {
                        this.error.set(this.translate.instant('widget.video_content_restricted_error'));
                        return undefined;
                    }
                    const playerUrl = res.response.items[0]?.player;
                    if (!playerUrl) return undefined;
                    return playerUrl.includes('?')
                        ? `${playerUrl}&playsinline=1`
                        : `${playerUrl}?playsinline=1`;
                }),
                finalize(() => this.isLoading.set(false))
            );
        }),
        shareReplay(1)
    );

    src = toSignal(
        this.playerUrl.pipe(
            distinctUntilChanged((prev, curr) => {
                // checking if it is the same video, because VK returns different player url on each request
                if (!prev) return false;

                const getIds = (url: string | undefined) => {
                    if (!url) return '';
                    const oid = url.match(/oid=(?<oid>[-\d]+)/)?.groups?.['oid'];
                    const id = url.match(/id=(?<id>\d+)/)?.groups?.['id'];
                    return oid && id ? `${oid}_${id}` : url;
                };

                return getIds(prev) === getIds(curr);
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
                    this.vkService.renderOneTap(this.vkButtonContainer()!, {width: 300});
            }
        });
    }
}