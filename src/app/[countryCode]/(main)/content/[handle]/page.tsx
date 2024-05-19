import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import { contentfulClient } from "@lib/config"
import NotFound from "app/not-found"
import Link from "next/link";
import { cmsSkeleton } from "types/global"

const customRenderer = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => <p className="my-4 text-base">{children}</p>,
    [BLOCKS.HEADING_1]: (node: any, children: any) => <h1 className="my-4 text-4xl">{children}</h1>,
    [BLOCKS.HEADING_2]: (node: any, children: any) => <h2 className="my-4 text-3xl">{children}</h2>,
    [BLOCKS.HEADING_3]: (node: any, children: any) => <h3 className="my-4 text-2xl">{children}</h3>,
    [BLOCKS.HEADING_4]: (node: any, children: any) => <h4 className="my-4 text-xl">{children}</h4>,
    [BLOCKS.HEADING_5]: (node: any, children: any) => <h5 className="my-4 text-lg">{children}</h5>,
    [BLOCKS.HEADING_6]: (node: any, children: any) => <h6 className="my-4 text-base">{children}</h6>,
    [BLOCKS.UL_LIST]: (node: any, children: any) => <ul className="list-disc">{children}</ul>,
    [BLOCKS.OL_LIST]: (node: any, children: any) => <ol className="list-decimal">{children}</ol>,
    [BLOCKS.LIST_ITEM]: (node: any, children: any) => <li className="mx-4 mb-2">{children}</li>,
    [BLOCKS.QUOTE]: (node: any, children: any) => <blockquote className="italic">{children}</blockquote>,
    [BLOCKS.HR]: () => <hr className="my-4 border-b border-gray-300" />,
    [BLOCKS.EMBEDDED_ENTRY]: (node: any) => {
      // Custom handling for embedded entry
      return <div className="my-4 bg-gray-100 p-4">{node.data.target.title}</div>;
    },
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      // Custom handling for embedded asset
      return <div className="my-4 bg-gray-100 p-4">{node.data.target.title}</div>;
    },
    [BLOCKS.EMBEDDED_RESOURCE]: (node: any) => {
      // Custom handling for embedded resource
      return <div className="my-4 bg-gray-100 p-4">{node.data.target.title}</div>;
    },
    [INLINES.HYPERLINK]: (node: any, children: any) => (
      <Link
        href={node.data.uri}
        target='_blank'
      >{node.data.uri}</Link>
    ),
  },
  renderMark: {
    [MARKS.BOLD]: (text: any) => <strong className="font-bold">{text}</strong>,
    [MARKS.ITALIC]: (text: any) => <em className="italic">{text}</em>,
    [MARKS.UNDERLINE]: (text: any) => <u className="underline">{text}</u>,
    [MARKS.CODE]: (text: any) => <code className="my-4 bg-gray-200 px-1 rounded">{text}</code>,
  },
};
export default async function Content({
  params: { countryCode, handle }
}: {
  params: { countryCode: string, handle: string }
}) {
  const content = await contentfulClient
  .getEntries<cmsSkeleton>({'content_type':'cms', 'fields.region':countryCode, 'sys.id':handle, limit: 1})
  .catch(e => null)
  .then(entries =>{
    const content = entries?.items[0]?.fields?.content;
    return content?? null
  });
  if(!content)
    return NotFound;

  return (
      <div className="p-12">
        {documentToReactComponents(content,customRenderer)}
      </div>
  )
}
 