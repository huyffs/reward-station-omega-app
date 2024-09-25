export type IdString = {
	id: string;
};

export type IdSerial = {
	id: number;
};

export type Identifiable = IdSerial | IdString;

export type RawSchedulable = {
	created_at: string;
	updated_at?: string;
};

export type Schedulable = {
	createdAt: Date;
	updatedAt?: Date;
};

export type RawBaseEntity = Identifiable  & RawSchedulable;
// export type BaseEntity = Identifiable & Schedulable;

export type UpdateResult = {
	updated_at: string;
};

export type CreateResult = {
	id: string;
	created_at: string;
};
