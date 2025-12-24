<script lang="ts">
	import Navigation from '$lib/components/archive/Navigation.svelte';
	import ArchiveList from '$lib/components/archive/ArchiveList.svelte';
	import Detail from '$lib/components/archive/Detail.svelte';
	import Gallery from '$lib/components/archive/Gallery.svelte';
	import PhotoModal from '$lib/components/archive/PhotoModal.svelte';
	import { currentPage, initializeArchive } from '$lib/stores/archive-navigation';
	import type { GalleryGroupWithItems, GalleryItem } from '$lib/types/gallery';
	import type { ArchiveItem } from '$lib/types/archive';

	export let data: {
		gallery: GalleryGroupWithItems[];
		uncategorizedItems: GalleryItem[];
		archive: ArchiveItem[];
		user: {
			id: string;
			email: string;
			name: string | null;
			avatar: string | null;
			role: string;
		} | null;
		canAccessArchive: boolean;
	};

	// Initialize archive only if user can access it
	$: if (data.canAccessArchive && data.archive.length > 0) {
		initializeArchive(data.archive);
	}

	// If cannot access archive and trying to view it, redirect to gallery
	$: if (!data.canAccessArchive && ($currentPage === 'archive' || $currentPage === 'detail')) {
		currentPage.set('gallery');
	}

	$: displayGroups = [
		...(data.uncategorizedItems?.length > 0
			? [
					{
						id: -1,
						title: '',
						description: null,
						items: data.uncategorizedItems,
						createdAt: new Date(),
						updatedAt: new Date()
					}
				]
			: []),
		...data.gallery
	];
</script>

<svelte:head>
	<title>ArchiveIn</title>
</svelte:head>

<div class="min-h-screen overflow-x-hidden bg-black font-mono text-gray-400">
	<Navigation user={data.user} canAccessArchive={data.canAccessArchive} />

	<!-- Top Right User Badge (Hidden on Mobile) -->
	<div class="fixed top-6 right-8 z-50 flex items-center gap-2 max-md:hidden">
		{#if data.user}
			<a
				href="/logout"
				class="flex items-center gap-2 rounded-full bg-zinc-900/80 px-3 py-1.5 backdrop-blur-sm transition-all hover:bg-zinc-800"
				title="Logout"
			>
				{#if data.user.avatar && data.user.avatar.length > 0}
					<img
						src={data.user.avatar}
						alt="avatar"
						class="h-6 w-6 rounded-full object-cover"
						on:error={(e) => {
							(e.currentTarget as HTMLImageElement).style.display = 'none';
						}}
					/>
					<div
						class="hidden h-6 w-6 items-center justify-center rounded-full bg-zinc-700 text-xs text-white"
					>
						{(data.user.name || data.user.email).charAt(0).toUpperCase()}
					</div>
				{:else}
					<div
						class="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700 text-xs text-white"
					>
						{(data.user.name || data.user.email).charAt(0).toUpperCase()}
					</div>
				{/if}
				<span class="text-xs text-gray-400 max-md:hidden">{data.user.name || 'User'}</span>
			</a>
		{:else}
			<a
				href="/login"
				class="flex items-center gap-2 rounded-full bg-zinc-900/80 px-4 py-1.5 text-xs text-gray-400 backdrop-blur-sm transition-all hover:bg-zinc-800 hover:text-white"
			>
				Login
			</a>
		{/if}
	</div>

	<div
		class="ml-32 min-h-screen p-12
		       max-md:ml-0 max-md:flex max-md:flex-col
		       max-md:p-6 max-md:px-4 max-md:pt-20"
	>
		{#if $currentPage === 'gallery'}
			<Gallery groups={displayGroups} />
		{:else if $currentPage === 'detail' && data.canAccessArchive}
			<Detail />
		{:else if $currentPage === 'archive' && data.canAccessArchive}
			<ArchiveList />
		{:else}
			<!-- Fallback to gallery -->
			<Gallery groups={displayGroups} />
		{/if}
	</div>

	<PhotoModal />
</div>
