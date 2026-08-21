export interface FilterDefinition<T> {
  key: string;
  defaultValue: T;
  parse(raw: string | null): T;
  serialize(value: T): string | null;
}
