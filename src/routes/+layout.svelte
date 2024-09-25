<script lang="ts">
	import '../app.postcss';
	import { Modal, Toast, autoModeWatcher, modeCurrent } from '@skeletonlabs/skeleton';
	import { AppBar, AppShell, LightSwitch } from '@skeletonlabs/skeleton';
	import { defaultConfig, wagmiLoaded } from 'svelte-wagmi';
	import { onMount } from 'svelte';
	import { PUBLIC_WALLETCONNECT_ID, PUBLIC_ALCHEMY_API_KEY } from '$env/static/public';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import { userStore } from '$lib/store/user_store';
	import { page } from '$app/stores';
	import Fa from 'svelte-fa';
	import {
		faBars,
		faClose,
		faGlobe,
		faHorse,
		faMapLocation,
		faUser,
		type IconDefinition
	} from '@fortawesome/free-solid-svg-icons';
	import { Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	import type { DrawerSettings } from '@skeletonlabs/skeleton';
	import { mainnet, sepolia, astar } from '@wagmi/core/chains';

	initializeStores();

	onMount(() => {
		const erckit = defaultConfig({
			appName: 'RewardStationOmega',
			walletConnectProjectId: PUBLIC_WALLETCONNECT_ID,
			alchemyId: PUBLIC_ALCHEMY_API_KEY,
			chains: [mainnet, sepolia, astar]
		});
		erckit.init();
	});

	const drawerStore = getDrawerStore();

	const drawerSettings: DrawerSettings = {
		id: 'side-nav'
	};

	type Link = {
		href: string;
		label: string;
		target?: string;
		icon: IconDefinition;
	};
	const links: Link[] = [
		{ href: '/', label: 'Explore Clubs', icon: faMapLocation },
		{ href: '/clubs', label: 'My Clubs', icon: faHorse },
		{ href: '/rewards', label: 'Rewards Wallet', icon: faUser },
		{
			href: 'https://t.me/RewardStationOmega',
			label: 'Ask a question',
			target: '_blank',
			icon: faGlobe
		}
	];
</script>

<svelte:head>
	{@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>
<Drawer position="right">
	<div class="flex flex-col items-center p-4">
		<div class="flex flex-row w-full items-center py-8 gap-4">
			<button on:click={() => drawerStore.close()} class="btn self-start">
				<Fa icon={faClose} size="lg" />
			</button>
			<a href="/" class="flex flex-col" on:click={() => drawerStore.close()}>
				<img
					src={$modeCurrent ? '/image/logo.png' : '/image/logo-dark.png'}
					alt="logo"
					class="w-56"
				/>
				<div class="text-xl dark:text-gray-500 pl-10">
					<strong>Rewards Station</strong> <span class="italic">beta</span>
				</div>
			</a>
			<div class="flex-auto" />
			<LightSwitch />
		</div>
		<nav class="w-full">
			{#each links as link}
				<a
					on:click={() => drawerStore.close()}
					class="btn hover:variant-soft-primary w-full mb-4 !text-lg !rounded-none justify-start"
					target={link.target}
					href={link.href}>{link.label}</a
				>
			{/each}
		</nav>
	</div>
</Drawer>
<Toast zIndex="z-[1999]" />
<Modal />
<AppShell regionPage="relative" slotPageHeader="top-0 z-10" slotSidebarLeft="w-0 sm:w-24">
	<svelte:fragment slot="header">
		<div class="w-full border-b border-white/10">
			<AppBar class="max-w-screen-2xl bg-red-69 mx-auto w-full flex lg:px-16 px-4">
				<svelte:fragment slot="lead">
					<a href="/" class="hidden lg:flex lg:flex-col lg:items-center">
						<img
							src={$modeCurrent ? '/image/logo.png' : '/image/logo-dark.png'}
							alt="logo"
							class="h-5 w-auto"
						/>
						<!-- <div class="text-sm dark:text--500 pl-7 whitespace-nowrap">
							<strong>Rewards Station</strong> <span class="italic">beta</span>
						</div> -->
					</a>
				</svelte:fragment>
				<svelte:fragment slot="trail">
					<!-- <LightSwitch class="hidden lg:block" /> -->
					<div class="hidden lg:flex">
						{#if $userStore}
							<a href="/me" class="btn-icon hover:variant-soft-primary"><Fa icon={faUser} /></a>
						{:else}
							<a
								href="/me"
								class="bg-gradient-to-r outline outline-offset-2 outline-transparent hover:outline-purple-300/40 duration-300 from-[#6676CE] to-[#9E6DB5] py-1 px-5 text-xl rounded-full font-raleway font-medium"
								>Sign up</a
							>
						{/if}
					</div>
					<div class="flex lg:hidden">
						<button
							on:click={() => {
								drawerStore.open(drawerSettings);
							}}
							class="lg:hidden h-8 aspect-square"
						>
							<img src="/assets/drawer-btn.svg" alt="Open Drawer Icon" />
						</button>
					</div>
				</svelte:fragment>
				<nav class="hidden lg:flex gap-9 flex-row justify-center">
					{#each links as link}
						<a
							class="nav-item mx-1 flex flex-col !text-lg font-normal text-white/70 justify-start items-start leading-tight"
							class:active={$page.url.pathname === link.href}
							target={link.target}
							href={link.href}><span>{link.label}</span></a
						>
					{/each}
				</nav>
				<a href="/" class="flex lg:hidden flex-col">
					<img
						src={$modeCurrent ? '/image/logo.png' : '/image/logo-dark.png'}
						alt="logo"
						class="w-36"
					/>
				</a>
			</AppBar>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="pageFooter">
		<div
			class="!px-6 !py-8 lg:!p-12 mt-24 bg-[#131315] lg:bg-[#09090A] w-screen border-t border-white/5 shadow-lg shadow-black"
		>
			<div
				class="w-full max-w-7xl pb-10 mx-auto flex flex-col lg:flex-row gap-4 justify-between items-start"
			>
				<div class="lead mb-8 sm:mb-0">
					<div class="flex flex-col gap-6 dark:text-gray-500">
						<div class="flex flex-col lg:flex-row items-start gap-4">
							<img
								src={$modeCurrent ? '/image/logo.png' : '/image/logo-dark.png'}
								alt="logo"
								class="w-56"
							/>
							<div class="text w-full flex justify-start sm:justify-end">
								<span class="text-lg"
									><strong>Rewards Station</strong>
									<span class="bg-neutral-900 rounded-lg px-2 py-0.5">beta</span></span
								>
							</div>
						</div>
						<div class="text-base font-raleway">© 2024 Huy Dinh - All Rights Reserved.</div>
					</div>
				</div>
				<div class="w-full justify-start max-w-full sm:max-w-fit h-full flex flex-row">
					<div
						class="hidden lg:flex flex-col gap-1 sm:w-full border-l pl-4 w-max font-raleway border-white/5 ml-16 h-max"
					>
						<span
							class="text-xl font-normal font-raleway underline underline-offset-4 text-white opacity-80 mb-2"
							>Links</span
						>
						<a href="/#" class="text-base hover:underline w-max text-white/60">Explore Clubs</a>
						<a href="/#" class="text-base hover:underline w-max text-white/60">Your Clubs</a>
						<a href="/#" class="text-base hover:underline w-max text-white/60">Rewards Wallet</a>
						<a href="/#" class="text-base hover:underline w-max text-white/60">Ask a Question</a>
					</div>
					<div
						class="flex flex-col gap-1 sm:w-full border-l pl-4 w-max font-raleway border-white/5 lg:ml-16 h-max"
					>
						<span
							class="text-xl font-normal font-raleway underline underline-offset-4 text-white opacity-80 mb-2"
							>Support</span
						>
						<a
							href="https://t.me/RewardStationOmega"
							class="text-base hover:underline w-max text-white/60">Docs</a
						>
						<a
							href="https://t.me/RewardStationOmega"
							class="text-base hover:underline w-max text-white/60">Contact Us</a
						>
					</div>
					<div
						class="flex flex-col gap-1 sm:w-full border-l pl-4 w-max font-raleway border-white/5 ml-16 h-max"
					>
						<span
							class="text-xl font-normal font-raleway underline underline-offset-4 text-white opacity-80 mb-2"
							>Community</span
						>
						<a
							href="https://t.me/RewardStationOmega"
							class="text-base hover:underline w-max text-white/60">Twitter</a
						>
						<a
							href="https://t.me/RewardStationOmega"
							class="text-base hover:underline w-max text-white/60">Telegram</a
						>
					</div>
				</div>
			</div>
		</div>
	</svelte:fragment>
	{#if wagmiLoaded}
		<slot />
	{:else}
		<h1>Svelte Wagmi Not Configured</h1>
	{/if}
</AppShell>

<style lang="scss">
	.nav-item {
		&::after {
			content: '';
			display: block;
			height: 1.5px;
			width: 0;
			background-color: #ac9ff9aa;
			transition: width 0.5s;
			transform-origin: left;
			margin-top: -3px;
		}
		&:hover,
		&.active {
			color: #ac9ff9;
			&::after {
				width: 100%;
			}
		}
	}
</style>
