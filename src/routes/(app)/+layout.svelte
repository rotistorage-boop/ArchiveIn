<script lang="ts">
	import '../layout.css';
	import { onMount, onDestroy } from 'svelte';
	import { gsap } from 'gsap';
	import CustomCursor from '$lib/components/ui/CustomCursor.svelte';
	import WelcomeLoader from '$lib/components/ui/WelcomeLoader.svelte';

	let { children } = $props();
	let mainContent: HTMLDivElement;

	onMount(() => {
		// 1. Mobile Check - STRICT DISABLE
		const mobileCheck = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024;

		// 2. Entry Animation (Desktop Only for Performance)
		if (!mobileCheck) {
			document.documentElement.style.scrollBehavior = 'smooth';

			// Simple, Clean Entry
			gsap.from(mainContent, {
				opacity: 0,
				scale: 0.98,
				duration: 0.4,
				ease: 'power2.out',
				delay: 0.1 // Slight breath
			});
		} else {
			document.documentElement.style.scrollBehavior = 'auto'; // Force native
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			document.documentElement.style.scrollBehavior = 'auto'; // Revert
		}
	});
</script>

<svelte:head><link rel="icon" href="/favicon.svg" /></svelte:head>

<CustomCursor />
<WelcomeLoader />

<div bind:this={mainContent} class="relative w-full">
	{@render children()}
</div>
