export async function fetchActiveUser() {
	try {
		const resp = await fetch('/api/users/active', {
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

export async function deleteAccount() {
	try {
		const resp = await fetch('/api/users/delete', {
			method: 'DELETE',
		});
		if (resp.status === 200) {
			document.location = '/api/login';
		}
	} catch (error) {
		console.error(error);
		return null;
	}
}
