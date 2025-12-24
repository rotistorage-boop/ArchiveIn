<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { Search, X, Loader2, FileText, ChevronRight } from '@lucide/svelte';
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import {
		initialArchiveData,
		selectItem,
		navigateTo,
		currentPage
	} from '$lib/stores/archive-navigation';
	import type { ArchiveItem } from '$lib/types/archive';

	export let open = false;

	const dispatch = createEventDispatcher();
	let query = '';
	let inputEl: HTMLInputElement;
	let loading = false;
	let results: { item: ArchiveItem; path: string[] }[] = [];

	onMount(() => {
		if (open && inputEl) {
			inputEl.focus();
		}
	});

	$: if (open && inputEl) {
		setTimeout(() => inputEl.focus(), 50);
	}

	function close() {
		dispatch('close');
		query = '';
		results = [];
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}

	function searchRecursive(
		items: ArchiveItem[],
		term: string,
		path: string[] = []
	): { item: ArchiveItem; path: string[] }[] {
		let matches: { item: ArchiveItem; path: string[] }[] = [];
		for (const item of items) {
			if (item.title?.toLowerCase().includes(term)) {
				matches.push({ item, path });
			}
			if (item.children) {
				matches = [
					...matches,
					...searchRecursive(item.children, term, [...path, item.title || ''])
				];
			}
		}
		return matches;
	}

	$: {
		if (query.trim().length > 1) {
			const term = query.toLowerCase();
			results = searchRecursive(initialArchiveData, term).slice(0, 5);
		} else {
			results = [];
		}
	}

	function handleSelect(result: { item: ArchiveItem; path: string[] }) {
		if (result.item.children && result.item.children.length > 0) {
			// Navigate to folder
			const newPath = [...result.path, result.item.title!];
			navigateTo(newPath);
			currentPage.set('archive');
		} else {
			// Select detail item - we need to navigate to parent first to set context correctly?
			// Actually selectItem handles logic:
			// "CASE 2: ITEM DETAIL" -> sets selectedDetail and currentPage='detail'

			// We should set navigation path to the result.path first to ensure "Back" works?
			// The current store implementation of selectItem operates on "current path".
			// Let's force navigation to parent path first
			navigateTo(result.path);
			selectItem(result.item);
		}
		close();
	}

	function handleSubmit() {
		if (results.length > 0) {
			handleSelect(results[0]);
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
		role="dialog"
		aria-modal="true"
	>
		<!-- Backdrop -->
		<div
			class="absolute inset-0 bg-black/80 backdrop-blur-sm"
			transition:fade={{ duration: 150 }}
			on:click={close}
			on:keydown|stopPropagation
			role="presentation"
		></div>

		<!-- Modal -->
		<div
			class="relative w-[90%] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl md:w-full md:max-w-2xl"
			transition:scale={{ duration: 200, start: 0.95, easing: quintOut }}
		>
			<div class="flex items-center border-b border-zinc-800 px-4 py-3">
				<Search class="mr-3 h-5 w-5 text-zinc-500" />
				<input
					bind:this={inputEl}
					bind:value={query}
					on:keydown={(e) => e.key === 'Enter' && handleSubmit()}
					type="text"
					placeholder="Search archives..."
					class="flex-1 rounded-sm bg-transparent text-lg text-white placeholder-zinc-500 focus:outline-none"
				/>
			</div>

			<!-- Results -->
			{#if results.length > 0}
				<div class="p-2">
					{#each results as result}
						<button
							class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-zinc-900"
							on:click={() => handleSelect(result)}
						>
							<div
								class="flex h-8 w-8 items-center justify-center rounded bg-zinc-900 text-zinc-400"
							>
								<FileText class="h-4 w-4" />
							</div>
							<div class="min-w-0 flex-1">
								<h4 class="truncate font-medium text-white">{result.item.title}</h4>
								<p class="flex items-center gap-1 truncate text-xs text-zinc-500">
									Archive
									{#each result.path as p}
										<ChevronRight class="h-3 w-3" /> {p}
									{/each}
								</p>
							</div>
						</button>
					{/each}
				</div>
			{:else if query.length > 0}
				<div class="px-4 py-8 text-center text-sm text-zinc-500">No matching archives found.</div>
			{:else}
				<div class="px-4 py-12 text-center text-sm text-zinc-500">Type to search.</div>
			{/if}
		</div>
	</div>
{/if}
