import { Link } from "react-router-dom";
import { ArrowLeft, DollarSign, ShoppingBag, Tag } from "lucide-react";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.tsx";
import { Badge } from "../components/ui/badge.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar.tsx";
import { UserButton } from "../components/user-button.tsx";

// Mock user data
const user = {
  name: "John Smith",
  email: "john.smith@college.edu",
  rollNo: "CS2021032",
  joinedDate: "2021-08-15",
  avatar: "/placeholder.svg",
  purchasedItems: [
    { id: "101", name: "Scientific Calculator", price: 45, purchaseDate: "2023-04-10T14:30:00", image: "/placeholder.svg?height=100&width=100" },
    { id: "102", name: "Physics Textbook", price: 60, purchaseDate: "2023-03-22T09:15:00", image: "/placeholder.svg?height=100&width=100" },
  ],
  activeBids: [
    { id: "1", name: "MacBook Pro 2019", currentBid: 520, yourBid: 500, endTime: "2023-05-20T18:00:00", image: "/placeholder.svg?height=100&width=100" },
    { id: "3", name: "Engineering Textbooks Bundle", currentBid: 85, yourBid: 85, endTime: "2023-05-21T20:00:00", image: "/placeholder.svg?height=100&width=100" },
  ],
  listedItems: [
    { id: "201", name: "Desk Lamp", minBid: 15, currentBid: 22, endTime: "2023-05-25T15:00:00", bids: 4, image: "/placeholder.svg?height=100&width=100" },
    { id: "202", name: "Chemistry Lab Kit", minBid: 40, currentBid: 40, endTime: "2023-05-28T12:00:00", bids: 0, image: "/placeholder.svg?height=100&width=100" },
    { id: "203", name: "Wireless Headphones", minBid: 50, currentBid: 65, endTime: "2023-05-18T10:00:00", bids: 3, image: "/placeholder.svg?height=100&width=100" },
  ],
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white text-green-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-green-600 text-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/dashboard" className="text-xl font-bold">College Marketplace</Link>
          <UserButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Button asChild variant="ghost" className="mb-6 text-green-700 hover:text-green-900">
          <Link to="/dashboard" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to marketplace</span>
          </Link>
        </Button>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          {/* User Profile Card */}
          <Card className="shadow-lg">
            <CardHeader className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="outline" className="mt-2 px-3 text-green-700 border-green-600">
                Roll No: {user.rollNo}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Member since {new Date(user.joinedDate).toLocaleDateString()}
              </span>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-4">
                <Button asChild variant="outline" size="sm" className="border-green-600 text-green-700">
                  <Link to="/settings">Edit Profile</Link>
                </Button>
                <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  <Link to="/additem">List New Item</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Tabs */}
          <Card className="shadow-lg">
            <Tabs defaultValue="listed">
              <CardHeader className="pb-0">
                <TabsList className="w-full bg-green-100 rounded-lg">
                  <TabsTrigger value="listed" className="flex-1 text-green-700">
                    <Tag className="mr-2 h-4 w-4" />
                    My Listings
                  </TabsTrigger>
                  <TabsTrigger value="bids" className="flex-1 text-green-700">
                    <DollarSign className="mr-2 h-4 w-4" />
                    My Bids
                  </TabsTrigger>
                  <TabsTrigger value="purchased" className="flex-1 text-green-700">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Purchased
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Listed Items Tab */}
                <TabsContent value="listed">
                  {user.listedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-lg border p-3 hover:bg-green-50">
                      <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded-md" />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-green-700">Min bid: ${item.minBid}</p>
                      </div>
                      <Badge variant="outline" className="text-green-700 border-green-600">
                        {new Date(item.endTime) > new Date() ? "Active" : "Ended"}
                      </Badge>
                    </div>
                  ))}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
}
