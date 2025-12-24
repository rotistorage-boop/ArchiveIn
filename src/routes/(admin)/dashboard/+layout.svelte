<script>
	import '../../layout.css';
	import { page } from '$app/stores';
	import Sidebar from '$lib/components/layout/admin/Sidebar.svelte';
	import Header from '$lib/components/layout/admin/Header.svelte';
	import MobileNav from '$lib/components/layout/admin/MobileNav.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';

	export let data;

	let mobileMenuOpen = false;

	$: if ($page.url.pathname) {
		mobileMenuOpen = false;
	}
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
	<title>Admin Dashboard - Archive</title>
</svelte:head>

<div class="min-h-screen bg-black text-white">
	<Toast />
	<div class="hidden h-screen lg:flex">
		<Sidebar user={data.user} />

		<div class="flex flex-1 flex-col overflow-hidden">
			<Header user={data.user} />
			<main class="flex-1 overflow-y-auto">
				<slot />
			</main>
		</div>
	</div>

	<div class="lg:hidden">
		<MobileNav bind:open={mobileMenuOpen} user={data.user} />

		<div class="flex min-h-screen flex-col">
			<Header user={data.user} bind:mobileMenuOpen />
			<main class="flex-1 overflow-y-auto">
				<slot />
			</main>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		background: #000;
		color: #fff;
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(::-webkit-scrollbar) {
		width: 8px;
		height: 8px;
	}

	:global(::-webkit-scrollbar-track) {
		background: #0a0a0a;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: #27272a;
		border-radius: 4px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: #3f3f46;
	}
</style>
