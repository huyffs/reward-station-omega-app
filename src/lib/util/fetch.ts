import { auth } from '$lib/firebase';

export async function doFetch(path: string, init: RequestInit = {}): Promise<Response> {
	if (!auth.currentUser) {
		await auth.authStateReady();
	}

	const headers = new Headers(init.headers);
	if (auth.currentUser) {
		headers.set('Authorization', `Bearer ${await auth.currentUser.getIdToken()}`);
	}
	init.headers = headers;
	return fetch(path, init)
}

export async function postJSON(path: string, body: object): Promise<Response> {
	return doFetch(path, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
}

export async function patchJSON(path: string, body: object): Promise<Response> {
	return doFetch(path, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
}

export async function putJSON(path: string, body: object): Promise<Response> {
	return doFetch(path, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});
}

// export async function deleteF(path: string): Promise<Response> {
// 	return doFetch(path, {
// 		method: 'DELETE'
// 	});
// }

export async function refreshIdToken() {
	return auth.currentUser?.getIdToken(true);
}
