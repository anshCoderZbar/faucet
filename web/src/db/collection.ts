import db from '$db/mongo';

export const faucet = db.collection('claimed');
