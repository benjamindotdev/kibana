/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { createAction } from 'redux-actions';
import { i18n } from '@kbn/i18n';
import { openIndices as request } from '../../services';
import { clearRowStatus, reloadIndices } from '.';
import { notificationService } from '../../services/notification';

export const openIndicesStart = createAction('INDEX_MANAGEMENT_OPEN_INDICES_START');

export const openIndices =
  ({ indexNames }) =>
  async (dispatch) => {
    dispatch(openIndicesStart({ indexNames }));
    try {
      await request(indexNames);
    } catch (error) {
      notificationService.showDangerToast(error.body.message);
      return dispatch(clearRowStatus({ indexNames }));
    }
    dispatch(reloadIndices(indexNames));
    notificationService.showSuccessToast(
      i18n.translate('xpack.idxMgmt.openIndicesAction.successfullyOpenedIndicesMessage', {
        defaultMessage: 'Successfully opened {count, plural, one {# index} other {# indices} }',
        values: { count: indexNames.length },
      })
    );
  };
