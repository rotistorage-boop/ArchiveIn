<script lang="ts">
	import '../layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount, onDestroy } from 'svelte';
	import Lenis from '@studio-freight/lenis';

	let lenis: Lenis | null = null;
	let rafId: number;

	onMount(() => {
		lenis = new Lenis({
			duration: 1.1,
			easing: (t) => 1 - Math.pow(1 - t, 3),
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 1
		});

		const raf = (time: number) => {
			lenis?.raf(time);
			rafId = requestAnimationFrame(raf);
		};

		rafId = requestAnimationFrame(raf);
	});

	onDestroy(() => {
		if (rafId) cancelAnimationFrame(rafId);
		lenis?.destroy();
	});

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
