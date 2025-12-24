<script lang="ts">
	import { Plus, Edit2, Trash2, Calendar, Search } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	let searchQuery: string = '';

	$: semesters = data?.semesters || [];

	// Filter
	$: filteredSemesters = semesters.filter((s: any) =>
		s.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Navigation
	function handleCreate() {
		goto('/dashboard/archives/semester/create');
	}

	function handleEdit(id: number) {
		goto(`/dashboard/archives/semester/update/${id}`);
	}

	function handleDelete(id: number) {
		goto(`/dashboard/archives/semester/delete/${id}`);
	}

	function handleViewDetails(id: number) {
		goto(`/dashboard/archives/semester/${id}`);
	}
</script>

<svelte:head>
	<title>Archive Management | ArchiveIn</title>
</svelte:head>

<div class="space-y-6 p-6 lg:p-8">
	<!-- Page Title & Actions -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-white">Archive Management</h1>
			<p class="mt-1 text-sm text-zinc-500">Manage semesters and their courses</p>
		</div>

		<div class="flex gap-3">
			<div class="relative flex-1 sm:w-64">
				<Search
					class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-zinc-500"
				/>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search semester..."
					class="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2 pr-4 pl-10 text-sm text-white placeholder-zinc-500 transition-colors focus:border-white focus:outline-none"
				/>
			</div>
			<button
				on:click={handleCreate}
				class="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-black transition-colors hover:bg-zinc-200"
				type="button"
			>
				<Plus class="h-4 w-4" />
				New Semester
			</button>
		</div>
	</div>

	<!-- Semesters Grid -->
	<div>
		<h2 class="mb-4 text-lg font-semibold text-white">Semesters</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each filteredSemesters as semester (semester.id)}
				<div
					class="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 transition-colors hover:border-zinc-700"
				>
					<!-- Clickable Area for Details -->
					<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
					<div class="cursor-pointer p-6" on:click={() => handleViewDetails(semester.id)}>
						<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-900">
							<Calendar class="h-6 w-6 text-zinc-500 transition-colors group-hover:text-white" />
						</div>
						<h3 class="mb-1 text-lg font-semibold text-white">{semester.name}</h3>
						<p class="text-sm text-zinc-500">{semester.startYear} - {semester.endYear}</p>

						<div class="mt-4 flex items-center text-xs text-zinc-600">
							<span
								>{data.mataKuliahs?.filter((m: any) => m.semesterId === semester.id).length || 0} Courses</span
							>
						</div>
					</div>

					<!-- Actions Top Right -->
					<div
						class="absolute top-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<button
							on:click|stopPropagation={() => handleEdit(semester.id)}
							class="rounded-md bg-zinc-900 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
							aria-label="Edit"
						>
							<Edit2 class="h-4 w-4" />
						</button>
						<button
							on:click|stopPropagation={() => handleDelete(semester.id)}
							class="rounded-md bg-zinc-900 p-2 text-zinc-400 hover:bg-red-900/30 hover:text-red-500"
							aria-label="Delete"
						>
							<Trash2 class="h-4 w-4" />
						</button>
					</div>
				</div>
			{/each}

			{#if filteredSemesters.length === 0}
				<div
					class="col-span-full rounded-lg border border-dashed border-zinc-800 p-8 text-center text-zinc-500"
				>
					No semesters found. Create one to get started.
				</div>
			{/if}
		</div>
	</div>
</div>
