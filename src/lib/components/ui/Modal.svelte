<!-- src/lib/components/ui/Modal.svelte -->
<script lang="ts">
	import { X } from '@lucide/svelte';

	export let show: boolean = false;
	export let title: string = '';

	function handleBackdropClick(e: MouseEvent): void {
		if (e.target === e.currentTarget) {
			show = false;
		}
	}

	function handleKeydown(e: KeyboardEvent): void {
		if (e.key === 'Escape') {
			show = false;
		}
	}
</script>

{#if show}
	<div
		class="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
		on:click={handleBackdropClick}
		on:keydown={handleKeydown}
		role="dialog"
		tabindex="-1"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<div class="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950">
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-zinc-800 p-6">
				<h3 id="modal-title" class="text-lg font-semibold text-white">{title}</h3>
				<button
					on:click={() => (show = false)}
					class="cursor-pointer text-zinc-400 transition-colors hover:text-white"
					aria-label="Close modal"
					type="button"
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<!-- Content -->
			<div class="p-6">
				<slot />
			</div>

			<!-- Footer -->
			{#if $$slots.footer}
				<div class="border-t border-zinc-800 p-6">
					<slot name="footer" />
				</div>
			{/if}
		</div>
	</div>
{/if}
