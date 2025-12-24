<script lang="ts">
	import { Search, Edit2, Trash2 } from '@lucide/svelte';
	import type { UserWithLastLogin } from '$lib/types/user';
	import type { PageData } from './$types';
	import { goto, invalidateAll } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { Input, Button } from '$lib/components/ui';
	import DeleteConfirmation from '$lib/components/ui/crud/DeleteConfirmation.svelte';
	import * as Table from '$lib/components/ui/table';

	export let data: PageData;

	let searchQuery: string = '';
	let showDeleteModal = false;
	let userToDelete: UserWithLastLogin | null = null;

	const users: UserWithLastLogin[] = data?.users || [];

	$: filteredUsers = users.filter(
		(u: UserWithLastLogin) =>
			(u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
			u.email.toLowerCase().includes(searchQuery.toLowerCase())
	);

	function handleEdit(user: UserWithLastLogin) {
		goto(`/dashboard/users/update/${user.id}`);
	}

	function confirmDelete(user: UserWithLastLogin) {
		userToDelete = user;
		showDeleteModal = true;
	}

	function cancelDelete() {
		showDeleteModal = false;
		userToDelete = null;
	}
</script>

<svelte:head>
	<title>User Management | ArchiveIn</title>
</svelte:head>

<div class="space-y-6 p-6 lg:p-8">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-white">User Management</h1>
			<p class="mt-1 text-sm text-zinc-500">Manage user accounts and roles</p>
		</div>

		<div class="relative w-full sm:w-80">
			<Search
				class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-zinc-500"
			/>
			<Input type="text" bind:value={searchQuery} placeholder="Search users..." class="pl-10" />
		</div>
	</div>

	<div class="rounded-lg border border-zinc-800 bg-zinc-950">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>User</Table.Head>
					<Table.Head class="hidden sm:table-cell">Email</Table.Head>
					<Table.Head>Role</Table.Head>
					<Table.Head class="hidden md:table-cell">Last Login</Table.Head>
					<Table.Head class="text-right">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each filteredUsers as user (user.id)}
					<Table.Row class="transition-colors hover:bg-zinc-900">
						<Table.Cell>
							<div class="flex items-center">
								{#if user.avatar && user.avatar.length > 0}
									<img
										src={user.avatar}
										alt=""
										class="h-8 w-8 rounded-full object-cover"
										on:error={(e) => {
											(e.currentTarget as HTMLImageElement).style.display = 'none';
										}}
									/>
								{/if}
								{#if !user.avatar || user.avatar.length === 0}
									<div
										class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-medium text-white"
									>
										{(user.name || user.email).charAt(0).toUpperCase()}
									</div>
								{/if}
								<div class="ml-3 min-w-0">
									<p class="truncate text-sm font-medium text-white">{user.name || user.email}</p>
									<p class="truncate text-xs text-zinc-500 sm:hidden">{user.email}</p>
								</div>
							</div>
						</Table.Cell>
						<Table.Cell class="hidden text-zinc-400 sm:table-cell">{user.email}</Table.Cell>
						<Table.Cell>
							<span
								class="inline-flex rounded-full px-2 py-1 text-xs font-medium {user.role === 'admin'
									? 'bg-white text-black'
									: 'bg-zinc-800 text-zinc-300'}"
							>
								{user.role || 'user'}
							</span>
						</Table.Cell>
						<Table.Cell class="hidden text-zinc-400 md:table-cell">{user.lastLogin}</Table.Cell>
						<Table.Cell class="text-right">
							<div class="flex items-center justify-end gap-1">
								<Button
									variant="ghost"
									size="icon"
									class="h-8 w-8 text-zinc-400 hover:text-white"
									on:click={() => handleEdit(user)}
									aria-label="Edit user {user.name || user.email}"
								>
									<Edit2 class="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									class="h-8 w-8 text-zinc-400 hover:bg-red-500/10 hover:text-red-500"
									on:click={() => confirmDelete(user)}
									aria-label="Delete user {user.name || user.email}"
								>
									<Trash2 class="h-4 w-4" />
								</Button>
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}

				{#if filteredUsers.length === 0}
					<Table.Row>
						<Table.Cell colspan={5} class="py-8 text-center text-zinc-500">
							No users found matching "{searchQuery}"
						</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>

<!-- Delete Confirmation Modal -->
<!-- Delete Confirmation Modal -->
{#if showDeleteModal && userToDelete}
	<DeleteConfirmation
		itemName={userToDelete.name || userToDelete.email}
		title="Delete User"
		idToCheck={userToDelete.id}
		action="?/delete"
		on:close={cancelDelete}
		cancelPath={null}
	/>
{/if}
