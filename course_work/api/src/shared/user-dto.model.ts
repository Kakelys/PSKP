import { Jwt } from "./jwt.model";

export class User {
    id: number;
    is_admin: boolean;
    jwt: Jwt
}