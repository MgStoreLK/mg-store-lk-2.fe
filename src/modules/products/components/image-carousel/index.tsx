"use client"
import { Image as MedusaImage } from "@medusajs/medusa"
import { Container, IconButton } from "@medusajs/ui"
import { useSpringCarousel } from 'react-spring-carousel'
import Image from "next/image"
import ArrowLeftCircleFill from "@modules/common/icons/arrow-fill-left"
import ArrowRightCircleFill from "@modules/common/icons/arrow-fill-right"

type ImageGalleryProps = {
  images: MedusaImage[]
}

const ProductImageCarousel = ({ images, ...props }: ImageGalleryProps & React.HTMLProps<HTMLDivElement>) => {
    const { 
        carouselFragment, 
        thumbsFragment,
        slideToPrevItem, 
        slideToNextItem,
        slideToItem
      } = useSpringCarousel({
        withThumbs: true, 
        withLoop: true,
        itemsPerSlide:1,
        initialActiveItem:0,
        items: images.map((image, index) => ({
          id: image.id,
          renderItem: (
            <Container
              key={image.id}
              className="mb-5 relative aspect-[5/3] bg-ui-bg-subtle"
              id={image.id}
            >
              <Image
                src={image.url}
                priority={index <= 2 ? true : false}
                className="relative inset-0 rounded-rounded"
                alt={`Product image ${index + 1}`}
                fill
                sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                style={{
                  objectFit: "fill",
                }}
              />
            </Container>
          ),
          renderThumb: (
            <IconButton key={image.id}id={image.id} 
              onClick={() => slideToItem(image.id)} 
              size="xlarge" 
              className="mr-2 rounded-rounded hover:border-2 active:border-2 focus:outline-none focus:border-2" >
              <Image
                src={image.url}
                priority={index <= 2 ? true : false}
                className=""
                alt={`Product image ${index + 1}`}
                fill
                style={{
                  objectFit: "cover",
                }}
                />
            </IconButton>
          )
        }))
      });

  return (
    <div className="relative flex flex-col gap-y-4">
      <div className="overflow-hidden">
        <IconButton variant="transparent" className="absolute top-1/2 transform -translate-y-1/2 left-0  z-10 border-none rounded-full" onClick={slideToPrevItem}>
          <ArrowLeftCircleFill size={25} />
        </IconButton>
        {carouselFragment}
        <IconButton variant="transparent" className="absolute top-1/2 transform -translate-y-1/2 right-0  z-10 border-none rounded-full" onClick={slideToNextItem}>
          <ArrowRightCircleFill size={25} />
        </IconButton>
      </div>
      <div className="">{thumbsFragment}</div>
    </div>
  )
}

export default ProductImageCarousel
