import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import * as Icons from 'lucide-react';
import { LandingFeature } from '../../config/modules.config';

interface FeatureCardProps {
  feature: LandingFeature;
  onButtonClick: (feature: LandingFeature) => void;
  delay?: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  onButtonClick,
  delay = 0,
}) => {
  const IconComponent = Icons[feature.icon as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${feature.gradient}`} />
        
        <CardHeader className="text-center pb-4">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg`}>
            <IconComponent size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {feature.title}
          </h3>
        </CardHeader>
        
        <CardContent className="text-center space-y-4 flex-1 flex flex-col">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
            {feature.description}
          </p>
          
          <Button
            onClick={() => onButtonClick(feature)}
            className={`w-full bg-gradient-to-r ${feature.gradient} hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-md`}
            disabled={!feature.enabled}
          >
            {feature.enabled ? feature.buttonText : 'Coming Soon'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};