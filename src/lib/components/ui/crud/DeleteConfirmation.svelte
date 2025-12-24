<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import FormWrapper from '$lib/components/ui/form/FormWrapper.svelte';
	import FormButton from '$lib/components/ui/form/FormButton.svelte';
	import { AlertTriangle } from '@lucide/svelte';
	import { createEventDispatcher } from 'svelte';

	import { toast } from '$lib/stores/toast';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	export let itemName: string;
	export let cancelPath: string | null = null; // Optional now
	export let title: string = 'Confirm Delete';
	export let descriptionPrefix: string = 'Are you sure you want to delete';
	export let buttonText: string = 'Delete';
	export let processingText: string = 'Deleting...';
	export let action: string = '?/delete';
	export let idToCheck: string = ''; // ID to pass to the form

	const dispatch = createEventDispatcher();

	let isSubmitting = false;

	function getSubmitHandler() {
		return () => {
			isSubmitting = true;
			return async ({ result }: { result: any }) => {
				isSubmitting = false;
				if (result.type === 'redirect') {
					toast.success('Deleted successfully');
					await goto(result.location);
				} else if (result.type === 'success') {
					toast.success('Deleted successfully');
					await invalidateAll();
					dispatch('close');
				} else if (result.type === 'failure') {
					toast.error(result.data?.message || 'Failed to delete');
				}
			};
		};
	}

	function handleCancel() {
		if (cancelPath) {
			goto(cancelPath);
		} else {
			dispatch('close');
		}
	}
</script>

<div
	class="fixed inset-0 z-[100] flex items-center justify-center p-4"
	role="dialog"
	aria-modal="true"
>
	<!-- Backdrop -->
	<div
		class="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
		transition:fade={{ duration: 200 }}
		on:click={handleCancel}
		on:keydown={(e) => e.key === 'Escape' && handleCancel()}
		role="presentation"
	></div>

	<!-- Modal Content -->
	<Card class="relative w-full max-w-sm border border-zinc-800 bg-black p-0 shadow-2xl">
		<div transition:scale={{ duration: 200, start: 0.95, easing: cubicOut }} class="p-6">
			<div class="mb-6 flex flex-col items-center text-center">
				<div
					class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white"
				>
					<AlertTriangle class="h-5 w-5" />
				</div>

				<h2 class="mb-2 text-lg font-semibold text-white">{title}</h2>

				<p class="text-sm leading-relaxed text-zinc-500">
					{descriptionPrefix} <span class="text-zinc-300">"{itemName}"</span>? THIS ACTION IS
					IRREVERSIBLE.
				</p>
			</div>

			<div class="grid w-full grid-cols-2 gap-3">
				<Button
					variant="outline"
					class="w-full border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white"
					on:click={handleCancel}
					disabled={isSubmitting}
				>
					Cancel
				</Button>
				<FormWrapper {action} submitHandler={getSubmitHandler()} class="w-full">
					{#if idToCheck}
						<input type="hidden" name="userId" value={idToCheck} />
						<input type="hidden" name="id" value={idToCheck} />
					{/if}
					<FormButton
						variant="destructive"
						type="submit"
						disabled={isSubmitting}
						class="w-full bg-red-600 font-semibold text-white hover:bg-red-700"
					>
						{isSubmitting ? processingText : buttonText}
					</FormButton>
				</FormWrapper>
			</div>
		</div>
	</Card>
</div>
