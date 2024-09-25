import { PUBLIC_API_URL } from '$env/static/public';
import type { Identifiable, Schedulable } from '$lib/type/api';
import { doFetch } from '$lib/util/fetch';
import { writable, type StartStopNotifier, type Writable } from 'svelte/store';

export type RAW = Record<string, any>;
export type EntityBaseCommon = Identifiable & Schedulable;

export type Map<T> = Record<string | number | symbol, T>;
export const fetchStore = writable<Record<string, Promise<Response>>>({});
export type Builder<T extends Identifiable> = (raw: RAW) => T;

export type AsyncStore<T> = Map<T>;

export interface FetchStore<T extends Identifiable> extends Writable<AsyncStore<T>> {
	fetchOne(id: string): Promise<void>;
	fetchAll(opts?: { path?: string; query?: Query }): Promise<void>;
	insertAllRaw(items: RAW[]): void;
	insertRaw(item: RAW): void;
}

export type Query = string | string[][] | Record<string, string> | URLSearchParams | undefined;

function createStore<T extends Identifiable>(
	base: string,
	query?: Query,
	itemBuilder: Builder<T> = defaultBuilder,
	start?: StartStopNotifier<AsyncStore<T>> | undefined
): FetchStore<T> {
	const store = writable<AsyncStore<T>>({}, start);
	function makeQueryString(addQuery?: Query): string {
		let q = new URLSearchParams(query);
		if (addQuery) {
			const aq = new URLSearchParams(addQuery);
			aq.forEach((v, k) => {
				q.append(k, v);
			});
		}
		let qq = q.toString();
		if (qq.length) {
			qq = '?' + qq;
		}
		return qq;
	}
	return {
		...store,
		fetchOne: async function (id: string): Promise<void> {
			const res = await doFetch(`${PUBLIC_API_URL}${base}/${id}${makeQueryString()}`);
			if (res.ok) {
				this.insertRaw(await res.json());
			} else {
				console.error(await res.text());
			}
		},

		fetchAll: async function({ path, query }: { path?: string; query?: Query } = {}): Promise<void> {
			const p = path ? `${base}/${path}` : base;
			const res = await doFetch(`${PUBLIC_API_URL}${p}${makeQueryString(query)}`);
			if (res.ok) {
				this.insertAllRaw(await res.json());
			} else {
				console.error(await res.text());
			}
		},
		insertAllRaw: function (items: RAW[]) {
			store.update((s) => {
				for (const data of items) {
					const item = itemBuilder(data);
					s[item.id] = item;
				}
				return s;
			});
		},
		insertRaw: function (raw: RAW) {
			store.update((s) => {
				const item = itemBuilder(raw);
				s[item.id] = item;
				return s;
			});
		}
	};
}

const stores: Record<string, FetchStore<any>> = {};
export function useStore<T extends Identifiable>(
	base: string,
	query?: Query,
	itemBuilder: Builder<T> = defaultBuilder,
	start?: StartStopNotifier<AsyncStore<T>> | undefined
): FetchStore<T> {
	let s = stores[base];
	if (!s) {
		s = createStore<T>(base, query, itemBuilder, start);
		stores[base] = s;
	}
	return s;
}

function defaultBuilder<T extends Identifiable>(data: RAW): T {
	return {
		...data,
		id: data.id
	} as T;
}

export const parseDate = (s: string) => (s ? new Date(s) : undefined);
