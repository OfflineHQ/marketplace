import * as i18nUi from '@next/i18n-ui';

import { createMock } from 'storybook-addon-module-mock';

export function i18nUiTablesServerMocks() {
  const mockTableHeaderControlText = createMock(
    i18nUi,
    'getTableHeaderControlText',
  );
  mockTableHeaderControlText.mockReturnValue(
    Promise.resolve({
      asc: 'asc',
      desc: 'desc',
      hide: 'hide',
    }),
  );

  const mockTableNoResultText = createMock(i18nUi, 'getTableNoResultText');
  mockTableNoResultText.mockReturnValue(Promise.resolve('No results'));

  const mockTablePaginationControlText = createMock(
    i18nUi,
    'getTablePaginationControlText',
  );
  mockTablePaginationControlText.mockReturnValue(
    Promise.resolve({
      rowOf: 'of',
      rowSelected: 'row selected',
      rowsPerPage: 'rows per page',
      page: 'page',
      pageOf: 'of',
      firstPage: 'first page',
      previousPage: 'previous page',
      nextPage: 'next page',
      lastPage: 'last page',
    }),
  );

  const mockTableToolbarFiltersControlText = createMock(
    i18nUi,
    'getTableToolbarFiltersControlText',
  );
  mockTableToolbarFiltersControlText.mockReturnValue(
    Promise.resolve({
      reset: 'reset',
      valueSelected: 'value selected',
      noResultFound: 'no result found',
      clearFilters: 'clear filters',
    }),
  );

  const mockTableToggleColumnsControlText = createMock(
    i18nUi,
    'getTableToggleColumnsControlText',
  );
  mockTableToggleColumnsControlText.mockReturnValue(
    Promise.resolve({
      view: 'view',
      toggleColumns: 'toggle columns',
    }),
  );

  return [
    mockTableHeaderControlText,
    mockTableNoResultText,
    mockTablePaginationControlText,
    mockTableToolbarFiltersControlText,
    mockTableToggleColumnsControlText,
  ];
}
