import { demoCollections } from '@/lib/demo-data';
import { notFound } from 'next/navigation';
import { CollectionClientView } from './CollectionClientView';

export const instant = false;

export function generateStaticParams() {
  return demoCollections.map((col) => ({
    slug: col.slug,
  }));
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = demoCollections.find((c) => c.slug === slug);

  if (!collection) {
    return notFound();
  }

  return <CollectionClientView collection={collection} />;
}
