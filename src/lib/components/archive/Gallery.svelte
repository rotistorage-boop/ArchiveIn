<script lang="ts">
	import { openPhoto } from '$lib/stores/archive-navigation';
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	import type { GalleryGroupWithItems } from '$lib/types/gallery';

	export let groups: GalleryGroupWithItems[];
</script>

<div in:fade={{ duration: 600, easing: quintOut }} class="space-y-16">
	{#each groups as group}
		<section class="space-y-6">
			{#if group.title}
				<div class="space-y-1">
					<h2 class="text-sm tracking-widest text-gray-300 uppercase">
						{group.title}
					</h2>
					{#if group.description}
						<p class="text-xs text-gray-500">{group.description}</p>
					{/if}
				</div>
			{/if}

			<div class="grid grid-cols-3 gap-px max-md:grid-cols-3">
				{#each group.items as item}
					<button
						on:click={() =>
							openPhoto({
								src: item.imageWebpUrl,
								title: item.title,
								desc: group.title,
								date: item.date
							})}
						class="group aspect-square cursor-pointer overflow-hidden border-[0.5px] border-gray-900"
					>
						<img
							src={item.imageWebpUrl}
							alt={item.title}
							class="h-full w-full object-cover contrast-[1.1] grayscale transition-all duration-600 ease-in-out group-hover:scale-105 group-hover:grayscale-0"
						/>
					</button>
				{/each}
			</div>
		</section>
	{/each}
</div>
