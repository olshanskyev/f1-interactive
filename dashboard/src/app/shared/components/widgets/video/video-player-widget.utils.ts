export interface VkVideoParams {
    ownerId: string;
    videoId: string;
}

export function parseVkVideoLink(link: string): VkVideoParams | null {
    const match = link.match(/\/(?:video|live)(?<ownerId>[-\d]+)_(?<videoId>\d+)/);
    const ownerId = match?.groups?.['ownerId'];
    const videoId = match?.groups?.['videoId'];

    return ownerId && videoId ? { ownerId, videoId } : null;
}