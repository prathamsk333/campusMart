import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogIn, UserPlus } from 'lucide-react';
import { setUser, setError } from "../utils/userslice";
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
// @ts-ignore
import { loginPOST, signUpPOST } from '../utils/http';

interface UserData {
  token: string;
  name: string;
  email: string;
  id: string;
  phone: string;
}

interface LoginFormData {
  email: string;
  password: string;
}
interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  phone: string; // Added phone field
}

// Enhanced page transition variants
const pageVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.9,
    y: 50
  },
  in: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  out: { 
    opacity: 0, 
    scale: 1.1,
    y: -50,
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Input animation variants
const inputVariants = {
  initial: { 
    opacity: 0, 
    x: -20 
  },
  animate: (custom: number) => ({
    opacity: 1, 
    x: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      type: "spring",
      stiffness: 300
    }
  })
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation<UserData, Error, LoginFormData>({
    mutationFn: loginPOST,
    onSuccess: (data) => {
      Cookies.set("token", data.token, { expires: 7, path: "/" });
      dispatch(setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
      }));
      navigate('/dashboard');
    },
    onError: (error) => {
      dispatch(setError(error.message || "An unknown error occurred"));
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="flex items-center justify-center min-h-screen bg-green-50"
    >
      <Card className="w-full max-w-md p-6 border-green-200 shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Leaf className="text-green-600 w-12 h-12" />
          </div>
          <CardTitle className="text-2xl text-center text-green-800">CampusMart Login</CardTitle>
          <CardDescription className="text-center text-green-700">
            Login to buy and bid on IIIT Kottayam campus items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <motion.div 
              variants={inputVariants}
              initial="initial"
              animate="animate"
              custom={0}
            >
              <Label htmlFor="email" className="text-green-800">Email</Label>
              <Input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@iiitk.ac.in"
                className="border-green-300 focus:ring-green-500"
                required
              />
            </motion.div>
            <motion.div 
              variants={inputVariants}
              initial="initial"
              animate="animate"
              custom={1}
            >
              <Label htmlFor="password" className="text-green-800">Password</Label>
              <Input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="border-green-300 focus:ring-green-500"
                required
              />
            </motion.div>
            <motion.div
              variants={inputVariants}
              initial="initial"
              animate="animate"
              custom={2}
            >
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 transition-colors"
                disabled={isLoading}
              >
                <LogIn className="mr-2" /> {isLoading ? "Logging in..." : "Login"}
              </Button>
            </motion.div>
            <motion.div
              variants={inputVariants}
              initial="initial"
              animate="animate"
              custom={3}
              className="text-center mt-4"
            >
              <span className="text-sm text-green-800">
                Don't have an account? {' '}
                <Link 
                  to="/signup" 
                  className="text-green-600 hover:underline"
                >
                  Sign Up
                </Link>
              </span>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string; // Added phone field
}
const Signup = () => {
  const [formData, setFormData] = useState<SignupFormValues>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '' // Initialize phone field
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation<UserData, Error, SignUpFormData>({
    mutationFn: signUpPOST,
    onSuccess: (data) => {
      Cookies.set("token", data.token, { expires: 7, path: "/" });
      dispatch(setUser({
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
      }));
      navigate('/dashboard');
    },
    onError: (error) => {
      dispatch(setError(error.message || "An unknown error occurred"));
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      dispatch(setError("Passwords do not match!"));
      return;
    }
    mutate(formData);
  };

  return (
    <motion.div 
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      className="flex items-center justify-center min-h-screen bg-green-50"
    >
      <Card className="w-full max-w-md p-6 border-green-200 shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Leaf className="text-green-600 w-12 h-12" />
          </div>
          <CardTitle className="text-2xl text-center text-green-800">Create CampusMart Account</CardTitle>
          <CardDescription className="text-center text-green-700">
            Join IIIT Kottayam's campus marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <motion.div 
              variants={inputVariants}
              initial="initial"
              animate="animate"
              custom={0}
            >
              <Label htmlFor="name" className="text-green-800">Full Name</Label>
              <Input 
                id="name"
                type="text" 
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="border-green-300 focus:ring-green-500"
                required
              />
            </motion.div>
            <motion.div 
              variants={inputVariants}
              initial="initial"
              animate="animate"
              custom={1}
            >
              <Label htmlFor="email" className="text-green-800">Institute Email</Label>
              <Input 
                id="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@iiitk.ac.in"
                className="border-green-300 focus:ring-green-500"
                required
              />
            </motion.div>
            {/* Add phone number field */}
            <motion.div 
              variants={inputVariants}
              initial="initial"
              animate="animate"
              custom={2}
            >
              <Label htmlFor="phone" className="text-green-800">Phone Number</Label>
              <Input 
                id="phone"
                type="tel" 
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                className="border-green-300 focus:ring-green-500"
                required
              />
            </motion.div>
            <motion.div 
              variants={inputVariants}
              initial="initial"
              animate="animate"
              custom={3}
            >
              <Label htmlFor="password" className="text-green-800">Password</Label>
              <Input 
                id="password"
                type="password" 
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="border-green-300 focus:ring-green-500"
                required
              />
            </motion.div>
            <motion.div 
              variants={inputVariants}
              initial="initial"
              animate="animate"
              custom={4}
            >
              <Label htmlFor="confirmPassword" className="text-green-800">Confirm Password</Label>
              <Input 
                id="confirmPassword"
                type="password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                className="border-green-300 focus:ring-green-500"
                required
              />
            </motion.div>
            <motion.div
              variants={inputVariants}
              initial="initial"
              animate="animate"
              custom={5}
            >
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 transition-colors"
                disabled={isLoading}
              >
                <UserPlus className="mr-2" /> {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </motion.div>
            <motion.div
              variants={inputVariants}
              initial="initial"
              animate="animate"
              custom={6}
              className="text-center mt-4"
            >
              <span className="text-sm text-green-800">
                Already have an account? {' '}
                <Link 
                  to="/signin" 
                  className="text-green-600 hover:underline"
                >
                  Login
                </Link>
              </span>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
export { Login, Signup };