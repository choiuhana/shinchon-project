export type ParentFormState = {
	status: "idle" | "success" | "error";
	message?: string;
	issues?: string[];
};

export const initialParentFormState: ParentFormState = {
	status: "idle",
};
