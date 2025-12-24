<script lang="ts">
	export let variant: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline' = 'primary';
	export let size: 'sm' | 'md' | 'lg' | 'icon' = 'md';
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let disabled: boolean = false;

	let className: string = '';
	export { className as class };

	let baseClasses =
		'cursor-pointer inline-flex items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

	let variantClasses = {
		primary: 'bg-white text-black hover:bg-zinc-200',
		secondary: 'bg-zinc-800 text-white hover:bg-zinc-700',
		destructive: 'bg-red-600 text-white hover:bg-red-700',
		outline:
			'border border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-400 hover:text-white',
		ghost: 'hover:bg-zinc-800 hover:text-white text-zinc-400'
	};

	let sizeClasses = {
		sm: 'h-9 px-3 rounded-md text-xs',
		md: 'h-10 px-4 py-2 rounded-lg text-sm',
		lg: 'h-11 px-8 rounded-md',
		icon: 'h-9 w-9 p-1'
	};
</script>

<button
	{type}
	class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]} {className}"
	{disabled}
	on:click
	{...$$restProps}
>
	<slot />
</button>
