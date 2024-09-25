<script lang="ts" context="module">
	export const UploadSection = {
		project: 'project',
		campaign: 'campaign',
		task: 'task'
	};
	export const UploadKind = {
		logo: 'logo'
	};
</script>

<script lang="ts">
	import { doFetch } from '$lib/util/fetch';
	import {
		FileDropzone,
		ProgressRadial,
		getModalStore,
		getToastStore
	} from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ success: string[]; close: void }>();

	export let target: string;
	export let name: string = 'files';
	export let multiple: boolean = true;

	const toastStore = getToastStore();
	const abortCtrl = new AbortController();

	let files: FileList | undefined;
	let isUploading = false;
	let isConfirmStop = false;

	function clearFiles() {
		files = undefined;
	}

	async function onSubmit(event: { currentTarget: EventTarget & HTMLFormElement }) {
		if (!files?.length) {
			return;
		}
		const data = new FormData(event.currentTarget);
		toastStore.trigger({
			message: 'Uploading...',
			background: 'variant-filled-warning'
		});

		isUploading = true;
		const res = await doFetch(target, {
			method: 'POST',
			signal: abortCtrl.signal,
			body: data
		});
		isUploading = false;
		if (res.ok) {
			const images: Record<string, string[]> = await res.json();
			// $modalStore[0].response!(images[name]);
			// modalStore.close();
			dispatch('success', images[name]);

			toastStore.trigger({
				message: 'Success!',
				background: 'variant-filled-success'
			});
		} else {
			toastStore.trigger({
				message: `${res.status}: ${await res.text()}`,
				background: 'variant-filled-error'
			});
		}
	}

	function onCancelClick() {
		if (isUploading) {
			isConfirmStop = true;
		} else {
			dispatch('close');
		}
	}

	const onDontStopClick = () => (isConfirmStop = false);
	const onStopUploadClick = () => {
		abortCtrl.abort();
		dispatch('close');
		isConfirmStop = false;
	};
</script>

<form on:submit|preventDefault={onSubmit} class="p-4 card pointer-events-auto">
	<header>Upload images</header>
	<main class="relative">
		<FileDropzone
			{name}
			{multiple}
			bind:files
			accept=".jpg, .png, .jpeg, .gif, .webp|image/*"
			disabled={isUploading}
			class="max-w-full"
		>
			<svelte:fragment slot="lead">
				{#if files?.length}
					<section
						class="grid sm:grid-cols-{files.length < 3
							? files.length
							: 3} md:grid-cols-{files.length < 4 ? files.length : 4} lg:grid-cols-{files.length < 5
							? files.length
							: 5} place-content-center gap-4"
					>
						{#each Array.from(files) as file}
							<div class="flex place-content-center">
								<img src={URL.createObjectURL(file)} alt={file.name} class="max-h-48 max-w-36" />
							</div>
						{/each}
					</section>
				{:else}
					<span class="text-9xl">🏞️</span>
				{/if}
			</svelte:fragment>
			<svelte:fragment slot="message">Upload an image</svelte:fragment>
			<svelte:fragment slot="meta">PNG, JPG, and WEBP allowed</svelte:fragment>
		</FileDropzone>
		{#if files?.length}
			<button
				class="btn-icon absolute top-4 right-4"
				type="button"
				disabled={isUploading}
				on:click|stopPropagation={clearFiles}>❌</button
			>
		{/if}
		{#if isUploading}
			<div class="absolute inset-0 flex justify-center items-center">
				<ProgressRadial width="w-24" stroke={90} strokeLinecap="round" />
			</div>
		{/if}
		{#if isConfirmStop}
			<div class="absolute w-full h-full inset-0 flex items-end justify-center p-4">
				<div class="card variant-filled p-4">
					<header class="card-title"><h2 class="h2">Stop uploading?</h2></header>
					<section class="p-4">Are you sure you wish to stop uploads?</section>
					<footer class="card-footer flex justify-center gap-4 p-0">
						<button class="btn variant-ghost-error" type="button" on:click={onDontStopClick}
							>Don't stop</button
						>
						<button class="btn variant-filled-primary" type="button" on:click={onStopUploadClick}
							>Stop uploads</button
						>
					</footer>
				</div>
			</div>
		{/if}
	</main>
	<footer class="flex justify-center gap-4 mt-2">
		<button
			class="btn variant-ghost-error"
			type="button"
			disabled={isConfirmStop}
			on:click={onCancelClick}>Cancel</button
		>
		<button
			class="btn variant-filled-primary"
			type="submit"
			disabled={isUploading || !files?.length}>Upload</button
		>
	</footer>
</form>
