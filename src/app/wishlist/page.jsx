'use client';
import { useWishlistStore } from '../../store/cartStore';
import ProductCard from '../../components/ui/ProductCard';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { items } = useWishlistStore();

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-terracotta-500 mb-3">Saved Pieces</p>
        <h1 className="section-title">Your Wishlist</h1>
        <p className="font-body text-sm text-charcoal-light mt-2">{items.length} {items.length === 1 ? 'piece' : 'pieces'} saved</p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
          <Heart size={48} className="text-ivory-300" />
          <div>
            <p className="font-display text-3xl text-charcoal mb-2">Nothing saved yet</p>
            <p className="font-body text-sm text-charcoal-light">Browse the collection and save pieces you love.</p>
          </div>
          <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
            Explore the Collection <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
