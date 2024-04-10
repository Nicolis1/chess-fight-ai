export async function fetchActiveUser() {
	try {
		const resp = await fetch('/users/active', {
			method: 'GET',
		});
		const response = JSON.parse(await resp.json());
		if (response.userid == null) {
			return null;
		}
		return {
			id: response.userid,
			username: response.username,
		};
	} catch (error) {
		console.error(error);
		return null;
	}
}
