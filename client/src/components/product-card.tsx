import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { Clock, DollarSign, User } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card.tsx"
import { Badge } from "../components/ui/badge.tsx"

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    startingPrice: number;
    biddingStartTime: string;
    biddingEndTime: string;
    owner: string;
    shortDescription: string;
    images: string[];
  };
}


export function ProductCard({ product }: ProductCardProps) {
  const isActive = new Date(product.biddingEndTime) > new Date()
  const timeRemaining = isActive ? formatDistanceToNow(new Date(product.biddingEndTime), { addSuffix: true }) : "Auction ended"

  return (
    <Link to={`/products/${product._id}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-md">
        <div className="relative h-48 w-full">
          <img src={product.images[0] || "/placeholder.svg"} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <CardHeader className="p-4 pb-0">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold">{product.name}</h3>
            <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Ended"}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>
          <div className="flex items-center gap-1 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>Min bid: ${product.startingPrice}</span>
          </div>
          <div className="mt-1 flex items-center gap-1 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{product.owner}</span>
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{timeRemaining}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

