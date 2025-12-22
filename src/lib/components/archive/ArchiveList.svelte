<script lang="ts">
	import { currentItems, selectItem, goBack, navigationPath } from '$lib/stores/archive-navigation';
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { ArchiveItem } from '$lib/types/archive';
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';

	function handleItemClick(item: ArchiveItem) {
		selectItem(item);
	}
</script>

<div in:fade={{ duration: 600, easing: quintOut }} class="max-md:w-full">
	{#if $navigationPath.length > 0}
		<div class="mb-4">
			<button
				on:click={goBack}
				class="flex items-center gap-1 text-xs tracking-[0.35em] text-gray-400
				       transition-colors duration-300 hover:text-white
				       max-md:text-[0.7rem]"
			>
				<ArrowLeft size={14} /> BACK
			</button>

			<div class="mt-2 text-xs text-gray-500">
				{['Archive', ...$navigationPath].join(' / ')}
			</div>
		</div>
	{/if}

	<div class="flex flex-col">
		{#each $currentItems as item (item.id)}
			<button
				on:click={() => handleItemClick(item)}
				class="group grid grid-cols-[1fr_40px] gap-12
				       border-b border-white/8 py-4
				       transition-all duration-450 ease-in-out
				       hover:translate-x-1.5 hover:bg-gray-400/5
				       max-md:gap-4"
			>
				<div class="ml-5 text-left">
					<div class="text-base tracking-[0.08em] text-gray-100">
						{item.title}

						{#if item.semesterStartYear && item.semesterEndYear}
							<div class="mt-1 flex gap-1 text-sm tracking-widest text-gray-500">
								<span>{item.semesterStartYear}</span>
								<span>—</span>
								<span>{item.semesterEndYear}</span>
							</div>
						{/if}

						<!-- New Dosen, Jam, & Asprak Display -->
						<div class="mt-2 flex flex-col gap-1 text-sm text-gray-400">
							<div class="flex flex-wrap items-center gap-x-4">
								{#if item.dosen}
									<div class="flex items-center gap-1">
										<span>{item.dosen}</span>
									</div>
								{/if}
								{#if item.jam}
									<div class="flex items-center gap-1">
										<span>{item.jam}</span>
									</div>
								{/if}
							</div>
							{#if item.aspraks && item.aspraks.length > 0}
								<div class="mt-1 flex flex-wrap items-center gap-x-4">
									{#each item.aspraks as asprak, i}
										<span
											>{asprak.name}{#if i < item.aspraks.length - 1},{/if}</span
										>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</div>

				<div
					class="flex items-center justify-center text-lg text-gray-400
					       transition-transform duration-450
					       group-hover:translate-x-1"
				>
					<ArrowRight size={16} />
				</div>
			</button>
		{/each}
	</div>
</div>
