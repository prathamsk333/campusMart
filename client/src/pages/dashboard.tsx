import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserButton } from "../components/user-button";
import { ProductCard } from "../components/product-card";
import { Button } from "../components/ui/button";
import { PlusCircle } from "lucide-react";
import { fetchitems } from "@/utils/http";
interface ProductCardProps {
    id: string
    name: string
    minBid: number
    startTime: string
    endTime: string
    owner: string
    description: string
    image: string
  }


export default function DashboardPage() {
  // Fetch items using React Query
  const { data: availableItems, isLoading, isError } = useQuery({
    queryKey: ["availableItems"],
    queryFn: fetchitems,
  });

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
          <Button className="flex bg-green-600 hover:bg-green-700 text-white">
            <Link to="/additem" className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              <span>List an Item</span>
            </Link>
          </Button>
        </div>

        {/* Display Loading or Error */}
        {isLoading && <p className="text-center text-green-700">Loading items...</p>}
        {isError && <p className="text-center text-red-600">Failed to load items.</p>}

        {/* Items Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {availableItems?.map((item:ProductCardProps) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </main>
    </div>
  );
}
