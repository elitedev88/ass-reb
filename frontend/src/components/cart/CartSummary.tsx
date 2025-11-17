import { CartSummary as CartSummaryType } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface CartSummaryProps {
  summary: CartSummaryType
}

export function CartSummary({ summary }: CartSummaryProps) {
  return (
    <div className="space-y-2 border-t pt-4">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium">{formatCurrency(summary.subtotal)}</span>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Tax</span>
        <span className="font-medium">{formatCurrency(summary.tax)}</span>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Shipping</span>
        <span className="font-medium">
          {summary.shipping === 0 ? 'FREE' : formatCurrency(summary.shipping)}
        </span>
      </div>
      
      <div className="flex justify-between border-t pt-2 text-base font-semibold">
        <span>Total</span>
        <span>{formatCurrency(summary.total)}</span>
      </div>
    </div>
  )
}
