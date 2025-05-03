import { Link, useParams } from "react-router-dom";
import { ArrowLeft, DollarSign, ShoppingBag, Tag } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { UserButton } from "../components/user-button";
import { useQuery } from "@tanstack/react-query";
// @ts-ignore
import { fetchUserDetails } from "../utils/http";

export interface PurchasedItem {
  id: string;
  name: string;
  price: number;
  purchaseDate: string;
  image: string;
}

export interface ActiveBid {
  id: string;
  name: string;
  currentBid: number;
  yourBid: number;
  endTime: string;
  image: string;
}

export interface ListedItem {
  id: string;
  name: string;
  minBid: number;
  currentBid: number;
  endTime: string;
  bids: number;
  image: string;
}

export interface User {
  name: string;
  email: string;
  rollNo: string;
  avatar: string;
  joinedDate: string;
  purchasedItems: PurchasedItem[];
  activeBids: ActiveBid[];
  listedItems: ListedItem[];
}
export default function ProfilePage() {
  const { id } = useParams();
  if (!id) {
    return <div>Error: User ID not found</div>;
  }

  const { data: user, isLoading, isError } = useQuery<User>({
    queryKey: ["userDetails", id],
    queryFn: () => fetchUserDetails(id), // Pass the ID to the function
  });
  console.log(user);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !user) {
    return <div>Error loading user details</div>;
  }

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

                {/* Active Bids Tab */}
                <TabsContent value="bids">
                  {user.activeBids.map((bid) => (
                    <div key={bid.id} className="flex items-center gap-4 rounded-lg border p-3 hover:bg-green-50">
                      <img src={bid.image} alt={bid.name} className="h-16 w-16 object-cover rounded-md" />
                      <div className="flex-1">
                        <h4 className="font-medium">{bid.name}</h4>
                        <p className="text-sm text-green-700">Your Bid: ${bid.yourBid}</p>
                        <p className="text-sm text-green-700">Current Bid: ${bid.currentBid}</p>
                      </div>
                      <Badge variant="outline" className="text-green-700 border-green-600">
                        {new Date(bid.endTime) > new Date() ? "Active" : "Ended"}
                      </Badge>
                    </div>
                  ))}
                </TabsContent>

                {/* Purchased Items Tab */}
                <TabsContent value="purchased">
                  {user.purchasedItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-lg border p-3 hover:bg-green-50">
                      <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded-md" />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-green-700">Price: ${item.price}</p>
                        <p className="text-sm text-green-700">
                          Purchased On: {new Date(item.purchaseDate).toLocaleDateString()}
                        </p>
                      </div>
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