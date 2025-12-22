<script lang="ts">
	import {
		currentPage,
		selectedDetail,
		goBack,
		navigationPath,
		openPhoto // Added openPhoto import
	} from '$lib/stores/archive-navigation';
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { ExternalLink, Figma, FolderDot, FileText, ArrowLeft } from '@lucide/svelte';

	function handleBack() {
		currentPage.set('archive');
	}

	$: displayIconComponent = (() => {
		if (!$selectedDetail) return ExternalLink;
		const platform = $selectedDetail.linkPlatform;
		if (!platform) return ExternalLink;
		switch (platform) {
			case 'gdrive':
				return FolderDot;
			case 'figma':
				return Figma;
			case 'pdf':
				return FileText;
			default:
				return ExternalLink;
		}
	})();

	$: formattedPlatformName = (() => {
		if (!$selectedDetail) return '';
		const platform = $selectedDetail.linkPlatform;
		if (!platform) return '';
		switch (platform) {
			case 'gdrive':
				return 'Google Drive';
			case 'figma':
				return 'Figma';
			case 'pdf':
				return 'PDF';
			default:
				return platform.charAt(0).toUpperCase() + platform.slice(1);
		}
	})();
</script>

{#if $selectedDetail}
	<div
		in:fade={{ duration: 900, easing: quintOut }}
		class="mx-auto max-w-6xl py-16 pb-24 max-md:w-full max-md:py-8 max-md:pb-16"
	>
		<div class="mb-20 max-w-190 max-md:mb-12">
			<h1
				class="mb-6 text-[2.6rem] leading-[1.15] font-thin tracking-[0.18em] text-white max-md:mb-4 max-md:text-2xl max-md:leading-[1.2] max-md:tracking-[0.12em]"
			>
				{$selectedDetail!.title || 'Untitled Item'}
			</h1>
			<div
				class="flex flex-wrap items-center gap-1.5 text-xs tracking-[0.25em] max-md:text-[0.6rem] max-md:tracking-[0.2em]"
			>
				{#each ['Archive', ...$navigationPath, $selectedDetail!.title || 'Untitled Item'] as item, i}
					<span class="text-gray-300">{item}</span>
					{#if i < ['Archive', ...$navigationPath, $selectedDetail!.title || 'Untitled Item'].length - 1}
						<span class="text-gray-600">/</span>
					{/if}
				{/each}
			</div>
		</div>

		{#if $selectedDetail!.description}
			<div
				class="mb-24 max-w-190 text-[0.95rem] leading-[1.9] text-gray-200 max-md:mb-16 max-md:text-[0.9rem]"
			>
				{$selectedDetail!.description}
			</div>
		{/if}

		{#if $selectedDetail!.documentation && $selectedDetail!.documentation.length > 0}
			<div class="mb-12 text-[0.65rem] tracking-[0.32em] text-gray-500 max-md:mb-8">
				DOCUMENTATION
			</div>

			{#each $selectedDetail!.documentation as doc}
				<div class="mb-24 max-md:mb-16">
					<button
						on:click={() =>
							openPhoto({ src: doc.image, title: doc.caption || '', desc: doc.subtitle || '' })}
						class="block w-full cursor-pointer transition-opacity duration-200 hover:opacity-80"
					>
						<div class="mb-6 max-w-[78%] max-lg:max-w-full max-md:mb-4">
							<img
								src={doc.image}
								alt={doc.caption}
								class="block w-full contrast-[1.15] grayscale transition-all duration-600 ease-in-out hover:contrast-100 hover:grayscale-0"
							/>
						</div>
					</button>
					<div class="mb-1.5 text-xs tracking-[0.2em] text-gray-300 max-md:text-[0.7rem]">
						{doc.caption}
					</div>
					<div class="text-xs tracking-[0.15em] text-gray-500 max-md:text-[0.7rem]">
						{doc.subtitle}
					</div>
				</div>
			{/each}
		{/if}

		{#if $selectedDetail!.link}
			<div class="mb-24 max-md:mb-16">
				<div class="mb-12 text-[0.65rem] tracking-[0.32em] text-gray-500 max-md:mb-8">LINK</div>
				<a
					href={$selectedDetail!.link!}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 text-sm text-blue-400 transition-colors duration-200 hover:text-blue-300"
				>
					<svelte:component this={displayIconComponent} size={16} />
					<span>
						{formattedPlatformName ? formattedPlatformName + ' - ' : ''}
						{$selectedDetail!.link!}
					</span>
				</a>
			</div>
		{/if}

		<button
			on:click={handleBack}
			class="flex items-center gap-1 text-xs tracking-[0.35em] text-gray-400 transition-colors duration-300 hover:text-white max-md:text-[0.7rem]"
		>
			<ArrowLeft size={14} /> BACK TO ARCHIVE
		</button>
	</div>
{/if}
