<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Users, Lock } from '@lucide/svelte';
	
	let username = '';
	let password = '';

	let form = $page.form;
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-950">
	<div class="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 p-8 shadow-lg">
		<h1 class="mb-6 text-center text-3xl font-bold text-white">Login</h1>
		<form method="POST" action="?/login" use:enhance>
			<div class="mb-4">
				<label for="username" class="mb-2 block text-sm font-medium text-zinc-300">Username</label>
				<div class="relative">
					<span class="absolute inset-y-0 left-0 flex items-center pl-3">
						<Users class="h-5 w-5 text-zinc-500" />
					</span>
					<input
						type="text"
						id="username"
						name="username"
						bind:value={username}
						class="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pr-3 pl-10 text-white placeholder-zinc-500 focus:border-white focus:outline-none"
						placeholder="Enter your username"
						required
					/>
				</div>
			</div>
			<div class="mb-6">
				<label for="password" class="mb-2 block text-sm font-medium text-zinc-300">Password</label>
				<div class="relative">
					<span class="absolute inset-y-0 left-0 flex items-center pl-3">
						<Lock class="h-5 w-5 text-zinc-500" />
					</span>
					<input
						type="password"
						id="password"
						name="password"
						bind:value={password}
						class="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pr-3 pl-10 text-white placeholder-zinc-500 focus:border-white focus:outline-none"
						placeholder="Enter your password"
						required
					/>
				</div>
			</div>
			<button
				type="submit"
				class="w-full rounded-lg bg-white py-2 text-base font-medium text-black transition-colors hover:bg-zinc-200"
				>Login</button
			>
		</form>
	</div>
</div>
