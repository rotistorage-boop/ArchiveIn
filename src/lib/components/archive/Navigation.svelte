<script lang="ts">
	import { currentPage, goToArchive } from '$lib/stores/archive-navigation';

	function handleNav(id: 'gallery' | 'archive') {
		if (id === 'archive') {
			goToArchive();
		} else {
			currentPage.set('gallery');
		}
	}
</script>

<nav
	class="fixed top-1/2 left-8 z-50 -translate-y-1/2
	       max-md:top-0 max-md:right-0 max-md:left-0 max-md:translate-y-0 max-md:bg-linear-to-b max-md:from-black/70 max-md:to-transparent max-md:backdrop-blur-md"
>
	<div
		class="flex gap-12 [writing-mode:vertical-rl]
		       max-md:flex-row max-md:justify-center max-md:gap-8
		       max-md:py-4 max-md:[writing-mode:horizontal-tb]"
	>
		<button
			on:click={() => handleNav('gallery')}
			class="text-xs tracking-[0.35em] text-gray-500 transition-all
			       duration-300 hover:tracking-[0.55em]
			       hover:text-white max-md:text-[0.65rem]"
			class:text-white={$currentPage === 'gallery'}
		>
			GALLERY
		</button>

		<button
			on:click={() => handleNav('archive')}
			class="text-xs tracking-[0.35em] text-gray-500 transition-all
			       duration-300 hover:tracking-[0.55em]
			       hover:text-white max-md:text-[0.65rem]"
			class:text-white={$currentPage === 'archive' || $currentPage === 'detail'}
		>
			ARCHIVE
		</button>
	</div>
</nav>
