import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

const SALT_BYTE_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 120_000;
const DIGEST = "sha512";

export function hashPassword(password: string) {
	const salt = randomBytes(SALT_BYTE_LENGTH).toString("hex");
	const derivedKey = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");

	return `${ITERATIONS}:${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, stored: string) {
	const [iterationString, salt, key] = stored.split(":");

	if (!iterationString || !salt || !key) {
		return false;
	}

	const iterations = Number.parseInt(iterationString, 10);
	if (Number.isNaN(iterations)) {
		return false;
	}

	const derivedKey = pbkdf2Sync(password, salt, iterations, key.length / 2, DIGEST).toString("hex");

	return timingSafeEqual(Buffer.from(key, "hex"), Buffer.from(derivedKey, "hex"));
}
