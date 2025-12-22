<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white">
	<h1 class="mb-4 text-6xl font-bold">{$page.status}</h1>
	<p class="mb-8 text-xl">{$page.error?.message}</p>
	<a href="/" class="rounded-lg bg-white px-4 py-2 text-base font-medium text-black transition-colors hover:bg-zinc-200">
		Go to Homepage
	</a>
</div>
