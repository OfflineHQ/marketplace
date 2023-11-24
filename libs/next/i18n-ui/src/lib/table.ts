import { Locale } from '@next/i18n';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function getTableHeaderControlText(locale: Locale) {
  const t = await getTranslations({ locale, namespace: 'UI.Table' });
  return {
    asc: t('column-header-asc'),
    desc: t('column-header-desc'),
    hide: t('column-header-hide'),
  };
}

export async function getTableNoResultText(locale: Locale) {
  const t = await getTranslations({ locale, namespace: 'UI.Table' });
  return t('no-results');
}

export async function getTablePaginationControlText(locale: Locale) {
  const t = await getTranslations({ locale, namespace: 'UI.Table' });
  return {
    rowOf: t('pagination-row-of'),
    rowSelected: t('pagination-row-selected'),
    rowsPerPage: t('pagination-rows-per-page'),
    page: t('pagination-page'),
    pageOf: t('pagination-page-of'),
    firstPage: t('pagination-first-page'),
    previousPage: t('pagination-previous-page'),
    nextPage: t('pagination-next-page'),
    lastPage: t('pagination-last-page'),
  };
}

export async function getTableToolbarFiltersControlText(locale: Locale) {
  const t = await getTranslations({ locale, namespace: 'UI.Table' });
  return {
    reset: t('filters-reset'),
    valueSelected: t('filters-value-selected'),
    noResultFound: t('filters-no-result-found'),
    clearFilters: t('filters-clear-filters'),
  };
}

export async function getTableToggleColumnsControlText(locale: Locale) {
  const t = await getTranslations({ locale, namespace: 'UI.Table' });
  return {
    view: t('toggle-columns-view'),
    toggleColumns: t('toggle-columns-toggle-columns'),
  };
}

export function useTableHeaderControlText() {
  const t = useTranslations('UI.Table');
  return {
    asc: t('column-header-asc'),
    desc: t('column-header-desc'),
    hide: t('column-header-hide'),
  };
}

export function useTableNoResultText() {
  const t = useTranslations('UI.Table');
  return t('no-results');
}

export function useTablePaginationControlText() {
  const t = useTranslations('UI.Table');
  return {
    rowOf: t('pagination-row-of'),
    rowSelected: t('pagination-row-selected'),
    rowsPerPage: t('pagination-rows-per-page'),
    page: t('pagination-page'),
    pageOf: t('pagination-page-of'),
    firstPage: t('pagination-first-page'),
    previousPage: t('pagination-previous-page'),
    nextPage: t('pagination-next-page'),
    lastPage: t('pagination-last-page'),
  };
}

export function useTableToolbarFiltersControlText() {
  const t = useTranslations('UI.Table');
  return {
    reset: t('filters-reset'),
    valueSelected: t('filters-value-selected'),
    noResultFound: t('filters-no-result-found'),
    clearFilters: t('filters-clear-filters'),
  };
}

export function useTableToggleColumnsControlText() {
  const t = useTranslations('UI.Table');
  return {
    view: t('toggle-columns-view'),
    toggleColumns: t('toggle-columns-toggle-columns'),
  };
}
