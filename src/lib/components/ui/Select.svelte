<script lang="ts">
	export let value: any;
	export let required: boolean = false;
	export let id: string = '';
	export let name: string = '';
	export let options: { value: any; label: string }[] = [];
	export let placeholder: string = 'Select an option';

	let className: string = '';
	export { className as class };
</script>

<select
	{id}
	{name}
	bind:value
	{required}
	class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white focus:border-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 {className}"
	{...$$restProps}
	on:change
>
	{#if placeholder}
		<option value="" disabled selected>{placeholder}</option>
	{/if}

	{#if options.length > 0}
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	{:else}
		<slot />
	{/if}
</select>
