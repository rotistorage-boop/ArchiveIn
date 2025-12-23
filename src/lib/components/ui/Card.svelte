<script lang="ts">
	let className: string = '';
	export { className as class };
</script>

<div class="rounded-lg border border-zinc-800 bg-zinc-950 p-6 {className}">
	<slot />
</div>
