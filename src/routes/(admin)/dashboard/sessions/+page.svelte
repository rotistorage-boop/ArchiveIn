<script lang="ts">
	import { Search, Trash2 } from '@lucide/svelte';
	import type { SessionWithUser } from '$lib/types/session';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { Input, Button } from '$lib/components/ui';
	import * as Table from '$lib/components/ui/table';

	export let data: PageData;

	let searchQuery: string = '';

	// Use data.sessions from the load function
	$: sessions = data?.sessions || [];

	// Filter sessions based on search query
	$: filteredSessions = sessions.filter(
		(s: SessionWithUser) =>
			(s.user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
			s.user.email.toLowerCase().includes(searchQuery.toLowerCase())
	);

	function handleDelete(id: string) {
		goto(`/dashboard/sessions/delete/${id}`);
	}
</script>

<svelte:head>
	<title>Session Management | ArchiveIn</title>
</svelte:head>

<div class="space-y-6 p-6 lg:p-8">
	<!-- Page Title & Actions -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-white">Session Management</h1>
			<p class="mt-1 text-sm text-zinc-500">Monitor and manage active user sessions</p>
		</div>

		<div class="relative w-full sm:w-80">
			<Search
				class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-zinc-500"
			/>
			<Input type="text" bind:value={searchQuery} placeholder="Search sessions..." class="pl-10" />
		</div>
	</div>

	<!-- Sessions Table -->
	<div class="rounded-lg border border-zinc-800 bg-zinc-950">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>User</Table.Head>
					<Table.Head class="hidden sm:table-cell">Email</Table.Head>
					<Table.Head class="hidden md:table-cell">Expires</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head class="text-right">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each filteredSessions as session (session.id)}
					<Table.Row class="transition-colors hover:bg-zinc-900">
						<Table.Cell>
							<div class="flex items-center">
								<div
									class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-white"
								>
									{(session.user.name || session.user.email).charAt(0).toUpperCase()}
								</div>
								<div class="ml-3">
									<p class="text-sm font-medium text-white">{session.user.name || 'User'}</p>
									<p class="text-xs text-zinc-500 sm:hidden">{session.user.email}</p>
								</div>
							</div>
						</Table.Cell>
						<Table.Cell class="hidden text-zinc-400 sm:table-cell">{session.user.email}</Table.Cell>
						<Table.Cell class="hidden text-zinc-400 md:table-cell">
							{new Date(session.expiresAt).toLocaleString()}
						</Table.Cell>
						<Table.Cell>
							<span
								class="inline-flex rounded-full bg-green-900/30 px-2 py-1 text-xs font-medium text-green-400"
							>
								Active
							</span>
						</Table.Cell>
						<Table.Cell class="text-right">
							<Button
								on:click={() => handleDelete(session.id)}
								variant="ghost"
								size="sm"
								class="text-zinc-400 hover:bg-zinc-800 hover:text-red-500"
								aria-label="Terminate session"
							>
								<Trash2 class="h-4 w-4" />
							</Button>
						</Table.Cell>
					</Table.Row>
				{/each}

				{#if filteredSessions.length === 0}
					<Table.Row>
						<Table.Cell colspan={5} class="py-8 text-center text-zinc-500">
							No active sessions found matching "{searchQuery}"
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>
