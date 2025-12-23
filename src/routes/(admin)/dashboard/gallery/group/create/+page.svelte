<script lang="ts">
	import { Save } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import FormWrapper from '$lib/components/ui/form/FormWrapper.svelte';
	import FormInput from '$lib/components/ui/form/FormInput.svelte';
	import FormButton from '$lib/components/ui/form/FormButton.svelte';
	import CrudCard from '$lib/components/ui/crud/CrudCard.svelte';
	import { toast } from '$lib/stores/toast';

	let isSubmitting = false;
	let formGroup = { title: '', description: '' };

	function getSubmitHandler() {
		return () => {
			isSubmitting = true;
			return async ({ result }: { result: any }) => {
				isSubmitting = false;
				if (result.type === 'redirect') {
					toast.success('Gallery Group created successfully');
					await goto(result.location);
				}
			};
		};
	}

	function handleCancel() {
		goto('/dashboard/gallery');
	}
</script>

<CrudCard title="Create Gallery Group" on:click={handleCancel}>
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
