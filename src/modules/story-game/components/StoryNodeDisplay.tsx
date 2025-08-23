import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../../components/ui/Card';
import { StoryNode } from '../../admin/types/flow.types';
import { BookOpen, Image as ImageIcon } from 'lucide-react';

interface StoryNodeDisplayProps {
  node: StoryNode;
  className?: string;
}

export const StoryNodeDisplay: React.FC<StoryNodeDisplayProps> = ({ node, className = '' }) => {
  const getNodeTypeColor = (type: StoryNode['type']) => {
    switch (type) {
      case 'intro': return 'from-green-500 to-emerald-500';
      case 'script': return 'from-blue-500 to-cyan-500';
      case 'end': return 'from-red-500 to-pink-500';
      case 'custom': return 'from-purple-500 to-indigo-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getNodeTypeLabel = (type: StoryNode['type']) => {
    switch (type) {
      case 'intro': return 'Story Beginning';
      case 'script': return 'Story Scene';
      case 'end': return 'Story Ending';
      case 'custom': return 'Special Scene';
      default: return 'Story Node';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <CardContent className="p-8">
          {/* Node Type Badge */}
          <div className="flex items-center justify-center mb-6">
            <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getNodeTypeColor(node.type)} text-white text-sm font-medium shadow-lg`}>
              <div className="flex items-center space-x-2">
                <BookOpen size={16} />
                <span>{getNodeTypeLabel(node.type)}</span>
              </div>
            </div>
          </div>

          {/* Story Image */}
          {node.data.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mb-6"
            >
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img
                  src={node.data.image}
                  alt={node.data.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const errorDiv = target.nextElementSibling as HTMLElement;
                    if (errorDiv) errorDiv.style.display = 'flex';
                  }}
                />
                <div 
                  className="hidden w-full h-64 bg-gray-100 dark:bg-gray-700 items-center justify-center rounded-xl"
                  style={{ display: 'none' }}
                >
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <ImageIcon size={48} className="mx-auto mb-2" />
                    <p>Image not available</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Story Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center leading-tight"
          >
            {node.data.name}
          </motion.h1>

          {/* Story Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
              {node.data.description}
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};