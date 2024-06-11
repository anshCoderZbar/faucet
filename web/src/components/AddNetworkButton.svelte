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
		class={`${
			network && 'opacity-50'
		} px-8 sm:px-10 py-3 text-sm font-bold text-white lg:text-base 2xl:text-lg`}
		on:click={() => {
			addTrueZK();
		}}
	>
		{#if network}
			Connected to Cipherem Testnet
		{:else}
			Connect Cipherem Testnet
		{/if}
	</button>
</main>
