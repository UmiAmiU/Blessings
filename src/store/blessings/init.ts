import { getBlessingsFx } from '.';
import { IBlessing } from '../../types';

getBlessingsFx.use(async (api) => {
  if (api) {
    const { data, error } = await api
      .from('blessings')
      .select()
      .returns<IBlessing[]>();
    if (error) {
      throw error;
    }
    return data;
  }
  return [];
});
