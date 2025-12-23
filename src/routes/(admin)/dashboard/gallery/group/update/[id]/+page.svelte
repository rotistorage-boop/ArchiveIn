<script lang="ts">
	import { Save } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import FormWrapper from '$lib/components/ui/form/FormWrapper.svelte';
	import FormInput from '$lib/components/ui/form/FormInput.svelte';
	import FormButton from '$lib/components/ui/form/FormButton.svelte';
	import CrudCard from '$lib/components/ui/crud/CrudCard.svelte';
	import type { PageData } from './$types';

	import { toast } from '$lib/stores/toast';

	export let data: PageData;
	let isSubmitting = false;
	let isItemsSubmitting = false;
	let group = data.group;
	let formGroup = { title: group.title, description: group.description ?? '' };

	// Reactive set for immediate visual feedback on checkboxes
	let selectedProxy = new Set(
		data.allItems.filter((i: any) => i.groupId === group.id).map((i: any) => i.id)
	);

	function getSubmitHandler() {
		return () => {
			isSubmitting = true;
			return ({ result }: { result: any }) => {
				isSubmitting = false;
				if (result.type === 'redirect') {
					toast.success('Gallery Group updated successfully');
					goto(result.location);
				}
			};
		};
	}

	function getItemsSubmitHandler() {
		return () => {
			isItemsSubmitting = true;
			return ({ result }: { result: any }) => {
				isItemsSubmitting = false;
				// Stay on page and show success toast
				if (result.type === 'success' || result.status === 200) {
					toast.success('Group items updated successfully');
					// Ideally we would invalidateAll() here to refresh data,
					// but direct store update or reload works.
					location.reload();
				} else {
					toast.error('Failed to update items');
				}
			};
		};
	}

	function handleCancel() {
		goto('/dashboard/gallery');
	}
</script>

<CrudCard title="Edit Gallery Group" on:click={handleCancel}>
	<FormWrapper action="?" submitHandler={getSubmitHandler()}>
		<FormInput
			id="title"
			name="title"
			label="Title"
			bind:value={formGroup.title}
			placeholder="e.g., Semester 3 Moments"
			required
		/>

		<FormInput
			id="description"
			name="description"
			label="Description"
			bind:value={formGroup.description}
			placeholder="Describe this group..."
		/>

		<div class="flex justify-end gap-3 pt-4">
			<FormButton variant="outline" on:click={handleCancel}>Cancel</FormButton>
			<FormButton type="submit" disabled={isSubmitting}>
				<Save class="mr-2 h-4 w-4" />
				{isSubmitting ? 'Saving...' : 'Save Changes'}
			</FormButton>
		</div>
	</FormWrapper>
</CrudCard>

<!-- Manage Group Items Section -->
<div class="mt-8">
	<CrudCard title="Manage Group Items">
		<FormWrapper action="?/updateItems" submitHandler={getItemsSubmitHandler()}>
			<p class="mb-4 text-sm text-zinc-400">
				Select items to include in this group. Unselected items will be removed from this group (but
				not deleted).
			</p>

			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{#each data.allItems as item}
					<label
						class="relative cursor-pointer overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition-all hover:border-zinc-700 {item.groupId ===
							group.id || selectedProxy.has(item.id)
							? 'ring-2 ring-blue-500'
							: ''}"
					>
						<input
							type="checkbox"
							name={item.groupId === group.id ? 'removedItems' : 'selectedItems'}
							value={item.id}
							checked={item.groupId === group.id}
							class="peer sr-only"
							on:change={(e) => {
								// Simple visual toggle logic if needed, or rely on native checkbox + CSS
								const target = e.currentTarget as HTMLInputElement;
								if (target.checked) {
									selectedProxy.add(item.id);
								} else {
									selectedProxy.delete(item.id);
								}
								selectedProxy = selectedProxy; // trigger reactivity
							}}
						/>

						<!-- Image Preview -->
						<div class="aspect-square w-full">
							<img
								src={item.imageWebpUrl}
								alt={item.title}
								class="h-full w-full object-cover opacity-60 transition-opacity peer-checked:opacity-100"
							/>
						</div>

						<!-- Checkmark Overlay -->
						<div
							class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity peer-checked:opacity-100"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8 text-blue-500"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>

						<p class="truncate px-2 py-1 text-xs text-zinc-300">{item.title}</p>
					</label>
				{/each}
			</div>
			{#if data.allItems.length === 0}
				<p class="text-sm text-zinc-500">No images available in gallery.</p>
			{/if}

			<div class="flex justify-end gap-3 pt-6">
				<FormButton type="submit" disabled={isItemsSubmitting}>
					<Save class="mr-2 h-4 w-4" />
					{isItemsSubmitting ? 'Updating Items...' : 'Update Item Selection'}
				</FormButton>
			</div>
		</FormWrapper>
	</CrudCard>
</div>
