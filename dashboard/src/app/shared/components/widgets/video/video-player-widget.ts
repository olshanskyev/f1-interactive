import { Component, computed } from '@angular/core';
import { ContaineredWidget } from '../containered-widget';
import { SafeUrlPipe } from '@shared/pipes';

@Component({
    selector: 'video-player-widget',
    styleUrl:'./video-player-widget.scss',
    templateUrl: './video-player-widget.html',
    imports: [
        SafeUrlPipe
    ]
})
export class VideoPlayerWidget extends ContaineredWidget {
    src = computed(() => {
        return this.getVideoEmbedUrl(this.settings()?.['embedCode'].toString());
    });


    private getVideoEmbedUrl(param: string | undefined): string | undefined {
        // ToDo get url from vkvideo get request (authorization may be required)
        if (param) {
            if (this.settings()?.['source'].toString() === 'VK') {
                const srcMatch = param.match(/src="([^"]+)"/);
                return srcMatch?.[1];
            } else {
                return undefined;
            }

        }
        return undefined;
    }
}