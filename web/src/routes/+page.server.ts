import { faucet } from '$db/collection';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async function () {
	const data = await faucet.find({}).toArray();
	const sanitizedData = data.map(({ _id, ...rest }) => rest);
	return {
		faucet: sanitizedData
	};
};
