<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { isLoading } from '$lib/stores/loader';

	let show = true;
	let containerRef: HTMLDivElement;
	let lineRef: SVGLineElement;
	let loopTween: gsap.core.Tween;

	onMount(() => {
		// Reset loading state to ensure cursor is hidden when this component mounts
		isLoading.set(true);

		// Strict mobile disable
		const mobileCheck = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 1024;
		if (mobileCheck) {
			show = false;
			isLoading.set(false);
			return;
		}

		// PHASE 4: RESOLUTION (Exit Sequence)
		const resolve = () => {
			if (loopTween) loopTween.kill(); // Stop the loop

			const tlExit = gsap.timeline({
				onComplete: () => {
					show = false;
					isLoading.set(false); // Release cursor
				}
			});

			tlExit
				// Collapse line to center
				.to(lineRef, {
					scaleX: 0,
					opacity: 1, // Ensure fully visible for the collapse
					duration: 0.5,
					ease: 'power4.inOut'
				})
				// Fade out container
				.to(containerRef, {
					opacity: 0,
					duration: 0.8,
					ease: 'power2.inOut'
				});
		};

		// INIT & LOOP Sequence
		const tl = gsap.timeline({
			// If loading finishes naturally (which it won't due to infinite loop), do nothing.
			// We rely on the reactive block or external call to trigger resolve.
		});

		// Initial State
		gsap.set(lineRef, {
			scaleX: 0,
			opacity: 0,
			transformOrigin: 'center center'
		});

		tl
			// PHASE 1: INIT (Slow Draw)
			.to(lineRef, {
				scaleX: 0.2, // Start small
				opacity: 1,
				duration: 2.5, // Very slow entry
				ease: 'power2.out'
			})
			// PHASE 2: PROCESS (The Infinite Breather)
			.call(() => {
				// Start the separate loop tween
				loopTween = gsap.to(lineRef, {
					scaleX: 0.4, // Breathe out
					opacity: 0.6, // Dim slightly
					duration: 3, // Slow breath
					ease: 'sine.inOut',
					yoyo: true,
					repeat: -1
				});
			});

		// Watch for Timeout to Ensure Resolution
		// Enforce "Long and Deliberate" (e.g. 5 seconds)
		const timer = setTimeout(() => {
			if (show) resolve();
		}, 5000);

		// Watch for Loading Completion (External)
		const unsubscribe = isLoading.subscribe((loading) => {
			// If external loading finishes, we could resolve early.
			// But for "Intentionally LONG", we might prefer the timer.
			// Currently, we let the timer handle it unless we want to support fast skipping.
			// If we want to support fast skip:
			// if (!loading && show) resolve();
		});

		return () => {
			clearTimeout(timer);
			unsubscribe();
			if (loopTween) loopTween.kill();
		};
	});
</script>

{#if show}
	<div
		bind:this={containerRef}
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black"
	>
		<!-- 
			DELIBERATE LINE
			Fixed height, variable width potential.
		-->
		<div class="h-2 w-64 text-white">
			<svg viewBox="0 0 100 2" class="h-full w-full overflow-visible">
				<line
					bind:this={lineRef}
					x1="0"
					y1="1"
					x2="100"
					y2="1"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					style="opacity: 0; transform-origin: center; transform-box: fill-box;"
				/>
			</svg>
		</div>
	</div>
{/if}
