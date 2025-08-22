import React from 'react';
import { motion } from 'framer-motion';
import { FeatureCard } from '../components/landing/FeatureCard';
import { Button } from '../components/ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { APP_CONFIG } from '../config/app.config';
import { getEnabledLandingFeatures, LandingFeature } from '../config/modules.config';
import * as Icons from 'lucide-react';

interface LandingPageProps {
  onModuleSelect: (moduleId: string) => void;
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onModuleSelect, onGetStarted }) => {
  const features = getEnabledLandingFeatures();
  const LogoIcon = Icons[APP_CONFIG.branding.logo.icon as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;

  const handleFeatureClick = (feature: LandingFeature) => {
    if (feature.enabled && feature.moduleId) {
      onModuleSelect(feature.moduleId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <div className={`w-16 h-16 bg-gradient-to-r ${APP_CONFIG.branding.logo.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                <LogoIcon className="text-white" size={32} />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {APP_CONFIG.app.description.split(' ').slice(0, 2).join(' ')}{' '}
              <span className={`bg-gradient-to-r ${APP_CONFIG.branding.logo.gradient} bg-clip-text text-transparent`}>
                {APP_CONFIG.app.name}
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              {APP_CONFIG.app.description}. {APP_CONFIG.app.tagline}.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={onGetStarted}
                size="lg"
                className={`bg-gradient-to-r ${APP_CONFIG.branding.logo.gradient} hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg px-8`}
              >
                Get Started
                <ArrowRight size={20} className="ml-2" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 px-8"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover the tools and capabilities that make FlowApp the perfect choice for your business needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                onButtonClick={handleFeatureClick}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r ${APP_CONFIG.branding.logo.gradient}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of teams who have already revolutionized their productivity with FlowApp.
          </p>
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg px-8"
          >
            Start Your Journey
            <ArrowRight size={20} className="ml-2" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className={`w-8 h-8 bg-gradient-to-r ${APP_CONFIG.branding.logo.gradient} rounded-lg flex items-center justify-center`}>
                <LogoIcon className="text-white" size={20} />
              </div>
              <span className="font-bold text-white text-lg">{APP_CONFIG.app.name}</span>
            </div>
            
            <div className="text-gray-400 text-sm">
              © 2025 {APP_CONFIG.app.name}. {APP_CONFIG.app.tagline}.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};