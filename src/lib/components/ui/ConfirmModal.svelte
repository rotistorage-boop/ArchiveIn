<script lang="ts">
	import { BookOpen, X } from '@lucide/svelte';
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';
	import { cubicOut } from 'svelte/easing';

	export let show = false;
	export let title = 'Archive Access Required';
	export let message = 'Untuk mengakses Archive, kamu perlu login menggunakan email dengan domain';
	export let highlight = '@trunojoyo.ac.id';
	export let cancelText = 'Cancel';
	export let confirmText = 'Login';

	const dispatch = createEventDispatcher<{
		cancel: void;
		confirm: void;
	}>();

	function modalTransition(node: Element, { duration = 300 }: { duration?: number } = {}) {
		return {
			duration,
			css: (t: number) => {
				const eased = cubicOut(t);
				return `
					opacity: ${eased};
					transform: translateY(${(1 - eased) * 15}px);
				`;
			}
		};
	}

	function backdropTransition(node: Element, { duration = 400 }: { duration?: number } = {}) {
		return {
			duration,
			css: (t: number) => `opacity: ${t}`
		};
	}

	function handleCancel() {
		dispatch('cancel');
	}

	function handleConfirm() {
		dispatch('confirm');
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleCancel();
		}
	}

	function handleBackdropClick() {
		handleCancel();
	}
</script>

{#if show}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		transition:backdropTransition
		class="dialog-backdrop fixed inset-0 z-[100] flex items-center justify-center p-4"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		tabindex="-1"
	>
		<!-- BACKDROP DARKEN (No Blur for Performance) -->
		<div class="absolute inset-0 bg-black/90"></div>

		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			transition:modalTransition
			class="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/5 bg-[#0A0A0A] p-6 shadow-2xl"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="document"
		>
			<!-- CLOSE BUTTON -->
			<button
				onclick={handleCancel}
				class="absolute top-4 right-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
				aria-label="Close"
			>
				<X class="h-4 w-4" />
			</button>

			<div class="flex flex-col gap-4">
				<!-- Header with Icon & Title side-by-side or stacked left aligned -->
				<div class="flex items-start gap-4">
					<div
						class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/5 shadow-inner"
					>
						<BookOpen class="h-6 w-6 text-white" />
					</div>
					<div>
						<h2 class="text-lg font-medium tracking-wide text-white">{title}</h2>
						<p class="mt-1 text-sm leading-relaxed text-gray-400">
							{message}
							{#if highlight}
								<span class="mt-1 block font-medium text-white">{highlight}</span>
							{/if}
						</p>
					</div>
				</div>

				<!-- BUTTONS -->
				<div class="mt-4 flex justify-end gap-3">
					<Button
						variant="outline"
						on:click={handleCancel}
						class="h-10 border-white/10 bg-transparent px-6 text-sm font-medium text-gray-400 hover:border-white/20 hover:bg-white/5 hover:text-white"
					>
						{cancelText}
					</Button>
					<Button
						variant="primary"
						on:click={handleConfirm}
						class="h-10 bg-white px-6 text-sm font-bold text-black hover:bg-gray-200"
					>
						{confirmText}
					</Button>
				</div>
			</div>
		</div>
	</div>
{/if}
