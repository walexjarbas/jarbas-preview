
import { User, Calendar, Phone, MapPin } from 'lucide-react';
import { FieldOption } from '@/types/personalization';

export const fieldOptions: FieldOption[] = [
  { label: 'Gênero', icon: <User className="h-4 w-4" /> },
  { label: 'Idade', icon: <Calendar className="h-4 w-4" /> },
  { label: 'Telefone', icon: <Phone className="h-4 w-4" /> },
  { label: 'Cidade', icon: <MapPin className="h-4 w-4" /> },
  { label: 'Estado', icon: <MapPin className="h-4 w-4" /> },
];

export type { FieldOption };
