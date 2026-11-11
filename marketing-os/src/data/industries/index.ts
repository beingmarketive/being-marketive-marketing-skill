import type { IndustryPack } from '../../types';
import { agency } from './agency';
import { creator } from './creator';
import { saas } from './saas';
import { localRetail } from './local-retail';
import { electronics } from './electronics';
import { itServices } from './it-services';
import { restaurant } from './restaurant';
import { clinic } from './clinic';
import { realEstate } from './real-estate';
import { education } from './education';
import { salon } from './salon';
import { gym } from './gym';
import { ecommerce } from './ecommerce';
import { jewellery } from './jewellery';
import { hotel } from './hotel';

export const INDUSTRIES: IndustryPack[] = [
  agency,
  creator,
  saas,
  localRetail,
  electronics,
  itServices,
  restaurant,
  clinic,
  realEstate,
  education,
  salon,
  gym,
  ecommerce,
  jewellery,
  hotel
];

export const INDUSTRY_BY_ID: Record<string, IndustryPack> = Object.fromEntries(INDUSTRIES.map((i) => [i.id, i]));

export function getIndustry(id: string | undefined): IndustryPack | undefined {
  return id ? INDUSTRY_BY_ID[id] : undefined;
}
