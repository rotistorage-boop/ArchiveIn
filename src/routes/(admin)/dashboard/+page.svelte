<!-- src/routes/(admin)/dashboard/+page.svelte -->
<script lang="ts">
	import StatsCard from '$lib/components/dashboard/StatsCard.svelte';
	import ActivityFeed from '$lib/components/dashboard/ActivityFeed.svelte';
	import { Users, FolderOpen, Image, Clock } from '@lucide/svelte';
	import type { StatCard, QuickStat, Activity } from '$lib/types/common';
	import type { ComponentType } from 'svelte';

	interface StatsData {
		icon: ComponentType;
		title: string;
		value: string;
		change: string;
	}

	const stats: StatsData[] = [
		{ icon: Users as any, title: 'Total Users', value: '24', change: '+2 this week' },
		{ icon: FolderOpen as any, title: 'Archives', value: '156', change: '+12 this month' },
		{ icon: Image as any, title: 'Gallery Items', value: '342', change: '+28 this week' },
		{ icon: Clock as any, title: 'Active Sessions', value: '8', change: '2 online now' }
	];

	const activities: Activity[] = [
		{
			user: 'johndoe',
			action: 'uploaded 3 photos to',
			target: 'Semester 3 Moments',
			time: '2 hours ago'
		},
		{
			user: 'janedoe',
			action: 'created new archive',
			target: 'Web Development Project',
			time: '5 hours ago'
		},
		{ user: 'admin', action: 'updated course', target: 'Basis Data', time: '1 day ago' }
	];

	const quickStats: QuickStat[] = [
		{ label: 'Storage Used', value: '2.4 GB / 10 GB', percentage: 24 },
		{ label: 'Total Courses', value: '11 courses' },
		{ label: 'Gallery Groups', value: '6 groups' }
	];
</script>

<svelte:head>
	<title>Dashboard | ArchiveIn</title>
</svelte:head>

<div class="space-y-6 p-6 lg:p-8">
	<!-- Page Title -->
	<div>
		<h1 class="text-2xl font-bold text-white">Overview</h1>
		<p class="mt-1 text-sm text-zinc-500">Dashboard overview and quick stats</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each stats as stat (stat.title)}
			<StatsCard {...stat} />
		{/each}
	</div>

	<!-- Activity & Quick Stats -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
		<!-- Recent Activity -->
		<div class="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
			<h3 class="mb-4 text-sm font-semibold text-white">Recent Activity</h3>
			<ActivityFeed {activities} />
		</div>

		<!-- Quick Stats -->
		<div class="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
			<h3 class="mb-4 text-sm font-semibold text-white">Quick Stats</h3>
			<div class="space-y-4">
				{#each quickStats as stat (stat.label)}
					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<span class="text-sm text-zinc-400">{stat.label}</span>
							<span class="text-sm font-medium text-white">{stat.value}</span>
						</div>
						{#if stat.percentage !== undefined}
							<div class="h-2 w-full rounded-full bg-zinc-800">
								<div
									class="h-2 rounded-full bg-white transition-all"
									style="width: {stat.percentage}%"
								></div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
