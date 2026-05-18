import { HttpClient } from '@angular/common/http';
import { ElementRef, inject, Injectable } from '@angular/core';
import { Token, TokenService, User } from '@core/authentication';
import * as VKID from '@vkid/sdk';
import { map, Observable, of } from 'rxjs';
import { from } from 'rxjs';
import { environment } from '@env/environment';
import { SettingsService } from '@core';

@Injectable({
    providedIn: 'root'
})
export class VKService {

    protected readonly http = inject(HttpClient);
    private readonly settings = inject(SettingsService);
    private oneTap: VKID.OneTap | undefined = undefined;
    private initialized = false;
    private onLoginHandler?: (payload: any) => void;
    private readonly tokenService = inject(TokenService);
    private readonly VK_API_URL = '/vkproxy/method';
    private readonly locale = this.settings.getLocaleSignal();

    private initConfig() {
        if (!this.initialized) {
            VKID.Config.init({
                app: environment.vkAppId,
                redirectUrl: environment.vkRedirectUrl,
                responseMode: VKID.ConfigResponseMode.Callback,
                source: VKID.ConfigSource.LOWCODE
            });
            this.initialized = true;
        }
    }

    private createOneTap(): VKID.OneTap {
        const oneTap = new VKID.OneTap();
        oneTap
            .on(VKID.WidgetEvents.ERROR, this.handleError)
            .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, (payload: any) => {
                const code = payload.code;
                const deviceId = payload.device_id;
                VKID.Auth.exchangeCode(code, deviceId)
                    .then((payload) => {
                        if (this.onLoginHandler)
                            this.onLoginHandler({...payload, auth_system: 'vk', device_id: deviceId});
                    })
                    .catch(this.handleError);
            });
        return oneTap;
    }

    public onLoginSuccess(handler: (token: Token) => void) {
        this.onLoginHandler = handler;
    }

    private handleError(error: any) {
        console.error('VK Authorization Error:', error);
    }

    public renderOneTap(container: ElementRef<any>, styles?: Partial<VKID.OneTapStyles>) {
        this.initConfig();
        this.oneTap = this.createOneTap();
        container.nativeElement.innerHTML = '';
        this.oneTap.render({
            container: container.nativeElement,
            showAlternativeLogin: true,
            styles: {
                height: 40,
                borderRadius: 50,
                ...styles
            },
            lang: (this.locale() === 'ru-RU') ? VKID.Languages.RUS : VKID.Languages.ENG
        });
    }

    public refresh(): Observable<Token | undefined> {
        if (this.tokenService.getAuthSystem() === 'vk') {
            this.initConfig();
            const refreshToken = this.tokenService.getRefreshToken();
            const deviceId = this.tokenService.getDeviceId();
            if (!refreshToken || !deviceId)
                return of(undefined);
            return from(VKID.Auth.refreshToken(refreshToken, deviceId)).pipe(
                map(token => {return {...token, auth_system: 'vk', device_id: deviceId};})
            );
        } else {
            return of(undefined);
        }
    }

    public logout(): Observable<VKID.LogoutResult | undefined> {
        this.initConfig();
        const accessToken = this.tokenService.getAccessToken();
        if (!accessToken)
            return of(undefined);
        return from(VKID.Auth.logout(accessToken));
    }

    public userInfo(): Observable<User> {
        this.initConfig();
        const accessToken = this.tokenService.getAccessToken();
        if (!accessToken)
            return of({});
        return from(VKID.Auth.userInfo(accessToken)).pipe(
            map(userInfo => ({
                avatar: userInfo.user.avatar,
                name: userInfo.user.first_name,
                email: userInfo.user.email,
                id: userInfo.user.user_id
            }))
        );
    }

    private buildApiUrl(method: string, params: Record<string, any> = {}): string {
        const accessToken = this.tokenService.getAccessToken();
        let url = `${this.VK_API_URL}/${method}?v=5.199`;
        if (accessToken) {
            url = `${url}&access_token=${accessToken}`;
        }
        for (const [key, value] of Object.entries(params)) {
            url = `${url}&${key}=${value}`;
        }
        return url;
    }

    public getVideo(ownerId: string, videoId: string) {
        const url = this.buildApiUrl('video.get', { videos: `${ownerId}_${videoId}` });
        return this.http.get<any>(url);

    }

}