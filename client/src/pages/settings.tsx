import { useState } from 'react'
import { Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ArrowLeft, Camera, Eye, EyeOff, Save, User } from 'lucide-react'

import { Button } from '../components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form'
import { Input } from '../components/ui/input' 
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { UserButton } from '../components/user-button'
import { useToast } from '../hooks/use-toast'

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  rollNo: z.string().min(1, "Roll number is required.") ,
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "Password must be at least 8 characters.").optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false
  }
  return true
}, {
  message: "Current password is required to set a new password.",
  path: ["currentPassword"],
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false
  }
  return true
}, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// Mock user data
const user = {
  name: "John Smith",
  email: "johnsmith@iiitkottayam.ac.in",
  rollNo: "2023bcs0xxx",
  avatar: "/placeholder.svg",
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      rollNo: user.rollNo,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  function FormComponent ({form ,name }:any){
    return (
      <>
       <FormField
                        control={form.control}
                        name={name }
                        render={( {field }) => (
                          <FormItem>
                            <FormLabel>{name}</FormLabel>
                            <FormControl>
                             <Input placeholder={`Your ${name}`} {...field} />
                            
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      

      </>
    )
  }

  function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log(data)
      
      toast("profile updated")
      
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/dashboard" className="text-xl font-bold">College Marketplace</Link>
          <UserButton />
        </div>
      </header>
      
      <main className="container px-4 py-6">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/profile" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to profile</span>
          </Link>
        </Button>
        
        <div className="mx-auto max-w-3xl space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and profile information
            </p>
          </div>
          
       
          <div className="space-y-6">
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-4xl">
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar> 
                <Button variant="outline" size="sm" className="gap-1">
                  <Camera className="h-4 w-4" />
                  <span>Change Avatar</span>
                </Button>
              </div>
              
              <div className="flex-1">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormComponent  form ={form} name={"name"}/>  
                      <FormComponent  form ={form} name={"email"}/>  
                      <FormComponent  form ={form} name={"rollNo"}/> 
                 
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      
                      <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showCurrentPassword ? "text" : "password"}
                                  placeholder="Enter your current password"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Enter your current password to change it
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showNewPassword ? "text" : "password"}
                                  placeholder="Enter your new password"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Confirm your new password"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    
                    
                    <Button type="submit" className="gap-1" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Saving Changes..."
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
