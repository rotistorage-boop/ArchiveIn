<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { spring } from 'svelte/motion';
	import { isLoading } from '$lib/stores/loader';

	// ==========================================
	// CONFIGURATION
	// ==========================================

	// 1. DEFAULT SIZE
	// The base size of the cursor in pixels (width/height)
	const CURSOR_SIZE = 40;

	// 2. HOVER SIZE SCALE
	// How much to scale up when hovering interactive elements (1.5 = 150%)
	const HOVER_SCALE = 3;

	// 3. TRANSITION SETTINGS
	// Physics for the movement and scaling
	// Stiffness: Higher = snappier, less wobble
	// Damping: Higher = less oscillation/bounce
	const SPRING_CONFIG = {
		stiffness: 0.15,
		damping: 0.7
	};

	const SCALE_SPRING_CONFIG = {
		stiffness: 0.15,
		damping: 0.6
	};

	// ==========================================
	// STATE
	// ==========================================

	let isHovering = false;
	let isClicking = false;
	let isVisible = false;

	// Mouse position spring
	const items = spring({ x: -100, y: -100 }, SPRING_CONFIG);

	// Scale spring
	const scale = spring(1, SCALE_SPRING_CONFIG);

	// ==========================================
	// LOGIC
	// ==========================================

	function handleMouseMove(e: MouseEvent) {
		items.set({ x: e.clientX, y: e.clientY });
		if (!isVisible && !$isLoading) isVisible = true;
	}

	function handleMouseDown() {
		isClicking = true;
	}

	function handleMouseUp() {
		isClicking = false;
	}

	function handleMouseOver(e: MouseEvent) {
		const target = e.target as HTMLElement;

		// Check if target is or is inside an interactive element
		const interactive = target.closest(
			'a, button, input, textarea, select, [role="button"], .interactive, .cursor-hover, label'
		);

		isHovering = !!interactive;
	}

	function handleMouseLeave() {
		isVisible = false;
	}

	function handleMouseEnter() {
		if (!$isLoading) isVisible = true;
	}

	let isDisabled = false;

	onMount(() => {
		// Check for touch device or small screen
		const isTouch = window.matchMedia('(pointer: coarse)').matches;
		const isMobile = window.innerWidth < 1024;

		if (isTouch || isMobile) {
			isDisabled = true;
			return;
		}

		// Event listeners
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mousedown', handleMouseDown);
		window.addEventListener('mouseup', handleMouseUp);
		window.addEventListener('mouseover', handleMouseOver);

		// Handle page visibility
		document.addEventListener('mouseleave', handleMouseLeave);
		document.addEventListener('mouseenter', handleMouseEnter);

		// Hide native cursor globally on mount
		document.documentElement.classList.add('no-cursor');
	});

	onDestroy(() => {
		// Cleanup
		if (typeof window !== 'undefined') {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mousedown', handleMouseDown);
			window.removeEventListener('mouseup', handleMouseUp);
			window.removeEventListener('mouseover', handleMouseOver);
			document.removeEventListener('mouseleave', handleMouseLeave);
			document.removeEventListener('mouseenter', handleMouseEnter);

			// Restore native cursor
			document.documentElement.classList.remove('no-cursor');
		}
	});

	// Reactive scale calculation
	$: targetScale = isClicking
		? isHovering
			? HOVER_SCALE * 0.9
			: 0.8 // Click state
		: isHovering
			? HOVER_SCALE
			: 1; // Hover vs Default state

	$: scale.set(targetScale);
</script>

<!-- 
	Global Styles for Cursor Suppression 
	Attached here to ensure it only applies when this component is mounted
-->
<svelte:head>
	<style>
		html.no-cursor,
		html.no-cursor body,
		html.no-cursor * {
			cursor: none !important;
		}
	</style>
</svelte:head>

{#if !isDisabled && !$isLoading}
	<div
		class="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
		style="
		width: {CURSOR_SIZE}px;
		height: {CURSOR_SIZE}px;
		transform: translate3d({$items.x - CURSOR_SIZE / 2}px, {$items.y -
			CURSOR_SIZE / 2}px, 0) scale({$scale});
	"
	>
		<div
			class="h-full w-full rounded-full bg-white"
			style="opacity: {isVisible ? 1 : 0}; transition: opacity 0.2s ease;"
		></div>
	</div>
{/if}

<!-- 
	DOCUMENTATION:
	
	TO ADJUST CURSOR SIZE:
	Change const CURSOR_SIZE = 12;

	TO ADJUST HOVER SCALING:
	Change const HOVER_SCALE = 2.5;

	TO ADJUST SPEED/SMOOTHNESS:
	Change SPRING_CONFIG stiffness (speed) and damping (bounciness).
-->
