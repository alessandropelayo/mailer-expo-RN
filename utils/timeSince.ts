export function getTimeSince(pastTimestamp: number) {
	const now = new Date().getTime();
	const difference = now - pastTimestamp;

	const seconds = Math.floor(difference / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) {
		return `${days} days ago`;
	} else if (hours > 0) {
		return `${hours} hours ago`;
	} else if (minutes > 0) {
		return `${minutes} minutes ago`;
	} else {
		return `${seconds} seconds  
   ago`;
	}
}
