import type { Readable, Unsubscriber } from 'svelte/store';
export type Stores = [Readable<any>, ...Array<Readable<any>>] | Array<Readable<any>>;

export type StoresValues<T> = T extends Readable<infer U>
	? U
	: { [K in keyof T]: T[K] extends Readable<infer U> ? U : never };

export function subscribeStores<S extends Stores>(
	stores: S,
	fn: (storesValues: StoresValues<S>) => void
): VoidFunction {
	// Store values of all the stores
	const values: any = [];
	const unsubscribers: Unsubscriber[] = [];
	// Subscribe to all the stores
	for (let i = 0; i < stores.length; i++) {
		unsubscribers.push(
			stores[i].subscribe((value) => {
				values[i] = value;
				// Call the callback when all the stores have values
				if (values.length == stores.length) fn(values);
			})
		);
	}

	return () => {
		unsubscribers.forEach((unsubscribe) => unsubscribe());
	};
}
