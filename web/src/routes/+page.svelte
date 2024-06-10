<script lang="ts">
	import { PUBLIC_PRIVATE_KEY } from '$env/static/public';
	import { ethers } from 'ethers';
	import { onMount } from 'svelte';
	import { toast } from 'svoast';
	import axios from 'axios';
	import Header from '../components/Header.svelte';
	import arrow from '$lib/images/arrow.svg';
	import X from '$lib/images/x.svg';

	type Faucet = {
		address: string;
	};

	let address: string = '';
	let amount: number = 5;
	let privateKey: string = PUBLIC_PRIVATE_KEY || '';
	let intent: string =
		'https://twitter.com/intent/tweet?text=Dive%20into%20the%20future%20with%20%40True_ZK!%20Claim%20your%20TZK%20tokens%20now%20and%20join%20the%20%40True_ZK%20network%20at%20the%20forefront%20of%20innovation.%F0%9F%9A%80%20Head%20over%20to%20faucet.truezk.com%20and%20grab%20your%20share%20of%20the%20future%F0%9F%92%8E';
	let wallet: ethers.Wallet;
	let loading: boolean = false;
	let allowClaim: boolean = true;

	onMount(async () => {
		// initialize provider
		const provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(
			window.ethereum as any
		);
		wallet = new ethers.Wallet(privateKey, provider);
		const currentNetwork = await window.ethereum.request({
			method: 'eth_chainId'
		});
		if (currentNetwork == '0x3affd') {
			allowClaim = false;
			return;
		}
	});

	const checkEligibility = async (address: string) => {
		const response = await axios.get('/api');
		const faucet = response.data;
		for (let i = 0; i < faucet.length; i++) {
			if (faucet[i].address === address) {
				const expiresAfter = new Date(faucet[i].expiresAfter).getTime();
				const currentTime = new Date().getTime();
				const remainingTime = Math.max(0, Math.ceil((expiresAfter - currentTime) / (1000 * 60)));
				const hours = Math.floor(remainingTime / 60);
				const minutes = remainingTime % 60;
				return { isEligible: true, hours, minutes };
			}
		}
	};

	const validateAddress = (address: String): Boolean => {
		return address.length === 42 && address.startsWith('0x');
	};

	const sendFaucetTZK = async (address: string, amount: number) => {
		const isValid = await checkEligibility(address);
		if (isValid?.isEligible) {
			if (isValid?.hours == 0 && isValid?.minutes > 0) {
				toast.error(
					`This address has reached the limit. Please try after ${isValid?.minutes} mins.`
				);
			} else if (isValid?.hours == 0 && isValid?.minutes < 0) {
				toast.error(`This address has reached the limit. Please try within a minute.`);
			} else {
				toast.error(
					`This address has reached the limit. Please try after ${isValid?.hours} ${
						isValid?.hours == 1 ? 'hour' : 'hours'
					} ${isValid?.minutes} ${isValid?.minutes <= 1 ? 'minute' : 'minutes'}.`
				);
			}
			loading = false;
			return;
		}
		try {
			let tx = await wallet.sendTransaction({
				to: address,
				value: ethers.utils.parseEther(amount.toString())
			});
			toast.promise(tx.wait(), {
				loading: 'Sending TZK tokens...',
				success: `Sent ${amount} TZK tokens successfully!`,
				error: 'Something went wrong!'
			});
			await tx.wait();
			await axios.post('/api', { wallet: address });
			loading = false;
			amount = 5;
		} catch (err) {
			loading = false;
			toast.error('Something went wrong!');
		}
	};
</script>

<svelte:head>
	<title>Faucet | TrueZK</title>
	<meta name="description" content="Faucet for TrueZK" />
</svelte:head>

<main>
	<div class="container mx-auto px-5">
		<Header />
		<div class="flex flex-col h-[80vh] md:h-[90vh] lg:h-screen w-full justify-center">
			<div class="max-w-[652px] text-center mx-auto">
				<h1
					class="text-white text-xl mt-6 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl sm:mt-8 md:mt-10 lg:mt-12 xl:mt-14 font-semibold"
				>
					Get Cipherem Faucets
				</h1>
				<p class="text-white text-base sm:text-lg md:text-xl xl:text-2xl font-normal mt-2 sm:mt-3">
					This faucet transfer gas token on Cipherem Testnet network, confirm details before
					submitting
				</p>
			</div>
			<div
				class="max-w-[800px] w-full mx-auto gradient_border_image mt-5 sm:mt-7 lg:mt-9 xl:mt-11 mb-8 lg:mb-10 xl:mb-13 rounded-2xl"
			>
				<div class="rounded-2xl bg-[#0e0c15]">
					<h3 class="text-white text-lg sm:text-xl lg:text-2xl font-semibold text-center">
						Add Cipherem Testnet
					</h3>
					<p
						class="text-white text-sm sm:text-base sm:mt-3 md:text-lg md:mt-4 xl:text-xl mt-2 text-center"
					>
						Please switch to Cipherem testnet network before claiming testnet tokens
					</p>
					<div
						class="gradient-button h-full max-w-max rounded-full mx-auto my-4 sm:my-6 sm:mb-8 mb-6 shadow-[#0E0C15]"
					>
						<button
							class="px-8 sm:px-10 py-3 text-sm font-bold text-white lg:text-base 2xl:text-lg"
						>
							Connect Cipherem Testnet
						</button>
					</div>
					<div class="w-full gradient-border rounded-full">
						<input
							type="text"
							class="w-full py-3 md:py-4 sm:px-6 md:px-8 px-4 bg-[#0e0c15] rounded-full placeholder:text-sm outline-none"
							placeholder="Enter your wallet address"
						/>
					</div>
					<div
						class="flex justify-center mt-5 mb-8 sm:mt-7 md:mt-10 sm:mb-10 md:mb-13 lg:mb-16 mx-auto"
					>
						<button
							class="border-2 border-[#0FF0D9] px-2 sm:px-6 md:px-10 lg:px-12 xl:px-16 text-sm lg:text-base 2xl:text-lg py-4 font-semibold rounded-full flex items-center justify-between gap-2 shadow-xl shadow-[#0E0C15] transition-all duration-200 hover:bg-[#0FF0D9]"
							>Get My Cipherem Test Tokens <span><img src={arrow} alt="arrow" /></span></button
						>
					</div>
					<div class="flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7">
						<p class="text-white text-sm sm:text-base lg:text-lg xl:text-xl text-center">
							Share a tweet to get bonus!
						</p>
						<div class="gradient-button h-full max-w-max rounded-full mx-auto shadow-[#0E0C15]">
							<button
								class="flex justify-between items-center gap-5 px-8 sm:px-10 lg:px-12 py-3 text-sm font-bold text-white lg:text-base 2xl:text-lg"
							>
								<span><img src={X} alt="x" /></span>Share in Twitter
							</button>
						</div>
						<p class="text-white text-sm sm:text-base lg:text-lg xl:text-xl text-center">
							Have any issue? <span class="font-medium text-base md:text-lg xl:text-xl"
								>Contact us</span
							>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>

<style lang="postcss">
	:global(html) {
		background-image: url('/src/lib/images/faucet-background.png');
		background-repeat: no-repeat;
		background-position: center;
		width: 100%;
		min-height: 100vh;
		height: fit-content;
		background-size: cover;
		color: #fff;
		font-family: 'Urbanist', sans-serif;
	}
</style>
