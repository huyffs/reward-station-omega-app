<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { userStore } from '$lib/store/user_store';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase';

	onMount(() => {
		auth.authStateReady().then(() => {
			if ($userStore) {
				getToastStore().trigger({
					message: 'You are already signed in!',
					background: 'background-variant-success'
				});
				goto('/');
			}
		});
	});
</script>

<slot />
