import { Text, clx } from "@medusajs/ui"

import { ProductPreviewType } from "types/global"

import { retrievePricedProductById } from "@lib/data"
import { getProductPrice } from "@lib/util/get-product-price"
import { Region } from "@medusajs/medusa"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  productPreview,
  isFeatured,
  region,
  fixedThumbnailSize
}: {
  productPreview: ProductPreviewType
  isFeatured?: boolean
  region: Region
  fixedThumbnailSize?: boolean
}) {
  const pricedProduct = await retrievePricedProductById({
    id: productPreview.id,
    regionId: region.id,
  }).then((product) => product)

  if (!pricedProduct) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product: pricedProduct,
    region,
  })

  return (
    <LocalizedClientLink
      href={`/products/${productPreview.handle}`}
      className="group"
    >
      <div className={clx({"size-72 flex flex-col items-center": isFeatured && fixedThumbnailSize})}>
        <Thumbnail
          thumbnail={productPreview.thumbnail}
          size={fixedThumbnailSize? "square":"full"}
          isFeatured={isFeatured}
          fixedThumbnailSize={fixedThumbnailSize}
        />
        <div className="flex w-full txt-compact-medium mt-4 justify-evenly">
          <Text className="text-ui-fg-subtle">{productPreview.title}</Text>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
