export interface DatabaseError {
  severity: string | undefined;
  code: string | undefined;
  detail: string | undefined;
  hint: string | undefined;
  position: string | undefined;
  internalPosition: string | undefined;
  internalQuery: string | undefined;
  where: string | undefined;
  schema: string | undefined;
  table: string | undefined;
  column: string | undefined;
  dataType: string | undefined;
  constraint: string | undefined;
  file: string | undefined;
  line: string | undefined;
  routine: string | undefined;
}
