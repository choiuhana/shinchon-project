export type FormState = {
	status: "idle" | "success" | "error";
	message?: string;
	issues?: string[];
};

export const initialFormState: FormState = {
	status: "idle",
};
