<!-- src/lib/components/layout/admin/MobileNav.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { Layers, Users, Clock, Image, BookOpen, LogOut } from '@lucide/svelte';
	import type { User } from '$lib/types/user';
	import type { NavItem } from '$lib/types/common';

	export let open: boolean = false;
	export let user: User;

	const navItems: NavItem[] = [
		{ href: '/dashboard', icon: Layers, label: 'Overview' },
		{ href: '/dashboard/users', icon: Users, label: 'Users' },
		{ href: '/dashboard/sessions', icon: Clock, label: 'Sessions' },
		{ href: '/dashboard/gallery', icon: Image, label: 'Gallery' },
		{ href: '/dashboard/archives', icon: BookOpen, label: 'Archives' }
	];

	function isActive(href: string): boolean {
		if (href === '/dashboard') {
			return $page.url.pathname === '/dashboard';
		}
		return $page.url.pathname.startsWith(href);
	}

	function closeMenu(): void {
		open = false;
	}

	function handleLogout(): void {
		closeMenu();
		window.location.href = '/logout';
	}

	function handleKeydown(e: KeyboardEvent): void {
		if (e.key === 'Escape') {
			closeMenu();
		}
	}
</script>

{#if open}
	<!-- Backdrop -->
	<div
		class="bg-opacity-75 fixed inset-0 z-40 bg-black lg:hidden"
		on:click={closeMenu}
		on:keydown={handleKeydown}
		role="button"
		tabindex="0"
		aria-label="Close menu"
	></div>

	<!-- Sidebar -->
	<aside
		class="fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-800 bg-zinc-950 lg:hidden"
	>
		<!-- Logo -->
		<div class="border-b border-zinc-800 p-6">
			<a href="/" on:click={closeMenu} class="block">
				<h1 class="text-xl font-bold text-white">ARCHIVEIN</h1>
			</a>
		</div>

		<!-- Navigation -->
		<nav class="flex-1 space-y-1 overflow-y-auto p-4">
			{#each navItems as item}
				<a
					href={item.href}
					on:click={closeMenu}
					class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors {isActive(
						item.href
					)
						? 'bg-white text-black'
						: 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}"
				>
					<svelte:component this={item.icon} class="h-4 w-4" />
					{item.label}
				</a>
			{/each}
		</nav>

		<!-- User Profile -->
		<div class="border-t border-zinc-800 p-4">
			<div class="mb-3 flex items-center gap-3">
				{#if user.avatar}
					<img src={user.avatar} alt="" class="h-10 w-10 rounded-full" />
				{:else}
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-white"
					>
						{(user.name || user.email).charAt(0).toUpperCase()}
					</div>
				{/if}
				<div class="min-w-0 flex-1">
					<p class="truncate text-sm font-medium text-white">{user.name || 'Admin'}</p>
					<p class="truncate text-xs text-zinc-500">{user.email}</p>
				</div>
			</div>

			<button
				on:click={handleLogout}
				class="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
				type="button"
			>
				<LogOut class="h-4 w-4" />
				Logout
			</button>
		</div>
	</aside>
{/if}
