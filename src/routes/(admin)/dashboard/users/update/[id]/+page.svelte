<script lang="ts">
	import { Save } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import FormWrapper from '$lib/components/ui/form/FormWrapper.svelte';
	import FormInput from '$lib/components/ui/form/FormInput.svelte';
	import FormSelect from '$lib/components/ui/form/FormSelect.svelte';
	import FormButton from '$lib/components/ui/form/FormButton.svelte';
	import CrudCard from '$lib/components/ui/crud/CrudCard.svelte';
	import type { PageData } from './$types';

	import { toast } from '$lib/stores/toast';

	export let data: PageData;
	let isSubmitting = false;
	let user = data.user;
	let formUser = { role: user.role || 'user' };

	function getSubmitHandler() {
		return () => {
			isSubmitting = true;
			return async ({ result }: { result: any }) => {
				isSubmitting = false;
				if (result.type === 'redirect') {
					toast.success('User role updated successfully');
					await goto(result.location);
				}
			};
		};
	}

	function handleCancel() {
		goto('/dashboard/users');
	}
</script>

<CrudCard title="Edit User Role" on:click={handleCancel}>
	<FormWrapper action="?" submitHandler={getSubmitHandler()}>
		<div class="mb-4">
			<label for="username" class="mb-2 block text-sm font-medium text-zinc-300">Username</label>
			<div
				id="username"
				class="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-500"
			>
				{user.username}
			</div>
		</div>

		<div class="mb-4">
			<label for="email" class="mb-2 block text-sm font-medium text-zinc-300">Email</label>
			<div
				id="email"
				class="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-500"
			>
				{user.email}
			</div>
		</div>

		<FormSelect id="role" name="role" label="Role" bind:value={formUser.role}>
			<option value="user">User</option>
			<option value="admin">Admin</option>
		</FormSelect>

		<div class="flex justify-end gap-3 pt-4">
			<FormButton variant="outline" on:click={handleCancel}>Cancel</FormButton>
			<FormButton type="submit" disabled={isSubmitting}>
				<Save class="mr-2 h-4 w-4" />
				{isSubmitting ? 'Saving...' : 'Save Changes'}
			</FormButton>
		</div>
	</FormWrapper>
</CrudCard>
