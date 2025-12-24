<script lang="ts">
	import DeleteConfirmation from '$lib/components/ui/crud/DeleteConfirmation.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<DeleteConfirmation
	itemName={data.session.user?.name || data.session.user?.email || 'Unknown User'}
	cancelPath="/dashboard/sessions"
	title="Confirm Terminate"
	descriptionPrefix="Are you sure you want to terminate the session for"
	buttonText="Terminate"
	processingText="Terminating..."
/>
