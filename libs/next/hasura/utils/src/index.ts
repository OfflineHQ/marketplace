export enum Roles {
  user = 'user',
  anonymous = 'anonymous',
  organizer = 'organizer',
}

export type UserRole = Roles.user;
export type AnonymousRole = Roles.anonymous;
export type OrganizerRole = Roles.organizer;

export type Role = UserRole | OrganizerRole | AnonymousRole;
