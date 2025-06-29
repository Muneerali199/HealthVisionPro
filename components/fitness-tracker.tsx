"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity,
  Dumbbell,
  Timer,
  Target,
  Play,
  Pause,
  Square,
  Plus,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  Heart,
  Zap,
  Clock,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { toast } from 'sonner';

interface Workout {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
  duration: number; // in minutes
  caloriesBurned: number;
  date: Date;
  exercises: Exercise[];
  notes?: string;
}

interface Exercise {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility';
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number; // in seconds
  distance?: number; // in meters
  restTime?: number; // in seconds
}

interface FitnessGoal {
  id: string;
  title: string;
  type: 'weight_loss' | 'muscle_gain' | 'endurance' | 'strength' | 'flexibility';
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  progress: number;
}

interface WorkoutSession {
  id: string;
  workoutId: string;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  currentExercise: number;
  exercises: Exercise[];
}

export function FitnessTracker() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [fitnessGoals, setFitnessGoals] = useState<FitnessGoal[]>([]);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    type: 'strength' as const,
    exercises: [] as Exercise[]
  });

  const [weeklyStats, setWeeklyStats] = useState({
    totalWorkouts: 12,
    totalDuration: 480, // minutes
    caloriesBurned: 2400,
    averageIntensity: 7.5
  });

  const exerciseDatabase = [
    { name: 'Push-ups', type: 'strength', muscle: 'Chest, Triceps' },
    { name: 'Squats', type: 'strength', muscle: 'Legs, Glutes' },
    { name: 'Running', type: 'cardio', muscle: 'Full Body' },
    { name: 'Deadlifts', type: 'strength', muscle: 'Back, Legs' },
    { name: 'Plank', type: 'strength', muscle: 'Core' },
    { name: 'Burpees', type: 'cardio', muscle: 'Full Body' },
    { name: 'Pull-ups', type: 'strength', muscle: 'Back, Biceps' },
    { name: 'Cycling', type: 'cardio', muscle: 'Legs' },
    { name: 'Yoga Flow', type: 'flexibility', muscle: 'Full Body' },
    { name: 'Bench Press', type: 'strength', muscle: 'Chest' }
  ];

  useEffect(() => {
    loadFitnessData();
    
    // Timer for active workout session
    let interval: NodeJS.Timeout;
    if (isWorkoutActive) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorkoutActive]);

  const loadFitnessData = () => {
    // Sample fitness goals
    const goals: FitnessGoal[] = [
      {
        id: '1',
        title: 'Lose 5kg',
        type: 'weight_loss',
        target: 75,
        current: 78,
        unit: 'kg',
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        progress: 60
      },
      {
        id: '2',
        title: 'Bench Press 100kg',
        type: 'strength',
        target: 100,
        current: 85,
        unit: 'kg',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        progress: 85
      },
      {
        id: '3',
        title: 'Run 10km',
        type: 'endurance',
        target: 10,
        current: 7.5,
        unit: 'km',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        progress: 75
      }
    ];

    // Sample workouts
    const sampleWorkouts: Workout[] = [
      {
        id: '1',
        name: 'Upper Body Strength',
        type: 'strength',
        duration: 45,
        caloriesBurned: 320,
        date: new Date(),
        exercises: [
          { id: '1', name: 'Bench Press', type: 'strength', sets: 3, reps: 10, weight: 80 },
          { id: '2', name: 'Pull-ups', type: 'strength', sets: 3, reps: 8 },
          { id: '3', name: 'Push-ups', type: 'strength', sets: 3, reps: 15 }
        ]
      },
      {
        id: '2',
        name: 'Cardio Session',
        type: 'cardio',
        duration: 30,
        caloriesBurned: 280,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        exercises: [
          { id: '1', name: 'Running', type: 'cardio', duration: 1800, distance: 5000 }
        ]
      }
    ];

    setFitnessGoals(goals);
    setWorkouts(sampleWorkouts);
  };

  const startWorkout = (workout: Workout) => {
    const session: WorkoutSession = {
      id: Date.now().toString(),
      workoutId: workout.id,
      startTime: new Date(),
      isActive: true,
      currentExercise: 0,
      exercises: workout.exercises
    };

    setActiveSession(session);
    setIsWorkoutActive(true);
    setSessionTimer(0);
    toast.success(`Started ${workout.name}`);
  };

  const pauseWorkout = () => {
    setIsWorkoutActive(false);
    toast.info('Workout paused');
  };

  const resumeWorkout = () => {
    setIsWorkoutActive(true);
    toast.info('Workout resumed');
  };

  const endWorkout = () => {
    if (activeSession) {
      const completedWorkout: Workout = {
        id: Date.now().toString(),
        name: `Workout Session`,
        type: 'strength',
        duration: Math.floor(sessionTimer / 60),
        caloriesBurned: Math.floor(sessionTimer * 5), // Rough estimate
        date: new Date(),
        exercises: activeSession.exercises
      };

      setWorkouts(prev => [completedWorkout, ...prev]);
      setActiveSession(null);
      setIsWorkoutActive(false);
      setSessionTimer(0);
      toast.success('Workout completed!');
    }
  };

  const addExerciseToWorkout = (exerciseName: string) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseName,
      type: 'strength',
      sets: 3,
      reps: 10
    };

    setNewWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
  };

  const createWorkout = () => {
    if (!newWorkout.name || newWorkout.exercises.length === 0) {
      toast.error('Please add a workout name and at least one exercise');
      return;
    }

    const workout: Workout = {
      id: Date.now().toString(),
      name: newWorkout.name,
      type: newWorkout.type,
      duration: 0,
      caloriesBurned: 0,
      date: new Date(),
      exercises: newWorkout.exercises
    };

    setWorkouts(prev => [workout, ...prev]);
    setNewWorkout({ name: '', type: 'strength', exercises: [] });
    setIsAddingWorkout(false);
    toast.success('Workout created successfully!');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getGoalStatusColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-100 text-green-800';
    if (progress >= 70) return 'bg-blue-100 text-blue-800';
    if (progress >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const weeklyData = [
    { day: 'Mon', workouts: 2, calories: 450 },
    { day: 'Tue', workouts: 1, calories: 320 },
    { day: 'Wed', workouts: 0, calories: 0 },
    { day: 'Thu', workouts: 2, calories: 520 },
    { day: 'Fri', workouts: 1, calories: 380 },
    { day: 'Sat', workouts: 3, calories: 680 },
    { day: 'Sun', workouts: 1, calories: 290 }
  ];

  const fitnessRadarData = [
    { category: 'Strength', score: 85 },
    { category: 'Cardio', score: 75 },
    { category: 'Flexibility', score: 60 },
    { category: 'Endurance', score: 80 },
    { category: 'Balance', score: 70 },
    { category: 'Power', score: 78 }
  ];

  if (isWorkoutActive && activeSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white p-6">
        {/* Workout Session Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Active Workout</h1>
            <p className="text-blue-200">Exercise {activeSession.currentExercise + 1} of {activeSession.exercises.length}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{formatTime(sessionTimer)}</div>
            <p className="text-blue-200">Session Time</p>
          </div>
        </div>

        {/* Current Exercise */}
        <Card className="bg-white/10 backdrop-blur border-white/20 mb-8">
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                {activeSession.exercises[activeSession.currentExercise]?.name || 'Rest'}
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    {activeSession.exercises[activeSession.currentExercise]?.sets || 0}
                  </div>
                  <p className="text-sm text-blue-200">Sets</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {activeSession.exercises[activeSession.currentExercise]?.reps || 0}
                  </div>
                  <p className="text-sm text-green-200">Reps</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {activeSession.exercises[activeSession.currentExercise]?.weight || 0}kg
                  </div>
                  <p className="text-sm text-purple-200">Weight</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise List */}
        <Card className="bg-white/10 backdrop-blur border-white/20 mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Exercise List</h3>
            <div className="space-y-2">
              {activeSession.exercises.map((exercise, index) => (
                <div 
                  key={exercise.id}
                  className={`p-3 rounded-lg flex items-center justify-between ${
                    index === activeSession.currentExercise 
                      ? 'bg-blue-500/30 border border-blue-400' 
                      : 'bg-white/5'
                  }`}
                >
                  <span className="font-medium">{exercise.name}</span>
                  <span className="text-sm text-blue-200">
                    {exercise.sets}x{exercise.reps} {exercise.weight && `@ ${exercise.weight}kg`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setActiveSession(prev => prev ? {
              ...prev,
              currentExercise: Math.max(0, prev.currentExercise - 1)
            } : null)}
            disabled={activeSession.currentExercise === 0}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Previous
          </Button>
          
          <Button
            size="lg"
            onClick={isWorkoutActive ? pauseWorkout : resumeWorkout}
            className="bg-blue-600 hover:bg-blue-700 px-8"
          >
            {isWorkoutActive ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {isWorkoutActive ? 'Pause' : 'Resume'}
          </Button>
          
          <Button
            size="lg"
            onClick={() => setActiveSession(prev => prev ? {
              ...prev,
              currentExercise: Math.min(prev.exercises.length - 1, prev.currentExercise + 1)
            } : null)}
            disabled={activeSession.currentExercise === activeSession.exercises.length - 1}
            className="bg-green-600 hover:bg-green-700"
          >
            Next
          </Button>
          
          <Button
            size="lg"
            variant="destructive"
            onClick={endWorkout}
          >
            <Square className="w-5 h-5 mr-2" />
            End Workout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Dumbbell className="w-6 h-6 text-orange-600" />
                <span>Fitness Tracker</span>
              </CardTitle>
              <CardDescription>
                Track workouts, monitor progress, and achieve your fitness goals
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>{weeklyStats.totalWorkouts} workouts this week</span>
              </Badge>
              <Dialog open={isAddingWorkout} onOpenChange={setIsAddingWorkout}>
                <DialogTrigger asChild>
                  <Button className="health-gradient">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Workout
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Workout</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Workout Name</label>
                        <Input
                          value={newWorkout.name}
                          onChange={(e) => setNewWorkout(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Upper Body Strength"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Workout Type</label>
                        <Select 
                          value={newWorkout.type} 
                          onValueChange={(value: any) => setNewWorkout(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="strength">Strength Training</SelectItem>
                            <SelectItem value="cardio">Cardio</SelectItem>
                            <SelectItem value="flexibility">Flexibility</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Add Exercises</label>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {exerciseDatabase.map((exercise, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => addExerciseToWorkout(exercise.name)}
                            className="justify-start"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {exercise.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {newWorkout.exercises.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Selected Exercises</label>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {newWorkout.exercises.map((exercise, index) => (
                            <div key={exercise.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                              <span>{exercise.name}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setNewWorkout(prev => ({
                                  ...prev,
                                  exercises: prev.exercises.filter((_, i) => i !== index)
                                }))}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddingWorkout(false)}>
                        Cancel
                      </Button>
                      <Button onClick={createWorkout} className="health-gradient">
                        Create Workout
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Weekly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Workouts</p>
                <p className="text-2xl font-bold">{weeklyStats.totalWorkouts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Duration</p>
                <p className="text-2xl font-bold">{weeklyStats.totalDuration}m</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Calories</p>
                <p className="text-2xl font-bold">{weeklyStats.caloriesBurned}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Avg Intensity</p>
                <p className="text-2xl font-bold">{weeklyStats.averageIntensity}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workouts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="workouts">My Workouts</TabsTrigger>
          <TabsTrigger value="goals">Fitness Goals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="workouts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <Card key={workout.id} className="glass-effect health-card-hover">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{workout.name}</h3>
                      <Badge variant="outline" className="capitalize">
                        {workout.type}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span>{workout.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-slate-500" />
                        <span>{workout.caloriesBurned} cal</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Dumbbell className="w-4 h-4 text-slate-500" />
                        <span>{workout.exercises.length} exercises</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>{workout.date.toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Exercises:</p>
                      <div className="flex flex-wrap gap-1">
                        {workout.exercises.slice(0, 3).map((exercise, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {exercise.name}
                          </Badge>
                        ))}
                        {workout.exercises.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{workout.exercises.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full health-gradient"
                      onClick={() => startWorkout(workout)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Workout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fitnessGoals.map((goal) => {
              const daysLeft = Math.ceil((goal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              
              return (
                <Card key={goal.id} className="glass-effect">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{goal.title}</h3>
                        <Badge className={getGoalStatusColor(goal.progress)}>
                          {goal.progress}%
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{goal.current} / {goal.target} {goal.unit}</span>
                        </div>
                        <Progress value={goal.progress} className="h-3" />
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>{Math.round(goal.progress)}% complete</span>
                          <span>{daysLeft} days left</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Edit Goal
                        </Button>
                        <Button size="sm" className="flex-1 health-gradient">
                          Track Progress
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Workouts and calories burned this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="workouts" fill="#3b82f6" name="Workouts" />
                    <Bar dataKey="calories" fill="#10b981" name="Calories" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Fitness Profile</CardTitle>
                <CardDescription>Your overall fitness assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={fitnessRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Fitness Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>Your fitness journey over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p className="text-lg font-medium mb-2">Workout History Coming Soon</p>
                <p className="text-slate-600">Complete more workouts to see your fitness trends</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}