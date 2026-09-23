// Re-exported so the rest of the `patients` feature imports from here
// rather than reaching into `lib/demo` directly — once a real `Patient`
// type is generated from the backend's OpenAPI contract
// (src/lib/api/generated/schema.d.ts), swap the source of this re-export
// without touching any importer.
export type { DemoPatient as Patient } from "@/lib/demo/patients";
