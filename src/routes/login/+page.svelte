<script lang="ts">
	import '../layout.css';
	import LoginForm from '$lib/components/auth/LoginForm.svelte';
	import CustomCursor from '$lib/components/ui/CustomCursor.svelte';
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
	<title>Login | ArchiveIn</title>
</svelte:head>

<CustomCursor />

<LoginForm />
