<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from 'svoast';

	let network: boolean = false;

	onMount(async () => {
		const currentNetwork = await window.ethereum.request({
			method: 'eth_chainId'
		});
		if (currentNetwork == '0x3affd') {
			network = true;
			return;
		}
	});

	const addTrueZK = async () => {
		if (typeof window.ethereum == 'undefined') {
			toast.error('Metamask is not installed');
			return;
		} else {
			const currentNetwork = await window.ethereum.request({
				method: 'eth_chainId'
			});
			if (currentNetwork == '0x3affd') {
				toast.attention('You are already connected to TrueZK Testnet');
				return;
			} else {
				try {
					await window.ethereum.request({
						method: 'wallet_addEthereumChain',
						params: [
							{
								chainId: '0x3affd',
								chainName: 'TrueZK Testnet',
								rpcUrls: ['https://testnet.truezk.com'],
								iconUrls: 'https://i.postimg.cc/TPQs7dcn/True-ZK-3.png',
								nativeCurrency: {
									name: 'Truenet',
									symbol: 'TZK',
									decimals: 18
								}
							}
						]
					});
					const currentNetwork = await window.ethereum.request({
						method: 'eth_chainId'
					});
					if (currentNetwork == '0x3affd') {
						location.reload();
					} else {
						toast.error('User rejected request.', {
							duration: 3000
						});
					}
				} catch (error) {
					toast.error('Error adding TrueZK chain');
				}
			}
		}
	};
</script>

<main>
	<button
		style="background: radial-gradient(84.92% 150% at 50% 138.75%, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0) 100%),rgba(255, 255, 255, 0.01)"
		class={`${
			network && 'opacity-50'
		} text-white w-full px-6 py-3 rounded-xl border border-solid border-white/10`}
		on:click={() => {
			addTrueZK();
		}}
	>
		{#if network}
			Connected to TrueZK Testnet
		{:else}
			Connect TrueZK Testnet
		{/if}
	</button>
</main>
