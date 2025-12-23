<script lang="ts">
	export let value: string | number;
	export let type: string = 'text';
	export let placeholder: string = '';
	export let required: boolean = false;
	export let id: string = '';
	export let name: string = '';

	let className: string = '';
	export { className as class };
</script>

<input
	{type}
	{id}
	{name}
	bind:value
	{placeholder}
	{required}
	class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-600 focus:border-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 {className}"
	{...$$restProps}
/>
