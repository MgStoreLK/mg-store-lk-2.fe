import { Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import React, { Suspense } from "react"

import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import ProductImageCarousel from "../components/image-carousel"
import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ProductTemplateProps = {
  product: PricedProduct
  region: Region
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div className="content-container flex justify-start max-lg:justify-center my-5">
        <ProductInfo product={product} />
      </div>
      <div className="content-container flex flex-row max-lg:flex-col small:items-start py-6 w-full justify-evenly">
        {product?.images && product?.images.length>0? 
              (<ProductImageCarousel images={product?.images || []} />):
              (<PlaceholderImage 
                className="w-[800px] sm:w-[280px] md:w-[360px] lg:w-[480px] 
                  aspect-[1/1] 
                  h-auto 
                  shadow-2xl
                  rounded-lg"/>)}
        <div className="flex flex-col small:sticky small:max-w-[300px] w-full px-6 max-lg:px-auto py-8 gap-y-12">
          <ProductOnboardingCta />
          <Suspense
            fallback={<ProductActions product={product} region={region} />}
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
        </div>
      </div>
      <div className="content-container my-8 flex flex-col small:sticky w-full py-8 gap-y-6">
        <ProductTabs product={product} />
      </div>
      <div className="content-container my-16 small:my-32">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
