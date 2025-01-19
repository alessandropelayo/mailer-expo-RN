import { DateTime } from "i18n-js";
import { AccessLevel, AccessRequestStatus, Role } from "../auth";

export interface Package {
	trackingId: string;
	carrier: string;
	from?: string;
	statusHistory: {
		trackingId: string;
		statusTime: string;
		deliveryDate: string;
		status: string;
	}[];
	deliveryPhoto: {
		fileLocation: string;
	}[];
}

export interface AccessRequest {
	id: string;
	userId: string;
	requestedLevel: AccessLevel;
	status: AccessRequestStatus;
	createdAt: Date;
	updatedAt: Date;
	user: {
		email: string;
		accessLevel: AccessLevel;
		role: Role;
	};
}
