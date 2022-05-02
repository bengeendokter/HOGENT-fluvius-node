const {
	hashPassword,
	verifyPassword
} = require('./core/password');

async function main() {
	const password = "123456789";
	const wrongPassword = "verywrong";
	console.log('The password:', password);

	//const hash = await hashPassword(password);
	// bekijk hoe de hash opgebouwd is, wat herken je?
	// waar staat de timeCost, memoryCost, salt en de hash zelf?
	//console.log('The hash:', hash);

	let valid = await verifyPassword(password, '$argon2id$v=19$m=65536,t=3,p=1$lFetV+A/KmlclxItlBDQeg$cmJDYf8EKjPudjWZGXEvr7w55f7vxcsS++MF1W8NZYw');
	console.log('The password', password, 'is', valid ? 'valid' : 'incorrect');

	//valid = await verifyPassword(wrongPassword, hash);
	//console.log('The password', wrongPassword, 'is', valid ? 'valid' : 'incorrect');
}

main();