<script lang="ts">
	import DeleteConfirmation from '$lib/components/ui/crud/DeleteConfirmation.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<DeleteConfirmation itemName={data.group.title} cancelPath="/dashboard/gallery" />
