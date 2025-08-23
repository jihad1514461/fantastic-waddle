import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { useAdminFlowController } from '../controllers/adminFlowController';
import { Play, Pause, Square, SkipForward, RotateCcw } from 'lucide-react';

export const FlowSimulation: React.FC = () => {
  const {
    currentStory,
    simulation,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    stopSimulation,
    stepSimulation,
  } = useAdminFlowController();

  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoPlay && simulation?.status === 'running') {
      interval = setInterval(() => {
        stepSimulation();
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoPlay, simulation?.status, stepSimulation]);

  const handleStart = () => {
    if (currentStory) {
      startSimulation(currentStory.id);
      setAutoPlay(true);
    }
  };

  const handlePause = () => {
    pauseSimulation();
    setAutoPlay(false);
  };

  const handleResume = () => {
    resumeSimulation();
    setAutoPlay(true);
  };

  const handleStop = () => {
    stopSimulation();
    setAutoPlay(false);
  };

  const handleStep = () => {
    setAutoPlay(false);
    stepSimulation();
  };

  const getNodeStatus = (nodeId: string) => {
    if (!simulation) return 'inactive';
    
    const step = simulation.steps.find(s => s.nodeId === nodeId);
    if (!step) return 'inactive';
    
    return step.status;
  };

  const getProgressPercentage = () => {
    if (!simulation || !currentStory) return 0;
    
    const totalNodes = currentStory.nodes.length;
    const completedSteps = simulation.steps.filter(s => s.status === 'completed').length;
    
    return totalNodes > 0 ? (completedSteps / totalNodes) * 100 : 0;
  };

  if (!currentStory) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Story Selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Select a story to run simulation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Story Simulation: {currentStory.name}
            </h3>
            <div className="flex items-center space-x-2">
              {!simulation || simulation.status === 'completed' ? (
                <Button onClick={handleStart} className="flex items-center space-x-2">
                  <Play size={16} />
                  <span>Start</span>
                </Button>
              ) : simulation.status === 'running' ? (
                <Button onClick={handlePause} variant="outline" className="flex items-center space-x-2">
                  <Pause size={16} />
                  <span>Pause</span>
                </Button>
              ) : (
                <Button onClick={handleResume} className="flex items-center space-x-2">
                  <Play size={16} />
                  <span>Resume</span>
                </Button>
              )}
              
              <Button onClick={handleStep} variant="outline" className="flex items-center space-x-2">
                <SkipForward size={16} />
                <span>Step</span>
              </Button>
              
              <Button onClick={handleStop} variant="outline" className="flex items-center space-x-2">
                <Square size={16} />
                <span>Stop</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {simulation && (
            <div className="space-y-4">
              <ProgressBar
                label="Simulation Progress"
                value={getProgressPercentage()}
                color="blue"
                animated={simulation.status === 'running'}
              />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Status:</span>
                  <span className={`ml-2 font-medium ${
                    simulation.status === 'running' ? 'text-green-600' :
                    simulation.status === 'paused' ? 'text-yellow-600' :
                    simulation.status === 'completed' ? 'text-blue-600' :
                    'text-red-600'
                  }`}>
                    {simulation.status.charAt(0).toUpperCase() + simulation.status.slice(1)}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Current Node:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {simulation.currentNodeId ? 
                      currentStory.nodes.find(n => n.id === simulation.currentNodeId)?.data.name || 'Unknown'
                      : 'None'
                    }
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Steps:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {simulation.steps.length}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {Math.round((Date.now() - simulation.startTime) / 1000)}s
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Story Visualization */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Story Visualization
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentStory.nodes.map(node => {
              const status = getNodeStatus(node.id);
              return (
                <div
                  key={node.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    status === 'active' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900' :
                    status === 'completed' ? 'border-green-500 bg-green-50 dark:bg-green-900' :
                    status === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900' :
                    'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {node.data.name}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      node.type === 'intro' ? 'bg-green-100 text-green-800' :
                      node.type === 'script' ? 'bg-blue-100 text-blue-800' :
                      node.type === 'custom' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {node.type}
                    </span>
                  </div>
                  
                  {node.data.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {node.data.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${
                      status === 'active' ? 'text-blue-600' :
                      status === 'completed' ? 'text-green-600' :
                      status === 'error' ? 'text-red-600' :
                      'text-gray-500'
                    }`}>
                      {status === 'inactive' ? 'Waiting' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    
                    {node.connections.length > 0 && (
                      <span className="text-xs text-gray-500">
                        {node.connections.length} choice{node.connections.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Simulation Log */}
      {simulation && simulation.steps.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Simulation Log
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {simulation.steps.map((step, index) => {
                const node = currentStory.nodes.find(n => n.id === step.nodeId);
                return (
                  <div
                    key={`${step.nodeId}-${index}`}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-2 h-2 rounded-full ${
                        step.status === 'active' ? 'bg-blue-500' :
                        step.status === 'completed' ? 'bg-green-500' :
                        step.status === 'error' ? 'bg-red-500' :
                        'bg-gray-400'
                      }`} />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {node?.data.name || 'Unknown Node'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(step.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};