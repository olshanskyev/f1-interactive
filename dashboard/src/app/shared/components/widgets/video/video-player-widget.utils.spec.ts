import { describe, expect, it } from 'vitest';
import { parseVkVideoLink } from './video-player-widget.utils';

describe('parseVkVideoLink', () => {
    it('parses a VK video link', () => {
        expect(parseVkVideoLink('https://vkvideo.ru/video-111_222')).toEqual({
            ownerId: '-111',
            videoId: '222'
        });
    });

    it('parses a VK live link', () => {
        expect(parseVkVideoLink('https://vksport.vkvideo.ru/live-333_444')).toEqual({
            ownerId: '-333',
            videoId: '444'
        });
    });

    it('returns null for an invalid link', () => {
        expect(parseVkVideoLink('https://vkvideo.ru/invalid-link')).toBeNull();
    });
});