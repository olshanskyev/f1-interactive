interface StatusMessage {
	message: string;
	color: string;
	trackColor: string;
	bySector?: boolean;
	pulse?: number;
}

type MessageMap = Record<string, StatusMessage>;

export const getTrackStatusMessage = (statusCode: number | undefined): StatusMessage | null => {
	const messageMap: MessageMap = {
		1: { message: 'Track Clear', color: 'bg-f1-green', trackColor: 'stroke-white' },
		2: { message: 'Yellow Flag', color: 'bg-f1-yellow', trackColor: 'stroke-f1-yellow',	bySector: true},
		3: { message: 'Flag', color: 'bg-f1-yellow', trackColor: 'stroke-f1-yellow', bySector: true},
		4: { message: 'Safety Car', color: 'bg-f1-yellow', trackColor: 'stroke-f1-yellow' },
		5: { message: 'Red Flag', color: 'bg-f1-red', trackColor: 'stroke-f1-red' },
		6: { message: 'VSC Deployed', color: 'bg-f1-yellow', trackColor: 'stroke-f1-yellow' },
		7: { message: 'VSC Ending', color: 'bg-f1-yellow', trackColor: 'stroke-f1-yellow' },
	};

	return statusCode ? (messageMap[statusCode] ?? messageMap[0]) : null;
};
