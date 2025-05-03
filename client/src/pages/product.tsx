import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, Clock } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card.tsx"
import { Badge } from "../components/ui/badge.tsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { BidForm } from "../components/bid-form"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { UserButton } from "../components/user-button"
import { useQuery } from "@tanstack/react-query"
//@ts-ignore
import { getItemById } from "../utils/http"; // Adjust the path if necessary
// Mock product data
const productsample = {
  id: "1",
  name: "MacBook Pro 2019",
  minBid: 450,
  currentBid: 520,
  startTime: "2023-05-15T10:00:00",
  endTime: "2023-05-20T18:00:00",
  owner: "Alex Johnson",
  ownerRollNo: "CS2021045",
  description:
    "Slightly used MacBook Pro with 16GB RAM and 512GB SSD. In excellent condition with minimal wear. This laptop is perfect for programming, design work, and general productivity. Battery health is at 92% and it comes with the original charger. I'm selling it because I recently upgraded to a newer model.",
  condition: "Excellent",
  category: "Electronics",
  location: "Engineering Building",
  images: [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ],
  bids: [
    { user: "Michael Chen", amount: 520, time: "2023-05-16T14:30:00" },
    { user: "Sarah Williams", amount: 500, time: "2023-05-16T11:15:00" },
    { user: "David Wilson", amount: 480, time: "2023-05-15T16:45:00" },
    { user: "Emily Rodriguez", amount: 450, time: "2023-05-15T12:20:00" },
  ],
}
export interface Product {
  _id: string;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  startingPrice: number;
  biddingStartTime: string;
  biddingEndTime: string;
  condition: string;
  category: string;
  pickupLocation: string;
  images: string[];
  createdAt: string;
  __v: number;
}
export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
 
    if (!id) {
      return <div>Error: User ID not found</div>;
    }
  
    const { data: product, isLoading, isError } = useQuery<Product>({
      queryKey: ["productDetails", id],
      queryFn: () => getItemById(id), // Fetch product by ID
    });
    const [selectedImage, setSelectedImage] = useState(0);

    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (isError || !product) {
      return <div>Error loading product details</div>;
    }
  
    const isActive = new Date(product.biddingEndTime) > new Date();
    const timeRemaining = isActive
      ? formatDistanceToNow(new Date(product.biddingEndTime), { addSuffix: true })
      : "Auction ended";
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/dashboard" className="text-xl font-bold">
            College Marketplace
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/profile">My Profile</Link>
            </Button>
            <UserButton />
          </div>
        </div>
      </header>

      <main className=" px-4 py-6">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/dashboard" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to listings</span>
          </Link>
        </Button>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${
                    selectedImage === index ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Ended"}</Badge>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg" alt={productsample.owner} />
                  <AvatarFallback>{productsample.owner[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {productsample.owner} ({productsample.ownerRollNo})
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Card className="flex-1">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Current Bid</div>
                  <div className="text-2xl font-bold">${productsample.currentBid}</div>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Minimum Bid</div>
                  <div className="text-2xl font-bold">${product.startingPrice}</div>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Time Remaining</div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-medium">{timeRemaining}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {isActive && <BidForm productId={id || ""} currentBid={productsample.currentBid} />}

            <Tabs defaultValue="details">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">
                  Details
                </TabsTrigger>
                <TabsTrigger value="bids" className="flex-1">
                  Bid History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4 space-y-4">
                <div>
                  <h3 className="font-medium">Description</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{product.detailedDescription
                    }</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Condition</h3>
                    <p className="text-sm text-muted-foreground">{product.condition}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Category</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-sm text-muted-foreground">{product.pickupLocation}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Auction Started</h3>
                    <p className="text-sm text-muted-foreground">{new Date(product.biddingStartTime).toLocaleDateString()}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="bids" className="mt-4">
                <div className="space-y-2">
                  {productsample.bids.map((bid, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" alt={bid.user} />
                          <AvatarFallback>{bid.user[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{bid.user}</div>
                          <div className="text-xs text-muted-foreground">{new Date(bid.time).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="font-bold">${bid.amount}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

