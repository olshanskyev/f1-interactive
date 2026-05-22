
export const DRIVER_PHOTO_BY_TLA: Record<string, string> = {
	ANT: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/mercedes/andant01/2026mercedesandant01right.webp',
	RUS: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/mercedes/georus01/2026mercedesgeorus01right.webp',
	HAM: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/ferrari/lewham01/2026ferrarilewham01right.webp',
	LEC: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/ferrari/chalec01/2026ferrarichalec01right.webp',
	VER: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/redbullracing/maxver01/2026redbullracingmaxver01right.webp',
	NOR: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/mclaren/lannor01/2026mclarenlannor01right.webp',
	PIA: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/mclaren/oscpia01/2026mclarenoscpia01right.webp',
	LIN: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/racingbulls/arvlin01/2026racingbullsarvlin01right.webp',
	HUL: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/audi/nichul01/2026audinichul01right.webp',
	ALO: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/astonmartin/feralo01/2026astonmartinferalo01right.webp',
	BOR: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/audi/gabbor01/2026audigabbor01right.webp',
	HAD: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/redbullracing/isahad01/2026redbullracingisahad01right.webp',
	OCO: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/haasf1team/estoco01/2026haasf1teamestoco01right.webp',
	ALB: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/williams/alealb01/2026williamsalealb01right.webp',
	SAI: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/williams/carsai01/2026williamscarsai01right.webp',
	GAS: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/alpine/piegas01/2026alpinepiegas01right.webp',
	STR: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/astonmartin/lanstr01/2026astonmartinlanstr01right.webp',
	LAW: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/racingbulls/lialaw01/2026racingbullslialaw01right.webp',
	BEA: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/haasf1team/olibea01/2026haasf1teamolibea01right.webp',
	BOT: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/cadillac/valbot01/2026cadillacvalbot01right.webp',
	PER: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/cadillac/serper01/2026cadillacserper01right.webp',
	COL: 'https://media.formula1.com/image/upload/c_fill,w_80,h_80,g_north/d_driver_fallback_image.webp/q_auto/v1740000001/common/f1/2026/alpine/fracol01/2026alpinefracol01right.webp',
};

export function getDriverPhotoByTLA(tla: string): string | undefined {
	if (!tla) return undefined;
	return DRIVER_PHOTO_BY_TLA[tla.toUpperCase()];
}

