import  { useContext } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { CheckCircle, ListTodo, Clock, ArrowRight } from 'lucide-react';
import { AuthContext } from "../Provider/AuthProvider";

const WelcomePage = () => {
    const { user } = useContext(AuthContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const features = [
    {
      icon: <ListTodo className="w-6 h-6" />,
      title: "Task Organization",
      description: "Organize tasks into To-Do, In Progress, and Done categories"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-time Updates",
      description: "Changes are saved instantly to keep your tasks in sync"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Track your productivity with visual task completion stats"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Welcome to Donezo
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              variants={itemVariants}
            >
              Your personal task management solution for enhanced productivity
            </motion.p>
            <motion.div 
              className="flex justify-center gap-4"
              variants={itemVariants}
            >
              {user?.email && (
              <NavLink 
                to="/taskHome"
                className="px-8 py-3 bg-sky-600 text-white rounded-full font-semibold 
                  hover:bg-sky-700 transition-colors flex items-center group"
              >
                Get Started
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </NavLink>
              )}

            {!user?.email && (
            <NavLink 
            to="/login"
            className="px-8 py-3 bg-sky-600 text-white rounded-full font-semibold 
              hover:bg-sky-700 transition-colors flex items-center group"
          >
            Login Here
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </NavLink>
            )}

            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 mb-16"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg 
                  hover:shadow-xl transition-shadow"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Section */}
          <motion.div 
            variants={itemVariants}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to boost your productivity?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of users who have transformed their task management with Donezo
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="inline-block"
            >
              <NavLink 
                to="/signup"
                className="px-8 py-3 bg-green-600 text-white rounded-full font-semibold 
                  hover:bg-green-700 transition-colors"
              >
                Create Free Account
              </NavLink>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;