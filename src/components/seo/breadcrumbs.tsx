import Link from 'next/link'
import { buildBreadcrumbListSchema, type BreadcrumbItem } from '@/lib/seo/schemas'
import { JsonLd } from './json-ld'

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <JsonLd data={buildBreadcrumbListSchema(items)} />
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-[66ch] px-6 pt-24 text-xs uppercase tracking-widest opacity-75 md:px-0"
      >
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1
            return (
              <li key={`${item.name}-${idx}`} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:opacity-100">
                    {item.name}
                  </Link>
                ) : (
                  <span aria-current={isLast ? 'page' : undefined}>{item.name}</span>
                )}
                {!isLast && <span aria-hidden="true">/</span>}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
