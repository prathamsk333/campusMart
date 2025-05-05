import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { formatDistanceToNow, differenceInHours, differenceInMinutes } from "date-fns";
import { ArrowLeft, Clock, MapPin, Tag, Package, Calendar, Share2, Heart, Shield, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { UserButton } from "../components/user-button";
import { useQuery } from "@tanstack/react-query";
// @ts-ignore
import { getItemById, createBid } from "../utils/http";
import { Separator } from "../components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

// Helper function to format time remaining in hours and minutes
function formatTimeRemaining(endTimeStr: string | number | Date) {
  const endTime = new Date(endTimeStr);
  const now = new Date();
  
  if (endTime <= now) return "Auction ended";
  
  const hoursRemaining = differenceInHours(endTime, now);
  const minutesRemaining = differenceInMinutes(endTime, now) % 60;
  
  if (hoursRemaining > 24) {
    const days = Math.floor(hoursRemaining / 24);
    return `${days} day${days > 1 ? 's' : ''} left`;
  }
  
  if (hoursRemaining === 0) {
    return `${minutesRemaining} minute${minutesRemaining > 1 ? 's' : ''} left`;
  }
  
  return `${hoursRemaining} hr${hoursRemaining > 1 ? 's' : ''} ${minutesRemaining} min${minutesRemaining > 1 ? 's' : ''} left`;
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [bidAmount, setBidAmount] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!id) {
    return <div>Error: Product ID not found</div>;
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["productDetails", id],
    queryFn: () => getItemById(id),
  });

  const [selectedImage, setSelectedImage] = useState(0);

  // Update time remaining every minute
  useEffect(() => {
    if (data?.data?.auction?.biddingEndTime) {
      const updateTimer = () => {
        setTimeRemaining(formatTimeRemaining(data.data.auction.biddingEndTime));
      };
      
      updateTimer(); // Initial update
      const interval = setInterval(updateTimer, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md text-center p-6 bg-white rounded-lg shadow-sm">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Product</h2>
          <p className="text-muted-foreground mb-4">We couldn't load the product details. Please try again later.</p>
          <Button asChild>
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { item, auction, owner, bids } = data.data;
  const isActive = auction.status === 'active';
  const minimumBid = auction.currentHighestBid?.amount 
    ? (auction.currentHighestBid.amount + 1) 
    : item.startingPrice;

  const handleBidSubmit = async (e:any) => {
    e.preventDefault();
    
    if (!bidAmount || parseFloat(bidAmount) < minimumBid) {
      toast(`{
        title: "Invalid bid amount",
        description: Bid amount must be at least $${minimumBid.toFixed(2)},
        variant: "destructive",
      }`);
      return;
    }
    
    try {
      setIsSubmitting(true);
      await createBid(id, parseFloat(bidAmount));
      
      toast(`{
        title: "Bid placed successfully!",
        description: "Your bid has been recorded.",
      }`);
      
      // Reset form after submission
      setBidAmount("");
      
      // Refresh product data to show updated bids
      refetch();
    } catch (error:any) {
      toast(`{
        title: "Failed to place bid",
        description: ${error.message} || "Something went wrong. Please try again.",
      }`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/dashboard" className="text-xl font-bold text-primary">
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

      <main className="container px-4 py-8">
        <Button asChild variant="ghost" className="mb-6 group">
          <Link to="/dashboard" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to listings</span>
          </Link>
        </Button>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl border bg-white">
              <img
                src={item.images[selectedImage] || "/placeholder.svg"}
                alt={item.name}
                className="h-full w-full object-contain p-4"
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-white shadow-sm"
                        onClick={() => setIsFavorite(!isFavorite)}
                      >
                        <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isFavorite ? "Remove from favorites" : "Add to favorites"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-white shadow-sm"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Share this listing</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="flex gap-2 overflow-auto pb-2 px-1">
              {item.images.map((image:string, index:number) => (
                <button
                  key={index}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border ${
                    selectedImage === index ? "ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100"
                  } transition-all duration-200`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${item.name} - Image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge>
                      {auction.status === 'active' ? "Active Auction" : auction.status === 'upcoming' ? "Upcoming" : "Bidding Closed"}
                    </Badge>
                    <Badge variant="outline" className="bg-primary/5">
                      {item.category}
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold leading-tight">{item.name}</h1>
                  <p className="mt-2 text-lg text-muted-foreground">{item.shortDescription}</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarImage src="/placeholder.svg" alt={owner.name} />
                  <AvatarFallback className="bg-primary/20 text-primary">{owner.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Listed by {owner.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="overflow-hidden border-primary/20">
                <CardContent className="p-0">
                  <div className="bg-primary/5 p-3 border-b border-primary/10">
                    <h3 className="font-semibold text-primary">Starting Price</h3>
                  </div>
                  <div className="p-4">
                    <div className="text-3xl font-bold">${item.startingPrice.toFixed(2)}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-primary/20">
                <CardContent className="p-0">
                  <div className="bg-primary/5 p-3 border-b border-primary/10">
                    <h3 className="font-semibold text-primary">
                      {auction.bidCount > 0 ? "Current Highest Bid" : "No Bids Yet"}
                    </h3>
                  </div>
                  <div className="p-4">
                    {auction.currentHighestBid && auction.currentHighestBid.amount ? (
                      <div className="flex flex-col">
                        <div className="text-3xl font-bold">${auction.currentHighestBid.amount.toFixed(2)}</div>
                        {auction.currentHighestBid.bidder && (
                          <div className="text-xs text-muted-foreground mt-1">
                            by {auction.currentHighestBid.bidder.name}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-3xl font-bold">-</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">Auction {auction.status === 'active' ? 'Ends' : auction.status === 'upcoming' ? 'Starts' : 'Ended'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {auction.status === 'active' ? timeRemaining :
                       auction.status === 'upcoming' ? formatDistanceToNow(new Date(auction.biddingStartTime), { addSuffix: true }) :
                       "Bidding has ended"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {auction.status === 'active' && (
              <Card className="border-primary/20">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-3">Place Your Bid</h3>
                  <form onSubmit={handleBidSubmit} className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="bid-amount">Bid Amount (Rs.)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="bid-amount"
                          type="number"
                          min={minimumBid}
                          step="0.01"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder={`${minimumBid.toFixed(2)} or higher`}
                          className="flex-1"
                          required
                        />
                        <Button 
                          type="submit" 
                          className="w-24"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Bid Now"
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Minimum bid: ${minimumBid.toFixed(2)}</span>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="bids" className="relative">
                  Bids
                  {auction.bidCount > 0 && (
                    <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {auction.bidCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="seller">Seller Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4 space-y-4">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2 mb-2">
                        <Tag className="h-4 w-4" />
                        Description
                      </h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {item.detailedDescription}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          Condition
                        </h3>
                        <p className="text-sm text-muted-foreground">{item.condition}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          Pickup Location
                        </h3>
                        <p className="text-sm text-muted-foreground">{item.pickupLocation}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          Listed On
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="bids" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    {bids && bids.length > 0 ? (
                      <ul className="divide-y">
                        {bids.map((bid:any) => (
                          <li key={bid.id} className="py-3 first:pt-0 last:pb-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 border border-primary/10">
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {bid.bidder.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">{bid.bidder.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(bid.biddedAt).toLocaleString(undefined, {
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">${bid.amount.toFixed(2)}</p>
                                {bid.amount === auction.currentHighestBid?.amount && (
                                  <Badge className="text-[10px]">Highest Bid</Badge>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">No bids have been placed yet</p>
                        {auction.status === 'active' && (
                          <p className="text-sm mt-1">Be the first to place a bid!</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="seller" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <Avatar className="h-16 w-16 border-2 border-primary/10">
                        <AvatarFallback className="text-xl">{owner.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold">{owner.name}</h3>
                        <p className="text-sm text-muted-foreground">{owner.email || "Email not available"}</p>
                        <div className="mt-3">
                          <Button variant="outline" size="sm">
                            Contact Seller
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}