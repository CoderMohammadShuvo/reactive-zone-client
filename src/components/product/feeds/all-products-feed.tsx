'use client';

import { useState, useEffect, Fragment } from 'react';
import ProductCardAlpine from '@components/product/product-cards/product-card-alpine';
import type { FC } from 'react';
import ProductCardLoader from '@components/ui/loaders/product-card-loader';
import SectionHeader from '@components/common/section-header';
import Alert from '@components/ui/alert';
import cn from 'classnames';
import { useTranslation } from 'src/app/i18n/client';
import { useModalAction } from '@components/common/modal/modal.context';
import { Product } from '@framework/types';
import { LIMITS } from '@framework/utils/limits';

interface ProductFeedProps {
  lang: string;
  element?: any;
  className?: string;
}

const AllProductFeed: FC<ProductFeedProps> = ({ lang, element, className = '' }) => {
  const { t } = useTranslation(lang, 'common');
  const { openModal } = useModalAction();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://reactive-zone-backend.vercel.app/api/admin/products/get');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data.products || []); // Ensure it's an array
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  function handleCategoryPopup() {
    openModal('CATEGORY_VIEW');
  }

  return (
    <div className={cn(className)}>
      <div className="flex items-center justify-between pb-0.5 mb-4 lg:mb-5 xl:mb-6">
        <SectionHeader sectionHeading="All Products" className="mb-0" lang={lang} />
        <div
          className="lg:hidden transition-all text-brand -mt-1.5 font-semibold text-sm md:text-15px hover:text-brand-dark"
          role="button"
          onClick={handleCategoryPopup}
        >
          {t('text-categories')}
        </div>
      </div>

      {error ? (
        <Alert message={error} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 md:gap-4 2xl:gap-5">
          {isLoading ? (
            Array.from({ length: LIMITS.PRODUCTS_LIMITS }).map((_, idx) => (
              <ProductCardLoader key={`product-loader-${idx}`} uniqueKey={`product-loader-${idx}`} />
            ))
          ) : (
            <>
              {products.slice(0, 18).map((product: Product) => (
                <ProductCardAlpine key={`product-${product.id}`} product={product} lang={lang} />
              ))}

              {element && <div className="col-span-full">{element}</div>}

              {products.length > 18 &&
                products.slice(18).map((product: Product) => (
                  <ProductCardAlpine key={`product-${product.id}`} product={product} lang={lang} />
                ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AllProductFeed;
