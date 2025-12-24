<script>
	import { page } from '$app/stores';
	import { AlertCircle, Home, LayoutDashboard } from '@lucide/svelte';
</script>

<div
	class="flex h-screen w-full flex-col items-center justify-center bg-black text-center text-white"
>
	<div class="max-w-md space-y-4">
		<div class="mb-4 inline-flex items-center justify-center rounded-full bg-red-500/10 p-4">
			<AlertCircle class="h-8 w-8 text-red-500" />
		</div>
		<h1 class="text-4xl font-bold tracking-tight">{$page.status}</h1>
		<p class="text-zinc-400">{$page.error?.message || 'Something went wrong.'}</p>
		<div class="flex justify-center gap-3 pt-4">
			<a
				href="/dashboard"
				class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-black transition-colors hover:bg-zinc-200"
			>
				<LayoutDashboard class="h-4 w-4" />
				Dashboard
			</a>
			<a
				href="/"
				class="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800"
			>
				<Home class="h-4 w-4" />
				Home
			</a>
		</div>
	</div>
</div>
