<script lang="ts">
	import cipheremLogo from '$lib/images/cipherem_logo.svg';
	import tiwtter from '$lib/images/twitter.svg';
	import discord from '$lib/images/discord.svg';
	import git from '$lib/images/git.svg';

	let isNavVisible = false;

	function toggleNav() {
		isNavVisible = !isNavVisible;
	}
</script>

<nav class="max-w-[1200px] gradient-border mx-auto my-5 w-full border-none rounded-xl">
	<div class="flex flex-wrap items-center justify-between p-2 md:p-3 lg:p-4 xl:p-5 header_outer">
		<a href="https://flowbite.com/" class="flex items-center space-x-3 rtl:space-x-reverse">
			<img src={cipheremLogo} class="h-8 w-36 sm:w-full" alt="Flowbite Logo" />
		</a>
		<div class="flex md:order-2">
			<ul class="flex items-center gap-3 sm:gap-5">
				<li>
					<img src={tiwtter} alt="tiwtter" />
				</li>
				<li>
					<img src={discord} alt="discord" />
				</li>
				<li>
					<img src={git} alt="git" />
				</li>
			</ul>
			<button
				class="inline-flex items-center p-1 w-10 h-10 sm:ml-4 md:hidden justify-center text-sm text-white cursor-pointer"
				on:click={toggleNav}
			>
				<svg
					class="w-5 h-5"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 17 14"
				>
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M1 1h15M1 7h15M1 13h15"
					/>
				</svg>
			</button>
		</div>
		<div
			class={`items-center justify-between transition-all duration-300 w-full md:flex md:w-auto md:order-1 ${
				!isNavVisible ? 'hidden' : ''
			}`}
			id="navbar-cta"
		>
			<ul
				class="flex flex-col font-medium p-4 md:p-0 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 gap-3"
			>
				<li class="border-b-[1px] border-white py-2 md:border-none md:py-0">
					<a href="#" class=" py-2 px-3 md:p-0 text-white" aria-current="page">Learn</a>
				</li>
				<li class="border-b-[1px] border-white py-2 md:border-none md:py-0">
					<a href="#" class=" py-2 px-3 md:p-0 text-white">Build</a>
				</li>
				<li class="border-b-[1px] border-white py-2 md:border-none md:py-0">
					<a href="#" class=" py-2 px-3 md:p-0 text-white">Connect</a>
				</li>
			</ul>
		</div>
	</div>
</nav>
