<!-- src/lib/components/layout/admin/Header.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { Search, Menu, X } from '@lucide/svelte';
	import type { User } from '$lib/types/user';

	// No user prop needed currently
	export let mobileMenuOpen: boolean = false;
	export let user: User | undefined = undefined;

	function toggleMenu(): void {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<header class="border-b border-zinc-800 bg-zinc-950">
	<div class="flex items-center justify-between px-6 py-4">
		<!-- Mobile menu button -->
		<button
			class="mr-2 text-zinc-400 hover:text-white lg:hidden"
			on:click={toggleMenu}
			aria-label="Toggle menu"
			type="button"
		>
			{#if mobileMenuOpen}
				<X class="h-5 w-5" />
			{:else}
				<Menu class="h-5 w-5" />
			{/if}
		</button>

		<!-- Desktop User Profile (compact) -->
		{#if user}
			<div class="ml-auto hidden items-center gap-3 lg:flex">
				<div class="text-right">
					<p class="text-sm font-medium text-white">{user.name || user.email}</p>
					<p class="text-xs text-zinc-500 capitalize">{user.role}</p>
				</div>
				{#if user.avatar}
					<img src={user.avatar} alt="" class="h-8 w-8 rounded-full" />
				{:else}
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-white"
					>
						{(user.name || user.email).charAt(0).toUpperCase()}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</header>
