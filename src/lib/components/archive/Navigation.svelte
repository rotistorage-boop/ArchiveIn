<script lang="ts">
	import { currentPage, goToArchive } from '$lib/stores/archive-navigation';
	import { ConfirmModal } from '$lib/components/ui';
	import SearchModal from '$lib/components/ui/SearchModal.svelte';

	export let user: {
		id: string;
		email: string;
		name: string | null;
		avatar: string | null;
		role: string;
	} | null = null;

	export let canAccessArchive: boolean = false;

	let showModal = false;
	let showSearch = false;

	function handleNav(id: 'gallery' | 'archive') {
		if (id === 'archive') {
			if (!canAccessArchive) {
				showModal = true;
				return;
			}
			goToArchive();
		} else {
			currentPage.set('gallery');
		}
	}

	function closeModal() {
		showModal = false;
	}

	function goToLogin() {
		window.location.href = '/login';
	}

	// Suppress unused export warning
	$: void user;
</script>

<!-- 
	DESKTOP NAVIGATION 
	Visible only on md+ screens
-->
<!-- 
	UNIFIED NAVIGATION 
	Responsive by default using CSS media queries
-->
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
			class="cursor-pointer text-xs tracking-[0.35em] text-gray-500 transition-all
			       duration-300 hover:tracking-[0.55em]
			       hover:text-white max-md:text-[0.65rem]"
			class:text-white={$currentPage === 'gallery'}
		>
			GALLERY
		</button>

		<button
			on:click={() => handleNav('archive')}
			class="cursor-pointer text-xs tracking-[0.35em] text-gray-500 transition-all duration-300 hover:tracking-[0.55em] hover:text-white max-md:text-[0.65rem]"
			class:text-white={$currentPage === 'archive' || $currentPage === 'detail'}
		>
			ARCHIVE
		</button>

		<button
			on:click={() => (showSearch = true)}
			class="cursor-pointer text-xs tracking-[0.35em] text-gray-500 transition-all duration-300 hover:tracking-[0.55em] hover:text-white max-md:text-[0.65rem]"
		>
			SEARCH
		</button>
	</div>
</nav>

<SearchModal open={showSearch} on:close={() => (showSearch = false)} />

<!-- Archive Access Modal -->
<ConfirmModal
	bind:show={showModal}
	title="Archive Access Required"
	message="Untuk mengakses Archive, kamu perlu login menggunakan email kampus "
	highlight="*trunojoyo.ac.id"
	cancelText="Cancel"
	confirmText="Login"
	on:cancel={closeModal}
	on:confirm={goToLogin}
/>
