import { useState } from 'react'
import { Product, Order } from '../types'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [selectedSize, setSelectedSize] = useState('')
  const [instagramUsername, setInstagramUsername] = useState('')
  const [orderSuccess, setOrderSuccess] = useState(false)

  const handleOrder = () => {
    if (!selectedSize || !instagramUsername) {
      alert('Lütfen beden ve Instagram kullanıcı adınızı giriniz')
      return
    }

    const selectedSizeObj = product.sizes.find(s => s.name === selectedSize)
    if (!selectedSizeObj || selectedSizeObj.stock <= 0) {
      alert('Seçilen beden için stok kalmamıştır')
      return
    }

    const order: Order = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      size: selectedSize,
      instagramUsername,
      orderDate: new Date().toISOString(),
    }

    // Update orders
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    orders.push(order)
    localStorage.setItem('orders', JSON.stringify(orders))

    // Update stock
    const products = JSON.parse(localStorage.getItem('products') || '[]')
    const updatedProducts = products.map((p: Product) => {
      if (p.id === product.id) {
        return {
          ...p,
          sizes: p.sizes.map(s => {
            if (s.name === selectedSize) {
              return { ...s, stock: s.stock - 1 }
            }
            return s
          })
        }
      }
      return p
    })
    localStorage.setItem('products', JSON.stringify(updatedProducts))

    setOrderSuccess(true)
    setSelectedSize('')
    setInstagramUsername('')
    
    // Refresh the page after 2 seconds to show updated stock
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
        <p className="text-lg font-bold text-gray-900 mb-2">
          {product.price.toLocaleString('tr-TR')} ₺
        </p>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Mevcut Bedenler:</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size.name}
                onClick={() => setSelectedSize(size.name)}
                disabled={size.stock === 0}
                className={`
                  px-3 py-1 rounded-lg text-sm font-medium
                  ${size.stock === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : selectedSize === size.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }
                `}
              >
                {size.name} ({size.stock})
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={instagramUsername}
            onChange={(e) => setInstagramUsername(e.target.value)}
            placeholder="Instagram kullanıcı adınız"
            className="w-full border rounded-lg p-2"
          />
          
          {orderSuccess ? (
            <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center">
              Siparişiniz alınmıştır!
            </div>
          ) : (
            <button
              onClick={handleOrder}
              disabled={!instagramUsername || !selectedSize}
              className={`
                w-full py-2 rounded-lg
                ${(!instagramUsername || !selectedSize)
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              Sipariş Ver
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard