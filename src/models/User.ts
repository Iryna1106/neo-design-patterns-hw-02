export class User {
  constructor(
    public readonly email: string,
    public readonly phone: string,
    public readonly deviceToken: string
  ) {}
}
