import { useState, useEffect } from 'react'
import { Product } from '../types'
import ProductCard from './ProductCard'

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Basic T-Shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    price: 199.99,
    sizes: [
      { name: 'S', stock: 5 },
      { name: 'M', stock: 8 },
      { name: 'L', stock: 3 },
    ],
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800',
    price: 299.99,
    sizes: [
      { name: '28', stock: 4 },
      { name: '30', stock: 6 },
      { name: '32', stock: 2 },
    ],
  },
]

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const storedProducts = localStorage.getItem('products')
    if (!storedProducts) {
      localStorage.setItem('products', JSON.stringify(INITIAL_PRODUCTS))
      setProducts(INITIAL_PRODUCTS)
    } else {
      setProducts(JSON.parse(storedProducts))
    }
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Ürünlerimiz</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductList