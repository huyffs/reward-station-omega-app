<script lang="ts">
	import Fa from 'svelte-fa';
	import {
		faWallet,
		faBoltLightning,
		faGear,
		faChevronLeft,
		faCreditCard,
		type IconDefinition
	} from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher } from 'svelte';
	import { page } from '$app/stores';

	type Link = {
		href: string;
		title: string;
		icon: IconDefinition;
		text: string;
	};

	type LinkGroup = {
		id: string;
		links: Link[];
	};

	// export let backPress: ((event: CustomEvent<MouseEvent>) => void) | null | undefined;
	export let showBackButton: boolean = false;

	const links: LinkGroup[] = [
		{
			id: 'default',
			links: [
				{ href: '/wallets', icon: faWallet, text: 'Wallets', title: 'Your crypto assets' },
				{
					href: '/trades?',
					icon: faBoltLightning,
					text: 'Quick Trades',
					title: 'Make instant trades'
				},
				{
					href: '/topup',
					icon: faCreditCard,
					text: 'Topup',
					title: 'Topup USDT wallet'
				}
			]
		},
		{
			id: 'trail',
			links: [
				{ href: '/settings', icon: faGear, text: 'Settings', title: 'Settings and preferences' }
			]
		}
	];

	const dispatch = createEventDispatcher();

	function onBackClick(event: MouseEvent) {
		dispatch('backPress', event);
	}
</script>

<div
	class="app-rail grid grid-rows-[auto_1fr_auto] overflow-y-auto bg-surface-100-800-token w-[70px] sm:w-20 h-full gap-0"
>
	<div class="app-bar-lead">
		{#if showBackButton}
			<div>
				<button
					class="app-rail-tile unstyled grid place-content-center place-items-center w-full aspect-square space-y-1.5 cursor-pointer bg-primary-hover-token"
					on:click={onBackClick}
					><div class="app-rail-tile-icon">
						<Fa icon={faChevronLeft} size="2x" />
					</div>
				</button>
			</div>
		{/if}
	</div>
	{#each links as group}
		<div class="app-bar-{group.id}">
			{#each group.links as link}
				<div>
					<a
						title={link.title}
						href={link.href}
						class="app-rail-tile unstyled grid place-content-center place-items-center w-full aspect-square space-y-1.5 cursor-pointer bg-primary-hover-token"
						class:bg-primary-500={$page.url.pathname === link.href}
						><div class="app-rail-tile-icon">
							<Fa icon={link.icon} size="2x" />
						</div>
						<div class="app-rail-tile-label font-bold text-xs text-center">{link.text}</div></a
					>
				</div>
			{/each}
		</div>
	{/each}
</div>
