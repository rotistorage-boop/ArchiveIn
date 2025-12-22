<script lang="ts">
	import { openPhoto } from '$lib/stores/archive-navigation';
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import type { GalleryGroup } from '$lib/types/gallery';

	export let groups: GalleryGroup[];
</script>

<div in:fade={{ duration: 600, easing: quintOut }} class="space-y-16">
	{#each groups as group}
		<section class="space-y-6">
			<div class="space-y-1">
				<h2 class="text-sm tracking-widest text-gray-300 uppercase">
					{group.title}
				</h2>
				{#if group.description}
					<p class="text-xs text-gray-500">{group.description}</p>
				{/if}
			</div>

			<div class="grid grid-cols-3 gap-px max-md:grid-cols-3">
				{#each group.items as item}
					<button
						on:click={() =>
							openPhoto({
								src: item.imageUrl,
								title: item.title,
								desc: group.title,
								date: item.date
							})}
						class="group aspect-square overflow-hidden border-[0.5px] border-gray-900"
					>
						<img
							src={item.imageUrl}
							alt={item.title}
							class="h-full w-full object-cover contrast-[1.1] grayscale transition-all duration-600 ease-in-out group-hover:scale-105 group-hover:grayscale-0"
						/>
					</button>
				{/each}
			</div>
		</section>
	{/each}
</div>
