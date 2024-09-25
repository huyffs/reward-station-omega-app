import type { IdString } from '$lib/type/api';
import { derived } from 'svelte/store';
import { useStore, type RAW } from './async_store';
import { useProjectStore, type Project } from './project_store';

export type ProjectMembership = IdString & {
	subscribed: boolean;
	point: number;
	balance: number;
};

export function buildClub(data: RAW): ProjectMembership {
	return {
		id: data.project_id,
		subscribed: data.subscribed,
		point: data.point,
		balance: data.balance
	};
}

export const projectMembershipStore = useStore<ProjectMembership>(`/clubs`, undefined, buildClub);
const projectStore = useProjectStore();

export const projectMemberships = derived(
	[projectMembershipStore, projectStore],
	([$projectMembershipStore, $projectStore]) => {
		const clubs: Project[] = [];
		for (const projectId in $projectMembershipStore) {
			const project = $projectStore[projectId];
			if (project) {
				clubs.push(project);
			}
		}
		return clubs;
	}
);
