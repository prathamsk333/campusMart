  import type React from "react"
  import { useState } from "react"
  import { Link, useNavigate } from "react-router-dom"
  import { zodResolver } from "@hookform/resolvers/zod"
  import { useForm } from "react-hook-form"
  import { z } from "zod"
  import { ArrowLeft,  Calendar,  ImagePlus, Loader2, Plus, Trash2 } from "lucide-react"
//@ts-ignore
import { createItem } from "../utils/http";

  import { Button } from "../components/ui/button"
  import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form"
  import { Input } from "../components/ui/input"
  import { Textarea } from "../components/ui/textarea"
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
  import { UserButton } from "../components/user-button"
  import { useToast } from "../hooks/use-toast"
import { useMutation } from "@tanstack/react-query"

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

  const addItemFormSchema = z
    .object({
      name: z.string().min(2, "Item name must be at least 2 characters."),
      shortDescription: z.string().max(100, "Short description must not exceed 100 characters."),
      description: z.string().min(10, "Description must be at least 10 characters."),
      minBidPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Minimum bid price must be a positive number.",
      }),
      startTime: z.string().refine((val) => new Date(val) > new Date(), {
        message: "Start time must be in the future.",
      }),
      endTime: z.string().refine((val) => new Date(val) > new Date(), {
        message: "End time must be in the future.",
      }),
      condition: z.string({
        required_error: "Please select the item condition.",
      }),
      category: z.string({
        required_error: "Please select a category.",
      }),
      location: z.string().min(1, "Location is required."),
    })
    .refine(
      (data) => {
        return new Date(data.endTime) > new Date(data.startTime)
      },
      {
        message: "End time must be after start time.",
        path: ["endTime"],
      },
    )

  type AddItemFormValues = z.infer<typeof addItemFormSchema>


    const SelectFormField = ({ form, name, label, options }: any) => (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );



    function FormComponent({ form, name}: any) {
      return (
        <>
          <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{name === 'item' ? 'Item name' : name == 'shortDescription' ? 'Short Description' : 'Full Description'}</FormLabel>
                <FormControl>
                  {name == 'item' ? <Input placeholder={`${name} name`} {...field} /> : name == "shortDescription" ? <Input placeholder="Brief description for item cards" {...field} /> : <Textarea
                    placeholder="Provide a detailed description of your item"
                    className="min-h-32 resize-y"
                    {...field}
                  />}

                </FormControl>
                {name == "shortDescription" || name == "description" ? name == "shortDescription" ? <FormDescription>
                  This will appear on the item card. Keep it short and descriptive.
                </FormDescription> : <FormDescription>
                  Include details about features, specifications, condition, and reason for selling.
                </FormDescription> : ''}
                <FormMessage />
              </FormItem>
            )}
          />


        </>
      )
    }
  export default function AddItemPage() {
    const { toast } = useToast()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [images, setImages] = useState<{ file: File; preview: string }[]>([])
    const [imageError, setImageError] = useState<string | null>(null)

    const form = useForm<AddItemFormValues>({
      resolver: zodResolver(addItemFormSchema),
      defaultValues: {
        name: "",
        shortDescription: "",
        description: "",
        minBidPrice: "",
        startTime: "",
        endTime: "",
        condition: "",
        category: "",
        location: "",
      },
    })
    const { mutate } = useMutation({
      mutationFn: (itemDetails: any) => createItem(itemDetails),
      onSuccess: () => {
        toast("Item listed successfully!");
        setIsSubmitting(false);
        navigate("/dashboard");
      },
      onError: (error: any) => {
        toast(`Error: ${error.message}`);
        setIsSubmitting(false);
      },
    });
    function onSubmit(data: AddItemFormValues) {
      if (images.length === 0) {
        setImageError("Please upload at least one image of your item.");
        return;
      }
  
      setIsSubmitting(true);
  
      // Prepare the data for the API call
      const itemDetails = {
        ...data,
        biddingStartTime: Date.now(),
        minBidPrice: Number(data.minBidPrice),
        images: images.map((img) => img.file), // Include image files
      };
  
      // Use mutate to call the createItem API
      mutate(itemDetails);
    }
  
    function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
      const files = e.target.files;
  
      if (!files || files.length === 0) return;
  
      const newImages: { file: File; preview: string }[] = [];
      let hasError = false;
  
      Array.from(files).forEach((file) => {
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          setImageError(`${file.name} is too large. Maximum size is 5MB.`);
          hasError = true;
          return;
        }
  
        // Validate file type
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          setImageError(`${file.name} has an unsupported format. Please upload JPEG, JPG, PNG, or WebP.`);
          hasError = true;
          return;
        }
  
        // Create preview URL
        const preview = URL.createObjectURL(file);
        newImages.push({ file, preview });
      });
  
      if (!hasError) {
        setImageError(null);
        setImages((prev) => [...prev, ...newImages]);
      }
  
      // Reset input value so the same file can be selected again
      e.target.value = "";
    }
  
    function removeImage(index: number) {
      setImages((prev) => {
        const newImages = [...prev];
        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, 1);
        return newImages;
      });
    }
  
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    const minStartDate = today.toISOString().split("T")[0];
    const minEndDate = tomorrow.toISOString().split("T")[0];
  

    return (
      <div className="min-h-screen bg-slate-50">
        <header className="sticky top-0 z-10 border-b bg-white">
          <div className="container flex h-16 items-center justify-between px-4">
            <Link to="/dashboard" className="text-xl font-bold">
              College Marketplace
            </Link>
            <UserButton />
          </div>
        </header>

        <main className="container px-4 py-6">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/dashboard" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to marketplace</span>
            </Link>
          </Button>

          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">List an Item for Bidding</h1>
              <p className="text-muted-foreground">Provide details about your item to list it for bidding</p>
            </div>


            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <FormComponent form={form} name={"item"} />
                  <FormComponent form={form} name={"shortDescription"} />
                  <FormComponent form={form} name={"description"} />
                </div>
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Bidding Details</h3>

                  <FormField
                    control={form.control}
                    name="minBidPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Bid Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            step="0.01"
                            placeholder="0.00"
                            className="rounded-l-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>The starting price for bids on your item.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bidding Start Time</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <div className="pointer-events-none flex h-10 w-10 items-center justify-center rounded-l-md border border-r-0 bg-muted text-sm">
                              <Calendar className="h-4 w-4" />
                            </div>
                            <Input
                              type="datetime-local"
                              className="rounded-l-none"
                              min={new Date().toISOString().slice(0, 16)}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>When bidding will start for this item.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bidding End Time</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Input
                                type="datetime-local"
                                className="rounded-l-none"
                                min={new Date().toISOString().slice(0, 16)}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>When bidding will end for this item.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Item Details</h3>

                  <div className="grid gap-6 md:grid-cols-2">
                    <SelectFormField
                      form={form}
                      name="condition"
                      label="Condition"
                      options={[
                        { value: "new", label: "New" },
                        { value: "like-new", label: "Like New" },
                        { value: "excellent", label: "Excellent" },
                        { value: "good", label: "Good" },
                        { value: "fair", label: "Fair" },
                        { value: "poor", label: "Poor" },
                      ]}
                    />

                    <SelectFormField
                      form={form}
                      name="category"
                      label="Category"
                      options={[
                        { value: "electronics", label: "Electronics" },
                        { value: "books", label: "Books & Textbooks" },
                        { value: "furniture", label: "Furniture" },
                        { value: "clothing", label: "Clothing" },
                        { value: "sports", label: "Sports Equipment" },
                        { value: "instruments", label: "Musical Instruments" },
                        { value: "appliances", label: "Appliances" },
                        { value: "other", label: "Other" },
                      ]}
                    />

                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Where can the buyer pick up this item?" {...field} />
                        </FormControl>
                        <FormDescription>Specify a location on campus where the item can be picked up.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Item Images</h3>
                    <p className="text-sm text-muted-foreground">Upload up to 5 images</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative h-32 w-32 overflow-hidden rounded-md border">
                          <img
                            src={image.preview || "/placeholder.svg"}
                            alt={`Item preview ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute right-1 top-1 h-6 w-6 rounded-full"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}

                      {images.length < 5 && (
                        <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed bg-muted/50 transition-colors hover:bg-muted">
                          <div className="flex flex-col items-center justify-center space-y-2 text-xs">
                            <ImagePlus className="h-8 w-8 text-muted-foreground" />
                            <span className="text-center font-medium text-muted-foreground">Click to upload</span>
                          </div>
                          <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                        </label>
                      )}
                    </div>

                    {imageError && <p className="text-sm font-medium text-destructive">{imageError}</p>}

                    <p className="text-xs text-muted-foreground">
                      Accepted formats: JPEG, JPG, PNG, or WebP. Maximum size: 5MB per image.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="gap-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Listing Item...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>List Item for Bidding</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>



          </div>
        </main>
      </div>
    )
  }

