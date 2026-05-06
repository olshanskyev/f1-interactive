import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Token, TokenService, User } from "@core/authentication";
import * as VKID from '@vkid/sdk';
import { map, Observable, of } from "rxjs";
import { from } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VKService {

    protected readonly http = inject(HttpClient);
    private oneTap: VKID.OneTap;
    private onLoginHandler?: (payload: any) => void;
    private readonly tokenService = inject(TokenService);
    private readonly VK_API_URL = '/vkproxy/method';

    constructor() {

        VKID.Config.init({
            app: 54566649,
            redirectUrl: 'https://localhost',
            responseMode: VKID.ConfigResponseMode.Callback,
            source: VKID.ConfigSource.LOWCODE
        });
        this.oneTap = new VKID.OneTap();
        this.oneTap
            .on(VKID.WidgetEvents.ERROR, this.handleError)
            .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, (payload: any) => {
                const code = payload.code;
                const deviceId = payload.device_id;
                VKID.Auth.exchangeCode(code, deviceId)
                    .then((payload) => {
                        if (this.onLoginHandler)
                            this.onLoginHandler({...payload, auth_system: 'vk', 'device_id': deviceId});
                    })
                    .catch(this.handleError);
            })

    }

    public onLoginSuccess(handler: (token: Token) => void) {
        this.onLoginHandler = handler;
    }

    private handleError(error: any) {
        console.error('VK Authorization Error:', error)
    }

    public getOneTap() {
        return this.oneTap;
    }

    public refresh(): Observable<Token | undefined> {
        if (this.tokenService.getAuthSystem() === 'vk') {
            const refreshToken = this.tokenService.getRefreshToken();
            const deviceId = this.tokenService.getDeviceId();
            if (!refreshToken || !deviceId)
                return of(undefined);
            return from(VKID.Auth.refreshToken(refreshToken, deviceId)).pipe(
                map(token => {return {...token, auth_system: 'vk', 'device_id': deviceId}})
            );
        } else {
            return of(undefined);
        }
    }

    public logout(): Observable<VKID.LogoutResult | undefined> {
        const accessToken = this.tokenService.getAccessToken();
        if (!accessToken)
            return of(undefined);
        return from(VKID.Auth.logout(accessToken));
    }

    public userInfo(): Observable<User> {
        const accessToken = this.tokenService.getAccessToken();
        if (!accessToken)
            return of({});
        return from(VKID.Auth.userInfo(accessToken)).pipe(map (
            userInfo => {
                return {
                    avatar: userInfo.user.avatar,
                    name: userInfo.user.first_name,
                    email: userInfo.user.email,
                    id: userInfo.user.user_id
                }
            }
        ));
    }

    public getVideo(ownerId: string, videoId: string) {
        const accessToken = this.tokenService.getAccessToken();
        let url = `${this.VK_API_URL}/video.get?videos=${ownerId}_${videoId}&v=5.199`;
        if (accessToken)
            url = `${url}&access_token=${accessToken}`
        return this.http.get<any>(url);

    }

}