export const SITE = {
  name: 'Garage de la Belle Croix',
  url: 'https://www.garagebellecroix.fr',
  phone: '06 09 36 94 90',
  phoneHref: 'tel:+33609369490',
  // Second numéro, affiché en complément du principal
  phone2: '07 67 75 93 13',
  phone2Href: 'tel:+33767759313',
  email: 'garagebellecroix@outlook.fr',
  street: '1 Rue Inore Fabbri',
  postalCode: '57365',
  city: 'Ennery',
  // Position exacte du bâtiment (le repère de la fiche Google est placé au carrefour, ~150 m plus loin)
  lat: 49.226554,
  lng: 6.207403,
  mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=49.226554,6.207403',
  wazeUrl: 'https://waze.com/ul?ll=49.226554,6.207403&navigate=yes',
};

export interface Service {
  id: string;
  label: string;
  vehicleType?: 'voiture' | 'moto';
  isTire?: boolean;
}

// Prestations proposées dans les formulaires de devis et de rendez-vous
export const SERVICES: Service[] = [
  { id: 'pneus', label: 'Pneus neufs (fourniture + montage)', isTire: true },
  { id: 'montage-pneus-client', label: 'Montage de pneus fournis par le client', isTire: true },
  { id: 'entretien-moto', label: 'Entretien moto (toutes marques)', vehicleType: 'moto' },
  { id: 'mecanique-moto', label: 'Mécanique / réparation moto', vehicleType: 'moto' },
  { id: 'entretien-auto', label: 'Entretien auto / vidange', vehicleType: 'voiture' },
  { id: 'reparation-auto', label: 'Réparation / mécanique auto', vehicleType: 'voiture' },
  { id: 'autre', label: 'Autre demande' },
];

export const getService = (id?: string | null) => SERVICES.find((s) => s.id === id);

// Informations légales (source : registre SIRENE / RNE)
export const LEGAL = {
  companyName: 'GARAGE DE LA BELLE CROIX',
  legalForm: 'Société par actions simplifiée (SAS)',
  siren: '995 149 739',
  siret: '995 149 739 00014',
  rcs: 'RCS Metz 995 149 739',
  naf: '45.20A — Entretien et réparation de véhicules automobiles légers',
  director: 'Lucas Hill, Président',
  // À compléter : mentions obligatoires non disponibles dans les registres publics
  shareCapital: '', // ex. '1 000 €'
  host: {
    name: '', // ex. 'OVH SAS'
    address: '', // ex. '2 rue Kellermann, 59100 Roubaix, France'
    website: '',
  },
  lastUpdate: '9 octobre 2026',
};
