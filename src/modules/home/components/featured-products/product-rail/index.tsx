import { Region } from "@medusajs/medusa"
import { Container, Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"
import { ProductCollectionWithPreviews } from "types/global"
import ProductRailCarousel from "../product-rail-carousel"

export default function ProductRail({
  collection,
  region,
}: {
  collection: ProductCollectionWithPreviews
  region: Region
}) {
  const { products } = collection

  if (!products) {
    return null
  }

  return (
    <div className="content-container small:py-12">
      {products &&
        <ul>
          <div className="flex justify-between mb-8 mx-20 gap-x-5">
            <Text className="txt-xlarge">{collection.title}</Text>
            <InteractiveLink href={`/collections/${collection.handle}`}>
              View all
            </InteractiveLink>
          </div>
          <ProductRailCarousel
            items={
              products.map((product) => (
                <Container key={product.id} className="m-0 p-0 shadow-none max-h-80">
                  <ProductPreview
                    productPreview={product}
                    region={region}
                    isFeatured
                    fixedThumbnailSize
                  />
                </Container>
              ))}
            region={region}
          />
        </ul>
      }
    </div>
  )
}
