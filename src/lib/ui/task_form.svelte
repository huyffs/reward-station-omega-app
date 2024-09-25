<script lang="ts" context="module">
	export type SingleProofForm = {
		link: string;
		message: string;
		images: string[];
	};
</script>

<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { auth } from '$lib/firebase';
	import UploadForm from '$lib/form/upload_form.svelte';
	import { buildEngage, engageStore } from '$lib/store/engage_store';
	import { postJSON, putJSON } from '$lib/util/fetch';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { chainId, signerAddress } from 'svelte-wagmi';
	import { PUBLIC_MEDIA_URL_PREFIX } from '$env/static/public';
	import type { CreateResult, UpdateResult } from '$lib/type/api';

	export let campaignId: string;
	export let taskId: string;

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	export let data: SingleProofForm = {
		link: '',
		message: '',
		images: []
	};

	let isSaving = false;

	function onUploadClick() {
		uploadMode = !uploadMode;
	}

	function onUploadSuccess(ev: CustomEvent<string[]>) {
		data.images = [...data.images, ...ev.detail.map((img) => `${PUBLIC_MEDIA_URL_PREFIX}/${img}`)];
		uploadMode = !uploadMode;
	}

	function deleteImageAt(index: number) {
		const images = data.images;
		images.splice(index, 1);
		data.images = images;
	}

	async function onSubmit(event: { currentTarget: EventTarget & HTMLFormElement }) {
		const chain_id = $chainId;
		const signer_address = $signerAddress?.toLowerCase();
		if (!auth.currentUser || !chain_id || !signer_address) {
			toastStore.trigger({
				message: 'You must be signed in and connect to your wallet to continue',
				background: 'variant-filled-error'
			});
			return;
		}

		const id = `${campaignId}/${chain_id}/${signer_address}`;
		const path = `${chain_id}/${signer_address}/${campaignId}`;
		const submissions = { [taskId]: data };

		if ($engageStore[id]) {
			const res = await putJSON(`${PUBLIC_API_URL}/tasks/${path}`, submissions);
			if (res.ok) {
				const data: UpdateResult = await res.json();
				engageStore.update((s) => {
					s[id] = buildEngage({
						...s[id],
						submissions: { ...s[id].submissions, ...submissions },
						updated_at: data.updated_at
					});
					return s;
				});
				toastStore.trigger({
					message: 'Success!',
					background: 'variant-filled-success'
				});
				modalStore.close();
			} else {
				toastStore.trigger({
					message: `${res.status}: ${await res.text()}`,
					background: 'variant-filled-error'
				});
			}
		} else {
			const res = await postJSON(`${PUBLIC_API_URL}/tasks/${path}`, submissions);
			if (res.ok) {
				const data: CreateResult = await res.json();
				engageStore.update((s) => {
					s[id] = buildEngage({
						id: id,
						campaign_id: campaignId,
						chain_id,
						signer_address,
						accepted: {},
						messages: {},
						submissions: submissions,
						created_at: data.created_at
					});
					return s;
				});
				toastStore.trigger({
					message: 'Success!',
					background: 'variant-filled-success'
				});
				modalStore.close();
			} else {
				toastStore.trigger({
					message: `${res.status}: ${await res.text()}`,
					background: 'variant-filled-error'
				});
			}
		}
	}

	function onCancelClick() {
		modalStore.close();
	}

	let uploadMode = false;
</script>

{#if uploadMode}
	<UploadForm
		name={taskId}
		target="/uploads/tasks/{campaignId}/{$chainId}/{$signerAddress?.toLowerCase()}"
		on:success={onUploadSuccess}
		on:close={() => (uploadMode = false)}
	/>
{:else}
	<form on:submit|preventDefault={onSubmit} class="p-4 card pointer-events-auto">
		<header class="card-header"><h3 class="h3">Submit proof</h3></header>
		<section class="p-4">
			<div
				class="flex flex-col justify-center items-center outline-dashed outline-offset-2 outline-1 rounded-2xl p-4 gap-2"
			>
				{#if data.images.length}
					<div
						class="snap-x h-48 scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-4"
					>
						{#each data.images as img, i}
							<div
								class="snap-end shrink-0 card w-40 md:w-80 relative flex justify-center items-center"
							>
								<img src={img} alt="Task image {i}" />
								<button
									class="btn-icon variant-soft absolute top-0 right-0"
									type="button"
									on:click={() => deleteImageAt(i)}>❌</button
								>
							</div>
						{/each}
					</div>
				{:else}
					<div class="flex flex-col justify-center items-center h-32 gap-2">
						<span>🏞️ 🌄 🏙️</span>
						<span class="h2">Screenshots </span>
					</div>
				{/if}
				<button class="btn variant-filled-primary" type="button" on:click={onUploadClick}
					>Upload screenshots</button
				>
			</div>
			<label class="label my-4">
				<span>Share a link to your post</span>
				<input bind:value={data.link} name="link" placeholder="Link to share" class="input p-2" />
			</label>
			<label class="label">
				<span>Additional information</span>
				<textarea
					bind:value={data.message}
					name="message"
					placeholder="Any other information to share?"
					rows="3"
					class="textarea p-2"
				/>
			</label>
		</section>
		<footer class="flex justify-center gap-4 mt-2">
			<button
				class="btn variant-ghost-error"
				type="button"
				disabled={isSaving}
				on:click={onCancelClick}>Cancel</button
			>
			<button class="btn variant-filled-primary" type="submit" disabled={isSaving}>Save</button>
		</footer>
	</form>
{/if}
