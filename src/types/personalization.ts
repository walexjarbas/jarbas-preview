
export interface PersonalizationField {
  id: string;
  selectedField: string;
  value: string;
  isMandatory?: boolean;
}

export interface FieldOption {
  label: string;
  icon: React.ReactNode;
  isCustom?: boolean;
}
