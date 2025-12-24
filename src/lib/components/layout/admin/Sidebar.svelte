<script lang="ts">
	import { page } from '$app/stores';
	import { Layers, Users, Clock, Image, BookOpen, LogOut } from '@lucide/svelte';
	import type { User } from '$lib/types/user';
	import type { NavItem } from '$lib/types/common';

	export let user: User;

	const navItems: NavItem[] = [
		{ href: '/dashboard', icon: Layers, label: 'Overview' },
		{ href: '/dashboard/users', icon: Users, label: 'Users' },
		{ href: '/dashboard/sessions', icon: Clock, label: 'Sessions' },
		{ href: '/dashboard/gallery', icon: Image, label: 'Gallery' },
		{ href: '/dashboard/archives', icon: BookOpen, label: 'Archives' }
	];

	function isActive(href: string, currentPath: string): boolean {
		const normalizedPath =
			currentPath.endsWith('/') && currentPath.length > 1 ? currentPath.slice(0, -1) : currentPath;
		const normalizedHref = href.endsWith('/') && href.length > 1 ? href.slice(0, -1) : href;

		if (normalizedHref === '/dashboard') {
			return normalizedPath === '/dashboard';
		}
		return normalizedPath.startsWith(normalizedHref);
	}

	function handleLogout(): void {
		window.location.href = '/logout';
	}
</script>

<aside class="flex w-20 flex-col border-r border-zinc-900 bg-black">
	<!-- Logo -->
	<div class="flex h-20 items-center justify-center border-b border-zinc-900">
		<a href="/" class="block text-xl font-bold text-white transition-opacity hover:opacity-70">A</a>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 space-y-2 py-6">
		{#each navItems as item}
			<div class="flex justify-center">
				<a
					href={item.href}
					title={item.label}
					class="flex h-10 w-10 items-center justify-center rounded-lg transition-colors {isActive(
						item.href,
						$page.url.pathname
					)
						? 'bg-white text-black'
						: 'text-zinc-500 hover:bg-zinc-900 hover:text-white'}"
				>
					<svelte:component this={item.icon} class="h-5 w-5" />
				</a>
			</div>
		{/each}
	</nav>

	<!-- User Profile -->
	<div class="border-t border-zinc-900 py-6">
		<div class="flex flex-col items-center gap-4">
			{#if user.avatar}
				<img src={user.avatar} alt="" class="h-8 w-8 rounded-full ring-1 ring-zinc-800" />
			{:else}
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white"
				>
					{(user.name || user.email).charAt(0).toUpperCase()}
				</div>
			{/if}

			<button
				on:click={handleLogout}
				title="Logout"
				class="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-500"
			>
				<LogOut class="h-4 w-4" />
			</button>
		</div>
	</div>
</aside>
