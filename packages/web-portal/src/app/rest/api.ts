export const apiUrl = (document: Document, isPlatformBrowser = false, allowServer = false) => {
	let protocol = 'http:';
	let hostname = 'localhost';
	if (isPlatformBrowser) {
		protocol = document.location.protocol;
		hostname = document.location.hostname;
	} else {
		if (!allowServer) {
			return '';
		}
		return protocol + `//` + hostname + ':5000/';
	}
	// return protocol + `//api.` + hostname + '/';
	return protocol + `//` + hostname + ':5000/';
};
