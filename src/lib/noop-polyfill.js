// Empty shim — replaces Next.js's `next-polyfill-module` via Turbopack
// `resolveAlias`. The default bundle ships polyfills for Array.prototype.at,
// Object.hasOwn, String.prototype.trim{Start,End}, etc. — all of which our
// browserslist target (Chrome 100+, Safari 15.4+) already supports natively.
