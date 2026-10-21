import React from 'react';
import { useI18n } from '../locales/i18nContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  className = '',
}) => {
  const { t } = useI18n();

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalItems <= pageSize && totalPages <= 1) return null;

  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const startNumber = totalItems === 0 ? 0 : startIndex + 1;
  const endNumber = endIndex;

  // Build page numbers to display
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | 'ellipsis')[] = [1];
    const leftBound = Math.max(2, safePage - 1);
    const rightBound = Math.min(totalPages - 1, safePage + 1);

    if (leftBound > 2) pages.push('ellipsis');
    for (let p = leftBound; p <= rightBound; p++) {
      pages.push(p);
    }
    if (rightBound < totalPages - 1) pages.push('ellipsis');
    pages.push(totalPages);
    return pages;
  };

  const showingText = t.pagination.showing
    .replace('{start}', String(startNumber))
    .replace('{end}', String(endNumber))
    .replace('{total}', String(totalItems));

  return (
    <nav
      aria-label="Pagination"
      className={`print:hidden flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200 text-sm text-slate-700 ${className}`}
    >
      <p className="text-xs sm:text-sm text-slate-600 font-medium">
        {showingText}
      </p>

      <div className="flex items-center space-x-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1}
          aria-label={t.pagination.previous}
          className="min-h-10 min-w-10 px-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-slate-800 transition"
        >
          <ChevronLeft className="w-4 h-4 mr-0.5" />
          <span className="hidden sm:inline text-xs">{t.pagination.previous}</span>
        </button>

        {/* Page Buttons */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, idx) => {
            if (page === 'ellipsis') {
              return (
                <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 text-xs">
                  …
                </span>
              );
            }

            const isCurrent = page === safePage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={t.pagination.goToPage.replace('{page}', String(page))}
                className={`min-h-10 min-w-10 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                  isCurrent
                    ? 'bg-brand-800 text-white shadow-sm'
                    : 'bg-white border border-stone-300 text-slate-700 hover:bg-stone-50'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= totalPages}
          aria-label={t.pagination.next}
          className="min-h-10 min-w-10 px-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-semibold text-slate-800 transition"
        >
          <span className="hidden sm:inline text-xs">{t.pagination.next}</span>
          <ChevronRight className="w-4 h-4 ml-0.5" />
        </button>
      </div>
    </nav>
  );
};
