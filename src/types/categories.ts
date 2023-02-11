import { GroupCategoryTypeEnum } from './serverTypes';

export interface IIndustry {
  id?: any | null;
  title?: string | null;
  iconUrl?: string | null;
  groupCategoryType?: GroupCategoryTypeEnum | null;
}
