<script lang="ts">
	import faucetLogo from '$lib/images/faucet_logo.svg';
	import VectorLeftSVG from '$lib/images/vector-left.png';
	import { PUBLIC_PRIVATE_KEY } from '$env/static/public';
	import { ethers } from 'ethers';
	import { onMount } from 'svelte';
	import AddNetworkButton from '../components/AddNetworkButton.svelte';
	import { toast } from 'svoast';
	import axios from 'axios';

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
	<nav class="flex items-center justify-between py-9 px-5 md:px-[5vw]">
		<img
			src={faucetLogo}
			alt="TrueZk Faucet"
			class="w-[12rem] md:w-[14rem] lg:w-[16rem] xl:w-[18rem]"
			draggable="false"
		/>
		<div class="font-semibold text-md md:text-lg lg:text-xl xl:text-2xl">Build on TrueZK</div>
	</nav>
	<div class="flex justify-center items-center p-5 h-[90vh] md:h-[85vh]">
		<div
			class="bg-black/10 w-[40rem] relative rounded-3xl border border-[#818181] shadow-xl px-[2rem] md:px-[3rem] xl:px-[3.75rem] pb-4"
		>
			<img
				src={VectorLeftSVG}
				alt=""
				draggable="false"
				class="absolute top-[-1rem] sm:top-[-2rem] md:top-[-3rem] lg-top-[-4rem] xl:top-[-5rem] left-0 w-[18vw] -z-10"
			/>
			<div class="grid gap-5">
				<h1 class="text-4xl mt-[4rem] md:mt-[6rem] lg:mt-[7.88rem] font-semibold">
					Get Test Tokens
				</h1>
				<div class="max-w-[450px] text-sm">
					This faucet transfers Gas Tokens on TrueZK Testnet network. Confirm details before
					submitting.
				</div>
			</div>
			<div class="mt-10">
				<h1 class="text-xl mb-2 font-semibold">Add TrueZK Testnet</h1>
				<div class="mb-4 text-sm">
					Please switch to TrueZK testnet network before claiming testnet tokens.
				</div>
				<AddNetworkButton />
			</div>
			<div class="mt-5">
				<form class="grid gap-3">
					<label for="wallet_addr" class="text-2xl"> Wallet Address </label>
					<div class="grid gap-2">
						<input
							class="bg-[#222] outline outline-1 focus:outline-none focus:ring focus:ring-[#18A974] py-2 px-8 rounded-lg"
							type="text"
							name="wallet address"
							id="wallet_addr"
							placeholder="0xxxxxxxxxxxxxxxxxxxxxxxxxxx"
							bind:value={address}
						/>
						{#if validateAddress(address) !== true && address !== ''}
							<span class="text-[#FF5858]">Invalid Address</span>
						{:else}
							<span class="h-[24px]" />
						{/if}
					</div>
				</form>
			</div>
			<div class="mt-5">
				<h2 class="font-medium text-2xl">Share a tweet to get bonus!</h2>
				<div class="flex gap-6 mt-4">
					<button
						type="button"
						class="border py-2 px-4 rounded-xl flex gap-2 items-center hover:bg-white/10 transition-colors"
						on:click={() => {
							open(intent, '_blank');
							amount = 8;
						}}
						><svg
							xmlns="http://www.w3.org/2000/svg"
							width="25"
							height="24"
							viewBox="0 0 25 24"
							fill="none"
						>
							<path
								d="M18.8263 1.9043H22.1998L14.8297 10.3278L23.5 21.7903H16.7112L11.394 14.8383L5.30995 21.7903H1.93443L9.81743 12.7804L1.5 1.9043H8.46111L13.2674 8.25863L18.8263 1.9043ZM17.6423 19.7711H19.5116L7.44539 3.81743H5.43946L17.6423 19.7711Z"
								fill="white"
							/>
						</svg> Share In Twitter</button
					>
				</div>
			</div>
			<button
				style="background: linear-gradient(90deg, #5AD153 0%, #26B682 45.7%, #0BA99A 103.24%)"
				class="flex items-center justify-between mt-10 py-4 px-8 rounded-xl w-full text-left font-semibold disabled:cursor-not-allowed disabled:opacity-50"
				type="button"
				on:click={() => {
					loading = true;
					sendFaucetTZK(address, amount);
				}}
				disabled={allowClaim}
			>
				{#if loading}
					<span class="flex gap-1 items-center self-center">
						<svg
							aria-hidden="true"
							role="status"
							class="inline mr-2 w-4 h-4 text-gray-100 animate-spin"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="#2dd4bf"
							/>
						</svg>{' '}
						Sending TZK tokens...
					</span>
				{:else}
					Get My TrueZK Test Tokens
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="22"
						viewBox="0 0 28 22"
						fill="none"
					>
						<path
							d="M1.86328 11.2021L26.8849 11.0576"
							stroke="white"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M16.7605 0.999436C19.1093 5.71698 21.5396 7.81109 26.8835 11.0568C22.1224 13.6729 19.7381 15.5265 16.9883 20.8848"
							stroke="white"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{/if}
			</button>
			<div class="text-[#8C8C8C] flex justify-center gap-1 mt-14 text-sm">
				Have any issues? <a class="text-white font-medium" href="mailto:no-reply@truezk.com">
					Contact Us</a
				>
			</div>
		</div>
	</div>
</main>

<style lang="postcss">
	:global(html) {
		background-color: #121212;
		color: #fff;
	}
</style>
