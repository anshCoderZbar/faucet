import { faucet } from '$db/collection';

export async function POST({ request }) {
	try {
		const { wallet } = await request.json();
		const expirationTime = new Date();
		expirationTime.setHours(expirationTime.getHours() + 6);
		await faucet.createIndex({ expiresAfter: 1 }, { expireAfterSeconds: 0 });
		await faucet.insertOne({
			address: wallet,
			expiresAfter: expirationTime
		});
		return new Response('Success', { status: 200 });
	} catch (error) {
		console.error('Error inserting data:', error);
		return new Response('Error', { status: 500 });
	}
}

export async function GET(request) {
	const data = await faucet.find({}).toArray();
	const sanitizedData = data.map(({ _id, ...rest }) => rest);
	return new Response(JSON.stringify(sanitizedData), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
}
