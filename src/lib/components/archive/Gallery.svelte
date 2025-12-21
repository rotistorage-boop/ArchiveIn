<script lang="ts">
	import { selectedPhoto } from '$lib/stores/archive-navigation';
	import type { GalleryItemData } from '$lib/data/archive-data';
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let items: GalleryItemData[];

	function openPhoto(item: GalleryItemData) {
		selectedPhoto.set({
			src: item.src,
			title: item.title,
			desc: item.desc
		});
	}
</script>

<div in:fade={{ duration: 600, easing: quintOut }} class="translate-x-0">
	<div class="grid grid-cols-4 max-md:grid-cols-3">
		{#each items as item}
			<button
				on:click={() => openPhoto(item)}
				class="group aspect-square overflow-hidden border-[0.5px] border-gray-900"
			>
				<img
					src={item.src}
					alt={item.title}
					class="h-full w-full object-cover contrast-[1.1] grayscale transition-all duration-600 ease-in-out group-hover:scale-105 group-hover:grayscale-0"
				/>
			</button>
		{/each}
	</div>
</div>
