export const BIODIVERSITY_METRICS = {
  SPECIES_PROTECTED: 'SPECIES_PROTECTED',
  ACRES_RESTORED: 'ACRES_RESTORED',
  WATER_QUALITY_INDEX: 'WATER_QUALITY_INDEX',
  CO2_OFFSET_KG: 'CO2_OFFSET_KG',
  PLASTIC_DIVERTED_KG: 'PLASTIC_DIVERTED_KG',
} as const;

export interface BiodiversityMetricInfo {
  label: string;
  unit: string;
  icon: string;
  color: string;
  description: string;
}

export const BIODIVERSITY_METRIC_DETAILS: Record<keyof typeof BIODIVERSITY_METRICS, BiodiversityMetricInfo> = {
  SPECIES_PROTECTED: {
    label: 'Endangered Species Protected',
    unit: 'species',
    icon: 'ShieldAlert',
    color: 'text-amber-400',
    description: 'Number of active local vulnerable species protected through habitat cleaning.',
  },
  ACRES_RESTORED: {
    label: 'Biodiverse Land Restored',
    unit: 'acres',
    icon: 'Trees',
    color: 'text-emerald-400',
    description: 'Total acreage of woodlands, wetlands, and natural sanctuaries cleared of pollution.',
  },
  WATER_QUALITY_INDEX: {
    label: 'Water Purity Improvement',
    unit: '% WQI',
    icon: 'Droplets',
    color: 'text-cyan-400',
    description: 'Average local freshwater ecosystem quality score increase post-cleanup.',
  },
  CO2_OFFSET_KG: {
    label: 'Carbon Offset Equivalency',
    unit: 'kg CO2e',
    icon: 'Leaf',
    color: 'text-mint-400',
    description: 'Equivalent carbon savings calculated from soil restoration and organic waste management.',
  },
  PLASTIC_DIVERTED_KG: {
    label: 'Waste Diverted',
    unit: 'kg',
    icon: 'Trash2',
    color: 'text-teal-400',
    description: 'Total weight of plastic, rubber, and synthetic materials removed from waterways and soil.',
  },
};

export const MOCK_SPECIES_LIST = [
  { id: 'sp-1', name: 'Monarch Butterfly', scientificName: 'Danaus plexippus', status: 'Endangered', trend: 'Increasing', count: 124, region: 'North Wetland Buffer' },
  { id: 'sp-2', name: 'Bald Eagle', scientificName: 'Haliaeetus leucocephalus', status: 'Protected', trend: 'Stable', count: 12, region: 'East Lake Sanctuary' },
  { id: 'sp-3', name: 'Eastern Box Turtle', scientificName: 'Terrapene carolina', status: 'Vulnerable', trend: 'Increasing', count: 85, region: 'Forest Nature Preserve' },
  { id: 'sp-4', name: 'Rusty Patched Bumble Bee', scientificName: 'Bombus affinis', status: 'Critically Endangered', trend: 'Recovering', count: 48, region: 'Wildflower Corridor' },
  { id: 'sp-5', name: 'Jefferson Salamander', scientificName: 'Ambystoma jeffersonianum', status: 'Threatened', trend: 'Stable', count: 32, region: 'Vernal Pools' },
];
