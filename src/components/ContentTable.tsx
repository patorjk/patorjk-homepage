import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table.tsx";
import {SimpleLink} from "@/components/SimpleLink.tsx";
import type {ContentItem} from "@/components/types.ts";
import {useResizeObserver} from 'usehooks-ts'
import {type RefObject, useRef} from "react";

interface ContentTableProps {
  items: ContentItem[];
}

const ContentTable = ({items}: ContentTableProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const {width = 0} = useResizeObserver<HTMLDivElement>({
    ref: ref as RefObject<HTMLDivElement>,
    box: 'border-box',
  })

  return (
    <div ref={ref}>
      <Table>
        <TableBody>
          {width < 600 ?
            items.map((item) => (
              <TableRow key={item.link}>
                <TableCell className="whitespace-normal break-words"><SimpleLink
                  href={item.link}
                  label={item.title}/> - {item.descriptionMobile ?? item.description}</TableCell>
              </TableRow>
            ))
            :
            items.map((item) => (
              <TableRow key={item.link}>
                <TableCell className="font-medium whitespace-normal break-words min-w-[170px]"><SimpleLink
                  href={item.link}
                  label={item.title}/></TableCell>
                <TableCell className={"whitespace-normal break-words"}>{item.description}</TableCell>
              </TableRow>
            ))
          }

        </TableBody>
      </Table>
    </div>
  )
};

export {ContentTable}
