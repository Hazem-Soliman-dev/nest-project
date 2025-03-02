import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum role {
	USER = 'User',
	ADMIN = 'Admin',
	SUPER_ADMIN = 'Super Admin',
}

@Entity('auth')
export class Auth {

	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	username: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column({ type: 'enum', enum: role, default: role.USER })
	role: role;

	@Column({ default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date;

	@Column({ default: () => 'CURRENT_TIMESTAMP' })
	updatedAt: Date;
}
