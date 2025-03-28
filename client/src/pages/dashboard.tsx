import { Link } from "react-router-dom"
import { UserButton } from "../components/user-button.tsx"
import { ProductCard } from "../components/product-card"
import { Button } from "../components/ui/button"
import { PlusCircle } from "lucide-react"

// Mock data for available items
const availableItems = [
  {
    id: "1",
    name: "MacBook Pro 2019",
    minBid: 450,
    startTime: "2023-05-15T10:00:00",
    endTime: "2023-05-20T18:00:00",
    owner: "Alex Johnson",
    description: "Slightly used MacBook Pro with 16GB RAM and 512GB SSD. In excellent condition with minimal wear.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bWFjfGVufDB8fDB8fHww",
  },
  {
    id: "2",
    name: "Graphing Calculator",
    minBid: 35,
    startTime: "2023-05-16T09:00:00",
    endTime: "2023-05-19T17:00:00",
    owner: "Sarah Williams",
    description: "TI-84 Plus graphing calculator. Perfect for engineering and math courses. Includes batteries.",
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FsY3VsYXRvcnxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "3",
    name: "Engineering Textbooks Bundle",
    minBid: 75,
    startTime: "2023-05-14T08:00:00",
    endTime: "2023-05-21T20:00:00",
    owner: "Michael Chen",
    description: "Set of 5 engineering textbooks covering calculus, physics, and computer science. Minor highlighting.",
    image: "https://plus.unsplash.com/premium_photo-1667251758769-398dca4d5f1c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZW5naW5lZXIlMjB0ZXh0Ym9va3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "4",
    name: "Dorm Refrigerator",
    minBid: 60,
    startTime: "2023-05-17T12:00:00",
    endTime: "2023-05-22T12:00:00",
    owner: "Jessica Lee",
    description: "Compact refrigerator, perfect for dorm rooms. 2.7 cubic feet with freezer compartment.",
    image: "https://images.unsplash.com/photo-1536353284924-9220c464e262?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJpZGdlfGVufDB8fDB8fHww",
  },
  {
    id: "5",
    name: "Mountain Bike",
    minBid: 120,
    startTime: "2023-05-13T14:00:00",
    endTime: "2023-05-23T14:00:00",
    owner: "David Wilson",
    description: "21-speed mountain bike in good condition. Recently tuned up with new brakes and tires.",
    image: "https://images.unsplash.com/photo-1530173235220-f6825c107a77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1vdW50YWluJTIwYmlrZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "6",
    name: "Study Desk and Chair",
    minBid: 85,
    startTime: "2023-05-18T09:00:00",
    endTime: "2023-05-25T18:00:00",
    owner: "Emily Rodriguez",
    description: "Wooden study desk with matching chair. Adjustable height and built-in bookshelf.",
    image: "https://images.unsplash.com/photo-1486946255434-2466348c2166?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hhaXIlMjBhbmQlMjBkZXNrfGVufDB8fDB8fHww",
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white text-green-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-green-600 text-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/dashboard" className="text-xl font-bold">
            College Marketplace
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm" className="border-white text-green-900">
              <Link to="/profile">My Profile</Link>
            </Button>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Heading */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Available Items</h1>
            <p className="text-green-700">
              Browse and bid on items from your college community
            </p>
          </div>
          <Button className="flex  bg-green-600 hover:bg-green-700 text-white">
            <Link to='/additem' className="flex items-center gap-1   ">
            <PlusCircle className="h-4 w-4" />
            <span>List an Item</span>
            </Link>
           
          </Button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {availableItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </main>
    </div>
  );
}

