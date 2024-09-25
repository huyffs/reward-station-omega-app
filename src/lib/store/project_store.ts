import type { IdString, Schedulable } from '$lib/type/api';
import { derived } from 'svelte/store';
import { useStore, type RAW, parseDate } from './async_store';

export type Project = IdString &
	Schedulable & {
		org_id: string;
		name: string;
		description: string;
		website?: string;
		networks: Record<string, string>;
		logo?: string;
		images: string[];
		featureFrom?: Date;
		featureUntil?: Date;
	};

export function useProjectStore() {
	return useStore<Project>('/projects', {}, buildProject);
}

export function buildProject(data: RAW): Project {
	return {
		id: data.id,
		org_id: data.org_id,
		name: data.name,
		description: data.description,
		website: data.website,
		networks: data.networks,
		logo: data.logo,
		images: data.images,
		featureFrom: parseDate(data.feature_from),
		featureUntil: parseDate(data.feature_until),
		createdAt: new Date(data.created_at),
		updatedAt: parseDate(data.updated_at)
	};
}

const projectStore = useProjectStore();
export const allProjects = derived(projectStore, ($projectStore) => {
	return Object.values($projectStore).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
});
