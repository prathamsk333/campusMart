import  { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';
import { Leaf, LogIn, UserPlus } from 'lucide-react';

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

// Login Component



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // TODO: Implement login logic
    console.log('Login attempted', { email, password });
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
              >
                <LogIn className="mr-2" /> Login
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

// Signup Component
const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // TODO: Implement signup logic
    console.log('Signup attempted', { name, email, password });
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              custom={2}
            >
              <Label htmlFor="password" className="text-green-800">Password</Label>
              <Input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
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
              <Label htmlFor="confirm-password" className="text-green-800">Confirm Password</Label>
              <Input 
                id="confirm-password"
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
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
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 transition-colors"
              >
                <UserPlus className="mr-2" /> Create Account
              </Button>
            </motion.div>
            <motion.div
              variants={inputVariants}
              initial="initial"
              animate="animate"
              custom={5}
              className="text-center mt-4"
            >
              <span className="text-sm text-green-800">
                Already have an account? {' '}
                <Link 
                  to="/login" 
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

// Export both components
export { Login, Signup };