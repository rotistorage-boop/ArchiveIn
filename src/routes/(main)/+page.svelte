<script lang="ts">
	import Navigation from '$lib/components/archive/Navigation.svelte';
	import CursorTrail from '$lib/components/archive/CursorTrail.svelte';
	import ArchiveList from '$lib/components/archive/ArchiveList.svelte';
	import Detail from '$lib/components/archive/Detail.svelte';
	import Gallery from '$lib/components/archive/Gallery.svelte';
	import PhotoModal from '$lib/components/archive/PhotoModal.svelte';
	import { currentPage, initializeArchive } from '$lib/stores/archive-navigation';
	import type { GalleryGroup } from '$lib/types/gallery';
	import type { ArchiveItem } from '$lib/types/archive';

	// sementara: gallery data dari load()
	export let data: {
		gallery: GalleryGroup[];
		archive: ArchiveItem[];
	};

	initializeArchive(data.archive);
</script>

<svelte:head>
	<title>∴ Archive</title>
</svelte:head>

<div class="min-h-screen cursor-crosshair overflow-x-hidden bg-black font-mono text-gray-400">
	<Navigation />
	<CursorTrail />

	<div
		class="ml-32 min-h-screen p-12
		       max-md:ml-0 max-md:flex max-md:flex-col
		       max-md:p-6 max-md:px-4 max-md:pt-20"
	>
		{#if $currentPage === 'gallery'}
			<Gallery groups={data.gallery} />
		{:else if $currentPage === 'detail'}
			<Detail />
		{:else}
			<ArchiveList />
		{/if}
	</div>

	<PhotoModal />
</div>
