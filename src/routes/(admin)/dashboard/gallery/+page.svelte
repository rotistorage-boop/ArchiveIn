<script lang="ts">
	import { Plus, Edit2, Trash2, Image as ImageIcon, Search } from '@lucide/svelte';
	import type { GalleryGroupWithItems, GalleryItem } from '$lib/types/gallery';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let searchQuery: string = '';

	$: galleryGroups = data?.groups || [];
	$: uncategorizedItems = data?.uncategorizedItems || [];

	// Combine all items for display
	$: allItems = [
		...galleryGroups.flatMap((g: GalleryGroupWithItems) => g.items),
		...uncategorizedItems
	];

	// Filter Groups
	$: filteredGroups = galleryGroups.filter((g: GalleryGroupWithItems) =>
		g.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Filter Items (Optional, if we want to search items too)
	$: filteredItems = allItems.filter((item) =>
		item.title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Navigation Actions
	function handleCreateGroup() {
		goto('/dashboard/gallery/group/create');
	}

	function handleEditGroup(id: number) {
		goto(`/dashboard/gallery/group/update/${id}`);
	}

	function handleDeleteGroup(id: number) {
		goto(`/dashboard/gallery/group/delete/${id}`);
	}

	function handleCreateItem() {
		goto('/dashboard/gallery/item/create');
	}

	function handleEditItem(item: any) {
		goto(`/dashboard/gallery/item/update/${item.id}`);
	}

	function handleDeleteItem(id: number) {
		goto(`/dashboard/gallery/item/delete/${id}`);
	}

	// Modal State
	let selectedItem: any = null;

	function openModal(item: any) {
		selectedItem = item;
	}

	function closeModal() {
		selectedItem = null;
	}
</script>

<svelte:head>
	<title>Gallery Management | ArchiveIn</title>
</svelte:head>

<div class="space-y-6 p-6 lg:p-8">
	<!-- Page Title & Actions -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-white">Gallery Management</h1>
			<p class="mt-1 text-sm text-zinc-500">Manage gallery groups and items</p>
		</div>

		<div class="flex gap-3">
			<div class="relative flex-1 sm:w-64">
				<Search
					class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-zinc-500"
				/>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search gallery..."
					class="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pr-4 pl-10 text-sm text-white placeholder-zinc-500 transition-colors focus:border-white focus:outline-none"
				/>
			</div>
			<button
				on:click={handleCreateGroup}
				class="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-black transition-colors hover:bg-zinc-200"
				type="button"
			>
				<Plus class="h-4 w-4" />
				New Group
			</button>
		</div>
	</div>

	<!-- Gallery Groups -->
	<div>
		<h2 class="mb-4 text-lg font-semibold text-white">Gallery Groups</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredGroups as group (group.id)}
				<div
					class="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 transition-colors hover:border-zinc-700"
				>
					<div class="flex h-32 items-center justify-center bg-zinc-900">
						<ImageIcon class="h-12 w-12 text-zinc-700" />
					</div>
					<div class="p-4">
						<h3 class="mb-1 text-sm font-semibold text-white">{group.title}</h3>
						<p class="mb-3 text-xs text-zinc-500">{group.description || 'No description'}</p>
						<div class="flex items-center justify-between">
							<span class="text-xs text-zinc-600">{group.items.length} items</span>
							<div class="flex gap-2">
								<button
									on:click={() => handleEditGroup(group.id)}
									class="p-1 text-zinc-400 transition-colors hover:text-white"
									type="button"
									aria-label="Edit group {group.title}"
								>
									<Edit2 class="h-4 w-4" />
								</button>
								<button
									on:click={() => handleDeleteGroup(group.id)}
									class="p-1 text-zinc-400 transition-colors hover:text-red-500"
									type="button"
									aria-label="Delete group {group.title}"
								>
									<Trash2 class="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Gallery Items -->
	<div>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold text-white">Gallery Items</h2>
			<button
				on:click={handleCreateItem}
				class="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
				type="button"
			>
				<Plus class="h-4 w-4" />
				Add Item
			</button>
		</div>
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each filteredItems as item (item.id)}
				<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
				<div
					class="group relative cursor-pointer overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 hover:border-zinc-700"
					on:click={() => openModal(item)}
				>
					<div class="aspect-square bg-zinc-900">
						<img
							src={item.imageWebpUrl || ''}
							alt={item.title}
							class="h-full w-full object-cover"
						/>
					</div>
					<!-- Hover Overlay -->
					<div
						class="bg-opacity-0 group-hover:bg-opacity-60 absolute inset-0 flex items-center justify-center bg-black opacity-0 transition-all group-hover:opacity-100"
					>
						<!-- Actions Container - Stop propagation to check details without editing -->
						<div class="flex gap-2" on:click|stopPropagation>
							<button
								on:click={() => handleEditItem(item)}
								class="rounded-full bg-white p-2 text-black transition-colors hover:bg-zinc-200"
								type="button"
								aria-label="Edit item {item.title}"
							>
								<Edit2 class="h-4 w-4" />
							</button>
							<button
								on:click={() => handleDeleteItem(item.id)}
								class="rounded-full bg-red-600 p-2 text-white transition-colors hover:bg-red-700"
								type="button"
								aria-label="Delete item {item.title}"
							>
								<Trash2 class="h-4 w-4" />
							</button>
						</div>
					</div>
					<div class="p-3">
						<h4 class="truncate text-xs font-medium text-white">{item.title}</h4>
						<p class="mt-1 text-xs text-zinc-500">{item.date}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Image Modal -->
{#if selectedItem}
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
		on:click={closeModal}
	>
		<div
			class="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-lg bg-zinc-900 shadow-2xl"
			on:click|stopPropagation
		>
			<!-- Close Button -->
			<button
				class="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
				on:click={closeModal}
			>
				<Trash2 class="h-5 w-5 rotate-45" />
				<!-- Using Trash2 rotated as close for now, ideally X -->
			</button>

			<img
				src={selectedItem.imageWebpUrl}
				alt={selectedItem.title}
				class="max-h-[80vh] w-full object-contain"
			/>

			<div class="flex items-center justify-between border-t border-zinc-800 bg-zinc-950 p-4">
				<div>
					<h3 class="text-lg font-bold text-white">{selectedItem.title}</h3>
					{#if selectedItem.description}
						<p class="text-sm text-zinc-400">{selectedItem.description}</p>
					{/if}
				</div>
				<a
					href={selectedItem.imageOriginalUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					View Original
				</a>
			</div>
		</div>
	</div>
{/if}
