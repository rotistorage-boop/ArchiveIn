<script lang="ts">
	export let value: string;
	export let placeholder: string = '';
	export let required: boolean = false;
	export let id: string = '';
	export let name: string = '';
	export let rows: number = 4;

	let className: string = '';
	export { className as class };
</script>

<textarea
	{id}
	{name}
	bind:value
	{placeholder}
	{required}
	{rows}
	class="w-full resize-y rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-600 focus:border-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 {className}"
	{...$$restProps}
></textarea>
