<script lang="ts">
	import { selectedPhoto } from '$lib/stores/archive-navigation';
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	function closeModal() {
		selectedPhoto.set(null);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $selectedPhoto}
	<div
		in:fade={{ duration: 500, easing: quintOut }}
		out:fade={{ duration: 500, easing: quintOut }}
		on:click={closeModal}
		on:keydown={handleKeydown}
		role="button"
		tabindex="0"
		class="fixed inset-0 z-1000 flex cursor-pointer items-center justify-center bg-black/96"
	>
		<button
			on:click={closeModal}
			class="fixed top-8 right-8 z-10 text-xl text-gray-400 transition-all duration-300 hover:rotate-90 hover:text-white"
		>
			×
		</button>

		<div
			in:scale={{ duration: 500, easing: quintOut, start: 0.96 }}
			out:scale={{ duration: 500, easing: quintOut, start: 0.96 }}
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="button"
			tabindex="0"
			class="max-w-[85vw] cursor-default text-center"
		>
			<img
				src={$selectedPhoto.src}
				alt={$selectedPhoto.title}
				class="mb-6 max-h-[70vh] max-w-full select-none"
			/>
			<div class="mb-2 text-sm tracking-[0.15em] text-white">
				{$selectedPhoto.title}
			</div>
			<div class="text-xs tracking-[0.12em] text-gray-400">
				{$selectedPhoto.desc}
				{#if $selectedPhoto.date}
					<span>| {$selectedPhoto.date}</span>
				{/if}
			</div>
		</div>
	</div>
{/if}
