import { demoProducts } from '@/lib/demo-data';
import { notFound } from 'next/navigation';
import { ProductClientView } from './ProductClientView';

export const instant = false;

export function generateStaticParams() {
  return demoProducts.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = demoProducts.find((p) => p.slug === slug);

  if (!product) {
    return notFound();
  }

  return <ProductClientView product={product} />;
}
