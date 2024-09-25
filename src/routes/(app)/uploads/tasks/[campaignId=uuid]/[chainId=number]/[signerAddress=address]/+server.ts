import type { RequestHandler } from './$types';
import { error, type NumericRange } from '@sveltejs/kit';
import { hasWalletClaim } from '$lib/util/auth';
import { uploadFile } from '$lib/util/bucket';
import { PUBLIC_API_URL } from '$env/static/public';

export const POST: RequestHandler = async ({ request, params, locals }) => {
	// waitUntil((async () => {})(), platform?.context);
	const bucket = locals.PROOF_BUCKET;
	if (!bucket) {
		error(500, {
			message:
				'Must run in cloudflare workers environment. Run the wrangler-proxy locally: wrangler dev node_modules/wrangler-proxy/dist/worker.js --remote'
		});
	}

	if (!hasWalletClaim(request, params.chainId, params.signerAddress)) {
		error(403);
	}

	const authorization = request.headers.get('Authorization');
	if (authorization === null) {
		error(401);
	}

	const res = await fetch(`${PUBLIC_API_URL}/engage/${params.campaignId}/org_id`, {
		headers: {
			Authorization: authorization
		}
	});
	if (!res.ok) {
		error(res.status as NumericRange<400,599>, {
			message: await res.text()
		});
	}
	const orgId: string = await res.json();

	const form = await request.formData();
	let pathBase: string = `${orgId}/${params.campaignId}/${params.chainId}/${params.signerAddress}/`;
	const tasks: Record<string, string[]> = {};
	for (const taskId of form.keys()) {
		const files = form.getAll(taskId) as File[];
		if (!files || !files.length) {
			error(400, {
				message: 'No file in request body for task ' + taskId
			});
		}
		const images: string[] = [];
		const prefix = new Date().getTime().toString(36);
		for (let i = 0; i < files.length; i++) {
			const file = files[i];

			if (!file.name) {
				error(400, {
					message: 'No content received'
				});
			}

			const path = `${pathBase}/${taskId}`;
			const key = await uploadFile(locals.PROOF_BUCKET, path, file, `${prefix}${i.toString(36)}`);
			if (key) {
				images.push(key);
			}
		}
		tasks[taskId] = images;
	}

	return new Response(JSON.stringify(tasks));
};
